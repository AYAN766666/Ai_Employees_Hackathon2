@echo off
echo ========================================
echo Backend Server Startup Script
echo ========================================
echo.

cd /d "E:\book1 - Copy - Copy\my-research-paper\backend"

echo [1/2] Setting temporary directory to E:\tmp...
set TEMP=E:\tmp
set TMP=E:\tmp

echo [2/2] Starting FastAPI server with uv...
echo.
echo Server will be available at:
echo   - http://localhost:8000
echo   - http://0.0.0.0:8000
echo.
echo API Documentation:
echo   - http://localhost:8000/docs
echo.
echo Press Ctrl+C to stop the server
echo ========================================
echo.

uv run python agent.py

pause
