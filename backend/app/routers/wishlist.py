from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from ..database.database import get_db
from ..models import models
from pydantic import BaseModel, ConfigDict

router = APIRouter()


class WishlistItemBase(BaseModel):
    dish_name: str
    requested_quantity: float
    notes: str | None = None
    room_id: int


class WishlistItemCreate(WishlistItemBase):
    pass


class WishlistItemResponse(WishlistItemBase):
    id: int
    model_config = ConfigDict(from_attributes=True)


@router.post("/wishlist/", response_model=WishlistItemResponse)
def create_wishlist_item(item: WishlistItemCreate, db: Session = Depends(get_db)):
    try:
        # Verify room exists and is active
        room = db.query(models.Room).filter(models.Room.id == item.room_id).first()
        if not room:
            raise HTTPException(status_code=404, detail="Room not found")
        if room.status != models.RoomStatus.active:
            raise HTTPException(status_code=400, detail="Room is not active")

        db_item = models.WishlistItem(**item.model_dump())
        db.add(db_item)
        db.commit()
        db.refresh(db_item)
        return db_item
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/wishlist/{room_id}", response_model=List[WishlistItemResponse])
def get_wishlist_items(
    room_id: int, skip: int = 0, limit: int = 100, db: Session = Depends(get_db)
):
    # Verify room exists
    room = db.query(models.Room).filter(models.Room.id == room_id).first()
    if not room:
        raise HTTPException(status_code=404, detail="Room not found")

    items = (
        db.query(models.WishlistItem)
        .filter(models.WishlistItem.room_id == room_id)
        .order_by(models.WishlistItem.created_at.desc())
        .offset(skip)
        .limit(limit)
        .all()
    )
    return items


@router.delete("/wishlist/{room_id}/{item_id}")
def delete_wishlist_item(room_id: int, item_id: int, db: Session = Depends(get_db)):
    # Verify room exists and is active
    room = db.query(models.Room).filter(models.Room.id == room_id).first()
    if not room:
        raise HTTPException(status_code=404, detail="Room not found")
    if room.status != models.RoomStatus.active:
        raise HTTPException(status_code=400, detail="Room is not active")

    db_item = (
        db.query(models.WishlistItem)
        .filter(
            models.WishlistItem.id == item_id, models.WishlistItem.room_id == room_id
        )
        .first()
    )
    if not db_item:
        raise HTTPException(
            status_code=404, detail="Wishlist item not found in this room"
        )

    try:
        db.delete(db_item)
        db.commit()
        return {"message": "Wishlist item deleted successfully"}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=str(e))
