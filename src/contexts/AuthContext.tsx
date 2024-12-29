import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Session, User } from "@supabase/supabase-js";
import { toast } from "sonner";

interface Property {
  id: number;
  name: string;
  tokenCount: number;
}

interface AuthUser {
  id: string;
  email: string;
  isKYC: boolean;
  ownedProperties: Property[];
  accumulatedRent: number;
}

interface AuthContextType {
  user: AuthUser | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  startKYC: () => void;
  addPropertyTokens: (propertyId: number, propertyName: string, tokenCount: number) => void;
  addRentIncome: (amount: number) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    // Set up initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        handleSession(session);
      }
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        handleSession(session);
      } else {
        setUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSession = async (session: Session) => {
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', session.user.id)
      .single();

    setUser({
      id: session.user.id,
      email: session.user.email || '',
      isKYC: profile?.is_kyc || false,
      ownedProperties: [],
      accumulatedRent: 0
    });
  };

  const login = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
    } catch (error: any) {
      toast.error(error.message);
      throw error;
    }
  };

  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setUser(null);
    } catch (error: any) {
      toast.error(error.message);
      throw error;
    }
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