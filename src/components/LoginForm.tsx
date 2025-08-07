/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Leaf, Loader2, Eye, EyeOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface LoginFormProps {
  onLogin: (token: string, user: any) => void;
}

export function LoginForm({ onLogin }: LoginFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      console.log("Attempting login with:", { email, password: "***" });
      
      // For development/testing purposes, allow a mock login
      if (email === "test@example.com" && password === "password") {
        const mockUser = {
          id: "1",
          name: "Test User",
          email: email,
          role: "admin"
        };
        const mockToken = "mock-jwt-token-" + Date.now();
        
        onLogin(mockToken, mockUser);
        toast({
          title: "Login Successful (Mock)",
          description: `Welcome back, ${mockUser.name}!`,
        });
        return;
      }
      
      const response = await fetch(
        "https://nexus-agri-backend.onrender.com/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        }
      );

      console.log("Response status:", response.status);
      console.log("Response headers:", response.headers);

      if (!response.ok) {
        const errorData = await response.text();
        console.error("Login error response:", errorData);
        
        let errorMessage = "Invalid email or password";
        try {
          const errorJson = JSON.parse(errorData);
          errorMessage = errorJson.detail || errorJson.message || errorMessage;
        } catch (e) {
          // If parsing fails, use the raw text
          errorMessage = errorData || errorMessage;
        }
        
        throw new Error(errorMessage);
      }

      const data = await response.json();
      console.log("Login response data:", data);

      // Handle different response formats
      let accessToken = data.access_token || data.token || data.accessToken;
      let userData = data.user || data.user_data || data;

      if (!accessToken) {
        throw new Error("No access token received from server");
      }

      if (!userData) {
        // If no user data, create a basic user object
        userData = {
          id: data.id || "unknown",
          name: data.name || email.split("@")[0],
          email: email,
          role: data.role || "user"
        };
      }

      onLogin(accessToken, userData);

      toast({
        title: "Login Successful",
        description: `Welcome back, ${userData.name || email}!`,
      });
    } catch (error: any) {
      console.error("Login error:", error);
      toast({
        title: "Login Failed",
        description: error.message || "An error occurred during login.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-surface p-4 sm:p-6">
      <div className="w-full max-w-md">
        <Card className="shadow-strong border-0 bg-white/95 backdrop-blur-sm">
          <CardHeader className="text-center space-y-4 px-4 sm:px-6">
            <div className="mx-auto w-12 h-12 sm:w-16 sm:h-16 bg-primary rounded-full flex items-center justify-center">
              <Leaf className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
            </div>
            <div>
              <CardTitle className="text-xl sm:text-2xl font-bold text-agri-primary">
                STARHAWK
              </CardTitle>
              <CardDescription className="text-muted-foreground text-sm sm:text-base">
                Advanced Crop Assessment & Risk Analysis
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="px-4 sm:px-6">
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm sm:text-base">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="h-10 sm:h-11 text-sm sm:text-base"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm sm:text-base">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="h-10 sm:h-11 pr-10 text-sm sm:text-base"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
              <Button
                type="submit"
                className="w-full h-10 sm:h-11 hover:opacity-90 transition-opacity text-sm sm:text-base"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  "Sign In"
                )}
              </Button>
              
              {/* Development hint */}
              <div className="text-center text-xs text-gray-500 mt-4">
                <p>For testing: use test@example.com / password</p>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
