# ThunderBird Deployment Guide for Vercel

This guide explains how to deploy the ThunderBird Quantum-Secured Space Communications System to Vercel with both frontend and backend services.

## Project Structure

```
thunderbird/
├── frontend/                 # Next.js frontend application
│   ├── package.json
│   ├── src/
│   └── ...
├── server/                   # Main Go backend service
│   ├── main.go              # Original server implementation
│   ├── api.go               # Vercel serverless function
│   └── go.mod
├── simulator/               # Satellite simulator Go service
│   ├── satelite.go         # Original simulator implementation
│   ├── api.go              # Vercel serverless function
│   └── go.mod
└── vercel.json             # Vercel deployment configuration
```

## Updated Vercel Configuration

The `vercel.json` file has been updated to include:

### Builds Configuration
- **Frontend**: Next.js application from `frontend/package.json`
- **Server API**: Go serverless function from `server/api.go`
- **Simulator API**: Go serverless function from `simulator/api.go`

### Routing Configuration
- `/api/server/*` → Server API endpoints
- `/api/simulator/*` → Simulator API endpoints
- `/ws` → WebSocket endpoint (server)
- `/telemetry` → Satellite telemetry endpoint (simulator)
- `/api/status` → System status endpoint
- `/api/mode` → System mode control endpoint
- `/*` → Frontend application (catch-all)

### Environment Variables
- `SIMULATOR_URL`: Points to simulator API
- `QUANTUM_URL`: Points to server API
- `PORT`: Server port configuration

## Key Changes Made

### 1. Serverless Function Adaptation
- Created `server/api.go` and `simulator/api.go` as Vercel-compatible serverless functions
- Removed persistent WebSocket connections (not supported in serverless)
- Added proper CORS headers for cross-origin requests
- Implemented mock data generation for demonstration purposes

### 2. Go Module Updates
- Added `github.com/vercel/vercel-go` dependency to both Go modules
- Updated module configurations for serverless deployment

### 3. API Endpoints
- **Server API** (`/api/server/*`):
  - `/api/status` - Get system status
  - `/api/mode` - Set system mode (realtime/scenario)
  - `/ws` - WebSocket endpoint (returns fallback message)

- **Simulator API** (`/api/simulator/*`):
  - `/telemetry` - Get satellite telemetry data

## Deployment Steps

### 1. Prerequisites
- Vercel account
- GitHub repository with the updated code
- Node.js and Go installed locally (for testing)

### 2. Deploy to Vercel

#### Option A: Vercel CLI
```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy from project root
vercel

# Follow the prompts to configure the project
```

#### Option B: GitHub Integration
1. Connect your GitHub repository to Vercel
2. Vercel will automatically detect the `vercel.json` configuration
3. Deploy with default settings

### 3. Environment Variables Setup
In your Vercel dashboard, set these environment variables:
- `SIMULATOR_URL`: `https://your-project.vercel.app/api/simulator`
- `QUANTUM_URL`: `https://your-project.vercel.app/api/server`
- `PORT`: `8080`

### 4. Custom Domain (Optional)
- Configure a custom domain in Vercel dashboard
- Update environment variables with your custom domain

## API Usage Examples

### Get System Status
```bash
curl https://your-project.vercel.app/api/status
```

### Set System Mode
```bash
curl -X POST https://your-project.vercel.app/api/mode \
  -H "Content-Type: application/json" \
  -d '{"mode": "scenario"}'
```

### Get Satellite Telemetry
```bash
curl https://your-project.vercel.app/telemetry
```

## Frontend Integration

The frontend can now connect to the deployed APIs:

```javascript
// Example API calls from frontend
const API_BASE = 'https://your-project.vercel.app';

// Get system status
const response = await fetch(`${API_BASE}/api/status`);
const data = await response.json();

// Get satellite telemetry
const telemetry = await fetch(`${API_BASE}/telemetry`);
const satellites = await telemetry.json();
```

## Limitations and Considerations

### Serverless Limitations
- **No persistent WebSocket connections**: WebSocket endpoints return fallback messages
- **Cold starts**: First requests may be slower due to serverless cold starts
- **Execution time limits**: Functions have 30-second timeout
- **Memory limits**: Server has 1GB, Simulator has 512MB

### Recommended Alternatives
For production use with WebSocket support, consider:
- **Railway**: For persistent server deployments
- **Fly.io**: For containerized deployments
- **AWS/GCP/Azure**: For full control over infrastructure

## Testing Locally

### Test Frontend
```bash
cd frontend
npm install
npm run dev
```

### Test Go Services
```bash
# Server
cd server
go run api.go

# Simulator
cd simulator
go run api.go
```

## Troubleshooting

### Common Issues
1. **Build failures**: Check Go version compatibility (1.22.4)
2. **CORS errors**: Verify CORS headers in API responses
3. **Environment variables**: Ensure all required env vars are set
4. **Routing issues**: Check `vercel.json` route configuration

### Debugging
- Check Vercel function logs in the dashboard
- Use `vercel logs` command for CLI debugging
- Test API endpoints individually

## Next Steps

1. **Update frontend**: Modify frontend to use polling instead of WebSocket
2. **Add authentication**: Implement proper API authentication
3. **Database integration**: Add persistent data storage
4. **Monitoring**: Set up logging and monitoring
5. **Performance optimization**: Optimize for serverless execution

## Support

For issues with this deployment:
1. Check Vercel documentation
2. Review Go serverless function guidelines
3. Test locally before deploying
4. Monitor function logs for errors
