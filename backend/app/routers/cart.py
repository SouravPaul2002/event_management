from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import SessionLocal
from app.models.cart import Cart
from app.models.product import Product
from app.models.cart_item import CartItem
from app.schemas.cart_schema import AddToCartSchema, UpdateQuantitySchema
from app.dependencies.role_checker import require_role

router = APIRouter(prefix="/cart", tags=["Cart"])


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


#Add to Cart
@router.post("/add")
def add_to_cart(
    data: AddToCartSchema,
    db: Session = Depends(get_db),
    current_user = Depends(require_role("user"))
):
    product = db.query(Product).filter(Product.id == data.product_id).first()

    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    cart = db.query(Cart).filter(Cart.user_id == current_user.id).first()

    if not cart:
        cart = Cart(user_id=current_user.id)
        db.add(cart)
        db.commit()
        db.refresh(cart)

    # Check if item already exists in cart
    cart_item = db.query(CartItem).filter(
        CartItem.cart_id == cart.id,
        CartItem.product_id == data.product_id
    ).first()

    if cart_item:
        cart_item.quantity += data.quantity
    else:
        cart_item = CartItem(
            cart_id=cart.id,
            product_id=data.product_id,
            quantity=data.quantity
        )
        db.add(cart_item)

    db.commit()

    return {"message": "Product added/updated in cart"}


@router.put("/update-quantity")
def update_quantity(
    data: UpdateQuantitySchema,
    db: Session = Depends(get_db),
    current_user = Depends(require_role("user"))
):
    cart = db.query(Cart).filter(Cart.user_id == current_user.id).first()
    if not cart:
        raise HTTPException(status_code=404, detail="Cart not found")

    item = db.query(CartItem).filter(
        CartItem.id == data.cart_item_id,
        CartItem.cart_id == cart.id
    ).first()

    if not item:
        raise HTTPException(status_code=404, detail="Item not found")

    if data.quantity <= 0:
        db.delete(item)
    else:
        item.quantity = data.quantity

    db.commit()
    return {"message": "Quantity updated"}


# Remove from Cart
@router.delete("/remove/{item_id}")
def remove_from_cart(
    item_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(require_role("user"))
):
    cart = db.query(Cart).filter(Cart.user_id == current_user.id).first()
    if not cart:
        raise HTTPException(status_code=404, detail="Cart not found")

    item = db.query(CartItem).filter(
        CartItem.id == item_id,
        CartItem.cart_id == cart.id
    ).first()

    if not item:
        raise HTTPException(status_code=404, detail="Item not found in your cart")

    db.delete(item)
    db.commit()

    return {"message": "Item removed from cart"}


#View Cart
@router.get("/my-cart")
def view_cart(
    db: Session = Depends(get_db),
    current_user = Depends(require_role("user"))
):
    cart = db.query(Cart).filter(Cart.user_id == current_user.id).first()

    if not cart:
        return {"items": [], "grand_total": 0}

    items = db.query(CartItem).filter(CartItem.cart_id == cart.id).all()

    result_items = []
    grand_total = 0

    for item in items:
        product = db.query(Product).filter(Product.id == item.product_id).first()
        item_total = float(product.price) * item.quantity
        grand_total += item_total

        result_items.append({
            "cart_item_id": item.id,
            "product_id": product.id,
            "product_name": product.name,
            "price": float(product.price),
            "quantity": item.quantity,
            "item_total": item_total
        })

    return {
        "items": result_items,
        "grand_total": grand_total
    }