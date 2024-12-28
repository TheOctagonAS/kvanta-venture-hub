import React, { createContext, useContext, useState, ReactNode } from "react";

interface Property {
  id: number;
  name: string;
  tokenCount: number;
}

interface User {
  email: string;
  isKYC: boolean;
  ownedProperties: Property[];
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => void;
  startKYC: () => void;
  addPropertyTokens: (propertyId: number, propertyName: string, tokenCount: number) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const login = (email: string, password: string) => {
    setUser({ email, isKYC: false, ownedProperties: [] });
  };

  const startKYC = () => {
    if (user) {
      setUser({ ...user, isKYC: true });
    }
  };

  const addPropertyTokens = (propertyId: number, propertyName: string, tokenCount: number) => {
    if (user) {
      const existingPropertyIndex = user.ownedProperties.findIndex(
        (p) => p.id === propertyId
      );

      const updatedProperties = [...user.ownedProperties];
      if (existingPropertyIndex >= 0) {
        updatedProperties[existingPropertyIndex].tokenCount += tokenCount;
      } else {
        updatedProperties.push({ id: propertyId, name: propertyName, tokenCount });
      }

      setUser({ ...user, ownedProperties: updatedProperties });
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, startKYC, addPropertyTokens }}>
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