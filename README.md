# Store Rating Platform

A full-stack web application where users submit 1–5 star ratings for stores. A single
login serves three roles — **System Administrator**, **Normal User**, and **Store Owner** —
each with role-based access to different functionality.

## Tech Stack

- **Backend:** Express.js (Node) + JWT auth + express-validator
- **Database:** PostgreSQL
- **Frontend:** React (Vite) + React Router + Axios

## Project Structure

```
store Lens/
├── backend/      Express API + PostgreSQL
│   └── src/
│       ├── config/db.js          PG connection pool
│       ├── db/                    schema.sql, init.js, seed.js
│       ├── middleware/            auth (JWT + roles), validation
│       ├── controllers/          auth, user, store, rating
│       ├── routes/               auth, user, store routes
│       └── index.js              app entry
└── frontend/     React SPA
    └── src/
        ├── api/client.js         axios instance (JWT interceptor)
        ├── context/AuthContext   auth state
        ├── components/           Navbar, ProtectedRoute, DataTable, StarRating
        └── pages/                login, signup, admin/*, user/*, owner/*
```

## Prerequisites

- Node.js 18+
- PostgreSQL 13+ running locally

## Setup

### 1. Backend

```bash
cd backend
npm install
cp .env.example .env        # then edit .env with your PostgreSQL credentials
npm run db:init             # creates the database + tables
npm run db:seed             # seeds a default admin + sample data
npm run dev                 # starts API on http://localhost:5000
```

Edit `backend/.env` and set at least:

```
PGUSER=postgres
PGPASSWORD=<your-postgres-password>
PGDATABASE=store_rating
JWT_SECRET=<a-long-random-string>
```

### 2. Frontend

```bash
cd frontend
npm install
npm run dev                 # starts the app on http://localhost:5173
```

## Default Accounts (after `npm run db:seed`)

| Role           | Email                    | Password     |
| -------------- | ------------------------ | ------------ |
| Administrator  | admin@storerating.com    | Admin@123  |
| Normal User    | user@storerating.com     | User@123   |
| Store Owner    | owner@storerating.com    | Owner@123  |

## Roles & Features

**System Administrator**
- Dashboard: total users, stores, and ratings
- Add stores, normal users, and admin users
- List & filter users (name, email, address, role) and stores (name, address)
- View user details (rating shown for store owners)

**Normal User**
- Sign up / log in, update password
- Browse & search stores (by name and address)
- Submit and modify a 1–5 rating per store; see overall and own rating

**Store Owner**
- Log in, update password
- Dashboard: average rating and the list of users who rated their store(s)

## Validation Rules

- **Name:** 20–60 characters
- **Address:** max 400 characters
- **Password:** 8–16 chars, ≥1 uppercase, ≥1 special character
- **Email:** standard email format

Validation is enforced on both the client (React) and server (express-validator + DB constraints).

## API Overview

| Method | Endpoint                       | Role        | Description                         |
| ------ | ------------------------------ | ----------- | ----------------------------------- |
| POST   | /api/auth/signup               | public      | Register a normal user              |
| POST   | /api/auth/login                | public      | Login, returns JWT                  |
| GET    | /api/auth/me                   | any         | Current user                        |
| PUT    | /api/auth/password             | any         | Update own password                 |
| GET    | /api/users/dashboard           | admin       | Counts for dashboard                |
| GET    | /api/users                     | admin       | List/filter/sort users              |
| GET    | /api/users/:id                 | admin       | User detail (rating if owner)       |
| POST   | /api/users                     | admin       | Create user (any role)              |
| GET    | /api/stores                    | any         | List/filter/sort stores + ratings   |
| POST   | /api/stores                    | admin       | Create store                        |
| POST   | /api/stores/:storeId/ratings   | user        | Submit/modify rating                |
| GET    | /api/stores/owner/dashboard    | owner       | Owner dashboard                     |

## Notes

- All listing tables support ascending/descending sorting on key fields.
- JWT is stored in `localStorage`; a 401 response clears the session.
- Database schema enforces the rating range (1–5), unique (user, store) ratings, and
  name length at the column level in addition to API validation.
