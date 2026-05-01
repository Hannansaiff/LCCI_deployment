# LCCI — Layyah Chamber of Commerce & Industry

Full-stack web application with a **Next.js 14** frontend and a **Python FastAPI** backend.

---

## Project Structure

```
LCCI-main/
├── lcci-site/                  ← Next.js 14 frontend (Admin panel + public site)
│   ├── src/
│   │   ├── app/                ← Next.js App Router pages
│   │   │   ├── (marketing)/    ← Public-facing pages
│   │   │   ├── admin/          ← Admin CMS panel
│   │   │   └── api/auth/       ← NextAuth endpoints
│   │   ├── components/         ← Reusable UI components
│   │   └── lib/                ← Shared utilities (API client, DB, auth)
│   ├── prisma/                 ← Prisma schema + SQLite database
│   └── backend-python/         ← FastAPI backend (public API)
└── README.md
```

---

## Quick Start (Local Development)

### Prerequisites
- **Node.js** 18+ and **npm**
- **Python** 3.10+

---

### Step 1 — Start the Backend (Python FastAPI)

```bash
cd lcci-site/backend-python

# On Linux/Mac:
bash run.sh

# On Windows:
run.bat
```

This will:
1. Create a Python virtual environment
2. Install all dependencies
3. Initialize the SQLite database with seed data
4. Start the API at **http://localhost:8000**

> API docs available at **http://localhost:8000/docs**
>
> Default admin credentials for backend: `admin` / `admin123`

---

### Step 2 — Start the Frontend (Next.js)

Open a **new terminal**:

```bash
cd lcci-site

# Install dependencies
npm install

# Generate Prisma client
npx prisma generate

# Push schema to SQLite (first time only)
npx prisma db push

# Seed the admin database
npm run db:seed

# Start development server
npm run dev
```

Frontend runs at **http://localhost:3000**

---

### Admin Panel

Go to **http://localhost:3000/admin/login**

Default credentials (set by seed):
- **Username:** `admin`
- **Password:** `admin123`

> ⚠️ Change the password after first login.

---

## Environment Variables

### Frontend (`lcci-site/.env`)
| Variable | Default | Description |
|----------|---------|-------------|
| `DATABASE_URL` | `file:./prisma/prisma/dev.db` | SQLite database path |
| `NEXTAUTH_URL` | `http://localhost:3000` | Frontend URL |
| `NEXTAUTH_SECRET` | *(set this!)* | Random secret for JWT |
| `NEXT_PUBLIC_API_URL` | `http://localhost:8000` | Backend API URL |

### Backend (`lcci-site/backend-python/.env`)
| Variable | Default | Description |
|----------|---------|-------------|
| `DATABASE_URL` | `sqlite:///./data/lcci.db` | Backend SQLite DB |
| `SECRET_KEY` | *(set this!)* | JWT secret key |
| `ALLOWED_ORIGINS` | `["http://localhost:3000"]` | CORS allowed origins |
| `UPLOAD_DIR` | `./uploads` | File upload directory |

---

## Architecture Notes

- The **frontend admin panel** uses **Prisma + SQLite** directly for CMS data
- The **public-facing pages** fetch data from the **Python FastAPI backend**
- Both databases can share the same data if you prefer — or run independently
- File uploads are stored in `public/uploads/` (frontend) and `uploads/` (backend)
