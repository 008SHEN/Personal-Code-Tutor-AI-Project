@echo off
echo ================================
echo    Code Tutor AI - Quick Start
echo ================================
echo.

REM Check if Ollama is running
echo [1/4] Checking Ollama...
curl -s http://localhost:11434/api/version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Ollama not running. Please start Ollama first:
    echo    ollama serve
    echo.
    pause
    exit /b 1
) else (
    echo ✅ Ollama is running
)

REM Check if backend dependencies are installed
echo [2/4] Checking backend dependencies...
cd backend
python -c "import fastapi, uvicorn" >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Backend dependencies not installed. Installing...
    pip install -r requirements.txt
) else (
    echo ✅ Backend dependencies ready
)

REM Check if frontend dependencies are installed
echo [3/4] Checking frontend dependencies...
cd ..
if not exist "node_modules" (
    echo ❌ Frontend dependencies not installed. Installing...
    npm install
) else (
    echo ✅ Frontend dependencies ready
)

echo [4/4] Starting servers...
echo.
echo Starting backend server...
echo (This may take 5-10 minutes on first run)
echo.

REM Start backend in new window
start "Code Tutor AI - Backend" cmd /k "cd backend && python -m uvicorn open_webui.main:app --host 0.0.0.0 --port 8080 --reload"

REM Wait a moment then start frontend
timeout /t 3 /nobreak >nul

echo Starting frontend server...
start "Code Tutor AI - Frontend" cmd /k "npm run dev"

echo.
echo ================================
echo    🚀 Code Tutor AI Started!
echo ================================
echo.
echo Backend:  http://localhost:8080
echo Frontend: http://localhost:5173
echo.
echo Wait for both servers to fully start, then open:
echo http://localhost:5173
echo.
pause