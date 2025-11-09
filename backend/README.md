# Parking Space Management System - API Documentation

## Table of Contents
1. [Overview](#overview)
2. [Base URL](#base-url)
3. [Authentication](#authentication)
4. [API Endpoints](#api-endpoints)
   - [Parking Lots](#parking-lots)
   - [Parking Spaces](#parking-spaces)
   - [Users](#users)
   - [Vehicles](#vehicles)
   - [Occupancy](#occupancy)
   - [Billing](#billing)
5. [Data Models](#data-models)
6. [Enumerations](#enumerations)
7. [Error Handling](#error-handling)
8. [Setup & Deployment](#setup--deployment)

## Overview

The Parking Space Management System is a comprehensive backend API for managing parking operations including lot management, space allocation, vehicle tracking, occupancy management, and billing. This RESTful API supports real-time parking operations with role-based access control.

## Base URL

```
http://localhost:5000/api
```

## Authentication

*Currently, the system uses a simplified approach without JWT authentication. In production, implement proper authentication middleware.*

## API Endpoints

### Parking Lots

#### Get All Parking Lots
- **URL:** `/parking-lots/`
- **Method:** `GET`
- **Description:** Retrieve all parking lots
- **Query Parameters:** None
- **Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Downtown Parking",
      "location": "123 Main St, Downtown",
      "capacity": 50,
      "base_rate": 5.0,
      "geo_location": "40.7128,-74.0060",
      "created_at": "2023-10-01T10:00:00",
      "updated_at": "2023-10-01T10:00:00"
    }
  ],
  "count": 1
}
```

#### Get Parking Lot by ID
- **URL:** `/parking-lots/{id}`
- **Method:** `GET`
- **Description:** Retrieve specific parking lot details
- **URL Parameters:** `id` (integer) - Parking lot ID
- **Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Downtown Parking",
    "location": "123 Main St, Downtown",
    "capacity": 50,
    "base_rate": 5.0,
    "geo_location": "40.7128,-74.0060",
    "created_at": "2023-10-01T10:00:00",
    "updated_at": "2023-10-01T10:00:00"
  }
}
```

#### Create Parking Lot
- **URL:** `/parking-lots/`
- **Method:** `POST`
- **Description:** Create a new parking lot
- **Request Body:**
```json
{
  "name": "Airport Parking",
  "location": "Airport Road",
  "capacity": 100,
  "base_rate": 8.0,
  "geo_location": "40.6418,-73.7808"
}
```
- **Response:**
```json
{
  "success": true,
  "data": {
    "id": 2,
    "name": "Airport Parking",
    "location": "Airport Road",
    "capacity": 100,
    "base_rate": 8.0,
    "geo_location": "40.6418,-73.7808",
    "created_at": "2023-10-01T11:00:00",
    "updated_at": "2023-10-01T11:00:00"
  },
  "message": "Parking lot created successfully"
}
```

#### Update Parking Lot
- **URL:** `/parking-lots/{id}`
- **Method:** `PUT`
- **Description:** Update an existing parking lot
- **URL Parameters:** `id` (integer) - Parking lot ID
- **Request Body:** (Partial updates supported)
```json
{
  "name": "Updated Parking",
  "base_rate": 10.0
}
```

#### Delete Parking Lot
- **URL:** `/parking-lots/{id}`
- **Method:** `DELETE`
- **Description:** Delete a parking lot (only if no spaces exist)
- **URL Parameters:** `id` (integer) - Parking lot ID

#### Get Parking Spaces for Lot
- **URL:** `/parking-lots/{id}/spaces`
- **Method:** `GET`
- **Description:** Get all parking spaces for a specific lot
- **URL Parameters:** `id` (integer) - Parking lot ID

### Parking Spaces

#### Get All Parking Spaces
- **URL:** `/parking-spaces/`
- **Method:** `GET`
- **Description:** Retrieve parking spaces with filtering
- **Query Parameters:**
  - `lot_id` (integer, optional) - Filter by parking lot
  - `space_type` (string, optional) - Filter by space type
  - `state` (string, optional) - Filter by current state
- **Example:** `/parking-spaces/?lot_id=1&space_type=4W`
- **Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "lot_id": 1,
      "space_type": "4W",
      "state": "unoccupied",
      "extra_charge": 0.0,
      "created_at": "2023-10-01T10:00:00",
      "updated_at": "2023-10-01T10:00:00"
    }
  ],
  "count": 1
}
```

#### Get Available Parking Spaces
- **URL:** `/parking-spaces/available`
- **Method:** `GET`
- **Description:** Get only available (unoccupied) parking spaces
- **Query Parameters:**
  - `lot_id` (integer, optional) - Filter by parking lot
  - `space_type` (string, optional) - Filter by space type
- **Example:** `/parking-spaces/available?lot_id=1&space_type=EV`

#### Create Parking Space
- **URL:** `/parking-spaces/`
- **Method:** `POST`
- **Description:** Create a new parking space
- **Request Body:**
```json
{
  "lot_id": 1,
  "space_type": "EV",
  "state": "unoccupied",
  "extra_charge": 5.0
}
```

#### Update Parking Space
- **URL:** `/parking-spaces/{id}`
- **Method:** `PUT`
- **Description:** Update parking space details
- **URL Parameters:** `id` (integer) - Space ID
- **Request Body:** (Partial updates supported)
```json
{
  "state": "maintenance",
  "extra_charge": 0.0
}
```

#### Delete Parking Space
- **URL:** `/parking-spaces/{id}`
- **Method:** `DELETE`
- **Description:** Delete a parking space (only if not occupied)
- **URL Parameters:** `id` (integer) - Space ID

### Users

#### Get All Users
- **URL:** `/users/`
- **Method:** `GET`
- **Description:** Retrieve all users with optional role filtering
- **Query Parameters:**
  - `role` (string, optional) - Filter by user role
- **Example:** `/users/?role=staff`
- **Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Admin User",
      "contact_no": "+1234567890",
      "address": null,
      "email": "admin@parking.com",
      "role": "admin",
      "created_at": "2023-10-01T10:00:00",
      "updated_at": "2023-10-01T10:00:00"
    }
  ],
  "count": 1
}
```

#### Create User
- **URL:** `/users/`
- **Method:** `POST`
- **Description:** Register a new user
- **Request Body:**
```json
{
  "name": "John Doe",
  "contact_no": "+1234567890",
  "email": "john@example.com",
  "password": "securepassword",
  "role": "customer",
  "address": "123 Main St"
}
```

#### Get User Vehicles
- **URL:** `/users/{id}/vehicles`
- **Method:** `GET`
- **Description:** Get all vehicles registered to a user
- **URL Parameters:** `id` (integer) - User ID

### Vehicles

#### Get All Vehicles
- **URL:** `/vehicles/`
- **Method:** `GET`
- **Description:** Retrieve vehicles with filtering
- **Query Parameters:**
  - `owner_id` (integer, optional) - Filter by owner
  - `vehicle_type` (string, optional) - Filter by vehicle type
- **Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "vehicle_id": "ABC123",
      "owner_id": 3,
      "vehicle_type": "4W",
      "created_at": "2023-10-01T10:00:00",
      "updated_at": "2023-10-01T10:00:00"
    }
  ],
  "count": 1
}
```

#### Register Vehicle
- **URL:** `/vehicles/`
- **Method:** `POST`
- **Description:** Register a new vehicle
- **Request Body:**
```json
{
  "vehicle_id": "XYZ789",
  "owner_id": 3,
  "vehicle_type": "2W"
}
```

> **Note:** For walk-in customers (without user account), you can omit `owner_id` and the system will create a temporary vehicle record.

#### Update Vehicle
- **URL:** `/vehicles/{vehicle_id}`
- **Method:** `PUT`
- **Description:** Update vehicle information
- **URL Parameters:** `vehicle_id` (string) - Vehicle registration number
- **Request Body:**
```json
{
  "owner_id": 4,
  "vehicle_type": "4W"
}
```

### Occupancy

#### Check-In Vehicle
- **URL:** `/occupancy/check-in`
- **Method:** `POST`
- **Description:** Check a vehicle into a parking space
- **Request Body:**
```json
{
  "space_id": 1,
  "vehicle_registration": "ABC123"
}
```
- **Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "space_id": 1,
    "vehicle_id": 1,
    "entry_time": "2023-10-01T10:00:00",
    "exit_time": null,
    "status": "active",
    "created_at": "2023-10-01T10:00:00",
    "updated_at": "2023-10-01T10:00:00"
  },
  "message": "Vehicle checked in successfully"
}
```

#### Check-Out Vehicle
- **URL:** `/occupancy/{occupancy_id}/check-out`
- **Method:** `POST`
- **Description:** Check a vehicle out and generate bill
- **URL Parameters:** `occupancy_id` (integer) - Occupancy record ID
- **Request Body:** (Optional)
```json
{
  "exit_time": "2023-10-01T14:30:00"
}
```
- **Response:**
```json
{
  "success": true,
  "data": {
    "occupancy": {
      "id": 1,
      "space_id": 1,
      "vehicle_id": 1,
      "entry_time": "2023-10-01T10:00:00",
      "exit_time": "2023-10-01T14:30:00",
      "status": "completed",
      "created_at": "2023-10-01T10:00:00",
      "updated_at": "2023-10-01T14:30:00"
    },
    "billing": {
      "id": 1,
      "occupancy_id": 1,
      "amount": 25.0,
      "payment_time": null,
      "payment_status": "pending",
      "created_at": "2023-10-01T14:30:00",
      "updated_at": "2023-10-01T14:30:00"
    },
    "amount": 25.0
  },
  "message": "Vehicle checked out successfully"
}
```

#### Get Active Occupancies
- **URL:** `/occupancy/active`
- **Method:** `GET`
- **Description:** Get all currently active parking sessions

#### Reserve Space
- **URL:** `/occupancy/reserve`
- **Method:** `POST`
- **Description:** Temporarily reserve a parking space
- **Request Body:**
```json
{
  "space_id": 5,
  "duration_minutes": 30
}
```

#### Get Occupancy History
- **URL:** `/occupancy/history`
- **Method:** `GET`
- **Description:** Get historical occupancy records
- **Query Parameters:**
  - `vehicle_id` (string, optional) - Filter by vehicle
  - `start_date` (string, optional) - Start date (ISO format)
  - `end_date` (string, optional) - End date (ISO format)
- **Example:** `/occupancy/history?vehicle_id=ABC123&start_date=2023-10-01&end_date=2023-10-31`

### Billing

#### Get All Billing Records
- **URL:** `/billing/`
- **Method:** `GET`
- **Description:** Retrieve billing records with filtering
- **Query Parameters:**
  - `payment_status` (string, optional) - Filter by payment status
  - `occupancy_id` (integer, optional) - Filter by occupancy
- **Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "occupancy_id": 1,
      "amount": 25.0,
      "payment_time": null,
      "payment_status": "pending",
      "created_at": "2023-10-01T14:30:00",
      "updated_at": "2023-10-01T14:30:00"
    }
  ],
  "count": 1
}
```

#### Process Payment
- **URL:** `/billing/{billing_id}/pay`
- **Method:** `POST`
- **Description:** Mark a bill as paid
- **URL Parameters:** `billing_id` (integer) - Billing record ID
- **Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "occupancy_id": 1,
    "amount": 25.0,
    "payment_time": "2023-10-01T15:00:00",
    "payment_status": "paid",
    "created_at": "2023-10-01T14:30:00",
    "updated_at": "2023-10-01T15:00:00"
  },
  "message": "Payment processed successfully"
}
```

#### Get Pending Payments
- **URL:** `/billing/pending`
- **Method:** `GET`
- **Description:** Get all unpaid bills

#### Get Revenue Report
- **URL:** `/billing/revenue`
- **Method:** `GET`
- **Description:** Get revenue statistics with date filtering
- **Query Parameters:**
  - `start_date` (string, optional) - Start date (ISO format)
  - `end_date` (string, optional) - End date (ISO format)
- **Response:**
```json
{
  "success": true,
  "data": {
    "total_revenue": 1250.0,
    "transactions": [
      {
        "id": 1,
        "occupancy_id": 1,
        "amount": 25.0,
        "payment_time": "2023-10-01T15:00:00",
        "payment_status": "paid",
        "created_at": "2023-10-01T14:30:00",
        "updated_at": "2023-10-01T15:00:00"
      }
    ],
    "transaction_count": 50
  }
}
```

## Data Models

### Parking Lot
```json
{
  "id": 1,
  "name": "Downtown Parking",
  "location": "123 Main St",
  "capacity": 50,
  "base_rate": 5.0,
  "geo_location": "40.7128,-74.0060",
  "created_at": "2023-10-01T10:00:00",
  "updated_at": "2023-10-01T10:00:00"
}
```

### Parking Space
```json
{
  "id": 1,
  "lot_id": 1,
  "space_type": "4W",
  "state": "unoccupied",
  "extra_charge": 0.0,
  "created_at": "2023-10-01T10:00:00",
  "updated_at": "2023-10-01T10:00:00"
}
```

### User
```json
{
  "id": 1,
  "name": "John Doe",
  "contact_no": "+1234567890",
  "address": "123 Main St",
  "email": "john@example.com",
  "role": "customer",
  "created_at": "2023-10-01T10:00:00",
  "updated_at": "2023-10-01T10:00:00"
}
```

### Vehicle
```json
{
  "id": 1,
  "vehicle_id": "ABC123",
  "owner_id": 1,
  "vehicle_type": "4W",
  "created_at": "2023-10-01T10:00:00",
  "updated_at": "2023-10-01T10:00:00"
}
```

### Occupancy
```json
{
  "id": 1,
  "space_id": 1,
  "vehicle_id": 1,
  "entry_time": "2023-10-01T10:00:00",
  "exit_time": "2023-10-01T14:30:00",
  "status": "completed",
  "created_at": "2023-10-01T10:00:00",
  "updated_at": "2023-10-01T14:30:00"
}
```

### Billing
```json
{
  "id": 1,
  "occupancy_id": 1,
  "amount": 25.0,
  "payment_time": "2023-10-01T15:00:00",
  "payment_status": "paid",
  "created_at": "2023-10-01T14:30:00",
  "updated_at": "2023-10-01T15:00:00"
}
```

## Enumerations

### Space Types
- `2W` - Two-wheeler (motorcycles, scooters)
- `4W` - Four-wheeler (cars, SUVs)
- `EV` - Electric Vehicle
- `VIP` - VIP parking
- `DISABLED` - Disabled parking

### Space States
- `occupied` - Currently occupied by a vehicle
- `unoccupied` - Available for parking
- `reserved` - Temporarily reserved
- `maintenance` - Under maintenance, not available

### Vehicle Types
- `2W` - Two-wheeler
- `4W` - Four-wheeler
- `EV` - Electric Vehicle

### User Roles
- `admin` - System administrator
- `staff` - On-site staff
- `customer` - Regular customer

### Occupancy Status
- `active` - Currently occupied
- `completed` - Session ended

### Payment Status
- `pending` - Payment not yet made
- `paid` - Payment completed
- `failed` - Payment failed

## Error Handling

All endpoints return consistent error responses:

### Standard Error Format
```json
{
  "success": false,
  "error": "Error description message"
}
```

### Common HTTP Status Codes
- `200` - Success
- `201` - Resource created
- `400` - Bad request (validation errors)
- `404` - Resource not found
- `500` - Internal server error

### Example Error Responses
```json
{
  "success": false,
  "error": "Parking lot not found"
}
```

```json
{
  "success": false,
  "error": "Missing required field: name"
}
```

```json
{
  "success": false,
  "error": "Space is not available"
}
```

## Setup & Deployment

### Prerequisites
- Python 3.8+
- PostgreSQL (Neon PostgreSQL recommended)
- UV package manager

### Installation
```bash
# Clone repository
git clone <repository-url>
cd parking_system

# Install dependencies
uv sync

# Setup environment variables
cp .env.example .env
# Edit .env with your database credentials

# Initialize database
python setup.py

# Start development server
python run.py
```

### Environment Variables
```env
NEON_DATABASE_URL=postgresql://user:pass@host/dbname
SECRET_KEY=your-secret-key
JWT_SECRET_KEY=your-jwt-secret
FLASK_CONFIG=development
```

### Testing the API
Use tools like Postman, curl, or any HTTP client to test the endpoints:

```bash
# Test API health
curl http://localhost:5000/api/parking-lots/

# Check available spaces
curl http://localhost:5000/api/parking-spaces/available

# Create test check-in
curl -X POST http://localhost:5000/api/occupancy/check-in \
  -H "Content-Type: application/json" \
  -d '{"space_id": 1, "vehicle_registration": "TEST123"}'
```