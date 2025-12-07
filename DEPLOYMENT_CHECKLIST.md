# 🚀 Railway Deployment Checklist

Use this checklist to track your deployment progress.

## 📋 Pre-Deployment

- [ ] Railway account created
- [ ] GitHub repository created and code pushed
- [ ] Pixverse API key obtained: `sk-8755922f136b65fcdb09d6f2eaee0572`
- [ ] Supabase project URL: `https://pufvhbxblotdedjxbzsa.supabase.co`
- [ ] Supabase anon key obtained
- [ ] Reviewed deployment guides:
  - [ ] [RAILWAY_QUICKSTART.md](./RAILWAY_QUICKSTART.md)
  - [ ] [RAILWAY_DEPLOYMENT_GUIDE.md](./RAILWAY_DEPLOYMENT_GUIDE.md)
  - [ ] [RAILWAY_ARCHITECTURE.md](./RAILWAY_ARCHITECTURE.md)

---

## 🔧 Backend Deployment

- [ ] Created new Railway project
- [ ] Connected GitHub repository
- [ ] Created backend service with settings:
  - [ ] Service name: `backend`
  - [ ] Root directory: `server`
  - [ ] Build command: `npm install`
  - [ ] Start command: `npm start`
- [ ] Set environment variables:
  - [ ] `PIXVERSE_API_KEY`
  - [ ] `PORT=3001`
  - [ ] `NODE_ENV=production`
- [ ] Deployed backend service
- [ ] Backend deployment successful
- [ ] Copied backend URL: `_________________________________`
- [ ] Tested backend health endpoint:
  ```bash
  curl https://your-backend-url.up.railway.app/health
  ```
  - [ ] Response: `{"status":"ok","message":"Pixverse proxy server is running"}`

---

## 🎨 Frontend Deployment

- [ ] Added new service to same Railway project
- [ ] Created frontend service with settings:
  - [ ] Service name: `frontend`
  - [ ] Root directory: `/` (root)
  - [ ] Build command: `npm install && npm run build`
  - [ ] Start command: `npm run preview -- --host 0.0.0.0 --port $PORT`
- [ ] Set environment variables:
  - [ ] `VITE_BACKEND_URL` = Backend URL from above
  - [ ] `VITE_SUPABASE_URL`
  - [ ] `VITE_SUPABASE_ANON_KEY`
- [ ] Deployed frontend service
- [ ] Frontend deployment successful
- [ ] Copied frontend URL: `_________________________________`

---

## ✅ Verification

- [ ] Visited frontend URL in browser
- [ ] Homepage loads correctly
- [ ] Can navigate to different pages
- [ ] Tested core functionality:
  - [ ] Upload photo
  - [ ] Select cartoon character
  - [ ] Generate video
  - [ ] Video appears in stream
  - [ ] Admin panel works
- [ ] Checked Railway logs for errors:
  - [ ] Backend logs clean
  - [ ] Frontend logs clean
- [ ] No CORS errors in browser console
- [ ] All API calls successful

---

## 🔄 Post-Deployment

- [ ] Updated local `.env` file with production URLs (for reference)
- [ ] Documented deployment URLs:
  - Backend: `_________________________________`
  - Frontend: `_________________________________`
- [ ] Set up custom domain (optional):
  - [ ] Domain configured in Railway
  - [ ] DNS records updated
  - [ ] SSL certificate active
- [ ] Configured monitoring:
  - [ ] Email notifications enabled
  - [ ] Slack/Discord webhooks (optional)
- [ ] Tested auto-deploy:
  - [ ] Made a small code change
  - [ ] Pushed to GitHub
  - [ ] Railway auto-deployed
- [ ] Shared app with team/users

---

## 🐛 Troubleshooting (if needed)

- [ ] Checked build logs for errors
- [ ] Verified all environment variables are set correctly
- [ ] Confirmed backend URL in frontend env vars
- [ ] Tested backend endpoints directly
- [ ] Reviewed CORS configuration
- [ ] Checked Pixverse API key validity
- [ ] Verified Supabase credentials
- [ ] Consulted troubleshooting section in deployment guide

---

## 📊 Monitoring Setup

- [ ] Bookmarked Railway dashboard
- [ ] Set up log monitoring
- [ ] Configured usage alerts
- [ ] Reviewed pricing and usage limits
- [ ] Planned for scaling if needed

---

## 🎉 Success Criteria

✅ Backend health check returns OK
✅ Frontend loads without errors
✅ Can upload photos successfully
✅ Video generation works end-to-end
✅ Videos display in birthday stream
✅ No console errors
✅ All features functional

---

## 📝 Notes

Use this space to document any issues, solutions, or important information:

```
Date: _______________

Backend URL: _________________________________

Frontend URL: _________________________________

Issues encountered:
-
-
-

Solutions applied:
-
-
-

Additional notes:
-
-
-
```

---

## 🆘 Need Help?

If you encounter issues:

1. Check the [Troubleshooting section](./RAILWAY_DEPLOYMENT_GUIDE.md#-troubleshooting) in the deployment guide
2. Review [Railway Documentation](https://docs.railway.app)
3. Check Railway logs for specific error messages
4. Join [Railway Discord](https://discord.gg/railway) for community support

---

**Deployment Status**: ⬜ Not Started | 🟡 In Progress | ✅ Complete

Current Status: _______________

Last Updated: _______________
