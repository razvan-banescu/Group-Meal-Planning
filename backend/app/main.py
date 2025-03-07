from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routers import meals, families, members, wishlist, rooms, drinks, drink_wishlist
from .database.database import engine
from .models import models

# Create database tables
models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Easter Meal Planning API")

# Configure CORS
origins = [
    "http://localhost:3000",  # React development server
    "http://localhost:5173",  # Vite development server
    "http://localhost:5174",  # Alternative Vite port
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(meals.router, prefix="/api", tags=["meals"])
app.include_router(families.router, prefix="/api", tags=["families"])
app.include_router(members.router, prefix="/api", tags=["members"])
app.include_router(wishlist.router, prefix="/api", tags=["wishlist"])
app.include_router(rooms.router, prefix="/api", tags=["rooms"])
app.include_router(drinks.router, prefix="/api", tags=["drinks"])
app.include_router(drink_wishlist.router, prefix="/api", tags=["drink-wishlist"])


@app.get("/")
def read_root():
    return {"message": "Welcome to Easter Meal Planning API"}
