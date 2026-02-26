import React, { createContext, useContext, useState, ReactNode } from "react";
import { Participant, mockParticipants } from "@/data/mockData";

interface AuthContextType {
  currentUser: Participant | null;
  login: (email: string, token: string) => boolean;
  logout: () => void;
  isAdmin: boolean;
  setIsAdmin: (v: boolean) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<Participant | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  const login = (email: string, token: string): boolean => {
    const user = mockParticipants.find(
      (p) => p.email.toLowerCase() === email.toLowerCase() && p.token === token
    );
    if (user) {
      setCurrentUser(user);
      return true;
    }
    return false;
  };

  const logout = () => {
    setCurrentUser(null);
    setIsAdmin(false);
  };

  return (
    <AuthContext.Provider value={{ currentUser, login, logout, isAdmin, setIsAdmin }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
