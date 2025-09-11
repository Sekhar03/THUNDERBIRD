# Vercel Configuration After Railway Deployment

## After you get your 3 Railway URLs, follow these steps:

### 1. Update Vercel Environment Variables

**Go to your Vercel project dashboard:**
1. Click on your project
2. Go to **Settings** → **Environment Variables**
3. Add these variables:

```
NEXT_PUBLIC_SERVER_URL=https://your-server.railway.app
NEXT_PUBLIC_SIMULATOR_URL=https://your-simulator.railway.app
NEXT_PUBLIC_QUANTUM_URL=https://your-quantum.railway.app
```

### 2. Update Railway Environment Variables

**For your Main Go Server Railway project:**
1. Go to your Go Server project on Railway
2. Click **Variables** tab
3. Add these variables:

```
SIMULATOR_URL=https://your-simulator.railway.app
QUANTUM_URL=https://your-quantum.railway.app
```

### 3. Redeploy Everything

1. **Redeploy Vercel** (after setting environment variables)
2. **Redeploy all Railway services** (after setting environment variables)

### 4. Test Your Application

- **Frontend**: Your Vercel URL
- **Backend API**: `https://your-server.railway.app/api/status`
- **Simulator**: `https://your-simulator.railway.app/`
- **Quantum Service**: `https://your-quantum.railway.app/health`

## Expected Result

Your Vercel frontend should now connect to the Railway backend and show real data instead of "Connecting to Network"!
