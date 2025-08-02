@echo off
echo ================================
echo    Code Tutor AI - Real AI Mode
echo ================================
echo.

echo [1/4] Starting Ollama...
start "Ollama Server" cmd /k "ollama serve"
echo ✅ Ollama server starting...

echo.
echo [2/4] Waiting for Ollama to start...
timeout /t 5 /nobreak >nul

echo [3/4] Checking if Mistral is installed...
ollama list | findstr mistral >nul
if %errorlevel% neq 0 (
    echo ❌ Mistral not found. Installing...
    ollama pull mistral
) else (
    echo ✅ Mistral is available
)

echo.
echo [4/4] Starting backend and frontend...
echo.

REM Start backend in new window
start "Code Tutor AI - Backend" cmd /k "cd backend && set ENABLE_API_KEY=true && set ENABLE_SIGNUP=true && python -m uvicorn open_webui.main:app --host 0.0.0.0 --port 8080 --reload"

REM Wait a moment then start frontend
timeout /t 3 /nobreak >nul

echo Starting frontend server...
start "Code Tutor AI - Frontend" cmd /k "npm run dev"

echo.
echo ================================
echo    🤖 Real AI Mode Ready!
echo ================================
echo.
echo 1. Ollama:    Running with Mistral model
echo 2. Backend:   http://localhost:8080
echo 3. Frontend:  http://localhost:5175 (or next available port)
echo.
echo 🚀 Open your browser and go to the frontend URL
echo 📋 Choose "Real AI Mode" for actual AI responses
echo 🔧 If Ollama fails, choose "Development Mode" for testing
echo.
echo Press any key to open the frontend...
pause >nul
start http://localhost:5175