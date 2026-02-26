import type { NextApiRequest, NextApiResponse } from "next";
import { initializeApp } from "firebase/app";
import { getFirestore, collection, query, where, getDocs, addDoc, doc, updateDoc, serverTimestamp } from "firebase/firestore";
import crypto from "crypto";

// Firebase config (use environment variables in production)
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

function generateToken(length = 10): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let token = "";
  const randomBytes = crypto.randomBytes(length);

  for (let i = 0; i < length; i++) {
    token += chars[randomBytes[i] % chars.length];
  }

  return token;
}

async function tokenExists(token: string): Promise<boolean> {
  const q = query(collection(db, "participants"), where("token", "==", token));
  const snapshot = await getDocs(q);
  return !snapshot.empty;
}

interface RegistrationRequest extends NextApiRequest {
  body: {
    fullName: string;
    email: string;
    devpostUsername: string;
    projectName: string;
    projectLink: string;
    agreement: boolean;
  };
}

interface RegistrationResponse {
  success: boolean;
  participantId?: string;
  status?: "approved" | "pending";
  autoApproved?: boolean;
  token?: string;
  message?: string;
  validationResults?: Record<string, any>;
  error?: string;
}

export default async function handler(
  req: RegistrationRequest,
  res: NextApiResponse<RegistrationResponse>
) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, error: "Method not allowed" });
  }

  try {
    const {
      fullName,
      email,
      devpostUsername,
      projectName,
      projectLink,
      agreement,
    } = req.body;

    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // 1️⃣ VALIDATE REQUIRED FIELDS
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

    if (!fullName || !email || !devpostUsername || !projectName || !projectLink) {
      return res.status(400).json({
        success: false,
        error: "All fields are required: fullName, email, devpostUsername, projectName, projectLink",
      });
    }

    if (!agreement) {
      return res.status(400).json({
        success: false,
        error: "You must agree to the terms and conditions",
      });
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
    const emailQuery = query(
      collection(db, "participants"),
      where("email", "==", normalizedEmail)
    );
    const emailSnapshot = await getDocs(emailQuery);

    let existingParticipant: any = null;
    let existingDocId: string | null = null;

    if (!emailSnapshot.empty) {
      const doc = emailSnapshot.docs[0];
      existingDocId = doc.id;
      existingParticipant = doc.data();
    } else {
      // If not found by email, check by username
      const usernameQuery = query(
        collection(db, "participants"),
        where("devpostUsername", "==", normalizedUsername)
      );
      const usernameSnapshot = await getDocs(usernameQuery);

      if (!usernameSnapshot.empty) {
        const doc = usernameSnapshot.docs[0];
        existingDocId = doc.id;
        existingParticipant = doc.data();
      }
    }

    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // 3️⃣ HANDLE EXISTING PARTICIPANT - CHECK IF INFO MATCHES
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

    if (existingParticipant && existingDocId) {
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

        const validations = {
          projectNameValid: normalizedProjectName.length > 3,
          devpostLinkValid: normalizedProjectLink.toLowerCase().includes("devpost.com"),
          agreementValid: agreement === true,
        };

        const allValidationsPassed = Object.values(validations).every((v) => v === true);

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
          const docRef = doc(db, "participants", existingDocId);
          await updateDoc(docRef, {
            status: "approved",
            autoApproved: true,
            token: token,
            validationResults: validations,
            updatedAt: serverTimestamp(),
          });

          console.log(`⬆️ Upgraded to approved: ${normalizedEmail}`);

          return res.status(200).json({
            success: true,
            participantId: existingDocId,
            status: "approved",
            autoApproved: true,
            token: token,
            message: "Welcome back! Your registration has been approved.",
          });
        }

        // Return existing participant status and token
        const response: RegistrationResponse = {
          success: true,
          participantId: existingDocId,
          status: existingParticipant.status,
          autoApproved: existingParticipant.autoApproved,
          message:
            existingParticipant.status === "approved"
              ? "Welcome back! You can use your existing token to download your certificate."
              : "Your registration is still pending review.",
        };

        if (existingParticipant.token) {
          response.token = existingParticipant.token;
        }

        return res.status(200).json(response);
      } else {
        // ⚠️ INFO DOESN'T MATCH - MARK AS PENDING FOR REVIEW
        console.log(`⚠️ Info mismatch for ${normalizedEmail} - marking as pending`);

        const docRef = doc(db, "participants", existingDocId);
        await updateDoc(docRef, {
          status: "pending",
          autoApproved: false,
          pendingUpdate: {
            fullName: normalizedFullName,
            projectName: normalizedProjectName,
            projectLink: normalizedProjectLink,
            submittedAt: serverTimestamp(),
          },
          updatedAt: serverTimestamp(),
        });

        return res.status(200).json({
          success: true,
          participantId: existingDocId,
          status: "pending",
          autoApproved: false,
          message:
            "Your participant information has changed. An admin will review your update soon.",
          validationResults: {
            infoMismatch: true,
            message: "Project or personal information doesn't match existing record",
          },
        });
      }
    }

    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // 4️⃣ NEW PARTICIPANT - AUTO-APPROVAL VALIDATION LOGIC
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

    const validations = {
      projectNameValid: normalizedProjectName.length > 3,
      devpostLinkValid: normalizedProjectLink.toLowerCase().includes("devpost.com"),
      agreementValid: agreement === true,
    };

    const allValidationsPassed = Object.values(validations).every((v) => v === true);
    const status = allValidationsPassed ? "approved" : "pending";
    const autoApproved = allValidationsPassed;

    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // 5️⃣ GENERATE UNIQUE TOKEN (ONLY FOR APPROVED)
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

    let token = null;

    if (autoApproved) {
      token = generateToken();
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
      createdAt: serverTimestamp(),
      validationResults: validations,
    };

    const docRef = await addDoc(collection(db, "participants"), participantData);

    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // 7️⃣ RETURN RESPONSE
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

    const response: RegistrationResponse = {
      success: true,
      participantId: docRef.id,
      status,
      autoApproved,
    };

    if (token) {
      response.token = token;
    }

    if (!autoApproved) {
      response.validationResults = validations;
      response.message =
        "Your registration is pending review. An admin will approve it soon.";
    }

    console.log(`✅ Registration ${autoApproved ? "approved" : "pending"}: ${normalizedEmail}`);
    return res.status(200).json(response);
  } catch (error) {
    console.error("❌ Error in submitRegistration:", error);
    return res.status(500).json({
      success: false,
      error: "An error occurred during registration. Please try again.",
    });
  }
}
