import type { NextApiRequest, NextApiResponse } from "next";
import { initializeApp } from "firebase/app";
import { getFirestore, collection, query, where, getDocs, doc, updateDoc, serverTimestamp } from "firebase/firestore";

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

interface CertificateRequest extends NextApiRequest {
  body: {
    participantName?: string;
    token: string;
  };
}

interface CertificateData {
  success: boolean;
  certificate?: {
    participantName: string;
    projectName: string;
    award: string;
    eventName: string;
    eventDate: string;
    issuer: string;
    token: string;
  };
  error?: string;
}

export default async function handler(
  req: CertificateRequest,
  res: NextApiResponse<CertificateData>
) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, error: "Method not allowed" });
  }

  try {
    const { participantName, token } = req.body;

    if (!token) {
      return res.status(400).json({
        success: false,
        error: "Token is required",
      });
    }

    const q = query(collection(db, "participants"), where("token", "==", token.toUpperCase()));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      return res.status(404).json({
        success: false,
        error: "Invalid token",
      });
    }

    const participantDoc = snapshot.docs[0];
    const participant = participantDoc.data();

    // Update certificate generation timestamp
    const docRef = doc(db, "participants", participantDoc.id);
    await updateDoc(docRef, {
      certificateGenerated: true,
      certificateGeneratedAt: serverTimestamp(),
      participantName: participantName || participant.devpostUsername,
    });

    return res.status(200).json({
      success: true,
      certificate: {
        participantName: participantName || participant.devpostUsername,
        projectName: participant.projectName,
        award: participant.award || "Participant",
        eventName: "Global Innovation Build Challenge V1",
        eventDate: "2026",
        issuer: "Kang Chiao International School Students",
        token: participant.token,
      },
    });
  } catch (error) {
    console.error("Error generating certificate:", error);
    return res.status(500).json({
      success: false,
      error: "Failed to generate certificate",
    });
  }
}
