# Pre-Deployment Checklist

## ✅ Configuration

### Firebase Project
- [ ] Firebase project created (`gibc-showcase` or your project ID)
- [ ] Firestore Database enabled
- [ ] Firebase Hosting enabled
- [ ] Cloud Functions enabled
- [ ] Billing account configured (Blaze plan for production)

### Environment Setup
- [ ] Node.js 18+ installed
- [ ] Firebase CLI installed (`npm install -g firebase-tools`)
- [ ] Logged into Firebase CLI (`firebase login`)
- [ ] Project selected (`firebase use gibc-showcase`)

### Code Configuration
- [ ] Firebase config updated in `src/lib/firebase.ts`:
  - [ ] `apiKey`
  - [ ] `authDomain`
  - [ ] `projectId`
  - [ ] `storageBucket`
  - [ ] `messagingSenderId`
  - [ ] `appId`
  - [ ] `measurementId` (optional)

### Dependencies
- [ ] Frontend dependencies installed (`cd innovation-showcase-hub-main && npm install`)
- [ ] Functions dependencies installed (`cd functions && npm install`)
- [ ] No vulnerability warnings from `npm audit`

---

## ✅ Firebase Configuration Files

- [ ] `firebase.json` configured:
  - [ ] Hosting rewrites for `/api/verify`
  - [ ] Public directory set to `dist`
  - [ ] Single-page app rewrites enabled
  
- [ ] `firestore.rules` deployed:
  - [ ] Read access: public
  - [ ] Write access: admin-only
  - [ ] Validated rules syntax

- [ ] `firestore.indexes.json` deployed:
  - [ ] Index for `email + createdAt`
  - [ ] Index for `token`
  - [ ] Index for `award + createdAt`

- [ ] `.firebaserc` configured with correct project ID

---

## ✅ Cloud Functions

### Function Code
- [ ] All 8 functions implemented in `functions/index.js`:
  - [ ] `verifyToken` (HTTP)
  - [ ] `generateCertificate` (Callable)
  - [ ] `assignAward` (Callable)
  - [ ] `regenerateToken` (Callable)
  - [ ] `getParticipants` (Callable)
  - [ ] `createParticipant` (Callable)
  - [ ] `updateParticipant` (Callable)
  - [ ] `deleteParticipant` (Callable)

### Function Configuration
- [ ] Node.js runtime: 18
- [ ] CORS configured for production domain
- [ ] Error handling implemented
- [ ] Input validation added
- [ ] Admin authentication configured

---

## ✅ Frontend

### Pages & Components
- [ ] Certificate page (`/certificate`) functional
- [ ] Admin dashboard (`/admin`) functional
- [ ] Navbar links updated
- [ ] Routes configured in `App.tsx`

### Features
- [ ] Token verification working
- [ ] Certificate generation tested
- [ ] PDF download functional
- [ ] Confetti animation working
- [ ] Thank-you modal displays
- [ ] Admin CRUD operations work
- [ ] CSV/JSON export functional

### UI/UX
- [ ] Mobile responsive design
- [ ] Loading states implemented
- [ ] Error messages display
- [ ] Toast notifications work
- [ ] Form validation present

---

## ✅ Database

### Firestore Setup
- [ ] Participants collection created (or will auto-create)
- [ ] Indexes deployed via `firebase deploy --only firestore:indexes`
- [ ] Security rules deployed via `firebase deploy --only firestore:rules`

### Sample Data
- [ ] At least one test participant created:
  - [ ] devpostUsername: `test_user`
  - [ ] token: `TEST123ABC`
  - [ ] All required fields populated

---

## ✅ Testing

### Manual Testing
- [ ] Token verification with valid token
- [ ] Token verification with invalid token
- [ ] Certificate generation with token only
- [ ] Certificate generation with token + custom name
- [ ] PDF download successful
- [ ] Confetti animation plays
- [ ] Thank-you modal appears after download

### Admin Dashboard Testing
- [ ] Admin login with password `admin2026`
- [ ] View participants list
- [ ] Create new participant
- [ ] Edit participant details
- [ ] Assign awards
- [ ] Regenerate token
- [ ] Delete participant
- [ ] Export CSV
- [ ] Export JSON
- [ ] Search participants
- [ ] Stats display correctly

### API Testing
- [ ] HTTP endpoint `/api/verify` accessible
- [ ] Callable functions work from frontend
- [ ] Error responses formatted correctly
- [ ] CORS working (no browser errors)

---

## ✅ Google Sheets Integration (Optional)

- [ ] Google Form created
- [ ] Google Sheet linked to form
- [ ] Google Cloud project created
- [ ] Sheets API enabled
- [ ] Service account created
- [ ] Service account key downloaded
- [ ] Sheet shared with service account
- [ ] `.env` file configured:
  - [ ] `GOOGLE_SHEETS_ID`
  - [ ] `GOOGLE_SERVICE_ACCOUNT_EMAIL`
  - [ ] `GOOGLE_PRIVATE_KEY`
  - [ ] `FIREBASE_PROJECT_ID`
- [ ] Sync script tested (`node syncFromSheets.js`)

---

## ✅ Security

- [ ] `.env` file in `.gitignore`
- [ ] Service account keys not committed
- [ ] Firestore rules prevent unauthorized writes
- [ ] Admin functions check authentication
- [ ] CORS restricted to production domain
- [ ] Firebase config keys are client-safe (not secret)

---

## ✅ Documentation

- [ ] README.md updated
- [ ] DEPLOYMENT_GUIDE.md reviewed
- [ ] API_REFERENCE.md available
- [ ] SHEETS_SYNC_SETUP.md available (if using)
- [ ] Code comments added for complex logic

---

## ✅ Performance

- [ ] Firestore indexes created
- [ ] Frontend build optimized (`npm run build`)
- [ ] No console errors in production build
- [ ] Image assets optimized
- [ ] Lazy loading configured (if needed)

---

## ✅ Deployment

### Build
- [ ] Frontend builds without errors:
  ```bash
  cd innovation-showcase-hub-main
  npm run build
  ```
- [ ] No TypeScript errors
- [ ] No ESLint warnings (critical)

### Deploy Functions
- [ ] Functions deploy successfully:
  ```bash
  firebase deploy --only functions
  ```
- [ ] Function logs show no errors:
  ```bash
  firebase functions:log
  ```

### Deploy Firestore
- [ ] Rules deploy successfully:
  ```bash
  firebase deploy --only firestore:rules
  ```
- [ ] Indexes deploy successfully:
  ```bash
  firebase deploy --only firestore:indexes
  ```

### Deploy Hosting
- [ ] Hosting deploys successfully:
  ```bash
  firebase deploy --only hosting
  ```
- [ ] Site accessible at Firebase URL
- [ ] All routes work (/, /certificate, /admin, /gallery)

### Full Deployment
- [ ] Complete deployment successful:
  ```bash
  firebase deploy
  ```

---

## ✅ Post-Deployment

### Verification
- [ ] Visit production certificate page
- [ ] Test token verification end-to-end
- [ ] Generate and download PDF certificate
- [ ] Access admin dashboard
- [ ] Check Firebase Console:
  - [ ] Functions listed and active
  - [ ] Hosting shows latest deployment
  - [ ] Firestore has test data
  - [ ] No errors in logs

### Monitoring
- [ ] Firebase Console > Functions > Logs (no errors)
- [ ] Firebase Console > Firestore > Usage (within quotas)
- [ ] Firebase Console > Hosting > Usage (accessible)
- [ ] Browser console (no JavaScript errors)

---

## ✅ Production Readiness

### Admin Access
- [ ] Admin password documented securely
- [ ] Admin users identified
- [ ] Admin training completed

### Participant Communication
- [ ] Certificate URL shared: `https://your-project.web.app/certificate`
- [ ] Token distribution method decided
- [ ] Support documentation prepared

### Support Plan
- [ ] Contact method for participant issues
- [ ] Monitoring schedule established
- [ ] Backup/export strategy defined
- [ ] Escalation process documented

---

## ✅ Custom Domain (Optional)

- [ ] Domain purchased
- [ ] Domain added in Firebase Console
- [ ] DNS records configured
- [ ] SSL certificate issued
- [ ] Domain accessible
- [ ] Redirects working

---

## ✅ Analytics (Optional)

- [ ] Google Analytics configured
- [ ] Custom events tracked:
  - [ ] Certificate generation
  - [ ] PDF downloads
  - [ ] Token verifications
  - [ ] Admin logins

---

## 🚨 Critical Issues

If any of these fail, **DO NOT DEPLOY**:
- [ ] Functions failing to deploy
- [ ] Firestore rules rejecting valid operations
- [ ] Certificate PDF not generating
- [ ] Admin dashboard not loading participants
- [ ] Token verification always failing
- [ ] Build errors in production build

---

## 📝 Deployment Command Sequence

Once all checks pass, deploy in this order:

```bash
# 1. Build frontend
cd innovation-showcase-hub-main
npm run build

# 2. Deploy Firestore (rules + indexes)
cd ..
firebase deploy --only firestore

# 3. Deploy Functions
firebase deploy --only functions

# 4. Deploy Hosting
firebase deploy --only hosting

# 5. Verify
# Visit: https://your-project.web.app
```

---

## ✅ Final Checklist

- [ ] All sections above completed
- [ ] No critical issues
- [ ] Production URLs documented
- [ ] Team notified of deployment
- [ ] Monitoring enabled
- [ ] Backup plan ready

---

**When all boxes are checked, you're ready to go live! 🚀**

**Deployment Date:** _______________

**Deployed By:** _______________

**Project URL:** https://_______________________.web.app
