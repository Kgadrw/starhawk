
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function NotificationsPage() {
  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
        <p className="text-gray-600">System alerts and notifications</p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Notifications Dashboard</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">Notifications features coming soon...</p>
        </CardContent>
      </Card>
    </div>
  );
}
