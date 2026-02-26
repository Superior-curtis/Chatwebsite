/**
 * Google Sheets to Firestore Sync Script
 * 
 * This script syncs participant data from Google Forms (via Google Sheets)
 * to Firebase Firestore for the Global Innovation Build Challenge.
 * 
 * Setup Instructions:
 * 1. Create a Google Form with fields: Devpost Username, Email, Project Name, Project URL
 * 2. Link responses to a Google Sheet
 * 3. In Google Cloud Console:
 *    - Enable Google Sheets API
 *    - Create a Service Account
 *    - Download the credentials JSON
 *    - Share your Google Sheet with the service account email
 * 4. Create .env file with:
 *    GOOGLE_SHEETS_ID=your_sheet_id
 *    GOOGLE_SERVICE_ACCOUNT_EMAIL=your_service_account@project.iam.gserviceaccount.com
 *    GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
 *    FIREBASE_PROJECT_ID=gibc-showcase
 * 5. Run: node syncFromSheets.js
 */

const admin = require("firebase-admin");
const { google } = require("googleapis");
require("dotenv").config();

// Initialize Firebase Admin
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      privateKey: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n")
    })
  });
}

const db = admin.firestore();

// Configure Google Sheets API
const auth = new google.auth.GoogleAuth({
  credentials: {
    client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n")
  },
  scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"]
});

const sheets = google.sheets({ version: "v4", auth });

/**
 * Generate a random 10-character alphanumeric token
 */
function generateToken() {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let token = "";
  for (let i = 0; i < 10; i++) {
    token += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return token;
}

/**
 * Check if a token already exists in Firestore
 */
async function tokenExists(token) {
  const snapshot = await db.collection("participants")
    .where("token", "==", token)
    .limit(1)
    .get();
  return !snapshot.empty;
}

/**
 * Generate a unique token that doesn't exist in the database
 */
async function generateUniqueToken() {
  let token;
  let attempts = 0;
  const maxAttempts = 10;

  do {
    token = generateToken();
    attempts++;
    if (attempts > maxAttempts) {
      throw new Error("Failed to generate unique token after multiple attempts");
    }
  } while (await tokenExists(token));

  return token;
}

/**
 * Check if a participant already exists in Firestore
 */
async function getExistingParticipant(devpostUsername, email) {
  // First try to find by Devpost username
  let snapshot = await db.collection("participants")
    .where("devpostUsername", "==", devpostUsername)
    .limit(1)
    .get();

  if (!snapshot.empty) {
    return snapshot.docs[0];
  }

  // If email provided, try to find by email
  if (email) {
    snapshot = await db.collection("participants")
      .where("email", "==", email)
      .limit(1)
      .get();

    if (!snapshot.empty) {
      return snapshot.docs[0];
    }
  }

  return null;
}

/**
 * Sync data from Google Sheets to Firestore
 */
async function syncFromSheets() {
  try {
    console.log("🚀 Starting sync from Google Sheets...\n");

    // Read data from Google Sheets
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.GOOGLE_SHEETS_ID,
      range: "Form Responses 1!A2:D" // Adjust range based on your sheet structure
    });

    const rows = response.data.values;
    if (!rows || rows.length === 0) {
      console.log("⚠️  No data found in Google Sheets");
      return;
    }

    console.log(`📊 Found ${rows.length} responses in Google Sheets\n`);

    let created = 0;
    let updated = 0;
    let skipped = 0;
    let errors = 0;

    // Process each row
    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      
      // Assuming columns: Timestamp, Devpost Username, Email, Project Name, Project URL
      // Adjust indices based on your actual form structure
      const timestamp = row[0];
      const devpostUsername = row[1]?.trim();
      const email = row[2]?.trim().toLowerCase();
      const projectName = row[3]?.trim();
      const projectUrl = row[4]?.trim();

      // Validate required fields
      if (!devpostUsername) {
        console.log(`⚠️  Row ${i + 2}: Skipping - missing Devpost username`);
        skipped++;
        continue;
      }

      try {
        // Check if participant already exists
        const existingDoc = await getExistingParticipant(devpostUsername, email);

        if (existingDoc) {
          // Update existing participant
          const updates = {};
          let hasChanges = false;

          if (email && existingDoc.data().email !== email) {
            updates.email = email;
            hasChanges = true;
          }
          if (projectName && existingDoc.data().projectName !== projectName) {
            updates.projectName = projectName;
            hasChanges = true;
          }
          if (projectUrl && existingDoc.data().projectUrl !== projectUrl) {
            updates.projectUrl = projectUrl;
            hasChanges = true;
          }

          if (hasChanges) {
            updates.updatedAt = admin.firestore.FieldValue.serverTimestamp();
            await existingDoc.ref.update(updates);
            console.log(`✅ Updated: ${devpostUsername}`);
            updated++;
          } else {
            console.log(`⏭️  Skipped: ${devpostUsername} (no changes)`);
            skipped++;
          }
        } else {
          // Create new participant
          const token = await generateUniqueToken();

          const participantData = {
            devpostUsername,
            email: email || null,
            projectName: projectName || null,
            projectUrl: projectUrl || null,
            award: "Participant",
            token,
            tokenUsed: false,
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
            updatedAt: admin.firestore.FieldValue.serverTimestamp(),
            formSubmittedAt: timestamp ? new Date(timestamp) : admin.firestore.FieldValue.serverTimestamp()
          };

          await db.collection("participants").add(participantData);
          console.log(`✨ Created: ${devpostUsername} (Token: ${token})`);
          created++;
        }
      } catch (error) {
        console.error(`❌ Error processing ${devpostUsername}:`, error.message);
        errors++;
      }
    }

    // Summary
    console.log("\n" + "=".repeat(50));
    console.log("📋 SYNC SUMMARY");
    console.log("=".repeat(50));
    console.log(`Total rows processed: ${rows.length}`);
    console.log(`✨ Created: ${created}`);
    console.log(`✅ Updated: ${updated}`);
    console.log(`⏭️  Skipped: ${skipped}`);
    console.log(`❌ Errors: ${errors}`);
    console.log("=".repeat(50) + "\n");

    if (created > 0) {
      console.log("💡 TIP: Newly created participants have been assigned tokens.");
      console.log("   You can export participant data from the Admin Dashboard.");
    }

  } catch (error) {
    console.error("\n❌ SYNC FAILED:");
    console.error(error.message);
    
    if (error.message.includes("PERMISSION_DENIED")) {
      console.log("\n💡 TROUBLESHOOTING:");
      console.log("   1. Ensure the Google Sheet is shared with the service account email");
      console.log(`      Service Account: ${process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL}`);
      console.log("   2. Verify the Sheet ID in your .env file is correct");
      console.log("   3. Check that the Google Sheets API is enabled in Google Cloud Console");
    }
    
    process.exit(1);
  }
}

/**
 * Watch mode - continuously sync at intervals
 */
async function watchMode(intervalMinutes = 5) {
  console.log(`👀 Watch mode enabled - syncing every ${intervalMinutes} minutes\n`);
  console.log("Press Ctrl+C to stop\n");

  // Initial sync
  await syncFromSheets();

  // Set up interval
  setInterval(async () => {
    console.log(`\n⏰ Running scheduled sync at ${new Date().toLocaleString()}\n`);
    await syncFromSheets();
  }, intervalMinutes * 60 * 1000);
}

// Main execution
if (require.main === module) {
  const args = process.argv.slice(2);
  const watchFlag = args.includes("--watch") || args.includes("-w");
  const intervalArg = args.find(arg => arg.startsWith("--interval="));
  const intervalMinutes = intervalArg ? parseInt(intervalArg.split("=")[1]) : 5;

  if (watchFlag) {
    watchMode(intervalMinutes).catch(console.error);
  } else {
    syncFromSheets()
      .then(() => {
        console.log("✅ Sync completed successfully!");
        process.exit(0);
      })
      .catch((error) => {
        console.error("❌ Sync failed:", error);
        process.exit(1);
      });
  }
}

module.exports = { syncFromSheets, watchMode };
