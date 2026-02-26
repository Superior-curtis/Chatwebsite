import type { NextApiRequest, NextApiResponse } from "next";
import { initializeApp } from "firebase/app";
import { getFirestore, collection, query, where, getDocs } from "firebase/firestore";

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

interface VerifyTokenRequest extends NextApiRequest {
  method: string;
  body?: {
    email?: string;
    devpostUsername?: string;
    projectName?: string;
    token?: string;
  };
  query?: {
    email?: string;
    devpostUsername?: string;
    projectName?: string;
    token?: string;
  };
}

interface TokenResponse {
  valid?: boolean;
  error?: string;
  participant?: {
    id: string;
    email: string;
    devpostUsername: string;
    projectName: string;
    award: string | null;
    verifiedAt: string;
  };
}

export default async function handler(
  req: VerifyTokenRequest,
  res: NextApiResponse<TokenResponse>
) {
  if (req.method !== "POST" && req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed", valid: false });
  }

  try {
    const data = req.method === "POST" ? req.body : req.query;
    const { email, devpostUsername, projectName, token } = data;

    if (!token) {
      return res.status(400).json({
        valid: false,
        error: "Token is required",
      });
    }

    const q = query(collection(db, "participants"), where("token", "==", (token as string).toUpperCase()));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      return res.status(404).json({
        valid: false,
        error: "Invalid token",
      });
    }

    const participantDoc = snapshot.docs[0];
    const participant = participantDoc.data();

    const emailMatch =
      !email ||
      participant.email.toLowerCase() === (email as string).toLowerCase();
    const usernameMatch =
      !devpostUsername ||
      participant.devpostUsername === devpostUsername;
    const projectMatch =
      !projectName ||
      participant.projectName === projectName;

    if (!emailMatch || !usernameMatch || !projectMatch) {
      return res.json({
        valid: false,
        error: "Token does not match participant information",
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
        verifiedAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error("Error verifying token:", error);
    return res.status(500).json({
      valid: false,
      error: "Internal server error",
    });
  }
}
