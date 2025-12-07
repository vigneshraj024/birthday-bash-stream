# 🐙 GitHub Repository Setup Guide

Follow these steps to create a new GitHub repository and push your code.

---

## Part 1: Create GitHub Repository

### Step 1: Go to GitHub

1. Open your browser
2. Go to: **https://github.com/new**
3. **Log in** if you're not already logged in

### Step 2: Fill in Repository Details

On the "Create a new repository" page, fill in:

**Repository name:**
```
birthday-bash-stream
```

**Description (optional):**
```
AI-powered birthday celebration app with video generation and live stream
```

**Visibility:**
- ✅ Select **Public** (recommended) OR
- ⬜ Select **Private** (if you want to keep it private)

**Initialize repository:**
- ⬜ **DO NOT** check "Add a README file"
- ⬜ **DO NOT** check "Add .gitignore"
- ⬜ **DO NOT** check "Choose a license"

> **Important**: Leave all checkboxes UNCHECKED! We already have these files in your project.

### Step 3: Create Repository

Click the green **"Create repository"** button at the bottom

### Step 4: Copy Repository URL

After creating, you'll see a page with setup instructions. Look for the section that says:

**"…or push an existing repository from the command line"**

You'll see commands like:
```bash
git remote add origin https://github.com/YOUR_USERNAME/birthday-bash-stream.git
git branch -M main
git push -u origin main
```

**Keep this page open!** You'll need these commands in Part 2.

---

## Part 2: Push Your Code to GitHub

### Step 5: Open PowerShell

1. Press **Windows Key + X**
2. Select **"Windows PowerShell"** or **"Terminal"**

### Step 6: Navigate to Your Project

```powershell
cd C:\Users\HP\Desktop\birthday_bash2\birthday-bash-stream-main
```

### Step 7: Initialize Git (if not already done)

```powershell
git init
```

**Expected output:**
```
Initialized empty Git repository in C:/Users/HP/Desktop/birthday_bash2/birthday-bash-stream-main/.git/
```

Or if already initialized:
```
Reinitialized existing Git repository in C:/Users/HP/Desktop/birthday_bash2/birthday-bash-stream-main/.git/
```

### Step 8: Add All Files

```powershell
git add .
```

This adds all your files to Git. No output means success!

### Step 9: Commit Your Files

```powershell
git commit -m "Initial commit - Birthday Bash application"
```

**Expected output:**
```
[main (root-commit) abc1234] Initial commit - Birthday Bash application
 XX files changed, XXXX insertions(+)
 create mode 100644 package.json
 create mode 100644 src/App.tsx
 ...
```

### Step 10: Add Remote Repository

**Replace `YOUR_USERNAME` with your actual GitHub username!**

```powershell
git remote add origin https://github.com/YOUR_USERNAME/birthday-bash-stream.git
```

**Example:** If your GitHub username is `john_doe`:
```powershell
git remote add origin https://github.com/john_doe/birthday-bash-stream.git
```

No output means success!

### Step 11: Rename Branch to Main

```powershell
git branch -M main
```

No output means success!

### Step 12: Push to GitHub

```powershell
git push -u origin main
```

**You may be prompted to log in:**
- Enter your GitHub username
- Enter your GitHub password OR personal access token

**Expected output:**
```
Enumerating objects: XX, done.
Counting objects: 100% (XX/XX), done.
Delta compression using up to X threads
Compressing objects: 100% (XX/XX), done.
Writing objects: 100% (XX/XX), XX.XX MiB | XX.XX MiB/s, done.
Total XX (delta XX), reused 0 (delta 0), pack-reused 0
To https://github.com/YOUR_USERNAME/birthday-bash-stream.git
 * [new branch]      main -> main
Branch 'main' set up to track remote branch 'main' from 'origin'.
```

---

## ✅ Verify Your Repository

### Step 13: Check GitHub

1. Go back to your browser
2. Refresh the GitHub repository page
3. You should now see all your files!

**You should see:**
- ✅ All your project files
- ✅ Folders: `src`, `server`, `public`, etc.
- ✅ Files: `package.json`, `README.md`, etc.
- ✅ Green checkmark showing "Initial commit"

---

## 🎉 Success!

Your code is now on GitHub! You can now:
- ✅ Proceed with Railway deployment
- ✅ Share your repository with others
- ✅ Track changes with version control
- ✅ Collaborate with team members

---

## 🔧 Troubleshooting

### Problem: "git: command not found"

**Solution:** Install Git
1. Download from: https://git-scm.com/download/win
2. Run the installer
3. Restart PowerShell
4. Try again

### Problem: Authentication Failed

**Solution:** Use Personal Access Token
1. Go to: https://github.com/settings/tokens
2. Click "Generate new token (classic)"
3. Give it a name: "Birthday Bash Deployment"
4. Select scopes: ✅ repo (all)
5. Click "Generate token"
6. **Copy the token** (you won't see it again!)
7. Use this token instead of your password when pushing

### Problem: "remote origin already exists"

**Solution:** Remove and re-add
```powershell
git remote remove origin
git remote add origin https://github.com/YOUR_USERNAME/birthday-bash-stream.git
```

### Problem: "fatal: not a git repository"

**Solution:** Make sure you're in the right directory
```powershell
cd C:\Users\HP\Desktop\birthday_bash2\birthday-bash-stream-main
git init
```

### Problem: Files not showing on GitHub

**Solution:** Check what was committed
```powershell
git status
git add .
git commit -m "Add all files"
git push
```

---

## 📝 Quick Command Reference

```powershell
# Check Git status
git status

# See what's been committed
git log --oneline

# Check remote URL
git remote -v

# See current branch
git branch

# Add more files later
git add .
git commit -m "Your message"
git push
```

---

## 🔄 Making Changes Later

After your initial push, when you make changes:

```powershell
# 1. Add changed files
git add .

# 2. Commit with a message
git commit -m "Description of what you changed"

# 3. Push to GitHub
git push

# Railway will auto-deploy your changes!
```

---

## 📚 Next Steps

After your code is on GitHub:

1. ✅ **Verify** - Check GitHub to see your files
2. ✅ **Deploy** - Follow [STEP_BY_STEP_DEPLOYMENT.md](./STEP_BY_STEP_DEPLOYMENT.md)
3. ✅ **Celebrate** - Your app will be live soon! 🎉

---

## 💡 Pro Tips

- **Commit often** - Save your work frequently
- **Write good commit messages** - Describe what you changed
- **Check status** - Use `git status` before committing
- **Pull before push** - If working with others, `git pull` first
- **Use .gitignore** - Already set up to protect sensitive files

---

## 🆘 Need Help?

- **Git Documentation**: https://git-scm.com/doc
- **GitHub Guides**: https://guides.github.com
- **GitHub Support**: https://support.github.com

---

**Your GitHub repository URL will be:**
```
https://github.com/YOUR_USERNAME/birthday-bash-stream
```

**Save this URL!** You'll need it for Railway deployment.

---

*Ready to deploy? After pushing to GitHub, open [STEP_BY_STEP_DEPLOYMENT.md](./STEP_BY_STEP_DEPLOYMENT.md)*
