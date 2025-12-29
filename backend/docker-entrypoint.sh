#!/bin/sh

echo "Running migrations..."
psql "$DATABASE_URL" < /app/migrations/001_create_tenants.sql
psql "$DATABASE_URL" < /app/migrations/002_create_users.sql
psql "$DATABASE_URL" < /app/migrations/003_create_projects.sql
psql "$DATABASE_URL" < /app/migrations/004_create_tasks.sql
psql "$DATABASE_URL" < /app/migrations/005_create_audit_logs.sql

echo "Starting backend..."
npm run dev
