@echo off
echo === LCCI Backend - Local Start ===

if not exist "data" mkdir data
if not exist "uploads" mkdir uploads

if not exist "venv" (
    echo Creating virtual environment...
    python -m venv venv
)

call venv\Scripts\activate

echo Installing dependencies...
pip install -r requirements.txt -q

echo Initializing database...
python init_db.py

echo.
echo Starting FastAPI server at http://localhost:8000
echo API docs at http://localhost:8000/docs
echo.
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
