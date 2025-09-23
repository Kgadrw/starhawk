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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Leaf, User, Building2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { User as UserType } from "@/contexts/AuthContext";

export function LoginForm() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<string>("");
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simple validation
    if (!email || !role) {
      toast({
        title: "Missing Information",
        description: "Please enter email and select a role",
        variant: "destructive",
      });
      return;
    }
    
    // Create user and login immediately
    const user: UserType = {
      id: "1",
      name: email.split("@")[0],
      email: email,
      role: (role as any) || "farmer"
    };
    
    console.log("Logging in user:", user);
    login(user);
    console.log("Login function called, user should be set");
    toast({
      title: "Login Successful!",
      description: `Welcome, ${user.name}!`,
    });
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
                <Label htmlFor="role" className="text-sm sm:text-base">Role</Label>
                <Select value={role} onValueChange={setRole} required>
                  <SelectTrigger className="h-10 sm:h-11 text-sm sm:text-base">
                    <SelectValue placeholder="Select your role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="farmer">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        Farmer
                      </div>
                    </SelectItem>
                    <SelectItem value="insurer">
                      <div className="flex items-center gap-2">
                        <Building2 className="h-4 w-4" />
                        Insurer
                      </div>
                    </SelectItem>
                    <SelectItem value="surveyor">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        Surveyor
                      </div>
                    </SelectItem>
                    <SelectItem value="underwriter">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        Underwriter
                      </div>
                    </SelectItem>
                    <SelectItem value="government">
                      <div className="flex items-center gap-2">
                        <Building2 className="h-4 w-4" />
                        Government
                      </div>
                    </SelectItem>
                    <SelectItem value="admin">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        Admin
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button
                type="submit"
                className="w-full h-10 sm:h-11 hover:opacity-90 transition-opacity text-sm sm:text-base"
              >
                Sign In
              </Button>
              
              {/* Development hint */}
              <div className="text-center text-xs text-gray-500 mt-4">
                <p><strong>Super Easy Login:</strong> Just enter any email and select a role!</p>
                <p>Example: test@example.com</p>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
