from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import date, timedelta
from dateutil.relativedelta import relativedelta

from app.database import SessionLocal
from app.models.membership import Membership
from app.models.user import User
from app.models.order import Order
from app.schemas.membership_schema import (
    CreateMembershipSchema,
    ExtendMembershipSchema,
    CancelMembershipSchema
)
from app.schemas.auth_schema import SignupSchema
from app.utils.security import hash_password
from app.dependencies.role_checker import require_role

router = APIRouter(prefix="/admin", tags=["Admin"])


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# Create Membership (Admin Only)
@router.post("/create-membership")
def create_membership(
    data: CreateMembershipSchema,
    db: Session = Depends(get_db),
    current_user = Depends(require_role("admin"))
):
    user = db.query(User).filter(User.id == data.user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    start_date = date.today()

    if data.duration == "6m":
        end_date = start_date + relativedelta(months=6)
    elif data.duration == "1y":
        end_date = start_date + relativedelta(years=1)
    elif data.duration == "2y":
        end_date = start_date + relativedelta(years=2)
    else:
        raise HTTPException(status_code=400, detail="Invalid duration")

    membership = Membership(
        user_id=data.user_id,
        duration=data.duration,
        start_date=start_date,
        end_date=end_date,
        status="active"
    )

    db.add(membership)
    db.commit()
    db.refresh(membership)

    return {"message": "Membership created successfully"}


# Extend Membership (Default 6 months)
@router.put("/extend-membership")
def extend_membership(
    data: ExtendMembershipSchema,
    db: Session = Depends(get_db),
    current_user = Depends(require_role("admin"))
):
    membership = db.query(Membership).filter(
        Membership.id == data.membership_id
    ).first()

    if not membership:
        raise HTTPException(status_code=404, detail="Membership not found")

    if membership.status == "cancelled":
        raise HTTPException(
            status_code=400, 
            detail="Cannot extend a cancelled membership"
        )

    membership.end_date = membership.end_date + relativedelta(months=data.months)

    db.commit()

    return {"message": "Membership extended successfully"}


# Cancel Membership
@router.put("/cancel-membership")
def cancel_membership(
    data: CancelMembershipSchema,
    db: Session = Depends(get_db),
    current_user = Depends(require_role("admin"))
):
    membership = db.query(Membership).filter(
        Membership.id == data.membership_id
    ).first()

    if not membership:
        raise HTTPException(status_code=404, detail="Membership not found")

    membership.status = "cancelled"
    db.commit()

    return {"message": "Membership cancelled successfully"}

@router.get("/memberships")
def get_all_memberships(
    db: Session = Depends(get_db),
    current_user = Depends(require_role("admin"))
):
    memberships = db.query(Membership).all()
    result = []
    for m in memberships:
        user = db.query(User).filter(User.id == m.user_id).first()
        result.append({
            "id": m.id,
            "user_id": m.user_id,
            "user_name": user.name if user else "Unknown",
            "duration": m.duration,
            "start_date": m.start_date,
            "end_date": m.end_date,
            "status": m.status
        })
    return result

# view all users
@router.get("/users")
def get_all_users(
    db: Session = Depends(get_db),
    current_user = Depends(require_role("admin"))
):
    users = db.query(User).filter(User.role == "user").all()
    return users

#update users
@router.put("/update-user/{user_id}")
def update_user(
    user_id: int,
    name: str = None,
    db: Session = Depends(get_db),
    current_user = Depends(require_role("admin"))
):
    user = db.query(User).filter(User.id == user_id, User.role == "user").first()

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    if name:
        user.name = name

    db.commit()

    return {"message": "User updated successfully"}

#delete users
@router.delete("/delete-user/{user_id}")
def delete_user(
    user_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(require_role("admin"))
):
    user = db.query(User).filter(User.id == user_id, User.role == "user").first()

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    db.delete(user)
    db.commit()

    return {"message": "User deleted successfully"}

#view all vendors
@router.get("/vendors")
def get_all_vendors(
    db: Session = Depends(get_db),
    current_user = Depends(require_role("admin"))
):
    vendors = db.query(User).filter(User.role == "vendor").all()
    return vendors

#update all vendors
@router.put("/update-vendor/{vendor_id}")
def update_vendor(
    vendor_id: int,
    name: str = None,
    category: str = None,
    db: Session = Depends(get_db),
    current_user = Depends(require_role("admin"))
):
    vendor = db.query(User).filter(
        User.id == vendor_id,
        User.role == "vendor"
    ).first()

    if not vendor:
        raise HTTPException(status_code=404, detail="Vendor not found")

    if name:
        vendor.name = name
    
    if category:
        allowed_categories = ["catering", "florist", "decoration", "lighting"]
        if category not in allowed_categories:
            raise HTTPException(status_code=400, detail="Invalid category")
        vendor.category = category

    db.commit()

    return {"message": "Vendor updated successfully"}

#delete vendors
@router.delete("/delete-vendor/{vendor_id}")
def delete_vendor(
    vendor_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(require_role("admin"))
):
    vendor = db.query(User).filter(
        User.id == vendor_id,
        User.role == "vendor"
    ).first()

    if not vendor:
        raise HTTPException(status_code=404, detail="Vendor not found")

    db.delete(vendor)
    db.commit()

    return {"message": "Vendor deleted successfully"}


#view all transactions
@router.get("/transactions")
def view_all_transactions(
    db: Session = Depends(get_db),
    current_user = Depends(require_role("admin"))
):
    orders = db.query(Order).all()
    return orders

#transaction report
@router.get("/transaction-report")
def transaction_report(
    db: Session = Depends(get_db),
    current_user = Depends(require_role("admin"))
):
    orders = db.query(Order).all()

    report = []
    for order in orders:
        report.append({
            "order_id": order.id,
            "user_id": order.user_id,
            "total_amount": float(order.total_amount),
            "status": order.status,
            "created_at": order.created_at
        })

    return report

#sales summary 
from sqlalchemy import func

@router.get("/sales-summary")
def sales_summary(
    db: Session = Depends(get_db),
    current_user = Depends(require_role("admin"))
):
    total_orders = db.query(func.count(Order.id)).scalar()
    total_revenue = db.query(func.sum(Order.total_amount)).scalar()

    return {
        "total_orders": total_orders,
        "total_revenue": float(total_revenue) if total_revenue else 0
    }

# Add User (Admin Only)
@router.post("/add-user")
def add_user(
    user_data: SignupSchema,
    db: Session = Depends(get_db),
    current_user = Depends(require_role("admin"))
):
    existing_user = db.query(User).filter(User.email == user_data.email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    hashed_pwd = hash_password(user_data.passwords)

    new_user = User(
        name=user_data.name,
        email=user_data.email,
        passwords=hashed_pwd,
        role="user" 
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return {"message": "User created successfully by admin"}

# Add Vendor (Admin Only)
@router.post("/add-vendor")
def add_vendor(
    user_data: SignupSchema,
    db: Session = Depends(get_db),
    current_user = Depends(require_role("admin"))
):
    existing_user = db.query(User).filter(User.email == user_data.email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    if not user_data.category:
        raise HTTPException(status_code=400, detail="Category is required for vendor")

    hashed_pwd = hash_password(user_data.passwords)

    new_user = User(
        name=user_data.name,
        email=user_data.email,
        passwords=hashed_pwd,
        role="vendor",
        category=user_data.category
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return {"message": "Vendor created successfully by admin"}
