from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from ..database.database import get_db
from ..models.models import Drink, DrinkCategory
from pydantic import BaseModel
from datetime import datetime

router = APIRouter()


class DrinkBase(BaseModel):
    fullName: str
    category: str
    other_category: str | None = None
    brand: str | None = None
    quantity: float
    member_id: int
    room_id: int


class DrinkCreate(DrinkBase):
    pass


class DrinkResponse(DrinkBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True


@router.get("/drinks/{room_id}", response_model=List[DrinkResponse])
def get_drinks(
    room_id: int, skip: int = 0, limit: int = 100, db: Session = Depends(get_db)
):
    """Get all drinks for a specific room"""
    drinks = (
        db.query(Drink)
        .filter(Drink.room_id == room_id)
        .order_by(Drink.created_at.desc())
        .offset(skip)
        .limit(limit)
        .all()
    )
    return drinks


@router.post("/drinks/", response_model=DrinkResponse)
def create_drink(drink: DrinkCreate, db: Session = Depends(get_db)):
    """Create a new drink"""
    # Validate category
    if drink.category not in [cat.value for cat in DrinkCategory]:
        raise HTTPException(status_code=400, detail="Invalid drink category")

    # If category is "Other", other_category must be provided
    if drink.category == DrinkCategory.other.value and not drink.other_category:
        raise HTTPException(
            status_code=400, detail="Other category description is required"
        )

    db_drink = Drink(**drink.model_dump())
    try:
        db.add(db_drink)
        db.commit()
        db.refresh(db_drink)
        return db_drink
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=str(e))


@router.put("/drinks/{room_id}/{drink_id}", response_model=DrinkResponse)
def update_drink(
    room_id: int, drink_id: int, drink: DrinkBase, db: Session = Depends(get_db)
):
    """Update a drink"""
    db_drink = (
        db.query(Drink).filter(Drink.id == drink_id, Drink.room_id == room_id).first()
    )
    if not db_drink:
        raise HTTPException(status_code=404, detail="Drink not found")

    # Validate category
    if drink.category not in [cat.value for cat in DrinkCategory]:
        raise HTTPException(status_code=400, detail="Invalid drink category")

    # If category is "Other", other_category must be provided
    if drink.category == DrinkCategory.other.value and not drink.other_category:
        raise HTTPException(
            status_code=400, detail="Other category description is required"
        )

    for key, value in drink.model_dump().items():
        setattr(db_drink, key, value)

    try:
        db.commit()
        db.refresh(db_drink)
        return db_drink
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=str(e))


@router.delete("/drinks/{room_id}/{drink_id}")
def delete_drink(room_id: int, drink_id: int, db: Session = Depends(get_db)):
    """Delete a drink"""
    db_drink = (
        db.query(Drink).filter(Drink.id == drink_id, Drink.room_id == room_id).first()
    )
    if not db_drink:
        raise HTTPException(status_code=404, detail="Drink not found")

    try:
        db.delete(db_drink)
        db.commit()
        return {"message": "Drink deleted successfully"}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/drinks/categories")
def get_drink_categories():
    """Get all available drink categories"""
    return [{"id": i, "name": cat.value} for i, cat in enumerate(DrinkCategory, 1)]
