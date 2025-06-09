
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function ProfilePage() {
  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
        <p className="text-gray-600">User profile and account settings</p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Profile Dashboard</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">Profile features coming soon...</p>
        </CardContent>
      </Card>
    </div>
  );
}
