import React, { createContext, useContext, useState, ReactNode } from "react";

interface Property {
  id: number;
  name: string;
  tokenCount: number;
}

interface User {
  id: string;  // Added this line
  email: string;
  isKYC: boolean;
  ownedProperties: Property[];
  accumulatedRent: number;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => void;
  logout: () => void;
  startKYC: () => void;
  addPropertyTokens: (propertyId: number, propertyName: string, tokenCount: number) => void;
  addRentIncome: (amount: number) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const login = (email: string, password: string) => {
    // Generate a random ID for demo purposes
    const id = Math.random().toString(36).substr(2, 9);
    setUser({ id, email, isKYC: false, ownedProperties: [], accumulatedRent: 0 });
  };

  const logout = () => {
    setUser(null);
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

  const addRentIncome = (amount: number) => {
    if (user) {
      setUser({ ...user, accumulatedRent: (user.accumulatedRent || 0) + amount });
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, startKYC, addPropertyTokens, addRentIncome }}>
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