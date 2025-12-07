# 🎯 Render Deployment - Quick Steps

**Your code is ready! Let's deploy to Render.com (FREE)**

---

## ⚡ Quick Deployment Steps

### PART 1: Setup (2 minutes)

1. **Go to**: https://render.com
2. **Click**: "Get Started for Free"
3. **Sign up with GitHub** (easiest option)
4. **Authorize** Render to access your repos

---

### PART 2: Deploy Backend (5 minutes)

1. **Click**: "New +" → "Web Service"
2. **Select**: "birthday-bash-stream" repository
3. **Configure**:
   ```
   Name: birthday-bash-backend
   Root Directory: server
   Build Command: npm install
   Start Command: npm start
   ```
4. **Add Environment Variables**:
   ```
   PIXVERSE_API_KEY = sk-8755922f136b65fcdb09d6f2eaee0572
   PORT = 3001
   NODE_ENV = production
   ```
5. **Click**: "Create Web Service"
6. **Wait**: 2-3 minutes for deployment
7. **Copy**: Backend URL (e.g., `https://birthday-bash-backend.onrender.com`)

---

### PART 3: Deploy Frontend (5 minutes)

1. **Click**: "New +" → "Static Site"
2. **Select**: "birthday-bash-stream" repository
3. **Configure**:
   ```
   Name: birthday-bash-frontend
   Build Command: npm install && npm run build
   Publish Directory: dist
   ```
4. **Add Environment Variables**:
   ```
   VITE_BACKEND_URL = <your-backend-url-from-above>
   VITE_SUPABASE_URL = https://pufvhbxblotdedjxbzsa.supabase.co
   VITE_SUPABASE_ANON_KEY = <your-supabase-key>
   ```
5. **Click**: "Create Static Site"
6. **Wait**: 3-5 minutes for build
7. **Open**: Your frontend URL - Your app is live! 🎉

---

## ✅ Success Checklist

- [ ] Render account created
- [ ] Backend deployed (Web Service)
- [ ] Backend URL copied
- [ ] Frontend deployed (Static Site)
- [ ] App loads in browser
- [ ] Can upload photos
- [ ] Can generate videos

---

## ⚠️ Important Notes

**Backend sleeps after 15 min** of inactivity (free tier)
- First request takes ~30 seconds to wake up
- Then works normally
- This is normal for free tier!

**Frontend is always on** ✅
- Never sleeps
- Always fast

---

## 🔧 Your URLs

```
GitHub: https://github.com/vigneshraj024/birthday-bash-stream

Backend: _________________________________

Frontend: _________________________________
```

---

## 📚 Full Guide

For detailed instructions: [RENDER_DEPLOYMENT_GUIDE.md](./RENDER_DEPLOYMENT_GUIDE.md)

---

**Let's deploy! Go to https://render.com and follow the steps above! 🚀**
