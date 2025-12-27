# API Documentation

## Auth
POST /api/auth/login  
POST /api/auth/register  

## Users
GET /api/users  
PATCH /api/users/:id/status  

## Projects
GET /api/projects  
POST /api/projects  

## Tasks
GET /api/tasks?project_id=UUID  
POST /api/tasks  
PATCH /api/tasks/:id/status  

## Audit Logs
GET /api/audit-logs  

## Headers
Authorization: Bearer <JWT_TOKEN>
