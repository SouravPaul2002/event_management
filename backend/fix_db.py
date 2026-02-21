import sys
import os

# Add current directory to path so it can find 'app'
sys.path.append(os.getcwd())

try:
    from app.database import engine
    from sqlalchemy import text
except ImportError as e:
    print(f"Import error: {e}")
    sys.exit(1)

def update_schema():
    print("Verifying database schema for 'orders' table...")
    columns = [
        ("name", "VARCHAR(100)"),
        ("email", "VARCHAR(150)"),
        ("address", "VARCHAR(255)"),
        ("city", "VARCHAR(100)"),
        ("state", "VARCHAR(100)"),
        ("pincode", "VARCHAR(20)"),
        ("phone", "VARCHAR(20)"),
        ("payment_method", "VARCHAR(50)")
    ]
    
    with engine.connect() as conn:
        for col_name, col_type in columns:
            try:
                # Attempt to add column
                conn.execute(text(f"ALTER TABLE orders ADD COLUMN {col_name} {col_type}"))
                conn.commit()
                print(f"Successfully added column: {col_name}")
            except Exception as e:
                # If it already exists, SQLAlchemy/DB will throw an error
                if "Duplicate column name" in str(e) or "already exists" in str(e).lower():
                    print(f"Column '{col_name}' already exists. Skipping.")
                else:
                    print(f"Error adding '{col_name}': {str(e)[:100]}")

if __name__ == "__main__":
    update_schema()
    print("Schema verification complete.")
