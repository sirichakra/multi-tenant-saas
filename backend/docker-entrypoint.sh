#!/bin/sh
set -e

echo "Waiting for database..."
sleep 5

echo "Running migrations..."

for file in migrations/*.sql; do
  echo "Running $file"
  psql "$DATABASE_URL" -f "$file"
done

echo "Starting backend..."
npm run dev
