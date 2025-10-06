import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Bell, 
  Search, 
  Filter,
  CheckCircle,
  AlertTriangle,
  Info,
  Clock,
  User,
  FileText,
  DollarSign,
  Settings
} from "lucide-react";

export default function InsurerNotifications() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");

  // Mock notifications data
  const notifications = [
    {
      id: 1,
      type: "risk_assessment",
      title: "New Risk Assessment Submitted",
      message: "Risk assessment RISK-001 for farmer FMR-0247 (Jean Baptiste) has been submitted and requires review.",
      priority: "high",
      status: "unread",
      timestamp: "2024-10-05 14:30",
      farmerId: "FMR-0247",
      farmerName: "Jean Baptiste",
      assessorId: "ASS-001",
      assessorName: "Richard Nkurunziza"
    },
    {
      id: 2,
      type: "claim_submitted",
      title: "New Claim Filed",
      message: "Claim CLM-002 for policy POL-001 has been filed by farmer FMR-0248 (Marie Uwimana) for drought damage.",
      priority: "medium",
      status: "unread",
      timestamp: "2024-10-05 12:15",
      farmerId: "FMR-0248",
      farmerName: "Marie Uwimana",
      claimId: "CLM-002",
      claimAmount: 150000
    },
    {
      id: 3,
      type: "payment_due",
      title: "Premium Payment Due",
      message: "Premium payment of 15,000 RWF is due for policy POL-001 (Farmer: Jean Baptiste).",
      priority: "low",
      status: "read",
      timestamp: "2024-10-04 09:00",
      farmerId: "FMR-0247",
      farmerName: "Jean Baptiste",
      policyId: "POL-001",
      amount: 15000
    },
    {
      id: 4,
      type: "assessment_completed",
      title: "Assessment Completed",
      message: "Risk assessment RISK-002 has been completed by assessor Grace Mukamana for farmer FMR-0249.",
      priority: "medium",
      status: "read",
      timestamp: "2024-10-04 16:45",
      farmerId: "FMR-0249",
      farmerName: "Paul Kagame",
      assessorId: "ASS-002",
      assessorName: "Grace Mukamana"
    },
    {
      id: 5,
      type: "system_alert",
      title: "System Maintenance Scheduled",
      message: "Scheduled system maintenance will occur on October 7th, 2024 from 2:00 AM to 4:00 AM.",
      priority: "low",
      status: "read",
      timestamp: "2024-10-03 10:30"
    }
  ];

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "risk_assessment": return <FileText className="h-5 w-5" />;
      case "claim_submitted": return <AlertTriangle className="h-5 w-5" />;
      case "payment_due": return <DollarSign className="h-5 w-5" />;
      case "assessment_completed": return <CheckCircle className="h-5 w-5" />;
      case "system_alert": return <Settings className="h-5 w-5" />;
      default: return <Info className="h-5 w-5" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "bg-red-100 text-red-800";
      case "medium": return "bg-yellow-100 text-yellow-800";
      case "low": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "risk_assessment": return "bg-blue-100 text-blue-800";
      case "claim_submitted": return "bg-orange-100 text-orange-800";
      case "payment_due": return "bg-purple-100 text-purple-800";
      case "assessment_completed": return "bg-green-100 text-green-800";
      case "system_alert": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const filteredNotifications = notifications.filter(notification => {
    const matchesSearch = notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         notification.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         notification.farmerName?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = filterType === "all" || notification.type === filterType;
    const matchesStatus = filterStatus === "all" || notification.status === filterStatus;
    
    return matchesSearch && matchesType && matchesStatus;
  });

  const unreadCount = notifications.filter(n => n.status === "unread").length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Notifications</h2>
          <p className="text-gray-600">Stay updated with system activities and alerts</p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="bg-blue-50 text-blue-700">
            {unreadCount} unread
          </Badge>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search notifications..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="risk_assessment">Risk Assessment</SelectItem>
                  <SelectItem value="claim_submitted">Claim Submitted</SelectItem>
                  <SelectItem value="payment_due">Payment Due</SelectItem>
                  <SelectItem value="assessment_completed">Assessment Completed</SelectItem>
                  <SelectItem value="system_alert">System Alert</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="unread">Unread</SelectItem>
                  <SelectItem value="read">Read</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notifications List */}
      <div className="space-y-4">
        {filteredNotifications.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No notifications found</h3>
              <p className="text-gray-600">Try adjusting your search or filter criteria.</p>
            </CardContent>
          </Card>
        ) : (
          filteredNotifications.map((notification) => (
            <Card key={notification.id} className={`transition-all duration-200 hover:shadow-md ${
              notification.status === "unread" ? "border-l-4 border-l-blue-500 bg-blue-50/30" : ""
            }`}>
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    notification.status === "unread" ? "bg-blue-100 text-blue-600" : "bg-gray-100 text-gray-600"
                  }`}>
                    {getNotificationIcon(notification.type)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg font-medium text-gray-900">
                        {notification.title}
                      </h3>
                      <div className="flex items-center space-x-2">
                        <Badge className={getPriorityColor(notification.priority)}>
                          {notification.priority}
                        </Badge>
                        <Badge className={getTypeColor(notification.type)}>
                          {notification.type.replace('_', ' ')}
                        </Badge>
                      </div>
                    </div>
                    
                    <p className="text-gray-600 mb-3">
                      {notification.message}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          {notification.timestamp}
                        </div>
                        {notification.farmerName && (
                          <div className="flex items-center">
                            <User className="h-4 w-4 mr-1" />
                            {notification.farmerName} ({notification.farmerId})
                          </div>
                        )}
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        {notification.status === "unread" && (
                          <Button size="sm" variant="outline">
                            Mark as Read
                          </Button>
                        )}
                        <Button size="sm" variant="outline">
                          View Details
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Notification Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Settings className="h-5 w-5 mr-2" />
            Notification Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-3">
              <h4 className="font-medium text-gray-900">Email Notifications</h4>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input type="checkbox" defaultChecked className="mr-2" />
                  <span className="text-sm text-gray-600">Risk assessment submissions</span>
                </label>
                <label className="flex items-center">
                  <input type="checkbox" defaultChecked className="mr-2" />
                  <span className="text-sm text-gray-600">New claim filings</span>
                </label>
                <label className="flex items-center">
                  <input type="checkbox" defaultChecked className="mr-2" />
                  <span className="text-sm text-gray-600">Payment due reminders</span>
                </label>
                <label className="flex items-center">
                  <input type="checkbox" className="mr-2" />
                  <span className="text-sm text-gray-600">System maintenance alerts</span>
                </label>
              </div>
            </div>
            
            <div className="space-y-3">
              <h4 className="font-medium text-gray-900">Push Notifications</h4>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input type="checkbox" defaultChecked className="mr-2" />
                  <span className="text-sm text-gray-600">High priority alerts</span>
                </label>
                <label className="flex items-center">
                  <input type="checkbox" className="mr-2" />
                  <span className="text-sm text-gray-600">Medium priority alerts</span>
                </label>
                <label className="flex items-center">
                  <input type="checkbox" className="mr-2" />
                  <span className="text-sm text-gray-600">Low priority alerts</span>
                </label>
              </div>
            </div>
          </div>
          
          <div className="pt-4 border-t">
            <Button className="bg-blue-600 hover:bg-blue-700">
              Save Settings
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
