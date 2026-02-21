from pydantic import BaseModel, EmailStr


class CheckoutSchema(BaseModel):
    name: str
    email: EmailStr
    address: str
    city: str
    state: str
    pincode: str
    phone: str
    payment_method: str  # "cash" or "upi"