import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { User, Mail, Phone, MapPin, Calendar, Shield, Settings, Edit, Eye, Download, Share } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";

const recentActivity = [
  {
    action: "Approved Claim",
    details: "CLM-2024-089 - John Mwangi",
    time: "2 hours ago",
    type: "approval"
  },
  {
    action: "Updated Risk Assessment",
    details: "Policy UW-2024-045",
    time: "5 hours ago",
    type: "update"
  },
  {
    action: "Generated Report",
    details: "Monthly Claims Summary",
    time: "1 day ago",
    type: "report"
  },
  {
    action: "Reviewed Application",
    details: "New policy application",
    time: "2 days ago",
    type: "review"
  }
];

const achievements = [
  { title: "Top Performer", description: "Highest approval rate this quarter", icon: "🏆" },
  { title: "Quick Responder", description: "Average response time under 2 hours", icon: "⚡" },
  { title: "Quality Reviewer", description: "Zero disputed decisions this month", icon: "✨" },
  { title: "Team Player", description: "Helped train 3 new team members", icon: "🤝" }
];

export function ProfilePage() {
  const { toast } = useToast();
  const [selectedActivity, setSelectedActivity] = useState<number | null>(null);

  const handleEdit = () => {
    toast({ 
      title: "Edit Profile", 
      description: "Opening profile editing form with all user details." 
    });
  };

  const handleViewActivity = (index: number) => {
    setSelectedActivity(index);
    toast({ 
      title: "Viewing Activity", 
      description: `Opening detailed view for: ${recentActivity[index].action}` 
    });
  };

  const handleDownloadProfile = () => {
    toast({ 
      title: "Downloading Profile", 
      description: "Your profile data is being exported as a PDF." 
    });
  };

  const handleShareProfile = () => {
    toast({ 
      title: "Share Profile", 
      description: "Profile sharing options are being prepared." 
    });
  };

  const handleViewAchievement = (achievement: any) => {
    toast({ 
      title: "Achievement Details", 
      description: `Viewing details for: ${achievement.title}` 
    });
  };

  const handleViewPerformance = () => {
    toast({ 
      title: "Performance Analytics", 
      description: "Opening detailed performance analytics dashboard." 
    });
  };

  return (
    <div className="flex-1 h-full overflow-auto bg-background">
      <div className="p-4 md:p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">Profile</h1>
            <p className="text-muted-foreground">Manage your account and view activity</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleDownloadProfile}>
              <Download className="w-4 h-4 mr-2" />
              Download
            </Button>
            <Button variant="outline" onClick={handleShareProfile}>
              <Share className="w-4 h-4 mr-2" />
              Share
            </Button>
            <Button onClick={handleEdit}>
              <Edit className="w-4 h-4 mr-2" />
              Edit Profile
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Info */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-6">
                <Avatar className="w-20 h-20">
                  <AvatarFallback className="text-lg">JS</AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-4">
                  <div>
                    <h2 className="text-xl font-semibold text-foreground">John Smith</h2>
                    <p className="text-muted-foreground">Senior Insurance Underwriter</p>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex items-center space-x-2">
                      <Mail className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm text-foreground">john.smith@company.com</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Phone className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm text-foreground">+254 700 123 456</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm text-foreground">Nairobi, Kenya</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm text-foreground">Joined March 2022</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary">
                      <Shield className="w-3 h-3 mr-1" />
                      Administrator
                    </Badge>
                    <Badge variant="outline">Senior Level</Badge>
                    <Badge variant="outline">Certified Underwriter</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card>
            <CardHeader>
              <CardTitle>Performance Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center cursor-pointer hover:bg-muted/50 p-2 rounded" onClick={handleViewPerformance}>
                <div className="text-2xl font-bold text-foreground">156</div>
                <p className="text-sm text-muted-foreground">Claims Processed</p>
              </div>
              <Separator />
              <div className="text-center cursor-pointer hover:bg-muted/50 p-2 rounded" onClick={handleViewPerformance}>
                <div className="text-2xl font-bold text-foreground">94%</div>
                <p className="text-sm text-muted-foreground">Approval Rate</p>
              </div>
              <Separator />
              <div className="text-center cursor-pointer hover:bg-muted/50 p-2 rounded" onClick={handleViewPerformance}>
                <div className="text-2xl font-bold text-foreground">1.8hrs</div>
                <p className="text-sm text-muted-foreground">Avg Response Time</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-start space-x-4 pb-4 border-b border-border last:border-b-0">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                  <div className="flex-1">
                    <h4 className="text-sm font-medium text-foreground">{activity.action}</h4>
                    <p className="text-sm text-muted-foreground">{activity.details}</p>
                    <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => handleViewActivity(index)}
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Achievements */}
        <Card>
          <CardHeader>
            <CardTitle>Achievements</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {achievements.map((achievement, index) => (
                <div 
                  key={index} 
                  className="flex items-start space-x-3 p-3 rounded-lg bg-muted/50 cursor-pointer hover:bg-muted/70 transition-colors"
                  onClick={() => handleViewAchievement(achievement)}
                >
                  <span className="text-2xl">{achievement.icon}</span>
                  <div>
                    <h4 className="text-sm font-medium text-foreground">{achievement.title}</h4>
                    <p className="text-xs text-muted-foreground">{achievement.description}</p>
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
