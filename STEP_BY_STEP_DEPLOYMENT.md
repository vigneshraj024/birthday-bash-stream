# 🚀 Step-by-Step Railway Deployment Guide

This guide will walk you through deploying your Birthday Bash application to Railway, step by step.

---

## 📋 Prerequisites Checklist

Before starting, make sure you have:

- [ ] A Railway account (sign up at [railway.app](https://railway.app))
- [ ] Your code pushed to GitHub
- [ ] Pixverse API Key: `sk-8755922f136b65fcdb09d6f2eaee0572`
- [ ] Supabase URL: `https://pufvhbxblotdedjxbzsa.supabase.co`
- [ ] Supabase Anon Key (get from Supabase dashboard)

---

## 🎯 Overview

We'll deploy **TWO services**:
1. **Backend Service** (Express server for Pixverse API proxy)
2. **Frontend Service** (React/Vite application)

**Total Time**: ~15-20 minutes

---

## PART 1: Push Code to GitHub

### Step 1: Initialize Git (if not already done)

Open PowerShell in your project directory and run:

```powershell
cd C:\Users\HP\Desktop\birthday_bash2\birthday-bash-stream-main
git init
```

### Step 2: Add All Files

```powershell
git add .
```

### Step 3: Commit Your Code

```powershell
git commit -m "Prepare for Railway deployment"
```

### Step 4: Create GitHub Repository

1. Go to [github.com](https://github.com)
2. Click the **"+"** icon in top-right → **"New repository"**
3. Name it: `birthday-bash-stream`
4. Keep it **Public** or **Private** (your choice)
5. **DO NOT** initialize with README, .gitignore, or license
6. Click **"Create repository"**

### Step 5: Push to GitHub

Copy the commands from GitHub (they'll look like this):

```powershell
git remote add origin https://github.com/YOUR_USERNAME/birthday-bash-stream.git
git branch -M main
git push -u origin main
```

Replace `YOUR_USERNAME` with your actual GitHub username and run the commands.

✅ **Checkpoint**: Your code is now on GitHub!

---

## PART 2: Deploy Backend Service

### Step 6: Create Railway Project

1. Go to [railway.app](https://railway.app)
2. Click **"Login"** → Sign in with GitHub
3. Click **"New Project"**
4. Select **"Deploy from GitHub repo"**
5. **Authorize Railway** to access your GitHub (if prompted)
6. Select your repository: `birthday-bash-stream`

### Step 7: Configure Backend Service

Railway will create a service automatically. Now configure it:

1. **Click on the service card** (it will have your repo name)
2. Click **"Settings"** tab at the top
3. Scroll down to **"Service Name"** → Change to: `backend`
4. Scroll to **"Root Directory"** → Set to: `server`
5. Scroll to **"Build Command"** → Set to: `npm install`
6. Scroll to **"Start Command"** → Set to: `npm start`

### Step 8: Set Backend Environment Variables

1. Click **"Variables"** tab at the top
2. Click **"+ New Variable"**
3. Add these three variables:

**Variable 1:**
- Variable Name: `PIXVERSE_API_KEY`
- Value: `sk-8755922f136b65fcdb09d6f2eaee0572`

**Variable 2:**
- Variable Name: `PORT`
- Value: `3001`

**Variable 3:**
- Variable Name: `NODE_ENV`
- Value: `production`

4. Click **"Add"** for each variable

### Step 9: Deploy Backend

1. Click **"Deployments"** tab
2. Click **"Deploy"** button (or it may auto-deploy)
3. **Wait for deployment** to complete (watch the logs)
4. Look for: `✅ Build successful` and `✅ Deployment successful`

### Step 10: Get Backend URL

1. Click **"Settings"** tab
2. Scroll to **"Domains"** section
3. Click **"Generate Domain"**
4. **Copy the generated URL** (e.g., `https://backend-production-xxxx.up.railway.app`)
5. **IMPORTANT**: Save this URL - you'll need it for the frontend!

### Step 11: Test Backend

Open PowerShell and test:

```powershell
curl https://YOUR-BACKEND-URL.up.railway.app/health
```

Replace `YOUR-BACKEND-URL` with your actual backend URL.

**Expected Response:**
```json
{"status":"ok","message":"Pixverse proxy server is running"}
```

✅ **Checkpoint**: Backend is deployed and working!

---

## PART 3: Deploy Frontend Service

### Step 12: Add Frontend Service

1. In your Railway project dashboard, click **"+ New"** button
2. Select **"GitHub Repo"**
3. Select the **same repository** (`birthday-bash-stream`)
4. Railway will create a second service

### Step 13: Configure Frontend Service

1. **Click on the new service card**
2. Click **"Settings"** tab
3. Configure these settings:

**Service Name:**
- Change to: `frontend`

**Root Directory:**
- Leave as: `/` (root directory)

**Build Command:**
- Set to: `npm install && npm run build`

**Start Command:**
- Set to: `npm run preview -- --host 0.0.0.0 --port $PORT`

### Step 14: Set Frontend Environment Variables

1. Click **"Variables"** tab
2. Click **"+ New Variable"**
3. Add these three variables:

**Variable 1:**
- Variable Name: `VITE_BACKEND_URL`
- Value: `YOUR-BACKEND-URL-FROM-STEP-10` (e.g., `https://backend-production-xxxx.up.railway.app`)

**Variable 2:**
- Variable Name: `VITE_SUPABASE_URL`
- Value: `https://pufvhbxblotdedjxbzsa.supabase.co`

**Variable 3:**
- Variable Name: `VITE_SUPABASE_ANON_KEY`
- Value: `YOUR_SUPABASE_ANON_KEY` (get from Supabase dashboard)

> **⚠️ CRITICAL**: Make sure `VITE_BACKEND_URL` is the exact URL from Step 10!

### Step 15: Deploy Frontend

1. Click **"Deployments"** tab
2. Click **"Deploy"** button (or wait for auto-deploy)
3. **Wait for deployment** to complete (this may take 3-5 minutes)
4. Watch the build logs for any errors

### Step 16: Get Frontend URL

1. Click **"Settings"** tab
2. Scroll to **"Domains"** section
3. Click **"Generate Domain"**
4. **Copy the generated URL** (e.g., `https://frontend-production-xxxx.up.railway.app`)

### Step 17: Test Frontend

1. Open your browser
2. Visit the frontend URL from Step 16
3. The Birthday Bash app should load!

✅ **Checkpoint**: Frontend is deployed!

---

## PART 4: Verification & Testing

### Step 18: Test Full Workflow

Test each feature to ensure everything works:

**Test 1: Homepage**
- [ ] Homepage loads without errors
- [ ] Navigation works
- [ ] No console errors (press F12 to check)

**Test 2: Photo Upload**
- [ ] Go to Submit page
- [ ] Upload a photo
- [ ] Photo displays correctly

**Test 3: Video Generation**
- [ ] Select a cartoon character
- [ ] Enter name and date of birth
- [ ] Click "Generate Video"
- [ ] Video generation starts (you'll see progress)
- [ ] Wait for video to complete (~2-3 minutes)

**Test 4: Birthday Stream**
- [ ] Go to Birthday Stream page
- [ ] Generated video appears in stream
- [ ] Video plays correctly

**Test 5: Admin Panel**
- [ ] Go to Admin page
- [ ] Can see submitted birthdays
- [ ] Can approve/reject submissions

### Step 19: Check for Errors

**Backend Logs:**
1. Go to Railway Dashboard → Backend Service
2. Click **"Logs"** tab
3. Look for any errors (red text)
4. Should see: `🚀 Pixverse proxy server running on http://localhost:3001`

**Frontend Logs:**
1. Go to Railway Dashboard → Frontend Service
2. Click **"Logs"** tab
3. Look for any errors
4. Should see successful build and server start messages

**Browser Console:**
1. Press **F12** in your browser
2. Click **"Console"** tab
3. Look for any red errors
4. Common issues:
   - CORS errors → Check backend CORS settings
   - 404 errors → Check `VITE_BACKEND_URL` is correct
   - API errors → Check Pixverse API key

### Step 20: Fix Common Issues (if needed)

**Issue: Frontend can't connect to backend**

Solution:
1. Go to Frontend Service → Variables
2. Check `VITE_BACKEND_URL` is correct
3. Make sure it includes `https://` and no trailing slash
4. Click **"Deployments"** → **"Redeploy"**

**Issue: Video generation fails**

Solution:
1. Go to Backend Service → Variables
2. Verify `PIXVERSE_API_KEY` is correct
3. Check backend logs for specific error
4. Test backend health endpoint again

**Issue: CORS errors**

Solution:
1. Update `server/index.js` locally
2. Add your frontend URL to CORS:
```javascript
app.use(cors({
  origin: ['https://your-frontend.up.railway.app', 'http://localhost:5173'],
  credentials: true
}));
```
3. Commit and push to GitHub
4. Railway will auto-redeploy

---

## PART 5: Post-Deployment

### Step 21: Document Your URLs

Save these URLs for future reference:

```
Backend URL: ___________________________________________

Frontend URL: ___________________________________________

Deployment Date: ___________________________________________
```

### Step 22: Set Up Custom Domain (Optional)

If you want a custom domain like `birthdaybash.com`:

1. Buy a domain from Namecheap, GoDaddy, etc.
2. In Railway → Frontend Service → Settings → Domains
3. Click **"Custom Domain"**
4. Enter your domain
5. Add the CNAME record to your domain's DNS settings
6. Wait for DNS propagation (~5-60 minutes)

### Step 23: Enable Auto-Deploy

Auto-deploy is enabled by default. To verify:

1. Go to Service → Settings
2. Scroll to **"Deployments"**
3. Ensure **"Auto Deploy"** is ON

Now, whenever you push to GitHub, Railway will automatically redeploy!

### Step 24: Monitor Your App

**Set up monitoring:**
1. Railway Dashboard → Project Settings
2. Add your email for deployment notifications
3. Check **"Metrics"** tab regularly for:
   - CPU usage
   - Memory usage
   - Network traffic

**Set up usage alerts:**
1. Railway Dashboard → Account Settings
2. Set spending limits if needed
3. Enable email alerts for high usage

---

## 🎉 Success!

Your Birthday Bash application is now live on Railway!

**Your Deployment:**
- ✅ Backend deployed and running
- ✅ Frontend deployed and accessible
- ✅ Environment variables configured
- ✅ Auto-deploy enabled
- ✅ HTTPS enabled by default

---

## 📊 Quick Reference

### Railway Dashboard URLs

- **Project Dashboard**: https://railway.app/project/YOUR_PROJECT_ID
- **Backend Service**: https://railway.app/project/YOUR_PROJECT_ID/service/backend
- **Frontend Service**: https://railway.app/project/YOUR_PROJECT_ID/service/frontend

### Important Commands

```powershell
# View backend logs
railway logs --service backend

# View frontend logs
railway logs --service frontend

# Redeploy a service
railway up --service backend

# Open Railway dashboard
railway open
```

### Environment Variables Summary

**Backend:**
- `PIXVERSE_API_KEY` - Your Pixverse API key
- `PORT` - 3001
- `NODE_ENV` - production

**Frontend:**
- `VITE_BACKEND_URL` - Your Railway backend URL
- `VITE_SUPABASE_URL` - Your Supabase project URL
- `VITE_SUPABASE_ANON_KEY` - Your Supabase anon key

---

## 🆘 Troubleshooting Guide

### Build Fails

**Check:**
1. Build logs in Railway Dashboard
2. Verify `package.json` scripts are correct
3. Ensure all dependencies are in `package.json`
4. Check Node version compatibility

**Fix:**
- Update Node version in Railway settings if needed
- Run `npm install` locally to verify dependencies
- Check for syntax errors in code

### Deployment Succeeds but App Doesn't Work

**Check:**
1. Environment variables are set correctly
2. Backend URL in frontend matches actual backend URL
3. No CORS errors in browser console
4. Backend health endpoint responds

**Fix:**
- Redeploy frontend after changing environment variables
- Update CORS settings in backend
- Verify all API keys are valid

### High Usage/Costs

**Check:**
1. Metrics tab for CPU/Memory usage
2. Number of requests to backend
3. Video generation frequency

**Fix:**
- Optimize code for better performance
- Add rate limiting to backend
- Upgrade Railway plan if needed
- Cache responses where possible

---

## 📚 Additional Resources

- [Railway Documentation](https://docs.railway.app)
- [Railway Discord Community](https://discord.gg/railway)
- [Railway Status Page](https://status.railway.app)
- [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy.html)

---

## ✅ Deployment Checklist

Print this and check off as you go:

- [ ] Step 1-5: Code pushed to GitHub
- [ ] Step 6-11: Backend deployed and tested
- [ ] Step 12-17: Frontend deployed and accessible
- [ ] Step 18-20: Full workflow tested and verified
- [ ] Step 21-24: Post-deployment tasks completed

---

**Congratulations! Your app is live! 🚀🎉**

Share your app URL with friends and family to celebrate birthdays in style!

---

*Last Updated: December 7, 2025*
*Railway Deployment Guide v1.0*
