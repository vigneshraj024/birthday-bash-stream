# 🚂 Railway Deployment - Manual Steps

Follow these exact steps on the Railway dashboard.

---

## 🎯 PART 1: Create New Project & Deploy Backend

### Step 1: Create New Project

1. On Railway dashboard, click **"+ New"** button (top right)
2. Click **"Deploy from GitHub repo"**
3. You'll see your GitHub account: **vigneshraj024**
4. Click on **"birthday-bash-stream"** repository
5. Railway will create a new project and start deploying

### Step 2: Configure Backend Service

After Railway creates the service:

1. **Click on the service card** that appears
2. Click **"Settings"** tab at the top
3. Make these changes:

**Service Name:**
- Change from default to: `backend`

**Root Directory:**
- Click "Add Root Directory"
- Enter: `server`
- Click "Update"

**Build Command:**
- Click "Add Build Command"  
- Enter: `npm install`
- Click "Update"

**Start Command:**
- Click "Add Start Command"
- Enter: `npm start`
- Click "Update"

### Step 3: Add Backend Environment Variables

1. Click **"Variables"** tab at the top
2. Click **"+ New Variable"** button
3. Add these THREE variables one by one:

**Variable 1:**
```
Name: PIXVERSE_API_KEY
Value: sk-8755922f136b65fcdb09d6f2eaee0572
```
Click "Add"

**Variable 2:**
```
Name: PORT
Value: 3001
```
Click "Add"

**Variable 3:**
```
Name: NODE_ENV
Value: production
```
Click "Add"

### Step 4: Deploy Backend

1. Click **"Deployments"** tab
2. Railway should auto-deploy with your new settings
3. **Wait for deployment to complete** (watch the logs)
4. Look for: ✅ **"Build successful"** and ✅ **"Deployment successful"**

### Step 5: Generate Backend Domain

1. Click **"Settings"** tab
2. Scroll down to **"Domains"** section
3. Click **"Generate Domain"** button
4. **COPY THE URL** that appears (e.g., `https://backend-production-xxxx.up.railway.app`)
5. **SAVE THIS URL** - you'll need it for the frontend!

**Your Backend URL:** `_________________________________`

### Step 6: Test Backend

Open a new browser tab and go to:
```
https://YOUR-BACKEND-URL.up.railway.app/health
```

You should see:
```json
{"status":"ok","message":"Pixverse proxy server is running"}
```

✅ **Backend is ready!**

---

## 🎨 PART 2: Deploy Frontend Service

### Step 7: Add Frontend Service

1. Go back to your Railway project dashboard
2. Click **"+ New"** button
3. Click **"GitHub Repo"**
4. Select **"birthday-bash-stream"** again (same repo)
5. Railway will create a second service

### Step 8: Configure Frontend Service

1. **Click on the new service card**
2. Click **"Settings"** tab
3. Make these changes:

**Service Name:**
- Change to: `frontend`

**Root Directory:**
- Leave as: `/` (root directory)
- Or if it asks, enter: `/`

**Build Command:**
- Click "Add Build Command"
- Enter: `npm install && npm run build`
- Click "Update"

**Start Command:**
- Click "Add Start Command"
- Enter: `npm run preview -- --host 0.0.0.0 --port $PORT`
- Click "Update"

### Step 9: Add Frontend Environment Variables

1. Click **"Variables"** tab
2. Click **"+ New Variable"**
3. Add these THREE variables:

**Variable 1:**
```
Name: VITE_BACKEND_URL
Value: <YOUR-BACKEND-URL-FROM-STEP-5>
```
**IMPORTANT:** Use the actual backend URL you copied in Step 5!

**Variable 2:**
```
Name: VITE_SUPABASE_URL
Value: https://pufvhbxblotdedjxbzsa.supabase.co
```

**Variable 3:**
```
Name: VITE_SUPABASE_ANON_KEY
Value: <YOUR-SUPABASE-ANON-KEY>
```
Get this from your Supabase dashboard: https://supabase.com/dashboard/project/pufvhbxblotdedjxbzsa/settings/api

### Step 10: Deploy Frontend

1. Click **"Deployments"** tab
2. Railway should auto-deploy
3. **Wait for build to complete** (this may take 3-5 minutes)
4. Watch the logs for: ✅ **"Build successful"**

### Step 11: Generate Frontend Domain

1. Click **"Settings"** tab
2. Scroll to **"Domains"** section
3. Click **"Generate Domain"**
4. **COPY THE URL** (e.g., `https://frontend-production-xxxx.up.railway.app`)

**Your Frontend URL:** `_________________________________`

### Step 12: Test Frontend

1. Open the frontend URL in your browser
2. Your Birthday Bash app should load!
3. Try uploading a photo and generating a video

---

## ✅ Success Checklist

- [ ] Backend deployed successfully
- [ ] Backend health check returns OK
- [ ] Backend URL copied and saved
- [ ] Frontend deployed successfully
- [ ] Frontend loads in browser
- [ ] Can upload photos
- [ ] Can generate videos (test this!)
- [ ] Videos appear in birthday stream

---

## 🐛 Troubleshooting

### Backend won't deploy
- Check that Root Directory is set to `server`
- Check that all environment variables are set
- Check deployment logs for errors

### Frontend won't deploy
- Check that Build Command is correct
- Check that Start Command is correct
- Check that all environment variables are set
- Make sure `VITE_BACKEND_URL` is the correct backend URL

### Frontend loads but can't connect to backend
- Verify `VITE_BACKEND_URL` in frontend variables
- Make sure it matches the backend URL exactly
- Redeploy frontend after changing variables

### CORS errors
- Update `server/index.js` locally
- Add your frontend URL to CORS settings
- Push to GitHub (Railway will auto-redeploy)

---

## 📝 Your Deployment Info

Fill this out as you go:

```
GitHub Repo: https://github.com/vigneshraj024/birthday-bash-stream

Backend URL: _________________________________

Frontend URL: _________________________________

Deployment Date: _________________________________

Status: ⬜ Backend Deployed | ⬜ Frontend Deployed | ⬜ Tested
```

---

## 🎉 After Deployment

Once both services are deployed and working:

1. Share your frontend URL with friends!
2. Test all features thoroughly
3. Monitor usage in Railway dashboard
4. Set up custom domain (optional)

---

**Need help?** Check the detailed guides:
- [STEP_BY_STEP_DEPLOYMENT.md](./STEP_BY_STEP_DEPLOYMENT.md)
- [RAILWAY_DEPLOYMENT_GUIDE.md](./RAILWAY_DEPLOYMENT_GUIDE.md)

**Good luck! 🚀**
