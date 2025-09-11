# Vercel Setup Instructions

## After getting your Railway URL:

1. **Go to Vercel Dashboard** → Your Project → Settings → Environment Variables
2. **Add/Update**:
   - **Name**: `NEXT_PUBLIC_SERVER_URL`
   - **Value**: `https://your-railway-url.railway.app` (replace with actual URL)
3. **Redeploy** your project

## Vercel Project Settings:
- **Framework Preset**: Next.js
- **Root Directory**: `frontend`
- **Build Command**: `npm run build`
- **Output Directory**: (leave blank)

## Test URLs:
- Frontend: `https://your-vercel-url.vercel.app`
- Backend API: `https://your-railway-url.railway.app/api/status`
- WebSocket: `wss://your-railway-url.railway.app/ws`
