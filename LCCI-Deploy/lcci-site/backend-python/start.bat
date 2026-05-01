@echo off
echo.
echo ============================================
echo LCCI Backend - Windows Setup & Run
echo ============================================
echo.

REM Change to backend directory
cd /d C:\Users\HP\Desktop\LCCI\lcci-site\backend-python

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo Error: Python is not installed or not in PATH
    pause
    exit /b 1
)

REM Create virtual environment
if not exist "venv" (
    echo Creating virtual environment...
    python -m venv venv
)

REM Activate virtual environment
call venv\Scripts\activate.bat

REM Install dependencies
echo Installing dependencies...
pip install -q -r requirements.txt

REM Check if .env exists
if not exist ".env" (
    echo Creating .env file...
    copy .env.example .env
    echo Please edit .env with your database credentials
)

REM Start the server
echo.
echo ============================================
echo Starting LCCI Backend API Server...
echo ============================================
echo.
echo API URL: http://localhost:8000
echo Docs:    http://localhost:8000/docs
echo.

python main.py

pause
