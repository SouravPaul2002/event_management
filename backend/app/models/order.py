from sqlalchemy import Column, Integer, ForeignKey, DECIMAL, Enum, DateTime, String
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.database import Base
import enum


class OrderStatus(str, enum.Enum):
    pending = "pending"
    completed = "completed"
    cancelled = "cancelled"


class Order(Base):
    __tablename__ = "orders"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"))
    total_amount = Column(DECIMAL(10, 2), nullable=False)
    status = Column(Enum(OrderStatus), default=OrderStatus.pending)
    
    # Checkout details
    name = Column(String(100), nullable=True)
    email = Column(String(150), nullable=True)
    address = Column(String(255), nullable=True)
    city = Column(String(100), nullable=True)
    state = Column(String(100), nullable=True)
    pincode = Column(String(20), nullable=True)
    phone = Column(String(20), nullable=True)
    payment_method = Column(String(50), nullable=True)

    created_at = Column(DateTime(timezone=True), server_default=func.now())

    user = relationship("User")