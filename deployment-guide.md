# ThunderBird Deployment Guide

## 🚀 Railway Services Deployment

### 1. Main Go Server
- **Repository**: Sekhar03/THUNDERBIRD
- **Root Directory**: `server`
- **Build Command**: `go build -o main .`
- **Start Command**: `./main`
- **Environment Variables** (set after getting other URLs):
  - `SIMULATOR_URL` = `https://your-simulator.railway.app`
  - `QUANTUM_URL` = `https://your-quantum.railway.app`

### 2. Satellite Simulator
- **Repository**: Sekhar03/THUNDERBIRD
- **Root Directory**: `simulator`
- **Build Command**: `go build -o simulator .`
- **Start Command**: `./simulator`

### 3. Quantum Key Service
- **Repository**: Sekhar03/THUNDERBIRD
- **Root Directory**: `server/quantum`
- **Build Command**: `pip install -r requirements.txt`
- **Start Command**: `python quantum_server.py`

## 🔧 Vercel Configuration

### Environment Variables to Set:
```
NEXT_PUBLIC_SERVER_URL=https://your-main-server.railway.app
NEXT_PUBLIC_SIMULATOR_URL=https://your-simulator.railway.app
NEXT_PUBLIC_QUANTUM_URL=https://your-quantum.railway.app
```

### Steps:
1. Go to Vercel → Your Project → Settings → Environment Variables
2. Add each variable above
3. Save and Redeploy

## 🧪 Testing URLs

After deployment, test these endpoints:

- **Main Server Health**: `https://your-server.railway.app/api/status`
- **Simulator Data**: `https://your-simulator.railway.app/`
- **Quantum Service Health**: `https://your-quantum.railway.app/health`
- **Frontend**: `https://your-vercel-app.vercel.app`

## 📋 Deployment Checklist

- [ ] Deploy Main Go Server to Railway
- [ ] Deploy Satellite Simulator to Railway  
- [ ] Deploy Quantum Service to Railway
- [ ] Get all Railway URLs
- [ ] Set environment variables in Vercel
- [ ] Set environment variables in Main Server Railway project
- [ ] Redeploy Vercel
- [ ] Test all services
- [ ] Verify frontend connects to backend
