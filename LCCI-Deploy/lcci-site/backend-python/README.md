# LCCI Backend API

FastAPI-based backend for the Layyah Chamber of Commerce & Industry (LCCI) website.

## Features

- **Admin Authentication**: JWT-based authentication for admin users
- **Content Management**: Manage events, activities, services, leadership, partners
- **Membership Management**: Handle membership applications with file uploads
- **Service Requests**: Process service requests with attachments
- **Activity Logging**: Track all admin actions
- **Bilingual Support**: English and Urdu content support
- **CORS Protection**: Configured for secure cross-origin requests

## Tech Stack

- **Framework**: FastAPI
- **Database**: MySQL with SQLAlchemy ORM
- **Authentication**: JWT with python-jose
- **Password Hashing**: bcrypt
- **File Uploads**: Python multipart
- **Server**: Uvicorn

## Installation

### Prerequisites

- Python 3.8+
- MySQL 5.7+
- pip

### Setup

1. Clone the repository and navigate to the backend directory:
```bash
cd backend-python
```

2. Create a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Create a `.env` file based on `.env.example`:
```bash
cp .env.example .env
```

5. Update your database credentials in `.env`:
```
DATABASE_URL=mysql+pymysql://username:password@localhost:3306/lcci
SECRET_KEY=your-secret-key-here
```

6. Run the server:
```bash
python main.py
```

The API will be available at `http://localhost:8000`

## API Documentation

Once the server is running, access the interactive API documentation:
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

## API Endpoints

### Authentication
- `POST /api/auth/login` - Login admin user
- `POST /api/auth/register` - Register new admin user (admin only)
- `GET /api/auth/me` - Get current logged-in user
- `POST /api/auth/logout` - Logout

### Services
- `GET /api/services/` - List all services
- `GET /api/services/{service_id}` - Get service by ID
- `GET /api/services/slug/{slug}` - Get service by slug
- `POST /api/services/` - Create service (admin)
- `PATCH /api/services/{service_id}` - Update service (admin)
- `DELETE /api/services/{service_id}` - Delete service (admin)

### Events
- `GET /api/events/` - List all events
- `GET /api/events/{event_id}` - Get event by ID
- `GET /api/events/slug/{slug}` - Get event by slug
- `POST /api/events/` - Create event (admin)
- `PATCH /api/events/{event_id}` - Update event (admin)
- `DELETE /api/events/{event_id}` - Delete event (admin)
- `POST /api/events/{event_id}/gallery` - Add gallery image (admin)
- `DELETE /api/events/{event_id}/gallery/{gallery_id}` - Delete gallery image (admin)

### Activities
- `GET /api/activities/` - List all activities
- `GET /api/activities/{activity_id}` - Get activity by ID
- `GET /api/activities/slug/{slug}` - Get activity by slug
- `POST /api/activities/` - Create activity (admin)
- `PATCH /api/activities/{activity_id}` - Update activity (admin)
- `DELETE /api/activities/{activity_id}` - Delete activity (admin)

### Leadership
- `GET /api/leadership/` - List all leadership members
- `GET /api/leadership/{member_id}` - Get member by ID
- `POST /api/leadership/` - Create member (admin)
- `PATCH /api/leadership/{member_id}` - Update member (admin)
- `DELETE /api/leadership/{member_id}` - Delete member (admin)

### Partners
- `GET /api/partners/` - List all partners
- `GET /api/partners/{partner_id}` - Get partner by ID
- `POST /api/partners/` - Create partner (admin)
- `PATCH /api/partners/{partner_id}` - Update partner (admin)
- `DELETE /api/partners/{partner_id}` - Delete partner (admin)

### Content Management
- `GET /api/content/settings` - Get site settings
- `PATCH /api/content/settings` - Update site settings (admin)
- `GET /api/content/hero` - Get hero section
- `PATCH /api/content/hero` - Update hero section (admin)
- `GET /api/content/about` - Get about content
- `PATCH /api/content/about` - Update about content (admin)
- `GET /api/content/why-choose` - List why choose items
- `POST /api/content/why-choose` - Create why choose item (admin)
- `PATCH /api/content/why-choose/{item_id}` - Update why choose item (admin)
- `DELETE /api/content/why-choose/{item_id}` - Delete why choose item (admin)

### Membership Applications
- `POST /api/memberships/applications` - Submit membership application
- `POST /api/memberships/applications/{app_id}/upload-cnic` - Upload CNIC document
- `POST /api/memberships/applications/{app_id}/upload-docs` - Upload business documents
- `GET /api/memberships/applications` - List all applications (admin)
- `GET /api/memberships/applications/{app_id}` - Get application by ID (admin)
- `PATCH /api/memberships/applications/{app_id}` - Update application status (admin)

### Service Requests
- `POST /api/service-requests/` - Create service request
- `POST /api/service-requests/{request_id}/upload-attachment` - Upload attachment
- `GET /api/service-requests/` - List all requests (admin)
- `GET /api/service-requests/{request_id}` - Get request by ID (admin)
- `PATCH /api/service-requests/{request_id}` - Update request status (admin)
- `DELETE /api/service-requests/{request_id}` - Delete request (admin)

### Activity Logs
- `GET /api/logs/` - List activity logs (admin)
- `GET /api/logs/stats` - Get activity statistics (admin)

### Admin Users
- `GET /api/admin/users/` - List all admin users (admin)
- `GET /api/admin/users/{user_id}` - Get admin user by ID (admin)
- `POST /api/admin/users/` - Create admin user (admin)
- `DELETE /api/admin/users/{user_id}` - Delete admin user (admin)

## Project Structure

```
backend-python/
├── app/
│   ├── __init__.py
│   ├── config.py           # Configuration management
│   ├── database.py         # Database connection
│   ├── models.py           # SQLAlchemy models
│   ├── schemas.py          # Pydantic schemas
│   ├── security.py         # Authentication & security
│   ├── utils.py            # Utility functions
│   └── routes/             # API route handlers
│       ├── __init__.py
│       ├── auth.py
│       ├── services.py
│       ├── events.py
│       ├── activities.py
│       ├── leadership.py
│       ├── partners.py
│       ├── memberships.py
│       ├── service_requests.py
│       ├── content.py
│       ├── logs.py
│       └── admin_users.py
├── main.py                 # FastAPI application entry point
├── requirements.txt        # Python dependencies
├── .env.example           # Environment variables example
└── README.md              # This file
```

## Environment Variables

Create a `.env` file with the following variables:

```
# Database
DATABASE_URL=mysql+pymysql://user:password@localhost:3306/lcci

# Security
SECRET_KEY=your-secret-key-here-change-in-production
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# CORS
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001

# File Upload
UPLOAD_DIR=./uploads
MAX_FILE_SIZE=5242880

# Optional: reCAPTCHA
RECAPTCHA_SECRET_KEY=

# Optional: Email notifications
SMTP_SERVER=
SMTP_PORT=587
SMTP_EMAIL=
SMTP_PASSWORD=
```

## Running with Docker

Build and run using Docker:

```bash
docker build -t lcci-backend .
docker run -p 8000:8000 --env-file .env lcci-backend
```

## Development

For development with auto-reload:

```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

## Database Migrations

The application automatically creates tables on startup. To view the database:

```bash
mysql -u your_user -p lcci
```

## Testing

To test the API endpoints, use:

1. **Swagger UI**: Navigate to http://localhost:8000/docs and use the interactive interface
2. **cURL**: Example below
3. **Postman**: Import the API endpoints

Example cURL request:

```bash
# Login
curl -X POST "http://localhost:8000/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"username": "admin", "password": "password"}'

# List services
curl -X GET "http://localhost:8000/api/services/" \
  -H "accept: application/json"
```

## Security Considerations

- Always use HTTPS in production
- Change `SECRET_KEY` to a strong random value
- Use environment variables for sensitive data
- Enable reCAPTCHA for public forms
- Implement rate limiting in production
- Set up proper backup strategies for the database
- Use strong passwords for admin accounts

## Performance Tips

- Use database indexes on frequently queried fields
- Implement caching for public endpoints
- Use pagination for large datasets
- Monitor database query performance
- Consider using Redis for session management

## Support

For issues or questions, please contact the development team.

## License

All rights reserved - LCCI
