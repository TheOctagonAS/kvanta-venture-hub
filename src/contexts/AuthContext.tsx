import React, { createContext, useContext, useState, ReactNode } from "react";

interface User {
  email: string;
  isKYC: boolean;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => void;
  startKYC: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const login = (email: string, password: string) => {
    // Mock login - in real app would validate credentials
    setUser({ email, isKYC: false });
  };

  const startKYC = () => {
    if (user) {
      // Mock KYC process - in real app would involve actual verification
      setUser({ ...user, isKYC: true });
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, startKYC }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}