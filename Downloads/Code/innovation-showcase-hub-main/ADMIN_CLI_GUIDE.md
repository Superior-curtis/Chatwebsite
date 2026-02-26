# 🚀 GIBC Deployment & Admin CLI Guide

**Global Innovation Build Challenge V1 (2026)**  
Complete production-ready deployment and administration system

---

## 📋 Table of Contents

1. [Quick Start](#quick-start)
2. [One-Click Deployment](#one-click-deployment)
3. [Admin CLI Reference](#admin-cli-reference)
4. [Google Sheets Integration](#google-sheets-integration)
5. [Troubleshooting](#troubleshooting)
6. [Production Readiness](#production-readiness)

---

## Quick Start

### Prerequisites
- **Node.js 18+** - Download from https://nodejs.org
- **Firebase CLI** - Run: `npm install -g firebase-tools`
- **Firebase Project** - Create at https://console.firebase.google.com
- **Google Cloud Project** (for Sheets sync) - https://console.cloud.google.com

### 60-Second Setup

```bash
# 1. Clone/navigate to project
cd innovation-showcase-hub-main

# 2. Create environment file
cp .env.example .env
# Edit .env with your Firebase credentials

# 3. Login to Firebase
firebase login

# 4. Set your Firebase project
firebase use your-project-id

# 5. Run one-click deployment (choose your OS)
# Windows:
deploy_and_sync.bat

# Linux/macOS:
chmod +x deploy_and_sync.sh
./deploy_and_sync.sh
```

**That's it!** Your platform is now live.

---

## One-Click Deployment

### What the Deployment Script Does

```
Stage 1: Pre-flight Checks        ✓ Verify Node, Firebase, credentials
Stage 2: Install Dependencies     ✓ npm install for all modules
Stage 3: Build Frontend           ✓ vite build (React)
Stage 4: Deploy Functions         ✓ Cloud Functions (8 endpoints)
Stage 5: Deploy Firestore         ✓ Security rules & indexes
Stage 6: Deploy Hosting           ✓ Firebase Hosting
Stage 7: Get Live URLs            ✓ Display your platform URLs
Stage 8: Start Sync               ✓ Begin Google Sheet monitoring
```

### Platform Files

**Windows:**
```
deploy_and_sync.bat              Main deployment script
```

**Linux/macOS:**
```
deploy_and_sync.sh               Main deployment script (make executable)
chmod +x deploy_and_sync.sh
./deploy_and_sync.sh
```

### Deployment Options

```bash
# Full deployment (build + functions + hosting + sync)
./deploy_and_sync.sh

# Build frontend only (test locally first)
./deploy_and_sync.sh --frontend-only

# Deploy functions without building frontend
./deploy_and_sync.sh --functions-only

# Build and test offline (no Firebase deployment)
./deploy_and_sync.sh --offline

# Just start Google Sheets sync (if already deployed)
./deploy_and_sync.sh --sync-only
```

### Output After Deployment

```
✓ Deployment Complete!

📊 YOUR PLATFORM IS LIVE!

🎯 IMPORTANT URLS:
   Certificate: https://your-project.web.app/certificate
   Admin: https://your-project.web.app/admin (password: admin2026)
   API: https://your-project.web.app/api/verify
```

---

## Admin CLI Reference

### Overview

The Admin CLI (`admin-cli.js`) provides command-line tools for managing participants, tokens, and awards.

### Installation

```bash
# Option 1: Using npm (if you set it up globally)
npm install -g gibc-admin

# Option 2: Direct usage
node admin-cli.js <command> [options]
```

### Commands

#### 📋 Participant Management

**Check Token Validity**
```bash
node admin-cli.js check-token ABC123XYZ0
```
Output:
```
🔍 Checking token: ABC123XYZ0

════════════════════════════════════════════════════════════════════════════
📋 PARTICIPANT INFO
════════════════════════════════════════════════════════════════════════════
🆔 ID: abc123def456
👤 Username: john_doe
📧 Email: john@example.com
🚀 Project: My Awesome Project
🔗 URL: https://devpost.com/software/my-project
🏆 Award: Winner
🎫 Token: ABC123XYZ0
✅ Token Used: No
📅 Created: 1/15/2026, 10:00:00 AM
🔄 Updated: 1/15/2026, 10:00:00 AM
════════════════════════════════════════════════════════════════════════════
```

**List All Participants**
```bash
# View all participants
node admin-cli.js list-participants

# Filter by award
node admin-cli.js list-participants --award Winner
node admin-cli.js list-participants --award Finalist
```

**Get Detailed Participant Info**
```bash
node admin-cli.js participant-info abc123def456
```

**Create New Participant**
```bash
# Basic (minimum required)
node admin-cli.js create-participant john_doe

# With email
node admin-cli.js create-participant jane_smith --email jane@example.com

# With all details
node admin-cli.js create-participant jane_smith \
  --email jane@example.com \
  --project "AI Innovation Platform"
```

---

#### 🏆 Award Management

**Assign Award**
```bash
node admin-cli.js assign-award abc123def456 Winner
```

Valid awards:
- `Participant` (default)
- `Finalist` (2nd tier)
- `Winner` (1st tier)
- `Grand Prize` (top award)

**Examples:**
```bash
# Mark as finalist
node admin-cli.js assign-award abc123def456 Finalist

# Mark as winner
node admin-cli.js assign-award abc123def456 Winner

# Mark as grand prize
node admin-cli.js assign-award abc123def456 "Grand Prize"
```

---

#### 🎫 Token Management

**Regenerate Token (if lost/compromised)**
```bash
node admin-cli.js regenerate-token abc123def456
```

Output:
```
🔄 Regenerating token for abc123def456...

✅ Token regenerated successfully!
   Old Token: ABC123XYZ0
   New Token: XYZ456ABCD
```

---

#### 📊 Data Export & Statistics

**Show Statistics**
```bash
node admin-cli.js stats
```

Output:
```
📊 GLOBAL STATISTICS

════════════════════════════════════════════════════════════════════════
👥 Total Participants: 150
🎟️  Participants: 100
🥈 Finalists: 35
🥇 Winners: 12
👑 Grand Prize: 3
✅ Tokens Used: 89
📧 With Email: 145
🚀 With Project: 148
════════════════════════════════════════════════════════════════════════
```

**Export to CSV** (for awards, reporting, etc.)
```bash
# Export all participants
node admin-cli.js export-csv

# Export only winners
node admin-cli.js export-csv --award Winner

# Export only finalists
node admin-cli.js export-csv --award Finalist
```

Creates: `participants_2026-02-26.csv`

Columns:
```
Devpost Username, Email, Project Name, Project URL, Award, Token, Token Used
john_doe, john@example.com, My Project, https://devpost.com/..., Winner, ABC123XYZ0, No
jane_smith, jane@example.com, AI Platform, https://devpost.com/..., Finalist, XYZ456ABCD, Yes
```

---

#### 🗑️ Dangerous Operations

**Delete Participant**
```bash
# Show confirmation prompt (doesn't delete yet)
node admin-cli.js delete-participant abc123def456

# Output:
# ⚠️  WARNING: You are about to delete a participant!
#    Username: john_doe
#    Token: ABC123XYZ0
#    This action cannot be undone.
#
# To confirm, run: node admin-cli.js delete-participant abc123def456 --confirm

# Actually delete (requires --confirm)
node admin-cli.js delete-participant abc123def456 --confirm
```

---

### Admin CLI Examples

#### Scenario 1: Award Ceremony Updates

```bash
# Check if participant token is valid
node admin-cli.js check-token AWARD001234

# Get participant info
node admin-cli.js participant-info abc123def456

# Mark as winner
node admin-cli.js assign-award abc123def456 Winner

# View all winners
node admin-cli.js list-participants --award Winner

# Export winners for certificate batch
node admin-cli.js export-csv --award Winner
```

#### Scenario 2: Handle Lost Token

```bash
# Participant lost their token
node admin-cli.js participant-info abc123def456

# Regenerate a new one
node admin-cli.js regenerate-token abc123def456

# Participant gets new token to use at /certificate page
```

#### Scenario 3: Add Late Registrants

```bash
# Create several new participants before ceremony
node admin-cli.js create-participant john_doe --email john@example.com
node admin-cli.js create-participant jane_smith --email jane@example.com
node admin-cli.js create-participant bob_johnson --email bob@example.com

# List all to confirm
node admin-cli.js list-participants

# Assign awards if they're winners
node admin-cli.js assign-award abc123def456 Winner
node admin-cli.js assign-award def456ghi789 Finalist
```

#### Scenario 4: Pre-Event Reporting

```bash
# Get overall numbers
node admin-cli.js stats

# Get specific award counts
node admin-cli.js list-participants --award Finalist

# Export everything for records
node admin-cli.js export-csv

# Archive for backups
mkdir -p ./backups
cp participants_*.csv ./backups/
```

---

## Google Sheets Integration

### Automatic Form Sync

The Google Sheets sync continuously monitors your Google Form responses and automatically:
- ✅ Creates Firestore participants from new form submissions
- ✅ Updates participant info if existing
- ✅ Generates unique tokens automatically
- ✅ Prevents duplicates

### Setup

1. **Create Google Form** with fields:
   - Devpost Username (required)
   - Email (optional)
   - Project Name (optional)
   - Project URL (optional)

2. **Link to Google Sheet**
   - In Google Form: Click "Responses" > Create spreadsheet

3. **Set up Google Cloud Credentials**
   - See `SHEETS_SYNC_SETUP.md` for detailed instructions

4. **Configure .env**
   ```env
   GOOGLE_SHEETS_ID=your-sheet-id
   GOOGLE_SERVICE_ACCOUNT_EMAIL=your-service-account@project.iam.gserviceaccount.com
   GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
   FIREBASE_PROJECT_ID=gibc-showcase
   ```

### Running Sync

**Automatic (via deployment script):**
```bash
./deploy_and_sync.sh
# Stage 8 starts sync automatically in watch mode
```

**Manual sync:**
```bash
# One-time sync
node syncFromSheets.js

# Watch mode (every 5 minutes)
node syncFromSheets.js --watch

# Custom interval (every 10 minutes)
node syncFromSheets.js --watch --interval=10
```

---

## Troubleshooting

### 🔴 Cannot run deployment script

**Windows (.bat file won't run):**
```powershell
# Right-click deploy_and_sync.bat > Run as administrator
# OR from PowerShell:
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
.\deploy_and_sync.bat
```

**Linux/macOS (permission denied):**
```bash
chmod +x deploy_and_sync.sh
./deploy_and_sync.sh
```

---

### 🔴 Firebase credentials not found

Create `.env` file:
```bash
cp .env.example .env
```

Fill in with your Firebase credentials from:
- Firebase Console > Project Settings > Service Accounts

```env
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=admin@your-project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
```

---

### 🔴 Admin CLI not working

**Check Node.js:**
```bash
node --version  # Should be v18+
npm --version
```

**Install dependencies:**
```bash
npm install firebase-admin csv-writer dotenv googleapis
```

**Check service account:**
```bash
# Verify credentials exist
cat .env
# or
cat service-account.json
```

---

### 🔴 Google Sheets sync not syncing

1. **Check sheet ID** in `.env`
2. **Verify sheet is shared** with service account email
3. **Check sheet row structure**:
   - Row 1: Headers
   - Row 2+: Data
4. **Check permissions**: Service account needs `Editor` role on sheet

---

### 🔴 Participant not found in Firestore

1. Run `node admin-cli.js list-participants` to see all
2. Check tokenused? If true, they already used certificate
3. Check if sync imported them (check timestamp)
4. Manually create: `node admin-cli.js create-participant username`

---

## Production Readiness

### Pre-Launch Checklist

- [ ] Firebase project created & configured
- [ ] `.env` file with real credentials
- [ ] Deployment script runs without errors
- [ ] Test participant created & can generate certificate
- [ ] Admin CLI tested (list, create, assign-award, export)
- [ ] Google Sheets sync working (optional)
- [ ] Custom domain configured (optional)
- [ ] SSL certificate active
- [ ] Firestore backups enabled
- [ ] Monitoring/logging configured

### Launch Day Commands

```bash
# Monitor certificate generations
firebase functions:log

# Check real-time stats
node admin-cli.js stats

# Monitor sync (if using sheets)
# Terminal 1:
./deploy_and_sync.sh --sync-only

# Export end-of-day report
node admin-cli.js export-csv > final_report.csv
```

---

### Post-Ceremony

```bash
# Archive all participant data
node admin-cli.js export-csv > archive_$(date +%Y%m%d).csv

# Backup to cloud storage
gsutil cp archive_*.csv gs://your-backup-bucket/

# Generate final statistics
node admin-cli.js stats > statistics.txt
```

---

## 🎯 Platform URLs (After Deployment)

```
🌐 Public Site
   https://your-project.web.app
   https://your-project.web.app/gallery
   https://your-project.web.app/dashboard

🎫 Certificate Page
   https://your-project.web.app/certificate
   
👨‍💼 Admin Dashboard
   https://your-project.web.app/admin
   Password: admin2026

🔗 API Endpoints
   https://your-project.web.app/api/verify  (Token verification)
   https://us-central1-gibc-showcase.cloudfunctions.net/verifyToken
   https://us-central1-gibc-showcase.cloudfunctions.net/generateCertificate
   https://us-central1-gibc-showcase.cloudfunctions.net/assignAward
   https://us-central1-gibc-showcase.cloudfunctions.net/regenerateToken
   https://us-central1-gibc-showcase.cloudfunctions.net/getParticipants
   https://us-central1-gibc-showcase.cloudfunctions.net/createParticipant
   https://us-central1-gibc-showcase.cloudfunctions.net/updateParticipant
   https://us-central1-gibc-showcase.cloudfunctions.net/deleteParticipant
```

---

## 🔧 Advanced Usage

### Custom Admin Password

Edit `.env`:
```env
ADMIN_PASSWORD=your_custom_password_here
```

Update Cloud Functions `functions/index.js`:
```javascript
if (data.adminPass !== process.env.ADMIN_PASSWORD) {
  throw new functions.https.HttpsError('permission-denied', 'Invalid password');
}
```

Redeploy: `firebase deploy --only functions`

---

### Firestore Backups

Enable in Firebase Console:
```
Firestore > Backups > Create Backup > Daily at 2:00 AM
```

Or via CLI:
```bash
gcloud firestore backups create \
  --async \
  --location=us-central1 \
  --retention-duration=7d
```

---

### Email Notifications

To send emails when certificates are generated, update Cloud Functions:

```javascript
const nodemailer = require('nodemailer');

const sendEmail = async (email, certificateUrl) => {
  // Set up email service
  // Send notification
};
```

---

## Support & Documentation

- **API Reference**: See `API_REFERENCE.md`
- **Deployment Details**: See `DEPLOYMENT_GUIDE.md`
- **Google Sheets Setup**: See `SHEETS_SYNC_SETUP.md`
- **Project README**: See `README.md`

---

## 📞 Help & Support

For issues:
1. Check `TROUBLESHOOTING.md`
2. Review `API_REFERENCE.md` for endpoints
3. Check Firebase console for error logs
4. Review `.env` configuration

---

**🎉 Your GIBC platform is ready to go live!**

Built with ❤️ for Global Innovation Build Challenge V1 (2026)
