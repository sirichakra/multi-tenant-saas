-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- -------------------------
-- SUPER ADMIN
-- -------------------------
INSERT INTO users (
  id,
  tenant_id,
  email,
  password_hash,
  full_name,
  role
)
VALUES (
  uuid_generate_v4(),
  NULL,
  'superadmin@system.com',
  '$2b$10$702mdpU1/mN/L5J24IMWae8bASt.NJZFFHq69QAnsQ.Ydth8DZyxu',
  'System Admin',
  'super_admin'
);

-- -------------------------
-- TENANT
-- -------------------------
INSERT INTO tenants (
  id,
  name,
  subdomain,
  status,
  subscription_plan,
  max_users,
  max_projects
)
VALUES (
  uuid_generate_v4(),
  'Demo Company',
  'demo',
  'active',
  'pro',
  25,
  15
);

-- -------------------------
-- TENANT ADMIN
-- -------------------------
INSERT INTO users (
  id,
  tenant_id,
  email,
  password_hash,
  full_name,
  role
)
SELECT
  uuid_generate_v4(),
  t.id,
  'admin@demo.com',
  '$2b$10$702mdpU1/mN/L5J24IMWae8bASt.NJZFFHq69QAnsQ.Ydth8DZyxu',
  'Demo Admin',
  'tenant_admin'
FROM tenants t
WHERE t.subdomain = 'demo';

-- -------------------------
-- REGULAR USERS
-- -------------------------
INSERT INTO users (
  id,
  tenant_id,
  email,
  password_hash,
  full_name,
  role
)
SELECT
  uuid_generate_v4(),
  t.id,
  'user1@demo.com',
  '$2b$10$702mdpU1/mN/L5J24IMWae8bASt.NJZFFHq69QAnsQ.Ydth8DZyxu',
  'Demo User One',
  'user'
FROM tenants t
WHERE t.subdomain = 'demo';

INSERT INTO users (
  id,
  tenant_id,
  email,
  password_hash,
  full_name,
  role
)
SELECT
  uuid_generate_v4(),
  t.id,
  'user2@demo.com',
  '$2b$10$702mdpU1/mN/L5J24IMWae8bASt.NJZFFHq69QAnsQ.Ydth8DZyxu',
  'Demo User Two',
  'user'
FROM tenants t
WHERE t.subdomain = 'demo';
