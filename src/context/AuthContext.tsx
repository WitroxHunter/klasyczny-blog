// AuthContext.tsx
"use client";

import { createContext, useContext, useState, useEffect } from "react";

interface AuthContextType {
  isLoggedIn: boolean;
  userData?: { id: string; name: string };
}

const AuthContext = createContext<AuthContextType>({ isLoggedIn: false });

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState<any>(null);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => {
        if (data.user) {
          setIsLoggedIn(true);
          setUserData(data.user);
        }
      });
  }, []);

  return (
    <AuthContext.Provider value={{ isLoggedIn, userData }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
