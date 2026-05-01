#!/bin/bash
set -e

echo "=== LCCI Backend — Local Start ==="

# Create data directory for SQLite
mkdir -p data uploads

# Create virtual environment if missing
if [ ! -d "venv" ]; then
  echo "Creating virtual environment..."
  python3 -m venv venv
fi

# Activate venv
source venv/bin/activate

# Install dependencies
echo "Installing dependencies..."
pip install -r requirements.txt -q

# Initialize database with seed data
echo "Initializing database..."
python init_db.py

# Start server
echo ""
echo "Starting FastAPI server at http://localhost:8000"
echo "API docs at http://localhost:8000/docs"
echo ""
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
