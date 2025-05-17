Databases and Tables
====================

1. **Users**
    - **Purpose**: To manage user authentication and profiles.
    - **Fields**:
      - `id` (UUID, Primary Key)
      - `email` (String, Unique)
      - `password` (Hashed String)
      - `name` (String)
      - `avatar_url` (String, Optional)
      - `role` (Enum: admin, driver, courier)
      - `created_at` (Timestamp)
      - `updated_at` (Timestamp)

2. **Drivers**
    - **Purpose**: To store driver-specific information.
    - **Fields**:
      - `id` (UUID, Primary Key)
      - `user_id` (UUID, Foreign Key to Users.id)
      - `license_number` (String, Unique)
      - `rating` (Float)
      - `status` (Enum: active, idle, unavailable)
    - `latitude` (Numeric)
    - `longitude` (Numeric)
    - `assigned_vehicle_id` (UUID, Primary key)
    - `last_service_date` (Date)
    - `created_at` (Timestamp)
    - `updated_at` (Timestamp)

3. **Vehicles**
    - **Purpose**: To manage fleet vehicles.
    - **Fields**:
      - `id` (UUID, Primary Key)
      - `license_plate` (String, Unique)
      - `model` (String)
      - `capacity` (Integer, in kg)
      - `location` [lat,lng] (varchart)
      - `status` (Enum: available, in_use, maintenance)
      - `last_maintenance_date` (Date)
      - `created_at` (Timestamp)
      - `updated_at` (Timestamp)

4. **Routes**
    - **Purpose**: To store route planning and tracking information.
    - **Fields**:
      - `id` (UUID, Primary Key)
      - `name` (String)
      - `start_point` (Geolocation)
      - `end_point` (Geolocation)
      - `status` (Enum: draft, pending, completed)
      - `distance` (Float, in km)
      - `estimated_time` (Float, in hours)
      - `created_at` (Timestamp)
      - `updated_at` (Timestamp)

5. **Parcels**
    - **Purpose**: To manage parcel details for deliveries.
    - **Fields**:
      - `id` (UUID, Primary Key)
      - `route_id` (UUID, Foreign Key to Routes.id)
      - `weight` (Float, in kg)
      - `dimensions` (String, e.g., "10x10x10 cm")
      - `status` (Enum: pending, in_transit, delivered)
      - `recipient_name` (String)
      - `recipient_address` (String)
      - `In_Vehicle_Id` (Forigen Key)
      - `created_at` (Timestamp)
      - `updated_at` (Timestamp)

6. **Notifications**
    - **Purpose**: To store system alerts and updates.
    - **Fields**:
      - `id` (UUID, Primary Key)
      - `user_id` (UUID, Foreign Key to Users.id)
      - `message` (String)
      - `status` (Enum: unread, read)
      - `created_at` (Timestamp)

7. **Finance**
    - **Purpose**: To track financial transactions.
    - **Fields**:
      - `id` (UUID, Primary Key)
      - `user_id` (UUID, Foreign Key to Users.id)
      - `amount` (Float)
      - `type` (Enum: invoice, payment, refund)
      - `description` (String)
      - `created_at` (Timestamp)

8. **Reports**
    - **Purpose**: To generate performance and operational reports.
    - **Fields**:
      - `id` (UUID, Primary Key)
      - `type` (Enum: daily, weekly, monthly)
      - `data` (JSON)
      - `generated_at` (Timestamp)

9. **Support Tickets**
    - **Purpose**: To manage customer support interactions.
    - **Fields**:
      - `id` (UUID, Primary Key)
      - `user_id` (UUID, Foreign Key to Users.id)
      - `subject` (String)
      - `description` (Text)
      - `status` (Enum: open, closed)
      - `created_at` (Timestamp)
      - `updated_at` (Timestamp)

Relationships
=============
- **Users ↔ Drivers**: One-to-One (A user can be a driver).
- **Users ↔ Notifications**: One-to-Many (A user can have multiple notifications).
- **Users ↔ Finance**: One-to-Many (A user can have multiple financial transactions).
- **Routes ↔ Parcels**: One-to-Many (A route can have multiple parcels).
- **Users ↔ Support Tickets**: One-to-Many (A user can have multiple support tickets).


all have been finshed only Foreign Keys need to be fixed