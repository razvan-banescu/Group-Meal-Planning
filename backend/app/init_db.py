from database.database import SessionLocal
from models.models import Family, Member


def init_db():
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


if __name__ == "__main__":
    init_db()
