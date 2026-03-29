# Hospital Management System (CareSync)

A modern, full-stack Hospital Management System built with Spring Boot and React.

## Tech Stack
- **Backend**: Java 17, Spring Boot, Spring Data JPA, PostgreSQL
- **Frontend**: React, Vite, Tailwind CSS, Framer Motion
- **Icons**: React Icons (Md)
- **Styling**: Vanilla CSS + Tailwind

## Prerequisites
- **Java 17** or higher
- **Node.js** (v18+) and **npm**
- **PostgreSQL** Server (running on localhost:5432)

## Getting Started

### 1. Database Setup
- Ensure PostgreSQL is running.
- Create a database named `hospital_db`.
- Default credentials:
  - Username: `postgres`
  - Password: `postgres`

### 2. Backend Setup
```bash
cd backend
mvn clean install
mvn spring-boot:run
```
The backend will start on [http://localhost:8080](http://localhost:8080).

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
The frontend will start on [http://localhost:3000](http://localhost:3000) (or [http://localhost:3001](http://localhost:3001) if 3000 is in use).

## Recent Fixes
- **CORS Issue**: Updated `CorsConfig.java` to allow requests from both `localhost:3000` and `localhost:3001`.
- **Landing Page Crash**: Fixed a missing import for `MdLocalHospital` in `LandingPage.jsx`.

## Project Structure
- `/backend`: Spring Boot application.
- `/frontend`: React application.
