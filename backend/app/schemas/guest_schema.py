from pydantic import BaseModel, EmailStr


class GuestCreateSchema(BaseModel):
    name: str
    contact_number: str
    email: EmailStr


class GuestUpdateSchema(BaseModel):
    name: str | None = None
    contact_number: str | None = None
    email: EmailStr | None = None