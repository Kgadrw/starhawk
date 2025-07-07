import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

type UserRole = "admin" | "farmer";

interface AuthContextType {
  isAuthenticated: boolean;
  user: { username: string; role: UserRole } | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  switchRole: (role: UserRole) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_KEY = "auth_user";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<{ username: string; role: UserRole } | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem(AUTH_KEY);
    if (stored) setUser(JSON.parse(stored));
  }, []);

  const login = async (username: string, password: string) => {
    if ((username === "admin" && password === "admin") || (username === "farmer" && password === "farmer")) {
      const role = username === "admin" ? "admin" : "farmer";
      const userObj = { username, role };
      setUser(userObj);
      localStorage.setItem(AUTH_KEY, JSON.stringify(userObj));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(AUTH_KEY);
  };

  const switchRole = (role: UserRole) => {
    if (user) {
      const newUser = { ...user, role };
      setUser(newUser);
      localStorage.setItem(AUTH_KEY, JSON.stringify(newUser));
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated: !!user, user, login, logout, switchRole }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
} 