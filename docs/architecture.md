# Multi-Tenant SaaS Architecture

## Overview
This project implements a multi-tenant SaaS backend with strict tenant isolation,
role-based access control (RBAC), and audit logging.

## Architecture
- Frontend: React (Vite)
- Backend: Node.js (Express, ES Modules)
- Database: PostgreSQL
- Authentication: JWT
- Authorization: Role-based (super_admin, tenant_admin, user)

## Tenant Isolation
- Each tenant has isolated data
- All queries join through tenant_id
- No cross-tenant access is possible

## Roles
- Super Admin: System-level access
- Tenant Admin: Manage users, projects, tasks
- User: Work on assigned projects/tasks
