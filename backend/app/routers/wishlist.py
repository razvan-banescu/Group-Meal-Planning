from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from ..database.database import get_db
from ..models import models
from pydantic import BaseModel, ConfigDict

router = APIRouter()


class WishlistItemBase(BaseModel):
    dish_name: str
    requested_quantity: float = 0
    notes: str | None = None


class WishlistItemCreate(WishlistItemBase):
    pass


class WishlistItemResponse(WishlistItemBase):
    id: int
    model_config = ConfigDict(from_attributes=True)


@router.post("/wishlist/", response_model=WishlistItemResponse)
def create_wishlist_item(item: WishlistItemCreate, db: Session = Depends(get_db)):
    try:
        db_item = models.WishlistItem(**item.model_dump())
        db.add(db_item)
        db.commit()
        db.refresh(db_item)
        return db_item
    except Exception as e:
        print(f"Error creating wishlist item: {str(e)}")
        raise HTTPException(
            status_code=400,
            detail=f"Error creating wishlist item: {str(e)}",
        )


@router.get("/wishlist/", response_model=List[WishlistItemResponse])
def get_wishlist_items(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    items = db.query(models.WishlistItem).offset(skip).limit(limit).all()
    return items


@router.delete("/wishlist/{item_id}")
def delete_wishlist_item(item_id: int, db: Session = Depends(get_db)):
    db_item = (
        db.query(models.WishlistItem).filter(models.WishlistItem.id == item_id).first()
    )
    if db_item is None:
        raise HTTPException(status_code=404, detail="Wishlist item not found")

    db.delete(db_item)
    db.commit()
    return {"message": "Wishlist item deleted successfully"}
