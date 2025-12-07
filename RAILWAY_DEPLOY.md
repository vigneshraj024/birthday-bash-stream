# Railway Deployment - Quick Start

## 🚀 Deploy Backend Server

### 1. Create Railway Project
```bash
# Install Railway CLI (optional)
npm install -g @railway/cli

# Login to Railway
railway login
```

### 2. Deploy from Dashboard

1. Go to https://railway.app
2. Click **"New Project"** → **"Deploy from GitHub repo"**
3. Select this repository
4. Railway will auto-detect Node.js

### 3. Configure Service

**Root Directory:** `server`

**Environment Variables:**
```
PIXVERSE_API_KEY=your_api_key_here
PORT=3001
```

**Build Command:** `npm install`

**Start Command:** `npm start`

### 4. Get Your Backend URL

After deployment, Railway provides a URL like:
```
https://birthday-bash-server-production.up.railway.app
```

**Copy this URL!** You'll need it for the frontend.

## 🎨 Deploy Frontend

### Option 1: Railway (Same Project)

1. In Railway project, click **"New Service"**
2. Select same GitHub repo
3. Configure:

**Root Directory:** `.` (leave empty or root)

**Build Command:** `npm install && npm run build`

**Start Command:** `npx serve -s dist -l $PORT`

**Environment Variables:**
```
VITE_BACKEND_URL=https://your-backend-url.railway.app
```

### Option 2: Vercel (Recommended for Frontend)

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel

# Set environment variable in Vercel dashboard
VITE_BACKEND_URL=https://your-backend-url.railway.app
```

## ✅ Verify Deployment

1. Visit your frontend URL
2. Submit a test birthday with Shinchan
3. Check if video generates correctly
4. Verify 16:9 aspect ratio

## 🔧 Update Production URL

Edit [`src/services/pixverseApi.ts`](file:///c:/Users/HP/Desktop/birthday_bash2/birthday-bash-stream-main/src/services/pixverseApi.ts):

```typescript
const BACKEND_URL = import.meta.env.PROD
    ? 'https://your-backend-url.railway.app'  // ← Update this
    : 'http://localhost:3001';
```

Or use environment variable (better):

```typescript
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';
```

## 📝 Deployment Checklist

- [ ] Backend deployed on Railway
- [ ] PIXVERSE_API_KEY environment variable set
- [ ] Backend URL copied
- [ ] Frontend deployed (Railway/Vercel)
- [ ] VITE_BACKEND_URL set to Railway backend URL
- [ ] Test video generation in production
- [ ] Verify Shinchan character accuracy
- [ ] Check 16:9 aspect ratio

## 🐛 Troubleshooting

### Backend Issues

**Check Logs:**
```bash
railway logs
```

**Common Issues:**
- Missing PIXVERSE_API_KEY
- Port binding errors (Railway sets PORT automatically)
- CORS errors (already configured)

### Frontend Issues

**404 on API calls:**
- Verify VITE_BACKEND_URL is correct
- Check backend is running
- Ensure no trailing slash in URL

**Build Fails:**
- Check Node.js version (18+)
- Verify all dependencies installed
- Check build command is correct

## 💰 Cost Estimate

**Railway:**
- Free tier: $5 credit/month
- Backend server: ~$5-10/month
- Frontend (if on Railway): ~$5/month

**Vercel (Frontend):**
- Free tier: Unlimited for personal projects
- Recommended for frontend

## 🔗 Useful Links

- Railway Dashboard: https://railway.app/dashboard
- Railway Docs: https://docs.railway.app
- Vercel Dashboard: https://vercel.com/dashboard
