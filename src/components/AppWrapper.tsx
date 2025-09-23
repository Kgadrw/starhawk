import { ReactNode } from "react";
import { AuthProvider } from "@/contexts/AuthContext";

interface AppWrapperProps {
  children: ReactNode;
}

export function AppWrapper({ children }: AppWrapperProps) {
  console.log('AppWrapper is rendering');
  return (
    <AuthProvider>
      {children}
    </AuthProvider>
  );
}
