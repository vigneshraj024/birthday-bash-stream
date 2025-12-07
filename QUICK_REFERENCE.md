# 🎯 Railway Deployment - Quick Reference Card

**Print this page and keep it next to you while deploying!**

---

## 📋 Your Information

Fill this out before starting:

```
GitHub Username: _______________________________

GitHub Repo Name: birthday-bash-stream

Pixverse API Key: sk-8755922f136b65fcdb09d6f2eaee0572

Supabase URL: https://pufvhbxblotdedjxbzsa.supabase.co

Supabase Anon Key: _______________________________

Backend URL (fill after Step 10): _______________________________

Frontend URL (fill after Step 16): _______________________________
```

---

## 🚀 The 5 Parts (24 Steps Total)

### PART 1: GitHub (5 min)
**Steps 1-5**: Push code to GitHub

```powershell
cd C:\Users\HP\Desktop\birthday_bash2\birthday-bash-stream-main
git init
git add .
git commit -m "Prepare for Railway deployment"
git remote add origin https://github.com/YOUR_USERNAME/birthday-bash-stream.git
git branch -M main
git push -u origin main
```

---

### PART 2: Backend (5 min)
**Steps 6-11**: Deploy backend service

**Railway Settings:**
- Service Name: `backend`
- Root Directory: `server`
- Build Command: `npm install`
- Start Command: `npm start`

**Environment Variables:**
```
PIXVERSE_API_KEY=sk-8755922f136b65fcdb09d6f2eaee0572
PORT=3001
NODE_ENV=production
```

**Test:**
```powershell
curl https://YOUR-BACKEND-URL.up.railway.app/health
```

Expected: `{"status":"ok","message":"Pixverse proxy server is running"}`

---

### PART 3: Frontend (5 min)
**Steps 12-17**: Deploy frontend service

**Railway Settings:**
- Service Name: `frontend`
- Root Directory: `/`
- Build Command: `npm install && npm run build`
- Start Command: `npm run preview -- --host 0.0.0.0 --port $PORT`

**Environment Variables:**
```
VITE_BACKEND_URL=<YOUR-BACKEND-URL-FROM-STEP-10>
VITE_SUPABASE_URL=https://pufvhbxblotdedjxbzsa.supabase.co
VITE_SUPABASE_ANON_KEY=<YOUR-SUPABASE-ANON-KEY>
```

---

### PART 4: Testing (3 min)
**Steps 18-20**: Test everything

- [ ] Homepage loads
- [ ] Upload photo works
- [ ] Video generation works
- [ ] Birthday stream shows videos
- [ ] No console errors
- [ ] Backend logs clean
- [ ] Frontend logs clean

---

### PART 5: Finish (2 min)
**Steps 21-24**: Post-deployment

- [ ] Document URLs
- [ ] Verify auto-deploy enabled
- [ ] Set up monitoring
- [ ] Share your app!

---

## ⚡ Critical Commands

### Railway CLI (Optional)
```powershell
# Install
npm i -g @railway/cli

# Login
railway login

# View logs
railway logs --service backend
railway logs --service frontend
```

### Git Commands
```powershell
# Check status
git status

# Add changes
git add .

# Commit
git commit -m "Your message"

# Push (triggers auto-deploy)
git push
```

---

## 🔥 Most Common Mistakes

| ❌ Mistake | ✅ Fix |
|-----------|--------|
| Forgot to copy backend URL | Go to Backend → Settings → Domains |
| Wrong `VITE_BACKEND_URL` | Must match backend URL exactly |
| Forgot `https://` in URL | Include full URL with protocol |
| Didn't redeploy after env change | Redeploy frontend after changing vars |
| CORS errors | Update `server/index.js` CORS settings |

---

## 🎯 Success Checklist

```
✅ Code on GitHub
✅ Backend deployed
✅ Backend health check passes
✅ Backend URL copied
✅ Frontend deployed
✅ Frontend loads in browser
✅ Can upload photos
✅ Can generate videos
✅ Videos appear in stream
✅ No errors in logs
✅ URLs documented
```

---

## 📞 Emergency Contacts

- **Railway Docs**: https://docs.railway.app
- **Railway Discord**: https://discord.gg/railway
- **Railway Status**: https://status.railway.app

---

## 🔍 Quick Troubleshooting

### Build Fails
1. Check Railway logs
2. Verify `package.json` scripts
3. Check Node version

### App Doesn't Work
1. Check environment variables
2. Verify backend URL in frontend
3. Check browser console for errors
4. Test backend health endpoint

### CORS Errors
1. Update `server/index.js`:
```javascript
app.use(cors({
  origin: ['https://your-frontend.up.railway.app'],
  credentials: true
}));
```
2. Commit and push
3. Railway auto-redeploys

---

## 📊 Time Estimates

| Part | Time | Can Skip? |
|------|------|-----------|
| Part 1: GitHub | 5 min | No |
| Part 2: Backend | 5 min | No |
| Part 3: Frontend | 5 min | No |
| Part 4: Testing | 3 min | No |
| Part 5: Post-Deploy | 2 min | Optional |
| **Total** | **20 min** | - |

---

## 🎓 Step-by-Step Details

For detailed instructions, open:
**[STEP_BY_STEP_DEPLOYMENT.md](./STEP_BY_STEP_DEPLOYMENT.md)**

---

## 💡 Pro Tips

1. **Keep Railway dashboard open** in one tab
2. **Keep GitHub repo open** in another tab
3. **Test after each part** - don't skip testing!
4. **Save URLs immediately** after generating domains
5. **Check logs often** - they tell you what's wrong
6. **Don't panic** - most issues are just env vars

---

## 🎉 After Deployment

Share your app:
```
🎂 Check out my Birthday Bash app!
🔗 [Your Frontend URL]

Features:
✨ AI-generated birthday videos
🎥 Live birthday stream
🎨 Multiple cartoon characters
📱 Mobile-friendly
```

---

**Good luck! You've got this! 🚀**

*Keep this page open while deploying*
*Refer to STEP_BY_STEP_DEPLOYMENT.md for full details*

---

**Deployment Date**: _______________
**Completed By**: _______________
**Status**: ⬜ Not Started | 🟡 In Progress | ✅ Complete
