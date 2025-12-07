# 🚀 How to Start Your Backend Server Locally

Follow these exact steps to start your backend server on your computer.

---

## 📋 Step-by-Step Instructions

### **Step 1: Open PowerShell**

1. Press **Windows Key + X**
2. Click **"Windows PowerShell"** or **"Terminal"**

---

### **Step 2: Navigate to Server Folder**

Copy and paste this command:

```powershell
cd C:\Users\HP\Desktop\birthday_bash2\birthday-bash-stream-main\server
```

Press **Enter**

---

### **Step 3: Install Dependencies (First Time Only)**

If this is your first time running the backend, install dependencies:

```powershell
npm install
```

Press **Enter** and wait for it to complete (1-2 minutes)

**You only need to do this ONCE!**

---

### **Step 4: Start the Backend Server**

```powershell
npm start
```

Press **Enter**

---

### **Step 5: Verify It's Running**

You should see this output:

```
🚀 Pixverse proxy server running on http://localhost:3001
📡 Ready to proxy requests to Pixverse API
🔑 API Key: YES
```

✅ **Your backend is now running!**

---

### **Step 6: Keep This Window Open**

**IMPORTANT:** 
- ⚠️ **DO NOT close this PowerShell window!**
- ⚠️ The backend server must stay running while you use the app
- ⚠️ If you close it, the backend will stop

---

### **Step 7: Start the Frontend (New Window)**

1. **Open a NEW PowerShell window** (don't close the first one!)
2. Run these commands:

```powershell
cd C:\Users\HP\Desktop\birthday_bash2\birthday-bash-stream-main
npm run dev
```

3. Your browser should open to `http://localhost:5173`

---

## ✅ Success Checklist

- [ ] PowerShell window 1: Backend running on port 3001
- [ ] PowerShell window 2: Frontend running on port 5173
- [ ] Browser open to `http://localhost:5173`
- [ ] No errors in either PowerShell window
- [ ] Can upload photos and generate videos

---

## 🐛 Troubleshooting

### Error: "npm: command not found"

**Solution:** Install Node.js
1. Go to: https://nodejs.org
2. Download and install Node.js
3. Restart PowerShell
4. Try again

### Error: "Port 3001 already in use"

**Solution:** Another process is using port 3001
1. Close any other backend servers
2. Or restart your computer
3. Try again

### Error: "Cannot find module"

**Solution:** Install dependencies
```powershell
cd C:\Users\HP\Desktop\birthday_bash2\birthday-bash-stream-main\server
npm install
```

### Backend starts but app doesn't work

**Solution:** Check if both servers are running
1. Backend should show: `🚀 Pixverse proxy server running`
2. Frontend should show: `Local: http://localhost:5173`
3. Both PowerShell windows must stay open

---

## 🔄 To Stop the Servers

When you're done:

1. Go to each PowerShell window
2. Press **Ctrl + C**
3. Type **Y** and press **Enter**

---

## 📝 Quick Commands Reference

```powershell
# Navigate to server folder
cd C:\Users\HP\Desktop\birthday_bash2\birthday-bash-stream-main\server

# Install dependencies (first time only)
npm install

# Start backend server
npm start

# Stop server (in the running window)
Ctrl + C
```

---

## 💡 Pro Tips

1. **Keep both PowerShell windows visible** - You can see logs and errors
2. **Check for errors** - If something doesn't work, check the PowerShell output
3. **Restart if needed** - Press Ctrl+C and run `npm start` again
4. **Use two monitors** - One for code, one for the running app

---

**Ready? Open PowerShell and start with Step 1!** 🚀
