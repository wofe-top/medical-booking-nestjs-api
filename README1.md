

```markdown
# 🏥 PulseBook API — Medical Appointment Management System

A robust, scalable RESTful API built with **NestJS**, **TypeScript**, and **MongoDB (Mongoose)** for managing medical appointment bookings, doctor availability schedules, specialties, and payment transactions.

---

## 🚀 Key Features

### 🔐 Auth & Role-Based Access Control (RBAC)
* **JWT Authentication**: Secure login and token-based state management.
* **Role Hierarchy**: Fine-grained access control for `PATIENT`, `DOCTOR`, and `ADMIN` roles.
* **Smart Doctor Registration**: Unified registration flow that creates the `User` account and automatically provisions a `DoctorProfile` when registering under the `DOCTOR` role.

### 🩺 Doctor & Specialty Management
* **Specialties Directory**: Admins can manage medical specialties.
* **Doctor Profiles**: Comprehensive doctor profiles including bio, consultation fees, and linked specialties.
* **Custom Schedules**: Doctors can set working hours for specific days with custom slot durations (e.g., 30-minute slots).
* **Dynamic Slot Calculation**: Automated real-time algorithm that computes available booking time slots while filtering out existing appointments and non-working hours.

### 📅 Appointments Lifecycle
* **Patient Booking**: Easy booking using doctor profiles and specific date/time slots.
* **Status Tracking**: Complete lifecycle management (`PENDING`, `CONFIRMED`, `COMPLETED`, `CANCELLED`).
* **Schedules Overview**: Tailored schedule views for both doctors and patients.

### 💳 Payment Processing
* **Multiple Payment Methods**: Support for `CASH`, `CREDIT_CARD`, and `PAYPAL`.
* **Invoice Tracking**: Payment status management (`PENDING`, `COMPLETED`, `FAILED`, `REFUNDED`).

### 📚 Interactive API Documentation (Swagger)
* **OpenAPI / Swagger UI**: Fully interactive, auto-generated documentation accessible at `/docs` to explore and test all API endpoints directly from the browser with JWT authorization support.

### 🛠️ Architecture & Formatting
* **Global Exception Filter**: Standardized JSON error handling across all API endpoints (`HttpExceptionFilter`).
* **Transform Interceptor**: Unified response payload wrapper (`TransformInterceptor`) matching standard API responses.
* **Validation Pipe**: DTO payload sanitization and validation powered by `class-validator`.

---

## 🛠️ Tech Stack

* **Framework**: [NestJS](https://nestjs.com/)
* **Language**: [TypeScript](https://www.typescriptlang.org/)
* **Database**: [MongoDB](https://www.mongodb.com/) via [Mongoose](https://mongoosejs.com/)
* **Authentication**: [Passport-JWT](https://www.passportjs.org/) & [Bcrypt](https://github.com/kelektiv/node.bcrypt.js)
* **API Documentation**: [Swagger (OpenAPI)](https://swagger.io/) via `@nestjs/swagger`
* **Validation**: [Class Validator](https://github.com/typestack/class-validator) & [Class Transformer](https://github.com/typestack/class-transformer)

---

## 📖 Interactive API Documentation (Swagger)

Once the application is running, you can access the interactive Swagger UI to view all endpoints, request/response models, and test requests directly:

📍 **URL**: `http://localhost:3000/docs`

> **💡 How to test authenticated routes:**
> 1. Register or Log in via `/api/auth/login` to obtain your JWT `token`.
> 2. Click the **Authorize 🔓** button at the top right of the Swagger UI.
> 3. Paste the token into the value field and click **Authorize**.
> 4. Now you can execute requests on all protected endpoints!

---

## 📂 Project Structure

```text
src/
├── appointments/       # Appointments module (Service, Controller, Schemas, DTOs)
├── auth/               # JWT Auth, Register/Login, Passport Strategy, Guards, Roles
├── common/             # Global Exception Filters, Interceptors, Custom Exceptions
├── doctors/            # Doctor Profiles, Schedules, Available Slots Calculation
├── payments/           # Payments processing & invoice status management
├── specialties/        # Medical Specialties management
├── users/              # User Schema & Roles Definition
├── app.module.ts       # Root Application Module
└── main.ts             # Application Entry Point & Swagger Setup

```

---

## ⚡ Getting Started

### Prerequisites

* **Node.js**: `v18.x` or higher
* **MongoDB**: Local MongoDB instance or MongoDB Atlas connection URI

### Installation

1. **Clone the repository**:
```bash
git clone [https://github.com/Wissam-eng/PulseBook-api.git](https://github.com/Wissam-eng/PulseBook-api.git)
cd PulseBook-api

```


2. **Install dependencies**:
```bash
npm install

```


3. **Environment Setup**:
Create a `.env` file in the root directory:
```env
PORT=3000
MONGO_URI=mongodb://localhost:27017/pulsebook_db
JWT_SECRET=your_super_secret_jwt_key

```


4. **Run the application**:
```bash
# Development mode
npm run start:dev

# Production mode
npm run start:prod

```



---

## 📡 API Endpoints Summary

All routes are globally prefixed with `/api`.

| Module | Method | Endpoint | Access | Description |
| --- | --- | --- | --- | --- |
| **Auth** | `POST` | `/api/auth/register` | Public | Register new User (Patient or Doctor with Profile) |
| **Auth** | `POST` | `/api/auth/login` | Public | Authenticate user & receive JWT token |
| **Specialties** | `GET` | `/api/specialties` | Public | Get list of active medical specialties |
| **Specialties** | `POST` | `/api/specialties` | Admin | Create a new medical specialty |
| **Doctors** | `GET` | `/api/doctors` | Public | List all doctor profiles with specialties |
| **Doctors** | `POST` | `/api/doctors/schedule` | Doctor | Set working schedule & slot durations |
| **Doctors** | `GET` | `/api/doctors/:id/slots?date=YYYY-MM-DD` | Public | Get available time slots for a date |
| **Appointments** | `POST` | `/api/appointments` | Patient | Book a new appointment slot |
| **Appointments** | `GET` | `/api/appointments/my-appointments` | Patient | View patient's booked appointments |
| **Payments** | `POST` | `/api/payments` | Patient | Process payment for an appointment |
| **Payments** | `GET` | `/api/payments/appointment/:id` | Shared | Fetch payment details for an appointment |

---

## 📝 API Response Format

### Success Response

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Operation completed successfully",
  "data": { ... }
}

```

### Error Response

```json
{
  "success": false,
  "statusCode": 400,
  "message": "Email is already registered",
  "errors": null,
  "timestamp": "2026-07-26T15:30:00.000Z"
}

```

```

```