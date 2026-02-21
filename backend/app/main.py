from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import engine, Base
from app.models import user, membership, product, cart, order
from sqlalchemy import text
from app.database import SessionLocal
from app.routers import auth
from app.routers import test_protected
from app.routers import admin
from app.routers import vendor
from app.routers import user
from app.routers import guest
from app.routers import cart
from app.routers import order



app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

Base.metadata.create_all(bind=engine)

# Startup Migration for Orders Table
with engine.connect() as conn:
    order_columns = [
        ("name", "VARCHAR(100)"),
        ("email", "VARCHAR(150)"),
        ("address", "VARCHAR(255)"),
        ("city", "VARCHAR(100)"),
        ("state", "VARCHAR(100)"),
        ("pincode", "VARCHAR(20)"),
        ("phone", "VARCHAR(20)"),
        ("payment_method", "VARCHAR(50)")
    ]
    for col_name, col_type in order_columns:
        try:
            conn.execute(text(f"ALTER TABLE orders ADD COLUMN {col_name} {col_type}"))
            conn.commit()
            print(f"Migration: Added column {col_name} to orders table")
        except Exception:
            # Column likely exists
            pass
            
    # Migration for User Table: Adding image_url
    try:
        conn.execute(text("ALTER TABLE users ADD COLUMN image_url VARCHAR(255)"))
        conn.commit()
        print("Migration: Added column image_url to users table")
    except Exception:
        pass


@app.get("/")
def root():
    return {"message": "Backend running"}



@app.get("/test-db")
def test_db():
    db = SessionLocal()
    try:
        db.execute(text("SELECT 1"))
        return {"message": "Database connected successfully"}
    except Exception as e:
        return {"error": str(e)}
    finally:
        db.close()

app.include_router(auth.router)

app.include_router(test_protected.router)

app.include_router(admin.router)

app.include_router(vendor.router)

app.include_router(user.router)

app.include_router(guest.router)
app.include_router(cart.router)
app.include_router(order.router)