Team Task Manager - Ethara.AI Assessment
=================

Team Task Manager is a full-stack task and project management application built for teams and departments.
It provides user authentication, project creation, member management, task assignments, status updates, and dashboard analytics.

Features
--------
- User signup and login with JWT authentication
- Create and manage projects
- Add or remove project members
- Create tasks and assign them to users
- Update task status (todo, in-progress, done)
- View tasks assigned to a user and tasks grouped by project
- Dashboard statistics for project task counts
- Protected backend routes for authenticated operations

Tech Stack
----------
- Frontend: React, Vite, axios, react-router-dom, Chart.js / recharts
- Backend: Node.js, Express, Sequelize
- Authentication: JWT with bcrypt password hashing
- Database: SQL database via Sequelize (configured in `backend/.env`)
- CORS-enabled API for frontend/backend communication

Project Structure
-----------------
- `backend/`
  - `app.js` - Express server setup and API route registration
  - `routes/` - Auth, project, task, and user routes
  - `controllers/` - Login and signup controllers
  - `models/` - Sequelize models for User, Project, Task, Team
  - `middleware/` - Authentication middleware
  - `.env` - Backend environment configuration

- `frontend/`
  - `src/` - React application source code
  - `components/` - UI components for Login, Signup, Projects, Tasks, Dashboard
  - `public/` - Static assets
  - `.env` - Vite environment variable for API base URL

Environment Variables
---------------------
Backend (`backend/.env`):
- `PORT=5000`
- `DB_NAME=task_manager`
- `DB_USER=root`
- `DB_PASS=issue123`
- `JWT_SECRET=secret123`

Frontend (`frontend/.env`):
- `VITE_API_URL=http://localhost:5000`

Setup Instructions
------------------
1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/team-task-manager.git
   cd team-task-manager
   ```

2. Setup backend:
   ```bash
   cd backend
   npm install
   ```
   - Create the database configured in `backend/.env`.
   - Update `.env` values if needed.
   - Start the backend server:
   ```bash
   npm run dev
   ```

3. Setup frontend:
   ```bash
   cd ../frontend
   npm install
   npm run dev
   ```

4. Open the frontend URL shown by Vite (usually `http://localhost:5173`) and use the app.

Usage
-----
- Register a new user or login with an existing account.
- Create a project and assign members.
- Add tasks to projects and set task status.
- View tasks assigned to the logged-in user.
- Use the dashboard to review task progress.
