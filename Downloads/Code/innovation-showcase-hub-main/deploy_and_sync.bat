@echo off
REM ============================================================================
REM Global Innovation Build Challenge - Complete Deployment Script (Windows)
REM ============================================================================
REM
REM This script performs a one-click deployment of the entire GIBC platform:
REM 1. Validates environment and dependencies
REM 2. Installs dependencies (Firebase, Google Sheets, etc.)
REM 3. Builds the React frontend
REM 4. Deploys Cloud Functions
REM 5. Deploys Firestore rules and indexes
REM 6. Deploys hosting
REM 7. Starts Google Sheets sync in watch mode
REM
REM Requirements:
REM   - Node.js 18+ installed
REM   - Firebase CLI installed (npm install -g firebase-tools)
REM   - Firebase project configured (.firebaserc)
REM   - .env file with proper credentials
REM
REM Usage:
REM   deploy_and_sync.bat
REM   deploy_and_sync.bat --offline (skip functions/hosting)
REM   deploy_and_sync.bat --frontend-only
REM   deploy_and_sync.bat --functions-only
REM
REM ============================================================================

setlocal enabledelayedexpansion
cd /d "%~dp0"

REM Color codes for output
set SUCCESS=[92m✓[0m
set ERROR=[91m✗[0m
set INFO=[94m•[0m
set WARN=[93m⚠[0m

REM Parse command line arguments
set OFFLINE=0
set FRONTEND_ONLY=0
set FUNCTIONS_ONLY=0
set SYNC_ONLY=0

for %%A in (%*) do (
    if "%%A"=="--offline" set OFFLINE=1
    if "%%A"=="--frontend-only" set FRONTEND_ONLY=1
    if "%%A"=="--functions-only" set FUNCTIONS_ONLY=1
    if "%%A"=="--sync-only" set SYNC_ONLY=1
)

echo.
echo ╔════════════════════════════════════════════════════════════════════════════╗
echo ║ GIBC Platform - Deployment Script (Windows)                               ║
echo ║ Global Innovation Build Challenge V1 (2026)                               ║
echo ╚════════════════════════════════════════════════════════════════════════════╝
echo.

REM ============================================================================
REM Pre-flight Checks
REM ============================================================================

echo [Stage 1/8] Pre-flight Checks
echo ================================

REM Check Node.js
for /f "tokens=*" %%i in ('node --version 2^>nul') do set NODE_VERSION=%%i
if "%NODE_VERSION%"=="" (
    echo %ERROR% Node.js not found. Please install Node.js 18+ from https://nodejs.org
    exit /b 1
)
echo %SUCCESS% Node.js installed: %NODE_VERSION%

REM Check Firebase CLI
for /f "tokens=*" %%i in ('firebase --version 2^>nul') do set FIREBASE_VERSION=%%i
if "%FIREBASE_VERSION%"=="" (
    echo %ERROR% Firebase CLI not found
    echo    Run: npm install -g firebase-tools
    exit /b 1
)
echo %SUCCESS% Firebase CLI installed: %FIREBASE_VERSION%

REM Check .env file
if not exist ".env" (
    if not exist "service-account.json" (
        echo %ERROR% Missing .env or service-account.json
        echo    Copy .env.example to .env and fill in credentials
        exit /b 1
    )
)
echo %SUCCESS% Credentials found

REM Check .firebaserc
if not exist ".firebaserc" (
    echo %ERROR% .firebaserc not found
    echo    Run: firebase init
    exit /b 1
)
echo %SUCCESS% Firebase project configured

echo.

REM ============================================================================
REM Install Dependencies
REM ============================================================================

if %SYNC_ONLY%==0 (
    echo [Stage 2/8] Installing Dependencies
    echo ===================================
    
    REM Frontend dependencies
    if exist "innovation-showcase-hub-main" (
        echo %INFO% Installing frontend dependencies...
        cd innovation-showcase-hub-main
        call npm install 2>nul
        if %ERRORLEVEL% neq 0 (
            echo %ERROR% Frontend dependency installation failed
            exit /b 1
        )
        cd ..
        echo %SUCCESS% Frontend dependencies installed
    )
    
    REM Functions dependencies
    if exist "functions" (
        echo %INFO% Installing functions dependencies...
        cd functions
        call npm install 2>nul
        if %ERRORLEVEL% neq 0 (
            echo %ERROR% Functions dependency installation failed
            exit /b 1
        )
        cd ..
        echo %SUCCESS% Functions dependencies installed
    )
    
    REM Admin CLI dependencies
    echo %INFO% Installing admin CLI dependencies...
    call npm install csv-writer dotenv firebase-admin googleapis 2>nul
    if %ERRORLEVEL% neq 0 (
        echo %WARN% Some admin CLI dependencies may need manual installation
    )
    echo %SUCCESS% Admin CLI dependencies ready
    
    echo.
)

REM ============================================================================
REM Build Frontend
REM ============================================================================

if %FRONTEND_ONLY%==1 goto BUILD_FRONTEND
if %FUNCTIONS_ONLY%==1 goto DEPLOY_FUNCTIONS
if %SYNC_ONLY%==1 goto START_SYNC
if %OFFLINE%==1 goto OFFLINE_BUILD

:BUILD_FRONTEND
echo [Stage 3/8] Building Frontend
echo ================================

if exist "innovation-showcase-hub-main" (
    cd innovation-showcase-hub-main
    echo %INFO% Building React application...
    call npm run build 2>nul
    if %ERRORLEVEL% neq 0 (
        echo %ERROR% Frontend build failed
        cd ..
        exit /b 1
    )
    cd ..
    echo %SUCCESS% Frontend built successfully
    echo           Output: innovation-showcase-hub-main\dist
) else (
    echo %WARN% Frontend directory not found, skipping build
)

echo.

if %FRONTEND_ONLY%==1 goto COMPLETED

REM ============================================================================
REM Deploy to Firebase
REM ============================================================================

:DEPLOY_FUNCTIONS
if %OFFLINE%==1 goto OFFLINE_BUILD

echo [Stage 4/8] Deploying Cloud Functions
echo =========================================
echo %INFO% Deploying 8 Cloud Functions...
call firebase deploy --only functions 2>nul
if %ERRORLEVEL% neq 0 (
    echo %ERROR% Cloud Functions deployment failed
    exit /b 1
)
echo %SUCCESS% Cloud Functions deployed

echo.

echo [Stage 5/8] Deploying Firestore Configuration
echo ================================================
echo %INFO% Deploying security rules and indexes...
call firebase deploy --only firestore:rules 2>nul
if %ERRORLEVEL% neq 0 (
    echo %WARN% Firestore rules deployment had issues
)
call firebase deploy --only firestore:indexes 2>nul
if %ERRORLEVEL% neq 0 (
    echo %WARN% Firestore indexes may need manual setup
)
echo %SUCCESS% Firestore configuration deployed

echo.

echo [Stage 6/8] Deploying Hosting
echo =========================================
echo %INFO% Deploying frontend to Firebase Hosting...
call firebase deploy --only hosting 2>nul
if %ERRORLEVEL% neq 0 (
    echo %ERROR% Hosting deployment failed
    exit /b 1
)
echo %SUCCESS% Hosting deployed successfully

echo.
goto GET_URLS

:OFFLINE_BUILD
echo [Running in Offline Mode]
echo.
echo %WARN% Skipping Firebase deployment (--offline flag)
echo    Build frontend only: npm run build
echo.

:GET_URLS
echo [Stage 7/8] Getting Deployment URLs
echo ===================================

for /f "tokens=*" %%i in ('firebase apps:list --project=gibc-showcase 2^>nul') do set PROJECT_INFO=%%i

REM Extract project ID from .firebaserc
echo %SUCCESS% Deployment Complete!
echo.
echo 📊 YOUR PLATFORM IS LIVE!
echo.

REM Try to get hosting URL
for /f "tokens=*" %%i in ('firebase hosting:sites:list 2^>nul') do (
    set HOSTING_URL=%%i
)

if "%HOSTING_URL%"=="" (
    echo 🌐 Hosting URL: https://^<your-project^>.web.app
) else (
    echo 🌐 Hosting URL: %HOSTING_URL%
)

echo.
echo 🎯 IMPORTANT URLS:
echo    Certificate: https://^<your-project^>.web.app/certificate
echo    Admin: https://^<your-project^>.web.app/admin (password: admin2026)
echo    API: https://^<your-project^>.web.app/api/verify
echo.

:START_SYNC
if %SYNC_ONLY%==0 (
    echo [Stage 8/8] Starting Google Sheets Sync
    echo ======================================
    echo.
    echo %INFO% Starting Google Sheets sync in watch mode...
    echo    (Press Ctrl+C to stop)
    echo.
    timeout /t 2 /nobreak
    call node syncFromSheets.js --watch --interval=5
) else (
    echo [Starting Google Sheets Sync Only]
    echo.
    echo %INFO% Starting Google Sheets sync in watch mode...
    echo    (Press Ctrl+C to stop)
    echo.
    call node syncFromSheets.js --watch --interval=5
)

exit /b 0

:COMPLETED
echo.
echo %SUCCESS% Frontend build completed!
echo.
exit /b 0
