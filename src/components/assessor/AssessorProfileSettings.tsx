import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { 
  User, 
  MapPin, 
  Mail, 
  Phone, 
  Shield, 
  Key, 
  Bell, 
  Globe,
  Save,
  Eye,
  EyeOff,
  Upload,
  Camera,
  Award,
  Calendar,
  Map,
  GraduationCap
} from "lucide-react";

export default function AssessorProfileSettings() {
  const [activeTab, setActiveTab] = useState("profile");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [profileData, setProfileData] = useState({
    fullName: "Richard Nkurunziza",
    assessorId: "ASS-001",
    email: "richard.nkurunziza@assessor.rw",
    phone: "+250 788 123 456",
    address: "KG 456 St, Kigali, Rwanda",
    specialization: "Agricultural Risk Assessment",
    experience: "5 years",
    licenseNumber: "ASS-LIC-2024-001",
    certificationDate: "2024-01-15",
    bio: "Experienced agricultural assessor specializing in crop risk evaluation and field assessment. Certified in advanced assessment techniques and drone technology."
  });

  const [workData, setWorkData] = useState({
    assignedRegion: "Eastern Province",
    maxAssessmentsPerDay: "3",
    preferredWorkingHours: "08:00-17:00",
    vehicleType: "Motorcycle",
    equipment: ["GPS Device", "Camera", "Soil Testing Kit", "Drone"],
    languages: ["Kinyarwanda", "English", "French"]
  });

  const [securityData, setSecurityData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
    twoFactorEnabled: false,
    sessionTimeout: "30"
  });

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    smsNotifications: true,
    pushNotifications: true,
    assignmentAlerts: true,
    dueDateReminders: true,
    trainingAlerts: true,
    equipmentAlerts: false,
    performanceReports: true,
    weatherAlerts: true
  });

  const handleProfileUpdate = (field: string, value: string) => {
    setProfileData(prev => ({ ...prev, [field]: value }));
  };

  const handleWorkUpdate = (field: string, value: string) => {
    setWorkData(prev => ({ ...prev, [field]: value }));
  };

  const handleSecurityUpdate = (field: string, value: string | boolean) => {
    setSecurityData(prev => ({ ...prev, [field]: value }));
  };

  const handleNotificationUpdate = (field: string, value: boolean) => {
    setNotificationSettings(prev => ({ ...prev, [field]: value }));
  };

  const renderProfileTab = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <User className="h-5 w-5 mr-2" />
            Personal Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                value={profileData.fullName}
                onChange={(e) => handleProfileUpdate('fullName', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="assessorId">Assessor ID</Label>
              <Input
                id="assessorId"
                value={profileData.assessorId}
                disabled
                className="bg-gray-50"
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={profileData.email}
                onChange={(e) => handleProfileUpdate('email', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                value={profileData.phone}
                onChange={(e) => handleProfileUpdate('phone', e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Input
              id="address"
              value={profileData.address}
              onChange={(e) => handleProfileUpdate('address', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              value={profileData.bio}
              onChange={(e) => handleProfileUpdate('bio', e.target.value)}
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Award className="h-5 w-5 mr-2" />
            Professional Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="specialization">Specialization</Label>
              <Input
                id="specialization"
                value={profileData.specialization}
                onChange={(e) => handleProfileUpdate('specialization', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="experience">Experience</Label>
              <Input
                id="experience"
                value={profileData.experience}
                onChange={(e) => handleProfileUpdate('experience', e.target.value)}
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="licenseNumber">License Number</Label>
              <Input
                id="licenseNumber"
                value={profileData.licenseNumber}
                disabled
                className="bg-gray-50"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="certificationDate">Certification Date</Label>
              <Input
                id="certificationDate"
                value={profileData.certificationDate}
                disabled
                className="bg-gray-50"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Camera className="h-5 w-5 mr-2" />
            Profile Photo
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-6">
            <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center">
              <User className="h-8 w-8 text-gray-400" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-white/70 mb-2">
                Upload a profile photo (PNG, JPG up to 2MB)
              </p>
              <Button variant="outline" size="sm">
                <Upload className="h-4 w-4 mr-2" />
                Upload Photo
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderWorkTab = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Map className="h-5 w-5 mr-2" />
            Work Preferences
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="assignedRegion">Assigned Region</Label>
              <Select value={workData.assignedRegion} onValueChange={(value) => handleWorkUpdate('assignedRegion', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Eastern Province">Eastern Province</SelectItem>
                  <SelectItem value="Western Province">Western Province</SelectItem>
                  <SelectItem value="Northern Province">Northern Province</SelectItem>
                  <SelectItem value="Southern Province">Southern Province</SelectItem>
                  <SelectItem value="Kigali City">Kigali City</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="maxAssessmentsPerDay">Max Assessments Per Day</Label>
              <Select value={workData.maxAssessmentsPerDay} onValueChange={(value) => handleWorkUpdate('maxAssessmentsPerDay', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1</SelectItem>
                  <SelectItem value="2">2</SelectItem>
                  <SelectItem value="3">3</SelectItem>
                  <SelectItem value="4">4</SelectItem>
                  <SelectItem value="5">5</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="preferredWorkingHours">Preferred Working Hours</Label>
              <Select value={workData.preferredWorkingHours} onValueChange={(value) => handleWorkUpdate('preferredWorkingHours', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="06:00-15:00">06:00-15:00</SelectItem>
                  <SelectItem value="07:00-16:00">07:00-16:00</SelectItem>
                  <SelectItem value="08:00-17:00">08:00-17:00</SelectItem>
                  <SelectItem value="09:00-18:00">09:00-18:00</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="vehicleType">Vehicle Type</Label>
              <Select value={workData.vehicleType} onValueChange={(value) => handleWorkUpdate('vehicleType', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Motorcycle">Motorcycle</SelectItem>
                  <SelectItem value="Car">Car</SelectItem>
                  <SelectItem value="Bicycle">Bicycle</SelectItem>
                  <SelectItem value="Public Transport">Public Transport</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Available Equipment</Label>
            <div className="grid gap-2 md:grid-cols-2">
              {["GPS Device", "Camera", "Soil Testing Kit", "Drone", "Weather Station", "Tablet"].map((equipment) => (
                <label key={equipment} className="flex items-center">
                  <input 
                    type="checkbox" 
                    defaultChecked={workData.equipment.includes(equipment)}
                    className="mr-2" 
                  />
                  <span className="text-sm text-white/70">{equipment}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Languages</Label>
            <div className="grid gap-2 md:grid-cols-3">
              {["Kinyarwanda", "English", "French", "Swahili"].map((language) => (
                <label key={language} className="flex items-center">
                  <input 
                    type="checkbox" 
                    defaultChecked={workData.languages.includes(language)}
                    className="mr-2" 
                  />
                  <span className="text-sm text-white/70">{language}</span>
                </label>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderSecurityTab = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Key className="h-5 w-5 mr-2" />
            Change Password
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="currentPassword">Current Password</Label>
            <div className="relative">
              <Input
                id="currentPassword"
                type={showCurrentPassword ? "text" : "password"}
                value={securityData.currentPassword}
                onChange={(e) => handleSecurityUpdate('currentPassword', e.target.value)}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
              >
                {showCurrentPassword ? (
                  <EyeOff className="h-4 w-4 text-gray-400" />
                ) : (
                  <Eye className="h-4 w-4 text-gray-400" />
                )}
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="newPassword">New Password</Label>
            <div className="relative">
              <Input
                id="newPassword"
                type={showNewPassword ? "text" : "password"}
                value={securityData.newPassword}
                onChange={(e) => handleSecurityUpdate('newPassword', e.target.value)}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowNewPassword(!showNewPassword)}
              >
                {showNewPassword ? (
                  <EyeOff className="h-4 w-4 text-gray-400" />
                ) : (
                  <Eye className="h-4 w-4 text-gray-400" />
                )}
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm New Password</Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                value={securityData.confirmPassword}
                onChange={(e) => handleSecurityUpdate('confirmPassword', e.target.value)}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-4 w-4 text-gray-400" />
                ) : (
                  <Eye className="h-4 w-4 text-gray-400" />
                )}
              </Button>
            </div>
          </div>

          <Button className="bg-orange-600 hover:bg-orange-700">
            Update Password
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Shield className="h-5 w-5 mr-2" />
            Security Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-white">Two-Factor Authentication</h4>
              <p className="text-sm text-white/70">Add an extra layer of security to your account</p>
            </div>
            <Switch
              checked={securityData.twoFactorEnabled}
              onCheckedChange={(checked) => handleSecurityUpdate('twoFactorEnabled', checked)}
            />
          </div>

          <Separator />

          <div className="space-y-2">
            <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
            <Select value={securityData.sessionTimeout} onValueChange={(value) => handleSecurityUpdate('sessionTimeout', value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="15">15 minutes</SelectItem>
                <SelectItem value="30">30 minutes</SelectItem>
                <SelectItem value="60">1 hour</SelectItem>
                <SelectItem value="120">2 hours</SelectItem>
                <SelectItem value="480">8 hours</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderNotificationsTab = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Bell className="h-5 w-5 mr-2" />
            Notification Preferences
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h4 className="font-medium text-white mb-3">Communication Channels</h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-white">Email Notifications</p>
                  <p className="text-sm text-white/70">Receive notifications via email</p>
                </div>
                <Switch
                  checked={notificationSettings.emailNotifications}
                  onCheckedChange={(checked) => handleNotificationUpdate('emailNotifications', checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-white">SMS Notifications</p>
                  <p className="text-sm text-white/70">Receive notifications via SMS</p>
                </div>
                <Switch
                  checked={notificationSettings.smsNotifications}
                  onCheckedChange={(checked) => handleNotificationUpdate('smsNotifications', checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-white">Push Notifications</p>
                  <p className="text-sm text-white/70">Receive browser push notifications</p>
                </div>
                <Switch
                  checked={notificationSettings.pushNotifications}
                  onCheckedChange={(checked) => handleNotificationUpdate('pushNotifications', checked)}
                />
              </div>
            </div>
          </div>

          <Separator />

          <div>
            <h4 className="font-medium text-white mb-3">Assessment Alerts</h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-white">New Assignment Alerts</p>
                  <p className="text-sm text-white/70">New assessment assignments</p>
                </div>
                <Switch
                  checked={notificationSettings.assignmentAlerts}
                  onCheckedChange={(checked) => handleNotificationUpdate('assignmentAlerts', checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-white">Due Date Reminders</p>
                  <p className="text-sm text-white/70">Assessment due date reminders</p>
                </div>
                <Switch
                  checked={notificationSettings.dueDateReminders}
                  onCheckedChange={(checked) => handleNotificationUpdate('dueDateReminders', checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-white">Weather Alerts</p>
                  <p className="text-sm text-white/70">Weather conditions for field work</p>
                </div>
                <Switch
                  checked={notificationSettings.weatherAlerts}
                  onCheckedChange={(checked) => handleNotificationUpdate('weatherAlerts', checked)}
                />
              </div>
            </div>
          </div>

          <Separator />

          <div>
            <h4 className="font-medium text-white mb-3">Professional Development</h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-white">Training Alerts</p>
                  <p className="text-sm text-white/70">Training session reminders</p>
                </div>
                <Switch
                  checked={notificationSettings.trainingAlerts}
                  onCheckedChange={(checked) => handleNotificationUpdate('trainingAlerts', checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-white">Equipment Alerts</p>
                  <p className="text-sm text-white/70">Equipment maintenance reminders</p>
                </div>
                <Switch
                  checked={notificationSettings.equipmentAlerts}
                  onCheckedChange={(checked) => handleNotificationUpdate('equipmentAlerts', checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-white">Performance Reports</p>
                  <p className="text-sm text-white/70">Monthly performance summaries</p>
                </div>
                <Switch
                  checked={notificationSettings.performanceReports}
                  onCheckedChange={(checked) => handleNotificationUpdate('performanceReports', checked)}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Profile Settings</h2>
          <p className="text-white/70">Manage your assessor profile and preferences</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: "profile", label: "Profile", icon: User },
            { id: "work", label: "Work", icon: Map },
            { id: "security", label: "Security", icon: Shield },
            { id: "notifications", label: "Notifications", icon: Bell }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? "border-orange-500 text-orange-600"
                    : "border-transparent text-gray-500 hover:text-white/80 hover:border-gray-300"
                }`}
              >
                <Icon className="h-4 w-4 mr-2" />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="pt-6">
        {activeTab === "profile" && renderProfileTab()}
        {activeTab === "work" && renderWorkTab()}
        {activeTab === "security" && renderSecurityTab()}
        {activeTab === "notifications" && renderNotificationsTab()}
      </div>

      {/* Save Button */}
      <div className="flex justify-end pt-6 border-t">
        <Button className="bg-orange-600 hover:bg-orange-700">
          <Save className="h-4 w-4 mr-2" />
          Save Changes
        </Button>
      </div>
    </div>
  );
}
