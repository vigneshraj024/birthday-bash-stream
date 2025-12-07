# 🚀 Render.com Deployment Guide - Birthday Bash App

Deploy your Birthday Bash application to Render.com for **FREE**!

---

## 🎯 What You'll Deploy

- **Backend Service**: Express server (Pixverse API proxy)
- **Frontend Service**: React/Vite app (Static site)
- **Cost**: $0 (100% Free!)

---

## 📋 Prerequisites

- ✅ Code on GitHub: `https://github.com/vigneshraj024/birthday-bash-stream`
- ✅ Render account (we'll create this)
- ✅ Pixverse API Key: `sk-8755922f136b65fcdb09d6f2eaee0572`
- ✅ Supabase credentials

---

## PART 1: Create Render Account

### Step 1: Sign Up for Render

1. Go to: **https://render.com**
2. Click **"Get Started for Free"**
3. Sign up with **GitHub** (recommended)
4. Authorize Render to access your GitHub
5. You're now logged into Render dashboard!

**No credit card required!** ✅

---

## PART 2: Deploy Backend Service

### Step 2: Create Backend Web Service

1. On Render dashboard, click **"New +"** button
2. Select **"Web Service"**
3. Click **"Build and deploy from a Git repository"**
4. Click **"Connect account"** if needed, then select GitHub
5. Find and select: **"birthday-bash-stream"**
6. Click **"Connect"**

### Step 3: Configure Backend Service

Fill in these settings:

**Name:**
```
birthday-bash-backend
```

**Region:**
```
Oregon (US West) or Singapore (closest to you)
```

**Branch:**
```
main
```

**Root Directory:**
```
server
```

**Runtime:**
```
Node
```

**Build Command:**
```
npm install
```

**Start Command:**
```
npm start
```

**Instance Type:**
```
Free
```

### Step 4: Add Backend Environment Variables

Scroll down to **"Environment Variables"** section.

Click **"Add Environment Variable"** and add these THREE variables:

**Variable 1:**
```
Key: PIXVERSE_API_KEY
Value: sk-8755922f136b65fcdb09d6f2eaee0572
```

**Variable 2:**
```
Key: PORT
Value: 3001
```

**Variable 3:**
```
Key: NODE_ENV
Value: production
```

### Step 5: Create Backend Service

1. Scroll to bottom
2. Click **"Create Web Service"**
3. Render will start building and deploying
4. **Wait 2-3 minutes** for deployment to complete
5. Watch the logs - look for: ✅ **"Build successful"**

### Step 6: Get Backend URL

After deployment succeeds:

1. At the top of the page, you'll see your service URL
2. It will look like: `https://birthday-bash-backend.onrender.com`
3. **COPY THIS URL** - you'll need it for the frontend!

**Your Backend URL:** `_________________________________`

### Step 7: Test Backend

Open a new browser tab and go to:
```
https://your-backend-url.onrender.com/health
```

**Expected response:**
```json
{"status":"ok","message":"Pixverse proxy server is running"}
```

✅ **Backend is live!**

---

## PART 3: Deploy Frontend Service

### Step 8: Create Frontend Static Site

1. Go back to Render dashboard
2. Click **"New +"** button
3. Select **"Static Site"**
4. Select your repository: **"birthday-bash-stream"**
5. Click **"Connect"**

### Step 9: Configure Frontend Service

Fill in these settings:

**Name:**
```
birthday-bash-frontend
```

**Branch:**
```
main
```

**Root Directory:**
```
(leave empty - use root)
```

**Build Command:**
```
npm install && npm run build
```

**Publish Directory:**
```
dist
```

### Step 10: Add Frontend Environment Variables

Click **"Advanced"** to expand environment variables section.

Add these THREE variables:

**Variable 1:**
```
Key: VITE_BACKEND_URL
Value: <YOUR-BACKEND-URL-FROM-STEP-6>
```
**IMPORTANT:** Use the actual backend URL you copied in Step 6!
Example: `https://birthday-bash-backend.onrender.com`

**Variable 2:**
```
Key: VITE_SUPABASE_URL
Value: https://pufvhbxblotdedjxbzsa.supabase.co
```

**Variable 3:**
```
Key: VITE_SUPABASE_ANON_KEY
Value: <YOUR-SUPABASE-ANON-KEY>
```

Get your Supabase anon key from: https://supabase.com/dashboard/project/pufvhbxblotdedjxbzsa/settings/api

### Step 11: Create Frontend Service

1. Click **"Create Static Site"**
2. Render will build your frontend
3. **Wait 3-5 minutes** for build to complete
4. Watch the logs for: ✅ **"Build successful"**

### Step 12: Get Frontend URL

After deployment succeeds:

1. You'll see your site URL at the top
2. It will look like: `https://birthday-bash-frontend.onrender.com`
3. **This is your live app URL!**

**Your Frontend URL:** `_________________________________`

---

## ✅ Verify Deployment

### Step 13: Test Your App

1. Open your frontend URL in browser
2. Your Birthday Bash app should load!
3. Test these features:
   - [ ] Homepage loads
   - [ ] Can navigate between pages
   - [ ] Can upload a photo
   - [ ] Can select cartoon character
   - [ ] Can generate video (this takes 2-3 minutes)
   - [ ] Video appears in birthday stream
   - [ ] Admin panel works

---

## ⚠️ Important Notes About Free Tier

### Backend Service (Web Service)

**Free tier limitations:**
- ⚠️ **Sleeps after 15 minutes of inactivity**
- ⚠️ **Takes ~30 seconds to wake up** on first request
- ✅ 750 hours/month (enough for 24/7 if only 1 service)

**What this means:**
- If no one uses your app for 15 minutes, the backend sleeps
- Next visitor will wait ~30 seconds for it to wake up
- After waking, it works normally

### Frontend (Static Site)

**Free tier:**
- ✅ **Always on** (never sleeps!)
- ✅ **Fast loading**
- ✅ **Unlimited bandwidth**
- ✅ **Free SSL certificate**

---

## 🔧 Configuration Files

I'll create Render-specific config files for you:

### For Backend: `render.yaml` (optional)

This helps Render auto-configure your services.

---

## 🐛 Troubleshooting

### Backend won't start

**Check:**
1. Root Directory is set to `server`
2. All environment variables are set
3. Build logs for errors

**Fix:**
- Go to service → Settings → verify all settings
- Check Environment tab for missing variables

### Frontend build fails

**Check:**
1. Build command is correct
2. Publish directory is `dist`
3. All environment variables are set

**Fix:**
- Check build logs for specific errors
- Verify `VITE_BACKEND_URL` is set correctly

### Frontend can't connect to backend

**Check:**
1. `VITE_BACKEND_URL` in frontend environment variables
2. Backend URL is correct (no trailing slash)
3. Backend is running (not sleeping)

**Fix:**
1. Go to Frontend → Environment
2. Verify `VITE_BACKEND_URL` matches backend URL exactly
3. Redeploy frontend after changing variables

### Backend is slow to respond

**This is normal on free tier!**
- Backend sleeps after 15 min inactivity
- First request wakes it up (~30 seconds)
- Subsequent requests are fast

**Solutions:**
- Upgrade to paid plan ($7/month for always-on)
- Use a "keep-alive" service to ping your backend every 10 minutes
- Accept the 30-second wake-up time

### CORS errors

**Fix:**
1. Update `server/index.js` locally
2. Add your frontend URL to CORS:
```javascript
app.use(cors({
  origin: ['https://birthday-bash-frontend.onrender.com', 'http://localhost:5173'],
  credentials: true
}));
```
3. Commit and push to GitHub
4. Render will auto-redeploy

---

## 🔄 Auto-Deploy

**Good news:** Render automatically deploys when you push to GitHub!

**How it works:**
1. Make changes to your code
2. Commit and push to GitHub:
   ```powershell
   git add .
   git commit -m "Your changes"
   git push
   ```
3. Render detects the push
4. Automatically rebuilds and redeploys
5. Your app updates in 2-5 minutes!

**To disable auto-deploy:**
- Go to service → Settings → Auto-Deploy → Turn off

---

## 💰 Pricing

### Free Tier (What You're Using)

**Backend (Web Service):**
- ✅ 750 hours/month
- ✅ 512 MB RAM
- ✅ Shared CPU
- ⚠️ Sleeps after 15 min inactivity

**Frontend (Static Site):**
- ✅ Unlimited
- ✅ 100 GB bandwidth/month
- ✅ Always on
- ✅ Free SSL

**Total Cost:** $0/month

### Paid Plans (Optional Upgrade)

**Starter Plan ($7/month per service):**
- ✅ Always on (no sleep)
- ✅ 512 MB RAM
- ✅ Faster performance

**Standard Plan ($25/month per service):**
- ✅ 2 GB RAM
- ✅ Dedicated CPU
- ✅ Best performance

---

## 🎯 Success Checklist

- [ ] Render account created
- [ ] Backend service deployed
- [ ] Backend health check works
- [ ] Backend URL copied
- [ ] Frontend service deployed
- [ ] Frontend loads in browser
- [ ] All environment variables set
- [ ] Can upload photos
- [ ] Can generate videos
- [ ] Videos appear in stream
- [ ] Auto-deploy enabled

---

## 📝 Your Deployment Info

```
GitHub Repo: https://github.com/vigneshraj024/birthday-bash-stream

Backend URL: _________________________________

Frontend URL: _________________________________

Deployment Date: _________________________________

Status: ⬜ Backend | ⬜ Frontend | ⬜ Tested
```

---

## 🆘 Need Help?

- **Render Docs**: https://render.com/docs
- **Render Community**: https://community.render.com
- **Render Status**: https://status.render.com

---

## 🎉 After Deployment

Once everything is working:

1. ✅ Share your frontend URL with friends!
2. ✅ Test all features thoroughly
3. ✅ Monitor usage in Render dashboard
4. ✅ Set up custom domain (optional, free on Render!)

---

## 💡 Pro Tips

1. **Keep backend awake**: Use a service like UptimeRobot to ping your backend every 10 minutes
2. **Custom domain**: Add your own domain for free in Render settings
3. **Monitor logs**: Check logs regularly for errors
4. **Environment variables**: Remember to redeploy after changing env vars
5. **Upgrade later**: If you need always-on, upgrade backend to Starter ($7/month)

---

**Ready to deploy? Let's go! 🚀**

*Estimated deployment time: 15-20 minutes*
