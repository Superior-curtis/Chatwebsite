export interface Participant {
  id: string;
  name: string;
  email: string;
  devpostUsername: string;
  projectName: string;
  projectDescription: string;
  category: "AI" | "Innovation" | "Web3" | "Health" | "Education" | "Sustainability";
  award?: "Grand Prize" | "1st Place" | "2nd Place" | "3rd Place" | "Finalist" | "Honorable Mention";
  token: string;
  tokenUsed: boolean;
  imageUrl: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  team: string;
  category: string;
  award?: string;
  imageUrl: string;
  tags: string[];
}

export const mockParticipants: Participant[] = [
  { id: "1", name: "Alex Chen", email: "alex@example.com", devpostUsername: "alexchen", projectName: "NeuralFlow AI", projectDescription: "AI-powered workflow automation platform", category: "AI", award: "Grand Prize", token: "GIB-2026-001", tokenUsed: false, imageUrl: "" },
  { id: "2", name: "Sarah Kim", email: "sarah@example.com", devpostUsername: "sarahkim", projectName: "EcoTrack", projectDescription: "Real-time carbon footprint tracker", category: "Sustainability", award: "1st Place", token: "GIB-2026-002", tokenUsed: false, imageUrl: "" },
  { id: "3", name: "Marcus Johnson", email: "marcus@example.com", devpostUsername: "marcusj", projectName: "MedAssist Pro", projectDescription: "AI health diagnostic assistant", category: "Health", award: "2nd Place", token: "GIB-2026-003", tokenUsed: false, imageUrl: "" },
  { id: "4", name: "Priya Patel", email: "priya@example.com", devpostUsername: "priyap", projectName: "LearnVerse", projectDescription: "Immersive VR learning platform", category: "Education", award: "3rd Place", token: "GIB-2026-004", tokenUsed: false, imageUrl: "" },
  { id: "5", name: "David Park", email: "david@example.com", devpostUsername: "davidpark", projectName: "ChainGuard", projectDescription: "Decentralized identity verification", category: "Web3", award: "Finalist", token: "GIB-2026-005", tokenUsed: false, imageUrl: "" },
  { id: "6", name: "Emma Liu", email: "emma@example.com", devpostUsername: "emmaliu", projectName: "SmartGrid AI", projectDescription: "Intelligent energy grid optimizer", category: "Innovation", award: "Finalist", token: "GIB-2026-006", tokenUsed: false, imageUrl: "" },
  { id: "7", name: "James Wilson", email: "james@example.com", devpostUsername: "jamesw", projectName: "DataVault", projectDescription: "Secure data sharing platform", category: "Web3", award: "Honorable Mention", token: "GIB-2026-007", tokenUsed: false, imageUrl: "" },
  { id: "8", name: "Aisha Rahman", email: "aisha@example.com", devpostUsername: "aishar", projectName: "CareConnect", projectDescription: "Telemedicine for rural areas", category: "Health", token: "GIB-2026-008", tokenUsed: false, imageUrl: "" },
  { id: "9", name: "Carlos Mendez", email: "carlos@example.com", devpostUsername: "carlosm", projectName: "GreenLens", projectDescription: "Plant disease detection via AI", category: "AI", token: "GIB-2026-009", tokenUsed: false, imageUrl: "" },
  { id: "10", name: "Yuki Tanaka", email: "yuki@example.com", devpostUsername: "yukit", projectName: "StudyBuddy", projectDescription: "AI-powered study group matcher", category: "Education", token: "GIB-2026-010", tokenUsed: false, imageUrl: "" },
];

export const mockProjects: Project[] = mockParticipants.map(p => ({
  id: p.id,
  name: p.projectName,
  description: p.projectDescription,
  team: p.name,
  category: p.category,
  award: p.award,
  imageUrl: p.imageUrl,
  tags: [p.category, ...(p.award ? ["Winner"] : [])],
}));

export const stats = {
  totalParticipants: 247,
  totalProjects: 89,
  totalWinners: 12,
  totalCountries: 34,
  certificatesIssued: 198,
};
