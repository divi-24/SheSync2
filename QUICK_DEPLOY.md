# Quick Deployment Guide

## In 5 Minutes

### 1. Create Accounts
- Render.com (free tier available)
- Vercel.com (free tier available)
- MongoDB Atlas (free tier available)
- Google Cloud (Generative AI API)
- Cloudinary (free tier available)

### 2. Backend → Render
```bash
# In Render dashboard:
1. Create Web Service
2. Connect GitHub repo
3. Name: shesync-backend
4. Build: npm install
5. Start: npm start
6. Add env vars from DEPLOY_CHECKLIST.md
```

**Backend URL**: `https://shesync-backend.onrender.com`

### 3. ML API → Render
```bash
# In Render dashboard:
1. Create Web Service
2. Connect GitHub repo
3. Name: shesync-ml-api
4. Python 3.11
5. Build: pip install -r requirements.txt
6. Start: uvicorn main:app --host 0.0.0.0 --port 10000
```

**ML URL**: `https://shesync-ml-api.onrender.com`

### 4. Frontend → Vercel
```bash
# In Vercel dashboard:
1. Import Project from GitHub
2. Framework: Next.js
3. Add env: NEXT_PUBLIC_API_URL=https://shesync-backend.onrender.com
4. Deploy
```

**Frontend URL**: `https://your-project.vercel.app`

### 5. Update Backend CORS
After Vercel deploy completes:
1. Go to Render → shesync-backend → Environment
2. Update `FRONTEND_URL` = your Vercel URL
3. Update `CORS_ORIGINS` = your Vercel URL
4. Redeploy

## Test It

```bash
# Backend health
curl https://shesync-backend.onrender.com/api/health

# ML API health
curl https://shesync-ml-api.onrender.com/health

# Frontend
Open https://your-project.vercel.app in browser
```

## Environment Variables Quick List

### Backend (Render)
```
NODE_ENV=production
PORT=10000
MONGO_URI=<mongodb-uri>
FRONTEND_URL=<vercel-url>
CORS_ORIGINS=<vercel-url>
JWT_SECRET=<random-string>
COOKIE_SECRET=<random-string>
CLOUDINARY_CLOUD_NAME=<name>
CLOUDINARY_API_KEY=<key>
CLOUDINARY_API_SECRET=<secret>
GEMINI_API_KEY=<key>
GEMINI_MODEL=gemini-2.0-flash
```

### ML (Render)
```
PYTHONUNBUFFERED=1
CORS_ORIGINS=<vercel-url>
```

### Frontend (Vercel)
```
NEXT_PUBLIC_API_URL=https://shesync-backend.onrender.com
```

## Troubleshooting

| Issue | Solution |
|-------|----------|
| CORS errors | Check CORS_ORIGINS in backend settings |
| API 502 error | Backend might still be starting, wait 1-2 mins |
| Can't find models | Ensure .pth and .pkl files are in repo |
| Python import errors | Check requirements.txt versions match |
| Frontend blank page | Check Network tab for API errors |

## Auto-Deploy

Once connected, GitHub pushes auto-deploy to all 3 services. No manual redeploy needed.

## Monitoring

- Render: Dashboard → Logs
- Vercel: https://vercel.com/dashboard
- MongoDB Atlas: https://cloud.mongodb.com

## Help

1. Read DEPLOYMENT.md for detailed steps
2. Check DEPLOY_CHECKLIST.md for verification
3. See render.yaml files for service config
4. Check GitHub workflow in .github/workflows/deploy.yml
