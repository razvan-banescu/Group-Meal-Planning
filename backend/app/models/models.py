from sqlalchemy import Column, Integer, String, Float, ForeignKey, JSON, Enum, DateTime
from sqlalchemy.orm import relationship
from ..database.database import Base
import enum
from datetime import datetime


class RoomStatus(str, enum.Enum):
    pending = "pending"
    active = "active"


class Room(Base):
    __tablename__ = "rooms"

    id = Column(Integer, primary_key=True, index=True)
    seed = Column(String, unique=True, index=True)
    status = Column(String, default=RoomStatus.pending)
    settings = Column(JSON, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    dishes = relationship("Dish", back_populates="room", cascade="all, delete-orphan")
    families = relationship(
        "Family", back_populates="room", cascade="all, delete-orphan"
    )
    wishlist_items = relationship(
        "WishlistItem", back_populates="room", cascade="all, delete-orphan"
    )


class Family(Base):
    __tablename__ = "families"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    room_id = Column(Integer, ForeignKey("rooms.id", ondelete="CASCADE"))

    # Relationships
    room = relationship("Room", back_populates="families")
    members = relationship(
        "Member", back_populates="family", cascade="all, delete-orphan"
    )


class Member(Base):
    __tablename__ = "members"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    family_id = Column(Integer, ForeignKey("families.id", ondelete="CASCADE"))

    # Relationships
    family = relationship("Family", back_populates="members")
    dishes = relationship("Dish", back_populates="member", cascade="all, delete-orphan")


class Dish(Base):
    __tablename__ = "dishes"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    quantity = Column(Float)
    member_id = Column(Integer, ForeignKey("members.id", ondelete="CASCADE"))
    room_id = Column(Integer, ForeignKey("rooms.id", ondelete="CASCADE"))
    fullName = Column(String, index=True)
    meal_type = Column(String, index=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    member = relationship("Member", back_populates="dishes")
    room = relationship("Room", back_populates="dishes")


class WishlistItem(Base):
    __tablename__ = "wishlist_items"

    id = Column(Integer, primary_key=True, index=True)
    dish_name = Column(String, index=True)
    requested_quantity = Column(Float)
    notes = Column(String, nullable=True)
    room_id = Column(Integer, ForeignKey("rooms.id", ondelete="CASCADE"))
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    room = relationship("Room", back_populates="wishlist_items")
