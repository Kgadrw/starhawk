import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { isAdmin, logout as authLogout, getUserId, getPhoneNumber, getEmail } from "@/services/authAPI";
import { getUserById, updateUser, deactivateUser } from "@/services/usersAPI";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { dashboardTheme } from "@/utils/dashboardTheme";
import {
  ArrowLeft,
  Edit,
  Save,
  X,
  UserMinus,
  Mail,
  Phone,
  MapPin,
  User,
  Shield,
  Calendar,
  Building2,
  Award,
  Globe,
  FileText,
  Image as ImageIcon,
  CheckCircle,
  XCircle,
  RefreshCw,
  Users,
  Settings,
  Activity,
  Database,
  DollarSign,
  TrendingUp,
  BarChart3,
  Percent
} from "lucide-react";

export default function UserDetailsPage() {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deactivating, setDeactivating] = useState(false);
  const [activePage, setActivePage] = useState("users");
  
  const adminId = getUserId() || "ADMIN-001";
  const adminName = getEmail() || getPhoneNumber() || "System Administrator";
  const [editUserData, setEditUserData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    province: "",
    district: "",
    sector: "",
    cell: "",
    village: "",
    sex: "",
    active: true,
    farmerProfile: {
      farmProvince: "",
      farmDistrict: "",
      farmSector: "",
      farmCell: "",
      farmVillage: ""
    },
    assessorProfile: {
      specialization: "",
      experienceYears: 0,
      profilePhotoUrl: "",
      bio: "",
      address: ""
    },
    insurerProfile: {
      companyName: "",
      contactPerson: "",
      website: "",
      address: "",
      companyDescription: "",
      licenseNumber: "",
      registrationDate: "",
      companyLogoUrl: ""
    }
  });

  // Route protection
  useEffect(() => {
    if (!isAdmin()) {
      navigate("/admin-login");
    }
  }, [navigate]);

  const handleLogout = () => {
    authLogout();
    navigate("/admin-login");
  };

  const handlePageChange = (page: string) => {
    if (page === "users") {
      navigate("/admin-dashboard");
    } else {
      navigate("/admin-dashboard");
      // You can add more navigation logic here if needed
    }
  };

  const navigationItems = [
    { id: "dashboard", label: "Dashboard", icon: BarChart3 },
    { id: "users", label: "User Management", icon: Users },
    { id: "financial", label: "Financial", icon: DollarSign },
    { id: "commission", label: "Commission", icon: Percent },
    { id: "system", label: "System Config", icon: Settings },
    { id: "security", label: "Security", icon: Shield },
    { id: "logs", label: "Activity Logs", icon: FileText },
    { id: "database", label: "Database", icon: Database },
    { id: "analytics", label: "Analytics", icon: TrendingUp },
    { id: "settings", label: "Settings", icon: Settings }
  ];

  // Load user data
  useEffect(() => {
    if (userId) {
      loadUser();
    }
  }, [userId]);

  const loadUser = async () => {
    if (!userId) return;
    
    setLoading(true);
    setError(null);
    try {
      const response: any = await getUserById(userId);
      const userData = response.data || response;
      setUser(userData);
      
      // Populate edit form
      setEditUserData({
        firstName: userData.firstName || "",
        lastName: userData.lastName || "",
        email: userData.email || "",
        phoneNumber: userData.phoneNumber || "",
        province: userData.province || "",
        district: userData.district || "",
        sector: userData.sector || "",
        cell: userData.cell || "",
        village: userData.village || "",
        sex: userData.sex || "",
        active: userData.active !== false,
        farmerProfile: {
          farmProvince: userData.farmerProfile?.farmProvince || "",
          farmDistrict: userData.farmerProfile?.farmDistrict || "",
          farmSector: userData.farmerProfile?.farmSector || "",
          farmCell: userData.farmerProfile?.farmCell || "",
          farmVillage: userData.farmerProfile?.farmVillage || ""
        },
        assessorProfile: {
          specialization: userData.assessorProfile?.specialization || "",
          experienceYears: userData.assessorProfile?.experienceYears || 0,
          profilePhotoUrl: userData.assessorProfile?.profilePhotoUrl || "",
          bio: userData.assessorProfile?.bio || "",
          address: userData.assessorProfile?.address || ""
        },
        insurerProfile: {
          companyName: userData.insurerProfile?.companyName || "",
          contactPerson: userData.insurerProfile?.contactPerson || "",
          website: userData.insurerProfile?.website || "",
          address: userData.insurerProfile?.address || "",
          companyDescription: userData.insurerProfile?.companyDescription || "",
          licenseNumber: userData.insurerProfile?.licenseNumber || "",
          registrationDate: userData.insurerProfile?.registrationDate || "",
          companyLogoUrl: userData.insurerProfile?.companyLogoUrl || ""
        }
      });
    } catch (err: any) {
      console.error('Failed to load user:', err);
      setError(err.message || "Failed to load user details");
      toast({
        title: "Error",
        description: err.message || "Failed to load user details",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateUser = async () => {
    if (!user || !userId) return;

    setSaving(true);
    try {
      const updateData: any = {};

      // Add basic fields
      if (editUserData.firstName) updateData.firstName = editUserData.firstName;
      if (editUserData.lastName) updateData.lastName = editUserData.lastName;
      if (editUserData.email) updateData.email = editUserData.email;
      if (editUserData.phoneNumber) updateData.phoneNumber = editUserData.phoneNumber;
      if (editUserData.province) updateData.province = editUserData.province;
      if (editUserData.district) updateData.district = editUserData.district;
      if (editUserData.sector) updateData.sector = editUserData.sector;
      if (editUserData.cell) updateData.cell = editUserData.cell;
      if (editUserData.village) updateData.village = editUserData.village;
      if (editUserData.sex) updateData.sex = editUserData.sex;
      updateData.active = editUserData.active;

      // Add profile data based on role
      if (user.role === 'FARMER' && editUserData.farmerProfile) {
        updateData.farmerProfile = editUserData.farmerProfile;
      } else if (user.role === 'ASSESSOR' && editUserData.assessorProfile) {
        updateData.assessorProfile = editUserData.assessorProfile;
      } else if (user.role === 'INSURER' && editUserData.insurerProfile) {
        updateData.insurerProfile = editUserData.insurerProfile;
      }

      await updateUser(userId, updateData);
      
      toast({
        title: "Success",
        description: "User updated successfully",
      });

      setIsEditing(false);
      await loadUser();
    } catch (err: any) {
      console.error('Failed to update user:', err);
      toast({
        title: "Error Updating User",
        description: err.message || "Failed to update user",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDeactivateUser = async () => {
    if (!user || !userId) return;
    
    if (!window.confirm(`Are you sure you want to ${user.active ? 'deactivate' : 'activate'} this user?`)) {
      return;
    }

    setDeactivating(true);
    try {
      await deactivateUser(userId);
      toast({
        title: "Success",
        description: `User ${user.active ? 'deactivated' : 'activated'} successfully`,
      });
      await loadUser();
    } catch (err: any) {
      console.error('Failed to deactivate user:', err);
      toast({
        title: "Error",
        description: err.message || "Failed to deactivate user",
        variant: "destructive",
      });
    } finally {
      setDeactivating(false);
    }
  };

  const renderContent = () => {
    if (loading) {
      return (
        <Card className={`${dashboardTheme.card} border-gray-800`}>
          <CardContent className="p-8 text-center">
            <RefreshCw className="h-8 w-8 animate-spin text-white mx-auto mb-4" />
            <p className="text-white/60">Loading user details...</p>
          </CardContent>
        </Card>
      );
    }

    if (error || !user) {
      return (
        <Card className={`${dashboardTheme.card} border-l-4 border-l-red-500`}>
          <CardContent className="p-8">
            <div className="flex items-center gap-3 mb-4">
              <XCircle className="h-6 w-6 text-red-400" />
              <p className="text-red-400">{error || "User not found"}</p>
            </div>
            <Button
              onClick={() => navigate("/admin-dashboard")}
              variant="outline"
              className="border-gray-700 text-white hover:bg-gray-800"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </CardContent>
        </Card>
      );
    }

    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              onClick={() => navigate("/admin-dashboard")}
              variant="ghost"
              className="text-white/60 hover:text-white"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-white">
                {isEditing ? "Edit User" : "User Details"}
              </h1>
              <p className="text-white/60 mt-1">
                {user.role} • {user.nationalId || "N/A"}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            {!isEditing ? (
              <>
                <Button
                  onClick={() => setIsEditing(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
                <Button
                  onClick={handleDeactivateUser}
                  disabled={deactivating}
                  variant={user.active ? "destructive" : "default"}
                  className={user.active ? "bg-red-600 hover:bg-red-700" : "bg-green-600 hover:bg-green-700"}
                >
                  {deactivating ? (
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <UserMinus className="h-4 w-4 mr-2" />
                  )}
                  {user.active ? "Deactivate" : "Activate"}
                </Button>
              </>
            ) : (
              <>
                <Button
                  onClick={() => {
                    setIsEditing(false);
                    loadUser();
                  }}
                  variant="outline"
                  className="border-gray-700 text-white hover:bg-gray-800"
                >
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
                <Button
                  onClick={handleUpdateUser}
                  disabled={saving}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  {saving ? (
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4 mr-2" />
                  )}
                  Save Changes
                </Button>
              </>
            )}
          </div>
        </div>

        {/* User Status Badge */}
        <div className="flex items-center gap-2">
          <Badge className={user.active ? "bg-green-600" : "bg-gray-600"}>
            {user.active ? (
              <>
                <CheckCircle className="h-3 w-3 mr-1" />
                Active
              </>
            ) : (
              <>
                <XCircle className="h-3 w-3 mr-1" />
                Inactive
              </>
            )}
          </Badge>
          <Badge className="bg-blue-600">{user.role}</Badge>
        </div>

        {/* Basic Information */}
        <Card className={`${dashboardTheme.card} border-gray-800`}>
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <User className="h-5 w-5" />
              Basic Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-white/60">National ID</Label>
                {isEditing ? (
                  <Input
                    value={user.nationalId || ""}
                    disabled
                    className={`${dashboardTheme.input} border-gray-700 opacity-50`}
                  />
                ) : (
                  <p className="text-white">{user.nationalId || "N/A"}</p>
                )}
              </div>
              <div>
                <Label className="text-white/60">Role</Label>
                {isEditing ? (
                  <Input
                    value={user.role || ""}
                    disabled
                    className={`${dashboardTheme.input} border-gray-700 opacity-50`}
                  />
                ) : (
                  <Badge className="bg-blue-600">{user.role}</Badge>
                )}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-white/60">First Name</Label>
                {isEditing ? (
                  <Input
                    value={editUserData.firstName}
                    onChange={(e) => setEditUserData({ ...editUserData, firstName: e.target.value })}
                    className={`${dashboardTheme.input} border-gray-700`}
                  />
                ) : (
                  <p className="text-white">{user.firstName || "N/A"}</p>
                )}
              </div>
              <div>
                <Label className="text-white/60">Last Name</Label>
                {isEditing ? (
                  <Input
                    value={editUserData.lastName}
                    onChange={(e) => setEditUserData({ ...editUserData, lastName: e.target.value })}
                    className={`${dashboardTheme.input} border-gray-700`}
                  />
                ) : (
                  <p className="text-white">{user.lastName || "N/A"}</p>
                )}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-white/60 flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Email
                </Label>
                {isEditing ? (
                  <Input
                    type="email"
                    value={editUserData.email}
                    onChange={(e) => setEditUserData({ ...editUserData, email: e.target.value })}
                    className={`${dashboardTheme.input} border-gray-700`}
                  />
                ) : (
                  <p className="text-white">{user.email || "N/A"}</p>
                )}
              </div>
              <div>
                <Label className="text-white/60 flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  Phone Number
                </Label>
                {isEditing ? (
                  <Input
                    value={editUserData.phoneNumber}
                    onChange={(e) => setEditUserData({ ...editUserData, phoneNumber: e.target.value })}
                    className={`${dashboardTheme.input} border-gray-700`}
                  />
                ) : (
                  <p className="text-white">{user.phoneNumber || "N/A"}</p>
                )}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-white/60 flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Province
                </Label>
                {isEditing ? (
                  <Input
                    value={editUserData.province}
                    onChange={(e) => setEditUserData({ ...editUserData, province: e.target.value })}
                    className={`${dashboardTheme.input} border-gray-700`}
                  />
                ) : (
                  <p className="text-white">{user.province || "N/A"}</p>
                )}
              </div>
              <div>
                <Label className="text-white/60">District</Label>
                {isEditing ? (
                  <Input
                    value={editUserData.district}
                    onChange={(e) => setEditUserData({ ...editUserData, district: e.target.value })}
                    className={`${dashboardTheme.input} border-gray-700`}
                  />
                ) : (
                  <p className="text-white">{user.district || "N/A"}</p>
                )}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-white/60">Sector</Label>
                {isEditing ? (
                  <Input
                    value={editUserData.sector}
                    onChange={(e) => setEditUserData({ ...editUserData, sector: e.target.value })}
                    className={`${dashboardTheme.input} border-gray-700`}
                  />
                ) : (
                  <p className="text-white">{user.sector || "N/A"}</p>
                )}
              </div>
              <div>
                <Label className="text-white/60">Cell</Label>
                {isEditing ? (
                  <Input
                    value={editUserData.cell}
                    onChange={(e) => setEditUserData({ ...editUserData, cell: e.target.value })}
                    className={`${dashboardTheme.input} border-gray-700`}
                  />
                ) : (
                  <p className="text-white">{user.cell || "N/A"}</p>
                )}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-white/60">Village</Label>
                {isEditing ? (
                  <Input
                    value={editUserData.village}
                    onChange={(e) => setEditUserData({ ...editUserData, village: e.target.value })}
                    className={`${dashboardTheme.input} border-gray-700`}
                  />
                ) : (
                  <p className="text-white">{user.village || "N/A"}</p>
                )}
              </div>
              <div>
                <Label className="text-white/60">Sex</Label>
                {isEditing ? (
                  <Select
                    value={editUserData.sex}
                    onValueChange={(value) => setEditUserData({ ...editUserData, sex: value })}
                  >
                    <SelectTrigger className={`${dashboardTheme.select}`}>
                      <SelectValue placeholder="Select sex" />
                    </SelectTrigger>
                    <SelectContent className={dashboardTheme.card}>
                      <SelectItem value="MALE">Male</SelectItem>
                      <SelectItem value="FEMALE">Female</SelectItem>
                      <SelectItem value="OTHER">Other</SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  <p className="text-white">{user.sex || "N/A"}</p>
                )}
              </div>
            </div>
            <div>
              <Label className="text-white/60 flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Status
              </Label>
              {isEditing ? (
                <div className="flex items-center gap-2 mt-2">
                  <input
                    type="checkbox"
                    checked={editUserData.active}
                    onChange={(e) => setEditUserData({ ...editUserData, active: e.target.checked })}
                    className="w-4 h-4"
                  />
                  <span className="text-white">Active</span>
                </div>
              ) : (
                <Badge className={user.active ? "bg-green-600" : "bg-gray-600"}>
                  {user.active ? "Active" : "Inactive"}
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Role-specific Profile */}
        {user.role === 'FARMER' && user.farmerProfile && (
          <Card className={`${dashboardTheme.card} border-gray-800`}>
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Farmer Profile
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-white/60">Farm Province</Label>
                  {isEditing ? (
                    <Input
                      value={editUserData.farmerProfile.farmProvince}
                      onChange={(e) => setEditUserData({
                        ...editUserData,
                        farmerProfile: { ...editUserData.farmerProfile, farmProvince: e.target.value }
                      })}
                      className={`${dashboardTheme.input} border-gray-700`}
                    />
                  ) : (
                    <p className="text-white">{user.farmerProfile.farmProvince || "N/A"}</p>
                  )}
                </div>
                <div>
                  <Label className="text-white/60">Farm District</Label>
                  {isEditing ? (
                    <Input
                      value={editUserData.farmerProfile.farmDistrict}
                      onChange={(e) => setEditUserData({
                        ...editUserData,
                        farmerProfile: { ...editUserData.farmerProfile, farmDistrict: e.target.value }
                      })}
                      className={`${dashboardTheme.input} border-gray-700`}
                    />
                  ) : (
                    <p className="text-white">{user.farmerProfile.farmDistrict || "N/A"}</p>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-white/60">Farm Sector</Label>
                  {isEditing ? (
                    <Input
                      value={editUserData.farmerProfile.farmSector}
                      onChange={(e) => setEditUserData({
                        ...editUserData,
                        farmerProfile: { ...editUserData.farmerProfile, farmSector: e.target.value }
                      })}
                      className={`${dashboardTheme.input} border-gray-700`}
                    />
                  ) : (
                    <p className="text-white">{user.farmerProfile.farmSector || "N/A"}</p>
                  )}
                </div>
                <div>
                  <Label className="text-white/60">Farm Cell</Label>
                  {isEditing ? (
                    <Input
                      value={editUserData.farmerProfile.farmCell}
                      onChange={(e) => setEditUserData({
                        ...editUserData,
                        farmerProfile: { ...editUserData.farmerProfile, farmCell: e.target.value }
                      })}
                      className={`${dashboardTheme.input} border-gray-700`}
                    />
                  ) : (
                    <p className="text-white">{user.farmerProfile.farmCell || "N/A"}</p>
                  )}
                </div>
              </div>
              <div>
                <Label className="text-white/60">Farm Village</Label>
                {isEditing ? (
                  <Input
                    value={editUserData.farmerProfile.farmVillage}
                    onChange={(e) => setEditUserData({
                      ...editUserData,
                      farmerProfile: { ...editUserData.farmerProfile, farmVillage: e.target.value }
                    })}
                    className={`${dashboardTheme.input} border-gray-700`}
                  />
                ) : (
                  <p className="text-white">{user.farmerProfile.farmVillage || "N/A"}</p>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {user.role === 'ASSESSOR' && user.assessorProfile && (
          <Card className={`${dashboardTheme.card} border-gray-800`}>
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Award className="h-5 w-5" />
                Assessor Profile
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-white/60">Specialization</Label>
                  {isEditing ? (
                    <Input
                      value={editUserData.assessorProfile.specialization}
                      onChange={(e) => setEditUserData({
                        ...editUserData,
                        assessorProfile: { ...editUserData.assessorProfile, specialization: e.target.value }
                      })}
                      className={`${dashboardTheme.input} border-gray-700`}
                    />
                  ) : (
                    <p className="text-white">{user.assessorProfile.specialization || "N/A"}</p>
                  )}
                </div>
                <div>
                  <Label className="text-white/60">Experience Years</Label>
                  {isEditing ? (
                    <Input
                      type="number"
                      value={editUserData.assessorProfile.experienceYears}
                      onChange={(e) => setEditUserData({
                        ...editUserData,
                        assessorProfile: { ...editUserData.assessorProfile, experienceYears: parseInt(e.target.value) || 0 }
                      })}
                      className={`${dashboardTheme.input} border-gray-700`}
                    />
                  ) : (
                    <p className="text-white">{user.assessorProfile.experienceYears || 0}</p>
                  )}
                </div>
              </div>
              <div>
                <Label className="text-white/60 flex items-center gap-2">
                  <ImageIcon className="h-4 w-4" />
                  Profile Photo URL
                </Label>
                {isEditing ? (
                  <Input
                    value={editUserData.assessorProfile.profilePhotoUrl}
                    onChange={(e) => setEditUserData({
                      ...editUserData,
                      assessorProfile: { ...editUserData.assessorProfile, profilePhotoUrl: e.target.value }
                    })}
                    className={`${dashboardTheme.input} border-gray-700`}
                  />
                ) : (
                  <p className="text-white break-all">{user.assessorProfile.profilePhotoUrl || "N/A"}</p>
                )}
              </div>
              <div>
                <Label className="text-white/60">Address</Label>
                {isEditing ? (
                  <Input
                    value={editUserData.assessorProfile.address}
                    onChange={(e) => setEditUserData({
                      ...editUserData,
                      assessorProfile: { ...editUserData.assessorProfile, address: e.target.value }
                    })}
                    className={`${dashboardTheme.input} border-gray-700`}
                  />
                ) : (
                  <p className="text-white">{user.assessorProfile.address || "N/A"}</p>
                )}
              </div>
              <div>
                <Label className="text-white/60">Bio</Label>
                {isEditing ? (
                  <Textarea
                    value={editUserData.assessorProfile.bio}
                    onChange={(e) => setEditUserData({
                      ...editUserData,
                      assessorProfile: { ...editUserData.assessorProfile, bio: e.target.value }
                    })}
                    className={`${dashboardTheme.input} border-gray-700 min-h-[100px]`}
                  />
                ) : (
                  <p className="text-white whitespace-pre-wrap">{user.assessorProfile.bio || "N/A"}</p>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {user.role === 'INSURER' && user.insurerProfile && (
          <Card className={`${dashboardTheme.card} border-gray-800`}>
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Insurer Profile
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-white/60">Company Name</Label>
                  {isEditing ? (
                    <Input
                      value={editUserData.insurerProfile.companyName}
                      onChange={(e) => setEditUserData({
                        ...editUserData,
                        insurerProfile: { ...editUserData.insurerProfile, companyName: e.target.value }
                      })}
                      className={`${dashboardTheme.input} border-gray-700`}
                    />
                  ) : (
                    <p className="text-white">{user.insurerProfile.companyName || "N/A"}</p>
                  )}
                </div>
                <div>
                  <Label className="text-white/60">Contact Person</Label>
                  {isEditing ? (
                    <Input
                      value={editUserData.insurerProfile.contactPerson}
                      onChange={(e) => setEditUserData({
                        ...editUserData,
                        insurerProfile: { ...editUserData.insurerProfile, contactPerson: e.target.value }
                      })}
                      className={`${dashboardTheme.input} border-gray-700`}
                    />
                  ) : (
                    <p className="text-white">{user.insurerProfile.contactPerson || "N/A"}</p>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-white/60 flex items-center gap-2">
                    <Globe className="h-4 w-4" />
                    Website
                  </Label>
                  {isEditing ? (
                    <Input
                      value={editUserData.insurerProfile.website}
                      onChange={(e) => setEditUserData({
                        ...editUserData,
                        insurerProfile: { ...editUserData.insurerProfile, website: e.target.value }
                      })}
                      className={`${dashboardTheme.input} border-gray-700`}
                    />
                  ) : (
                    <p className="text-white break-all">{user.insurerProfile.website || "N/A"}</p>
                  )}
                </div>
                <div>
                  <Label className="text-white/60">License Number</Label>
                  {isEditing ? (
                    <Input
                      value={editUserData.insurerProfile.licenseNumber}
                      onChange={(e) => setEditUserData({
                        ...editUserData,
                        insurerProfile: { ...editUserData.insurerProfile, licenseNumber: e.target.value }
                      })}
                      className={`${dashboardTheme.input} border-gray-700`}
                    />
                  ) : (
                    <p className="text-white">{user.insurerProfile.licenseNumber || "N/A"}</p>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-white/60 flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Registration Date
                  </Label>
                  {isEditing ? (
                    <Input
                      type="date"
                      value={editUserData.insurerProfile.registrationDate}
                      onChange={(e) => setEditUserData({
                        ...editUserData,
                        insurerProfile: { ...editUserData.insurerProfile, registrationDate: e.target.value }
                      })}
                      className={`${dashboardTheme.input} border-gray-700`}
                    />
                  ) : (
                    <p className="text-white">{user.insurerProfile.registrationDate || "N/A"}</p>
                  )}
                </div>
                <div>
                  <Label className="text-white/60 flex items-center gap-2">
                    <ImageIcon className="h-4 w-4" />
                    Company Logo URL
                  </Label>
                  {isEditing ? (
                    <Input
                      value={editUserData.insurerProfile.companyLogoUrl}
                      onChange={(e) => setEditUserData({
                        ...editUserData,
                        insurerProfile: { ...editUserData.insurerProfile, companyLogoUrl: e.target.value }
                      })}
                      className={`${dashboardTheme.input} border-gray-700`}
                    />
                  ) : (
                    <p className="text-white break-all">{user.insurerProfile.companyLogoUrl || "N/A"}</p>
                  )}
                </div>
              </div>
              <div>
                <Label className="text-white/60">Address</Label>
                {isEditing ? (
                  <Input
                    value={editUserData.insurerProfile.address}
                    onChange={(e) => setEditUserData({
                      ...editUserData,
                      insurerProfile: { ...editUserData.insurerProfile, address: e.target.value }
                    })}
                    className={`${dashboardTheme.input} border-gray-700`}
                  />
                ) : (
                  <p className="text-white">{user.insurerProfile.address || "N/A"}</p>
                )}
              </div>
              <div>
                <Label className="text-white/60">Company Description</Label>
                {isEditing ? (
                  <Textarea
                    value={editUserData.insurerProfile.companyDescription}
                    onChange={(e) => setEditUserData({
                      ...editUserData,
                      insurerProfile: { ...editUserData.insurerProfile, companyDescription: e.target.value }
                    })}
                    className={`${dashboardTheme.input} border-gray-700 min-h-[100px]`}
                  />
                ) : (
                  <p className="text-white whitespace-pre-wrap">{user.insurerProfile.companyDescription || "N/A"}</p>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    );
  };

  return (
    <DashboardLayout
      userType="admin"
      userId={adminId}
      userName={adminName}
      navigationItems={navigationItems}
      activePage={activePage}
      onPageChange={handlePageChange}
      onLogout={handleLogout}
    >
      {renderContent()}
    </DashboardLayout>
  );
}

