# THUNDERBIRD

A multi-component project combining a Next.js frontend, a Go server and simulator, and a Python quantum script.

## Contents
- **Frontend**: Next.js app with Tailwind CSS (rontend/)
- **Server**: Go HTTP server (server/)
- **Simulator**: Go-based satellite simulator (simulator/)
- **Quantum**: Python Qiskit script (server/quantum/)

## Quick start

### Prerequisites
- Node.js 18+ and npm
- Go 1.20+
- Python 3.10+ (for quantum script)

### Frontend (Next.js)
`ash
cd frontend
npm install
npm run dev
`
Then open http://localhost:3000.

### Go server
`ash
cd server
go mod download
go run main.go
`

### Simulator
`ash
cd simulator
go mod download
go run satelite.go
`

### Quantum script (Python / Qiskit)
`ash
cd server/quantum
python -m venv .venv
. .venv/Scripts/Activate.ps1  # PowerShell on Windows
pip install qiskit
python my_qiskit_script.py
`

## Project structure
`
THUNDERBIRD/
 frontend/              # Next.js application
   src/app/            # App router pages/layout
   src/components/     # UI components
   public/             # Static assets
 server/                # Go backend
   quantum/            # Python Qiskit script
 simulator/             # Go simulator
 README.md
`

## Development notes
- Node/Go/Python build artifacts and env files are ignored via .gitignore.
- Default branch is main. Pushes are tracked to origin/main.

## License
Add your preferred license here (e.g., MIT).
