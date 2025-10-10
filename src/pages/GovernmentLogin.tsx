import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { HomeNavbar } from "@/components/layout/HomeNavbar";
import { FooterSection } from "@/components/home/FooterSection";
import CustomScrollbar from "@/components/ui/CustomScrollbar";
import { Building2, Lock, User, ArrowRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function GovernmentLogin() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      if (formData.username === "government" && formData.password === "gov123") {
        toast({
          title: "Login Successful",
          description: "Welcome to the Government Portal",
        });
        navigate("/government-dashboard");
      } else {
        toast({
          title: "Login Failed",
          description: "Invalid credentials. Try government/gov123",
          variant: "destructive",
        });
      }
      setIsLoading(false);
    }, 1000);
  };

  return (
    <CustomScrollbar>
      <div className="bg-gradient-to-br from-gray-900 via-black to-gray-900 min-h-screen">
        <HomeNavbar />

        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-70 flex items-center justify-center">
          <img
            src="/lines.png"
            alt="Grid lines"
            className="w-3/4 h-3/4 object-contain"
          />
        </div>

        {/* Main Content */}
        <div className="relative z-10 max-w-md mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-600 rounded-2xl mb-4 shadow-lg">
              <Building2 className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-4xl font-bold text-white mb-2">Government Portal</h2>
            <p className="text-white/70">Analytics & Policy Management</p>
          </div>

          <Card className="bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl text-center text-white">Sign In</CardTitle>
              <CardDescription className="text-center text-white/60">
                Enter your government credentials to access analytics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="username" className="text-white">Username</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/40" />
                    <Input
                      id="username"
                      type="text"
                      placeholder="Enter government username"
                      value={formData.username}
                      onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                      className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/40 focus:border-purple-500"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-white">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/40" />
                    <Input
                      id="password"
                      type="password"
                      placeholder="Enter password"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/40 focus:border-purple-500"
                      required
                    />
                  </div>
                </div>

                <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3 text-sm text-white/70">
                  <p className="font-medium mb-1">Test Credentials:</p>
                  <p>Username: <span className="text-white font-mono">government</span></p>
                  <p>Password: <span className="text-white font-mono">gov123</span></p>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-lg"
                  disabled={isLoading}
                >
                  {isLoading ? "Signing in..." : "Sign In"}
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>

                <Button
                  type="button"
                  variant="ghost"
                  className="w-full text-white/70 hover:text-white hover:bg-white/10"
                  onClick={() => navigate("/role-selection")}
                >
                  Back to Role Selection
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        <FooterSection />
      </div>
    </CustomScrollbar>
  );
}

