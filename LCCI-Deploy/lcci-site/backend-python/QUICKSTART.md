# LCCI Backend - Quick Start Guide

## 🚀 Getting Started

### 1. Prerequisites
- Python 3.8+
- MySQL 5.7+
- pip

### 2. Quick Setup (Windows)

```bash
cd backend-python
run.bat
```

For Linux/Mac:
```bash
cd backend-python
chmod +x run.sh
./run.sh
```

The script will:
- Create a virtual environment
- Install dependencies
- Create/update .env file
- Start the server

### 3. Manual Setup

```bash
# navigate to backend directory
cd backend-python

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Create .env file
copy .env.example .env  # On Linux/Mac: cp .env.example .env

# Update .env with your database credentials
# DATABASE_URL=mysql+pymysql://user:password@localhost:3306/lcci

# Run the server
python main.py
```

### 4. Database Setup

Make sure MySQL is running and the database is created:

```sql
CREATE DATABASE lcci;
```

Or the app will create tables automatically on first run.

### 5. Initialize Database (Optional)

To create default admin user and sample data:

```python
python init_db.py
```

Default credentials:
- Username: `admin`
- Password: `admin123`

⚠️ **Change this in production!**

## 📚 API Documentation

Once the server is running, visit:
- **Interactive Docs**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc  
- **Health Check**: http://localhost:8000/health

## 🐳 Docker Setup

### Using Docker Compose (Recommended)

```bash
cd backend-python
docker-compose up -d
```

This starts both MySQL and FastAPI backend automatically.

### Using Docker only

```bash
docker build -t lcci-backend .
docker run -p 8000:8000 --env-file .env lcci-backend
```

## 🔑 Authentication

All admin endpoints require JWT authentication:

### 1. Login
```bash
curl -X POST "http://localhost:8000/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"username": "admin", "password": "admin123"}'
```

Response:
```json
{
  "access_token": "eyJhbGc...",
  "token_type": "bearer"
}
```

### 2. Use Token
Include the token in the Authorization header:
```bash
curl -X GET "http://localhost:8000/api/services/" \
  -H "Authorization: Bearer eyJhbGc..."
```

## 📝 Environment Variables

Create `.env` file in `backend-python` directory:

```env
# Database Connection
DATABASE_URL=mysql+pymysql://username:password@localhost:3306/lcci

# Security (Change in production!)
SECRET_KEY=your-secret-key-here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# CORS
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001,https://yourdomain.com

# File Upload
UPLOAD_DIR=./uploads
MAX_FILE_SIZE=5242880

# Optional: reCAPTCHA for forms
RECAPTCHA_SECRET_KEY=

# Optional: Email notifications (for future implementation)
SMTP_SERVER=
SMTP_PORT=587
SMTP_EMAIL=
SMTP_PASSWORD=
```

## 📁 Project Structure

```
backend-python/
├── app/
│   ├── config.py          # Settings
│   ├── database.py        # DB connection
│   ├── models.py          # SQLAlchemy ORM models
│   ├── schemas.py         # Pydantic validation schemas
│   ├── security.py        # JWT & password handling
│   ├── utils.py           # Helper functions
│   └── routes/            # API endpoints
│       ├── auth.py        # Login/Register
│       ├── services.py    # Services CRUD
│       ├── events.py      # Events CRUD
│       ├── activities.py  # Activities CRUD
│       ├── leadership.py  # Leadership CRUD
│       ├── partners.py    # Partners CRUD
│       ├── memberships.py # Membership applications
│       ├── service_requests.py  # Service requests
│       ├── content.py     # Settings/Hero/About
│       ├── logs.py        # Activity logging
│       └── admin_users.py # Admin management
├── main.py                # FastAPI app entry
├── requirements.txt       # Dependencies
├── .env.example          # Env template
├── init_db.py            # DB initialization
├── test_api.py           # API testing utilities
├── run.bat/run.sh        # Startup scripts
├── Dockerfile            # Docker setup
├── docker-compose.yml    # Docker compose
└── README.md             # Full documentation
```

## 🧪 Testing

### Using Interactive Docs
Go to http://localhost:8000/docs and try endpoints directly!

### Using Python Script
```python
python test_api.py
```

### Using cURL
```bash
# List all services
curl http://localhost:8000/api/services/

# Submit membership application
curl -X POST http://localhost:8000/api/memberships/applications \
  -H "Content-Type: application/json" \
  -d '{
    "businessName": "My Business",
    "ownerName": "Owner Name",
    "address": "Business Address",
    "businessType": "Retail",
    "registrationNo": "12345",
    "contactNo": "03001234567",
    "email": "business@example.com"
  }'
```

## 🔗 Connecting Frontend

Update your Next.js frontend to use the backend API:

```typescript
// In your Next.js actions or fetch calls
const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export async function submitMembership(data) {
  const response = await fetch(`${API_BASE}/api/memberships/applications`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return response.json();
}
```

## 📦 Deployment

### For Production:

1. **Update .env**
   ```env
   SECRET_KEY=generate-strong-secret-key
   DATABASE_URL=production-database-url
   ALLOWED_ORIGINS=https://yourdomain.com
   ```

2. **Run with Gunicorn**
   ```bash
   pip install gunicorn
   gunicorn -w 4 -b 0.0.0.0:8000 main:app
   ```

3. **Use Docker**
   ```bash
   docker build -t lcci-backend:prod .
   docker run -p 8000:8000 --env-file .env.prod lcci-backend:prod
   ```

4. **Deploy to Cloud**
   - Azure App Service
   - AWS Lambda/EC2
   - DigitalOcean
   - Heroku
   - Render

## 🔒 Security Tips

- ✅ Change default admin password immediately
- ✅ Use strong SECRET_KEY (min 32 chars)
- ✅ Enable HTTPS in production
- ✅ Use environment variables for sensitive data
- ✅ Enable reCAPTCHA for public forms
- ✅ Set rate limiting on public endpoints
- ✅ Regular database backups
- ✅ Keep dependencies updated

## 🐛 Troubleshooting

### "Connection refused" error
- Ensure MySQL is running
- Check DATABASE_URL in .env
- Verify database credentials

### "Port 8000 already in use"
```bash
# Find and kill process using port 8000
netstat -ano | findstr :8000  # Windows
lsof -i :8000                  # Linux/Mac
```

### "ModuleNotFoundError"
```bash
# Reinstall dependencies
pip install -r requirements.txt --force-reinstall
```

### CORS errors
- Check ALLOWED_ORIGINS in .env
- Verify frontend URL is in the list
- Restart server after changing .env

## 📞 Support

For detailed API documentation, see [README.md](./README.md)

For issues:
1. Check if server is running: `http://localhost:8000/health`
2. Check .env file configuration
3. Check database connection
4. Review error messages in console

## 📈 Next Steps

1. ✅ Backend is running
2. Connect your Next.js frontend
3. Test all API endpoints
4. Set up file uploads handling
5. Configure email notifications
6. Set up reCAPTCHA
7. Deploy to production

Happy coding! 🎉
