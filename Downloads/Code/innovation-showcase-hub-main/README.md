# Global Innovation Build Challenge V1 (2026)

🏆 **Production-ready backend and deployment system** for managing certificates, tokens, and participant awards in the Global Innovation Build Challenge.

---

## ⚡ Quick Start (90 Seconds)

### 1. Setup
```bash
cd innovation-showcase-hub-main
cp .env.example .env
# Edit .env with your Firebase credentials
firebase login
firebase use your-project-id
```

### 2. Deploy
**Windows:**
```
deploy_and_sync.bat
```

**Linux/macOS:**
```bash
chmod +x deploy_and_sync.sh
./deploy_and_sync.sh
```

### 3. Your Platform is Live! 🎉
```
📝 Registration: https://your-project.web.app/register
🎫 Certificate: https://your-project.web.app/certificate
👨‍💼 Admin: https://your-project.web.app/admin (password: admin2026)
🔗 API: https://your-project.web.app/api/verify
```

---

## 📚 Documentation Roadmap

| Document | Purpose |
|----------|---------|
| **[QUICK_DEPLOY.md](QUICK_DEPLOY.md)** | ⚡ 60-second reference for deploying & admin |
| **[REGISTRATION_QUICK_REFERENCE.md](REGISTRATION_QUICK_REFERENCE.md)** | 🎯 Registration system quick guide |
| **[REGISTRATION_DEPLOYMENT_GUIDE.md](REGISTRATION_DEPLOYMENT_GUIDE.md)** | 📝 Full registration system documentation |
| **[ADMIN_CLI_GUIDE.md](ADMIN_CLI_GUIDE.md)** | 📋 Complete CLI reference for managing participants |
| **[DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)** | 🚀 Detailed step-by-step deployment |
| **[API_REFERENCE.md](API_REFERENCE.md)** | 🔌 All API endpoints & examples |
| **[SHEETS_SYNC_SETUP.md](SHEETS_SYNC_SETUP.md)** | 📊 Google Forms auto-sync configuration |
| **[DEPLOYMENT_CHECKLIST.md](DEPLOYMENT_CHECKLIST.md)** | ✅ Pre-launch verification checklist |

**👉 Start with [QUICK_DEPLOY.md](QUICK_DEPLOY.md) for fastest path to live!**

---

## ✨ Features

### � Hybrid Auto-Approval Registration
- **Smart Auto-Approval**: Instantly approve participants who meet all criteria
- **Manual Review Queue**: Pending submissions for admin review
- **Duplicate Prevention**: Email and username uniqueness enforcement
- **Real-time Validation**: Client and server-side validation
- **Instant Token Generation**: Auto-approved users get tokens immediately
- **Beautiful UI**: Gradient design with confetti animations
- **Mobile Responsive**: Works perfectly on all devices

### �🎫 Token-Based Certificate System
- **Unique 10-character tokens** for each participant
- **Secure verification** with participant credentials
- **Beautiful PDF certificates** with confetti animation
- **Professional design** with award badges and Canva-style template

### 👨‍💼 Admin Dashboard & CLI
- **Web Dashboard**: Manage participants, assign awards, export data
- **Command-Line Interface**: Full participant management from terminal
- **One-click Deployment**: Deploy entire platform in one command
- **Google Sheets Integration**: Auto-sync form responses to database
- **Full CRUD Operations**: Create, read, update, delete participants
- **Award Assignment**: Participant → Finalist → Winner → Grand Prize
- **Token Regeneration**: Recovery for lost/compromised tokens
- **CSV/JSON Export**: Data export for reporting and backups
- **Real-time Statistics**: View counts by award and usage

### 🔄 Google Sheets Integration
- **Auto-sync** from Google Forms submissions
- **Watch mode** for continuous monitoring
- **Duplicate prevention** via username/email matching
- **Batch processing** with detailed logging
- **Scheduled sync** (configurable intervals)

### 🎨 User Experience
- **Responsive design** for all devices
- **Animated UI** with Framer Motion
- **Toast notifications** for user feedback
- **Thank-you modal** with V2 event CTA
- **Confetti celebration** on certificate generation

---

## 🔧 Deployment & Admin Tools

### One-Click Deployment Script
A complete automated deployment system that:
- ✅ Validates prerequisites (Node.js, Firebase)
- ✅ Installs dependencies
- ✅ Builds React frontend
- ✅ Deploys Cloud Functions
- ✅ Deploys Firestore rules & indexes
- ✅ Deploys hosting
- ✅ Starts Google Sheets sync in watch mode
- ✅ Displays live URLs

**Files:**
- `deploy_and_sync.bat` (Windows)
- `deploy_and_sync.sh` (Linux/macOS)

### Admin CLI Tool
Full-featured command-line interface for managing the platform:

```bash
# Check token validity
node admin-cli.js check-token ABC123XYZ0

# Create participants
node admin-cli.js create-participant john_doe --email john@example.com

# Manage awards
node admin-cli.js assign-award participant_id Winner

# Handle lost tokens
node admin-cli.js regenerate-token participant_id

# Export data
node admin-cli.js export-csv --award Winner

# View statistics
node admin-cli.js stats
```

**File:** `admin-cli.js`

---

## 🚀 Architecture

```
Frontend (React + TypeScript + Vite)
    ↓
Firebase Hosting
    ↓
Cloud Functions (Node.js 18)
    ↓
Firestore Database
    ↓
Admin CLI / Google Sheets Sync
```

**Participant Flow:**
```
Google Form → Google Sheets → Sync Script → Firestore
                                   ↓
                            Admin Updates
```

---

## 📁 Complete Project Structure

```
innovation-showcase-hub-main/
├── 🚀 DEPLOYMENT & ADMIN
│   ├── deploy_and_sync.bat          # One-click deployment (Windows)
│   ├── deploy_and_sync.sh           # One-click deployment (Unix/Linux/macOS)
│   ├── admin-cli.js                 # Admin CLI tool (~500 lines)
│   ├── package-admin.json           # Dependencies for CLI/sync
│   └── syncFromSheets.js            # Google Sheets sync script
│
├── 📚 DOCUMENTATION
│   ├── QUICK_DEPLOY.md              # ⚡ 60-sec deployment reference
│   ├── ADMIN_CLI_GUIDE.md           # Complete CLI documentation
│   ├── DEPLOYMENT_GUIDE.md          # Detailed deployment steps
│   ├── DEPLOYMENT_CHECKLIST.md      # Pre-launch checklist
│   ├── API_REFERENCE.md             # API endpoints & examples
│   ├── SHEETS_SYNC_SETUP.md         # Google Sheets integration
│   └── README.md                    # This file
│
├── ⚙️ FIREBASE BACKEND
│   ├── functions/
│   │   ├── index.js                 # 8 Cloud Functions
│   │   └── package.json             # Functions dependencies
│   ├── firebase.json                # Firebase config
│   ├── firestore.rules              # Security rules
│   ├── firestore.indexes.json       # Database indexes
│   └── .firebaserc                  # Project ID
│
├── 🎨 FRONTEND
│   ├── innovation-showcase-hub-main/
│   │   ├── src/
│   │   │   ├── pages/
│   │   │   │   ├── CertificatePage.tsx   # Token → PDF cert + confetti
│   │   │   │   └── AdminPage.tsx         # Participant management web UI
│   │   │   └── lib/
│   │   │       └── firebase.ts           # Firebase config
│   │   ├── package.json             # Frontend dependencies
│   │   └── vite.config.ts           # Build configuration
│   │
│   └── ENVIRONMENT
│       ├── .env.example             # Template for credentials
│       └── .env                     # Your actual credentials (gitignored)
│
└── 🔧 CONFIGURATION
    └── .gitignore                   # Git ignore rules
```

---

## 🎯 Main Components

### 1️⃣ **One-Click Deployment** (`deploy_and_sync.bat` / `deploy_and_sync.sh`)

**What it does:**
```
Stage 1: Validate prerequisites
   • Node.js 18+
   • Firebase CLI
   • Credentials (.env/service-account.json)

Stage 2: Install dependencies
   • Frontend npm install
   • Functions npm install
   • Admin CLI packages

Stage 3: Build frontend
   • Vite build → dist/

Stage 4: Deploy Cloud Functions
   • 8 functions to Firebase

Stage 5: Deploy Firestore
   • Security rules
   • Database indexes

Stage 6: Deploy hosting
   • React frontend to CDN

Stage 7: Display live URLs
   • Certificate page
   • Admin dashboard
   • API endpoints

Stage 8: Start Google Sheets sync
   • Monitor form responses
   • Auto-create participants
```

**Usage:**
```bash
# Full deployment
./deploy_and_sync.sh

# Build frontend only (test locally)
./deploy_and_sync.sh --frontend-only

# Deploy only functions
./deploy_and_sync.sh --functions-only

# Offline build (no Firebase)
./deploy_and_sync.sh --offline

# Just start Google Sheets sync
./deploy_and_sync.sh --sync-only
```

---

### 2️⃣ **Admin CLI Tool** (`admin-cli.js`)

**Complete participant management from terminal:**

```bash
# ✅ Check token is valid
node admin-cli.js check-token ABC123XYZ0

# 👥 Manage participants
node admin-cli.js list-participants
node admin-cli.js list-participants --award Winner
node admin-cli.js participant-info abc123
node admin-cli.js create-participant john_doe --email john@example.com

# 🏆 Award management
node admin-cli.js assign-award abc123 Winner
node admin-cli.js assign-award abc123 Finalist
node admin-cli.js assign-award abc123 "Grand Prize"

# 🎫 Token management
node admin-cli.js regenerate-token abc123

# 📊 Data export
node admin-cli.js stats
node admin-cli.js export-csv
node admin-cli.js export-csv --award Winner

# 🗑️ Dangerous operations
node admin-cli.js delete-participant abc123 --confirm
```

**Key features:**
- ✅ Firebase Firestore integration
- ✅ Cross-platform (Windows, Mac, Linux)
- ✅ 10-character token generation
- ✅ Duplicate prevention
- ✅ CSV export with timestamps
- ✅ Color-coded output
- ✅ Detailed error messages

---

### 3️⃣ **Google Sheets Sync** (`syncFromSheets.js`)

**Auto-sync Google Form responses to Firestore:**

```bash
# One-time sync
node syncFromSheets.js

# Continuous watch (every 5 minutes)
node syncFromSheets.js --watch

# Custom interval (every 10 minutes)
node syncFromSheets.js --watch --interval=10
```

**Features:**
- ✅ Read form responses from Google Sheets
- ✅ Create participants in Firestore
- ✅ Auto-generate unique tokens
- ✅ Check for duplicates
- ✅ Update existing participants
- ✅ Detailed sync logs
- ✅ Scheduled watches

---

## 🌐 Cloud Functions (8 Endpoints)

All functions deployed automatically:

```
1. verifyToken (HTTP)           → Check if token is valid
2. generateCertificate          → Get cert data for PDF
3. assignAward                  → Mark winner/finalist/etc
4. regenerateToken              → New token if lost
5. getParticipants              → Export CSV/JSON
6. createParticipant            → Add new person
7. updateParticipant            → Modify person data
8. deleteParticipant            → Remove person
```

See [API_REFERENCE.md](API_REFERENCE.md) for full details.

---

## 🔐 Security

- **Firestore Rules**: Admin-only writes, public reads for verification
- **Token System**: Cryptographically secure 10-char alphanumeric
- **CORS Protection**: Configured for production domains
- **Environment Secrets**: Stored in .env, not in code

---

## 📋 Installation & Setup

### Prerequisites
```bash
# Node.js 18+ from https://nodejs.org
node --version

# Firebase CLI
npm install -g firebase-tools

# Verify installation
firebase --version
```

### Setup (5 minutes)
```bash
# 1. Navigate to project
cd innovation-showcase-hub-main

# 2. Copy environment template
cp .env.example .env

# 3. Edit .env with Firebase credentials
# Get from: Firebase Console > Project Settings > Service Accounts

# 4. Login to Firebase
firebase login

# 5. Select your project
firebase use your-project-id

# 6. Deploy! ✅
./deploy_and_sync.sh    # or deploy_and_sync.bat on Windows
```

---

## 🎓 Common Tasks

### Award Ceremony
```bash
# Create a winner on the fly
node admin-cli.js create-participant jane_winner

# Check their token
node admin-cli.js participant-info abc123

# Mark as winner
node admin-cli.js assign-award abc123 Winner

# Export all winners
node admin-cli.js export-csv --award Winner
```

### Handle Lost Token
```bash
# Find participant by username
node admin-cli.js list-participants

# Regenerate token
node admin-cli.js regenerate-token abc123
```

### Pre-Event Data Import
```bash
# Create multiple participants
for ((i=1; i<=10; i++)); do
  node admin-cli.js create-participant user_$i
done

# Verify import
node admin-cli.js list-participants
```

### Export for Reporting
```bash
# All participants
node admin-cli.js export-csv > report_all.csv

# Just winners
node admin-cli.js export-csv --award Winner > report_winners.csv

# Statistics
node admin-cli.js stats > statistics.txt
```

---

## 📝 Environment Variables

Create `.env` file with:

```env
# FIREBASE CONFIG
FIREBASE_PROJECT_ID=gibc-showcase
FIREBASE_CLIENT_EMAIL=admin@gibc-showcase.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"

# GOOGLE SHEETS (optional, for form sync)
GOOGLE_SHEETS_ID=your-sheet-id
GOOGLE_SERVICE_ACCOUNT_EMAIL=your-service-account@project.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
```

Get credentials from:
- **Firebase**: Console > Project Settings > Service Accounts
- **Google Sheets**: Google Cloud Console > Service Accounts

---

## 🔗 Your Live URLs (After Deployment)

```
🌐 Main Site
   https://your-project.web.app

🎫 Certificate Generator
   https://your-project.web.app/certificate
   → Users enter token, generate PDF

👨‍💼 Admin Dashboard
   https://your-project.web.app/admin
   Password: admin2026
   → Manage participants, tokens, awards

🔗 Public API
   https://your-project.web.app/api/verify
   → Verify token with credentials

📊 Gallery & Dashboard
   https://your-project.web.app/gallery
   https://your-project.web.app/dashboard
```

---

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| `.bat` won't run | Right-click > Run as Administrator |
| `.sh` permission error | `chmod +x deploy_and_sync.sh` |
| Node not found | Install from https://nodejs.org |
| Firebase login failed | `firebase login` again |
| Missing .env | `cp .env.example .env` and fill values |
| Sync not working | Check .env has Google Sheets credentials |
| Participant not found | `node admin-cli.js list-participants` |
| Cannot generate certificate | Check token exists in Firestore |

See [ADMIN_CLI_GUIDE.md](ADMIN_CLI_GUIDE.md) for more troubleshooting.

---

## 📚 Full Documentation Index

| Guide | Purpose | Read First? |
|-------|---------|------------|
| [QUICK_DEPLOY.md](QUICK_DEPLOY.md) | ⚡ 60-second deployment | **YES** |
| [ADMIN_CLI_GUIDE.md](ADMIN_CLI_GUIDE.md) | Complete CLI reference | For CLI usage |
| [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) | Detailed deployment | If issues arise |
| [DEPLOYMENT_CHECKLIST.md](DEPLOYMENT_CHECKLIST.md) | Pre-launch checklist | Before going live |
| [API_REFERENCE.md](API_REFERENCE.md) | API endpoints | For integrations |
| [SHEETS_SYNC_SETUP.md](SHEETS_SYNC_SETUP.md) | Google Forms sync | For auto-import |

---

## 🎯 Next Steps

1. **Get Started Fast**: Read [QUICK_DEPLOY.md](QUICK_DEPLOY.md) (5 min)
2. **Deploy**: Run `./deploy_and_sync.sh` (5 min)
3. **Test**: Create participant & generate certificate (2 min)
4. **Learn CLI**: Check [ADMIN_CLI_GUIDE.md](ADMIN_CLI_GUIDE.md)
5. **Launch**: Follow [DEPLOYMENT_CHECKLIST.md](DEPLOYMENT_CHECKLIST.md)

---

## 🌟 Technologies

- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS, Framer Motion
- **Backend**: Firebase Cloud Functions, Node.js 18
- **Database**: Cloud Firestore
- **PDF**: html2canvas, jsPDF
- **Animations**: canvas-confetti
- **Forms**: Google Sheets API
- **CLI**: Commander.js, colors, figlet

---

## 📄 License

Built for Global Innovation Build Challenge V1 (2026)

---

## 🤝 Support

For issues, questions, or contributions:
1. Check the relevant documentation
2. Review Firebase console logs
3. Check .env configuration
4. Review [ADMIN_CLI_GUIDE.md](ADMIN_CLI_GUIDE.md) troubleshooting

---

**✨ Your production-ready hackathon platform is ready to launch!**

Start with [QUICK_DEPLOY.md](QUICK_DEPLOY.md) → `./deploy_and_sync.sh` → 🎉 Live!

