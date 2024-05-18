# About
Reminder is calendar application designed for note-taking purposes. Upon authentication, users gain access to creating and modifying event notes. Users can specify whether an event occurs once or set up recurring schedules with flexible options. These notes are then conveniently delivered to users via email at their designated times.

# Architecture 
Frontend is made as a single-page application utilizing React, powered by Vite during development. On the backend Node.js server with Express framework. Persistent data storage is handled by PostgreSQL data base through TypeORM. Authentication is implemented via Google. Application is deployed on VPS environment.

# Example
Explore the application here: [Reminder](https://reminder.dmitryapps.cc)

# Tech stack
## Frontend
- Language - TypeScript
- Local development server - Vite 
- Components based approach - React
- App level state - React-Redux
- Routing - React Router
- Styling - React Bootstrap
- Authentication - Google OAuth

## Backend
- Language - TypeScript
- Routing - Express
- Request validation - Class Validator
- Database - PostgreSQL 
- ORM - TypeORM
- Scheduled jobs - Cron
- Email delivery - SendGrid
- Authentication - Google OAuth

## Testing
- Frontend E2E and component testing - Cypress
- Frontend unit and integration testing - Vitest
- Backend requests handling testing - Supertest
- Backend integration testing - Jest
