from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from ..database.database import get_db
from ..models import models
from ..config import MEAL_TYPES
from pydantic import BaseModel, ConfigDict

router = APIRouter()


class DishBase(BaseModel):
    name: str
    quantity: float
    fullName: str
    meal_type: str
    room_id: int


class DishCreate(DishBase):
    member_id: int


class DishResponse(DishBase):
    id: int
    member_id: int
    model_config = ConfigDict(from_attributes=True)


class MealType(BaseModel):
    id: int
    name: str


@router.get("/meal-types/", response_model=List[MealType])
def get_meal_types():
    """Get the list of available meal types"""
    return MEAL_TYPES


@router.post("/dishes/{room_id}", response_model=DishResponse)
def create_dish(room_id: int, dish: DishCreate, db: Session = Depends(get_db)):
    """Create a new dish for a specific room"""
    # Verify room exists and is active
    room = db.query(models.Room).filter(models.Room.id == room_id).first()
    if not room:
        raise HTTPException(status_code=404, detail="Room not found")
    if room.status != models.RoomStatus.active:
        raise HTTPException(status_code=400, detail="Room is not active")

    try:
        # Validate member_id is a valid 1-based index into the families array
        if (
            not room.settings
            or "families" not in room.settings
            or dish.member_id <= 0
            or dish.member_id > len(room.settings["families"])
        ):
            raise HTTPException(status_code=400, detail="Invalid family selection")

        # Get the family name using member_id as 1-based index
        family_name = room.settings["families"][dish.member_id - 1]

        # Get or create the family
        family = (
            db.query(models.Family)
            .filter(models.Family.name == family_name, models.Family.room_id == room_id)
            .first()
        )
        if not family:
            family = models.Family(name=family_name, room_id=room_id)
            db.add(family)
            db.flush()

        # Get or create the member
        member = (
            db.query(models.Member)
            .filter(
                models.Member.name == dish.fullName,
                models.Member.family_id == family.id,
            )
            .first()
        )
        if not member:
            member = models.Member(name=dish.fullName, family_id=family.id)
            db.add(member)
            db.flush()

        # Create the dish with the member_id from the database
        db_dish = models.Dish(
            name=dish.name,
            quantity=dish.quantity,
            member_id=dish.member_id,  # Keep using the 1-based index from room settings
            room_id=room_id,
            meal_type=dish.meal_type,
            fullName=dish.fullName,
        )
        db.add(db_dish)
        db.commit()
        db.refresh(db_dish)
        return db_dish
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/dishes/{room_id}", response_model=List[DishResponse])
def get_dishes(
    room_id: int, skip: int = 0, limit: int = 100, db: Session = Depends(get_db)
):
    # Verify room exists
    room = db.query(models.Room).filter(models.Room.id == room_id).first()
    if not room:
        raise HTTPException(status_code=404, detail="Room not found")

    dishes = (
        db.query(models.Dish)
        .filter(models.Dish.room_id == room_id)
        .order_by(models.Dish.created_at.desc())
        .offset(skip)
        .limit(limit)
        .all()
    )
    return dishes


@router.put("/dishes/{room_id}/{dish_id}", response_model=DishResponse)
def update_dish(
    room_id: int, dish_id: int, dish: DishBase, db: Session = Depends(get_db)
):
    # Verify room exists and is active
    room = db.query(models.Room).filter(models.Room.id == room_id).first()
    if not room:
        raise HTTPException(status_code=404, detail="Room not found")
    if room.status != models.RoomStatus.active:
        raise HTTPException(status_code=400, detail="Room is not active")

    db_dish = (
        db.query(models.Dish)
        .filter(models.Dish.id == dish_id, models.Dish.room_id == room_id)
        .first()
    )
    if not db_dish:
        raise HTTPException(status_code=404, detail="Dish not found in this room")

    for key, value in dish.model_dump().items():
        setattr(db_dish, key, value)

    try:
        db.commit()
        db.refresh(db_dish)
        return db_dish
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=str(e))


@router.delete("/dishes/{room_id}/{dish_id}")
def delete_dish(room_id: int, dish_id: int, db: Session = Depends(get_db)):
    # Verify room exists and is active
    room = db.query(models.Room).filter(models.Room.id == room_id).first()
    if not room:
        raise HTTPException(status_code=404, detail="Room not found")
    if room.status != models.RoomStatus.active:
        raise HTTPException(status_code=400, detail="Room is not active")

    db_dish = (
        db.query(models.Dish)
        .filter(models.Dish.id == dish_id, models.Dish.room_id == room_id)
        .first()
    )
    if not db_dish:
        raise HTTPException(status_code=404, detail="Dish not found in this room")

    try:
        db.delete(db_dish)
        db.commit()
        return {"message": "Dish deleted successfully"}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=str(e))
