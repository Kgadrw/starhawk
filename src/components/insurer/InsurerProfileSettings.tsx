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
  Building2, 
  Mail, 
  Phone, 
  MapPin, 
  Shield, 
  Key, 
  Bell, 
  Globe,
  Save,
  Eye,
  EyeOff,
  Upload,
  Camera
} from "lucide-react";

export default function InsurerProfileSettings() {
  const [activeTab, setActiveTab] = useState("profile");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [profileData, setProfileData] = useState({
    companyName: "Rwanda Insurance Company",
    insurerId: "INS-001",
    contactPerson: "John Doe",
    email: "john.doe@rwandainsurance.rw",
    phone: "+250 788 123 456",
    address: "KG 123 St, Kigali, Rwanda",
    website: "www.rwandainsurance.rw",
    licenseNumber: "LIC-2024-001",
    registrationDate: "2024-01-15",
    description: "Leading insurance provider specializing in agricultural risk management and crop insurance solutions."
  });

  const [securityData, setSecurityData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
    twoFactorEnabled: true,
    sessionTimeout: "30"
  });

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    riskAssessmentAlerts: true,
    claimAlerts: true,
    paymentAlerts: true,
    systemAlerts: false,
    weeklyReports: true,
    monthlyReports: true
  });

  const handleProfileUpdate = (field: string, value: string) => {
    setProfileData(prev => ({ ...prev, [field]: value }));
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
            Company Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="companyName">Company Name</Label>
              <Input
                id="companyName"
                value={profileData.companyName}
                onChange={(e) => handleProfileUpdate('companyName', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="insurerId">Insurer ID</Label>
              <Input
                id="insurerId"
                value={profileData.insurerId}
                disabled
                className="bg-gray-50"
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="contactPerson">Contact Person</Label>
              <Input
                id="contactPerson"
                value={profileData.contactPerson}
                onChange={(e) => handleProfileUpdate('contactPerson', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={profileData.email}
                onChange={(e) => handleProfileUpdate('email', e.target.value)}
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                value={profileData.phone}
                onChange={(e) => handleProfileUpdate('phone', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="website">Website</Label>
              <Input
                id="website"
                value={profileData.website}
                onChange={(e) => handleProfileUpdate('website', e.target.value)}
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
            <Label htmlFor="description">Company Description</Label>
            <Textarea
              id="description"
              value={profileData.description}
              onChange={(e) => handleProfileUpdate('description', e.target.value)}
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Building2 className="h-5 w-5 mr-2" />
            Business Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
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
              <Label htmlFor="registrationDate">Registration Date</Label>
              <Input
                id="registrationDate"
                value={profileData.registrationDate}
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
            Company Logo
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-6">
            <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center">
              <Building2 className="h-8 w-8 text-gray-400" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-white/70 mb-2">
                Upload a company logo (PNG, JPG up to 2MB)
              </p>
              <Button variant="outline" size="sm">
                <Upload className="h-4 w-4 mr-2" />
                Upload Logo
              </Button>
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

          <Button className="bg-blue-600 hover:bg-blue-700">
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
            <h4 className="font-medium text-white mb-3">Alert Types</h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-white">Risk Assessment Alerts</p>
                  <p className="text-sm text-white/70">New risk assessments requiring review</p>
                </div>
                <Switch
                  checked={notificationSettings.riskAssessmentAlerts}
                  onCheckedChange={(checked) => handleNotificationUpdate('riskAssessmentAlerts', checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-white">Claim Alerts</p>
                  <p className="text-sm text-white/70">New claims filed by farmers</p>
                </div>
                <Switch
                  checked={notificationSettings.claimAlerts}
                  onCheckedChange={(checked) => handleNotificationUpdate('claimAlerts', checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-white">Payment Alerts</p>
                  <p className="text-sm text-white/70">Premium payments and due dates</p>
                </div>
                <Switch
                  checked={notificationSettings.paymentAlerts}
                  onCheckedChange={(checked) => handleNotificationUpdate('paymentAlerts', checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-white">System Alerts</p>
                  <p className="text-sm text-white/70">System maintenance and updates</p>
                </div>
                <Switch
                  checked={notificationSettings.systemAlerts}
                  onCheckedChange={(checked) => handleNotificationUpdate('systemAlerts', checked)}
                />
              </div>
            </div>
          </div>

          <Separator />

          <div>
            <h4 className="font-medium text-white mb-3">Reports</h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-white">Weekly Reports</p>
                  <p className="text-sm text-white/70">Receive weekly summary reports</p>
                </div>
                <Switch
                  checked={notificationSettings.weeklyReports}
                  onCheckedChange={(checked) => handleNotificationUpdate('weeklyReports', checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-white">Monthly Reports</p>
                  <p className="text-sm text-white/70">Receive monthly summary reports</p>
                </div>
                <Switch
                  checked={notificationSettings.monthlyReports}
                  onCheckedChange={(checked) => handleNotificationUpdate('monthlyReports', checked)}
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
          <p className="text-white/70">Manage your account settings and preferences</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: "profile", label: "Profile", icon: User },
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
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-white/60 hover:text-white/80 hover:border-gray-300"
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
        {activeTab === "security" && renderSecurityTab()}
        {activeTab === "notifications" && renderNotificationsTab()}
      </div>

      {/* Save Button */}
      <div className="flex justify-end pt-6 border-t">
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Save className="h-4 w-4 mr-2" />
          Save Changes
        </Button>
      </div>
    </div>
  );
}
