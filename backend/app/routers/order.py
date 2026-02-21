from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import SessionLocal
from app.models.cart import Cart
from app.models.cart_item import CartItem
from app.models.order import Order
from app.models.order_item import OrderItem
from app.models.product import Product
from app.dependencies.role_checker import require_role
from app.schemas.checkout_schema import CheckoutSchema

router = APIRouter(prefix="/orders", tags=["Orders"])


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.post("/checkout")
def checkout(
    checkout_data: CheckoutSchema,
    db: Session = Depends(get_db),
    current_user = Depends(require_role("user"))
):
    cart = db.query(Cart).filter(Cart.user_id == current_user.id).first()

    if not cart:
        raise HTTPException(status_code=400, detail="Cart is empty")

    cart_items = db.query(CartItem).filter(
        CartItem.cart_id == cart.id
    ).all()

    if not cart_items:
        raise HTTPException(status_code=400, detail="Cart is empty")

    total = 0

    for item in cart_items:
        product = db.query(Product).filter(Product.id == item.product_id).first()
        if not product:
            raise HTTPException(status_code=404, detail="Product not found")
        if product.stock < item.quantity:
            raise HTTPException(
                status_code=400, 
                detail=f"Insufficient stock for {product.name}. Available: {product.stock}"
            )
        total += float(product.price) * item.quantity

    order = Order(
        user_id=current_user.id,
        total_amount=total,
        status="pending",

        # Checkout details
        name=checkout_data.name,
        email=checkout_data.email,
        address=checkout_data.address,
        city=checkout_data.city,
        state=checkout_data.state,
        pincode=checkout_data.pincode,
        phone=checkout_data.phone,
        payment_method=checkout_data.payment_method
    )

    db.add(order)
    db.commit()
    db.refresh(order)

    for item in cart_items:
        product = db.query(Product).filter(Product.id == item.product_id).first()

        # Reduce stock
        product.stock -= item.quantity

        order_item = OrderItem(
            order_id=order.id,
            product_id=product.id,
            quantity=item.quantity,
            price=product.price,
            shipping_status="received"  
        )

        db.add(order_item)

    db.commit()

    # Clear cart
    for item in cart_items:
        db.delete(item)

    db.commit()

    return {
        "message": "Order placed successfully",
        "order_id": order.id
    }

@router.get("/my-orders")
def my_orders(
    db: Session = Depends(get_db),
    current_user = Depends(require_role("user"))
):
    orders = db.query(Order).filter(
        Order.user_id == current_user.id
    ).all()

    result = []

    for order in orders:
        items = db.query(OrderItem).filter(
            OrderItem.order_id == order.id
        ).all()

        order_data = {
            "order_id": order.id,
            "total_amount": float(order.total_amount),
            "order_status": order.status,
            "payment_method": order.payment_method,
            "created_at": order.created_at,
            "items": []
        }

        for item in items:
            product = db.query(Product).filter(Product.id == item.product_id).first()

            order_data["items"].append({
                "product_name": product.name,
                "quantity": item.quantity,
                "price": float(item.price),
                "shipping_status": item.shipping_status
            })

        result.append(order_data)

    return result

