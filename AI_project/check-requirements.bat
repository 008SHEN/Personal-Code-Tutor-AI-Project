@echo off
echo ================================
echo   Code Tutor AI - Requirements Check
echo ================================
echo.

set "all_good=1"

REM Check Python
echo [1/4] Checking Python...
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Python not found. Install Python 3.11+ from https://www.python.org/
    set "all_good=0"
) else (
    for /f "tokens=2" %%i in ('python --version 2^>^&1') do set python_version=%%i
    echo ✅ Python found: %python_version%
)

REM Check Node.js
echo [2/4] Checking Node.js...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js not found. Install Node.js 18+ from https://nodejs.org/
    set "all_good=0"
) else (
    for /f %%i in ('node --version') do set node_version=%%i
    echo ✅ Node.js found: %node_version%
)

REM Check npm
echo [3/4] Checking npm...
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ npm not found. It should come with Node.js
    set "all_good=0"
) else (
    for /f %%i in ('npm --version') do set npm_version=%%i
    echo ✅ npm found: %npm_version%
)

REM Check Ollama
echo [4/4] Checking Ollama...
ollama --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Ollama not found. Install from https://ollama.ai/
    set "all_good=0"
) else (
    for /f "tokens=3" %%i in ('ollama --version 2^>^&1') do set ollama_version=%%i
    echo ✅ Ollama found: %ollama_version%
)

echo.
echo ================================

if "%all_good%"=="1" (
    echo ✅ All requirements satisfied!
    echo You can now run: .\start-app.bat
) else (
    echo ❌ Please install missing requirements above
)

echo ================================
echo.
pause