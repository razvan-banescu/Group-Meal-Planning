from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from ..database.database import get_db
from ..models import models
from pydantic import BaseModel, ConfigDict

router = APIRouter()


class FamilyBase(BaseModel):
    name: str


class FamilyCreate(FamilyBase):
    pass


class FamilyResponse(FamilyBase):
    id: int
    model_config = ConfigDict(from_attributes=True)


@router.post("/families/", response_model=FamilyResponse)
def create_family(family: FamilyCreate, db: Session = Depends(get_db)):
    try:
        db_family = models.Family(**family.model_dump())
        db.add(db_family)
        db.commit()
        db.refresh(db_family)
        return db_family
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/families/", response_model=List[FamilyResponse])
def get_families(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    families = db.query(models.Family).offset(skip).limit(limit).all()
    return families


@router.get("/families/{family_id}", response_model=FamilyResponse)
def get_family(family_id: int, db: Session = Depends(get_db)):
    family = db.query(models.Family).filter(models.Family.id == family_id).first()
    if family is None:
        raise HTTPException(status_code=404, detail="Family not found")
    return family


@router.put("/families/{family_id}", response_model=FamilyResponse)
def update_family(family_id: int, family: FamilyBase, db: Session = Depends(get_db)):
    db_family = db.query(models.Family).filter(models.Family.id == family_id).first()
    if db_family is None:
        raise HTTPException(status_code=404, detail="Family not found")

    for key, value in family.model_dump().items():
        setattr(db_family, key, value)

    db.commit()
    db.refresh(db_family)
    return db_family


@router.delete("/families/{family_id}")
def delete_family(family_id: int, db: Session = Depends(get_db)):
    db_family = db.query(models.Family).filter(models.Family.id == family_id).first()
    if db_family is None:
        raise HTTPException(status_code=404, detail="Family not found")

    db.delete(db_family)
    db.commit()
    return {"message": "Family deleted successfully"}
