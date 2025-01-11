from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from ..database.database import get_db
from ..models import models
from ..config import FAMILY_AFFILIATIONS
from pydantic import BaseModel, ConfigDict

router = APIRouter()


class MemberBase(BaseModel):
    name: str
    family_id: int


class MemberCreate(MemberBase):
    pass


class MemberResponse(MemberBase):
    id: int
    model_config = ConfigDict(from_attributes=True)


class FamilyAffiliation(BaseModel):
    id: int
    name: str


@router.get("/affiliations/", response_model=List[FamilyAffiliation])
def get_family_affiliations():
    """Get the list of available family affiliations"""
    return FAMILY_AFFILIATIONS


@router.get("/members/", response_model=List[MemberResponse])
def get_members(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    members = db.query(models.Member).offset(skip).limit(limit).all()
    return members


@router.get("/members/{member_id}", response_model=MemberResponse)
def get_member(member_id: int, db: Session = Depends(get_db)):
    member = db.query(models.Member).filter(models.Member.id == member_id).first()
    if member is None:
        raise HTTPException(status_code=404, detail="Member not found")
    return member
