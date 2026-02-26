# Deploy to Vercel (FREE) 🚀

## What Changed

You now have **Vercel API Routes** instead of Firebase Cloud Functions:

✅ `/api/submitRegistration` - Handles participant registration  
✅ `/api/generateCertificate` - Generates certificates  
✅ `/api/verifyToken` - Verifies participant tokens  

**No Blaze plan needed!**

---

## Step 1: Create `.env.local` file

In `innovation-showcase-hub-main/innovation-showcase-hub-main/`, create `.env.local`:

```
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyBY8oUUv75AKZ21RBepBgoLWdNm5A7Dwb4
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=gibc-cet.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=gibc-cet
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=gibc-cet.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=240565383245
NEXT_PUBLIC_FIREBASE_APP_ID=1:240565383245:web:2f6e7db90401c0ed0d6c04
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-QL0DP656D0
```

---

## Step 2: Install Vercel CLI

```bash
npm install -g vercel
```

Or use Vercel's Git integration (easiest):

1. Push your code to GitHub
2. Go to https://vercel.com
3. Click "New Project"
4. Select your GitHub repository
5. Deploy!

---

## Step 3: Deploy Frontend + API Routes

**Option A: Using Git (RECOMMENDED)**

```bash
# Push to GitHub
git add .
git commit -m "Convert to Vercel APIs"
git push origin main
```

Then on Vercel.com, connect your GitHub repo.

**Option B: Using Vercel CLI**

```bash
cd innovation-showcase-hub-main/innovation-showcase-hub-main
vercel
```

Follow the prompts to deploy.

---

## Step 4: Set Environment Variables in Vercel

1. Go to your Vercel project settings
2. Go to "Environment Variables"
3. Add all the Firebase config variables from `.env.local`
4. Redeploy

---

## Step 5: Test Your Deployment

After deployment, your site will be at: `your-project.vercel.app`

**Test Registration:**
1. Visit `https://your-project.vercel.app/register`
2. Fill in test data
3. Should get instant approval ✅

**Test Certificate:**
1. Visit `https://your-project.vercel.app/certificate`
2. Enter your token
3. Generate and download PDF 📄

---

## Free Tier Limits

✅ **125,000 requests/month**  
✅ **Unlimited deployments**  
✅ **Free SSL/HTTPS**  
✅ **Automatic scaling**  

For your hackathon, this is **more than enough!**

---

## Troubleshooting

**"Cannot find module 'next'"**
- Your project is Vite, not Next.js
- You need to use the SPA build with API routes
- Use Vercel's build config below

---

## Updated Deploy Script

Create a file `DEPLOY_TO_VERCEL.md`:

```bash
# 1. Build the frontend
cd innovation-showcase-hub-main
npm run build

# 2. Push to GitHub
git add .
git commit -m "Ready for Vercel deployment"
git push origin main

# 3. Go to https://vercel.com
# - Click "New Project"
# - Select your GitHub repo
# - Add environment variables
# - Deploy!

# Live at: https://your-project.vercel.app
```

---

## Next Steps

1. **Create `.env.local`** with Firebase credentials
2. **Push to GitHub** (or use Vercel CLI)
3. **Deploy on Vercel.com** (takes 2-3 minutes)
4. **Test all features**
5. **Share the live URL!**

---

**No credit card needed, no paid plans, free forever for hackathon! 🎉**
