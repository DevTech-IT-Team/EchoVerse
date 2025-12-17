# EchoVerse Backend

This folder contains a Node.js + Express backend for EchoVerse with basic authentication (signup and login) using MongoDB.

Quick start

1. Change directory to `backend`
2. Copy `.env.example` to `.env` and fill in `MONGO_URI` and `JWT_SECRET`
3. Install dependencies:

```powershell
cd backend
npm install
```

4. Run in development mode:

```powershell
npm run dev
```

API endpoints
- `POST /api/auth/signup` - register a new user
- `POST /api/auth/login` - login and receive JWT token

Files
- `server.js` - app entry
- `config/db.js` - MongoDB connection helper
- `models/User.js` - Mongoose user model
- `routes/auth.js` - signup/login routes
