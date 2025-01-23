from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from ..database.database import get_db
from ..models.models import DrinkWishlistItem
from pydantic import BaseModel
from datetime import datetime

router = APIRouter()


class DrinkWishBase(BaseModel):
    drink_name: str
    brand: str | None = None
    description: str | None = None
    requested_from: str | None = None
    requested_quantity: float
    room_id: int


class DrinkWishCreate(DrinkWishBase):
    pass


class DrinkWishResponse(DrinkWishBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True


@router.get("/drink-wishlist/{room_id}", response_model=List[DrinkWishResponse])
def get_drink_wishes(
    room_id: int, skip: int = 0, limit: int = 100, db: Session = Depends(get_db)
):
    """Get all drink wishes for a specific room"""
    wishes = (
        db.query(DrinkWishlistItem)
        .filter(DrinkWishlistItem.room_id == room_id)
        .order_by(DrinkWishlistItem.created_at.desc())
        .offset(skip)
        .limit(limit)
        .all()
    )
    return wishes


@router.post("/drink-wishlist/", response_model=DrinkWishResponse)
def create_drink_wish(wish: DrinkWishCreate, db: Session = Depends(get_db)):
    """Create a new drink wish"""
    db_wish = DrinkWishlistItem(**wish.model_dump())
    try:
        db.add(db_wish)
        db.commit()
        db.refresh(db_wish)
        return db_wish
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=str(e))


@router.delete("/drink-wishlist/{room_id}/{wish_id}")
def delete_drink_wish(room_id: int, wish_id: int, db: Session = Depends(get_db)):
    """Delete a drink wish"""
    db_wish = (
        db.query(DrinkWishlistItem)
        .filter(DrinkWishlistItem.id == wish_id, DrinkWishlistItem.room_id == room_id)
        .first()
    )
    if not db_wish:
        raise HTTPException(status_code=404, detail="Drink wish not found")

    try:
        db.delete(db_wish)
        db.commit()
        return {"message": "Drink wish deleted successfully"}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=str(e))
