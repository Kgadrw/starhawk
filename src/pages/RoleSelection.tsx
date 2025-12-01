import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { HomeNavbar } from "@/components/layout/HomeNavbar";
import { FooterSection } from "@/components/home/FooterSection";
import CustomScrollbar from "@/components/ui/CustomScrollbar";
import { motion } from "framer-motion";
import { 
  LogIn,
  Eye,
  EyeOff,
  UserPlus
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { farmerLogin, assessorLogin, insurerLogin, adminLogin } from "@/services/authAPI";

export default function RoleSelection() {
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
    setError("");
  };

  const getDashboardRoute = (role: string): string => {
    const roleMap: { [key: string]: string } = {
      'FARMER': '/farmer-dashboard',
      'ASSESSOR': '/assessor-dashboard',
      'INSURER': '/insurer-dashboard',
      'GOVERNMENT': '/government-dashboard',
      'ADMIN': '/admin-dashboard'
    };
    return roleMap[role.toUpperCase()] || '/role-selection';
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

        // Redirect to farmer registration for now
        toast({
          title: "Registration",
          description: "Redirecting to complete registration...",
        });
        navigate('/farmer-register');
        setIsLoading(false);
        return;
      }

      // Login mode - Try to authenticate and determine role
      // We'll try different login methods to find the correct role
      const loginMethods = [
        () => farmerLogin(formData.phoneNumber, formData.password),
        () => assessorLogin(formData.phoneNumber, formData.password),
        () => insurerLogin(formData.phoneNumber, formData.password),
        () => adminLogin(formData.phoneNumber, formData.password),
      ];

      let loginResponse = null;
      let lastError = null;

      // Try each login method until one succeeds
      for (const loginMethod of loginMethods) {
        try {
          loginResponse = await loginMethod();
          break; // Success, exit loop
        } catch (err: any) {
          lastError = err;
          // Continue to next method if this one fails
          continue;
        }
      }

      // Also try government login (if it exists)
      if (!loginResponse) {
        try {
          // Government login might use a different endpoint
          const response = await fetch('/api/v1/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
              phoneNumber: formData.phoneNumber, 
              password: formData.password 
            }),
          });
          const data = await response.json();
          if (response.ok && data.data?.role === 'GOVERNMENT') {
            loginResponse = data.data;
            localStorage.setItem('token', loginResponse.token);
            localStorage.setItem('role', loginResponse.role);
            localStorage.setItem('userId', loginResponse.userId || '');
            localStorage.setItem('phoneNumber', formData.phoneNumber);
          }
        } catch (err) {
          // Ignore government login error
        }
      }

      if (!loginResponse) {
        throw lastError || new Error("Invalid credentials. Please check your phone number and password.");
      }

      // Get the role from the response
      const role = loginResponse.role || localStorage.getItem('role');
      if (!role) {
        throw new Error("Unable to determine user role.");
      }

      // Navigate to the appropriate dashboard
      const dashboardRoute = getDashboardRoute(role);
      navigate(dashboardRoute);

      toast({
        title: "Login successful",
        description: `Welcome! Redirecting to ${role} dashboard...`,
      });
    } catch (err: any) {
      console.error('Login error:', err);
      const errorMessage = err.message || "Invalid credentials. Please check your phone number and password.";
      setError(errorMessage);
      toast({
        title: "Login failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <CustomScrollbar>
      <div className="bg-gradient-to-br from-gray-50 via-white to-gray-50 min-h-screen">
        {/* Navigation */}
        <HomeNavbar />

      {/* Grid Pattern Background */}
      <div className="absolute inset-0 opacity-70 flex items-center justify-center">
        <img
          src="/lines.png"
          alt="Grid lines"
          className="w-3/4 h-3/4 object-contain"
        />
      </div>
      
      {/* Bottom Corner Lines */}
      <div className="absolute bottom-0 left-0 opacity-60">
        <img
          src="/lines2.png"
          alt="Bottom left lines"
          className="w-[32rem] h-[32rem]"
        />
              </div>
      <div className="absolute bottom-0 right-0 opacity-60">
        <img
          src="/lines2.png"
          alt="Bottom right lines"
          className="w-[32rem] h-[32rem]"
        />
      </div>

      {/* Login Form */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4 pt-32">
        <div className="w-full max-w-md">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Card className="bg-white border border-gray-200 shadow-lg">
              <CardHeader>
                <div className="flex gap-2 mb-4">
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
                      ? "bg-green-600 hover:bg-green-700 text-white" 
                      : "bg-gray-100 hover:bg-gray-200 text-gray-700"}`}
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
                      ? "bg-green-600 hover:bg-green-700 text-white" 
                      : "bg-gray-100 hover:bg-gray-200 text-gray-700"}`}
                  >
                    <UserPlus className="h-4 w-4 mr-2" />
                    Sign Up
                  </Button>
                </div>
                <CardTitle className="text-center text-xl text-gray-900">
                  {isLoginMode ? "Welcome Back" : "Create Your Account"}
                </CardTitle>
                <p className="text-center text-gray-600 text-sm mt-2">
                  {isLoginMode 
                    ? "Enter your credentials to access your dashboard"
                    : "Fill in your details to create a new account"}
                </p>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  {error && (
                    <Alert variant="destructive">
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="phoneNumber" className="text-gray-700">Phone Number</Label>
                    <Input
                      id="phoneNumber"
                      type="tel"
                      value={formData.phoneNumber}
                      onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                      placeholder="Enter your phone number (e.g., 0781234567)"
                      required
                      className="bg-gray-50 border-gray-300 text-gray-900 placeholder:text-gray-500"
                    />
                  </div>

                  {!isLoginMode && (
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-gray-700">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        placeholder="your.email@example.com"
                        required
                        className="bg-gray-50 border-gray-300 text-gray-900 placeholder:text-gray-500"
                      />
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-gray-700">Password</Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        value={formData.password}
                        onChange={(e) => handleInputChange('password', e.target.value)}
                        placeholder={isLoginMode ? "Enter your password" : "Create a password"}
                        required
                        className="bg-gray-50 border-gray-300 text-gray-900 placeholder:text-gray-500"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4 text-gray-500" />
                        ) : (
                          <Eye className="h-4 w-4 text-gray-500" />
                        )}
                      </Button>
                      </div>
                    </div>

                  {!isLoginMode && (
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword" className="text-gray-700">Confirm Password</Label>
                      <div className="relative">
                        <Input
                          id="confirmPassword"
                          type={showConfirmPassword ? "text" : "password"}
                          value={formData.confirmPassword}
                          onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                          placeholder="Confirm your password"
                          required
                          className="bg-gray-50 border-gray-300 text-gray-900 placeholder:text-gray-500"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                          {showConfirmPassword ? (
                            <EyeOff className="h-4 w-4 text-gray-500" />
                          ) : (
                            <Eye className="h-4 w-4 text-gray-500" />
                          )}
                        </Button>
                            </div>
                        </div>
                  )}

                    <Button 
                    type="submit"
                    className="w-full bg-green-600 hover:bg-green-700 text-white"
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
                    <div className="text-sm text-gray-600">
                      Don't have an account yet?{" "}
                      <button
                        onClick={() => setIsLoginMode(false)}
                        className="text-green-600 hover:text-green-700 font-medium"
                      >
                        Create Account
                      </button>
                      </div>
                  ) : (
                    <div className="text-sm text-gray-600">
                      Already have an account?{" "}
                      <button
                        onClick={() => setIsLoginMode(true)}
                        className="text-green-600 hover:text-green-700 font-medium"
                      >
                        Sign In
                      </button>
                    </div>
                  )}
                </div>
                  </CardContent>
                </Card>
              </motion.div>
        </div>
              </div>

        {/* Footer */}
        <FooterSection />
            </div>
    </CustomScrollbar>
  );
}
