# Multi-Tenant SaaS Platform

This project is a full-stack **Multi-Tenant SaaS Application** designed and implemented to demonstrate real-world SaaS architecture principles such as tenant isolation, role-based access control, secure authentication, and scalable backend–frontend integration.

The application allows multiple tenants to operate independently within the same system while ensuring strict data isolation and security.

---

## 📌 Project Overview

The Multi-Tenant SaaS Platform enables organizations (tenants) to manage their own users, projects, and tasks. Each tenant’s data is fully isolated at the database query level, ensuring that no tenant can access another tenant’s information.

The system supports three roles:
- **Super Admin** – system-level control
- **Tenant Admin** – manages users, projects, and tasks within a tenant
- **User** – works on assigned projects and tasks

The application follows industry-standard backend and frontend practices and is suitable for production-grade SaaS systems.

---

## 🚀 Features

- Multi-tenant architecture with strict tenant isolation
- JWT-based authentication
- Role-based access control (RBAC)
- Tenant-scoped user management
- Project creation and management
- Task creation with status workflow
- Task status lifecycle: `todo → in_progress → done`
- User activation and deactivation
- Audit logging for important actions
- Secure backend APIs
- Role-aware frontend UI
- PostgreSQL constraints for data integrity

---

## 🛠 Tech Stack

### Backend
- Node.js
- Express.js
- PostgreSQL
- JWT Authentication

### Frontend
- React (Vite)
- Axios
- React Router DOM

### Database
- PostgreSQL

---

## 👥 User Roles & Permissions

| Role | Description |
|----|------------|
| super_admin | System-level administrator with global access |
| tenant_admin | Manages users, projects, and tasks within a tenant |
| user | Works on tasks and projects assigned by tenant admin |

---

## 🏗 Architecture Overview

- **Frontend** communicates with backend via REST APIs
- **Backend** enforces authentication and authorization
- **Tenant isolation** is enforced through SQL joins using `tenant_id`
- **PostgreSQL constraints** ensure valid task status values
- **JWT tokens** secure all protected routes
- **Audit logs** track critical actions

---

## 📂 Project Structure

multi-tenant-saas/
├── backend/
│ ├── src/
│ │ ├── controllers/
│ │ ├── routes/
│ │ ├── middleware/
│ │ └── config/
│ ├── migrations/
│ └── .env
├── frontend/
│ ├── src/
│ │ ├── pages/
│ │ ├── context/
│ │ └── services/
│ └── vite.config.js
├── docs/
│ ├── architecture.md
│ ├── api.md
│ └── database.md
└── README.md


---

## ⚙️ Setup Instructions

### 1️⃣ Database Setup

```bash
psql -U postgres
CREATE DATABASE saas_db;


---

## ✅ What to do now

1. Paste this into **README.md**
2. Commit it:
```bash
git add README.md
git commit -m "Add complete project README"

---

## 🐳 Docker Setup (Recommended)

This project supports full Docker-based setup.

### Prerequisites
- Docker Desktop
- Docker Compose

### Run with Docker

From the project root:

```bash
docker-compose up -d --build



👉 This **completes the README requirement**.

---

## 🔵 STEP 3 — Update docs/ (Very Small Change)

Add **one note** to `docs/architecture.md`:

Append this at the end:

```md
## Dockerized Deployment

The application is fully containerized using Docker Compose.
Separate containers are used for:
- PostgreSQL database
- Backend API service
- Frontend React application

This enables one-command deployment and environment consistency.

---

## 🐳 Docker Deployment

This project is fully containerized using Docker and Docker Compose.

### Run the application using Docker

From the project root:

```bash
docker-compose up -d --build
