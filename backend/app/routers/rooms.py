from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import Optional, Dict, Any
from ..database.database import get_db
from ..models.models import Room, RoomStatus
from pydantic import BaseModel
import random
import string
from datetime import datetime

router = APIRouter()


class RoomSettings(BaseModel):
    participantCount: int
    mealCount: int
    language: str
    families: list[str]
    mealType: str


class RoomCreate(BaseModel):
    pass  # Empty model since we don't need any input for initial room creation


class RoomActivate(BaseModel):
    settings: RoomSettings


class RoomResponse(BaseModel):
    id: int
    seed: str
    status: str
    settings: Optional[Dict[str, Any]] = None
    created_at: datetime

    class Config:
        from_attributes = True


def generate_room_seed(length: int = 6) -> str:
    """Generate a random room seed of specified length"""
    return "".join(random.choices(string.ascii_uppercase + string.digits, k=length))


@router.post("/rooms/", response_model=RoomResponse)
def create_room(db: Session = Depends(get_db)):
    """Create a new room with a generated seed"""
    try:
        # Generate a unique seed
        seed = generate_room_seed()
        while db.query(Room).filter(Room.seed == seed).first():
            seed = generate_room_seed()

        # Create room with pending status
        db_room = Room(
            seed=seed,
            status=RoomStatus.pending,
            settings=None,  # Initialize with None instead of empty dict
        )
        db.add(db_room)
        db.commit()
        db.refresh(db_room)
        return db_room
    except Exception as e:
        db.rollback()
        print(f"Error creating room: {str(e)}")  # Add debug logging
        raise HTTPException(status_code=400, detail=str(e))


@router.put("/rooms/{seed}/activate", response_model=RoomResponse)
def activate_room(seed: str, room_data: RoomActivate, db: Session = Depends(get_db)):
    """Activate a room with the provided settings"""
    db_room = db.query(Room).filter(Room.seed == seed).first()
    if not db_room:
        raise HTTPException(status_code=404, detail="Room not found")

    try:
        db_room.status = RoomStatus.active
        db_room.settings = room_data.settings.model_dump()
        db.commit()
        db.refresh(db_room)
        return db_room
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/rooms/{seed}", response_model=RoomResponse)
def get_room(seed: str, db: Session = Depends(get_db)):
    """Get room details by seed"""
    room = db.query(Room).filter(Room.seed == seed).first()
    if not room:
        raise HTTPException(status_code=404, detail="Room not found")
    return room


@router.get("/rooms/{seed}/status")
def get_room_status(seed: str, db: Session = Depends(get_db)):
    """Get room status by seed"""
    room = db.query(Room).filter(Room.seed == seed).first()
    if not room:
        raise HTTPException(status_code=404, detail="Room not found")
    return {"status": room.status}
