# ThunderBird Deployment Guide

This project deploys the frontend on Vercel and the long‑running Go services on Railway. Vercel proxies requests to the Railway backends via environment variables.

## 🚀 Updated Architecture

**Frontend (Vercel)**: Next.js application with API proxy routes
**Backend Services (Railway)**: Go services running as persistent servers
**Communication**: Frontend API routes proxy requests to Railway services

## 🚀 Railway Services Deployment

### 1) Main Go Server (server/)
- Root: `server`
- Build: `go build -o main .`
- Start: `./main`
- Env (optional):
  - `SIMULATOR_URL` = `https://your-simulator.up.railway.app`
  - `QUANTUM_URL` = `https://your-quantum.up.railway.app`
  - `PORT` is provided by Railway automatically

### 2) Satellite Simulator (simulator/)
- Root: `simulator`
- Build: `go build -o simulator .`
- Start: `./simulator`
- `PORT` is provided by Railway automatically

### 3) Quantum Key Service (optional)
- Root: `server/quantum`
- Build: `pip install -r requirements.txt`
- Start: `python quantum_server.py`

## 🔧 Vercel (frontend with API proxy)

Vercel hosts the Next.js app in `frontend/` with API routes that proxy requests to Railway services. The API routes are located in `frontend/src/app/api/`.

### Environment variables to set in Vercel
```
SERVER_BASE_URL=https://your-server.up.railway.app
SIMULATOR_BASE_URL=https://your-simulator.up.railway.app
```

Steps:
1. Vercel → Project → Settings → Environment Variables
2. Add the two variables above (Production and, optionally, Preview)
3. Redeploy the project

### API Routes Created
- `/api/status` → Proxies to `${SERVER_BASE_URL}/api/status`
- `/api/mode` → Proxies to `${SERVER_BASE_URL}/api/mode`
- `/api/telemetry` → Proxies to `${SIMULATOR_BASE_URL}/telemetry`
- `/api/ws` → Proxies to `${SERVER_BASE_URL}/ws`

## 🧪 Verify after deploy

On your Vercel domain:
- Frontend home: `/`
- Env check: `/health` (shows whether the two envs are set)
- Diagnostics: `/api/ping`
- API proxy: `/api/status` → proxies to `${SERVER_BASE_URL}/status`
- WebSocket: `wss://<your-vercel-domain>/ws` → proxies to `${SERVER_BASE_URL}/ws`
- Simulator telemetry: `/telemetry` → proxies to `${SIMULATOR_BASE_URL}/telemetry`

If any of the above return 404, ensure the two env vars are set and redeploy.

## 📋 Checklist

- [ ] Deploy Main Go Server to Railway
- [ ] Deploy Satellite Simulator to Railway
- [ ] Copy both public Railway URLs
- [ ] Set `SERVER_BASE_URL` and `SIMULATOR_BASE_URL` in Vercel
- [ ] Redeploy Vercel
- [ ] Open `/health` and `/api/ping` on Vercel to validate envs
- [ ] Verify `/api/status`, `/ws`, and `/telemetry` work via Vercel
