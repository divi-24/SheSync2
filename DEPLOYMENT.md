# Deployment Guide for SheSync

This project is deployed across three services:
- **Frontend**: Vercel (Next.js)
- **Backend API**: Render (Node.js/Express)
- **ML API**: Render (Python/FastAPI)

## Vercel Deployment (Frontend)

### Environment Variables
Set these in your Vercel project settings:

```
NEXT_PUBLIC_API_URL=https://your-backend.onrender.com
```

### Deployment Steps
1. Push your code to GitHub
2. Connect repository to Vercel
3. Set environment variables in Vercel dashboard
4. Deploy

## Render Deployment (Backend API)

### Using render.yaml (Recommended)
The `backend/render.yaml` file automates deployment configuration.

### Manual Setup Steps
1. Create new Web Service on Render
2. Connect your GitHub repository
3. Set environment variables:
   - `NODE_ENV`: `production`
   - `PORT`: `10000` (Render provides this)
   - `FRONTEND_URL`: Your Vercel domain
   - `CORS_ORIGINS`: Your Vercel domain
   - `MONGO_URI`: Your MongoDB Atlas connection string
   - `JWT_SECRET`: A secure random string
   - `COOKIE_SECRET`: A secure random string
   - `CLOUDINARY_*`: Your Cloudinary credentials
   - `GEMINI_API_KEY`: Your Google Generative AI key
   - `GEMINI_MODEL`: `gemini-2.0-flash`

4. Build command: `npm install`
5. Start command: `npm start`
6. Deploy

## Render Deployment (ML API)

### Using render.yaml (Recommended)
The `SheSyncML/render.yaml` file automates deployment configuration.

### Manual Setup Steps
1. Create new Web Service on Render
2. Connect your GitHub repository
3. Set environment variables:
   - `PYTHONUNBUFFERED`: `1`

4. Python version: `3.11`
5. Build command: `pip install -r requirements.txt`
6. Start command: `uvicorn main:app --host 0.0.0.0 --port 10000`
7. Deploy

## Environment Configuration

### Local Development (.env.local)
```
NEXT_PUBLIC_API_URL=http://localhost:5000
```

### Backend .env
Copy from `backend/.env.example` and fill in your actual values.

### MongoDB
- Development: Use local MongoDB or MongoDB Atlas free tier
- Production: Use MongoDB Atlas with IP whitelist

## Important Notes

1. **Port Configuration**: Render assigns port 10000 by default. Update if needed.
2. **CORS Setup**: Always add your frontend URL to `CORS_ORIGINS`
3. **ML Model Files**: Ensure `.pth` and `.pkl` files are in SheSyncML directory
4. **Large Files**: Use Git LFS for model files if >100MB
5. **API URLs**: 
   - Frontend should call `/api/...` (proxied by Next.js rewrite)
   - Backend calls ML API at: `https://your-ml-api.onrender.com/predict`

## Monitoring & Logs

- Render: Check logs in Service Dashboard → Logs tab
- Vercel: Check deployments at vercel.com dashboard
- Monitor API health: `GET /api/health` on backend

## Troubleshooting

### CORS Errors
- Check `CORS_ORIGINS` includes your Vercel domain
- Frontend must use same domain as `FRONTEND_URL`

### API Connection Issues
- Verify `NEXT_PUBLIC_API_URL` in Vercel environment
- Check backend service is running (Render dashboard)
- Test backend health: `curl https://your-backend.onrender.com/api/health`

### ML API Issues
- Verify model files are in repository
- Check Python version (3.11+)
- Verify CUDA is not required (using CPU)

## Production Checklist

- [ ] All environment variables set in Render/Vercel
- [ ] MongoDB Atlas configured with IP whitelist
- [ ] Cloudinary account configured
- [ ] Google Generative AI API key valid
- [ ] Frontend URL added to backend CORS_ORIGINS
- [ ] Backend URL set as NEXT_PUBLIC_API_URL in Vercel
- [ ] ML model files present in SheSyncML directory
- [ ] Test all API endpoints in production
- [ ] SSL certificate configured (automatic on Vercel/Render)
- [ ] Analytics and error tracking configured
