from sqlalchemy import Column, Integer, String, Float, ForeignKey
from sqlalchemy.orm import relationship
from ..database.database import Base


class Family(Base):
    __tablename__ = "families"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True)
    members = relationship("Member", back_populates="family")


class Member(Base):
    __tablename__ = "members"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    family_id = Column(Integer, ForeignKey("families.id"))
    family = relationship("Family", back_populates="members")
    dishes = relationship("Dish", back_populates="member")


class Dish(Base):
    __tablename__ = "dishes"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    quantity = Column(Float)  # in grams
    member_id = Column(Integer, ForeignKey("members.id"))
    member = relationship("Member", back_populates="dishes")
    fullName = Column(String, index=True)
    meal_type = Column(String, index=True)  # Entree, Main Course, Desert


class WishlistItem(Base):
    __tablename__ = "wishlist_items"

    id = Column(Integer, primary_key=True, index=True)
    dish_name = Column(String, index=True)
    requested_quantity = Column(Float)  # in grams
    notes = Column(String, nullable=True)
