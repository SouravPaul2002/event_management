from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import SessionLocal
from app.models.guest import Guest
from app.schemas.guest_schema import GuestCreateSchema, GuestUpdateSchema
from app.dependencies.role_checker import require_role

router = APIRouter(prefix="/guest", tags=["Guest"])


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# Add Guest
@router.post("/add")
def add_guest(
    guest_data: GuestCreateSchema,
    db: Session = Depends(get_db),
    current_user = Depends(require_role("user"))
):
    guest = Guest(
        user_id=current_user.id,
        name=guest_data.name,
        contact_number=guest_data.contact_number,
        email=guest_data.email
    )

    db.add(guest)
    db.commit()
    db.refresh(guest)

    return {"message": "Guest added successfully"}


# View Guest List
@router.get("/my-guests")
def view_guests(
    db: Session = Depends(get_db),
    current_user = Depends(require_role("user"))
):
    guests = db.query(Guest).filter(
        Guest.user_id == current_user.id
    ).all()

    return guests


# Update Guest
@router.put("/update/{guest_id}")
def update_guest(
    guest_id: int,
    guest_data: GuestUpdateSchema,
    db: Session = Depends(get_db),
    current_user = Depends(require_role("user"))
):
    guest = db.query(Guest).filter(
        Guest.id == guest_id,
        Guest.user_id == current_user.id
    ).first()

    if not guest:
        raise HTTPException(status_code=404, detail="Guest not found")

    for key, value in guest_data.dict(exclude_unset=True).items():
        setattr(guest, key, value)

    db.commit()

    return {"message": "Guest updated successfully"}


# Delete Guest
@router.delete("/delete/{guest_id}")
def delete_guest(
    guest_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(require_role("user"))
):
    guest = db.query(Guest).filter(
        Guest.id == guest_id,
        Guest.user_id == current_user.id
    ).first()

    if not guest:
        raise HTTPException(status_code=404, detail="Guest not found")

    db.delete(guest)
    db.commit()

    return {"message": "Guest deleted successfully"}