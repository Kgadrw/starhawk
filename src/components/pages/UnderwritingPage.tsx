
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function UnderwritingPage() {
  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Underwriting</h1>
        <p className="text-gray-600">Policy management and risk assessment</p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Underwriting Dashboard</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">Underwriting features coming soon...</p>
        </CardContent>
      </Card>
    </div>
  );
}
