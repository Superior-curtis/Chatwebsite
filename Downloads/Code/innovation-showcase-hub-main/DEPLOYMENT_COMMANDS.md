# ⚡ DEPLOYMENT COMMANDS - Quick Reference Card

**Hybrid Auto-Approval Registration System**  
**Global Innovation Build Challenge V1 (2026)**

---

## 🚀 ONE-COMMAND DEPLOYMENT

### Windows
```batch
deploy_registration.bat
```

### Linux/macOS
```bash
chmod +x deploy_registration.sh
./deploy_registration.sh
```

---

## 📋 MANUAL DEPLOYMENT (Step-by-Step)

### Step 1: Deploy Cloud Function
```bash
firebase deploy --only functions:submitRegistration
```

### Step 2: Build Frontend
```bash
cd innovation-showcase-hub-main
npm install  # if needed
npm run build
cd ..
```

### Step 3: Deploy Hosting
```bash
firebase deploy --only hosting
```

---

## ✅ VERIFICATION COMMANDS

### Check Function Deployed
```bash
firebase functions:list | grep submitRegistration
```

### Check Function Logs
```bash
firebase functions:log --only submitRegistration
```

### Check Hosting URL
```bash
firebase hosting:sites:list
```

---

## 🧪 TEST COMMANDS

### Test Auto-Approval
**URL**: `https://your-project.web.app/register`

**Fill**:
- Name: John Doe
- Email: john@test.com  
- Username: johndoe123
- Project: Amazing Innovation Project
- Link: https://devpost.com/software/my-project
- Agreement: ✓

**Expected**: Token shown immediately 🎉

---

### Test Pending Review
**URL**: `https://your-project.web.app/register`

**Fill**:
- Name: Jane Smith
- Email: jane@test.com
- Username: janesmith
- Project: App ← (too short)
- Link: https://github.com/project ← (not devpost)
- Agreement: ✓

**Expected**: Pending review message ⏳

---

## 👨‍💼 ADMIN COMMANDS

### View All Registrations
```bash
node admin-cli.js list-participants
```

### View Statistics
```bash
node admin-cli.js stats
```

### Approve Pending Participant
```bash
node admin-cli.js regenerate-token <participant-id>
```

### Export Data
```bash
node admin-cli.js export-csv
```

---

## 🔍 DEBUGGING COMMANDS

### Check Firebase Project
```bash
firebase projects:list
firebase use <project-id>
```

### View All Functions
```bash
firebase functions:list
```

### Real-time Logs
```bash
firebase functions:log --follow
```

### Check Firestore Data
**Firebase Console**: https://console.firebase.google.com
1. Select project
2. Go to Firestore Database
3. Open `participants` collection
4. View documents

---

## 📱 ACCESS URLS

After deployment:

```
📝 Registration Page
https://your-project.web.app/register

🎫 Certificate Page  
https://your-project.web.app/certificate

👨‍💼 Admin Dashboard
https://your-project.web.app/admin

🏠 Home Page
https://your-project.web.app
```

---

## 🚨 TROUBLESHOOTING COMMANDS

### Function Not Found
```bash
firebase deploy --only functions:submitRegistration
firebase functions:list
```

### Frontend Not Updated
```bash
cd innovation-showcase-hub-main
npm run build
cd ..
firebase deploy --only hosting
# Clear browser cache
```

### Check Dependencies
```bash
# Frontend
cd innovation-showcase-hub-main
npm install

# Functions
cd ../functions
npm install
```

### Reset Everything
```bash
# Full redeploy
firebase deploy --only functions,hosting
```

---

## 📊 MONITORING COMMANDS

### Registration Volume
```bash
# Via Admin CLI
node admin-cli.js stats

# Via Firebase Console
# Firestore → participants → Count documents
```

### Auto-Approval Rate
```bash
# Export and calculate
node admin-cli.js export-csv

# In CSV:
# Count: status = "approved"
# Count: status = "pending"  
# Rate = approved / total
```

### Recent Registrations
```bash
# In Firebase Console
# Firestore → participants
# Sort by: createdAt (descending)
```

---

## 🔐 SECURITY COMMANDS

### Update Firestore Rules
```bash
firebase deploy --only firestore:rules
```

### Update Indexes
```bash
firebase deploy --only firestore:indexes
```

### View Security Rules
```bash
cat firestore.rules
```

---

## 📚 DOCUMENTATION COMMANDS

### View Quick Reference
```bash
# Windows
type REGISTRATION_QUICK_REFERENCE.md

# Linux/macOS
cat REGISTRATION_QUICK_REFERENCE.md
```

### View Deployment Guide
```bash
# Windows
type REGISTRATION_DEPLOYMENT_GUIDE.md

# Linux/macOS
less REGISTRATION_DEPLOYMENT_GUIDE.md
```

### View All Docs
```bash
ls -la *.md
```

---

## 🎯 COMMON WORKFLOWS

### Initial Deployment
```bash
./deploy_registration.sh
# Test at /register
# Verify in Firestore
```

### Update Function Only
```bash
firebase deploy --only functions:submitRegistration
```

### Update Frontend Only
```bash
cd innovation-showcase-hub-main
npm run build
cd ..
firebase deploy --only hosting
```

### Full Redeploy
```bash
firebase deploy --only functions,hosting
```

---

## ✅ POST-DEPLOYMENT CHECKLIST

Run these commands to verify:

```bash
# 1. Check function
firebase functions:list | grep submitRegistration

# 2. Check hosting
curl https://your-project.web.app/register

# 3. Test registration
# Visit /register in browser

# 4. Check admin
node admin-cli.js stats

# 5. Check Firestore
# Firebase Console → Firestore
```

---

## 💡 QUICK TIPS

**Before Deployment**:
```bash
firebase login
firebase use your-project-id
node --version  # Should be 18+
```

**After Deployment**:
```bash
# Save your URLs
echo "https://your-project.web.app/register" > LIVE_URLS.txt

# Test immediately
# Visit /register
# Try auto-approval test
```

**For Production**:
```bash
# Export data regularly
node admin-cli.js export-csv

# Monitor logs
firebase functions:log --follow

# Check quotas
# Firebase Console → Usage
```

---

## 🎊 DEPLOYMENT SUCCESS INDICATORS

After running deployment, you should see:

✅ Function deployed: `submitRegistration`  
✅ Hosting URL: `https://your-project.web.app`  
✅ `/register` accessible  
✅ Auto-approval works  
✅ Admin CLI shows registrations  

---

## 📞 HELP COMMANDS

### Get Firebase Help
```bash
firebase --help
firebase deploy --help
firebase functions:log --help
```

### Get Admin CLI Help
```bash
node admin-cli.js --help
```

### Get npm Help
```bash
npm --help
```

---

**🚀 Ready to deploy? Run one command and go live!**

```bash
# Pick your platform:
deploy_registration.bat          # Windows
./deploy_registration.sh         # Linux/macOS
```

**📚 Need help? Check:**
- [DEPLOYMENT_READY.md](DEPLOYMENT_READY.md) - Complete guide
- [REGISTRATION_QUICK_REFERENCE.md](REGISTRATION_QUICK_REFERENCE.md) - Quick answers
- [REGISTRATION_DEPLOYMENT_GUIDE.md](REGISTRATION_DEPLOYMENT_GUIDE.md) - Full documentation

**Your registration system is ready to launch! 🎉**
