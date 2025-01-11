from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.models.models import Base, Family, Member

# Create database engine
engine = create_engine(
    "sqlite:///./easter_meals.db", connect_args={"check_same_thread": False}
)

# Create all tables
Base.metadata.create_all(bind=engine)

# Create a session
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
db = SessionLocal()

try:
    # Create a default family
    default_family = Family(name="Default Family")
    db.add(default_family)
    db.commit()
    db.refresh(default_family)

    # Create members
    members = [
        Member(name="Razvan", family_id=default_family.id),
        Member(name="Andrei", family_id=default_family.id),
        Member(name="Matei", family_id=default_family.id),
    ]

    db.bulk_save_objects(members)
    db.commit()

    print("Database initialized with default family and members!")
except Exception as e:
    print(f"Error initializing database: {e}")
finally:
    db.close()
