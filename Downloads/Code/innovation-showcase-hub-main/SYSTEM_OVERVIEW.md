# 🏛️ GIBC System Architecture & Components

**Global Innovation Build Challenge V1 (2026)**

Complete overview of the production platform architecture, components, and data flow.

---

## 📊 High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     PARTICIPANTS                            │
│  (Generate certs, enter tokens, view status)               │
└────────────────────────┬────────────────────────────────────┘
                         │
                    HTTPS/REST
                         │
        ┌────────────────┴────────────────┐
        │                                 │
        ▼                                 ▼
    ┌─────────────────┐          ┌──────────────────┐
    │ React Frontend  │          │  HTTP API        │
    │   (Vite)        │          │ /api/verify      │
    │                 │          │ /certificate     │
    │ - Certificate   │          │ /admin           │
    │ - Admin UI      │          │ /gallery         │
    │ - Dashboard     │          │ /dashboard       │
    └────────┬────────┘          └────────┬─────────┘
             │                            │
             └────────────┬───────────────┘
                          │
                    Firebase SDK
                          │
        ┌─────────────────┴──────────────────┐
        │                                    │
        ▼                                    ▼
    ┌──────────────────────┐        ┌──────────────────┐
    │  Cloud Functions     │        │  Cloud Firestore │
    │   (8 endpoints)      │        │   Database       │
    │                      │        │                  │
    │ Admin Functions:     │        │ - participants   │
    │ - verifyToken       │        │ - tokens         │
    │ - generateCert      │        │ - awards         │
    │ - assignAward       │        │ - metadata       │
    │ - regenerateToken   │        │                  │
    │ - getParticipants   │        │ Indexes:         │
    │ - createParticipant │        │ - email+date     │
    │ - updateParticipant │        │ - token          │
    │ - deleteParticipant │        │ - award+date     │
    └──────────┬───────────┘        └────────┬─────────┘
               │                            │
               └────────────┬───────────────┘
                            │
                  (Reads/Writes/Queries)
                            │
        ┌───────────────────┴──────────────────┐
        │                                      │
        ▼                                      ▼
    ┌──────────────────┐            ┌─────────────────┐
    │ Admin CLI        │            │ Google Sheets   │
    │ admin-cli.js     │            │ Sync Service    │
    │                  │            │                 │
    │ Commands:        │            │ - Poll sheets   │
    │ - check-token    │            │ - Create parts  │
    │ - list-parts     │            │ - Update parts  │
    │ - assign-award   │            │ - No duplicates │
    │ - regen-token    │            │ - Watch mode    │
    │ - export-csv     │            └─────────────────┘
    │ - stats          │                      │
    └──────────────────┘            Google Sheets API
                                              │
                                     ┌────────▼─────────┐
                                     │  Google Forms    │
                                     │  Responses       │
                                     └──────────────────┘
```

---

## 🔄 Data Flow Diagrams

### 1. New Participant Registration Flow

```
Participant submits Google Form
            │
            ▼
    Google Sheets
    (auto-linked)
            │
    ┌───────┴───────┐
    │               │
    ▼ (Option A)    ▼ (Option B)
 Sync Script    Admin CLI
 (automatic)    (manual)
    │               │
    └───────┬───────┘
            │
            ▼
    Firestore
    participants/
    {
      devpostUsername: string
      email: string
      projectName: string
      projectUrl: string
      token: string (auto-generated)
      award: string (default: "Participant")
      tokenUsed: boolean
      createdAt: timestamp
      updatedAt: timestamp
    }
```

### 2. Certificate Generation Flow

```
User visits /certificate
            │
            ▼
Enter Token + Name
            │
            ▼
Click "Generate"
            │
            ▼
Frontend calls verifyToken
            │
            ▼
Cloud Function queries Firestore
            │
    ┌───────┼───────┐
    │       │       │
No  │       │Yes    │
Token│       │ Token
    │       │       │
    ▼       ▼       ▼
Error    generateCertificate
         (get cert data)
            │
            ▼
Return cert object
{
  participantName: string
  projectName: string
  projectUrl: string
  award: string
  eventName: string
  eventDate: string
  issuer: string
  token: string
}
            │
            ▼
Frontend renders certificate
            │
            ▼
User sees beautiful design
+ confetti animation
            │
            ▼
Click "Download PDF"
            │
            ▼
html2canvas renders to image
            │
            ▼
jsPDF embeds image
            │
            ▼
Browser downloads PDF
            │
            ▼
Show thank-you modal
(with V2 event CTA)
```

### 3. Award Assignment Flow

```
Admin accesses /admin
            │
            ▼
Enters password: admin2026
            │
            ▼
Dashboard loads participants
            │
            ▼
Click "Award Selector"
for participant
            │
            ▼
Select: Finalist/Winner/Grand Prize
            │
            ▼
Frontend calls assignAward
            │
            ▼
Cloud Function updates
Firestore participant document
            │
            ▼
Toast notification: "Award assigned!"
            │
            ▼
Dashboard refreshes stats
```

### 4. Admin CLI Flow

```
User runs: node admin-cli.js <command>
            │
            ▼
Load Firebase credentials
    from .env or service-account.json
            │
            ▼
Initialize Firestore connection
            │
            ▼
Execute command:
   │
   ├─ check-token → Query: token == X
   ├─ list-participants → Query: all
   ├─ assign-award → Update: award field
   ├─ regenerate-token → Update + generate new
   ├─ export-csv → Read all → Write CSV file
   └─ stats → Count by award
            │
            ▼
Display formatted results
            │
            ▼
Exit
```

---

## 📁 File Dependency Map

```
.gitignore
│
├─ .env (secrets - should NOT commit)
├─ .env.example (template - commit this)
│
├─ Firebase Config Files
│  ├─ firebase.json (hosting + functions)
│  ├─ firestore.rules (security rules)
│  ├─ firestore.indexes.json (database indexes)
│  └─ .firebaserc (project ID)
│
├─ Deployment System
│  ├─ deploy_and_sync.bat (Windows script)
│  ├─ deploy_and_sync.sh (Unix/Linux script)
│  └─ (both orchestrate stages 1-8)
│
├─ Backend
│  └─ functions/
│      ├─ index.js (8 Cloud Functions ~400 lines)
│      ├─ package.json
│      └─ node_modules/
│          ├─ firebase-admin
│          ├─ firebase-functions
│          └─ ...
│
├─ Frontend
│  └─ innovation-showcase-hub-main/
│      ├─ src/
│      │  ├─ pages/
│      │  │  ├─ CertificatePage.tsx (token + PDF + confetti)
│      │  │  └─ AdminPage.tsx (web UI for management)
│      │  ├─ lib/
│      │  │  └─ firebase.ts (Firebase config)
│      │  ├─ components/ (UI components)
│      │  ├─ App.tsx (routing)
│      │  └─ main.tsx (entry point)
│      ├─ package.json
│      ├─ vite.config.ts
│      ├─ dist/ (build output)
│      └─ node_modules/
│          ├─ react
│          ├─ firebase
│          ├─ jspdf
│          ├─ html2canvas
│          ├─ canvas-confetti
│          └─ ...
│
├─ Admin Tools
│  ├─ admin-cli.js (complete Admin CLI ~500 lines)
│  ├─ syncFromSheets.js (Google Sheets sync ~350 lines)
│  ├─ package-admin.json (CLI dependencies)
│  └─ node_modules/
│      ├─ firebase-admin
│      ├─ googleapis
│      ├─ csv-writer
│      ├─ dotenv
│      └─ ...
│
└─ Documentation
   ├─ README.md (main overview)
   ├─ QUICK_DEPLOY.md (60-sec reference)
   ├─ ADMIN_CLI_GUIDE.md (complete CLI docs)
   ├─ DEPLOYMENT_GUIDE.md (detailed setup)
   ├─ DEPLOYMENT_CHECKLIST.md (pre-launch)
   ├─ API_REFERENCE.md (endpoint docs)
   ├─ SHEETS_SYNC_SETUP.md (Google Sheets)
   └─ SYSTEM_OVERVIEW.md (this file)
```

---

## 🛠️ Component Details

### 1. React Frontend (`innovation-showcase-hub-main/`)

**Technology Stack:**
- React 18 + TypeScript
- Vite (build tool)
- Tailwind CSS (styling)
- Framer Motion (animations)
- React Router (navigation)

**Key Files:**
- `CertificatePage.tsx` (~400 lines)
  - Token input form
  - Certificate preview rendering
  - Confetti animation
  - PDF generation (html2canvas + jsPDF)
  - Thank-you modal

- `AdminPage.tsx` (~350 lines)
  - Participant table
  - Search & filter
  - Create/Edit/Delete dialogs
  - Award assignment dropdown
  - Token regeneration
  - CSV/JSON export buttons
  - Real-time stats

- `firebase.ts`
  - Firebase SDK initialization
  - Project configuration
  - Exports: `db`, `auth`, `functions`

**Dependencies:**
```json
{
  "react": "18.3.1",
  "firebase": "11.3.0",
  "jspdf": "4.2.0",
  "html2canvas": "1.4.1",
  "canvas-confetti": "1.9.4",
  "framer-motion": "^10.16",
  "tailwindcss": "^3.4"
}
```

---

### 2. Cloud Functions (`functions/index.js`)

**8 Production Functions:**

1. **verifyToken** (HTTP)
   - Endpoint: `/api/verify`
   - Input: `{ token, participantName?, email? }`
   - Output: `{ valid, participant? }`
   - Public access

2. **generateCertificate** (Callable)
   - Input: `{ token, participantName? }`
   - Output: `{ certificate object }`
   - Called by frontend

3. **assignAward** (Callable)
   - Input: `{ participantId, award }`
   - Updates: participant.award field
   - Admin only

4. **regenerateToken** (Callable)
   - Input: `{ participantId }`
   - Output: `{ newToken }`
   - Admin only

5. **getParticipants** (Callable)
   - Input: `{ format: "csv" | "json" }`
   - Output: `{ data as string }`
   - Admin only

6. **createParticipant** (Callable)
   - Input: `{ devpostUsername, email?, projectName? }`
   - Output: `{ participantId, token }`
   - Admin only → generates token

7. **updateParticipant** (Callable)
   - Input: `{ participantId, ...updates }`
   - Updates: Firestore document
   - Admin only

8. **deleteParticipant** (Callable)
   - Input: `{ participantId }`
   - Deletes: Firestore document
   - Admin only

---

### 3. Admin CLI (`admin-cli.js`)

**~500 lines of Node.js code**

**Features:**
- Firebase Admin SDK initialization
- Firestore CRUD operations
- Unique token generation
- CSV export with csv-writer
- Pretty-printed output with colors
- Command-line argument parsing
- Comprehensive error handling

**Commands Implemented:**
```
check-token <token>
list-participants [--award award]
participant-info <id>
create-participant <username> [--email] [--project]
assign-award <id> <award>
regenerate-token <id>
export-csv [--award award]
stats
delete-participant <id> [--confirm]
--help
```

**Example Usage:**
```bash
node admin-cli.js check-token ABC123XYZ0
node admin-cli.js create-participant john_doe --email john@example.com
node admin-cli.js assign-award abc123 Winner
node admin-cli.js export-csv --award Winner
node admin-cli.js stats
```

---

### 4. Google Sheets Sync (`syncFromSheets.js`)

**~350 lines of Node.js code**

**Features:**
- Google Sheets API v4
- Firestore Admin SDK
- Batch processing
- Duplicate detection
- Token generation
- Update or create logic
- Watch mode (continuous sync)
- Detailed logging

**Flow:**
1. Read all rows from Google Sheet
2. For each row:
   - Extract: username, email, projectName, projectUrl
   - Check if exists in Firestore (by username or email)
   - If exists: update changed fields
   - If new: create with auto-generated token
3. Output summary (created, updated, skipped, errors)
4. Repeat at configured interval in watch mode

**Usage:**
```bash
node syncFromSheets.js            # One-time sync
node syncFromSheets.js --watch    # Watch mode (5 min interval)
node syncFromSheets.js --watch --interval=10  # Custom interval
```

---

### 5. Deployment Scripts

#### Windows (`deploy_and_sync.bat`)
- 400+ lines of batch script
- 8-stage deployment process
- Supports: --offline, --frontend-only, --functions-only, --sync-only

#### Linux/macOS (`deploy_and_sync.sh`)
- 400+ lines of bash script
- Same 8-stage process
- Same options as .bat

**Stages:**
1. Pre-flight checks (Node, Firebase, credentials)
2. Install dependencies (npm install)
3. Build frontend (vite build)
4. Deploy functions (firebase deploy --only functions)
5. Deploy firestore (rules + indexes)
6. Deploy hosting (react frontend)
7. Display live URLs
8. Start Google Sheets sync (watch mode)

---

## 🔐 Security Architecture

### Firestore Rules (firestore.rules)
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Public: Anyone can verify tokens
    match /participants/{document=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

**Note:** Production should use more restrictive rules with custom auth checks.

---

### Token Generation
```javascript
function generateToken() {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let token = "";
  for (let i = 0; i < 10; i++) {
    token += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return token;
}
// Result: ABC123XYZ0 (10 chars, alphanumeric)
```

---

### Firestore Indexes

```json
{
  "indexes": [
    {
      "collection": "participants",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "email", "order": "ASCENDING" },
        { "fieldPath": "createdAt", "order": "DESCENDING" }
      ]
    },
    {
      "collection": "participants",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "token", "order": "ASCENDING" }
      ]
    },
    {
      "collection": "participants",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "award", "order": "ASCENDING" },
        { "fieldPath": "createdAt", "order": "DESCENDING" }
      ]
    }
  ]
}
```

---

## 📊 Firestore Data Schema

### participants Collection

```javascript
{
  id: "auto-generated-by-firestore",
  data: {
    // Required fields
    devpostUsername: string,        // "john_doe"
    token: string,                  // "ABC123XYZ0" (unique, required)
    
    // Optional fields
    email: string | null,           // "john@example.com"
    projectName: string | null,     // "My Awesome Project"
    projectUrl: string | null,      // "https://devpost.com/..."
    award: string,                  // "Participant|Finalist|Winner|Grand Prize"
    
    // System fields
    tokenUsed: boolean,             // true if certificate downloaded
    createdAt: Timestamp,           // auto-set on creation
    updatedAt: Timestamp,           // auto-update on changes
    formSubmittedAt: Timestamp | null  // from Google Sheet (optional)
  }
}
```

**Document Count Examples:**
- Small event: 50-200 participants
- Medium event: 200-1000 participants
- Large event: 1000+ participants

**Estimated Storage:** ~500 bytes per participant document

---

## 🌐 Deployment Targets

### Cloud Firestore Database
- Location: us-central1 (or your choice)
- Storage: ~1-10MB for typical event
- Reads/Writes: 50K/day free tier, unlimited on Blaze

### Cloud Functions
- Runtime: Node.js 18
- Memory: 256MB default (sufficient)
- Concurrent executions: Auto-scaling
- Cold starts: ~1-2 seconds
- Free tier: 2M/month invocations

### Firebase Hosting
- CDN: Global edge network
- SSL: Automatic TLS
- Custom domain: Optional
- Free tier: Sufficient for typical event

### Google Cloud Storage (optional)
- Certificate background images
- Backups and exports
- Free tier: 5GB

---

## 🔄 Environment Configuration

### .env File Structure
```env
# FIREBASE CREDENTIALS (required)
FIREBASE_PROJECT_ID=gibc-showcase
FIREBASE_CLIENT_EMAIL=admin@gibc-showcase.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"

# GOOGLE SHEETS (optional, for sync)
GOOGLE_SHEETS_ID=your-sheet-id
GOOGLE_SERVICE_ACCOUNT_EMAIL=your-service-account@project.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"

# ADMIN CONFIG (optional)
ADMIN_PASSWORD=admin2026
SYNC_INTERVAL=5
```

---

## 📈 Scalability & Performance

### Expected Performance
- **Token verification**: <100ms
- **Certificate generation**: <200ms
- **Participant list (100 docs)**: <500ms
- **PDF generation**: 1-3 seconds (client-side)
- **Google Sheets sync**: <5 seconds per 100 rows

### Concurrent Users
- **Simultaneous certificate generators**: 100+
- **Simultaneous admin access**: 10+
- **Sync operations**: 1 (sequential)
- **Functions**: Auto-scales to demand

### Database Optimization
- Indexes on: email, token, award
- Query patterns optimized
- Batch operations for bulk exports

---

## 🔥 Firebase Quotas (Free Tier)

| Resource | Limit | Notes |
|----------|-------|-------|
| Firestore Reads | 50K/day | Burst to 10K/minute |
| Firestore Writes | 20K/day | Burst to 1K/minute |
| Functions Invocations | 2M/month | ~67K/day |
| Functions Duration | 9M seconds/month | Per function |
| Hosting Bandwidth | 10GB/month | Global CDN |
| Storage | 5GB | For backups, images |

**Recommendation:** Start Free tier, upgrade to Blaze (pay-as-you-go) for large events.

---

## 🎯 Production Checklist

- [ ] All 8 functions deployed
- [ ] Firestore rules deployed
- [ ] Database indexes created
- [ ] Frontend built and hosted
- [ ] Admin CLI tested
- [ ] Google Sheets sync working (if using)
- [ ] Test certificate generation end-to-end
- [ ] Admin dashboard tested
- [ ] Backups configured
- [ ] Monitoring enabled
- [ ] Error logging working
- [ ] Custom domain configured (optional)

---

## 🚀 Development to Production

### Development Environment
```
- localhost:5173 (React dev server)
- firebase emulators (local functions + firestore)
- .env with test Firebase project
```

### Staging Environment
```
- Firebase staging project
- Deploy all code but test first
- Full regression testing
```

### Production Environment
```
- Production Firebase project
- Live domain (custom or .web.app)
- Monitoring and alerting enabled
- Daily backups
- Runbook for incidents
```

---

## 📞 Support & Monitoring

### Monitoring Tools
- **Firebase Console**: Real-time stats, errors, usage
- **Cloud Logging**: Function logs and errors
- **Performance Monitoring**: Built-in Firebase metrics

### Key Metrics
- Functions execution time
- Error rates
- Database throughput
- Hosting traffic

### Alerting (Setup in Firebase)
- Function errors > 1% error rate
- Database quota > 80%
- Hosting errors > threshold

---

## 🔗 Related Documentation

- [README.md](README.md) - Project overview
- [QUICK_DEPLOY.md](QUICK_DEPLOY.md) - Fast deployment
- [ADMIN_CLI_GUIDE.md](ADMIN_CLI_GUIDE.md) - CLI documentation
- [API_REFERENCE.md](API_REFERENCE.md) - API endpoints
- [DEPLOYMENT_CHECKLIST.md](DEPLOYMENT_CHECKLIST.md) - Pre-launch

---

**Built with ❤️ for Global Innovation Build Challenge V1 (2026)**

This comprehensive system provides enterprise-grade certificate management, participant administration, and automated data sync for hackathon events.
