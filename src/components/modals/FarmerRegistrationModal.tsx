import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { 
  User, 
  LogIn,
  UserPlus,
  Eye,
  EyeOff
} from "lucide-react";
import { farmerLogin } from "@/services/authAPI";
import { useToast } from "@/hooks/use-toast";

interface FarmerRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function FarmerRegistrationModal({ isOpen, onClose }: FarmerRegistrationModalProps) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [formData, setFormData] = useState({
    phoneNumber: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError(""); // Clear error when user types
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      if (isLoginMode) {
        // Login mode
        if (!formData.phoneNumber || !formData.password) {
          setError("Please enter both phone number and password.");
          setIsLoading(false);
          return;
        }

        // Call the farmer login API
        await farmerLogin(formData.phoneNumber, formData.password);
        
        // Show success message
        toast({
          title: "Login successful",
          description: "Welcome back! Redirecting to your dashboard...",
        });

        // Close modal and navigate to farmer dashboard
        onClose();
        navigate('/farmer-dashboard');
      } else {
        // Registration mode
        if (!formData.phoneNumber || !formData.email || !formData.password || !formData.confirmPassword) {
          setError("Please fill in all fields.");
          setIsLoading(false);
          return;
        }

        if (formData.password !== formData.confirmPassword) {
          setError("Passwords do not match.");
          setIsLoading(false);
          return;
        }

        if (formData.password.length < 6) {
          setError("Password must be at least 6 characters long.");
          setIsLoading(false);
          return;
        }

        // TODO: Call farmer registration API when available
        // For now, redirect to registration page
        toast({
          title: "Registration",
          description: "Redirecting to complete registration...",
        });
        onClose();
        navigate('/farmer-register');
      }
    } catch (err: any) {
      console.error('Form error:', err);
      const errorMessage = err.message || (isLoginMode 
        ? "Invalid credentials. Please check your phone number and password."
        : "Registration failed. Please try again.");
      setError(errorMessage);
      toast({
        title: isLoginMode ? "Login failed" : "Registration failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-white/5 backdrop-blur-xl border border-white/10">
        <DialogHeader>
          <div className="text-center mb-4">
            <DialogTitle className="text-2xl font-bold text-white">
              {isLoginMode ? "Farmer Login" : "Create Account"}
            </DialogTitle>
            <DialogDescription className="text-white/70">
              {isLoginMode ? "Access your farmer dashboard" : "Sign up to get started"}
            </DialogDescription>
          </div>
        </DialogHeader>

        <Card className="bg-transparent border-0 shadow-none">
          <CardContent className="pt-6">
            <div className="flex gap-2 mb-6">
              <Button
                type="button"
                variant={isLoginMode ? "default" : "ghost"}
                onClick={() => {
                  setIsLoginMode(true);
                  setError("");
                  setFormData({
                    phoneNumber: "",
                    email: "",
                    password: "",
                    confirmPassword: ""
                  });
                }}
                className={`flex-1 ${isLoginMode 
                  ? "bg-white/20 hover:bg-white/30 text-white" 
                  : "bg-white/5 hover:bg-white/10 text-white/70"}`}
              >
                <LogIn className="h-4 w-4 mr-2" />
                Login
              </Button>
              <Button
                type="button"
                variant={!isLoginMode ? "default" : "ghost"}
                onClick={() => {
                  setIsLoginMode(false);
                  setError("");
                  setFormData({
                    phoneNumber: "",
                    email: "",
                    password: "",
                    confirmPassword: ""
                  });
                }}
                className={`flex-1 ${!isLoginMode 
                  ? "bg-white/20 hover:bg-white/30 text-white" 
                  : "bg-white/5 hover:bg-white/10 text-white/70"}`}
              >
                <UserPlus className="h-4 w-4 mr-2" />
                Sign Up
              </Button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="phoneNumber" className="text-white">Phone Number</Label>
                <Input
                  id="phoneNumber"
                  type="tel"
                  value={formData.phoneNumber}
                  onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                  placeholder="Enter your phone number (e.g., 0781234567)"
                  required
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/50 backdrop-blur-sm"
                />
              </div>

              {!isLoginMode && (
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-white">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="your.email@example.com"
                    required
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/50 backdrop-blur-sm"
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="password" className="text-white">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    placeholder={isLoginMode ? "Enter your password" : "Create a password"}
                    required
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/50 backdrop-blur-sm"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-white/50" />
                    ) : (
                      <Eye className="h-4 w-4 text-white/50" />
                    )}
                  </Button>
                </div>
              </div>

              {!isLoginMode && (
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-white">Confirm Password</Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      value={formData.confirmPassword}
                      onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                      placeholder="Confirm your password"
                      required
                      className="bg-white/10 border-white/20 text-white placeholder:text-white/50 backdrop-blur-sm"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4 text-white/50" />
                      ) : (
                        <Eye className="h-4 w-4 text-white/50" />
                      )}
                    </Button>
                  </div>
                </div>
              )}

              <Button
                type="submit"
                className="w-full bg-white/10 hover:bg-white/20 border border-white/20 text-white backdrop-blur-sm"
                disabled={isLoading}
              >
                {isLoading ? (
                  isLoginMode ? "Signing In..." : "Creating Account..."
                ) : (
                  <>
                    {isLoginMode ? (
                      <>
                        <LogIn className="h-4 w-4 mr-2" />
                        Sign In
                      </>
                    ) : (
                      <>
                        <UserPlus className="h-4 w-4 mr-2" />
                        Create Account
                      </>
                    )}
                  </>
                )}
              </Button>
            </form>

            <div className="mt-6 text-center">
              {isLoginMode ? (
                <div className="text-sm text-white/70">
                  Don't have an account yet?{" "}
                  <button
                    onClick={() => setIsLoginMode(false)}
                    className="text-green-400 hover:text-green-300 font-medium"
                  >
                    Create Account
                  </button>
                </div>
              ) : (
                <div className="text-sm text-white/70">
                  Already have an account?{" "}
                  <button
                    onClick={() => setIsLoginMode(true)}
                    className="text-green-400 hover:text-green-300 font-medium"
                  >
                    Sign In
                  </button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
}
