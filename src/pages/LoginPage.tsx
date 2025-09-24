import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Wheat,
  Building2,
  BarChart3,
  MapPin,
  Settings,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight
} from "lucide-react";

interface LoginPageProps {
  role: string;
}

export const LoginPage = ({ role }: LoginPageProps) => {
  const navigate = useNavigate();
  const { login, register } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [registerData, setRegisterData] = useState({
    name: "",
    phone: "",
    company: "",
    position: "",
    farmName: "",
    location: "",
    farmSize: ""
  });

  const roleConfig = {
    farmer: {
      title: "Farmer Portal",
      icon: Wheat,
      color: "bg-green-500",
      description: "Access your farm management dashboard",
      canRegister: true,
      registerFields: ["name", "phone", "farmName", "location", "farmSize"]
    },
    insurer: {
      title: "Insurer Dashboard",
      icon: Building2,
      color: "bg-blue-500",
      description: "Manage insurance policies and claims",
      canRegister: true,
      registerFields: ["name", "phone", "company", "position"]
    },
    government: {
      title: "Government Analytics",
      icon: BarChart3,
      color: "bg-red-500",
      description: "National agricultural insights and monitoring",
      canRegister: false,
      registerFields: []
    },
    assessor: {
      title: "Assessor Portal",
      icon: MapPin,
      color: "bg-orange-500",
      description: "Conduct farm assessments and evaluations",
      canRegister: true,
      registerFields: ["name", "phone", "company", "position"]
    },
    admin: {
      title: "Admin Panel",
      icon: Settings,
      color: "bg-gray-500",
      description: "System administration and management",
      canRegister: false,
      registerFields: []
    }
  };

  const config = roleConfig[role as keyof typeof roleConfig];
  const Icon = config.icon;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    
    try {
      const success = await login(email, password, role);
      
      if (success) {
        // Navigate to dashboard
        if (role === "farmer") {
          navigate("/farmer-dashboard");
        } else if (role === "insurer") {
          navigate("/insurer-dashboard");
        } else if (role === "government") {
          navigate("/government-dashboard");
        } else if (role === "assessor") {
          navigate("/assessor-dashboard");
        } else if (role === "admin") {
          navigate("/admin-dashboard");
        }
      } else {
        setError('Login failed. Please check your credentials.');
      }
    } catch (error) {
      setError('Network error. Please check if the server is running.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    
    try {
      const userData = {
        email,
        password,
        role,
        name: registerData.name,
        profile: {
          phone: registerData.phone,
          company: registerData.company,
          position: registerData.position,
          farmName: registerData.farmName,
          location: registerData.location,
          farmSize: registerData.farmSize ? parseFloat(registerData.farmSize) : undefined
        }
      };

      const success = await register(userData);
      
      if (success) {
        // Navigate to dashboard
        if (role === "farmer") {
          navigate("/farmer-dashboard");
        } else if (role === "insurer") {
          navigate("/insurer-dashboard");
        } else if (role === "assessor") {
          navigate("/assessor-dashboard");
        }
      } else {
        setError('Registration failed. Please try again.');
      }
    } catch (error) {
      setError('Network error. Please check if the server is running.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Role-specific header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${config.color} text-white`}>
              <Icon className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl font-medium text-gray-900">{config.title}</h1>
              <p className="text-sm text-gray-500 font-light">{config.description}</p>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {/* Login/Register Form */}
        <Card className="bg-white shadow-lg border border-gray-100">
          <CardContent className="p-8">
            {/* Toggle between Login and Register */}
            {config.canRegister && (
              <div className="flex mb-6 bg-gray-100 rounded-lg p-1">
                <button
                  type="button"
                  onClick={() => setIsRegisterMode(false)}
                  className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                    !isRegisterMode 
                      ? 'bg-white text-gray-900 shadow-sm' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => setIsRegisterMode(true)}
                  className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                    isRegisterMode 
                      ? 'bg-white text-gray-900 shadow-sm' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Create Account
                </button>
              </div>
            )}

            <form onSubmit={isRegisterMode ? handleRegister : handleLogin} className="space-y-6">
              <div className="space-y-4">
                {/* Registration Fields */}
                {isRegisterMode && (
                  <>
                    <div>
                      <Label htmlFor="name" className="text-sm font-medium text-gray-700">
                        Full Name
                      </Label>
                      <Input
                        id="name"
                        type="text"
                        value={registerData.name}
                        onChange={(e) => setRegisterData({...registerData, name: e.target.value})}
                        placeholder="Enter your full name"
                        className="bg-gray-50 border-gray-200 focus:bg-white"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="phone" className="text-sm font-medium text-gray-700">
                        Phone Number
                      </Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={registerData.phone}
                        onChange={(e) => setRegisterData({...registerData, phone: e.target.value})}
                        placeholder="Enter your phone number"
                        className="bg-gray-50 border-gray-200 focus:bg-white"
                        required
                      />
                    </div>

                    {/* Role-specific fields */}
                    {role === "farmer" && (
                      <>
                        <div>
                          <Label htmlFor="farmName" className="text-sm font-medium text-gray-700">
                            Farm Name
                          </Label>
                          <Input
                            id="farmName"
                            type="text"
                            value={registerData.farmName}
                            onChange={(e) => setRegisterData({...registerData, farmName: e.target.value})}
                            placeholder="Enter your farm name"
                            className="bg-gray-50 border-gray-200 focus:bg-white"
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="location" className="text-sm font-medium text-gray-700">
                            Location
                          </Label>
                          <Input
                            id="location"
                            type="text"
                            value={registerData.location}
                            onChange={(e) => setRegisterData({...registerData, location: e.target.value})}
                            placeholder="Enter your location"
                            className="bg-gray-50 border-gray-200 focus:bg-white"
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="farmSize" className="text-sm font-medium text-gray-700">
                            Farm Size (hectares)
                          </Label>
                          <Input
                            id="farmSize"
                            type="number"
                            step="0.1"
                            value={registerData.farmSize}
                            onChange={(e) => setRegisterData({...registerData, farmSize: e.target.value})}
                            placeholder="Enter farm size in hectares"
                            className="bg-gray-50 border-gray-200 focus:bg-white"
                            required
                          />
                        </div>
                      </>
                    )}

                    {(role === "insurer" || role === "assessor") && (
                      <>
                        <div>
                          <Label htmlFor="company" className="text-sm font-medium text-gray-700">
                            Company/Organization
                          </Label>
                          <Input
                            id="company"
                            type="text"
                            value={registerData.company}
                            onChange={(e) => setRegisterData({...registerData, company: e.target.value})}
                            placeholder="Enter your company name"
                            className="bg-gray-50 border-gray-200 focus:bg-white"
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="position" className="text-sm font-medium text-gray-700">
                            Position/Title
                          </Label>
                          <Input
                            id="position"
                            type="text"
                            value={registerData.position}
                            onChange={(e) => setRegisterData({...registerData, position: e.target.value})}
                            placeholder="Enter your position"
                            className="bg-gray-50 border-gray-200 focus:bg-white"
                            required
                          />
                        </div>
                      </>
                    )}
                  </>
                )}

                {/* Email and Password Fields */}
                <div>
                  <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                    Email Address
                  </Label>
                  <div className="relative mt-1">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      className="pl-10 bg-gray-50 border-gray-200 focus:bg-white"
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                    Password
                  </Label>
                  <div className="relative mt-1">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      className="pl-10 pr-10 bg-gray-50 border-gray-200 focus:bg-white"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
              </div>

              {!isRegisterMode && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                      id="remember"
                      type="checkbox"
                      className="h-4 w-4 text-gray-900 focus:ring-gray-900 border-gray-300 rounded"
                    />
                    <Label htmlFor="remember" className="ml-2 text-sm text-gray-600">
                      Remember me
                    </Label>
                  </div>
                  <button
                    type="button"
                    className="text-sm text-gray-600 hover:text-gray-900 font-medium"
                  >
                    Forgot password?
                  </button>
                </div>
              )}

              <Button
                type="submit"
                className={`w-full rounded-full py-3 font-medium ${config.color} hover:opacity-90 text-white`}
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    {isRegisterMode ? "Creating Account..." : "Signing in..."}
                  </div>
                ) : (
                  isRegisterMode ? "Create Account" : "Sign In"
                )}
              </Button>
            </form>

            {!config.canRegister && (
              <div className="mt-6 text-center">
                <p className="text-sm text-gray-500">
                  Government access is provided by system administrators.{" "}
                  <button className="text-gray-900 hover:text-gray-700 font-medium">
                    Contact administrator
                  </button>
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Back to Home */}
        <div className="text-center mt-6">
          <button
            onClick={() => navigate("/")}
            className="text-sm text-gray-500 hover:text-gray-700 font-medium flex items-center gap-2 mx-auto"
          >
            <ArrowRight className="h-4 w-4 rotate-180" />
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};
