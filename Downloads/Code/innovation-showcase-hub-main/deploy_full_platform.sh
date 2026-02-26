#!/bin/bash
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# 🚀 FULL PLATFORM DEPLOYMENT - PRODUCTION READY
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# 
# Global Innovation Build Challenge V1 (2026)
# Deploys complete hackathon platform with registration system
#
# Features:
# - Hybrid Auto-Approval Registration System
# - Certificate Generation Page
# - Admin Dashboard
# - All Cloud Functions
# - Firestore Rules & Indexes
#
# Usage:
#   chmod +x deploy_full_platform.sh
#   ./deploy_full_platform.sh
#
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

set -e  # Exit on error

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🚀 FULL PLATFORM DEPLOYMENT"
echo "   Global Innovation Build Challenge V1 (2026)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# 1️⃣ PRE-FLIGHT CHECKS
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

echo -e "${BLUE}1️⃣  Pre-flight Checks${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Check Node.js
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js not found. Please install Node.js 18+${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Node.js installed:${NC} $(node --version)"

# Check npm
if ! command -v npm &> /dev/null; then
    echo -e "${RED}❌ npm not found${NC}"
    exit 1
fi
echo -e "${GREEN}✅ npm installed:${NC} $(npm --version)"

# Check Firebase CLI
if ! command -v firebase &> /dev/null; then
    echo -e "${RED}❌ Firebase CLI not found${NC}"
    echo "   Install it with: npm install -g firebase-tools"
    exit 1
fi
echo -e "${GREEN}✅ Firebase CLI installed:${NC} $(firebase --version)"

# Check Firebase login
if ! firebase projects:list &> /dev/null; then
    echo -e "${YELLOW}⚠️  Not logged into Firebase${NC}"
    echo "   Running firebase login..."
    firebase login
fi
echo -e "${GREEN}✅ Firebase authenticated${NC}"

# Verify project
echo -e "${BLUE}📋 Firebase Project:${NC} gibc-cet"

echo ""

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# 2️⃣ INSTALL DEPENDENCIES
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

echo -e "${BLUE}2️⃣  Installing Dependencies${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Functions dependencies
echo -e "${YELLOW}📦 Installing Cloud Functions dependencies...${NC}"
cd functions
if [ ! -d "node_modules" ]; then
    npm install
else
    echo "✅ Functions dependencies already installed"
fi
cd ..

# Frontend dependencies
echo -e "${YELLOW}📦 Installing Frontend dependencies...${NC}"
cd innovation-showcase-hub-main
if [ ! -d "node_modules" ]; then
    npm install
else
    echo "✅ Frontend dependencies already installed"
fi
cd ..

echo -e "${GREEN}✅ All dependencies installed${NC}"
echo ""

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# 3️⃣ BUILD FRONTEND
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

echo -e "${BLUE}3️⃣  Building Frontend${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

cd innovation-showcase-hub-main
echo -e "${YELLOW}🔨 Building React application...${NC}"
npm run build

if [ ! -d "dist" ]; then
    echo -e "${RED}❌ Build failed - dist folder not created${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Frontend built successfully${NC}"
cd ..
echo ""

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# 4️⃣ DEPLOY FIRESTORE (Rules & Indexes)
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

echo -e "${BLUE}4️⃣  Deploying Firestore Rules & Indexes${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

firebase deploy --only firestore:rules,firestore:indexes

echo -e "${GREEN}✅ Firestore rules and indexes deployed${NC}"
echo ""

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# 5️⃣ DEPLOY CLOUD FUNCTIONS
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

echo -e "${BLUE}5️⃣  Deploying Cloud Functions${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "${YELLOW}📤 Deploying all functions (this may take 2-3 minutes)...${NC}"

firebase deploy --only functions

echo -e "${GREEN}✅ Cloud Functions deployed${NC}"
echo ""

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# 6️⃣ DEPLOY HOSTING
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

echo -e "${BLUE}6️⃣  Deploying Frontend to Firebase Hosting${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

firebase deploy --only hosting

echo -e "${GREEN}✅ Frontend deployed to hosting${NC}"
echo ""

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# 7️⃣ GET DEPLOYMENT URLS
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

echo -e "${BLUE}7️⃣  Getting Deployment URLs${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Get hosting URL
HOSTING_URL="https://gibc-cet.web.app"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "${GREEN}🎉 DEPLOYMENT SUCCESSFUL!${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo -e "${GREEN}📱 YOUR LIVE URLS:${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo -e "${BLUE}📝 Registration Page:${NC}"
echo "   $HOSTING_URL/register"
echo ""
echo -e "${BLUE}🎫 Certificate Page:${NC}"
echo "   $HOSTING_URL/certificate"
echo ""
echo -e "${BLUE}👨‍💼 Admin Dashboard:${NC}"
echo "   $HOSTING_URL/admin"
echo "   ${YELLOW}Password: admin2026${NC}"
echo ""
echo -e "${BLUE}🏠 Home Page:${NC}"
echo "   $HOSTING_URL"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "${GREEN}✨ FEATURES DEPLOYED:${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "✅ Hybrid Auto-Approval Registration System"
echo "   - Allows repeated registrations"
echo "   - Returns existing token if info matches"
echo "   - Auto-approves valid submissions"
echo "   - Pending review for mismatched info"
echo ""
echo "✅ Certificate Generation System"
echo "   - Token-based verification"
echo "   - PDF download with confetti"
echo "   - Professional certificate design"
echo ""
echo "✅ Admin Dashboard"
echo "   - Participant management"
echo "   - Award assignment"
echo "   - Token regeneration"
echo "   - CSV/JSON export"
echo ""
echo "✅ Cloud Functions (9 total)"
echo "   - submitRegistration (NEW - Allows duplicates)"
echo "   - verifyToken"
echo "   - generateCertificate"
echo "   - assignAward"
echo "   - regenerateToken"
echo "   - getParticipants"
echo "   - createParticipant"
echo "   - updateParticipant"
echo "   - deleteParticipant"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "${YELLOW}📋 NEXT STEPS:${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "1. Test Registration System:"
echo "   Visit $HOSTING_URL/register"
echo "   Fill in valid data → Should get token instantly"
echo ""
echo "2. Test Repeated Registration:"
echo "   Register again with same email"
echo "   Should return existing token"
echo ""
echo "3. Test Certificate:"
echo "   Visit $HOSTING_URL/certificate"
echo "   Enter your token → Download PDF"
echo ""
echo "4. Admin Management:"
echo "   node admin-cli.js list-participants"
echo "   node admin-cli.js stats"
echo ""
echo "5. Monitor Functions:"
echo "   firebase functions:log --follow"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "${GREEN}🎊 Platform is LIVE and ready for participants!${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
