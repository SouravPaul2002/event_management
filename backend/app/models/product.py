from sqlalchemy import Column, Integer, String, ForeignKey, Enum, DECIMAL, DateTime
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.database import Base
import enum


class ProductStatus(str, enum.Enum):
    available = "available"
    out_of_stock = "out_of_stock"


class Product(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, index=True)

    vendor_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"))

    name = Column(String(150), nullable=False)
    description = Column(String(500))

    price = Column(DECIMAL(10, 2), nullable=False)
    stock = Column(Integer, default=0)

    status = Column(Enum(ProductStatus), default=ProductStatus.available)

    image_url = Column(String(255), nullable=True)

    created_at = Column(DateTime(timezone=True), server_default=func.now())

    vendor = relationship("User")