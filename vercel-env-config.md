# Vercel Environment Variables Configuration

## Required Environment Variables

Add these environment variables in your Vercel project settings:

### 1. Main Backend Server
- **Name**: `NEXT_PUBLIC_SERVER_URL`
- **Value**: `https://your-server.railway.app`
- **Description**: Main Go server with API and WebSocket endpoints

### 2. Satellite Simulator
- **Name**: `NEXT_PUBLIC_SIMULATOR_URL`
- **Value**: `https://your-simulator.railway.app`
- **Description**: Satellite position and data simulator

### 3. Quantum Key Service
- **Name**: `NEXT_PUBLIC_QUANTUM_URL`
- **Value**: `https://your-quantum.railway.app`
- **Description**: Quantum encryption key generation service

## How to Set in Vercel:

1. Go to your Vercel project dashboard
2. Click **Settings** → **Environment Variables**
3. Add each variable above
4. Click **Save**
5. **Redeploy** your project

## Example URLs (replace with your actual Railway URLs):

```
NEXT_PUBLIC_SERVER_URL=https://thunderbird-server-production.up.railway.app
NEXT_PUBLIC_SIMULATOR_URL=https://thunderbird-simulator-production.up.railway.app
NEXT_PUBLIC_QUANTUM_URL=https://thunderbird-quantum-production.up.railway.app
```

## Testing Your Services:

- **Main Server**: `https://your-server.railway.app/api/status`
- **Simulator**: `https://your-simulator.railway.app/`
- **Quantum Service**: `https://your-quantum.railway.app/health`
