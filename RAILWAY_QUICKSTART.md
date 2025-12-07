# 🚀 Railway Deployment Quick Start

## ✅ Pre-Deployment Checklist

- [ ] Railway account created at [railway.app](https://railway.app)
- [ ] Code pushed to GitHub repository
- [ ] Pixverse API key ready
- [ ] Supabase URL and anon key ready

---

## 📝 Step-by-Step Deployment

### 1️⃣ Deploy Backend Service

1. **Create New Project on Railway**
   - Go to [railway.app](https://railway.app)
   - Click "New Project" → "Deploy from GitHub repo"
   - Select your repository

2. **Configure Backend Service**
   - Service Name: `backend`
   - Root Directory: `server`
   - Build Command: `npm install`
   - Start Command: `npm start`

3. **Set Environment Variables**
   ```
   PIXVERSE_API_KEY=sk-8755922f136b65fcdb09d6f2eaee0572
   PORT=3001
   NODE_ENV=production
   ```

4. **Deploy**
   - Click "Deploy"
   - Wait for deployment to complete
   - **Copy the backend URL** (e.g., `https://backend-production-xxxx.up.railway.app`)

### 2️⃣ Deploy Frontend Service

1. **Add New Service to Same Project**
   - In the same Railway project, click "New Service"
   - Select "Deploy from GitHub repo" → Choose same repository

2. **Configure Frontend Service**
   - Service Name: `frontend`
   - Root Directory: `/` (leave as root)
   - Build Command: `npm install && npm run build`
   - Start Command: `npm run preview -- --host 0.0.0.0 --port $PORT`

3. **Set Environment Variables**
   ```
   VITE_BACKEND_URL=<YOUR_BACKEND_URL_FROM_STEP_1>
   VITE_SUPABASE_URL=https://pufvhbxblotdedjxbzsa.supabase.co
   VITE_SUPABASE_ANON_KEY=<YOUR_SUPABASE_ANON_KEY>
   ```
   
   > ⚠️ **Important**: Replace `<YOUR_BACKEND_URL_FROM_STEP_1>` with the actual backend URL from Step 1

4. **Deploy**
   - Click "Deploy"
   - Wait for deployment to complete

### 3️⃣ Verify Deployment

1. **Test Backend**
   ```bash
   curl https://your-backend-url.up.railway.app/health
   ```
   Expected response:
   ```json
   {"status":"ok","message":"Pixverse proxy server is running"}
   ```

2. **Test Frontend**
   - Visit: `https://your-frontend-url.up.railway.app`
   - Try uploading a photo and generating a video

---

## 🔧 Configuration Files Created

✅ `railway.backend.json` - Backend service configuration
✅ `railway.frontend.json` - Frontend service configuration
✅ `.env.production` - Production environment variables template
✅ Updated `pixverseApi.ts` - Uses `VITE_BACKEND_URL` environment variable

---

## 🐛 Common Issues & Solutions

### Issue: Frontend can't connect to backend
**Solution**: 
1. Verify `VITE_BACKEND_URL` is set correctly in frontend service
2. Ensure backend URL includes `https://` protocol
3. Redeploy frontend after changing environment variables

### Issue: Backend returns 500 errors
**Solution**: 
1. Check Railway logs: Dashboard → Backend Service → Logs
2. Verify `PIXVERSE_API_KEY` is set correctly
3. Check if Pixverse API is working

### Issue: Build fails
**Solution**: 
1. Check Node version (Railway uses Node 18+)
2. Verify `package.json` scripts are correct
3. Check build logs for specific errors

### Issue: CORS errors
**Solution**: 
Update `server/index.js` to allow your frontend domain:
```javascript
app.use(cors({
  origin: ['https://your-frontend.up.railway.app', 'http://localhost:5173'],
  credentials: true
}));
```

---

## 📊 Monitoring

### View Logs
- Railway Dashboard → Service → **Logs** tab
- Or use CLI: `railway logs --service backend`

### Check Metrics
- Railway Dashboard → Service → **Metrics** tab
- Monitor CPU, Memory, Network usage

---

## 💰 Cost Estimation

- **Free Tier**: $5 credit/month
- **Developer Plan**: $5/month + usage
- Typical usage for this app: ~$2-5/month

---

## 🔄 Continuous Deployment

Railway auto-deploys when you push to GitHub:
1. Make code changes
2. Commit and push to GitHub
3. Railway automatically redeploys

To disable: Service Settings → Deployments → Toggle off "Auto Deploy"

---

## 🎯 Next Steps After Deployment

- [ ] Test all features (upload photo, generate video, view stream)
- [ ] Set up custom domain (optional)
- [ ] Configure monitoring/alerts
- [ ] Update CORS settings if needed
- [ ] Share your app URL! 🎉

---

## 📚 Additional Resources

- [Railway Documentation](https://docs.railway.app)
- [Railway Discord](https://discord.gg/railway)
- [Deployment Guide](./RAILWAY_DEPLOYMENT_GUIDE.md) - Full detailed guide

---

## ⚡ Quick Commands

```bash
# Install Railway CLI
npm i -g @railway/cli

# Login
railway login

# View logs
railway logs --service backend
railway logs --service frontend

# Open service in browser
railway open
```

---

**Need help?** Check the full [Railway Deployment Guide](./RAILWAY_DEPLOYMENT_GUIDE.md) for detailed instructions.
