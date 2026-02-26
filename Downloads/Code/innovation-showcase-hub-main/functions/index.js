const functions = require("firebase-functions");
const admin = require("firebase-admin");
const cors = require("cors")({origin: true});
const {stringify} = require("csv-stringify/sync");
const crypto = require("crypto");

admin.initializeApp();
const db = admin.firestore();

function generateToken(length = 10) {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let token = "";
  const randomBytes = crypto.randomBytes(length);
  
  for (let i = 0; i < length; i++) {
    token += chars[randomBytes[i] % chars.length];
  }
  
  return token;
}

function isAdmin(context) {
  return context.auth && context.auth.token && context.auth.token.admin === true;
}

async function tokenExists(token) {
  const snapshot = await db.collection("participants")
    .where("token", "==", token)
    .limit(1)
    .get();
  return !snapshot.empty;
}

exports.verifyToken = functions.https.onRequest((req, res) => {
  return cors(req, res, async () => {
    if (req.method !== "POST" && req.method !== "GET") {
      return res.status(405).json({error: "Method not allowed"});
    }

    try {
      const {email, devpostUsername, projectName, token} = 
        req.method === "POST" ? req.body : req.query;

      if (!token) {
        return res.status(400).json({
          valid: false,
          error: "Token is required"
        });
      }

      const participantSnapshot = await db.collection("participants")
        .where("token", "==", token.toUpperCase())
        .limit(1)
        .get();

      if (participantSnapshot.empty) {
        return res.status(404).json({
          valid: false,
          error: "Invalid token"
        });
      }

      const participantDoc = participantSnapshot.docs[0];
      const participant = participantDoc.data();

      const emailMatch = !email || 
        participant.email.toLowerCase() === email.toLowerCase();
      const usernameMatch = !devpostUsername || 
        participant.devpostUsername === devpostUsername;
      const projectMatch = !projectName || 
        participant.projectName === projectName;

      if (!emailMatch || !usernameMatch || !projectMatch) {
        return res.json({
          valid: false,
          error: "Token does not match participant information"
        });
      }

      return res.json({
        valid: true,
        participant: {
          id: participantDoc.id,
          email: participant.email,
          devpostUsername: participant.devpostUsername,
          projectName: participant.projectName,
          award: participant.award || null,
          verifiedAt: new Date().toISOString()
        }
      });
    } catch (error) {
      console.error("Error verifying token:", error);
      return res.status(500).json({
        valid: false,
        error: "Internal server error"
      });
    }
  });
});

exports.generateCertificate = functions.https.onCall(async (data, context) => {
  try {
    const {participantName, token} = data;

    if (!token) {
      throw new functions.https.HttpsError(
        "invalid-argument",
        "Token is required"
      );
    }

    const participantSnapshot = await db.collection("participants")
      .where("token", "==", token.toUpperCase())
      .limit(1)
      .get();

    if (participantSnapshot.empty) {
      throw new functions.https.HttpsError(
        "not-found",
        "Invalid token"
      );
    }

    const participantDoc = participantSnapshot.docs[0];
    const participant = participantDoc.data();

    await participantDoc.ref.update({
      certificateGenerated: true,
      certificateGeneratedAt: admin.firestore.FieldValue.serverTimestamp(),
      participantName: participantName || participant.devpostUsername
    });

    return {
      success: true,
      certificate: {
        participantName: participantName || participant.devpostUsername,
        projectName: participant.projectName,
        award: participant.award || "Participant",
        eventName: "Global Innovation Build Challenge V1",
        eventDate: "2026",
        issuer: "Kang Chiao International School Students",
        token: participant.token
      }
    };
  } catch (error) {
    console.error("Error generating certificate:", error);
    if (error instanceof functions.https.HttpsError) {
      throw error;
    }
    throw new functions.https.HttpsError(
      "internal",
      "Failed to generate certificate"
    );
  }
});

exports.assignAward = functions.https.onCall(async (data, context) => {
  if (!isAdmin(context)) {
    throw new functions.https.HttpsError(
      "permission-denied",
      "Only admins can assign awards"
    );
  }

  try {
    const {participantId, award} = data;

    if (!participantId || !award) {
      throw new functions.https.HttpsError(
        "invalid-argument",
        "Participant ID and award are required"
      );
    }

    const validAwards = [
      "Winner",
      "Runner-up",
      "Finalist",
      "Best Innovation",
      "Best Design",
      "Best Technical Implementation",
      "Participant"
    ];

    if (!validAwards.includes(award)) {
      throw new functions.https.HttpsError(
        "invalid-argument",
        `Award must be one of: ${validAwards.join(", ")}`
      );
    }

    await db.collection("participants").doc(participantId).update({
      award,
      awardAssignedAt: admin.firestore.FieldValue.serverTimestamp(),
      awardAssignedBy: context.auth.uid
    });

    return {
      success: true,
      message: `Award "${award}" assigned successfully`
    };
  } catch (error) {
    console.error("Error assigning award:", error);
    if (error instanceof functions.https.HttpsError) {
      throw error;
    }
    throw new functions.https.HttpsError(
      "internal",
      "Failed to assign award"
    );
  }
});

exports.regenerateToken = functions.https.onCall(async (data, context) => {
  if (!isAdmin(context)) {
    throw new functions.https.HttpsError(
      "permission-denied",
      "Only admins can regenerate tokens"
    );
  }

  try {
    const {participantId} = data;

    if (!participantId) {
      throw new functions.https.HttpsError(
        "invalid-argument",
        "Participant ID is required"
      );
    }

    let newToken = generateToken();
    while (await tokenExists(newToken)) {
      newToken = generateToken();
    }

    await db.collection("participants").doc(participantId).update({
      token: newToken,
      tokenRegeneratedAt: admin.firestore.FieldValue.serverTimestamp(),
      tokenRegeneratedBy: context.auth.uid
    });

    return {
      success: true,
      token: newToken
    };
  } catch (error) {
    console.error("Error regenerating token:", error);
    if (error instanceof functions.https.HttpsError) {
      throw error;
    }
    throw new functions.https.HttpsError(
      "internal",
      "Failed to regenerate token"
    );
  }
});

exports.getParticipants = functions.https.onCall(async (data, context) => {
  if (!isAdmin(context)) {
    throw new functions.https.HttpsError(
      "permission-denied",
      "Only admins can view all participants"
    );
  }

  try {
    const {format = "json"} = data;

    const snapshot = await db.collection("participants")
      .orderBy("createdAt", "desc")
      .get();

    const participants = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate?.()?.toISOString?.() || null
    }));

    if (format === "csv") {
      const csvData = stringify(participants, {
        header: true,
        columns: [
          "id",
          "email",
          "devpostUsername",
          "projectName",
          "award",
          "token",
          "certificateGenerated",
          "createdAt"
        ]
      });

      return {
        success: true,
        format: "csv",
        data: csvData
      };
    }

    return {
      success: true,
      format: "json",
      participants
    };
  } catch (error) {
    console.error("Error getting participants:", error);
    throw new functions.https.HttpsError(
      "internal",
      "Failed to retrieve participants"
    );
  }
});

exports.createParticipant = functions.https.onCall(async (data, context) => {
  if (!isAdmin(context)) {
    throw new functions.https.HttpsError(
      "permission-denied",
      "Only admins can create participants"
    );
  }

  try {
    const {email, devpostUsername, projectName} = data;

    if (!email || !devpostUsername || !projectName) {
      throw new functions.https.HttpsError(
        "invalid-argument",
        "Email, Devpost username, and project name are required"
      );
    }

    const existingSnapshot = await db.collection("participants")
      .where("email", "==", email.toLowerCase())
      .limit(1)
      .get();

    if (!existingSnapshot.empty) {
      throw new functions.https.HttpsError(
        "already-exists",
        "Participant with this email already exists"
      );
    }

    let token = generateToken();
    while (await tokenExists(token)) {
      token = generateToken();
    }

    const participantData = {
      email: email.toLowerCase(),
      devpostUsername,
      projectName,
      token,
      award: "Participant",
      certificateGenerated: false,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      createdBy: context.auth.uid
    };

    const docRef = await db.collection("participants").add(participantData);

    return {
      success: true,
      participantId: docRef.id,
      token
    };
  } catch (error) {
    console.error("Error creating participant:", error);
    if (error instanceof functions.https.HttpsError) {
      throw error;
    }
    throw new functions.https.HttpsError(
      "internal",
      "Failed to create participant"
    );
  }
});

exports.updateParticipant = functions.https.onCall(async (data, context) => {
  if (!isAdmin(context)) {
    throw new functions.https.HttpsError(
      "permission-denied",
      "Only admins can update participants"
    );
  }

  try {
    const {participantId, updates} = data;

    if (!participantId || !updates) {
      throw new functions.https.HttpsError(
        "invalid-argument",
        "Participant ID and updates are required"
      );
    }

    const allowedFields = [
      "email",
      "devpostUsername",
      "projectName",
      "award"
    ];
    const updateData = {};

    for (const field of allowedFields) {
      if (updates[field] !== undefined) {
        updateData[field] = updates[field];
      }
    }

    if (Object.keys(updateData).length === 0) {
      throw new functions.https.HttpsError(
        "invalid-argument",
        "No valid fields to update"
      );
    }

    updateData.updatedAt = admin.firestore.FieldValue.serverTimestamp();
    updateData.updatedBy = context.auth.uid;

    await db.collection("participants").doc(participantId).update(updateData);

    return {
      success: true,
      message: "Participant updated successfully"
    };
  } catch (error) {
    console.error("Error updating participant:", error);
    if (error instanceof functions.https.HttpsError) {
      throw error;
    }
    throw new functions.https.HttpsError(
      "internal",
      "Failed to update participant"
    );
  }
});

exports.deleteParticipant = functions.https.onCall(async (data, context) => {
  if (!isAdmin(context)) {
    throw new functions.https.HttpsError(
      "permission-denied",
      "Only admins can delete participants"
    );
  }

  try {
    const {participantId} = data;

    if (!participantId) {
      throw new functions.https.HttpsError(
        "invalid-argument",
        "Participant ID is required"
      );
    }

    await db.collection("participants").doc(participantId).delete();

    return {
      success: true,
      message: "Participant deleted successfully"
    };
  } catch (error) {
    console.error("Error deleting participant:", error);
    if (error instanceof functions.https.HttpsError) {
      throw error;
    }
    throw new functions.https.HttpsError(
      "internal",
      "Failed to delete participant"
    );
  }
});

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 🎯 HYBRID AUTO-APPROVAL REGISTRATION SYSTEM
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 
// This function handles participant registration with intelligent auto-approval:
// - Allows repeated registrations with the same email/username
// - Returns existing token if participant info matches
// - Auto-approves participants who meet ALL validation criteria
// - Sends pending registrations for manual review when criteria fail or info doesn't match
// - Generates unique tokens for approved participants
//
// Auto-Approval Criteria:
// ✓ Project name length > 3 characters
// ✓ Devpost project link contains "devpost.com"
// ✓ Agreement checkbox checked
// ✓ All participant info matches (for returning participants)
//
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

exports.submitRegistration = functions.https.onCall(async (data, context) => {
  try {
    const {
      fullName,
      email,
      devpostUsername,
      projectName,
      projectLink,
      agreement
    } = data;

    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // 1️⃣ VALIDATE REQUIRED FIELDS
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

    if (!fullName || !email || !devpostUsername || !projectName || !projectLink) {
      throw new functions.https.HttpsError(
        "invalid-argument",
        "All fields are required: fullName, email, devpostUsername, projectName, projectLink"
      );
    }

    if (!agreement) {
      throw new functions.https.HttpsError(
        "invalid-argument",
        "You must agree to the terms and conditions"
      );
    }

    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // 2️⃣ NORMALIZE & CHECK FOR EXISTING PARTICIPANT
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

    const normalizedEmail = email.toLowerCase().trim();
    const normalizedUsername = devpostUsername.trim();
    const normalizedFullName = fullName.trim();
    const normalizedProjectName = projectName.trim();
    const normalizedProjectLink = projectLink.trim();

    // Check for existing participant by email
    const emailSnapshot = await db.collection("participants")
      .where("email", "==", normalizedEmail)
      .limit(1)
      .get();

    let existingParticipant = null;
    let existingDoc = null;

    if (!emailSnapshot.empty) {
      existingDoc = emailSnapshot.docs[0];
      existingParticipant = existingDoc.data();
    } else {
      // If not found by email, check by username
      const usernameSnapshot = await db.collection("participants")
        .where("devpostUsername", "==", normalizedUsername)
        .limit(1)
        .get();

      if (!usernameSnapshot.empty) {
        existingDoc = usernameSnapshot.docs[0];
        existingParticipant = existingDoc.data();
      }
    }

    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // 3️⃣ HANDLE EXISTING PARTICIPANT - CHECK IF INFO MATCHES
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

    if (existingParticipant) {
      // Check if all participant info matches
      const infoMatches = 
        existingParticipant.fullName === normalizedFullName &&
        existingParticipant.email === normalizedEmail &&
        existingParticipant.devpostUsername === normalizedUsername &&
        existingParticipant.projectName === normalizedProjectName &&
        existingParticipant.projectLink === normalizedProjectLink;

      if (infoMatches) {
        // ✅ INFO MATCHES - RETURN EXISTING TOKEN
        console.log(`🔄 Returning participant detected: ${normalizedEmail}`);

        // If participant was previously pending but now meets criteria, upgrade to approved
        const validations = {
          projectNameValid: normalizedProjectName.length > 3,
          devpostLinkValid: normalizedProjectLink.toLowerCase().includes("devpost.com"),
          agreementValid: agreement === true
        };

        const allValidationsPassed = Object.values(validations).every(v => v === true);

        // If currently pending but now meets all criteria, upgrade to approved
        if (existingParticipant.status === "pending" && allValidationsPassed) {
          let token = existingParticipant.token;
          
          // Generate token if doesn't exist
          if (!token) {
            token = generateToken();
            while (await tokenExists(token)) {
              token = generateToken();
            }
          }

          // Upgrade to approved
          await existingDoc.ref.update({
            status: "approved",
            autoApproved: true,
            token: token,
            validationResults: validations,
            updatedAt: admin.firestore.FieldValue.serverTimestamp()
          });

          console.log(`⬆️ Upgraded to approved: ${normalizedEmail}`);

          return {
            success: true,
            participantId: existingDoc.id,
            status: "approved",
            autoApproved: true,
            token: token,
            message: "Welcome back! Your registration has been approved."
          };
        }

        // Return existing participant status and token
        const response = {
          success: true,
          participantId: existingDoc.id,
          status: existingParticipant.status,
          autoApproved: existingParticipant.autoApproved,
          message: existingParticipant.status === "approved" 
            ? "Welcome back! You can use your existing token to download your certificate."
            : "Your registration is still pending review."
        };

        if (existingParticipant.token) {
          response.token = existingParticipant.token;
        }

        return response;
      } else {
        // ⚠️ INFO DOESN'T MATCH - MARK AS PENDING FOR REVIEW
        console.log(`⚠️ Info mismatch for ${normalizedEmail} - marking as pending`);

        // Update existing participant to pending status
        await existingDoc.ref.update({
          status: "pending",
          autoApproved: false,
          // Store the new information for review
          pendingUpdate: {
            fullName: normalizedFullName,
            projectName: normalizedProjectName,
            projectLink: normalizedProjectLink,
            submittedAt: admin.firestore.FieldValue.serverTimestamp()
          },
          updatedAt: admin.firestore.FieldValue.serverTimestamp()
        });

        return {
          success: true,
          participantId: existingDoc.id,
          status: "pending",
          autoApproved: false,
          message: "Your participant information has changed. An admin will review your update soon.",
          validationResults: {
            infoMismatch: true,
            message: "Project or personal information doesn't match existing record"
          }
        };
      }
    }

    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // 4️⃣ NEW PARTICIPANT - AUTO-APPROVAL VALIDATION LOGIC
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

    const validations = {
      projectNameValid: normalizedProjectName.length > 3,
      devpostLinkValid: normalizedProjectLink.toLowerCase().includes("devpost.com"),
      agreementValid: agreement === true
    };

    // Determine approval status
    const allValidationsPassed = Object.values(validations).every(v => v === true);
    const status = allValidationsPassed ? "approved" : "pending";
    const autoApproved = allValidationsPassed;

    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // 5️⃣ GENERATE UNIQUE TOKEN (ONLY FOR APPROVED)
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

    let token = null;

    if (autoApproved) {
      token = generateToken();
      // Ensure token is globally unique
      while (await tokenExists(token)) {
        token = generateToken();
      }
    }

    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // 6️⃣ SAVE TO FIRESTORE
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

    const participantData = {
      fullName: normalizedFullName,
      email: normalizedEmail,
      devpostUsername: normalizedUsername,
      projectName: normalizedProjectName,
      projectLink: normalizedProjectLink,
      status,
      autoApproved,
      token,
      award: null,
      certificateGenerated: false,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      // Store validation results for admin review
      validationResults: validations
    };

    const docRef = await db.collection("participants").add(participantData);

    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // 7️⃣ RETURN RESPONSE
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

    const response = {
      success: true,
      participantId: docRef.id,
      status,
      autoApproved
    };

    // Only include token if approved
    if (token) {
      response.token = token;
    }

    // Include validation details for pending registrations
    if (!autoApproved) {
      response.validationResults = validations;
      response.message = "Your registration is pending review. An admin will approve it soon.";
    }

    console.log(`✅ Registration ${autoApproved ? "approved" : "pending"}: ${normalizedEmail}`);
    return response;

  } catch (error) {
    console.error("❌ Error in submitRegistration:", error);
    
    // Re-throw HttpsError instances
    if (error instanceof functions.https.HttpsError) {
      throw error;
    }
    
    // Wrap unknown errors
    throw new functions.https.HttpsError(
      "internal",
      "An error occurred during registration. Please try again."
    );
  }
});
