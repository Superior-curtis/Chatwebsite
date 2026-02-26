# Global Innovation Build Challenge - Deployment Guide

## 🚀 Complete Setup & Deployment

This guide covers the complete deployment process for the Global Innovation Build Challenge V1 token-based certificate system.

## 📋 Prerequisites

- Node.js 18+ installed
- Firebase CLI installed (`npm install -g firebase-tools`)
- Google Cloud Platform account
- Firebase project created

## 🔧 Initial Setup

### 1. Firebase Project Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or use existing: `gibc-showcase`
3. Enable authentication (optional, for admin features)
4. Enable Firestore Database
5. Enable Firebase Hosting

### 2. Install Dependencies

Navigate to the frontend directory:
```bash
cd innovation-showcase-hub-main
npm install
```

Navigate to the functions directory:
```bash
cd functions
npm install
```

### 3. Configure Firebase

Login to Firebase:
```bash
firebase login
```

Initialize Firebase (if not already done):
```bash
firebase init
```

Select:
- ✅ Hosting
- ✅ Firestore
- ✅ Functions

Configuration:
- **Firestore rules**: `firestore.rules`
- **Firestore indexes**: `firestore.indexes.json`
- **Functions**: JavaScript, use existing
- **Public directory**: `dist`
- **Single-page app**: Yes
- **GitHub deployment**: No (for now)

### 4. Get Firebase Configuration

1. Go to Firebase Console > Project Settings
2. Scroll to "Your apps" section
3. Click "Web" app (or create one)
4. Copy the configuration object

Update `src/lib/firebase.ts`:
```typescript
const firebaseConfig = {
  apiKey: "YOUR_ACTUAL_API_KEY",
  authDomain: "gibc-showcase.firebaseapp.com",
  projectId: "gibc-showcase",
  storageBucket: "gibc-showcase.firebasestorage.app",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID",
  measurementId: "YOUR_MEASUREMENT_ID"
};
```

### 5. Set Up Environment Variables

For Google Sheets sync (optional):
```bash
cp .env.example .env
```

Edit `.env` with your credentials (see `SHEETS_SYNC_SETUP.md`).

## 🏗️ Build & Deploy

### Option A: Deploy Everything

Deploy functions, Firestore rules, and hosting:
```bash
npm run build
firebase deploy
```

### Option B: Deploy Separately

**Deploy Functions Only:**
```bash
firebase deploy --only functions
```

**Deploy Firestore Rules:**
```bash
firebase deploy --only firestore:rules
```

**Deploy Hosting:**
```bash
npm run build
firebase deploy --only hosting
```

## 📊 Initialize Sample Data (Optional)

Create a test participant via Firebase Console or Admin Dashboard:

1. Open Firestore in Firebase Console
2. Create collection: `participants`
3. Add document with auto-ID:
```json
{
  "devpostUsername": "test_user",
  "email": "test@example.com",
  "projectName": "Test Project",
  "projectUrl": "https://devpost.com/software/test",
  "award": "Participant",
  "token": "TEST123ABC",
  "tokenUsed": false,
  "createdAt": "2026-01-01T00:00:00Z",
  "updatedAt": "2026-01-01T00:00:00Z"
}
```

## 🔑 Cloud Functions Endpoints

After deployment, your functions will be available at:

### Production URLs
```
https://us-central1-gibc-showcase.cloudfunctions.net/verifyToken
https://us-central1-gibc-showcase.cloudfunctions.net/generateCertificate
https://us-central1-gibc-showcase.cloudfunctions.net/assignAward
https://us-central1-gibc-showcase.cloudfunctions.net/regenerateToken
https://us-central1-gibc-showcase.cloudfunctions.net/getParticipants
https://us-central1-gibc-showcase.cloudfunctions.net/createParticipant
https://us-central1-gibc-showcase.cloudfunctions.net/updateParticipant
https://us-central1-gibc-showcase.cloudfunctions.net/deleteParticipant
```

### Public HTTP Endpoint
Certificate verification (used by frontend):
```
https://your-project.web.app/api/verify
```

## 🎯 Testing

### 1. Test Certificate Generation

1. Go to `https://your-project.web.app/certificate`
2. Enter token: `TEST123ABC`
3. Enter name (optional)
4. Click "Generate Certificate"
5. Download PDF should work with confetti animation

### 2. Test Admin Dashboard

1. Go to `https://your-project.web.app/admin`
2. Enter password: `admin2026`
3. View participants list
4. Test CRUD operations:
   - Create new participant
   - Assign awards
   - Regenerate tokens
   - Export CSV/JSON
   - Delete participant

### 3. Test API Endpoints

Using curl or Postman:

**Verify Token:**
```bash
curl -X POST https://your-project.web.app/api/verify \
  -H "Content-Type: application/json" \
  -d '{
    "token": "TEST123ABC",
    "participantName": "John Doe"
  }'
```

**Get Participants (Admin):**
```bash
curl -X POST https://us-central1-gibc-showcase.cloudfunctions.net/getParticipants \
  -H "Content-Type: application/json" \
  -d '{
    "data": {
      "adminSecret": "your_admin_secret",
      "format": "json"
    }
  }'
```

## 🔒 Security Configuration

### Admin Secret Setup

The functions use a simple admin check. For production:

1. Go to Firebase Console > Cloud Functions
2. For each admin function, set environment variable:
```bash
firebase functions:config:set admin.secret="YOUR_SECURE_SECRET_HERE"
```

3. Redeploy functions:
```bash
firebase deploy --only functions
```

4. Update admin dashboard to send secret in requests

### Firestore Security Rules

Rules are already configured in `firestore.rules`:
- **Read**: Public (anyone can verify tokens)
- **Write**: Admin only (requires authentication)

For production, consider:
- Adding rate limiting
- Implementing proper admin authentication
- Using Firebase Authentication with custom claims

## 🔄 Google Sheets Automation

Enable automatic participant sync from Google Forms:

1. Follow setup in `SHEETS_SYNC_SETUP.md`
2. Run initial sync:
```bash
node syncFromSheets.js
```

3. Run in watch mode (production):
```bash
npm run watch
```

Or use a cronjob/Cloud Scheduler:
```bash
# Every hour
0 * * * * cd /path/to/project && node syncFromSheets.js
```

## 📱 Custom Domain (Optional)

1. Go to Firebase Console > Hosting
2. Click "Add custom domain"
3. Follow DNS verification steps
4. Update Firebase config with new domain

## 🎨 Customization

### Update Event Details

Edit `functions/index.js`:
```javascript
const EVENT_CONFIG = {
  name: "Global Innovation Build Challenge V1 (2026)",
  date: "March 15, 2026",
  organizer: "GIBC Team",
  version: "V1"
};
```

### Customize Certificate Design

Edit `src/pages/CertificatePage.tsx` to modify:
- Layout and styling
- Colors and gradients
- Fonts and sizes
- Award badges

### Add Award Categories

Update `functions/index.js` and `AdminPage.tsx`:
```javascript
const VALID_AWARDS = [
  "Participant",
  "Finalist", 
  "Winner",
  "Grand Prize",
  "Best Innovation",  // Add custom awards
  "People's Choice"
];
```

## 📊 Monitoring

### View Logs

```bash
firebase functions:log
```

### Analytics

Firebase Console > Analytics shows:
- Certificate page views
- Token verification attempts
- Download statistics

### Error Tracking

Check Cloud Functions logs:
```bash
gcloud logging read "resource.type=cloud_function" --limit 50
```

## 🚨 Troubleshooting

### Functions Not Deploying
```bash
# Check Firebase CLI version
firebase --version

# Reinstall dependencies
cd functions
rm -rf node_modules package-lock.json
npm install

# Deploy with verbose logging
firebase deploy --only functions --debug
```

### CORS Errors
- Verify functions include CORS middleware
- Check browser console for specific errors
- Ensure public URL matches in `firebase.json` rewrites

### Token Verification Fails
- Check Firestore indexes are created
- Verify token exists in database
- Check security rules allow read access

### Certificate PDF Not Generating
- Check browser console for errors
- Verify html2canvas and jsPDF versions
- Test with simpler certificate template

### Admin Dashboard Not Loading Participants
- Check Firebase config is correct
- Verify Firestore rules allow read
- Check browser network tab for failed requests

## 📈 Performance Optimization

### 1. Enable Caching
Update `firebase.json`:
```json
{
  "hosting": {
    "headers": [{
      "source": "**/*.@(jpg|jpeg|gif|png|svg|webp)",
      "headers": [{
        "key": "Cache-Control",
        "value": "max-age=7200"
      }]
    }]
  }
}
```

### 2. Optimize Functions
- Use Firestore indexes (already configured)
- Cache frequently accessed data
- Implement request throttling

### 3. CDN for Assets
- Upload certificate backgrounds to Firebase Storage
- Use CDN URLs in certificate template

## 🔄 Maintenance

### Regular Tasks

**Weekly:**
- Check Cloud Functions logs for errors
- Review Firestore usage (quotas)
- Backup participant data

**Monthly:**
- Update dependencies
- Review security rules
- Analyze usage patterns

### Backup Strategy

Export Firestore data:
```bash
gcloud firestore export gs://gibc-showcase-backup/$(date +%Y%m%d)
```

Or use the Admin Dashboard export feature.

## 📚 Documentation

- **API Documentation**: See function comments in `functions/index.js`
- **Frontend Components**: Check `src/pages/` for React components
- **Google Sheets Sync**: See `SHEETS_SYNC_SETUP.md`

## 🎓 Post-Deployment

1. **Test all features** using the checklist above
2. **Share certificate URL** with participants
3. **Monitor** first few certificate generations
4. **Set up Google Sheets sync** if using Google Forms
5. **Train admins** on dashboard usage
6. **Prepare support** documentation for participants

## 🚀 Go Live Checklist

- [ ] Firebase project created and configured
- [ ] All dependencies installed
- [ ] Firebase config updated with real credentials
- [ ] Functions deployed successfully
- [ ] Firestore rules and indexes deployed
- [ ] Hosting deployed with custom domain (if applicable)
- [ ] Test participant created in Firestore
- [ ] Certificate generation tested end-to-end
- [ ] Admin dashboard access confirmed
- [ ] Google Sheets sync configured (if using)
- [ ] Monitoring and logging set up
- [ ] Backup strategy in place
- [ ] Support documentation prepared

## 🎉 Success!

Your Global Innovation Build Challenge platform is now live! 

Access URLs:
- **Public Certificate Page**: `https://your-project.web.app/certificate`
- **Admin Dashboard**: `https://your-project.web.app/admin`
- **Firebase Console**: `https://console.firebase.google.com/`

---

**Built with ❤️ for Global Innovation Build Challenge V1 (2026)**
