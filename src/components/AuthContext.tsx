import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

type UserRole = "admin" | "farmer";

interface User {
  username: string;
  password: string;
  role: UserRole;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  register: (username: string, password: string, role: UserRole) => Promise<boolean>;
  selectRole: (role: UserRole) => void;
  switchRole: (role: UserRole) => void;
  users: User[];
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_KEY = "auth_user";
const USERS_KEY = "auth_users";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(AUTH_KEY);
    if (stored) setUser(JSON.parse(stored));
    const storedUsers = localStorage.getItem(USERS_KEY);
    if (storedUsers) setUsers(JSON.parse(storedUsers));
    else {
      // Default users
      const defaultUsers = [
        { username: "farmer", password: "farmer", role: "farmer" },
      ];
      setUsers(defaultUsers);
      localStorage.setItem(USERS_KEY, JSON.stringify(defaultUsers));
    }
  }, []);

  const login = async (username: string, password: string) => {
    const found = users.find(u => u.username === username && u.password === password);
    if (found) {
      setUser(found);
      localStorage.setItem(AUTH_KEY, JSON.stringify(found));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(AUTH_KEY);
  };

  const register = async (username: string, password: string, role: UserRole) => {
    if (users.find(u => u.username === username)) return false;
    const newUser = { username, password, role };
    const updated = [...users, newUser];
    setUsers(updated);
    localStorage.setItem(USERS_KEY, JSON.stringify(updated));
    setUser(newUser);
    localStorage.setItem(AUTH_KEY, JSON.stringify(newUser));
    return true;
  };

  const selectRole = (role: UserRole) => {
    if (user) {
      const updatedUser = { ...user, role };
      setUser(updatedUser);
      localStorage.setItem(AUTH_KEY, JSON.stringify(updatedUser));
    }
  };

  const switchRole = selectRole;

  return (
    <AuthContext.Provider value={{ isAuthenticated: !!user, user, login, logout, register, selectRole, switchRole, users }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
} 