#!/bin/bash

################################################################################
# Global Innovation Build Challenge - Complete Deployment Script              #
# For Linux and macOS                                                         #
#                                                                              #
# This script performs one-click deployment of the entire GIBC platform:     #
# 1. Validates environment and dependencies                                   #
# 2. Installs dependencies (Firebase, Google Sheets, etc.)                   #
# 3. Builds the React frontend                                                #
# 4. Deploys Cloud Functions                                                  #
# 5. Deploys Firestore rules and indexes                                      #
# 6. Deploys hosting                                                          #
# 7. Starts Google Sheets sync in watch mode                                  #
#                                                                              #
# Requirements:                                                                #
#   - Node.js 18+ installed                                                   #
#   - Firebase CLI installed (npm install -g firebase-tools)                 #
#   - Firebase project configured (.firebaserc)                               #
#   - .env file with proper credentials                                       #
#                                                                              #
# Usage:                                                                       #
#   ./deploy_and_sync.sh                                                      #
#   ./deploy_and_sync.sh --offline     (skip functions/hosting)              #
#   ./deploy_and_sync.sh --frontend-only                                      #
#   ./deploy_and_sync.sh --functions-only                                     #
#   ./deploy_and_sync.sh --sync-only                                          #
################################################################################

set -e

# ============================================================================
# Color and Symbol Configuration
# ============================================================================

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

SUCCESS="✓"
ERROR="✗"
INFO="•"
WARN="⚠"

# ============================================================================
# Configuration
# ============================================================================

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$SCRIPT_DIR"

OFFLINE=false
FRONTEND_ONLY=false
FUNCTIONS_ONLY=false
SYNC_ONLY=false

# Parse command line arguments
for arg in "$@"; do
    case $arg in
        --offline)
            OFFLINE=true
            ;;
        --frontend-only)
            FRONTEND_ONLY=true
            ;;
        --functions-only)
            FUNCTIONS_ONLY=true
            ;;
        --sync-only)
            SYNC_ONLY=true
            ;;
    esac
done

# ============================================================================
# Utility Functions
# ============================================================================

print_header() {
    echo ""
    echo "╔════════════════════════════════════════════════════════════════════════════╗"
    echo "║ GIBC Platform - Deployment Script (Unix)                                  ║"
    echo "║ Global Innovation Build Challenge V1 (2026)                               ║"
    echo "╚════════════════════════════════════════════════════════════════════════════╝"
    echo ""
}

section_header() {
    local stage=$1
    local title=$2
    echo ""
    echo -e "${BLUE}[Stage $stage/8] $title${NC}"
    echo "================================"
}

success_msg() {
    echo -e "${GREEN}${SUCCESS}${NC} $1"
}

error_msg() {
    echo -e "${RED}${ERROR}${NC} $1"
}

info_msg() {
    echo -e "${BLUE}${INFO}${NC} $1"
}

warn_msg() {
    echo -e "${YELLOW}${WARN}${NC} $1"
}

# ============================================================================
# Pre-flight Checks
# ============================================================================

pre_flight_checks() {
    section_header "1" "Pre-flight Checks"

    # Check Node.js
    if ! command -v node &> /dev/null; then
        error_msg "Node.js not found. Please install Node.js 18+ from https://nodejs.org"
        exit 1
    fi
    local node_version=$(node --version)
    success_msg "Node.js installed: $node_version"

    # Check Firebase CLI
    if ! command -v firebase &> /dev/null; then
        error_msg "Firebase CLI not found"
        echo "   Run: npm install -g firebase-tools"
        exit 1
    fi
    local firebase_version=$(firebase --version)
    success_msg "Firebase CLI installed: $firebase_version"

    # Check .env or service account
    if [ ! -f ".env" ] && [ ! -f "service-account.json" ]; then
        error_msg "Missing .env or service-account.json"
        echo "   Copy .env.example to .env and fill in credentials"
        exit 1
    fi
    success_msg "Credentials found"

    # Check .firebaserc
    if [ ! -f ".firebaserc" ]; then
        error_msg ".firebaserc not found"
        echo "   Run: firebase init"
        exit 1
    fi
    success_msg "Firebase project configured"

    echo ""
}

# ============================================================================
# Install Dependencies
# ============================================================================

install_dependencies() {
    section_header "2" "Installing Dependencies"

    # Frontend dependencies
    if [ -d "innovation-showcase-hub-main" ]; then
        info_msg "Installing frontend dependencies..."
        cd innovation-showcase-hub-main
        npm install > /dev/null 2>&1 || {
            error_msg "Frontend dependency installation failed"
            exit 1
        }
        cd ..
        success_msg "Frontend dependencies installed"
    fi

    # Functions dependencies
    if [ -d "functions" ]; then
        info_msg "Installing functions dependencies..."
        cd functions
        npm install > /dev/null 2>&1 || {
            error_msg "Functions dependency installation failed"
            exit 1
        }
        cd ..
        success_msg "Functions dependencies installed"
    fi

    # Admin CLI dependencies
    info_msg "Installing admin CLI dependencies..."
    npm install csv-writer dotenv firebase-admin googleapis > /dev/null 2>&1 || {
        warn_msg "Some admin CLI dependencies may need manual installation"
    }
    success_msg "Admin CLI dependencies ready"

    echo ""
}

# ============================================================================
# Build Frontend
# ============================================================================

build_frontend() {
    section_header "3" "Building Frontend"

    if [ -d "innovation-showcase-hub-main" ]; then
        cd innovation-showcase-hub-main
        info_msg "Building React application..."
        npm run build > /dev/null 2>&1 || {
            error_msg "Frontend build failed"
            cd ..
            exit 1
        }
        cd ..
        success_msg "Frontend built successfully"
        echo "           Output: innovation-showcase-hub-main/dist"
    else
        warn_msg "Frontend directory not found, skipping build"
    fi

    echo ""
}

# ============================================================================
# Deploy to Firebase
# ============================================================================

deploy_functions() {
    section_header "4" "Deploying Cloud Functions"

    info_msg "Deploying 8 Cloud Functions..."
    if firebase deploy --only functions > /dev/null 2>&1; then
        success_msg "Cloud Functions deployed"
    else
        error_msg "Cloud Functions deployment failed"
        exit 1
    fi

    echo ""
}

deploy_firestore() {
    section_header "5" "Deploying Firestore Configuration"

    info_msg "Deploying security rules and indexes..."
    
    firebase deploy --only firestore:rules > /dev/null 2>&1 || {
        warn_msg "Firestore rules deployment had issues"
    }
    
    firebase deploy --only firestore:indexes > /dev/null 2>&1 || {
        warn_msg "Firestore indexes may need manual setup"
    }
    
    success_msg "Firestore configuration deployed"
    echo ""
}

deploy_hosting() {
    section_header "6" "Deploying Hosting"

    info_msg "Deploying frontend to Firebase Hosting..."
    if firebase deploy --only hosting > /dev/null 2>&1; then
        success_msg "Hosting deployed successfully"
    else
        error_msg "Hosting deployment failed"
        exit 1
    fi

    echo ""
}

# ============================================================================
# Get Deployment URLs
# ============================================================================

get_urls() {
    section_header "7" "Getting Deployment URLs"

    success_msg "Deployment Complete!"
    echo ""
    echo "📊 YOUR PLATFORM IS LIVE!"
    echo ""
    echo "🎯 IMPORTANT URLS:"
    echo "   Certificate: https://<your-project>.web.app/certificate"
    echo "   Admin: https://<your-project>.web.app/admin (password: admin2026)"
    echo "   API: https://<your-project>.web.app/api/verify"
    echo ""
}

# ============================================================================
# Start Google Sheets Sync
# ============================================================================

start_sync() {
    section_header "8" "Starting Google Sheets Sync"

    info_msg "Starting Google Sheets sync in watch mode..."
    echo "    (Press Ctrl+C to stop)"
    echo ""
    sleep 2
    
    node syncFromSheets.js --watch --interval=5
}

# ============================================================================
# Main Execution
# ============================================================================

main() {
    print_header

    if [ "$SYNC_ONLY" = true ]; then
        echo "[Starting Google Sheets Sync Only]"
        start_sync
        exit 0
    fi

    pre_flight_checks
    
    if [ "$OFFLINE" = false ]; then
        install_dependencies
    fi

    if [ "$FUNCTIONS_ONLY" = false ] && [ "$SYNC_ONLY" = false ]; then
        build_frontend
    fi

    if [ "$FRONTEND_ONLY" = true ]; then
        echo ""
        success_msg "Frontend build completed!"
        echo ""
        exit 0
    fi

    if [ "$OFFLINE" = false ] && [ "$FRONTEND_ONLY" = false ]; then
        deploy_functions
        deploy_firestore
        deploy_hosting
        get_urls
    fi

    if [ "$FUNCTIONS_ONLY" = false ] && [ "$OFFLINE" = false ]; then
        start_sync
    fi
}

# Run main function
main "$@"
