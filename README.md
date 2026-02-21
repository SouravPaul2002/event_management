# Event Management System

A full-stack event management application built with FastAPI and React (Vite).

## Project Structure

- `backend/`: FastAPI application handling order management, vendor profiles, and membership logic.
- `frontend/`: React application with role-based dashboards (Admin, Vendor, User).

## Setup Instructions

### Backend
1. Navigate to the `backend/` directory.
2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
3. Run the server:
   ```bash
   uvicorn app.main:app --reload
   ```

### Frontend
1. Navigate to the `frontend/` directory.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```

## Key Features
- **Role-Based Access**: Specialized interfaces for Admin, Vendors, and Users.
- **Order Tracking**: Simplified order status with detailed shipping updates.
- **Membership Management**: Vendor membership system with extension control.
- **Inventory System**: Real-time stock reduction on checkout.
- **Premium UI**: Modern design with glassmorphism and custom styling.
