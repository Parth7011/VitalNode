# VitalNode Backend

Node.js + Express REST API for the VitalNode telemedicine platform.

## Folder Structure

```
backend/
├── config/
│   └── db.js                    ← MongoDB connection
├── controllers/
│   ├── authController.js        ← Auth logic (register, login, profile)
│   ├── doctorController.js      ← Doctor listing and profile management
│   └── appointmentController.js ← Appointment booking and management
├── middlewares/
│   ├── authMiddleware.js        ← JWT verification + role-based access
│   └── errorMiddleware.js       ← Global 404 & error handler
├── models/
│   ├── User.js                  ← User schema (patient/doctor/admin)
│   ├── Doctor.js                ← Doctor schema
│   └── Appointment.js           ← Appointment schema
├── routes/
│   ├── authRoutes.js            ← /api/auth/*
│   ├── doctorRoutes.js          ← /api/doctors/*
│   └── appointmentRoutes.js     ← /api/appointments/*
├── .env.example                 ← Sample environment variables
├── package.json
└── server.js                    ← Express app entry point
```

## Getting Started

1. **Install dependencies**
   ```bash
   cd backend
   npm install
   ```

2. **Configure environment**
   ```bash
   cp .env.example .env
   # Edit .env with your MongoDB URI and JWT secret
   ```

3. **Run the server**
   ```bash
   # Development (with auto-restart)
   npm run dev

   # Production
   npm start
   ```

## API Endpoints

| Method | Endpoint                    | Access        | Description              |
|--------|-----------------------------|---------------|--------------------------|
| POST   | /api/auth/register          | Public        | Register new user        |
| POST   | /api/auth/login             | Public        | Login and get token      |
| GET    | /api/auth/profile           | Private       | Get logged-in user       |
| GET    | /api/doctors                | Public        | List all doctors         |
| GET    | /api/doctors/:id            | Public        | Get doctor by ID         |
| PUT    | /api/doctors/:id            | Doctor/Admin  | Update doctor profile    |
| POST   | /api/appointments           | Patient       | Book appointment         |
| GET    | /api/appointments           | Private       | Get my appointments      |
| PUT    | /api/appointments/:id       | Private       | Update appointment status|
| DELETE | /api/appointments/:id       | Patient       | Cancel appointment       |
