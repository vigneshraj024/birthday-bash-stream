# Railway Deployment Guide - Birthday Bash Application

This guide will help you deploy both the **frontend** (React/Vite) and **backend** (Express Pixverse Proxy) to Railway.

## 📋 Prerequisites

1. **Railway Account**: Sign up at [railway.app](https://railway.app)
2. **GitHub Repository**: Push your code to GitHub (Railway works best with Git)
3. **Environment Variables**: Have your API keys ready (Pixverse API Key, Supabase credentials)

---

## 🚀 Deployment Strategy

Railway will deploy **two separate services** from the same repository:
- **Service 1**: Backend (Express server in `/server` folder)
- **Service 2**: Frontend (React/Vite app in root)

---

## 📦 Step 1: Prepare Your Repository

### 1.1 Create Railway Configuration Files

We'll create configuration files to tell Railway how to build and deploy each service.

### 1.2 Backend Configuration

Create `railway.backend.json` in the **root** directory:

```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS",
    "buildCommand": "cd server && npm install"
  },
  "deploy": {
    "startCommand": "cd server && npm start",
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

### 1.3 Frontend Configuration

Create `railway.frontend.json` in the **root** directory:

```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS",
    "buildCommand": "npm install && npm run build"
  },
  "deploy": {
    "startCommand": "npm run preview -- --host 0.0.0.0 --port $PORT",
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

---

## 🔧 Step 2: Update Frontend Package.json

Add a preview script to serve the built frontend. Update `package.json`:

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "build:dev": "vite build --mode development",
    "lint": "eslint .",
    "preview": "vite preview"
  }
}
```

> **Note**: The `preview` script is already there, but ensure it exists.

---

## 🌐 Step 3: Deploy to Railway

### Option A: Deploy via Railway Dashboard (Recommended)

#### 3.1 Deploy Backend Service

1. Go to [railway.app](https://railway.app) and create a **New Project**
2. Select **Deploy from GitHub repo**
3. Choose your repository
4. Railway will auto-detect your project
5. Click **Add variables** and set:
   - `PIXVERSE_API_KEY`: Your Pixverse API key
   - `PORT`: `3001` (or leave empty, Railway auto-assigns)
6. Go to **Settings** → **Service Name**: Rename to `backend`
7. Under **Settings** → **Root Directory**: Set to `server`
8. Under **Settings** → **Start Command**: Set to `npm start`
9. Under **Settings** → **Build Command**: Set to `npm install`
10. Click **Deploy**

#### 3.2 Deploy Frontend Service

1. In the same Railway project, click **New Service**
2. Select **Deploy from GitHub repo** → Choose the same repository
3. Click **Add variables** and set:
   - `VITE_SUPABASE_URL`: Your Supabase URL
   - `VITE_SUPABASE_ANON_KEY`: Your Supabase anon key
   - `VITE_PIXVERSE_PROXY_URL`: `https://backend-production.up.railway.app` (use your backend URL from step 3.1)
4. Go to **Settings** → **Service Name**: Rename to `frontend`
5. Under **Settings** → **Root Directory**: Leave as `/` (root)
6. Under **Settings** → **Build Command**: Set to `npm install && npm run build`
7. Under **Settings** → **Start Command**: Set to `npm run preview -- --host 0.0.0.0 --port $PORT`
8. Click **Deploy**

### Option B: Deploy via Railway CLI

```bash
# Install Railway CLI
npm i -g @railway/cli

# Login to Railway
railway login

# Create a new project
railway init

# Deploy backend
railway up --service backend --detach

# Deploy frontend
railway up --service frontend --detach
```

---

## 🔐 Step 4: Configure Environment Variables

### Backend Environment Variables

In Railway Dashboard → Backend Service → Variables:

```env
PIXVERSE_API_KEY=your_pixverse_api_key_here
PORT=3001
NODE_ENV=production
```

### Frontend Environment Variables

In Railway Dashboard → Frontend Service → Variables:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_PIXVERSE_PROXY_URL=https://your-backend-service.up.railway.app
```

> **Important**: Replace `https://your-backend-service.up.railway.app` with the actual URL Railway assigns to your backend service.

---

## 🔗 Step 5: Update Frontend to Use Backend URL

Update your frontend code to use the Railway backend URL.

### 5.1 Create/Update `.env.production` file:

```env
VITE_PIXVERSE_PROXY_URL=https://your-backend-service.up.railway.app
```

### 5.2 Update API calls in your frontend code

Ensure your frontend uses the environment variable:

```typescript
// Example in VideoGenerator.tsx or similar
const PROXY_URL = import.meta.env.VITE_PIXVERSE_PROXY_URL || 'http://localhost:3001';

// Upload image
const uploadResponse = await fetch(`${PROXY_URL}/api/pixverse/upload-image`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ image: base64Image })
});
```

---

## 📊 Step 6: Monitor Deployment

### Check Deployment Status

1. Go to Railway Dashboard
2. Click on each service (backend/frontend)
3. View **Deployments** tab to see build logs
4. Check **Metrics** for performance

### View Logs

```bash
# Using Railway CLI
railway logs --service backend
railway logs --service frontend
```

Or view in Railway Dashboard → Service → **Logs** tab

---

## ✅ Step 7: Verify Deployment

### Test Backend

```bash
curl https://your-backend-service.up.railway.app/health
```

Expected response:
```json
{
  "status": "ok",
  "message": "Pixverse proxy server is running"
}
```

### Test Frontend

Visit: `https://your-frontend-service.up.railway.app`

---

## 🐛 Troubleshooting

### Backend Issues

**Problem**: Backend not starting
- **Solution**: Check logs for errors, ensure `PIXVERSE_API_KEY` is set

**Problem**: CORS errors
- **Solution**: Update CORS settings in `server/index.js`:

```javascript
app.use(cors({
  origin: ['https://your-frontend-service.up.railway.app', 'http://localhost:5173'],
  credentials: true
}));
```

### Frontend Issues

**Problem**: Build fails
- **Solution**: Check Node version, Railway uses Node 18+ by default

**Problem**: API calls fail
- **Solution**: Verify `VITE_PIXVERSE_PROXY_URL` points to correct backend URL

**Problem**: Environment variables not working
- **Solution**: Rebuild the frontend after adding variables (they're baked into build)

---

## 🔄 Continuous Deployment

Railway automatically redeploys when you push to GitHub:

1. Make changes to your code
2. Commit and push to GitHub
3. Railway detects changes and redeploys automatically

To disable auto-deploy:
- Go to Service Settings → **Deployments** → Toggle off **Auto Deploy**

---

## 💰 Pricing Considerations

Railway offers:
- **Free Tier**: $5 credit/month (good for testing)
- **Developer Plan**: $5/month + usage
- **Team Plan**: $20/month + usage

Each service consumes resources. Monitor usage in Dashboard.

---

## 📝 Quick Reference

### Backend Service
- **Root Directory**: `server`
- **Build Command**: `npm install`
- **Start Command**: `npm start`
- **Port**: Auto-assigned by Railway

### Frontend Service
- **Root Directory**: `/` (root)
- **Build Command**: `npm install && npm run build`
- **Start Command**: `npm run preview -- --host 0.0.0.0 --port $PORT`
- **Port**: Auto-assigned by Railway

---

## 🎉 Next Steps

1. ✅ Deploy backend service
2. ✅ Deploy frontend service
3. ✅ Configure environment variables
4. ✅ Update frontend to use backend URL
5. ✅ Test the application
6. ✅ Set up custom domain (optional)

---

## 🆘 Need Help?

- **Railway Docs**: https://docs.railway.app
- **Railway Discord**: https://discord.gg/railway
- **Railway Status**: https://status.railway.app

---

## 📌 Important Notes

> [!WARNING]
> **Environment Variables**: Frontend environment variables (VITE_*) are baked into the build. If you change them, you must **redeploy** the frontend.

> [!IMPORTANT]
> **Backend URL**: After deploying the backend, copy its Railway URL and set it as `VITE_PIXVERSE_PROXY_URL` in the frontend service variables, then redeploy the frontend.

> [!TIP]
> **Custom Domains**: You can add custom domains in Railway Dashboard → Service → Settings → Domains

---

Good luck with your deployment! 🚀
