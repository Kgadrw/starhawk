import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  MapPin, 
  ArrowLeft, 
  LogIn,
  Eye,
  EyeOff
} from "lucide-react";

export default function AssessorLogin() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    assessorId: "",
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

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Mock validation
    if (formData.assessorId && formData.password) {
      navigate('/assessor-dashboard');
    } else {
      setError("Invalid credentials. Please check your Assessor ID and password.");
    }
    
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <MapPin className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Assessor Login</h1>
          <p className="text-gray-600">Access your assessment dashboard</p>
        </div>

        <Card className="shadow-xl">
          <CardHeader>
            <CardTitle className="text-center text-xl">Welcome Back</CardTitle>
            <p className="text-center text-gray-600 text-sm">
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
                <Label htmlFor="assessorId">Assessor ID</Label>
                <Input
                  id="assessorId"
                  value={formData.assessorId}
                  onChange={(e) => handleInputChange('assessorId', e.target.value)}
                  placeholder="Enter your Assessor ID (e.g., ASS-001)"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    placeholder="Enter your password"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </Button>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-orange-600 hover:bg-orange-700"
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
              <Link to="/role-selection" className="flex items-center justify-center text-gray-600 hover:text-gray-900">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Role Selection
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Info Section */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            Assessor accounts are created by system administrators.
            <br />
            Contact admin at{" "}
            <a href="mailto:admin@cropinsurance.rw" className="text-orange-600 hover:text-orange-700">
              admin@cropinsurance.rw
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
