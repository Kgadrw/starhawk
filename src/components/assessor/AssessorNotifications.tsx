import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { dashboardTheme } from "@/utils/dashboardTheme";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
  Calendar,
  X
} from "lucide-react";

export default function AssessorNotifications() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedNotification, setSelectedNotification] = useState<any>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

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
      case "high": return "bg-red-400/20 text-red-400";
      case "medium": return "bg-yellow-400/20 text-yellow-400";
      case "low": return "bg-green-400/20 text-green-400";
      default: return "bg-gray-400/20 text-gray-400";
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "new_assignment": return "bg-blue-100 text-blue-800";
      case "assessment_reminder": return "bg-orange-100 text-orange-800";
      case "claim_assignment": return "bg-red-100 text-red-800";
      case "assessment_approved": return "bg-green-100 text-green-800";
      case "training_reminder": return "bg-purple-100 text-purple-800";
      case "equipment_update": return "bg-gray-800/20 text-white";
      default: return "bg-gray-800/20 text-white";
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

  const handleNotificationClick = (notification: any) => {
    setSelectedNotification(notification);
    setIsDetailOpen(true);
  };

  const handleMarkAsRead = (e: React.MouseEvent, notificationId: number) => {
    e.stopPropagation();
    // Handle mark as read logic here
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Notifications</h2>
          <p className="text-white/80">Stay updated with your assessment assignments and tasks</p>
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
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/60" />
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
              <Bell className="h-12 w-12 text-white/60 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-white mb-2">No notifications found</h3>
              <p className="text-white/70">Try adjusting your search or filter criteria.</p>
            </CardContent>
          </Card>
        ) : (
          filteredNotifications.map((notification) => (
            <Card 
              key={notification.id} 
              className={`${dashboardTheme.card} transition-all duration-200 cursor-pointer hover:bg-white/5 ${
                notification.status === "unread" ? "border-l-4 border-l-green-500 bg-green-600/30" : ""
              }`}
              onClick={() => handleNotificationClick(notification)}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className={`flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center ${
                    notification.status === "unread" ? "bg-green-400/20 text-green-400" : "bg-gray-800/20 text-gray-400"
                  }`}>
                    {getNotificationIcon(notification.type)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h3 className="text-base font-semibold text-white leading-tight">
                        {notification.title}
                      </h3>
                      <Badge className={`${getPriorityColor(notification.priority)} text-xs`}>
                        {notification.priority}
                      </Badge>
                    </div>
                    
                    <p className="text-sm text-white/70 mb-3 line-clamp-2">
                      {notification.message}
                    </p>
                    
                    <div className="flex items-center gap-4 text-xs text-white/60">
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {notification.timestamp}
                      </div>
                      {notification.farmerName && (
                        <div className="flex items-center gap-1">
                          <User className="h-3 w-3" />
                          {notification.farmerName}
                        </div>
                      )}
                      {notification.location && (
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {notification.location}
                        </div>
                      )}
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
              <h4 className="font-medium text-white">Assignment Notifications</h4>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input type="checkbox" defaultChecked className="mr-2" />
                  <span className="text-sm text-white/80">New assessment assignments</span>
                </label>
                <label className="flex items-center">
                  <input type="checkbox" defaultChecked className="mr-2" />
                  <span className="text-sm text-white/80">Assessment due reminders</span>
                </label>
                <label className="flex items-center">
                  <input type="checkbox" defaultChecked className="mr-2" />
                  <span className="text-sm text-white/70">Claim assessment assignments</span>
                </label>
                <label className="flex items-center">
                  <input type="checkbox" className="mr-2" />
                  <span className="text-sm text-white/70">Assessment approval notifications</span>
                </label>
              </div>
            </div>
            
            <div className="space-y-3">
              <h4 className="font-medium text-white">System Notifications</h4>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input type="checkbox" defaultChecked className="mr-2" />
                  <span className="text-sm text-white/70">Training reminders</span>
                </label>
                <label className="flex items-center">
                  <input type="checkbox" className="mr-2" />
                  <span className="text-sm text-white/70">Equipment maintenance alerts</span>
                </label>
                <label className="flex items-center">
                  <input type="checkbox" className="mr-2" />
                  <span className="text-sm text-white/70">System updates</span>
                </label>
                <label className="flex items-center">
                  <input type="checkbox" defaultChecked className="mr-2" />
                  <span className="text-sm text-white/70">Performance reports</span>
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

      {/* Notification Detail Dialog */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-white/5 backdrop-blur-xl border border-white/10">
          {selectedNotification && (
            <>
              <DialogHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                      selectedNotification.status === "unread" ? "bg-green-400/20 text-green-400" : "bg-blue-400/20 text-blue-400"
                    }`}>
                      {getNotificationIcon(selectedNotification.type)}
                    </div>
                    <div>
                      <DialogTitle className="text-xl">{selectedNotification.title}</DialogTitle>
                      <DialogDescription className="text-sm text-gray-400 mt-1">
                        {selectedNotification.type.replace(/_/g, ' ')}
                      </DialogDescription>
                    </div>
                  </div>
                  <Badge className={getPriorityColor(selectedNotification.priority)}>
                    {selectedNotification.priority}
                  </Badge>
                </div>
              </DialogHeader>
              
              <div className="space-y-6 mt-4">
                <div>
                  <p className="text-gray-300 leading-relaxed">{selectedNotification.message}</p>
                </div>

                <div className="grid grid-cols-2 gap-4 p-4 bg-gray-900/50 rounded-lg">
                  <div>
                    <p className="text-xs text-gray-400 mb-1">Timestamp</p>
                    <div className="flex items-center gap-2 text-sm text-white">
                      <Clock className="h-4 w-4 text-gray-400" />
                      {selectedNotification.timestamp}
                    </div>
                  </div>
                  {selectedNotification.dueDate && (
                    <div>
                      <p className="text-xs text-gray-400 mb-1">Due Date</p>
                      <div className="flex items-center gap-2 text-sm text-white">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        {selectedNotification.dueDate}
                      </div>
                    </div>
                  )}
                </div>

                {selectedNotification.farmerName && (
                  <div className="p-4 bg-blue-900/20 border border-blue-700/30 rounded-lg">
                    <h4 className="text-sm font-semibold text-blue-300 mb-3 flex items-center gap-2">
                      <User className="h-4 w-4" />
                      Farmer Information
                    </h4>
                    <div className="space-y-2">
                      <div>
                        <p className="text-xs text-gray-400">Name</p>
                        <p className="text-sm text-white font-medium">{selectedNotification.farmerName}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400">Farmer ID</p>
                        <p className="text-sm text-white font-medium">{selectedNotification.farmerId}</p>
                      </div>
                      {selectedNotification.location && (
                        <div>
                          <p className="text-xs text-gray-400">Location</p>
                          <div className="flex items-center gap-2 text-sm text-white">
                            <MapPin className="h-3 w-3 text-gray-400" />
                            {selectedNotification.location}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {selectedNotification.claimId && (
                  <div className="p-4 bg-orange-900/20 border border-orange-700/30 rounded-lg">
                    <h4 className="text-sm font-semibold text-orange-300 mb-2">Claim Details</h4>
                    <div>
                      <p className="text-xs text-gray-400">Claim ID</p>
                      <p className="text-sm text-white font-medium">{selectedNotification.claimId}</p>
                    </div>
                  </div>
                )}

                {selectedNotification.assessmentId && (
                  <div className="p-4 bg-green-900/20 border border-green-700/30 rounded-lg">
                    <h4 className="text-sm font-semibold text-green-300 mb-2">Assessment Details</h4>
                    <div>
                      <p className="text-xs text-gray-400">Assessment ID</p>
                      <p className="text-sm text-white font-medium">{selectedNotification.assessmentId}</p>
                    </div>
                  </div>
                )}

                {selectedNotification.trainingDate && (
                  <div className="p-4 bg-purple-900/20 border border-purple-700/30 rounded-lg">
                    <h4 className="text-sm font-semibold text-purple-300 mb-2">Training Information</h4>
                    <div className="space-y-2">
                      <div>
                        <p className="text-xs text-gray-400">Date</p>
                        <p className="text-sm text-white font-medium">{selectedNotification.trainingDate}</p>
                      </div>
                      {selectedNotification.trainingTopic && (
                        <div>
                          <p className="text-xs text-gray-400">Topic</p>
                          <p className="text-sm text-white font-medium">{selectedNotification.trainingTopic}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {selectedNotification.equipmentType && (
                  <div className="p-4 bg-gray-900/50 border border-gray-700/30 rounded-lg">
                    <h4 className="text-sm font-semibold text-gray-300 mb-2">Equipment Details</h4>
                    <div>
                      <p className="text-xs text-gray-400">Equipment</p>
                      <p className="text-sm text-white font-medium">{selectedNotification.equipmentType}</p>
                    </div>
                  </div>
                )}

                <div className="flex gap-2 pt-4 border-t border-gray-700">
                  <Button 
                    className="flex-1 bg-orange-600 hover:bg-orange-700"
                    onClick={() => {
                      // Handle action based on notification type
                      setIsDetailOpen(false);
                    }}
                  >
                    Take Action
                  </Button>
                  {selectedNotification.status === "unread" && (
                    <Button 
                      variant="outline" 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleMarkAsRead(e, selectedNotification.id);
                        setIsDetailOpen(false);
                      }}
                    >
                      Mark as Read
                    </Button>
                  )}
                  {selectedNotification.farmerName && (
                    <Button variant="outline">
                      <Phone className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
