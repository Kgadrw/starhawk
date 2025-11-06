import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { HomeNavbar } from "@/components/layout/HomeNavbar";
import { FooterSection } from "@/components/home/FooterSection";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { assessorLogin } from "@/services/authAPI";
import { 
  MapPin, 
  ArrowLeft, 
  LogIn,
  Eye,
  EyeOff,
  Phone
} from "lucide-react";

export default function AssessorLogin() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    phoneNumber: "",
    password: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const data = await assessorLogin(formData.phoneNumber, formData.password);
      toast({
        title: "Login Successful",
        description: `Welcome Assessor ${data.email || data.phoneNumber}`,
      });
      navigate('/assessor-dashboard');
    } catch (err: any) {
      console.error("Login error:", err);
      const errorMessage = err.message || "Invalid credentials. Please check your phone number and password.";
      setError(errorMessage);
      toast({
        title: "Login Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-gray-900 via-black to-gray-900 min-h-screen">
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
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <MapPin className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Assessor Login</h1>
            <p className="text-white/70">Access your assessment dashboard</p>
          </div>

          <Card className="bg-white/5 backdrop-blur-xl border border-white/10 shadow-xl">
          <CardHeader>
            <CardTitle className="text-center text-xl text-white">Welcome Back</CardTitle>
            <p className="text-center text-white/70 text-sm">
              Enter your credentials to access your assessment tasks
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
                <Label htmlFor="phoneNumber" className="text-white flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  Phone Number
                </Label>
                <Input
                  id="phoneNumber"
                  type="tel"
                  value={formData.phoneNumber}
                  onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                  placeholder="Enter your phone number (e.g., 0721234567)"
                  required
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/50 backdrop-blur-sm"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-white">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    placeholder="Enter your password"
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

              <Button
                type="submit"
                className="w-full bg-white/10 hover:bg-white/20 border border-white/20 text-white backdrop-blur-sm"
                disabled={isLoading}
              >
                {isLoading ? (
                  "Signing In..."
                ) : (
                  <>
                    <LogIn className="h-4 w-4 mr-2" />
                    Sign In
                  </>
                )}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <Link to="/role-selection" className="flex items-center justify-center text-white/70 hover:text-white">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Role Selection
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Info Section */}
        <div className="mt-6 text-center">
          <p className="text-sm text-white/50">
            Assessor accounts are created by system administrators.
            <br />
            Contact admin at{" "}
            <a href="mailto:admin@cropinsurance.rw" className="text-green-400 hover:text-green-300">
              admin@cropinsurance.rw
            </a>
          </p>
        </div>
        </div>
      </div>

      {/* Footer */}
      <FooterSection />
    </div>
  );
}
