from sqlalchemy import Column, Integer, String, ForeignKey
from app.database import Base


class Guest(Base):
    __tablename__ = "guests"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"))

    name = Column(String(100), nullable=False)
    contact_number = Column(String(20), nullable=False)
    email = Column(String(150), nullable=False)