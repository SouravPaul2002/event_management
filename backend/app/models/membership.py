from sqlalchemy import Column, Integer, ForeignKey, Enum, Date
from sqlalchemy.orm import relationship
from app.database import Base
import enum


class MembershipStatus(str, enum.Enum):
    active = "active"
    cancelled = "cancelled"


class MembershipDuration(str, enum.Enum):
    six_months = "6m"
    one_year = "1y"
    two_years = "2y"


class Membership(Base):
    __tablename__ = "memberships"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"))
    duration = Column(Enum(MembershipDuration), default=MembershipDuration.six_months)
    start_date = Column(Date, nullable=False)
    end_date = Column(Date, nullable=False)
    status = Column(Enum(MembershipStatus), default=MembershipStatus.active)

    user = relationship("User")