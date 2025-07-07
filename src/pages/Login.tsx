import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/components/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const Login = () => {
  const { login, register, user, selectRole } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"admin" | "farmer">("farmer");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isRegister, setIsRegister] = useState(false);
  const [roleSelect, setRoleSelect] = useState(false);

  React.useEffect(() => {
    if (user && !roleSelect) {
      setRoleSelect(true);
    }
  }, [user]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const success = await login(username, password);
    setLoading(false);
    if (success) {
      setRoleSelect(true);
    } else {
      setError("Invalid credentials");
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const success = await register(username, password, role);
    setLoading(false);
    if (success) {
      setRoleSelect(true);
    } else {
      setError("Username already exists");
    }
  };

  const handleRoleSelect = (selectedRole: "admin" | "farmer") => {
    selectRole(selectedRole);
    setRoleSelect(false);
    navigate("/");
  };

  if (roleSelect && user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Select Your Role</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Button className="w-full" onClick={() => handleRoleSelect("admin")}>Admin Dashboard</Button>
              <Button className="w-full" onClick={() => handleRoleSelect("farmer")}>Farmer Dashboard</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>{isRegister ? "Create Account" : "Login"}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={isRegister ? handleRegister : handleLogin} className="space-y-4">
            <Input
              placeholder="Username"
              value={username}
              onChange={e => setUsername(e.target.value)}
              autoFocus
              required
            />
            <Input
              placeholder="Password"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
            {isRegister && (
              <div className="flex gap-2">
                <Button type="button" variant={role === "farmer" ? "default" : "outline"} onClick={() => setRole("farmer")}>Farmer</Button>
                <Button type="button" variant={role === "admin" ? "default" : "outline"} onClick={() => setRole("admin")}>Admin</Button>
              </div>
            )}
            {error && <div className="text-red-600 text-sm">{error}</div>}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (isRegister ? "Creating..." : "Logging in...") : isRegister ? "Create Account" : "Login"}
            </Button>
          </form>
          <div className="mt-4 text-center">
            <Button variant="link" type="button" onClick={() => setIsRegister(r => !r)}>
              {isRegister ? "Already have an account? Login" : "Create an account"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login; 