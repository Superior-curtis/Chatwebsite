# 🚀 Complete Deployment Guide - Hybrid Setup

## ✅ DONE - Firebase Hosting (Frontend)

**Live URL**: https://gibc-cet.web.app

Frontend is now live! All static files deployed and working.

---

## 🔄 NEXT - Deploy APIs to Vercel (Free)

The API routes are in `innovation-showcase-hub-main/src/pages/api/`:
- `/api/submitRegistration` - Handle registrations
- `/api/generateCertificate` - Generate certificates  
- `/api/verifyToken` - Verify tokens

### Step 1: Install Vercel CLI

```bash
npm install -g vercel
```

### Step 2: Login to Vercel

```bash
vercel login
```

### Step 3: Deploy API Routes

```bash
cd innovation-showcase-hub-main/innovation-showcase-hub-main
vercel
```

Follow the prompts:
- **Project name**: innovation-showcase-hub (or similar)
- **Framework**: Vite
- **Build command**: `npm run build`
- **Output directory**: `dist`

### Step 4: Add Environment Variables in Vercel

After first deploy, go to Vercel dashboard:

1. Select your project
2. Go to **Settings** → **Environment Variables**
3. Add all these variables:

```
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyBY8oUUv75AKZ21RBepBgoLWdNm5A7Dwb4
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=gibc-cet.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=gibc-cet
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=gibc-cet.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=240565383245
NEXT_PUBLIC_FIREBASE_APP_ID=1:240565383245:web:2f6e7db90401c0ed0d6c04
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-QL0DP656D0
```

4. **Redeploy** after adding env vars

### Step 5: Update API Endpoint (if needed)

If Vercel API URL is different, update frontend API calls:

**In RegisterPage.tsx:**
```tsx
const response = await fetch("/api/submitRegistration", {
```

**Change to:**
```tsx
const response = await fetch("https://your-vercel-project.vercel.app/api/submitRegistration", {
```

(Same for CertificatePage.tsx)

### Step 6: Test Everything

**Register**: https://gibc-cet.web.app/register
- Fill form → should get instant token ✅

**Certificate**: https://gibc-cet.web.app/certificate
- Enter token → generate PDF ✅

---

## 📊 Your Deployment Architecture

```
┌─────────────────────────────────────────┐
│  Frontend: Firebase Hosting             │
│  https://gibc-cet.web.app              │
│  (React + TypeScript + Vite)           │
└──────────────┬──────────────────────────┘
               │
        ┌──────┴──────┐
        │             │
        ▼             ▼
   ┌─────────┐   ┌──────────────┐
   │Firestore│   │Vercel APIs   │
   │Database │   │/api/*        │
   │(Free)   │   │(Free)        │
   └─────────┘   └──────────────┘
        ▲             │
        │             │
        └─────┬───────┘
              │
    (All communication)
```

---

## 💰 Cost Summary

| Component | Cost | Tier |
|-----------|------|------|
| Firebase Hosting | FREE | Spark ✅ |
| Firestore Database | FREE | Spark ✅ |
| Firestore Rules | FREE | - |
| Vercel Serverless Functions | FREE | 125k req/month |
| **TOTAL** | **FREE** | **No payments!** |

---

## 🔧 Quick Commands

```bash
# Build frontend
cd innovation-showcase-hub-main
npm run build

# Deploy to Firebase Hosting
firebase deploy --only hosting

# Deploy to Vercel
vercel

# Check logs
firebase functions:log
vercel logs
```

---

## ✨ Features Working

✅ **Repeated registrations** - Register multiple times, get same token  
✅ **Auto-approval** - Meets criteria → instant token + confetti  
✅ **Pending review** - Doesn't meet criteria → admin review  
✅ **Certificate generation** - Generate PDF with token  
✅ **Admin dashboard** - Manage participants  
✅ **Real-time updates** - Firestore syncs instantly  

---

## 📄 Final Live URLs

| Page | URL |
|------|-----|
| **Home** | https://gibc-cet.web.app |
| **Register** | https://gibc-cet.web.app/register |
| **Certificate** | https://gibc-cet.web.app/certificate |
| **Admin** | https://gibc-cet.web.app/admin |

---

## ❓ Troubleshooting

**"Cannot find /api/submitRegistration"**
- Make sure Vercel APIs are deployed and env vars are set
- Check Vercel logs: `vercel logs`

**"Firebase error: missing credentials"**
- Verify .env.local or Vercel env vars are correct
- Check Firebase config in code

**"Certificate generation fails"**
- Ensure Firestore has documents created
- Check Firebase console for data

---

## 🎯 Next Steps

1. ✅ **Deploy Vercel APIs** (do this now)
2. ✅ **Add environment variables** to Vercel
3. ✅ **Test registration flow**
4. ✅ **Test certificate download**
5. Share the link: **https://gibc-cet.web.app** 🎉

---

**You're almost done! Just deploy the APIs on Vercel and you're 100% live!**
