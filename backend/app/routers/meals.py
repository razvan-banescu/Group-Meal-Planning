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


@router.post("/dishes/", response_model=DishResponse)
def create_dish(dish: DishCreate, db: Session = Depends(get_db)):
    try:
        print(f"Received dish data: {dish.model_dump()}")  # Debug log
        db_dish = models.Dish(**dish.model_dump())
        db.add(db_dish)
        db.commit()
        db.refresh(db_dish)
        return db_dish
    except Exception as e:
        print(f"Error creating dish: {str(e)}")  # Debug log
        if "violates foreign key constraint" in str(e):
            raise HTTPException(
                status_code=400,
                detail="Invalid member_id. Please select a valid family affiliation.",
            )
        if "validation error" in str(e).lower():
            raise HTTPException(
                status_code=422,
                detail=f"Validation error: {str(e)}",
            )
        raise HTTPException(
            status_code=400,
            detail=f"Error creating dish: {str(e)}",
        )


@router.get("/dishes/", response_model=List[DishResponse])
def get_dishes(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    dishes = db.query(models.Dish).offset(skip).limit(limit).all()
    return dishes


@router.get("/dishes/{dish_id}", response_model=DishResponse)
def get_dish(dish_id: int, db: Session = Depends(get_db)):
    dish = db.query(models.Dish).filter(models.Dish.id == dish_id).first()
    if dish is None:
        raise HTTPException(status_code=404, detail="Dish not found")
    return dish


@router.put("/dishes/{dish_id}", response_model=DishResponse)
def update_dish(dish_id: int, dish: DishBase, db: Session = Depends(get_db)):
    db_dish = db.query(models.Dish).filter(models.Dish.id == dish_id).first()
    if db_dish is None:
        raise HTTPException(status_code=404, detail="Dish not found")

    for key, value in dish.model_dump().items():
        setattr(db_dish, key, value)

    db.commit()
    db.refresh(db_dish)
    return db_dish


@router.delete("/dishes/{dish_id}")
def delete_dish(dish_id: int, db: Session = Depends(get_db)):
    db_dish = db.query(models.Dish).filter(models.Dish.id == dish_id).first()
    if db_dish is None:
        raise HTTPException(status_code=404, detail="Dish not found")

    db.delete(db_dish)
    db.commit()
    return {"message": "Dish deleted successfully"}
