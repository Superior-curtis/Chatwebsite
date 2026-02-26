#!/usr/bin/env node

/**
 * Global Innovation Build Challenge - Admin CLI
 * 
 * Production-ready command-line interface for managing participants,
 * tokens, and awards in the hackathon platform.
 * 
 * Usage:
 *   node admin-cli.js check-token <token>
 *   node admin-cli.js assign-award <participant-id> <award>
 *   node admin-cli.js regenerate-token <participant-id>
 *   node admin-cli.js list-participants [--csv] [--filter award]
 *   node admin-cli.js participant-info <participant-id>
 *   node admin-cli.js create-participant <username> [--email email] [--project name]
 *   node admin-cli.js export-csv [--award award-name]
 *   node admin-cli.js stats
 */

const admin = require("firebase-admin");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const { createObjectCsvWriter } = require("csv-writer");
require("dotenv").config();

// ============================================================================
// CONFIGURATION & INITIALIZATION
// ============================================================================

/**
 * Initialize Firebase Admin SDK with credentials from environment
 */
function initializeFirebase() {
  try {
    if (admin.apps.length > 0) {
      return admin.app();
    }

    // Try to load from service account file first
    let credentials;
    if (fs.existsSync("service-account.json")) {
      credentials = JSON.parse(fs.readFileSync("service-account.json", "utf8"));
    } else {
      // Fall back to environment variables
      credentials = {
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n")
      };
    }

    if (!credentials.projectId || !credentials.clientEmail || !credentials.privateKey) {
      console.error("❌ Firebase credentials not found!");
      console.error("   Set these environment variables or create service-account.json:");
      console.error("   - FIREBASE_PROJECT_ID");
      console.error("   - FIREBASE_CLIENT_EMAIL");
      console.error("   - FIREBASE_PRIVATE_KEY");
      process.exit(1);
    }

    admin.initializeApp({
      credential: admin.credential.cert(credentials)
    });

    return admin.app();
  } catch (error) {
    console.error("❌ Firebase initialization failed:", error.message);
    process.exit(1);
  }
}

const db = admin.firestore();

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Generate a random 10-character alphanumeric token
 */
function generateToken() {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let token = "";
  for (let i = 0; i < 10; i++) {
    token += chars.charAt(crypto.randomInt(0, chars.length));
  }
  return token;
}

/**
 * Check if token already exists in database
 */
async function tokenExists(token) {
  const snapshot = await db.collection("participants")
    .where("token", "==", token)
    .limit(1)
    .get();
  return !snapshot.empty;
}

/**
 * Generate unique token
 */
async function generateUniqueToken() {
  let token;
  let attempts = 0;
  const maxAttempts = 10;

  do {
    token = generateToken();
    attempts++;
    if (attempts > maxAttempts) {
      throw new Error("Failed to generate unique token");
    }
  } while (await tokenExists(token));

  return token;
}

/**
 * Validate award type
 */
function validateAward(award) {
  const validAwards = ["Participant", "Finalist", "Winner", "Grand Prize"];
  return validAwards.includes(award);
}

/**
 * Format timestamp for display
 */
function formatDate(timestamp) {
  if (!timestamp) return "N/A";
  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
  return date.toLocaleDateString() + " " + date.toLocaleTimeString();
}

/**
 * Display participant info in a nice format
 */
function displayParticipant(participant) {
  console.log("\n" + "═".repeat(60));
  console.log(`📋 PARTICIPANT INFO`);
  console.log("═".repeat(60));
  console.log(`🆔 ID: ${participant.id}`);
  console.log(`👤 Username: ${participant.devpostUsername}`);
  console.log(`📧 Email: ${participant.email || "N/A"}`);
  console.log(`🚀 Project: ${participant.projectName || "N/A"}`);
  console.log(`🔗 URL: ${participant.projectUrl || "N/A"}`);
  console.log(`🏆 Award: ${participant.award || "Participant"}`);
  console.log(`🎫 Token: ${participant.token}`);
  console.log(`✅ Token Used: ${participant.tokenUsed ? "Yes" : "No"}`);
  console.log(`📅 Created: ${formatDate(participant.createdAt)}`);
  console.log(`🔄 Updated: ${formatDate(participant.updatedAt)}`);
  console.log("═".repeat(60) + "\n");
}

// ============================================================================
// COMMAND HANDLERS
// ============================================================================

/**
 * Check if token is valid and show participant info
 */
async function checkToken(token) {
  try {
    console.log(`\n🔍 Checking token: ${token.toUpperCase()}\n`);

    const snapshot = await db.collection("participants")
      .where("token", "==", token.toUpperCase())
      .limit(1)
      .get();

    if (snapshot.empty) {
      console.log("❌ Token not found in database\n");
      return;
    }

    const doc = snapshot.docs[0];
    const participant = { id: doc.id, ...doc.data() };

    displayParticipant(participant);
  } catch (error) {
    console.error("❌ Error checking token:", error.message);
  }
}

/**
 * Get participant info by ID
 */
async function getParticipantInfo(participantId) {
  try {
    console.log(`\n🔍 Fetching participant: ${participantId}\n`);

    const doc = await db.collection("participants").doc(participantId).get();

    if (!doc.exists) {
      console.log("❌ Participant not found\n");
      return;
    }

    const participant = { id: doc.id, ...doc.data() };
    displayParticipant(participant);
  } catch (error) {
    console.error("❌ Error fetching participant:", error.message);
  }
}

/**
 * Assign award to participant
 */
async function assignAward(participantId, award) {
  try {
    if (!validateAward(award)) {
      console.log("❌ Invalid award. Valid awards: Participant, Finalist, Winner, Grand Prize\n");
      return;
    }

    console.log(`\n🏆 Assigning award to ${participantId}...\n`);

    const doc = await db.collection("participants").doc(participantId).get();
    if (!doc.exists) {
      console.log("❌ Participant not found\n");
      return;
    }

    const oldAward = doc.data().award;

    await db.collection("participants").doc(participantId).update({
      award,
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });

    console.log(`✅ Award updated successfully!`);
    console.log(`   From: ${oldAward || "Participant"}`);
    console.log(`   To: ${award}\n`);
  } catch (error) {
    console.error("❌ Error assigning award:", error.message);
  }
}

/**
 * Regenerate token for participant
 */
async function regenerateToken(participantId) {
  try {
    console.log(`\n🔄 Regenerating token for ${participantId}...\n`);

    const doc = await db.collection("participants").doc(participantId).get();
    if (!doc.exists) {
      console.log("❌ Participant not found\n");
      return;
    }

    const oldToken = doc.data().token;
    const newToken = await generateUniqueToken();

    await db.collection("participants").doc(participantId).update({
      token: newToken,
      tokenUsed: false,
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });

    console.log(`✅ Token regenerated successfully!`);
    console.log(`   Old Token: ${oldToken}`);
    console.log(`   New Token: ${newToken}\n`);
  } catch (error) {
    console.error("❌ Error regenerating token:", error.message);
  }
}

/**
 * Create new participant
 */
async function createParticipant(username, email = null, projectName = null) {
  try {
    console.log(`\n✨ Creating new participant...\n`);

    // Check if username already exists
    const snapshot = await db.collection("participants")
      .where("devpostUsername", "==", username)
      .limit(1)
      .get();

    if (!snapshot.empty) {
      console.log("❌ Username already exists\n");
      return;
    }

    const token = await generateUniqueToken();

    const participantData = {
      devpostUsername: username,
      email: email || null,
      projectName: projectName || null,
      projectUrl: null,
      award: "Participant",
      token,
      tokenUsed: false,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    };

    const docRef = await db.collection("participants").add(participantData);

    console.log(`✅ Participant created successfully!`);
    console.log(`   ID: ${docRef.id}`);
    console.log(`   Username: ${username}`);
    console.log(`   Token: ${token}`);
    if (email) console.log(`   Email: ${email}`);
    if (projectName) console.log(`   Project: ${projectName}`);
    console.log();
  } catch (error) {
    console.error("❌ Error creating participant:", error.message);
  }
}

/**
 * List all participants with optional filtering
 */
async function listParticipants(awardFilter = null, format = "table") {
  try {
    console.log(`\n📋 Fetching participants...\n`);

    let query = db.collection("participants");

    if (awardFilter) {
      query = query.where("award", "==", awardFilter);
    }

    const snapshot = await query.orderBy("createdAt", "desc").get();

    if (snapshot.empty) {
      console.log("❌ No participants found\n");
      return;
    }

    const participants = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    if (format === "csv") {
      return participants; // Will be handled by export function
    }

    // Display as table
    console.log("═".repeat(120));
    console.log(
      "ID".padEnd(25) + " | " +
      "Username".padEnd(20) + " | " +
      "Email".padEnd(25) + " | " +
      "Award".padEnd(15) + " | " +
      "Token".padEnd(12) + " | " +
      "Used"
    );
    console.log("═".repeat(120));

    participants.forEach(p => {
      console.log(
        (p.id.substring(0, 24)).padEnd(25) + " | " +
        (p.devpostUsername || "N/A").substring(0, 19).padEnd(20) + " | " +
        (p.email || "N/A").substring(0, 24).padEnd(25) + " | " +
        (p.award || "Participant").padEnd(15) + " | " +
        (p.token || "N/A").padEnd(12) + " | " +
        (p.tokenUsed ? "✓" : "✗")
      );
    });

    console.log("═".repeat(120));
    console.log(`\nTotal: ${participants.length} participants\n`);

    if (awardFilter) {
      console.log(`Filtered by award: ${awardFilter}\n`);
    }

    // Return count stats
    const stats = {
      total: participants.length,
      participants: participants.filter(p => !p.award || p.award === "Participant").length,
      finalists: participants.filter(p => p.award === "Finalist").length,
      winners: participants.filter(p => p.award === "Winner").length,
      grandPrize: participants.filter(p => p.award === "Grand Prize").length,
      tokensUsed: participants.filter(p => p.tokenUsed).length
    };

    console.log("📊 STATISTICS:");
    console.log(`   Total Participants: ${stats.total}`);
    console.log(`   Finalists: ${stats.finalists}`);
    console.log(`   Winners: ${stats.winners}`);
    console.log(`   Grand Prize: ${stats.grandPrize}`);
    console.log(`   Tokens Used: ${stats.tokensUsed}`);
    console.log();

    return participants;
  } catch (error) {
    console.error("❌ Error listing participants:", error.message);
  }
}

/**
 * Export participants to CSV file
 */
async function exportCSV(awardFilter = null) {
  try {
    console.log(`\n📥 Exporting participants to CSV...\n`);

    let query = db.collection("participants");

    if (awardFilter) {
      query = query.where("award", "==", awardFilter);
    }

    const snapshot = await query.orderBy("createdAt", "desc").get();

    if (snapshot.empty) {
      console.log("❌ No participants found\n");
      return;
    }

    const participants = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    // Create CSV writer
    const timestamp = new Date().toISOString().split("T")[0];
    const filename = `participants_${timestamp}.csv`;

    const csvWriter = createObjectCsvWriter({
      path: filename,
      header: [
        { id: "devpostUsername", title: "Devpost Username" },
        { id: "email", title: "Email" },
        { id: "projectName", title: "Project Name" },
        { id: "projectUrl", title: "Project URL" },
        { id: "award", title: "Award" },
        { id: "token", title: "Token" },
        { id: "tokenUsed", title: "Token Used" }
      ]
    });

    const records = participants.map(p => ({
      devpostUsername: p.devpostUsername || "",
      email: p.email || "",
      projectName: p.projectName || "",
      projectUrl: p.projectUrl || "",
      award: p.award || "Participant",
      token: p.token || "",
      tokenUsed: p.tokenUsed ? "Yes" : "No"
    }));

    await csvWriter.writeRecords(records);

    console.log(`✅ Export successful!`);
    console.log(`   File: ${filename}`);
    console.log(`   Records: ${records.length}\n`);
  } catch (error) {
    console.error("❌ Error exporting CSV:", error.message);
  }
}

/**
 * Display overall statistics
 */
async function showStats() {
  try {
    console.log(`\n📊 GLOBAL STATISTICS\n`);

    const snapshot = await db.collection("participants").get();

    if (snapshot.empty) {
      console.log("No participants yet.\n");
      return;
    }

    const participants = snapshot.docs.map(doc => doc.data());

    const stats = {
      total: participants.length,
      participants: participants.filter(p => !p.award || p.award === "Participant").length,
      finalists: participants.filter(p => p.award === "Finalist").length,
      winners: participants.filter(p => p.award === "Winner").length,
      grandPrize: participants.filter(p => p.award === "Grand Prize").length,
      tokensUsed: participants.filter(p => p.tokenUsed).length,
      withEmail: participants.filter(p => p.email).length,
      withProject: participants.filter(p => p.projectName).length
    };

    console.log("═".repeat(50));
    console.log(`👥 Total Participants: ${stats.total}`);
    console.log(`🎟️  Participants: ${stats.participants}`);
    console.log(`🥈 Finalists: ${stats.finalists}`);
    console.log(`🥇 Winners: ${stats.winners}`);
    console.log(`👑 Grand Prize: ${stats.grandPrize}`);
    console.log(`✅ Tokens Used: ${stats.tokensUsed}`);
    console.log(`📧 With Email: ${stats.withEmail}`);
    console.log(`🚀 With Project: ${stats.withProject}`);
    console.log("═".repeat(50) + "\n");
  } catch (error) {
    console.error("❌ Error fetching stats:", error.message);
  }
}

/**
 * Delete participant (with confirmation)
 */
async function deleteParticipant(participantId) {
  try {
    const doc = await db.collection("participants").doc(participantId).get();
    if (!doc.exists) {
      console.log("❌ Participant not found\n");
      return;
    }

    console.log("\n⚠️  WARNING: You are about to delete a participant!");
    console.log(`   Username: ${doc.data().devpostUsername}`);
    console.log(`   Token: ${doc.data().token}`);
    console.log("   This action cannot be undone.\n");

    // In CLI, we'll require manual confirmation via re-running with --confirm flag
    console.log("To confirm, run: node admin-cli.js delete-participant " + participantId + " --confirm\n");
  } catch (error) {
    console.error("❌ Error:", error.message);
  }
}

/**
 * Confirm delete participant
 */
async function confirmDeleteParticipant(participantId) {
  try {
    const doc = await db.collection("participants").doc(participantId).get();
    if (!doc.exists) {
      console.log("❌ Participant not found\n");
      return;
    }

    const username = doc.data().devpostUsername;

    await db.collection("participants").doc(participantId).delete();

    console.log(`\n✅ Participant deleted successfully!`);
    console.log(`   Username: ${username}\n`);
  } catch (error) {
    console.error("❌ Error deleting participant:", error.message);
  }
}

// ============================================================================
// COMMAND LINE PARSING
// ============================================================================

/**
 * Display help information
 */
function showHelp() {
  const helpText = `
╔════════════════════════════════════════════════════════════════════════════╗
║  GIBC Admin CLI - Global Innovation Build Challenge Participant Manager    ║
╚════════════════════════════════════════════════════════════════════════════╝

USAGE:
  node admin-cli.js <command> [options]

COMMANDS:

📋 Participant Management:
  check-token <token>
    Check if a token is valid and show participant info
    Example: node admin-cli.js check-token ABC123XYZ0

  list-participants [--award award-name]
    List all participants, optionally filtered by award
    Example: node admin-cli.js list-participants --award Winner

  participant-info <participant-id>
    Get detailed info about a specific participant
    Example: node admin-cli.js participant-info abc123def456

  create-participant <username> [--email email] [--project name]
    Create a new participant with auto-generated token
    Example: node admin-cli.js create-participant john_doe --email john@example.com --project "My Project"

🏆 Award Management:
  assign-award <participant-id> <award>
    Assign an award (Participant|Finalist|Winner|Grand Prize)
    Example: node admin-cli.js assign-award abc123def456 Winner

🎫 Token Management:
  regenerate-token <participant-id>
    Generate a new token for a participant
    Example: node admin-cli.js regenerate-token abc123def456

📊 Data Export:
  export-csv [--award award-name]
    Export participants to CSV file
    Example: node admin-cli.js export-csv --award Finalist

  stats
    Display overall statistics and counts
    Example: node admin-cli.js stats

🗑️  Dangerous Operations:
  delete-participant <participant-id>
    Delete a participant (shows confirmation message)
    Example: node admin-cli.js delete-participant abc123def456

  delete-participant <participant-id> --confirm
    Permanently delete a participant (requires --confirm flag)
    Example: node admin-cli.js delete-participant abc123def456 --confirm

ENVIRONMENT SETUP:
  Create a .env file or service-account.json with:
  
  Option 1 - Environment Variables (.env):
    FIREBASE_PROJECT_ID=gibc-showcase
    FIREBASE_CLIENT_EMAIL=admin@gibc-showcase.iam.gserviceaccount.com
    FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\\n...\\n-----END PRIVATE KEY-----\\n"

  Option 2 - Service Account File (service-account.json):
    Downloaded from Firebase Console > Project Settings > Service Accounts

EXAMPLES:

  # Create a participant
  node admin-cli.js create-participant jane_smith --email jane@example.com --project "AI Assistant"

  # Assign a winner
  node admin-cli.js assign-award abc123def456 Winner

  # Regenerate token if lost
  node admin-cli.js regenerate-token abc123def456

  # View all finalists
  node admin-cli.js list-participants --award Finalist

  # Export all current awards
  node admin-cli.js export-csv

  # Check statistics
  node admin-cli.js stats

COLORS & SYMBOLS:
  ✅ Success / Positive action
  ❌ Error / Negative action
  🔍 Search / Lookup
  🏆 Award / Achievement
  🎫 Token
  📋 Participant / Data
  📧 Email
  🚀 Project
  ✨ Create / New
  🔄 Regenerate / Update
  📥 Export
  📊 Statistics
  ⚠️  Warning

For more help, visit: https://github.com/

`;
  console.log(helpText);
}

// ============================================================================
// MAIN CLI EXECUTION
// ============================================================================

async function main() {
  const args = process.argv.slice(2);

  if (args.length === 0 || args[0] === "--help" || args[0] === "-h" || args[0] === "help") {
    showHelp();
    process.exit(0);
  }

  // Initialize Firebase
  initializeFirebase();

  const command = args[0];
  const options = args.slice(1);

  try {
    switch (command) {
      case "check-token":
        if (!options[0]) {
          console.log("❌ Token required\n");
          break;
        }
        await checkToken(options[0]);
        break;

      case "list-participants":
        const awardFilter = options[0] === "--award" ? options[1] : null;
        await listParticipants(awardFilter, "table");
        break;

      case "participant-info":
        if (!options[0]) {
          console.log("❌ Participant ID required\n");
          break;
        }
        await getParticipantInfo(options[0]);
        break;

      case "create-participant":
        if (!options[0]) {
          console.log("❌ Username required\n");
          break;
        }
        const email = options.includes("--email") ? options[options.indexOf("--email") + 1] : null;
        const project = options.includes("--project") ? options[options.indexOf("--project") + 1] : null;
        await createParticipant(options[0], email, project);
        break;

      case "assign-award":
        if (!options[0] || !options[1]) {
          console.log("❌ Participant ID and Award required\n");
          break;
        }
        await assignAward(options[0], options[1]);
        break;

      case "regenerate-token":
        if (!options[0]) {
          console.log("❌ Participant ID required\n");
          break;
        }
        await regenerateToken(options[0]);
        break;

      case "export-csv":
        const exportAwardFilter = options[0] === "--award" ? options[1] : null;
        await exportCSV(exportAwardFilter);
        break;

      case "stats":
        await showStats();
        break;

      case "delete-participant":
        if (!options[0]) {
          console.log("❌ Participant ID required\n");
          break;
        }
        if (options.includes("--confirm")) {
          await confirmDeleteParticipant(options[0]);
        } else {
          await deleteParticipant(options[0]);
        }
        break;

      default:
        console.log(`❌ Unknown command: ${command}\n`);
        console.log("Run 'node admin-cli.js --help' for available commands\n");
    }

    process.exit(0);
  } catch (error) {
    console.error("❌ Fatal error:", error.message);
    process.exit(1);
  }
}

// Run CLI
main().catch(error => {
  console.error("❌ Error:", error);
  process.exit(1);
});
