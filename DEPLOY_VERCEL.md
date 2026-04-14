Vercel Deployment Guide

1) Create a Vercel account
   - Visit https://vercel.com and sign up with your GitHub account.

2) Import the repository (recommended)
   - In Vercel dashboard choose "Import Project" → "From Git Repository" and select `Superior-curtis/Chatwebsite`.
   - Vercel will detect Next.js. Use build command `npm run build` and output directory `.` (App Router).

3) Environment variables
   - In Vercel project Settings → Environment Variables add `NEXT_PUBLIC_MODEL_API` and set to the public model proxy URL when available (example: `https://your-trycloudflare.trycloudflare.com/api/chat`).

4) CI Deploy (optional): GitHub Actions
   - This repo contains `.github/workflows/deploy_vercel.yml` that deploys on push to `main`/`master`.
   - To enable it, set the following GitHub repository secrets:
     - `VERCEL_TOKEN` — your Vercel token (create in Vercel account settings)
     - `VERCEL_ORG_ID` — organization id (optional but recommended)
     - `VERCEL_PROJECT_ID` — project id (optional but recommended)
   - After secrets are set, pushing to `main` will trigger the workflow and publish to Vercel.

5) Manual CLI deploy (if you prefer)
   - Install Vercel CLI: `npm i -g vercel`
   - Run in project root:
     ```bash
     npx vercel login
     npx vercel --prod
     ```

Notes:
- The frontend must call a publicly accessible model API. If your model runs on a Mac behind a tunnel, set `NEXT_PUBLIC_MODEL_API` to the trycloudflare URL (or better: deploy a Cloudflare Worker as stable proxy).
- Vercel free tier is fine for demos but has usage limits.
