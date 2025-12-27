# Database Design

## Tables
- tenants
- users
- projects
- tasks
- audit_logs

## Constraints
- tasks.status CHECK ('todo','in_progress','done')
- Foreign keys enforce tenant isolation

## Multi-Tenant Strategy
All data access is scoped by tenant_id via joins.
