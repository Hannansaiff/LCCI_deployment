# Deployment Guide - LCCI Website

## Overview
This guide helps you deploy both the Next.js frontend and FastAPI backend for FREE without buying a domain.

## Architecture
```
┌─────────────────────────┐
│   Your Desktop/Browser  │
└────────────┬────────────┘
             │
             ▼
┌─────────────────────────┐
│  Vercel (Frontend)      │  ← your-site.vercel.app
│  Next.js                │
└────────────┬────────────┘
             │
             ▼
┌─────────────────────────┐
│  Railway (Backend)      │  ← your-api.railway.app
│  FastAPI Python         │
└────────────┬────────────┘
             │
             ▼
┌─────────────────────────┐
│  PlanetScale (MySQL)    │  ← Cloud Database
│  Database               │
└─────────────────────────┘
```

## Step 1: Prepare Database (PlanetScale)

### 1.1 Create PlanetScale Account
- Go to https://planetscale.com
- Sign up (free tier available)
- Create a new MySQL database named `lcci_db`

### 1.2 Get Connection String
- In PlanetScale dashboard, click "Connect"
- Select "Node.js" driver
- Copy your `DATABASE_URL` - looks like:
```
mysql://xxxxxxx:pscale_pw_xxxx@aws.connect.psdb.cloud/lcci_db?sslaccept=strict
```

**Save this somewhere safe! You'll need it later.** 📝

## Step 2: Deploy Backend (FastAPI) on Railway

### 2.1 Create Railway Account
- Go to https://railway.app
- Click "Start Project"
- Sign in with GitHub

### 2.2 Create New Project
- Select "Deploy from GitHub"
- Connect your GitHub account
- Select this repository: `your-github-username/LCCI`

### 2.3 Configure Environment Variables
In Railway dashboard, go to Variables and add:

```
DATABASE_URL=mysql://xxxxxxx:pscale_pw_xxxx@aws.connect.psdb.cloud/lcci_db?sslaccept=strict
SECRET_KEY=your-super-secret-random-string-here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
ALLOWED_ORIGINS=["https://your-vercel-domain.vercel.app"]
UPLOAD_DIR=/tmp/uploads
MAX_FILE_SIZE=5242880
SMTP_SERVER=
SMTP_PORT=587
SMTP_EMAIL=
SMTP_PASSWORD=
RECAPTCHA_SECRET_KEY=
```

### 2.4 Deploy
- Railway will automatically detect the Dockerfile
- Click "Deploy"
- Wait for build to complete (5-10 minutes)

### 2.5 Get Backend URL
- In Railway, go to "Settings"
- Find "Domain" section
- You'll get something like: `lcci-backend.railway.app`
- Your API URL: `https://lcci-backend.railway.app`

**Save this URL! You'll need it for frontend.** 🔗

## Step 3: Deploy Frontend (Next.js) on Vercel

### 3.1 Create Vercel Account
- Go to https://vercel.com
- Click "Sign Up"
- Select "Continue with GitHub"

### 3.2 Import Project
- Click "New Project"
- Select "Import Git Repository"
- Choose `LCCI` repository

### 3.3 Project Settings
- Framework: Next.js (auto-detected)
- Root Directory: `./lcci-site`

### 3.4 Environment Variables
Set these environment variables in Vercel:

```
DATABASE_URL=mysql://xxxxxxx:pscale_pw_xxxx@aws.connect.psdb.cloud/lcci_db?sslaccept=strict
NEXTAUTH_URL=https://your-vercel-domain.vercel.app
NEXTAUTH_SECRET=your-super-secret-random-string
NEXT_PUBLIC_API_URL=https://lcci-backend.railway.app
ADMIN_EMAIL=admin@lcci.local
SMTP_HOST=
SMTP_PORT=587
SMTP_USER=
SMTP_PASS=
SMTP_FROM=noreply@lcci.local
RECAPTCHA_SECRET_KEY=
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=
```

### 3.5 Deploy
- Click "Deploy"
- Wait for build (2-3 minutes)
- You'll get: `your-project.vercel.app`

## Step 4: Update Configurations

### 4.1 Update Backend CORS
Since you now have frontend URL, update Backend environment variable:
```
ALLOWED_ORIGINS=["https://your-project.vercel.app"]
```

### 4.2 Verify Connections
- Go to your frontend URL
- Try to login or make an API call
- Check if it connects to backend

## Step 5: Share Your Site! 🎉

Your site is now live at:
```
https://your-project.vercel.app
```

Share this link with anyone you want! No domain purchase needed.

---

## Troubleshooting

### Database Connection Error
- Verify DATABASE_URL is correct
- Check PlanetScale credentials
- Make sure database exists

### API Connection Error
- Verify NEXT_PUBLIC_API_URL in Vercel
- Check if Railway backend is running
- Check CORS settings in backend

### Build Fails
- Check logs in Vercel/Railway dashboard
- Verify all environment variables are set
- Make sure Node.js version is compatible

---

## Cost Breakdown (All FREE)

| Service | Cost | Limit |
|---------|------|-------|
| Vercel | Free | 100GB bandwidth/month |
| Railway | Free | $5/month credit (usually enough) |
| PlanetScale | Free | 5GB storage |

---

## Next Steps (Optional)
1. Add custom domain when you buy one
2. Set up email notifications (SMTP)
3. Configure reCAPTCHA
4. Set up monitoring and logging

---

**Questions?** Let me know! 👋
