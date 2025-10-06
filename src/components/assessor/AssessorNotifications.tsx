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
  MapPin,
  Settings,
  Phone,
  Mail,
  Calendar
} from "lucide-react";

export default function AssessorNotifications() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");

  // Mock notifications data for assessors
  const notifications = [
    {
      id: 1,
      type: "new_assignment",
      title: "New Assessment Assignment",
      message: "You have been assigned a new risk assessment for farmer FMR-0247 (Jean Baptiste) in Nyagatare District.",
      priority: "high",
      status: "unread",
      timestamp: "2024-10-05 14:30",
      farmerId: "FMR-0247",
      farmerName: "Jean Baptiste",
      location: "Nyagatare District",
      dueDate: "2024-10-08",
      assessmentType: "risk_assessment"
    },
    {
      id: 2,
      type: "assessment_reminder",
      title: "Assessment Due Soon",
      message: "Risk assessment for farmer FMR-0248 (Marie Uwimana) is due in 2 days. Please complete your field visit.",
      priority: "medium",
      status: "unread",
      timestamp: "2024-10-05 10:15",
      farmerId: "FMR-0248",
      farmerName: "Marie Uwimana",
      location: "Gatsibo District",
      dueDate: "2024-10-07",
      assessmentType: "risk_assessment"
    },
    {
      id: 3,
      type: "claim_assignment",
      title: "New Claim Assessment",
      message: "You have been assigned to assess claim CLM-002 for farmer FMR-0249 (Paul Kagame) regarding drought damage.",
      priority: "high",
      status: "read",
      timestamp: "2024-10-04 16:45",
      farmerId: "FMR-0249",
      farmerName: "Paul Kagame",
      location: "Musanze District",
      claimId: "CLM-002",
      assessmentType: "loss_assessment"
    },
    {
      id: 4,
      type: "assessment_approved",
      title: "Assessment Approved",
      message: "Your risk assessment for farmer FMR-0250 (Grace Mukamana) has been approved by the insurer.",
      priority: "low",
      status: "read",
      timestamp: "2024-10-04 12:20",
      farmerId: "FMR-0250",
      farmerName: "Grace Mukamana",
      location: "Huye District",
      assessmentId: "ASS-003",
      assessmentType: "risk_assessment"
    },
    {
      id: 5,
      type: "training_reminder",
      title: "Training Session Reminder",
      message: "Don't forget about the monthly assessor training session tomorrow at 2:00 PM.",
      priority: "medium",
      status: "read",
      timestamp: "2024-10-03 09:30",
      trainingDate: "2024-10-06",
      trainingTopic: "Advanced Field Assessment Techniques"
    },
    {
      id: 6,
      type: "equipment_update",
      title: "Equipment Maintenance Due",
      message: "Your GPS device and camera equipment are due for maintenance. Please schedule a service appointment.",
      priority: "low",
      status: "unread",
      timestamp: "2024-10-02 14:00",
      equipmentType: "GPS Device, Camera"
    }
  ];

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "new_assignment": return <FileText className="h-5 w-5" />;
      case "assessment_reminder": return <Clock className="h-5 w-5" />;
      case "claim_assignment": return <AlertTriangle className="h-5 w-5" />;
      case "assessment_approved": return <CheckCircle className="h-5 w-5" />;
      case "training_reminder": return <Calendar className="h-5 w-5" />;
      case "equipment_update": return <Settings className="h-5 w-5" />;
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
      case "new_assignment": return "bg-blue-100 text-blue-800";
      case "assessment_reminder": return "bg-orange-100 text-orange-800";
      case "claim_assignment": return "bg-red-100 text-red-800";
      case "assessment_approved": return "bg-green-100 text-green-800";
      case "training_reminder": return "bg-purple-100 text-purple-800";
      case "equipment_update": return "bg-gray-100 text-gray-800";
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
          <p className="text-gray-600">Stay updated with your assessment assignments and tasks</p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="bg-orange-50 text-orange-700">
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
                  <SelectItem value="new_assignment">New Assignment</SelectItem>
                  <SelectItem value="assessment_reminder">Assessment Reminder</SelectItem>
                  <SelectItem value="claim_assignment">Claim Assignment</SelectItem>
                  <SelectItem value="assessment_approved">Assessment Approved</SelectItem>
                  <SelectItem value="training_reminder">Training Reminder</SelectItem>
                  <SelectItem value="equipment_update">Equipment Update</SelectItem>
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
              notification.status === "unread" ? "border-l-4 border-l-orange-500 bg-orange-50/30" : ""
            }`}>
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    notification.status === "unread" ? "bg-orange-100 text-orange-600" : "bg-gray-100 text-gray-600"
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
                        {notification.location && (
                          <div className="flex items-center">
                            <MapPin className="h-4 w-4 mr-1" />
                            {notification.location}
                          </div>
                        )}
                        {notification.dueDate && (
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-1" />
                            Due: {notification.dueDate}
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
                        {notification.farmerName && (
                          <Button size="sm" variant="outline">
                            <Phone className="h-3 w-3 mr-1" />
                            Contact
                          </Button>
                        )}
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
              <h4 className="font-medium text-gray-900">Assignment Notifications</h4>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input type="checkbox" defaultChecked className="mr-2" />
                  <span className="text-sm text-gray-600">New assessment assignments</span>
                </label>
                <label className="flex items-center">
                  <input type="checkbox" defaultChecked className="mr-2" />
                  <span className="text-sm text-gray-600">Assessment due reminders</span>
                </label>
                <label className="flex items-center">
                  <input type="checkbox" defaultChecked className="mr-2" />
                  <span className="text-sm text-gray-600">Claim assessment assignments</span>
                </label>
                <label className="flex items-center">
                  <input type="checkbox" className="mr-2" />
                  <span className="text-sm text-gray-600">Assessment approval notifications</span>
                </label>
              </div>
            </div>
            
            <div className="space-y-3">
              <h4 className="font-medium text-gray-900">System Notifications</h4>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input type="checkbox" defaultChecked className="mr-2" />
                  <span className="text-sm text-gray-600">Training reminders</span>
                </label>
                <label className="flex items-center">
                  <input type="checkbox" className="mr-2" />
                  <span className="text-sm text-gray-600">Equipment maintenance alerts</span>
                </label>
                <label className="flex items-center">
                  <input type="checkbox" className="mr-2" />
                  <span className="text-sm text-gray-600">System updates</span>
                </label>
                <label className="flex items-center">
                  <input type="checkbox" defaultChecked className="mr-2" />
                  <span className="text-sm text-gray-600">Performance reports</span>
                </label>
              </div>
            </div>
          </div>
          
          <div className="pt-4 border-t">
            <Button className="bg-orange-600 hover:bg-orange-700">
              Save Settings
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
