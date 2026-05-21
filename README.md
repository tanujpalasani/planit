# PlanIt - MERN Project Management Tool

This project is a MERN application with role-based access:
- `Admin`: manages members, projects, and tasks
- `Member`: works on assigned tasks/subtasks

## Architecture

- **Frontend**: React + Vite (served in production by Nginx)
- **Backend**: Node.js + Express
- **Database**: MongoDB
- **Container Orchestration**: Docker Compose
- **Cloud Deployment (Backend)**: Render

Runtime flow:
- Browser -> Frontend container (`nginx`, port `80`)
- Frontend -> Backend API (`/api` proxied by nginx to backend container)
- Backend -> MongoDB container

---

## 1) Run Locally (without Docker)

### Prerequisites
- Node.js 20+
- MongoDB running locally (or MongoDB Atlas URI)

### Backend
```bash
cd server
cp .env.example .env
npm install
npm run dev
```

### Frontend
```bash
cd client
npm install
npm run dev
```

App URLs:
- Frontend: `http://localhost:5173`
- Backend: `http://localhost:5000`
- Health check: `http://localhost:5000/api/health`

---

## 2) Docker Setup

### Files Added
- `server/Dockerfile`
- `client/Dockerfile`
- `client/nginx.conf`
- `docker-compose.yml`
- `.dockerignore` files for both client and server

### Build and Run (Docker Compose)
From project root:
```bash
docker compose up --build -d
```

Check running containers:
```bash
docker compose ps
```

View logs:
```bash
docker compose logs -f backend
docker compose logs -f frontend
docker compose logs -f mongo
```

Stop:
```bash
docker compose down
```

Stop and remove DB volume too:
```bash
docker compose down -v
```

### URLs (Docker)
- Frontend: `http://localhost`
- Backend API direct: `http://localhost:5000/api`
- Health: `http://localhost:5000/api/health`

---

## 3) Standalone Docker Commands (without Compose)

### Backend
```bash
docker build -t planit-backend ./server
docker run -d --name planit-backend -p 5000:5000 \
  -e PORT=5000 \
  -e JWT_SECRET=change_this_secret \
  -e MONGO_URI="your_mongo_connection_string" \
  planit-backend
```

### Frontend
```bash
docker build -t planit-frontend ./client
docker run -d --name planit-frontend -p 80:80 planit-frontend
```

Note: standalone frontend container expects API proxy target named `backend` (as in compose). For standalone usage, either:
- run with compose, or
- update `client/nginx.conf` proxy target to your backend host and rebuild frontend image.

---

## 4) Backend Deployment on Render

## Render Service Type
- Create **Web Service** from your `server` folder/repository.
- Optional: use the included `render.yaml` (Blueprint deploy).

## Render Settings
- Build Command:
```bash
npm install
```
- Start Command:
```bash
npm start
```
- Root Directory: `server` (if monorepo root contains both client/server)

## Environment Variables on Render
Set these in Render dashboard:
- `NODE_ENV=production`
- `PORT=10000` (Render usually injects this automatically)
- `JWT_SECRET=<strong_secret>`
- `MONGO_URI=<your_mongodb_atlas_uri>`
- `CORS_ORIGIN=<your_frontend_domain>` (comma-separated if multiple)

## Verify Deployment
- Health endpoint should return `200 OK`:
  - `https://<your-render-service>.onrender.com/api/health`

## Deployment Link
- `https://planit-backend-5qgs.onrender.com`

---

## 5) Notes on Frontend-Backend Connectivity

- In development: frontend defaults to `http://localhost:5000/api`
- In Docker production build: frontend uses relative `/api`, and nginx proxies to backend container
- For separate production frontend hosting, set:
  - `VITE_API_BASE_URL=https://<render-backend-url>/api`

---

## 6) Frontend Deployment on Vercel (Optional but Recommended)

### Vercel Project Settings
- Framework Preset: `Vite`
- Root Directory: `client`
- Build Command: `npm run build`
- Output Directory: `dist`

### Environment Variables on Vercel
- `VITE_API_BASE_URL=https://planit-backend-5qgs.onrender.com/api`

### Important Backend CORS Update
In Render backend env var `CORS_ORIGIN`, include your Vercel domain too, for example:
- `https://your-frontend.vercel.app,http://localhost:5173,http://localhost`

### Verify Frontend Deployment
- Open your Vercel URL and test login/signup flows.
- Confirm API calls are going to:
  - `https://planit-backend-5qgs.onrender.com/api`
