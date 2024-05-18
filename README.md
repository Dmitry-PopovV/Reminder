# About
Reminder is a calendar application designed for note-taking purposes. Upon authentication, users gain access to creating and modifying event notes. Users can specify whether an event occurs once or set up recurring schedules with flexible options. These notes are then conveniently delivered to users via email at their designated times.

# Architecture 
Frontend is made as a single-page application utilizing React.\
On the backend Node.js server powered by ExpressJS framework.\
Persistent data storage is handled by PostgreSQL database through TypeORM.\
Authentication is implemented via Google OAuth.\
Application is deployed on VPS environment.

# Example
Explore the application here: [Reminder](https://reminder.dmitryapps.cc)

# Tech stack
## Frontend
- TypeScript & React
- Development server - Vite  
- App level state - React-Redux
- Routing - React Router
- Styling - React Bootstrap
- Authentication - Google OAuth

## Backend
- TypeScript & ExpressJS 
- Data validation - Class Validator
- Database - PostgreSQL 
- ORM - TypeORM
- Scheduled jobs - Cron
- Email delivery - SendGrid
- Authentication - Google OAuth

## Testing
- Frontend E2E and component testing - Cypress
- Frontend unit and integration testing - Vitest
- Backend integration testing - Jest with Supertest
