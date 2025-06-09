
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Bell, AlertTriangle, Info, CheckCircle, X } from "lucide-react";

const notifications = [
  {
    id: 1,
    type: "alert",
    title: "High Risk Weather Alert",
    message: "Severe flooding expected in Kiambu region. 15 policies affected.",
    time: "2 minutes ago",
    read: false,
    priority: "high"
  },
  {
    id: 2,
    type: "claim",
    title: "New Claim Submitted",
    message: "Claim #CLM-2024-089 has been submitted by John Mwangi for drought damage.",
    time: "1 hour ago",
    read: false,
    priority: "medium"
  },
  {
    id: 3,
    type: "system",
    title: "System Maintenance Scheduled",
    message: "Scheduled maintenance on January 20th from 2:00 AM to 4:00 AM.",
    time: "3 hours ago",
    read: true,
    priority: "low"
  },
  {
    id: 4,
    type: "approval",
    title: "Claim Approved",
    message: "Claim #CLM-2024-078 has been approved and payment processed.",
    time: "5 hours ago",
    read: true,
    priority: "medium"
  },
  {
    id: 5,
    type: "alert",
    title: "Pest Outbreak Warning",
    message: "Locust swarm detected in Eastern Province. Immediate action required.",
    time: "1 day ago",
    read: false,
    priority: "high"
  }
];

const getNotificationIcon = (type: string) => {
  switch (type) {
    case "alert":
      return <AlertTriangle className="w-5 h-5 text-red-500" />;
    case "claim":
      return <Bell className="w-5 h-5 text-blue-500" />;
    case "system":
      return <Info className="w-5 h-5 text-gray-500" />;
    case "approval":
      return <CheckCircle className="w-5 h-5 text-green-500" />;
    default:
      return <Bell className="w-5 h-5 text-blue-500" />;
  }
};

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case "high":
      return "text-red-600";
    case "medium":
      return "text-yellow-600";
    case "low":
      return "text-green-600";
    default:
      return "text-gray-600";
  }
};

export function NotificationsPage() {
  return (
    <div className="flex-1 h-full overflow-auto bg-background">
      <div className="p-4 md:p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">Notifications</h1>
            <p className="text-muted-foreground">Stay updated with system alerts and notifications</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">Mark All Read</Button>
            <Button variant="outline" size="sm">Clear All</Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Unread</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">3</div>
              <p className="text-xs text-red-600">Requires attention</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">High Priority</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">2</div>
              <p className="text-xs text-orange-600">Urgent action needed</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Today</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">12</div>
              <p className="text-xs text-green-600">+3 from yesterday</p>
            </CardContent>
          </Card>
        </div>

        {/* Notifications List */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Notifications</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-border">
              {notifications.map((notification) => (
                <div 
                  key={notification.id} 
                  className={`p-4 hover:bg-muted/50 transition-colors ${
                    !notification.read ? 'bg-accent/20' : ''
                  }`}
                >
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 mt-1">
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <h3 className={`text-sm font-medium ${!notification.read ? 'text-foreground' : 'text-muted-foreground'}`}>
                              {notification.title}
                            </h3>
                            {!notification.read && (
                              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            )}
                            <Badge 
                              variant="outline" 
                              className={`text-xs ${getPriorityColor(notification.priority)}`}
                            >
                              {notification.priority}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">
                            {notification.message}
                          </p>
                          <p className="text-xs text-muted-foreground mt-2">
                            {notification.time}
                          </p>
                        </div>
                        <div className="flex space-x-1 ml-4">
                          <Button variant="ghost" size="sm">
                            <CheckCircle className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
