# ⚡ QUICK DEPLOY REFERENCE

**Global Innovation Build Challenge V1 (2026) - Production Deployment**

---

## 🚀 ONE-COMMAND DEPLOYMENT

### Choose Your Operating System:

**Windows:**
```exec
deploy_and_sync.bat
```

**Linux/macOS:**
```bash
chmod +x deploy_and_sync.sh
./deploy_and_sync.sh
```

### That's it! 🎉

Your platform will be live in ~3-5 minutes with:
- ✅ Cloud Functions deployed (8 endpoints)
- ✅ Firestore security rules active
- ✅ Frontend hosting live
- ✅ Google Sheets sync watching

---

## 🎯 YOUR LIVE URLS

After deployment, visit:

```
🌐 Certificate Generator
   https://your-project.web.app/certificate

👨‍💼 Admin Dashboard
   https://your-project.web.app/admin
   (Password: admin2026)

📱 Main Site
   https://your-project.web.app
```

---

## 🆘 BEFORE YOU DEPLOY

### ✓ Checklist (5 minutes)

```bash
# 1. Check Node.js installed
node --version          # Should be 18+

# 2. Setup Firebase
firebase login
firebase use your-project-id

# 3. Create .env file
cp .env.example .env
# Edit .env with Firebase credentials

# 4. Done ✓
```

---

## 📋 ADMIN COMMANDS

Once deployed, use these commands to manage participants:

```bash
# Check token is valid
node admin-cli.js check-token ABC123XYZ0

# Create new participant
node admin-cli.js create-participant john_doe --email john@example.com

# Assign winner
node admin-cli.js assign-award participant_id Winner

# Regenerate lost token
node admin-cli.js regenerate-token participant_id

# Export all winners to CSV
node admin-cli.js export-csv --award Winner

# Show statistics
node admin-cli.js stats

# List all participants
node admin-cli.js list-participants
```

---

## 🔄 GOOGLE SHEETS SYNC

**Auto-syncs on deploy**, but you can also:

```bash
# One-time sync
node syncFromSheets.js

# Continuous watch (every 5 min)
node syncFromSheets.js --watch

# Custom interval (every 10 min)
node syncFromSheets.js --watch --interval=10
```

See `SHEETS_SYNC_SETUP.md` for configuration.

---

## 🐛 QUICK TROUBLESHOOTING

| Problem | Solution |
|---------|----------|
| `.bat` won't run | Right-click > Run as Administrator |
| `.sh` permission denied | `chmod +x deploy_and_sync.sh` |
| Firebase login failed | `firebase login` again |
| Missing credentials | `cp .env.example .env` and fill in |
| Node not found | Install from https://nodejs.org |

---

## 📱 TESTING PLATFORM

### Create Test Participant
```bash
node admin-cli.js create-participant test_user --email test@example.com
```

Output will show token: `XXXXXXXXXXX`

### Get Certificate
1. Visit: `https://your-project.web.app/certificate`
2. Enter token from above
3. Click "Generate"
4. Download PDF ✓

### Admin Dashboard
1. Visit: `https://your-project.web.app/admin`
2. Password: `admin2026`
3. You'll see test_user in list ✓

---

## 📊 LIVE COMMANDS DURING EVENT

```bash
# Monitor certificates being generated
firebase functions:log --follow

# Quick stats
node admin-cli.js stats

# Create winner on the fly
node admin-cli.js create-participant jane_winner --award Winner

# Mark as winner
node admin-cli.js assign-award abc123 Winner

# Export current awards
node admin-cli.js export-csv --award Winner > final_winners.csv
```

---

## 🔐 AFTER DEPLOYMENT

### Enable Backups
```bash
# In Firebase Console:
Firestore > Backups > Create Daily Backup
```

### Monitor Errors
```bash
firebase functions:log
# OR in Firebase Console > Cloud Functions > Logs
```

### Check Usage
```bash
firebase use gibc-showcase
firebase apps:list
```

---

## 📖 FULL DOCUMENTATION

- **Admin CLI Guide**: `ADMIN_CLI_GUIDE.md`
- **API Reference**: `API_REFERENCE.md`
- **Deployment Checklist**: `DEPLOYMENT_CHECKLIST.md`
- **Google Sheets Setup**: `SHEETS_SYNC_SETUP.md`

---

## ✨ THAT'S ALL!

Your GIBC platform is production-ready. Enjoy! 🚀

Questions? See the full guides above.
