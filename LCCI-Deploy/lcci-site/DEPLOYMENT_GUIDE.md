# Backend Deployment Guide

## Overview

This guide covers deploying the LCCI FastAPI backend to various platforms.

## Prerequisites

- ✅ Backend code complete
- ✅ MySQL database ready
- ✅ Environment variables configured
- ✅ Security credentials set up

## Local Production Build

### 1. Prepare Production Environment

```bash
cd backend-python

# Create production .env
cp .env.production .env.prod

# Edit .env.prod with production values
# DATABASE_URL, SECRET_KEY, RECAPTCHA_SECRET_KEY, etc.
```

### 2. Test Production Build Locally

```bash
# Install gunicorn
pip install gunicorn

# Run with gunicorn
gunicorn -w 4 -b 127.0.0.1:8000 main:app --env-file .env.prod
```

## Deployment Options

### Option 1: Azure App Service (Recommended for Azure)

#### Prerequisites
- Azure subscription
- Azure CLI installed

#### Steps

```bash
# 1. Create resource group
az group create --name lcci-rg --location eastus

# 2. Create App Service Plan
az appservice plan create --name lcci-plan --resource-group lcci-rg --sku B2 --is-linux

# 3. Create Web App
az webapp create \
  --resource-group lcci-rg \
  --plan lcci-plan \
  --name lcci-api \
  --runtime PYTHON:3.11

# 4. Configure deployment
cd backend-python
git init
git remote add azure <deployment-url>

# 5. Set environment variables
az webapp config appsettings set \
  --resource-group lcci-rg \
  --name lcci-api \
  --settings DATABASE_URL="mysql+..." SECRET_KEY="..." 

# 6. Deploy
git push azure main
```

### Option 2: Docker (Universal)

#### Build Image

```bash
cd backend-python

# Build Docker image
docker build -t lcci-backend:1.0 .

# Tag for registry
docker tag lcci-backend:1.0 myregistry.azurecr.io/lcci-backend:1.0

# Push to Azure Container Registry
docker push myregistry.azurecr.io/lcci-backend:1.0
```

#### Run Container

```bash
# Using Docker locally
docker run -p 8000:8000 \
  --env-file .env.prod \
  -v /var/www/uploads:/app/uploads \
  lcci-backend:1.0

# Using Docker Compose for production
docker-compose -f docker-compose.prod.yml up -d
```

### Option 3: Azure Container Instances

```bash
az container create \
  --resource-group lcci-rg \
  --name lcci-api \
  --image myregistry.azurecr.io/lcci-backend:1.0 \
  --cpu 1 --memory 1 \
  --port 8000 \
  --environment-variables \
    DATABASE_URL="mysql+..." \
    SECRET_KEY="..." \
  --registry-login-server myregistry.azurecr.io \
  --registry-username <username> \
  --registry-password <password>
```

### Option 4: DigitalOcean Apps

#### Setup

```yaml
# app.yaml
name: lcci-backend
services:
- name: api
  github:
    repo: your-org/your-repo
    branch: main
  build_command: pip install -r requirements.txt
  source_dir: backend-python
  http_port: 8000
  run_command: gunicorn -w 4 -b 0.0.0.0:8000 main:app
  envs:
  - key: DATABASE_URL
    value: ${db.mysql.connection_string}
  - key: SECRET_KEY
    value: ${SECRET_KEY}
```

Deploy:
```bash
doctl apps create --spec app.yaml
```

### Option 5: AWS (Lambda + RDS)

#### Using Zappa (for Lambda)

```bash
# Install zappa
pip install zappa

# Initialize
zappa init

# Configure zappa_settings.json
{
  "dev": {
    "app_function": "main.app",
    "runtime": "python3.11",
    "s3_bucket": "my-zappa-deployments",
    "environment_variables": {
      "DATABASE_URL": "...",
      "SECRET_KEY": "..."
    }
  }
}

# Deploy
zappa deploy dev

# Update
zappa update dev
```

### Option 6: Traditional VPS (Linode, Vultr, etc.)

#### Setup

```bash
# SSH into server
ssh root@your-server-ip

# Update system
apt update && apt upgrade -y

# Install Python and dependencies
apt install -y python3.11 python3.11-venv python3-pip nginx supervisor mysql-client

# Clone repository
git clone https://github.com/your-org/lcci.git
cd lcci/backend-python

# Create virtual environment
python3.11 -m venv venv
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create .env file
cp .env.example .env
nano .env  # Edit with your production values
```

#### Setup Supervisor (Process Manager)

```bash
# Create supervisor config
sudo nano /etc/supervisor/conf.d/lcci-backend.conf
```

```conf
[program:lcci-backend]
directory=/root/lcci/backend-python
command=/root/lcci/backend-python/venv/bin/gunicorn -w 4 -b 127.0.0.1:8000 main:app
user=www-data
autostart=true
autorestart=true
stderr_logfile=/var/log/lcci-backend.err.log
stdout_logfile=/var/log/lcci-backend.out.log
```

```bash
# Enable and start
sudo supervisorctl reread
sudo supervisorctl update
sudo supervisorctl start lcci-backend
```

#### Setup Nginx (Reverse Proxy)

```bash
# Create nginx config
sudo nano /etc/nginx/sites-available/lcci-backend
```

```nginx
server {
    listen 80;
    server_name api.lcci.org.pk;
    client_max_body_size 50M;

    location / {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location /uploads {
        alias /var/www/lcci/uploads;
        expires 7d;
    }
}
```

```bash
# Enable site and restart nginx
sudo ln -s /etc/nginx/sites-available/lcci-backend /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

#### Setup SSL with Let's Encrypt

```bash
# Install certbot
sudo apt install -y certbot python3-certbot-nginx

# Generate certificate
sudo certbot certonly --nginx -d api.lcci.org.pk

# Update nginx config
sudo certbot --nginx -d api.lcci.org.pk
```

## Database Setup

### MySQL on Production Server

```bash
# Install MySQL
apt install -y mysql-server

# Secure installation
mysql_secure_installation

# Create database and user
mysql -u root -p
```

```sql
CREATE DATABASE lcci;
CREATE USER 'lcci_user'@'localhost' IDENTIFIED BY 'strong_password_here';
GRANT ALL PRIVILEGES ON lcci.* TO 'lcci_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

### Using Managed Database Service

- **Azure Database for MySQL**
- **AWS RDS for MySQL**
- **DigitalOcean Managed Database**

```bash
# Update CONNECTION_STRING in .env with managed database credentials
DATABASE_URL=mysql+pymysql://user:pass@db-host.com:3306/lcci
```

## Monitoring & Logging

### Application Logs

```bash
# View gunicorn logs
tail -f /var/log/lcci-backend.out.log
tail -f /var/log/lcci-backend.err.log

# Nginx logs
tail -f /var/log/nginx/access.log
tail -f /var/log/nginx/error.log
```

### Health Check

```bash
# Add monitoring endpoint
curl https://api.lcci.org.pk/health

# Set up uptime monitoring service
# - Uptime Robot
# - Pingdom
# - AWS CloudWatch
```

### Performance Monitoring

```bash
# View processes
ps aux | grep gunicorn

# Check system resources
free -h
df -h
top
```

## Backup & Recovery

### Database Backups

```bash
# Manual backup
mysqldump -u lcci_user -p lcci > lcci_backup_$(date +%Y%m%d).sql

# Automated daily backup
0 2 * * * /usr/bin/mysqldump -u lcci_user -p lcci > /backups/lcci_backup_$(date +\%Y\%m\%d).sql
```

### File Backups

```bash
# Backup uploads directory
tar -czf uploads_backup_$(date +%Y%m%d).tar.gz /var/www/lcci/uploads/

# Use S3 or similar for off-site backup
aws s3 sync /var/www/lcci/uploads s3://my-backup-bucket/lcci/
```

## Security Checklist

- [ ] Change all default passwords
- [ ] Update SECRET_KEY to random 32+ character string
- [ ] Enable HTTPS/SSL certificate
- [ ] Configure CORS for frontend only
- [ ] Set strong database password
- [ ] Enable firewall (ufw/iptables)
- [ ] Set up regular backups
- [ ] Enable automatic security updates
- [ ] Monitor logs for suspicious activity
- [ ] Set up rate limiting
- [ ] Keep dependencies updated
- [ ] Use environment variables for secrets
- [ ] Enable CSRF protection

## Rollback Strategy

```bash
# Keep previous version
cp -r backend-python backend-python.old

# Deploy update
git pull origin main

# If issues, rollback
rm -rf backend-python
mv backend-python.old backend-python

# Restart service
sudo supervisorctl restart lcci-backend
```

## Performance Optimization

### Gunicorn Workers

```bash
# Recommended: (CPU cores × 2) + 1
# For 2-core server:
gunicorn -w 5 -b 0.0.0.0:8000 main:app

# For 4-core server:
gunicorn -w 9 -b 0.0.0.0:8000 main:app
```

### Database Optimization

```sql
-- Add indexes for frequently queried fields
CREATE INDEX idx_service_slug ON Service(slug);
CREATE INDEX idx_event_slug ON Event(slug);
CREATE INDEX idx_activity_slug ON Activity(slug);
CREATE INDEX idx_member_status ON MembershipApplication(status);
```

### Caching

Consider adding Redis for:
- Session management
- Cache frequently accessed data
- Rate limiting

```bash
# Install Redis
apt install -y redis-server

# Add to requirements.txt
echo "redis==5.0.0" >> requirements.txt
```

## Maintenance

### Regular Tasks

```bash
# Weekly: Check disk space
df -h

# Weekly: Update dependencies
pip list --outdated

# Monthly: Review logs
grep ERROR /var/log/lcci-backend.err.log

# Monthly: Database optimization
mysqlcheck -u lcci_user -p lcci -a
```

### Emergency Contacts

Document:
- [ ] Database admin contact
- [ ] Server admin contact
- [ ] Domain registrar contact
- [ ] SSL certificate provider
- [ ] Backup location documentation

## Troubleshooting

### Service Won't Start

```bash
# Check logs
sudo journalctl -u lcci-backend -n 50

# Test configuration
python main.py

# Check database connection
python -c "from app.database import engine; engine.connect()"
```

### High CPU Usage

```bash
# Check running processes
top -p $(pgrep -f gunicorn)

# Increase worker timeout
gunicorn -w 4 --timeout 120 -b 0.0.0.0:8000 main:app
```

### Database Connection Errors

```bash
# Test MySQL connection
mysql -h host -u user -p -e "SELECT 1"

# Check MySQL status
systemctl status mysql
```

## Support Resources

- FastAPI: https://fastapi.tiangolo.com/
- Gunicorn: https://gunicorn.org/
- Nginx: https://nginx.org/
- MySQL: https://dev.mysql.com/
- Docker: https://docs.docker.com/

---

**Questions?** Refer to the README.md and QUICKSTART.md files for more information.
