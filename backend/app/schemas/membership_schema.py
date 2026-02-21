from pydantic import BaseModel
from datetime import date


class CreateMembershipSchema(BaseModel):
    user_id: int
    duration: str


class ExtendMembershipSchema(BaseModel):
    membership_id: int
    months: int = 6


class CancelMembershipSchema(BaseModel):
    membership_id: int