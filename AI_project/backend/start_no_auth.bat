@echo off
echo Starting Open WebUI with authentication disabled...
set WEBUI_AUTH=false
set ENABLE_SIGNUP=false
cd /d "%~dp0"
python -m uvicorn open_webui.main:app --host 0.0.0.0 --port 8080 --reload
pause