import { useAuth } from "@/contexts/AuthContext";

export function TestAuth() {
  console.log('TestAuth component is rendering');
  const auth = useAuth();
  console.log('Auth context:', auth);
  return <div>Auth test: {auth ? 'Working' : 'Not working'}</div>;
}
