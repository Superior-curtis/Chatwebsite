@echo off
REM ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
REM 🚀 FULL PLATFORM DEPLOYMENT - PRODUCTION READY (Windows)
REM ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
REM 
REM Global Innovation Build Challenge V1 (2026)
REM Deploys complete hackathon platform with registration system
REM
REM Usage: deploy_full_platform.bat
REM
REM ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

setlocal enabledelayedexpansion

echo.
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo 🚀 FULL PLATFORM DEPLOYMENT
echo    Global Innovation Build Challenge V1 (2026)
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo.

REM ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
REM 1️⃣ PRE-FLIGHT CHECKS
REM ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

echo 1️⃣  Pre-flight Checks
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

REM Check Node.js
where node >nul 2>nul
if errorlevel 1 (
    echo ❌ Node.js not found. Please install Node.js 18+
    exit /b 1
)
for /f "tokens=*" %%i in ('node --version') do set NODE_VERSION=%%i
echo ✅ Node.js installed: %NODE_VERSION%

REM Check npm
where npm >nul 2>nul
if errorlevel 1 (
    echo ❌ npm not found
    exit /b 1
)
for /f "tokens=*" %%i in ('npm --version') do set NPM_VERSION=%%i
echo ✅ npm installed: %NPM_VERSION%

REM Check Firebase CLI
where firebase >nul 2>nul
if errorlevel 1 (
    echo ❌ Firebase CLI not found
    echo    Install it with: npm install -g firebase-tools
    exit /b 1
)
for /f "tokens=*" %%i in ('firebase --version') do set FB_VERSION=%%i
echo ✅ Firebase CLI installed: %FB_VERSION%

echo 📋 Firebase Project: gibc-cet

echo.

REM ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
REM 2️⃣ INSTALL DEPENDENCIES
REM ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

echo 2️⃣  Installing Dependencies
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

REM Functions dependencies
echo 📦 Installing Cloud Functions dependencies...
cd functions
if not exist "node_modules" (
    call npm install
    if errorlevel 1 (
        echo ❌ Failed to install functions dependencies
        exit /b 1
    )
) else (
    echo ✅ Functions dependencies already installed
)
cd ..

REM Frontend dependencies
echo 📦 Installing Frontend dependencies...
cd innovation-showcase-hub-main
if not exist "node_modules" (
    call npm install
    if errorlevel 1 (
        echo ❌ Failed to install frontend dependencies
        exit /b 1
    )
) else (
    echo ✅ Frontend dependencies already installed
)
cd ..

echo ✅ All dependencies installed
echo.

REM ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
REM 3️⃣ BUILD FRONTEND
REM ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

echo 3️⃣  Building Frontend
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

cd innovation-showcase-hub-main
echo 🔨 Building React application...
call npm run build

if errorlevel 1 (
    echo ❌ Build failed
    exit /b 1
)

if not exist "dist" (
    echo ❌ Build failed - dist folder not created
    exit /b 1
)

echo ✅ Frontend built successfully
cd ..
echo.

REM ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
REM 4️⃣ DEPLOY FIRESTORE (Rules & Indexes)
REM ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

echo 4️⃣  Deploying Firestore Rules ^& Indexes
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

call firebase deploy --only firestore:rules,firestore:indexes

if errorlevel 1 (
    echo ❌ Firestore deployment failed
    exit /b 1
)

echo ✅ Firestore rules and indexes deployed
echo.

REM ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
REM 5️⃣ DEPLOY CLOUD FUNCTIONS
REM ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

echo 5️⃣  Deploying Cloud Functions
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo 📤 Deploying all functions (this may take 2-3 minutes)...

call firebase deploy --only functions

if errorlevel 1 (
    echo ❌ Functions deployment failed
    exit /b 1
)

echo ✅ Cloud Functions deployed
echo.

REM ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
REM 6️⃣ DEPLOY HOSTING
REM ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

echo 6️⃣  Deploying Frontend to Firebase Hosting
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

call firebase deploy --only hosting

if errorlevel 1 (
    echo ❌ Hosting deployment failed
    exit /b 1
)

echo ✅ Frontend deployed to hosting
echo.

REM ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
REM 7️⃣ DEPLOYMENT COMPLETE
REM ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

echo.
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo 🎉 DEPLOYMENT SUCCESSFUL!
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo.
echo 📱 YOUR LIVE URLS:
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo.
echo 📝 Registration Page:
echo    https://gibc-cet.web.app/register
echo.
echo 🎫 Certificate Page:
echo    https://gibc-cet.web.app/certificate
echo.
echo 👨‍💼 Admin Dashboard:
echo    https://gibc-cet.web.app/admin
echo    Password: admin2026
echo.
echo 🏠 Home Page:
echo    https://gibc-cet.web.app
echo.
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo ✨ FEATURES DEPLOYED:
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo.
echo ✅ Hybrid Auto-Approval Registration System
echo    - Allows repeated registrations
echo    - Returns existing token if info matches
echo    - Auto-approves valid submissions
echo    - Pending review for mismatched info
echo.
echo ✅ Certificate Generation System
echo    - Token-based verification
echo    - PDF download with confetti
echo    - Professional certificate design
echo.
echo ✅ Admin Dashboard
echo    - Participant management
echo    - Award assignment
echo    - Token regeneration
echo    - CSV/JSON export
echo.
echo ✅ Cloud Functions (9 total)
echo    - submitRegistration (NEW - Allows duplicates)
echo    - verifyToken
echo    - generateCertificate
echo    - assignAward
echo    - regenerateToken
echo    - getParticipants
echo    - createParticipant
echo    - updateParticipant
echo    - deleteParticipant
echo.
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo 📋 NEXT STEPS:
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo.
echo 1. Test Registration System:
echo    Visit https://gibc-cet.web.app/register
echo    Fill in valid data → Should get token instantly
echo.
echo 2. Test Repeated Registration:
echo    Register again with same email
echo    Should return existing token
echo.
echo 3. Test Certificate:
echo    Visit https://gibc-cet.web.app/certificate
echo    Enter your token → Download PDF
echo.
echo 4. Admin Management:
echo    node admin-cli.js list-participants
echo    node admin-cli.js stats
echo.
echo 5. Monitor Functions:
echo    firebase functions:log --follow
echo.
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo 🎊 Platform is LIVE and ready for participants!
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo.

pause
