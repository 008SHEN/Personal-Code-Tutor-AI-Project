#!/bin/bash

echo "================================"
echo "   Code Tutor AI - Quick Start"
echo "================================"
echo

# Check if Ollama is running
echo "[1/4] Checking Ollama..."
if curl -s http://localhost:11434/api/version > /dev/null 2>&1; then
    echo "✅ Ollama is running"
else
    echo "❌ Ollama not running. Please start Ollama first:"
    echo "   ollama serve"
    echo
    exit 1
fi

# Check if backend dependencies are installed
echo "[2/4] Checking backend dependencies..."
cd backend
if python -c "import fastapi, uvicorn" > /dev/null 2>&1; then
    echo "✅ Backend dependencies ready"
else
    echo "❌ Backend dependencies not installed. Installing..."
    pip install -r requirements.txt
fi

# Check if frontend dependencies are installed
echo "[3/4] Checking frontend dependencies..."
cd ..
if [ ! -d "node_modules" ]; then
    echo "❌ Frontend dependencies not installed. Installing..."
    npm install
else
    echo "✅ Frontend dependencies ready"
fi

echo "[4/4] Starting servers..."
echo
echo "Starting backend server..."
echo "(This may take 5-10 minutes on first run)"
echo

# Start backend in background
cd backend
python -m uvicorn open_webui.main:app --host 0.0.0.0 --port 8080 --reload &
BACKEND_PID=$!

# Return to root directory
cd ..

# Wait a moment then start frontend
sleep 3

echo "Starting frontend server..."
npm run dev &
FRONTEND_PID=$!

echo
echo "================================"
echo "   🚀 Code Tutor AI Started!"
echo "================================"
echo
echo "Backend:  http://localhost:8080"
echo "Frontend: http://localhost:5173"
echo
echo "Wait for both servers to fully start, then open:"
echo "http://localhost:5173"
echo
echo "Press Ctrl+C to stop both servers"

# Wait for interrupt
wait $FRONTEND_PID $BACKEND_PID