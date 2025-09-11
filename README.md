# THUNDERBIRD

A multi-component project combining a Next.js frontend, a Go server and simulator, and a Python quantum script.

## Features
- **Real-time satellite visualization**: 3D Earth and orbiting satellites rendered with Three.js (SatelliteVisualization, EarthView).
- **Scenario modes**: Switch between different operational scenarios and visualization modes (ScenarioMode).
- **AI threat detection (UI scaffold)**: Placeholder module to integrate ML/AI detections for anomalies or threats (AIThreatDetection).
- **Analytics dashboard**: KPIs, tables, and cards for mission analytics (AnalyticsDashboard, ui/*).
- **Voice control (UI scaffold)**: Hook up speech-to-text for hands-free control (VoiceControl).
- **Light/Dark theme**: Toggle with Tailwind-based design system (ThemeToggle).
- **Go backend**: Simple HTTP server scaffold to extend with APIs (server/).
- **Go simulator**: Satellite simulator entry point (simulator/satelite.go).
- **Quantum demo**: Python + Qiskit script for quantum experimentation (server/quantum/).

## Prerequisites
- Node.js 18+ and npm
- Go 1.20+
- Python 3.10+ (only if running the quantum script)

## How to run

### 1) Frontend (Next.js)
- Dev server:
`ash
cd frontend
npm install
npm run dev
`
Open http://localhost:3000.

- Production build (optional):
`ash
cd frontend
npm run build
npm run start
`

### 2) Go server
`ash
cd server
go mod download
go run main.go
`
Default port can be adjusted inside server/main.go.

### 3) Simulator (Go)
`ash
cd simulator
go mod download
go run satelite.go
`
Extend this to emit telemetry or interact with the frontend/backend.

### 4) Quantum script (Python / Qiskit)
`ash
cd server/quantum
python -m venv .venv
. .venv/Scripts/Activate.ps1  # PowerShell (Windows)
# source .venv/bin/activate   # bash/zsh (Linux/macOS)
pip install qiskit
python my_qiskit_script.py
`

## Project structure
`
THUNDERBIRD/
 frontend/              # Next.js application (Tailwind, components, app router)
 server/                # Go backend server
   quantum/            # Python Qiskit demo
 simulator/             # Go simulator
 README.md
`

## Configuration
- Environment variables: add any frontend secrets to rontend/.env.local and server secrets to a server-side .env or your OS key vault. No secrets are committed.
- Linting/formatting: uses ESLint config in rontend/ and Tailwind.

## Development tips
- If ports conflict, change them in rontend/next.config.ts (proxy) or server/main.go.
- Large assets go into rontend/public/.
- For Three.js performance, prefer instancing and memoization in React.

## Roadmap
- Wire AIThreatDetection and VoiceControl to real services.
- Build REST/WebSocket APIs in server/ and stream sim telemetry.
- Add tests and CI (GitHub Actions) for build/lint.

## License
Add your preferred license here (e.g., MIT).
