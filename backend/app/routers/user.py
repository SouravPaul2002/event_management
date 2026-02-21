from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import SessionLocal
from app.models.product import Product
from app.models.user import User
from app.dependencies.role_checker import require_role
from typing import Optional

router = APIRouter(prefix="/user", tags=["User"])


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# View Vendors
@router.get("/vendors")
def get_vendors(
    category: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user = Depends(require_role("user"))
):
    query = db.query(User).filter(User.role == "vendor")
    if category:
        query = query.filter(User.category == category)
    
    return query.all()


# View All Available Products with Filtering
@router.get("/products")
def view_products(
    vendor_id: Optional[int] = None,
    category: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user = Depends(require_role("user"))
):
    query = db.query(Product).filter(Product.status == "available")

    if vendor_id:
        query = query.filter(Product.vendor_id == vendor_id)
    
    if category:
        # Join with User to filter by vendor category
        query = query.join(User, Product.vendor_id == User.id).filter(User.category == category)

    return query.all()