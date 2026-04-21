# Hotel Reservation System (HRS)

This is a full-stack Hotel Reservation System developed as a final project for an Internet Programming & Database Application course. The platform is designed similarly to booking.com, allowing guests to search, filter, and book rooms with real-time availability management.

## 🚀 Technologies

*   **Frontend**: React 18, Vite, TailwindCSS (v3), React Router v6, Axios, react-hook-form
*   **Backend**: PHP 8.3, Laravel 11 (REST API format), Sanctum (Cookie/Token Auth)
*   **Database**: SQLite (Development) / MySQL 8.0 (Production Scalable)
*   **DevOps**: Docker, Docker Compose, GitHub Actions (CI/CD)

## 📦 Project Architecture 
The project utilizes a distinct decoupled client-server architecture. 
- `hrs-frontend/`: A Single Page Application (SPA) providing the user interface.
- `hrs-backend/`: A REST API serving JSON payloads exclusively and managing database operations.

Both systems are natively containerized and can be launched together using Docker or independently leveraging built-in CLI commands.

---

## 🛠 Setup & Installation

### Option 1: Run with Docker Compose (Recommended)
This approach does not require Node.js or PHP to be installed locally. You only need Docker.

1. Clone the repository and navigate into the folder:
   ```bash
   cd HRS
   ```
2. Start the application stack:
   ```bash
   docker compose up -d --build
   ```
3. The services will bind automatically securely to your host:
   - **Frontend UI**: http://localhost:5173
   - **Backend API**: http://localhost:8000

*(Note: Migrations and SQLite database seeding are automatically triggered upon booting the backend container).*

### Option 2: Local Bare-Metal Setup
You will need Node.js `24.x` and PHP `8.2+` alongside Composer.

**1. Setup the Backend API:**
```bash
cd hrs-backend
composer install
cp .env.example .env
php artisan key:generate
touch database/database.sqlite
php artisan migrate:fresh --seed
php artisan serve
# Running on http://127.0.0.1:8000
```

**2. Setup the Frontend SPA:**
```bash
cd hrs-frontend
npm install
npm run dev
# Running on http://localhost:5173
```

---

## 👤 Test Accounts
The `DatabaseSeeder` provides out-of-the-box working accounts to test user roles natively:

| Role | Email | Password | Capability |
| :--- | :--- | :--- | :--- |
| Super Admin | `admin@hrs.com` | `password` | Has unrestricted Extranet dashboard bypass to all reservations. |
| Hotel Admin | `manager@hrs.com` | `password` | Restricting property reservations mapping views. |
| Authenticated Guest | `guest@hrs.com` | `password` | Normal guest account capable of saving bookings. |
| Standard Guest | `sarah@hrs.com` | `password` | Secondary isolated guest account. |

---

## ⚙️ DevOps & CI/CD
This repository is configured with a robust integration workflow via **GitHub Actions** (`.github/workflows/ci.yml`). 
Whenever new commits are pushed to the `main` or `dev` branch, our pipeline verifies:
1. The **Backend** passes Laravel Pint formatting and executes PHPUnit testing protocols.
2. The **Frontend** environment establishes safely against `npm ci` without critical NPM audit errors, and the Vite engine compiles successfully.

## 📝 Features List
- 🔒 **Cookie-based JSON Web Token (JWT)** utilizing Laravel Sanctum.
- 🏨 Detailed filtering system (Date overlapping checks preventing double-booking).
- ✨ Interactive booking flow utilizing React hooks.
- 💳 Real-time booking dashboard management.
- 📊 Fully responsive implementation across breakpoints conforming to Tailwind defaults.
