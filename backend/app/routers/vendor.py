from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import SessionLocal
from app.models.product import Product
from app.schemas.product_schema import CreateProductSchema, UpdateProductSchema
from app.dependencies.role_checker import require_role
from app.models.order import Order
from app.models.order_item import OrderItem

router = APIRouter(prefix="/vendor", tags=["Vendor"])


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# Add Product
@router.post("/add-product")
def add_product(
    product_data: CreateProductSchema,
    db: Session = Depends(get_db),
    current_user = Depends(require_role("vendor"))
):
    new_product = Product(
        vendor_id=current_user.id,
        name=product_data.name,
        description=product_data.description,
        price=product_data.price,
        stock=product_data.stock,
        image_url=product_data.image_url,
        status="available"
    )

    db.add(new_product)
    db.commit()
    db.refresh(new_product)

    return {"message": "Product added successfully"}


#View Products
@router.get("/my-products")
def get_my_products(
    db: Session = Depends(get_db),
    current_user = Depends(require_role("vendor"))
):
    products = db.query(Product).filter(
        Product.vendor_id == current_user.id
    ).all()

    return products


#Update Product
@router.put("/update-product/{product_id}")
def update_product(
    product_id: int,
    product_data: UpdateProductSchema,
    db: Session = Depends(get_db),
    current_user = Depends(require_role("vendor"))
):
    product = db.query(Product).filter(
        Product.id == product_id,
        Product.vendor_id == current_user.id
    ).first()

    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    for key, value in product_data.dict(exclude_unset=True).items():
        setattr(product, key, value)

    db.commit()

    return {"message": "Product updated successfully"}


#Delete Product
@router.delete("/delete-product/{product_id}")
def delete_product(
    product_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(require_role("vendor"))
):
    product = db.query(Product).filter(
        Product.id == product_id,
        Product.vendor_id == current_user.id
    ).first()

    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    db.delete(product)
    db.commit()

    return {"message": "Product deleted successfully"}

@router.get("/transactions")
def vendor_transactions(
    db: Session = Depends(get_db),
    current_user = Depends(require_role("vendor"))
):
    # Get vendor's products
    products = db.query(Product).filter(
        Product.vendor_id == current_user.id
    ).all()

    product_ids = [p.id for p in products]

    if not product_ids:
        return {"message": "No products found"}

    # Get order items containing vendor products
    order_items = db.query(OrderItem).filter(
        OrderItem.product_id.in_(product_ids)
    ).all()

    result = []

    for item in order_items:
        order = db.query(Order).filter(Order.id == item.order_id).first()
        product = db.query(Product).filter(Product.id == item.product_id).first()

        result.append({
            "order_item_id": item.id,
            "order_id": order.id,

            "customer_name": order.name,
            "customer_email": order.email,
            "customer_phone": order.phone,
            "address": order.address,
            "city": order.city,
            "state": order.state,
            "pincode": order.pincode,
            "payment_method": order.payment_method,

            "product_name": product.name,
            "quantity": item.quantity,
            "price": float(item.price),

            "shipping_status": item.shipping_status,
            "order_status": order.status,
            "order_date": order.created_at
        })

    return result

# Update Shipping Status
@router.put("/update-status/{order_item_id}")
def update_shipping_status(
    order_item_id: int,
    new_status: str,
    db: Session = Depends(get_db),
    current_user = Depends(require_role("vendor"))
):
    order_item = db.query(OrderItem).filter(
        OrderItem.id == order_item_id
    ).first()

    if not order_item:
        raise HTTPException(status_code=404, detail="Order item not found")

    # Verify that product belongs to this vendor
    product = db.query(Product).filter(
        Product.id == order_item.product_id,
        Product.vendor_id == current_user.id
    ).first()

    if not product:
        raise HTTPException(status_code=403, detail="Not authorized")

    if new_status not in [
        "received",
        "ready_for_shipping",
        "out_for_delivery"
    ]:
        raise HTTPException(status_code=400, detail="Invalid status")

    order_item.shipping_status = new_status
    db.commit()

    return {"message": "Shipping status updated successfully"}

# Toggle Product Status
@router.put("/toggle-status/{product_id}")
def toggle_product_status(
    product_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(require_role("vendor"))
):
    product = db.query(Product).filter(
        Product.id == product_id,
        Product.vendor_id == current_user.id
    ).first()

    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    if product.status == "available":
        product.status = "out_of_stock"
    else:
        product.status = "available"

    db.commit()

    return {
        "message": f"Product status updated to {product.status}",
        "new_status": product.status
    }