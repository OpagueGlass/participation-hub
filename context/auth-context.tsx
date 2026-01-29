"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { AuthError, Session } from "@supabase/supabase-js";
import { isUserResearcher } from "@/lib/query";

interface AuthContextType {
  session: Session | null;
  isLoading: boolean;
  signUp: (password: string) => Promise<AuthError | null>;
  signIn: (email: string, password: string) => Promise<AuthError | null>;
  signOut: () => Promise<AuthError | null>;
  isResearcher: boolean;
  loadIsResearcher: (userId: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isResearcher, setIsResearcher] = useState<boolean>(false);

  const loadIsResearcher = async (userId: string) => {
    const userIsResearcher = await isUserResearcher(userId);
    setIsResearcher(userIsResearcher);
    return userIsResearcher;
  };

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      // Checks for an existing session on initial load
      setSession(session);
      if (session?.user) {
        await loadIsResearcher(session.user.id);
      }
      setIsLoading(false);
    });

    // Listens for changes to auth state
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session);
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (password: string) => {
    setIsLoading(true);
    const { error } = await supabase.auth.updateUser({
      password,
      data: {
        hasPassword: true,
      },
    });
    setIsLoading(false);
    return error;
  };

  const signIn = async (email: string, password: string) => {
    setIsLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setIsLoading(false);
    return error;
  };

  const signOut = async () => {
    setIsLoading(true);
    const { error } = await supabase.auth.signOut();
    setIsResearcher(false);
    setIsLoading(false);
    return error;
  };

  const value = {
    session,
    isLoading,
    isResearcher,
    signUp,
    signIn,
    signOut,
    loadIsResearcher,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext<AuthContextType | null>(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
