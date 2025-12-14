import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { dashboardTheme } from "@/utils/dashboardTheme";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import DashboardLayout from "../layout/DashboardLayout";
import AssessorNotifications from "../assessor/AssessorNotifications";
import AssessorProfileSettings from "../assessor/AssessorProfileSettings";
import RiskAssessmentSystem from "../assessor/RiskAssessmentSystem";
import LossAssessmentSystem from "../assessor/LossAssessmentSystem";
import LeafletMap from "../common/LeafletMap";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import meteosourceApiService from "@/services/meteosourceApi";
import assessmentsApiService from "@/services/assessmentsApi";
import farmsApiService, { getFarms, getAllFarms, getFarmById, getWeatherForecast, getHistoricalWeather, getVegetationStats, uploadShapefile, uploadKML, createFarm, createInsuranceRequest, updateFarm } from "@/services/farmsApi";
import { getUserId, getPhoneNumber, getEmail } from "@/services/authAPI";
import { getUserProfile, getUserById } from "@/services/usersAPI";
import { API_BASE_URL, getAuthToken } from "@/config/api";
import { useToast } from "@/hooks/use-toast";
import { 
  FileText, 
  Bell,
  User,
  BarChart3,
  Shield,
  Activity,
  Cloud,
  MapPin,
  Calendar,
  Search,
  Filter,
  Plus,
  Eye,
  Edit,
  CloudRain,
  Leaf,
  FileSpreadsheet,
  Sun,
  Wind,
  Droplets,
  Thermometer,
  CloudSnow,
  Zap,
  Clock,
  AlertTriangle,
  Satellite,
  CheckCircle,
  AlertCircle,
  Upload,
  Download,
  Star,
  Map,
  ArrowLeft,
  RefreshCw,
  Users,
  Sprout,
  ChevronDown,
  ChevronRight,
  Monitor,
  Settings
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

interface AssessmentSummary {
  id: string;
  farmerId: string;
  farmerName: string;
  location: string;
  type: string;
  status: string;
  date: string;
}

interface Field {
  id: string;
  farmerName: string;
  crop: string;
  area: number;
  season: string;
  status: string;
  fieldName: string;
  sowingDate: string;
}

interface FieldDetail {
  fieldId: string;
  fieldName: string;
  farmer: string;
  cropType: string;
  area: number;
  season: string;
  sowingDate: string;
  location: string;
}

interface WeatherData {
  current: {
    temperature: number;
    summary: string;
    humidity: number;
    windSpeed: number;
    windDir: string;
    pressure: number;
    cloudCover: number;
    precipitation: number;
    precipitationType: string;
    icon: string;
    iconNum: number;
  };
  hourly: Array<{
    time: Date;
    temperature: number;
    summary: string;
    weather: string;
    icon: number;
    windSpeed: number;
    windDir: string;
    precipitation: number;
    cloudCover: number;
  }>;
  daily: Array<{
    date: Date;
    temperature: { max: number; min: number; day: number };
    summary: string;
    weather: string;
    icon: number;
    windSpeed: number;
    windDir: string;
    precipitation: number;
    precipitationType: string;
    cloudCover: number;
    humidity: number;
  }>;
  location: {
    name: string;
    country: string;
    lat: string;
    lon: string;
    timezone: string;
  };
}

export default function AssessorDashboard() {
  const { toast } = useToast();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    const saved = localStorage.getItem('sidebarCollapsed');
    return saved === 'true';
  });

  // Listen for sidebar collapse state changes
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'sidebarCollapsed') {
        setSidebarCollapsed(e.newValue === 'true');
      }
    };
    
    // Listen for storage events (when sidebar state changes in another component)
    window.addEventListener('storage', handleStorageChange);
    
    // Also listen for custom event (for same-tab changes)
    const handleCustomEvent = () => {
      const saved = localStorage.getItem('sidebarCollapsed');
      setSidebarCollapsed(saved === 'true');
    };
    
    window.addEventListener('sidebarToggle', handleCustomEvent);
    
    // Check periodically as fallback (since storage event doesn't fire for same-tab changes)
    const interval = setInterval(() => {
      const saved = localStorage.getItem('sidebarCollapsed');
      const isCollapsed = saved === 'true';
      if (isCollapsed !== sidebarCollapsed) {
        setSidebarCollapsed(isCollapsed);
      }
    }, 200);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('sidebarToggle', handleCustomEvent);
      clearInterval(interval);
    };
  }, [sidebarCollapsed]);
  const [activePage, setActivePage] = useState("dashboard");
  
  // Get logged-in assessor data from localStorage
  const assessorId = getUserId() || "";
  const assessorPhone = getPhoneNumber() || "";
  const assessorEmail = getEmail() || "";
  // Use email or phone number as display name, or fallback to "Assessor"
  const assessorName = assessorEmail || assessorPhone || "Assessor";
  const [activeView, setActiveView] = useState<"farmers" | "fields" | "farmerFields">("farmers");
  const [selectedFarmer, setSelectedFarmer] = useState<{farmerId: string; farmerName: string; location: string} | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterDialogOpen, setFilterDialogOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [selectedAssessment, setSelectedAssessment] = useState<AssessmentSummary | null>(null);
  const [selectedField, setSelectedField] = useState<Field | null>(null);
  const [viewMode, setViewMode] = useState<"list" | "fieldSelection" | "fieldDetail">("list");
  const [activeTab, setActiveTab] = useState("basic-info");
  const [selectedFarmerForProcessing, setSelectedFarmerForProcessing] = useState<string | null>(null);
  const [showDrawField, setShowDrawField] = useState(false);
  const [calculatedArea, setCalculatedArea] = useState<string>("");
  const [fieldStatus, setFieldStatus] = useState<string>("Awaiting Geometry");
  const [fieldMethod, setFieldMethod] = useState<"upload" | "draw">("upload");
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);
  const [selectedFieldForUpload, setSelectedFieldForUpload] = useState<any | null>(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadingFile, setUploadingFile] = useState(false);
  
  // API state
  const [assessments, setAssessments] = useState<AssessmentSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingAssessment, setUpdatingAssessment] = useState<string | null>(null);
  
  // Farms API state
  const [farms, setFarms] = useState<any[]>([]);
  const [farmsLoading, setFarmsLoading] = useState(false);
  const [farmsError, setFarmsError] = useState<string | null>(null);
  const [selectedFarm, setSelectedFarm] = useState<any | null>(null);
  
  // Farmers list state
  const [farmers, setFarmers] = useState<any[]>([]);
  const [farmersLoading, setFarmersLoading] = useState(false);
  const [farmersError, setFarmersError] = useState<string | null>(null);
  const [expandedFarmers, setExpandedFarmers] = useState<Set<string>>(new Set());
  const [farmerFields, setFarmerFields] = useState<Record<string, any[]>>({});
  const [loadingFields, setLoadingFields] = useState<Record<string, boolean>>({});
  const [selectedFarmerForFields, setSelectedFarmerForFields] = useState<{id: string; name: string} | null>(null);
  const [showFarmerFieldsView, setShowFarmerFieldsView] = useState(false);
  const [weatherForecast, setWeatherForecast] = useState<any | null>(null);
  const [historicalWeather, setHistoricalWeather] = useState<any | null>(null);
  const [vegetationStats, setVegetationStats] = useState<any | null>(null);
  const [loadingWeather, setLoadingWeather] = useState(false);
  const [loadingVegetation, setLoadingVegetation] = useState(false);

  // State for Profile
  const [assessorProfile, setAssessorProfile] = useState<any>(null);
  const [profileLoading, setProfileLoading] = useState(false);

  // State for Crop Monitoring
  const [monitoringData, setMonitoringData] = useState<Record<string, any>>({});
  const [alerts, setAlerts] = useState<any[]>([]);
  const [selectedFarmForMonitoring, setSelectedFarmForMonitoring] = useState<string | null>(null);
  const [selectedFarmerForDetail, setSelectedFarmerForDetail] = useState<any | null>(null);
  const [selectedFarmForDetail, setSelectedFarmForDetail] = useState<any | null>(null);
  const [cropMonitoringViewMode, setCropMonitoringViewMode] = useState<"list" | "fieldDetail">("list");
  const [monitoringLoading, setMonitoringLoading] = useState(false);
  const [alertsLoading, setAlertsLoading] = useState(false);
  const [monitoringError, setMonitoringError] = useState<string | null>(null);

  // Computed values for dashboard stats
  const totalAssessments = assessments.length;
  const totalRiskAssessments = assessments.filter(a => a.type === "Risk Assessment").length;
  const totalClaimAssessments = assessments.filter(a => a.type === "Claim Assessment").length;
  const pendingAssessments = assessments.filter(a => a.status === "Pending").length;

  // Compute metrics for Field Management-style dashboard
  // Use actual farmers list if available, otherwise fall back to unique farmer IDs from assessments
  const uniqueFarmerIds = new Set(assessments.map(a => a.farmerId).filter(Boolean));
  const totalFarmers = farmers.length > 0 ? farmers.length : uniqueFarmerIds.size || 0;
  const totalFields = Array.isArray(farms) ? farms.length : 0;
  const totalArea = Array.isArray(farms) 
    ? farms.reduce((sum, farm) => sum + (farm.area || 0), 0) 
    : 0;
  const activeAssessments = assessments.filter(a => 
    a.status === "Pending" || a.status === "Processing" || a.status === "Under Review"
  ).length;
  
  // Get unique farmers with their data for the table
  // Use actual farmers list if available, otherwise use unique farmer IDs from assessments
  const farmerData = farmers.length > 0 
    ? farmers.map(farmer => {
        const farmerId = farmer._id || farmer.id || '';
        const farmerName = 
          farmer.name || 
          (farmer.firstName && farmer.lastName ? `${farmer.firstName} ${farmer.lastName}`.trim() : '') ||
          farmer.firstName || 
          farmer.lastName || 
          "Unknown Farmer";
        const location = 
          farmer.location || 
          (farmer.province && farmer.district ? `${farmer.province}, ${farmer.district}` : '') ||
          farmer.province ||
          farmer.district ||
          "Unknown Location";
        const farmerFarms = Array.isArray(farms) 
          ? farms.filter(farm => {
              const farmFarmerId = farm.farmerId?._id || farm.farmerId || farm.farmer?._id || farm.farmer?.id || farm.farmer;
              return farmFarmerId === farmerId || farmFarmerId?.toString() === farmerId.toString();
            })
          : [];
        const farmerTotalFields = farmerFarms.length;
        const farmerTotalArea = farmerFarms.reduce((sum, farm) => sum + (farm.area || 0), 0);
        
        return {
          farmerId: `F-${String(farmerId).slice(-3).padStart(3, '0')}`,
          farmerName,
          location,
          totalFields: farmerTotalFields,
          totalArea: farmerTotalArea
        };
      })
    : Array.from(uniqueFarmerIds).map(farmerId => {
        const farmerAssessments = assessments.filter(a => a.farmerId === farmerId);
        const farmerName = farmerAssessments[0]?.farmerName || "Unknown Farmer";
        const location = farmerAssessments[0]?.location || "Unknown Location";
        const farmerFarms = Array.isArray(farms) 
          ? farms.filter(farm => 
              farm.farmerId === farmerId || 
              farm.farmer?._id === farmerId ||
              farm.farmer?.id === farmerId
            )
          : [];
        const farmerTotalFields = farmerFarms.length;
        const farmerTotalArea = farmerFarms.reduce((sum, farm) => sum + (farm.area || 0), 0);
        
        return {
          farmerId: `F-${String(farmerId).slice(-3).padStart(3, '0')}`,
          farmerName,
          location,
          totalFields: farmerTotalFields,
          totalArea: farmerTotalArea
        };
      });

  // Fetch assessments and farms from API
  useEffect(() => {
    loadAssessments();
    loadFarms();
  }, []);

  // Load profile, farmers, and farms when dashboard is shown
  useEffect(() => {
    if (activePage === "dashboard" && assessorId) {
      loadAssessorProfile();
      loadFarmers();
      loadFarms();
    } else if (activePage === "farmers" && assessorId) {
      loadFarmers();
    } else if (activePage === "crop-monitoring" && assessorId) {
      loadFarmers();
      loadFarms();
      loadAlerts();
    }
  }, [activePage, assessorId]);

  const loadAssessorProfile = async () => {
    if (profileLoading) return;
    setProfileLoading(true);
    try {
      const profile = await getUserProfile();
      setAssessorProfile(profile.data || profile);
    } catch (err: any) {
      console.error('Failed to load assessor profile:', err);
    } finally {
      setProfileLoading(false);
    }
  };

  const loadFarmers = async () => {
    setFarmersLoading(true);
    setFarmersError(null);
    try {
      const token = getAuthToken();
      
      // Try the assessments/farmers/list endpoint first
      let farmersUrl = `${API_BASE_URL}/assessments/farmers/list`;
      let response = await fetch(farmersUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` })
        }
      });

      // If that fails, try getting all users and filtering by role
      if (!response.ok) {
        console.log(`⚠️ Assessments farmers endpoint returned ${response.status}, trying users endpoint...`);
        try {
          farmersUrl = `${API_BASE_URL}/users`;
          response = await fetch(farmersUrl, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              ...(token && { Authorization: `Bearer ${token}` })
            }
          });
        } catch (fallbackErr) {
          console.error('Fallback to users endpoint also failed:', fallbackErr);
          throw new Error(`Failed to load farmers: ${response.status}`);
        }
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: `HTTP error! status: ${response.status}` }));
        throw new Error(errorData.message || errorData.error || `Failed to load farmers: ${response.status}`);
      }

      const responseData = await response.json();
      console.log('✅ Farmers list API response:', responseData);
      console.log('📋 Full response structure:', JSON.stringify(responseData, null, 2));
      
      // Handle response - it might be in response.data or directly in response
      let farmersList = responseData.data || responseData.items || responseData || [];
      
      // If we got all users, filter by role "farmer"
      if (Array.isArray(farmersList) && farmersList.length > 0 && farmersList[0].role) {
        farmersList = farmersList.filter((user: any) => 
          user.role?.toLowerCase() === 'farmer' || 
          user.role?.toLowerCase() === 'farmers'
        );
      }
      
      const farmersArray = Array.isArray(farmersList) ? farmersList : [];
      console.log(`✅ Loaded ${farmersArray.length} farmers`);
      
      // Extract fields from each farmer if they exist in the response
      const fieldsMap: Record<string, any[]> = {};
      farmersArray.forEach((farmer: any, index: number) => {
        const farmerId = farmer._id || farmer.id;
        if (farmerId) {
          // Log the structure of the first farmer for debugging
          if (index === 0) {
            console.log('🔍 Sample farmer structure:', {
              _id: farmer._id,
              id: farmer.id,
              name: farmer.name,
              hasFarms: !!farmer.farms,
              hasFields: !!farmer.fields,
              hasFarm: !!farmer.farm,
              farmerKeys: Object.keys(farmer)
            });
          }
          
          // Check for fields in various possible locations
          let fields: any[] = [];
          
          // Try different field locations
          if (farmer.farms && Array.isArray(farmer.farms)) {
            fields = farmer.farms;
          } else if (farmer.fields && Array.isArray(farmer.fields)) {
            fields = farmer.fields;
          } else if (farmer.farm) {
            // Could be single object or array
            fields = Array.isArray(farmer.farm) ? farmer.farm : [farmer.farm];
          } else if (farmer.farmList && Array.isArray(farmer.farmList)) {
            fields = farmer.farmList;
          } else if (farmer.farmDetails && Array.isArray(farmer.farmDetails)) {
            fields = farmer.farmDetails;
          }
          
          // Also check nested structures
          if (fields.length === 0 && farmer.profile) {
            if (farmer.profile.farms && Array.isArray(farmer.profile.farms)) {
              fields = farmer.profile.farms;
            } else if (farmer.profile.fields && Array.isArray(farmer.profile.fields)) {
              fields = farmer.profile.fields;
            }
          }
          
          if (fields && fields.length > 0) {
            fieldsMap[farmerId] = fields;
            console.log(`  📦 Farmer ${farmerId} (${farmer.name || 'Unnamed'}) has ${fields.length} fields from API`);
            if (index === 0) {
              console.log('  📋 Sample field structure:', {
                name: fields[0].name,
                cropType: fields[0].cropType,
                area: fields[0].area,
                fieldKeys: Object.keys(fields[0] || {})
              });
            }
          } else {
            console.log(`  ⚠️ Farmer ${farmerId} (${farmer.name || 'Unnamed'}) has no fields in API response`);
          }
        }
      });
      
      console.log(`📊 Total farmers with fields: ${Object.keys(fieldsMap).length}`);
      
      // Set farmers and their fields
      setFarmers(farmersArray);
      setFarmerFields(fieldsMap);
      
      // Reset expanded state when reloading
      setExpandedFarmers(new Set());
    } catch (err: any) {
      console.error('Failed to load farmers:', err);
      setFarmersError(err.message || 'Failed to load farmers');
      toast({
        title: 'Error loading farmers',
        description: err.message || 'Failed to load farmers',
        variant: 'destructive'
      });
      setFarmers([]);
    } finally {
      setFarmersLoading(false);
    }
  };

  const loadFarmerFields = async (farmerId: string) => {
      // If fields are already loaded from the farmers list API and have data, use them
      if (farmerFields[farmerId] && farmerFields[farmerId].length > 0) {
        console.log(`✅ Using cached fields for farmer ${farmerId}: ${farmerFields[farmerId].length} fields`);
        return;
      }
      
      // Also check if fields are in the farmers array from the API response
      const farmer = farmers.find((f: any) => (f._id || f.id) === farmerId);
      if (farmer) {
        const fieldsFromFarmer = 
          farmer.farms || 
          farmer.fields || 
          farmer.farm || 
          farmer.farmList || 
          farmer.farmDetails ||
          (farmer.profile && (farmer.profile.farms || farmer.profile.fields)) ||
          [];
        
        const fieldsArray = Array.isArray(fieldsFromFarmer) ? fieldsFromFarmer : (fieldsFromFarmer ? [fieldsFromFarmer] : []);
        if (fieldsArray.length > 0) {
          console.log(`✅ Using fields from farmer object for ${farmerId}: ${fieldsArray.length} fields`);
          setFarmerFields(prev => ({ ...prev, [farmerId]: fieldsArray }));
          return;
        }
      }
    
    // Also check if fields might be stored with a different key format
    const farmerIdVariations = [
      farmerId,
      String(farmerId),
      farmerId.toString(),
      farmerId.trim()
    ];
    
    for (const variation of farmerIdVariations) {
      if (farmerFields[variation] && farmerFields[variation].length > 0) {
        console.log(`✅ Using cached fields for farmer ${farmerId} (found with variation: ${variation}): ${farmerFields[variation].length} fields`);
        // Copy to the main key for consistency
        setFarmerFields(prev => ({ ...prev, [farmerId]: farmerFields[variation] }));
        return;
      }
    }
    
    // If cached but empty, log and continue to fetch from API
    if (farmerFields[farmerId] && farmerFields[farmerId].length === 0) {
      console.log(`⚠️ Cached fields for farmer ${farmerId} are empty, fetching from API...`);
    }

    // If not in cache, use the same logic as Farmer Dashboard to fetch farms
    setLoadingFields(prev => ({ ...prev, [farmerId]: true }));
    try {
      // Use the same multi-strategy approach as Farmer Dashboard
      let response: any = null;
      let allFarms: any[] = [];
      
      // Strategy 1: Try page 1 first (API seems to use 1-based indexing based on response)
      console.log(`🔍 Loading fields for farmer ID: ${farmerId} - Trying page 1...`);
      response = await getFarms(1, 100);
      console.log('Farms API Response (page 1):', response);
      
      // Extract farms from response
      if (response?.success && response?.data?.items) {
        allFarms = Array.isArray(response.data.items) ? response.data.items : [];
        console.log('Extracted farms from response.data.items (page 1):', allFarms);
      } else if (Array.isArray(response)) {
        allFarms = response;
      } else if (Array.isArray(response?.data)) {
        allFarms = response.data;
      } else if (Array.isArray(response?.items)) {
        allFarms = response.items;
      } else if (Array.isArray(response?.results)) {
        allFarms = response.results;
      } else if (Array.isArray(response?.farms)) {
        allFarms = response.farms;
      }
      
      // Strategy 2: If page 1 returned empty items but totalItems > 0, try page 0 (0-based indexing)
      if (allFarms.length === 0 && response?.data?.totalItems > 0) {
        console.log('Page 1 returned empty items but totalItems > 0, trying page 0...');
        response = await getFarms(0, 100);
        console.log('Farms API Response (page 0):', response);
        
        if (response?.success && response?.data?.items) {
          allFarms = Array.isArray(response.data.items) ? response.data.items : [];
          console.log('Extracted farms from page 0:', allFarms);
        } else if (Array.isArray(response)) {
          allFarms = response;
        } else if (Array.isArray(response?.data)) {
          allFarms = response.data;
        }
      }
      
      // Strategy 3: Try with larger page size if still empty
      if (allFarms.length === 0 && response?.data?.totalItems > 0) {
        console.log('Trying with larger page size (500)...');
        response = await getFarms(0, 500);
        console.log('Farms API Response (page 0, size 500):', response);
        
        if (response?.success && response?.data?.items) {
          allFarms = Array.isArray(response.data.items) ? response.data.items : [];
          console.log('Extracted farms with larger size:', allFarms);
        }
      }
      
      // Strategy 4: Try without pagination parameters
      if (allFarms.length === 0 && response?.data?.totalItems > 0) {
        console.log('Trying to fetch all farms without pagination...');
        try {
          const noPaginationResponse: any = await getAllFarms();
          console.log('Response without pagination:', noPaginationResponse);
          
          if (noPaginationResponse?.success && noPaginationResponse?.data?.items) {
            allFarms = Array.isArray(noPaginationResponse.data.items) ? noPaginationResponse.data.items : [];
          } else if (Array.isArray(noPaginationResponse)) {
            allFarms = noPaginationResponse;
          } else if (Array.isArray(noPaginationResponse?.data)) {
            allFarms = noPaginationResponse.data;
          } else if (Array.isArray(noPaginationResponse?.items)) {
            allFarms = noPaginationResponse.items;
          }
          
          if (allFarms.length > 0) {
            console.log('Successfully fetched farms without pagination:', allFarms);
          }
        } catch (err) {
          console.warn('Failed to fetch without pagination:', err);
        }
      }
      
      // Strategy 5: Check if data structure has farms at a different location
      if (allFarms.length === 0 && response?.data?.totalItems > 0) {
        console.warn(`⚠️ API reports ${response.data.totalItems} total items but returned empty array.`);
        console.warn('Full response structure:', JSON.stringify(response, null, 2));
        
        // Check if data structure has farms at a different location
        if (response?.data && typeof response.data === 'object') {
          // Check all possible locations for farm data
          const possibleKeys = ['farms', 'results', 'content', 'data'];
          for (const key of possibleKeys) {
            if (Array.isArray(response.data[key])) {
              allFarms = response.data[key];
              console.log(`Found farms array at response.data.${key}:`, allFarms);
              break;
            }
          }
        }
      }
      
      console.log(`📊 Total farms fetched: ${allFarms.length}`);

      console.log(`📊 Total farms fetched: ${allFarms.length}`);
      console.log(`🔑 Looking for farmer ID: ${farmerId}`);

      // Filter farms by farmer ID - try multiple ways to match
      const farmerFarms = allFarms.filter((farm: any) => {
        // Try different ways to get the farmer ID from the farm object
        const farmFarmerId = 
          farm.farmerId?._id || 
          farm.farmerId?.id ||
          farm.farmerId || 
          farm.farmer?._id || 
          farm.farmer?.id ||
          farm.farmer ||
          farm.userId?._id ||
          farm.userId?.id ||
          farm.userId ||
          farm.owner?._id ||
          farm.owner?.id ||
          farm.owner ||
          '';
        
        // Convert both to strings for comparison (normalize)
        const farmFarmerIdStr = String(farmFarmerId || '').trim();
        const targetFarmerIdStr = String(farmerId || '').trim();
        
        // Try exact match first
        let matches = farmFarmerIdStr === targetFarmerIdStr;
        
        // If no match, try comparing last few characters (in case of ID format differences)
        if (!matches && farmFarmerIdStr && targetFarmerIdStr) {
          const farmIdSuffix = farmFarmerIdStr.slice(-6);
          const targetIdSuffix = targetFarmerIdStr.slice(-6);
          matches = farmIdSuffix === targetIdSuffix && farmIdSuffix.length >= 4;
        }
        
        // Log all farms for debugging (not just first 3)
        if (allFarms.length <= 20 || matches) {
          console.log(`  Farm "${farm.name || 'Unnamed'}":`, {
            farmFarmerId: farmFarmerIdStr,
            targetFarmerId: targetFarmerIdStr,
            matches,
            farmStructure: {
              farmerId: farm.farmerId,
              farmer: farm.farmer,
              userId: farm.userId,
              owner: farm.owner
            }
          });
        }
        
        return matches;
      });

      console.log(`✅ Found ${farmerFarms.length} farms for farmer ${farmerId}`);
      if (farmerFarms.length > 0) {
        console.log('Sample farm:', {
          name: farmerFarms[0].name,
          cropType: farmerFarms[0].cropType,
          farmerId: farmerFarms[0].farmerId,
          farmer: farmerFarms[0].farmer,
          _id: farmerFarms[0]._id,
          id: farmerFarms[0].id
        });
      } else {
        console.warn(`⚠️ No farms found for farmer ${farmerId} after filtering ${allFarms.length} total farms`);
        console.warn('Farmer ID being searched:', farmerId);
        console.warn('Sample of all farms (first 3):', allFarms.slice(0, 3).map(f => ({
          name: f.name,
          farmerId: f.farmerId,
          farmer: f.farmer,
          userId: f.userId,
          owner: f.owner
        })));
      }

      setFarmerFields(prev => ({ ...prev, [farmerId]: farmerFarms }));
    } catch (err: any) {
      console.error(`❌ Failed to load fields for farmer ${farmerId}:`, err);
      setFarmerFields(prev => ({ ...prev, [farmerId]: [] }));
    } finally {
      setLoadingFields(prev => ({ ...prev, [farmerId]: false }));
    }
  };

  const handleFarmerRowClick = (farmerId: string) => {
    // Always show fields when clicked (no toggle)
    const newExpanded = new Set(expandedFarmers);
    if (!newExpanded.has(farmerId)) {
      newExpanded.add(farmerId);
      // Load fields when clicking
      loadFarmerFields(farmerId);
    }
    setExpandedFarmers(newExpanded);
  };

  const toggleFarmerExpansion = (farmerId: string) => {
    const newExpanded = new Set(expandedFarmers);
    if (newExpanded.has(farmerId)) {
      newExpanded.delete(farmerId);
    } else {
      newExpanded.add(farmerId);
      // Load fields when expanding
      loadFarmerFields(farmerId);
    }
    setExpandedFarmers(newExpanded);
  };

  const handleViewFarmerFields = (farmer: any) => {
    const farmerId = farmer._id || farmer.id;
    if (!farmerId) {
      console.warn('Cannot view fields for farmer without ID');
      return;
    }
    const farmerName = 
      farmer.name || 
      (farmer.firstName && farmer.lastName ? `${farmer.firstName} ${farmer.lastName}`.trim() : '') ||
      farmer.firstName || 
      farmer.lastName || 
      "Unknown";
    
    setSelectedFarmerForFields({ id: farmerId, name: farmerName });
    setShowFarmerFieldsView(true);
    
    // Load fields if not already loaded
    const farmerIdKey = farmerId;
    if (!farmerFields[farmerIdKey] || farmerFields[farmerIdKey].length === 0) {
      loadFarmerFields(farmerId);
    }
  };

  const renderFarmerFieldsView = () => {
    if (!selectedFarmerForFields) return null;

    const farmerIdKey = selectedFarmerForFields.id;
    const farmerFieldsList = farmerFields[farmerIdKey] || [];
    const isLoadingFields = loadingFields[farmerIdKey] || false;

    return (
      <div className="min-h-screen bg-gray-50 pt-6 pb-8">
        <div className={`${sidebarCollapsed ? 'max-w-full' : 'max-w-7xl'} mx-auto px-6`}>
          {/* Breadcrumb Navigation */}
          <div className="mb-6">
            <div className="flex items-center gap-2 text-sm">
              <button
                onClick={() => {
                  setShowFarmerFieldsView(false);
                  setSelectedFarmerForFields(null);
                }}
                className="text-green-600 hover:text-green-700 font-medium"
              >
                All Farmers
              </button>
              <span className="text-gray-400">/</span>
              <span className="text-gray-900 font-medium">{selectedFarmerForFields.name}</span>
            </div>
          </div>

          {/* Fields Table */}
          <Card className={`${dashboardTheme.card}`}>
            <CardHeader>
              <CardTitle className="text-gray-900">Fields</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {isLoadingFields ? (
                <div className="flex items-center justify-center py-12">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-green-500 mx-auto mb-4"></div>
                    <p className="text-sm text-gray-600">Loading fields...</p>
                  </div>
                </div>
              ) : farmerFieldsList.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-sm text-gray-500">No fields found for this farmer</p>
                  <p className="text-xs text-gray-400 mt-1">Farmer ID: {selectedFarmerForFields.id}</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-50 border-b-2 border-gray-200">
                        <th className="text-left py-4 px-6 font-semibold text-gray-700 text-sm uppercase tracking-wider">Field ID</th>
                        <th className="text-left py-4 px-6 font-semibold text-gray-700 text-sm uppercase tracking-wider">Farmer</th>
                        <th className="text-left py-4 px-6 font-semibold text-gray-700 text-sm uppercase tracking-wider">Crop</th>
                        <th className="text-left py-4 px-6 font-semibold text-gray-700 text-sm uppercase tracking-wider">Area (ha)</th>
                        <th className="text-left py-4 px-6 font-semibold text-gray-700 text-sm uppercase tracking-wider">Season</th>
                        <th className="text-left py-4 px-6 font-semibold text-gray-700 text-sm uppercase tracking-wider">Status</th>
                        <th className="text-left py-4 px-6 font-semibold text-gray-700 text-sm uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {farmerFieldsList.map((field, fieldIndex) => {
                        const fieldId = field._id || field.id || '';
                        const displayFieldId = fieldId ? `FLD-${String(fieldId).slice(-3).padStart(3, '0')}` : 'Not processed';
                        const isProcessed = field.status && field.status !== 'PENDING' && field.status !== 'Processing Needed' && field.status !== '';
                        const season = field.season || field.seasonType || 'N/A';
                        
                        return (
                          <tr
                            key={field._id || field.id || fieldIndex}
                            className="hover:bg-gray-50/50 transition-all duration-150"
                          >
                            <td className="py-4 px-6 whitespace-nowrap">
                              <div className={`text-sm font-medium ${isProcessed ? 'text-gray-900' : 'text-gray-400'}`}>
                                {displayFieldId}
                              </div>
                            </td>
                            <td className="py-4 px-6 whitespace-nowrap">
                              <div className="text-sm text-gray-900">{selectedFarmerForFields.name}</div>
                            </td>
                            <td className="py-4 px-6 whitespace-nowrap">
                              <div className="flex items-center gap-2 text-sm text-gray-600">
                                <Leaf className="h-4 w-4 text-green-500 flex-shrink-0" />
                                <span>{field.cropType || field.crop || "N/A"}</span>
                              </div>
                            </td>
                            <td className="py-4 px-6 whitespace-nowrap">
                              <div className="text-sm text-gray-600">
                                {field.area ? `${field.area} ha` : field.size ? `${field.size} ha` : "N/A"}
                              </div>
                            </td>
                            <td className="py-4 px-6 whitespace-nowrap">
                              <div className="text-sm text-gray-600">{season}</div>
                            </td>
                            <td className="py-4 px-6 whitespace-nowrap">
                              {isProcessed ? (
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-green-500 text-white border border-green-600">
                                  Processed
                                </span>
                              ) : (
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-orange-500 text-white border border-orange-600">
                                  Processing Needed
                                </span>
                              )}
                            </td>
                            <td className="py-4 px-6 whitespace-nowrap">
                              {isProcessed ? (
                                <Button
                                  onClick={() => {
                                    // Handle view data action
                                    const farmId = field._id || field.id;
                                    if (farmId) {
                                      // Navigate to field details or open data view
                                      console.log('View data for field:', farmId);
                                    }
                                  }}
                                  size="sm"
                                  variant="outline"
                                  className="h-8 px-3 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-medium border-gray-300 !rounded-none"
                                >
                                  <Eye className="h-3 w-3 mr-1.5" />
                                  View Data
                                </Button>
                              ) : (
                                <Button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedFieldForUpload(field);
                                    setShowUploadModal(true);
                                  }}
                                  size="sm"
                                  className="h-8 px-3 bg-green-600 hover:bg-green-700 text-white text-xs font-medium !rounded-none"
                                >
                                  <Settings className="h-3 w-3 mr-1.5" />
                                  Process
                                </Button>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    );
  };

  const loadAssessments = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log('🔍 Loading assessments for assessor:', assessorId);
      console.log('📍 API Endpoint: GET /api/v1/assessments');
      console.log('🔑 Auth Token:', localStorage.getItem('token') ? 'Present ✓' : 'Missing ✗');
      
      const response: any = await assessmentsApiService.getAllAssessments();
      console.log('📥 Assessments API raw response:', response);
      
      // Map API response to AssessmentSummary format
      // Adjust mapping based on actual API response structure
      let assessmentsData: any[] = [];
      if (Array.isArray(response)) {
        assessmentsData = response;
      } else if (response && typeof response === 'object') {
        const responseObj = response as { data?: any[]; assessments?: any[]; success?: boolean };
        assessmentsData = responseObj.data || responseObj.assessments || [];
      }
      
      console.log('📊 Extracted assessments data:', assessmentsData);
      console.log('📊 Number of assessments:', assessmentsData.length);
      
      if (assessmentsData.length === 0) {
        console.warn('⚠️ No assessments found. Possible reasons:');
        console.warn('   1. No assessments created yet');
        console.warn('   2. No assessments assigned to this assessor');
        console.warn('   3. Assessor ID mismatch');
        console.warn('   Current Assessor ID:', assessorId);
      }
      
      // Helper function to get farmer name directly from assessment API response
      const getFarmerName = (item: any): string => {
        // Try all possible paths in the assessment response (API should populate farmer data)
        const farmerName = 
          item.farmerName || 
          item.farmer?.name || 
          item.farm?.farmerName ||
          item.farm?.farmer?.name ||
          item.farm?.farmerId?.name ||
          (item.farmer?.firstName && item.farmer?.lastName 
            ? `${item.farmer.firstName} ${item.farmer.lastName}`.trim()
            : '') ||
          (item.farm?.farmerId?.firstName && item.farm?.farmerId?.lastName
            ? `${item.farm.farmerId.firstName} ${item.farm.farmerId.lastName}`.trim()
            : '') ||
          item.farmer?.firstName || 
          item.farmer?.lastName ||
          item.farm?.farmerId?.firstName ||
          item.farm?.farmerId?.lastName ||
          '';
        
        if (!farmerName) {
          console.warn('⚠️ Could not find farmer name in assessment response:', {
            assessmentId: item._id || item.id,
            hasFarmer: !!item.farmer,
            hasFarm: !!item.farm,
            availableFields: Object.keys(item),
            farmFields: item.farm ? Object.keys(item.farm) : 'no farm object',
            farmerFields: item.farmer ? Object.keys(item.farmer) : 'no farmer object'
          });
        }
        
        return farmerName || 'Unknown Farmer';
      };
      
      // Map assessments - extract data directly from API response (no async calls needed)
      const mappedAssessments = assessmentsData.map((item: any) => {
        // Extract farmerId - handle case where farmId/farmerId might be an object
        let farmerId = '';
        
        // Priority 1: Direct farmerId field
        if (item.farmerId) {
          if (typeof item.farmerId === 'object') {
            farmerId = item.farmerId._id || item.farmerId.id || '';
          } else {
            farmerId = item.farmerId;
          }
        }
        // Priority 2: From farm object
        else if (item.farm) {
          if (item.farm.farmerId) {
            farmerId = typeof item.farm.farmerId === 'object' 
              ? (item.farm.farmerId._id || item.farm.farmerId.id || '') 
              : item.farm.farmerId;
          } else if (item.farm.farmer) {
            farmerId = typeof item.farm.farmer === 'object'
              ? (item.farm.farmer._id || item.farm.farmer.id || '')
              : item.farm.farmer;
          }
        }
        // Priority 3: From farmId field (might be a farm reference)
        else if (item.farmId) {
          if (typeof item.farmId === 'object') {
            // Check if farmId object has farmerId
            if (item.farmId.farmerId) {
              farmerId = typeof item.farmId.farmerId === 'object' 
                ? (item.farmId.farmerId._id || item.farmId.farmerId.id || '') 
                : item.farmId.farmerId;
            } else {
              // farmId might be the farm itself, try to get farmerId from it
              farmerId = item.farmId._id || item.farmId.id || '';
            }
          } else {
            // farmId is a string ID, we'll need to fetch the farm to get farmerId
            // For now, we'll try to use it as farmerId if no other option
            farmerId = item.farmId;
          }
        }
        
        console.log(`🔍 Extracted farmerId for assessment ${item._id || item.id}: ${farmerId || 'NOT FOUND'}`);
        
        // Get farmer name directly from assessment API response
        const farmerName = getFarmerName(item);
        
        // Helper function to extract location directly from assessment API response
        const getLocation = (item: any): string => {
          let location = '';
          
          // Check direct location field
          if (item.location) {
            if (typeof item.location === 'string') {
              location = item.location;
            } else if (item.location.coordinates && Array.isArray(item.location.coordinates)) {
              // Format coordinates as "lat, lng"
              location = `${item.location.coordinates[1]?.toFixed(4)}, ${item.location.coordinates[0]?.toFixed(4)}`;
            } else if (item.location.address) {
              location = item.location.address;
            }
          }
          
          // Check farm location (API should populate farm data)
          if (!location && item.farm) {
            if (item.farm.location) {
              if (typeof item.farm.location === 'string') {
                location = item.farm.location;
              } else if (item.farm.location.coordinates && Array.isArray(item.farm.location.coordinates)) {
                // Format coordinates as "lat, lng" (coordinates are [lng, lat] in GeoJSON)
                location = `${item.farm.location.coordinates[1]?.toFixed(4)}, ${item.farm.location.coordinates[0]?.toFixed(4)}`;
              } else if (item.farm.location.address) {
                location = item.farm.location.address;
              }
            }
            if (!location && item.farm.address) {
              location = item.farm.address;
            }
          }
          
          // Check farmId object location (if farmId is populated)
          if (!location && item.farmId && typeof item.farmId === 'object') {
            if (item.farmId.location) {
              if (typeof item.farmId.location === 'string') {
                location = item.farmId.location;
              } else if (item.farmId.location.coordinates && Array.isArray(item.farmId.location.coordinates)) {
                location = `${item.farmId.location.coordinates[1]?.toFixed(4)}, ${item.farmId.location.coordinates[0]?.toFixed(4)}`;
              } else if (item.farmId.location.address) {
                location = item.farmId.location.address;
              }
            }
            if (!location && item.farmId.address) {
              location = item.farmId.address;
            }
          }
          
          return location || 'Location not available';
        };
        
        const location = getLocation(item);
        
        return {
          id: item._id || item.id || '',
          farmerId,
          farmerName,
          location,
          type: item.type || 'Risk Assessment',
          status: item.status || 'Pending',
          date: item.createdAt ? new Date(item.createdAt).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]
        };
      });
      
      console.log('✅ Mapped assessments:', mappedAssessments);
      setAssessments(mappedAssessments);
      
      if (mappedAssessments.length > 0) {
        toast({
          title: "Assessments Loaded",
          description: `Successfully loaded ${mappedAssessments.length} assessment(s)`,
        });
      }
    } catch (err: any) {
      console.error('❌ Failed to load assessments:', err);
      // Handle 401 errors more gracefully - check if it's an auth error
      if (err.message && err.message.includes('Authentication required')) {
        setError('Authentication required. Please log in to view assessments.');
        toast({
          title: "Authentication Required",
          description: "Your session has expired. Please log in again.",
          variant: "destructive",
        });
      } else {
        setError(err.message || 'Failed to load assessments. Please try again.');
        toast({
          title: "Load Failed",
          description: err.message || "Failed to load assessments. Please try again.",
          variant: "destructive",
        });
      }
      // Keep empty array on error, or show error message
    } finally {
      setLoading(false);
    }
  };

  // Load farms from API
  const loadFarms = async () => {
    setFarmsLoading(true);
    setFarmsError(null);
    try {
      // Try different pagination strategies to handle API inconsistencies
      let response: any = null;
      let farmsArray: any[] = [];
      
      // Strategy 1: Try page 1 first (API seems to use 1-based indexing based on response)
      console.log('Trying page 1...');
      response = await getFarms(1, 100);
      console.log('Farms API Response (page 1):', response);
      
      // Extract farms from response
      if (response?.success && response?.data?.items) {
        farmsArray = Array.isArray(response.data.items) ? response.data.items : [];
        console.log('Extracted farms from response.data.items (page 1):', farmsArray);
        console.log('Pagination info:', {
          currentPage: response.data.currentPage,
          totalItems: response.data.totalItems,
          totalPages: response.data.totalPages
        });
      } else if (Array.isArray(response)) {
        farmsArray = response;
      } else if (Array.isArray(response?.data)) {
        farmsArray = response.data;
      } else if (Array.isArray(response?.items)) {
        farmsArray = response.items;
      } else if (Array.isArray(response?.results)) {
        farmsArray = response.results;
      } else if (Array.isArray(response?.farms)) {
        farmsArray = response.farms;
      }
      
      // Strategy 2: If page 1 returned empty items but totalItems > 0, try page 0 (0-based indexing)
      if (farmsArray.length === 0 && response?.data?.totalItems > 0) {
        console.log('Page 1 returned empty items but totalItems > 0, trying page 0...');
        response = await getFarms(0, 100);
        console.log('Farms API Response (page 0):', response);
        
        if (response?.success && response?.data?.items) {
          farmsArray = Array.isArray(response.data.items) ? response.data.items : [];
          console.log('Extracted farms from page 0:', farmsArray);
        } else if (Array.isArray(response)) {
          farmsArray = response;
        } else if (Array.isArray(response?.data)) {
          farmsArray = response.data;
        }
      }
      
      // Strategy 3: Try with larger page size if still empty
      if (farmsArray.length === 0 && response?.data?.totalItems > 0) {
        console.log('Trying with larger page size (500)...');
        response = await getFarms(0, 500);
        console.log('Farms API Response (page 0, size 500):', response);
        
        if (response?.success && response?.data?.items) {
          farmsArray = Array.isArray(response.data.items) ? response.data.items : [];
          console.log('Extracted farms with larger size:', farmsArray);
        }
      }
      
      // Strategy 4: Try without pagination parameters
      if (farmsArray.length === 0 && response?.data?.totalItems > 0) {
        console.log('Trying to fetch all farms without pagination...');
        try {
          const noPaginationResponse: any = await getAllFarms();
          console.log('Response without pagination:', noPaginationResponse);
          
          if (noPaginationResponse?.success && noPaginationResponse?.data?.items) {
            farmsArray = Array.isArray(noPaginationResponse.data.items) ? noPaginationResponse.data.items : [];
          } else if (Array.isArray(noPaginationResponse)) {
            farmsArray = noPaginationResponse;
          } else if (Array.isArray(noPaginationResponse?.data)) {
            farmsArray = noPaginationResponse.data;
          } else if (Array.isArray(noPaginationResponse?.items)) {
            farmsArray = noPaginationResponse.items;
          }
          
          if (farmsArray.length > 0) {
            console.log('Successfully fetched farms without pagination:', farmsArray);
          }
        } catch (err) {
          console.warn('Failed to fetch without pagination:', err);
        }
      }
      
      // Strategy 5: Check if data structure has farms at a different location
      if (farmsArray.length === 0 && response?.data?.totalItems > 0) {
        console.warn(`⚠️ API reports ${response.data.totalItems} total items but returned empty array.`);
        console.warn('Full response structure:', JSON.stringify(response, null, 2));
        
        // Check if data structure has farms at a different location
        if (response?.data && typeof response.data === 'object') {
          // Check all possible locations for farm data
          const possibleKeys = ['farms', 'results', 'content', 'data'];
          for (const key of possibleKeys) {
            if (Array.isArray(response.data[key])) {
              farmsArray = response.data[key];
              console.log(`Found farms array at response.data.${key}:`, farmsArray);
              break;
            }
          }
        }
      }
      
      console.log('Final extracted farms array:', farmsArray);
      
      setFarms(farmsArray);
      
      if (farmsArray.length === 0) {
        if (response?.data?.totalItems > 0) {
          console.error('❌ API reports farms exist but none were returned. This is likely a backend pagination bug.');
          setFarmsError(`API reports ${response.data.totalItems} farms exist but none were returned. Please contact support.`);
          toast({
            title: 'Data Loading Issue',
            description: `The API reports ${response.data.totalItems} farms but none are being returned. This may be a server-side issue.`,
            variant: 'destructive'
          });
        } else {
          console.log('No farms found. This could mean:');
          console.log('1. No farms exist in the system');
          console.log('2. The API is filtering and no farms match');
          console.log('3. There might be a pagination issue');
        }
      }
    } catch (err: any) {
      console.error('Failed to load farms:', err);
      setFarmsError(err.message || 'Failed to load farms');
      toast({
        title: 'Error loading farms',
        description: err.message || 'Failed to load farms',
        variant: 'destructive'
      });
      setFarms([]);
    } finally {
      setFarmsLoading(false);
    }
  };

  // Load farms when component mounts or when assessment is selected
  useEffect(() => {
    if (selectedAssessment) {
      loadFarms();
    }
  }, [selectedAssessment]);

  // Convert farms to fields format for display
  const getFieldsForAssessment = (assessment: AssessmentSummary): Field[] => {
    // Defensive check: ensure farms is an array
    if (!Array.isArray(farms)) {
      console.warn('farms is not an array:', farms);
      return [];
    }
    
    // Filter farms by farmer name or farmerId
    const relevantFarms = farms.filter(farm => 
      farm.farmerName === assessment.farmerName || 
      farm.farmerId === assessment.farmerId ||
      farm.farmer?.name === assessment.farmerName ||
      farm.farmer?._id === assessment.farmerId
    );
    
    return relevantFarms.map((farm: any) => ({
      id: farm._id || farm.id || '',
      farmerName: farm.farmerName || farm.farmer?.name || assessment.farmerName,
      crop: farm.cropType || 'Unknown',
      area: farm.area || 0,
      season: farm.season || 'N/A',
      status: farm.status || 'Active',
      fieldName: farm.name || 'Unnamed Field',
      sowingDate: farm.sowingDate || farm.createdAt ? new Date(farm.createdAt).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]
    }));
  };

  const getFieldDetails = (field: Field): FieldDetail => {
    // Defensive check: ensure farms is an array
    if (!Array.isArray(farms)) {
      console.warn('farms is not an array in getFieldDetails:', farms);
      return {
        fieldId: field.id,
        fieldName: field.fieldName,
        farmer: field.farmerName,
        cropType: field.crop,
        area: field.area,
        season: field.season,
        sowingDate: field.sowingDate,
        location: assessments.find(a => a.farmerName === field.farmerName)?.location || ""
      };
    }
    
    // Find the farm data for this field
    const farmData = farms.find(farm => (farm._id || farm.id) === field.id);
    
    return {
      fieldId: field.id,
      fieldName: field.fieldName,
      farmer: field.farmerName,
      cropType: field.crop,
      area: field.area,
      season: field.season,
      sowingDate: field.sowingDate,
      location: farmData?.location?.coordinates 
        ? `${farmData.location.coordinates[1]}, ${farmData.location.coordinates[0]}`
        : assessments.find(a => a.farmerName === field.farmerName)?.location || ""
    };
  };

  // Load weather data for selected farm/field
  const loadFarmWeatherData = async (farmId: string) => {
    if (!farmId) return;
    
    setLoadingWeather(true);
    try {
      const today = new Date();
      const endDate = new Date();
      endDate.setDate(today.getDate() + 7);
      
      const startDateStr = today.toISOString().split('T')[0];
      const endDateStr = endDate.toISOString().split('T')[0];
      
      // Load forecast
      const forecast = await getWeatherForecast(farmId, startDateStr, endDateStr);
      setWeatherForecast(forecast.data || forecast);
      
      // Load historical (last 30 days)
      const historicalStart = new Date();
      historicalStart.setDate(today.getDate() - 30);
      const historical = await getHistoricalWeather(farmId, historicalStart.toISOString().split('T')[0], startDateStr);
      setHistoricalWeather(historical.data || historical);
      
    } catch (err: any) {
      console.error('Failed to load farm weather data:', err);
      toast({
        title: "Error",
        description: err.message || 'Failed to load weather data',
        variant: "destructive",
      });
    } finally {
      setLoadingWeather(false);
    }
  };

  // Load vegetation statistics for selected farm/field
  const loadVegetationStats = async (farmId: string) => {
    if (!farmId) return;
    
    setLoadingVegetation(true);
    try {
      const today = new Date();
      const startDate = new Date();
      startDate.setDate(today.getDate() - 30);
      
      const startDateStr = startDate.toISOString().split('T')[0];
      const endDateStr = today.toISOString().split('T')[0];
      
      const stats = await getVegetationStats(farmId, startDateStr, endDateStr, 'NDVI,MSAVI');
      setVegetationStats(stats.data || stats);
      
    } catch (err: any) {
      console.error('Failed to load vegetation stats:', err);
      toast({
        title: "Error",
        description: err.message || 'Failed to load vegetation statistics',
        variant: "destructive",
      });
    } finally {
      setLoadingVegetation(false);
    }
  };

  // Load farm data when field is selected
  useEffect(() => {
    if (selectedField) {
      const farmId = selectedField.id;
      setSelectedFarm(null);
      loadFarmWeatherData(farmId);
      loadVegetationStats(farmId);
      
      // Load full farm details
      getFarmById(farmId).then((farm: any) => {
        setSelectedFarm(farm.data || farm);
      }).catch((err: any) => {
        console.error('Failed to load farm details:', err);
      });
    }
  }, [selectedField]);

  // Weather Analysis Component
  const WeatherAnalysisTab = ({ location }: { location: string }) => {
    const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

    useEffect(() => {
      loadWeatherData();
    }, []);

    const loadWeatherData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const data = await meteosourceApiService.getCompleteWeatherData('kigali');
        setWeatherData(data);
        setLastUpdated(new Date());
      } catch (err: any) {
        console.error('Failed to load weather data:', err);
        setError(`Failed to load weather forecast: ${err.message || 'Unknown error'}`);
      } finally {
        setLoading(false);
      }
    };

    const getWeatherIcon = (summary: string) => {
      const summaryLower = summary.toLowerCase();
      if (summaryLower.includes('clear') || summaryLower.includes('sunny')) {
        return <Sun className="h-8 w-8 text-green-500" />;
      } else if (summaryLower.includes('cloudy') || summaryLower.includes('overcast')) {
        return <Cloud className="h-8 w-8 text-gray-500" />;
      } else if (summaryLower.includes('rain') || summaryLower.includes('drizzle')) {
        return <CloudRain className="h-8 w-8 text-green-500" />;
      } else {
        return <Cloud className="h-8 w-8 text-gray-400" />;
      }
    };

    const formatTime = (date: Date) => date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const formatDate = (date: Date) => date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });

    if (loading) {
      return (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
            <p className="text-gray-900/60">Loading weather data...</p>
          </div>
        </div>
      );
    }

    if (error || !weatherData) {
      return (
        <Card className={`${dashboardTheme.card}`}>
          <CardContent className="p-6">
            <div className="text-center text-green-400">
              <Cloud className="h-12 w-12 mx-auto mb-4" />
              <p>{error || 'Failed to load weather data'}</p>
              <Button 
                onClick={loadWeatherData} 
                className="mt-4 bg-green-600 hover:bg-green-700 text-white !rounded-none"
              >
                Retry
              </Button>
            </div>
          </CardContent>
        </Card>
      );
    }

    return (
      <div className="space-y-6">
        <Card className={`${dashboardTheme.card}`}>
          <CardHeader>
            <CardTitle className="flex items-center justify-between text-gray-900">
              <div className="flex items-center">
                <CloudRain className="h-5 w-5 mr-2" />
                Current Weather
              </div>
              {lastUpdated && (
                <span className="text-xs text-gray-900/60">Updated: {formatTime(lastUpdated)}</span>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                {getWeatherIcon(weatherData.current.summary)}
                <div>
                  <div className="text-4xl font-bold text-gray-900">
                    {weatherData.current.temperature}°C
                  </div>
                  <div className="text-lg text-gray-600 capitalize">
                    {weatherData.current.summary}
                  </div>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-gray-200">
              <div className="flex items-center text-gray-900/80">
                <Wind className="h-5 w-5 mr-2 text-green-500" />
                <div>
                  <div className="text-xs text-gray-600">Wind</div>
                  <div className="font-medium text-gray-700">{weatherData.current.windSpeed} km/h</div>
                </div>
              </div>
              <div className="flex items-center text-gray-900/80">
                <Droplets className="h-5 w-5 mr-2 text-green-500" />
                <div>
                  <div className="text-xs text-gray-600">Humidity</div>
                  <div className="font-medium text-gray-700">{weatherData.current.humidity}%</div>
                </div>
              </div>
              <div className="flex items-center text-gray-900/80">
                <CloudRain className="h-5 w-5 mr-2 text-cyan-500" />
                <div>
                  <div className="text-xs text-gray-600">Precipitation</div>
                  <div className="font-medium text-gray-700">{weatherData.current.precipitation}mm</div>
                </div>
              </div>
              <div className="flex items-center text-gray-900/80">
                <Thermometer className="h-5 w-5 mr-2 text-green-500" />
                <div>
                  <div className="text-xs text-gray-600">Pressure</div>
                  <div className="font-medium text-gray-700">{weatherData.current.pressure} hPa</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className={`${dashboardTheme.card}`}>
          <CardHeader>
            <CardTitle className="flex items-center text-gray-900">
              <Clock className="h-5 w-5 mr-2" />
              8-Hour Forecast
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <div className="flex gap-4">
                {weatherData.hourly.map((hour, idx) => (
                  <div key={idx} className="min-w-[100px] text-center">
                    <div className="text-gray-600 text-sm mb-2 font-medium">{formatTime(hour.time)}</div>
                    <div className="flex justify-center mb-2">
                      {getWeatherIcon(hour.summary)}
                    </div>
                    <div className="text-gray-900 font-bold mb-1">{hour.temperature}°</div>
                    <div className="text-gray-600 text-xs capitalize">{hour.summary}</div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className={`${dashboardTheme.card}`}>
          <CardHeader>
            <CardTitle className="flex items-center text-gray-900">
              <Calendar className="h-5 w-5 mr-2" />
              7-Day Forecast
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Date</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Temp (°C)</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Rain (mm)</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Humidity</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Clouds</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Wind</th>
                  </tr>
                </thead>
                <tbody>
                  {weatherData.daily.map((day, idx) => (
                    <tr key={idx} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                      <td className="py-4 px-4 text-gray-700 font-medium">{formatDate(day.date)}</td>
                      <td className="py-4 px-4 text-gray-700">
                        <span className="font-bold">{day.temperature.max}°</span> / <span>{day.temperature.min}°</span>
                      </td>
                      <td className="py-4 px-4 text-gray-700">{day.precipitation}</td>
                      <td className="py-4 px-4 text-gray-700">{day.humidity}%</td>
                      <td className="py-4 px-4 text-gray-600">{day.icon < 2 ? '30%' : day.icon < 3 ? '45%' : day.icon < 4 ? '60%' : '75%'}</td>
                      <td className="py-4 px-4 text-gray-700">{day.windSpeed} m/s</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Historical Weather Charts */}
        {(() => {
          // Generate historical data for year 2025
          const generateHistoricalData = () => {
            const data = [];
            const startDate = new Date('2025-01-01');
            const endDate = new Date('2025-12-29');
            
            for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
              const dateStr = d.toISOString().split('T')[0];
              const month = d.getMonth();
              const dayOfYear = d.getDate() + (d.getMonth() * 30);
              
              // Generate precipitation (lower in summer, higher in rainy seasons)
              let precipitation = 0;
              const rand = Math.random();
              // Simulate rainy seasons
              if (month === 0 || month === 1 || month === 2 || month === 9 || month === 10 || month === 11) {
                precipitation = rand > 0.3 ? Math.random() * 40 : 0;
              } else {
                precipitation = rand > 0.7 ? Math.random() * 25 : 0;
              }
              
              // Generate temperatures with seasonal variation
              const baseTemp = 20 + 10 * Math.sin((dayOfYear - 80) / 365 * 2 * Math.PI);
              const maxTemp = baseTemp + 5 + Math.random() * 5;
              const minTemp = baseTemp - 5 - Math.random() * 5;
              
              data.push({
                date: dateStr,
                dateLabel: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                precipitation: Math.round(precipitation * 10) / 10,
                maxTemp: Math.round(maxTemp * 100) / 100,
                minTemp: Math.round(minTemp * 100) / 100
              });
            }
            
            return data;
          };
          
          const historicalData = generateHistoricalData();
          
          return (
            <>
              <Card className={`${dashboardTheme.card}`}>
                <CardHeader>
                  <CardTitle className="text-gray-900">Daily precipitation, mm</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={historicalData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
                      <XAxis 
                        dataKey="dateLabel" 
                        tick={{ fill: '#9CA3AF', fontSize: 12 }}
                        tickCount={12}
                        interval="preserveStartEnd"
                        stroke="#4B5563"
                      />
                      <YAxis 
                        label={{ value: 'Precipitation (mm)', angle: -90, position: 'insideLeft', style: { fill: '#9CA3AF' } }}
                        tick={{ fill: '#9CA3AF', fontSize: 12 }}
                        domain={[0, 40]}
                        stroke="#4B5563"
                      />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#1F2937', 
                          border: '1px solid #374151', 
                          borderRadius: '6px',
                          color: '#F3F4F6'
                        }}
                        labelStyle={{ color: '#9CA3AF' }}
                      />
                      <Legend wrapperStyle={{ color: '#F3F4F6' }} />
                      <Bar 
                        dataKey="precipitation" 
                        fill="#06B6D4" 
                        name="2025"
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className={`${dashboardTheme.card}`}>
                <CardHeader>
                  <CardTitle className="text-gray-900">Daily temperatures, °C</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={historicalData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
                      <XAxis 
                        dataKey="dateLabel" 
                        tick={{ fill: '#9CA3AF', fontSize: 12 }}
                        tickCount={12}
                        interval="preserveStartEnd"
                        stroke="#4B5563"
                      />
                      <YAxis 
                        label={{ value: 'Temperature (°C)', angle: -90, position: 'insideLeft', style: { fill: '#9CA3AF' } }}
                        tick={{ fill: '#9CA3AF', fontSize: 12 }}
                        domain={[0, 40]}
                        stroke="#4B5563"
                      />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#1F2937', 
                          border: '1px solid #374151', 
                          borderRadius: '6px',
                          color: '#F3F4F6'
                        }}
                        labelStyle={{ color: '#9CA3AF' }}
                      />
                      <Legend wrapperStyle={{ color: '#F3F4F6' }} />
                      <Line 
                        type="monotone" 
                        dataKey="maxTemp" 
                        stroke="#06B6D4" 
                        strokeWidth={2}
                        name="2025 Max t°C"
                        dot={false}
                        activeDot={{ r: 6 }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="minTemp" 
                        stroke="#0891B2" 
                        strokeWidth={2}
                        name="2025 Min t°C"
                        dot={false}
                        activeDot={{ r: 6 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </>
          );
        })()}
      </div>
    );
  };

  // Crop Analysis Component
  const CropAnalysisTab = ({ fieldDetails }: { fieldDetails: FieldDetail }) => {
    const [dataSource, setDataSource] = useState<string>("drone");
    const [selectedFile, setSelectedFile] = useState<string>("");
    const [flightDate, setFlightDate] = useState<string>("2025-10-22");
    const [manualDate, setManualDate] = useState<string>("2025-10-28");
    const [assessorNotes, setAssessorNotes] = useState<string>("Weed clusters in north. Pest minimal.");
    const [mapTileLayer, setMapTileLayer] = useState<"osm" | "satellite" | "terrain">("satellite");
    const [selectedIndex, setSelectedIndex] = useState<string>("ndvi");
    
    // Manual input metrics state
    const [stressDetected, setStressDetected] = useState<number[]>([17.6]);
    const [soilMoisture, setSoilMoisture] = useState<number[]>([58]);
    const [weedArea, setWeedArea] = useState<number[]>([7.3]);
    const [pestArea, setPestArea] = useState<number[]>([4.4]);
    
    // Parse location coordinates if available
    const parseCoordinates = (location: string): [number, number] => {
      if (location.includes(',')) {
        const parts = location.split(',');
        const lat = parseFloat(parts[0]?.trim() || "-1.9441");
        const lng = parseFloat(parts[1]?.trim() || "30.0619");
        return [lat, lng];
      }
      return [-1.9441, 30.0619]; // Default: Kigali, Rwanda
    };
    
    const mapCenter = parseCoordinates(fieldDetails.location);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        setSelectedFile(file.name);
        
        // Upload file to farms API if it's a shapefile or KML
        try {
          const fileExtension = file.name.split('.').pop()?.toLowerCase();
          if (fileExtension === 'kml' || fileExtension === 'kmz') {
            // Note: uploadKML now requires farmId - this code path needs a farmId
            // For now, show a message that this feature needs to be updated
            toast({
              title: "Info",
              description: "Please use the Process button in the field status column to upload KML files",
            });
          } else if (fileExtension === 'shp' || fileExtension === 'zip') {
            await uploadShapefile(file);
            toast({
              title: "Success",
              description: "Shapefile uploaded successfully",
            });
          }
        } catch (err: any) {
          console.error('File upload failed:', err);
          toast({
            title: "Upload Failed",
            description: err.message || 'Failed to upload file',
            variant: "destructive",
          });
        }
      }
    };

    const handleSave = () => {
      console.log('Saving crop analysis...');
    };

    const handleDownload = () => {
      console.log('Downloading crop analysis...');
    };

    return (
      <div className="space-y-6">
        {/* Field Summary */}
        <Card className={`${dashboardTheme.card}`}>
          <CardHeader>
            <CardTitle className="text-gray-900">Field Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-gray-600 mb-1 font-medium">Farmer</p>
                <p className="text-gray-700 font-medium">{fieldDetails.farmer}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1 font-medium">Crop</p>
                <p className="text-gray-700 font-medium">{fieldDetails.cropType}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1 font-medium">Area</p>
                <p className="text-gray-700 font-medium">{fieldDetails.area} ha</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Data Source */}
        <Card className={`${dashboardTheme.card}`}>
          <CardHeader>
            <CardTitle className="text-gray-900">Data Source</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs value={dataSource} onValueChange={setDataSource}>
              <TabsList className={`${dashboardTheme.card} border border-gray-200 w-fit`}>
                <TabsTrigger 
                  value="drone" 
                  className="data-[state=active]:bg-gray-200 data-[state=active]:text-gray-900 text-gray-700"
                >
                  Drone Upload
                </TabsTrigger>
                <TabsTrigger 
                  value="manual" 
                  className="data-[state=active]:bg-gray-200 data-[state=active]:text-gray-900 text-gray-700"
                >
                  Manual Check
                </TabsTrigger>
              </TabsList>

              <TabsContent value="drone" className="mt-6">
                <div className="space-y-6">
                  {/* Drone Data Upload */}
                  <div>
                    <Label className="text-gray-900 mb-2 block">Drone Data Upload</Label>
                    <p className="text-sm text-gray-900/60 mb-4">Upload JSON or GeoJSON</p>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-green-500 transition-colors">
                      <Upload className="h-12 w-12 mx-auto mb-4 text-gray-900/40" />
                      <p className="text-gray-900 mb-2">Drag file here or click to browse</p>
                      {!selectedFile && (
                        <p className="text-sm text-gray-900/60 mb-4">No file chosen</p>
                      )}
                      <input
                        type="file"
                        id="drone-upload"
                        className="hidden"
                        accept=".json,.geojson"
                        onChange={handleFileChange}
                      />
                      <Button
                        onClick={() => document.getElementById('drone-upload')?.click()}
                        className="bg-green-600 hover:bg-green-700 text-white !rounded-none"
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        Choose File
                      </Button>
                      {selectedFile && (
                        <div className="mt-4 p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
                          <p className="text-gray-900/80 text-sm">File selected: {selectedFile}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Flight Date */}
                  <div>
                    <Label htmlFor="flight-date" className="text-gray-900 mb-2 block">Flight Date</Label>
                    <Input
                      id="flight-date"
                      type="date"
                      value={flightDate}
                      onChange={(e) => setFlightDate(e.target.value)}
                      className={`${dashboardTheme.input} border-gray-300`}
                    />
                  </div>

                  {/* Drone Metrics */}
                  <div>
                    <Label className="text-gray-900 mb-4 block">Drone Metrics</Label>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                      <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                        <p className="text-xs text-gray-600 mb-1 font-medium">Healthy Area</p>
                        <p className="text-xl font-bold text-gray-700">2.8 ha</p>
                      </div>
                      <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                        <p className="text-xs text-gray-600 mb-1 font-medium">Stress Detected</p>
                        <p className="text-xl font-bold text-gray-700">17.6%</p>
                      </div>
                      <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                        <p className="text-xs text-gray-600 mb-1 font-medium">Soil Moisture</p>
                        <p className="text-xl font-bold text-gray-700">58%</p>
                      </div>
                      <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                        <p className="text-xs text-gray-600 mb-1 font-medium">Weed Area</p>
                        <p className="text-xl font-bold text-gray-700">0.25 ha</p>
                        <p className="text-xs text-gray-500">(7.3%)</p>
                      </div>
                      <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                        <p className="text-xs text-gray-600 mb-1 font-medium">Pest Area</p>
                        <p className="text-xl font-bold text-gray-700">0.15 ha</p>
                        <p className="text-xs text-gray-500">(4.4%)</p>
                      </div>
                    </div>
                  </div>

                  {/* Field Visualization */}
                  <div>
                    <Label className="text-gray-900 mb-4 block">Field Visualization</Label>
                    <Card className={`${dashboardTheme.card} border border-gray-200`}>
                      <CardHeader>
                        <div className="flex items-center justify-between flex-wrap gap-4">
                          <div>
                            <p className="text-gray-900 font-medium">Map View</p>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                              <Label className="text-sm text-gray-700">Layer:</Label>
                              <Select value={mapTileLayer} onValueChange={(value) => setMapTileLayer(value as "osm" | "satellite" | "terrain")}>
                                <SelectTrigger className={`${dashboardTheme.select} w-32`}>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent className={dashboardTheme.card}>
                                  <SelectItem value="satellite">Satellite</SelectItem>
                                  <SelectItem value="osm">Street</SelectItem>
                                  <SelectItem value="terrain">Terrain</SelectItem>
                              </SelectContent>
                            </Select>
                            </div>
                            <div className="flex items-center gap-2">
                              <Label className="text-sm text-gray-700">Index:</Label>
                              <Select value={selectedIndex} onValueChange={setSelectedIndex}>
                                <SelectTrigger className={`${dashboardTheme.select} w-48`}>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent className={dashboardTheme.card}>
                                  <SelectItem value="ndvi">🌱 NDVI</SelectItem>
                                  <SelectItem value="evi">🌿 EVI</SelectItem>
                                  <SelectItem value="savi">🌾 SAVI</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="relative">
                          <LeafletMap
                            center={mapCenter}
                            zoom={15}
                            height="400px"
                            tileLayer={mapTileLayer}
                            showControls={true}
                            className="w-full rounded-lg"
                          />
                          {/* Legend */}
                          <div className="absolute bottom-4 left-4 bg-white/90 border border-gray-200 rounded-lg p-4 z-[1000]">
                            <p className="text-gray-900 font-medium mb-3">Vegetation Health Index</p>
                            <div className="space-y-2">
                              <div className="flex items-center gap-2">
                                <div className="w-4 h-4 bg-green-500 rounded"></div>
                                <span className="text-gray-900 text-sm">Healthy</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <div className="w-4 h-4 bg-green-500 rounded"></div>
                                <span className="text-gray-900 text-sm">Moderate</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <div className="w-4 h-4 bg-green-500 rounded"></div>
                                <span className="text-gray-900 text-sm">Stress</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Assessor Notes */}
                  <div>
                    <Label htmlFor="notes" className="text-gray-900 mb-2 block">Assessor Notes</Label>
                    <Textarea
                      id="notes"
                      value={assessorNotes}
                      onChange={(e) => setAssessorNotes(e.target.value)}
                      className={`${dashboardTheme.input} border-gray-300 min-h-[100px]`}
                      placeholder="Enter your notes here..."
                    />
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-4">
                    <Button
                      onClick={handleSave}
                      className="bg-green-600 hover:bg-green-700 text-white flex-1 !rounded-none"
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Save Analysis
                    </Button>
                    <Button
                      onClick={handleDownload}
                      variant="outline"
                      className="border-gray-300 text-gray-900 hover:bg-gray-100 flex-1 !rounded-none"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download Summary JSON
                    </Button>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="manual" className="mt-6">
                <div className="space-y-6">
                  {/* Manual Assessment Date */}
                  <div>
                    <Label className="text-gray-900 mb-2 block">Manual Assessment Date</Label>
                    <p className="text-sm text-gray-900/60 mb-2">Physical Check Date:</p>
                    <Input
                      id="manual-date"
                      type="date"
                      value={manualDate}
                      onChange={(e) => setManualDate(e.target.value)}
                      className={`${dashboardTheme.input} border-gray-300`}
                    />
                  </div>

                  {/* Manual Input Metrics */}
                  <div>
                    <Label className="text-gray-900 mb-4 block">Manual Input Metrics</Label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 space-y-3 hover:border-green-500/50 transition-colors">
                        <div className="flex items-center justify-between mb-2">
                          <p className="text-sm text-gray-900/80 font-medium">Stress Detected</p>
                          <p className="text-2xl font-bold text-gray-700">{stressDetected[0].toFixed(1)}%</p>
                        </div>
                        <Slider
                          value={stressDetected}
                          onValueChange={setStressDetected}
                          max={100}
                          min={0}
                          step={0.1}
                          className="w-full [&_[role=slider]]:bg-green-500 [&_[role=slider]]:border-green-400 [&_[role=slider]]:shadow-lg [&_[role=slider]]:shadow-green-500/20 [&>span[data-range]]:bg-green-500"
                        />
                        <div className="flex justify-between text-xs text-gray-900/40">
                          <span>0%</span>
                          <span>50%</span>
                          <span>100%</span>
                        </div>
                      </div>
                      <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 space-y-3 hover:border-green-500/50 transition-colors">
                        <div className="flex items-center justify-between mb-2">
                          <p className="text-sm text-gray-900/80 font-medium">Soil Moisture</p>
                          <p className="text-2xl font-bold text-gray-700">{soilMoisture[0].toFixed(1)}%</p>
                        </div>
                        <Slider
                          value={soilMoisture}
                          onValueChange={setSoilMoisture}
                          max={100}
                          min={0}
                          step={0.1}
                          className="w-full [&_[role=slider]]:bg-green-500 [&_[role=slider]]:border-green-400 [&_[role=slider]]:shadow-lg [&_[role=slider]]:shadow-green-500/20 [&>span[data-range]]:bg-green-500"
                        />
                        <div className="flex justify-between text-xs text-gray-900/40">
                          <span>0%</span>
                          <span>50%</span>
                          <span>100%</span>
                        </div>
                      </div>
                      <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 space-y-3 hover:border-green-500/50 transition-colors">
                        <div className="flex items-center justify-between mb-2">
                          <p className="text-sm text-gray-900/80 font-medium">Weed Area (Estimated)</p>
                          <p className="text-2xl font-bold text-gray-700">{weedArea[0].toFixed(1)}%</p>
                        </div>
                        <Slider
                          value={weedArea}
                          onValueChange={setWeedArea}
                          max={100}
                          min={0}
                          step={0.1}
                          className="w-full [&_[role=slider]]:bg-green-500 [&_[role=slider]]:border-green-400 [&_[role=slider]]:shadow-lg [&_[role=slider]]:shadow-green-500/20 [&>span[data-range]]:bg-green-500"
                        />
                        <div className="flex justify-between text-xs text-gray-900/40">
                          <span>0%</span>
                          <span>50%</span>
                          <span>100%</span>
                        </div>
                      </div>
                      <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 space-y-3 hover:border-green-500/50 transition-colors">
                        <div className="flex items-center justify-between mb-2">
                          <p className="text-sm text-gray-900/80 font-medium">Pest Area (Estimated)</p>
                          <p className="text-2xl font-bold text-gray-700">{pestArea[0].toFixed(1)}%</p>
                        </div>
                        <Slider
                          value={pestArea}
                          onValueChange={setPestArea}
                          max={100}
                          min={0}
                          step={0.1}
                          className="w-full [&_[role=slider]]:bg-green-500 [&_[role=slider]]:border-green-400 [&_[role=slider]]:shadow-lg [&_[role=slider]]:shadow-green-500/20 [&>span[data-range]]:bg-green-500"
                        />
                        <div className="flex justify-between text-xs text-gray-900/40">
                          <span>0%</span>
                          <span>50%</span>
                          <span>100%</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Field Reference Map */}
                  <div>
                    <Label className="text-gray-900 mb-4 block">Field Reference Map</Label>
                    <Card className={`${dashboardTheme.card} border border-gray-200`}>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-gray-900 font-medium">Map View</p>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="border border-gray-200 rounded-lg overflow-hidden">
                          <LeafletMap
                            center={mapCenter}
                            zoom={15}
                            height="400px"
                            tileLayer="satellite"
                            showControls={true}
                            className="w-full"
                          />
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Assessor Notes */}
                  <div>
                    <Label htmlFor="manual-notes" className="text-gray-900 mb-2 block">Assessor Notes</Label>
                    <Textarea
                      id="manual-notes"
                      value={assessorNotes}
                      onChange={(e) => setAssessorNotes(e.target.value)}
                      className={`${dashboardTheme.input} border-gray-300 min-h-[100px]`}
                      placeholder="Enter your notes here..."
                    />
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-4">
                    <Button
                      onClick={handleSave}
                      className="bg-green-600 hover:bg-green-700 text-white flex-1 !rounded-none"
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Save Analysis
                    </Button>
                    <Button
                      onClick={handleDownload}
                      variant="outline"
                      className="border-gray-300 text-gray-900 hover:bg-gray-100 flex-1 !rounded-none"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download Summary JSON
                    </Button>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    );
  };

  // Get status color based on status value
  const getStatusColor = (status: string) => {
    const statusLower = status.toLowerCase();
    switch (statusLower) {
      case "approved":
      case "completed":
        return "bg-green-500 text-white border-green-600";
      case "pending":
        return "bg-green-600 text-white border-green-700";
      case "submitted":
        return "bg-green-600 text-white border-green-700";
      case "under review":
      case "processing":
        return "bg-green-600 text-white border-green-700";
      case "rejected":
        return "bg-green-600 text-white border-green-700";
      default:
        return "bg-gray-500 text-white border-gray-600";
    }
  };

  // Filter assessments based on current filters
  const filteredAssessments = assessments.filter(assessment => {
    // Search filter
    const matchesSearch = searchQuery === "" ||
      assessment.farmerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      assessment.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      assessment.location.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Status filter
    const matchesStatus = statusFilter === "all" || assessment.status === statusFilter;
    
    // Type filter
    const matchesType = typeFilter === "all" || assessment.type === typeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  });
  
  // Filter farmers/fields based on search
  const filteredFarmerData = farmerData.filter(farmer => {
    const matchesSearch = searchQuery === "" ||
      farmer.farmerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      farmer.farmerId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      farmer.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });
  
  // Filter fields based on search
  const filteredFields = Array.isArray(farms) ? farms.filter(farm => {
    const matchesSearch = searchQuery === "" ||
      (farm.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (farm.farmerName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (farm.cropType || '').toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  }) : [];
  
  console.log('🔍 Filter results:', {
    totalAssessments: assessments.length,
    filteredAssessments: filteredAssessments.length,
    searchQuery,
    statusFilter,
    typeFilter
  });

  // Clear all filters
  const clearFilters = () => {
    setStatusFilter("all");
    setTypeFilter("all");
    setSearchQuery("");
  };

  // Handle status change
  const handleStatusChange = async (assessmentId: string, newStatus: string) => {
    if (newStatus === "Processing") {
      // Find the assessment to get the farmer name
      const assessment = assessments.find(a => a.id === assessmentId);
      if (assessment) {
        setSelectedFarmerForProcessing(assessment.farmerName);
        setShowDrawField(true);
        // Update locally for immediate UI feedback
        setAssessments(assessments.map(assessment => 
          assessment.id === assessmentId 
            ? { ...assessment, status: newStatus }
            : assessment
        ));
      }
    } else {
      // Update via API
      setUpdatingAssessment(assessmentId);
      try {
        await assessmentsApiService.updateAssessment(assessmentId, { status: newStatus });
        // Update local state after successful API call
        setAssessments(assessments.map(assessment => 
          assessment.id === assessmentId 
            ? { ...assessment, status: newStatus }
            : assessment
        ));
      } catch (err: any) {
        console.error('Failed to update assessment:', err);
        toast({
          title: "Update Failed",
          description: err.message || "Failed to update assessment. Please try again.",
          variant: "destructive",
        });
        // Reload assessments to revert to original state
        loadAssessments();
      } finally {
        setUpdatingAssessment(null);
      }
    }
  };

  // Handle calculate risk score
  const handleCalculateRisk = async (assessmentId: string) => {
    setUpdatingAssessment(assessmentId);
    try {
      const response = await assessmentsApiService.calculateRiskScore(assessmentId);
      console.log('Risk calculated:', response);
      // Reload assessments to get updated risk score
      await loadAssessments();
      toast({
        title: "Success",
        description: "Risk score calculated successfully!",
        variant: "default",
      });
    } catch (err: any) {
      console.error('Failed to calculate risk:', err);
      toast({
        title: "Calculation Failed",
        description: err.message || "Failed to calculate risk score. Please try again.",
        variant: "destructive",
      });
    } finally {
      setUpdatingAssessment(null);
    }
  };

  // Handle submit assessment
  const handleSubmitAssessment = async (assessmentId: string) => {
    setUpdatingAssessment(assessmentId);
    try {
      const response = await assessmentsApiService.submitAssessment(assessmentId);
      console.log('Assessment submitted:', response);
      // Reload assessments to get updated status
      await loadAssessments();
      toast({
        title: "Success",
        description: "Assessment submitted successfully!",
        variant: "default",
      });
    } catch (err: any) {
      console.error('Failed to submit assessment:', err);
      toast({
        title: "Submission Failed",
        description: err.message || "Failed to submit assessment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setUpdatingAssessment(null);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const fileNames = Array.from(files).map(file => file.name);
      setUploadedFiles(fileNames);
      
      // Upload files to farms API
      for (const file of Array.from(files)) {
        try {
          const fileExtension = file.name.split('.').pop()?.toLowerCase();
          if (fileExtension === 'kml' || fileExtension === 'kmz') {
            // Note: uploadKML now requires farmId - this code path needs a farmId
            // For now, skip KML uploads from this handler
            console.warn('KML upload requires farmId - use the Process button in field status column');
          } else if (fileExtension === 'shp' || fileExtension === 'zip' || fileExtension === 'dbf' || fileExtension === 'shx') {
            // For shapefiles, upload the zip file
            if (fileExtension === 'zip') {
              await uploadShapefile(file);
            }
          }
        } catch (err: any) {
          console.error(`Failed to upload ${file.name}:`, err);
          toast({
            title: "Upload Failed",
            description: `Failed to upload ${file.name}: ${err.message || 'Unknown error'}`,
            variant: "destructive",
          });
        }
      }
      
      if (files.length > 0) {
        toast({
          title: "Success",
          description: `${files.length} file(s) uploaded successfully`,
        });
        // Reload farms after upload
        await loadFarms();
      }
    }
  };

  const handlePolygonComplete = () => {
    // When polygon is drawn, calculate area and update status
    const mockArea = "2.3 ha"; // This would be calculated from the polygon
    setCalculatedArea(mockArea);
    setFieldStatus("Ready to Sync");
  };

  const handleKMLUpload = async (file: File) => {
    if (!selectedFieldForUpload) {
      toast({
        title: "Error",
        description: "No field selected for upload",
        variant: "destructive",
      });
      return;
    }

    const farmId = selectedFieldForUpload._id || selectedFieldForUpload.id;
    if (!farmId) {
      toast({
        title: "Error",
        description: "Field ID not found",
        variant: "destructive",
      });
      return;
    }

    setUploadingFile(true);
    try {
      console.log('📤 Starting KML upload for farm:', farmId);
      console.log('📄 File details:', { name: file.name, size: file.size, type: file.type });
      
      await uploadKML(file, farmId);
      
      console.log('✅ KML upload successful');
      toast({
        title: "Success",
        description: "KML file uploaded successfully",
      });
      
      // Reload farms to update status
      await loadFarms();
      // Reload farmer fields for all expanded farmers
      for (const farmerId of expandedFarmers) {
        await loadFarmerFields(farmerId);
      }
      setShowUploadModal(false);
      setSelectedFieldForUpload(null);
      setSelectedFieldForUpload(null);
    } catch (err: any) {
      console.error('❌ Failed to upload KML:', err);
      console.error('❌ Error details:', {
        message: err.message,
        stack: err.stack,
        farmId: farmId,
        fileName: file.name
      });
      toast({
        title: "Upload Failed",
        description: err.message || 'Failed to upload KML file. Please check the console for details.',
        variant: "destructive",
      });
    } finally {
      setUploadingFile(false);
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const fileExtension = file.name.split('.').pop()?.toLowerCase();
    if (fileExtension !== 'kml' && fileExtension !== 'kmz') {
      toast({
        title: "Invalid File",
        description: "Please select a KML or KMZ file",
        variant: "destructive",
      });
      return;
    }

    await handleKMLUpload(file);
    // Reset input
    e.target.value = '';
  };

  const handleSyncField = async () => {
    if (!selectedFarmerForProcessing) {
      toast({
        title: "Error",
        description: "Please select a farmer first",
        variant: "destructive",
      });
      return;
    }

    try {
      if (fieldMethod === "draw") {
        // When drawing, create farm with boundary coordinates
        // Note: This is a placeholder - you'll need to get actual coordinates from the map drawing
        const farmData = {
          name: `Farm for ${selectedFarmerForProcessing}`,
          location: {
            type: "Point",
            coordinates: [30.0619, -1.9441] // Default coordinates - should come from map
          },
          boundary: {
            type: "Polygon",
            coordinates: [[[30.0619, -1.9441], [30.0625, -1.9435], [30.0612, -1.9438], [30.0619, -1.9441]]] // Default boundary - should come from map
          },
          cropType: "MAIZE"
        };

        await createFarm(farmData);
        toast({
          title: "Success",
          description: "Farm created successfully",
        });
      } else if (fieldMethod === "upload") {
        // Files are already uploaded via handleFileUpload
        // After upload, we might need to create a farm record
        if (uploadedFiles.length > 0) {
          toast({
            title: "Success",
            description: "Farm boundaries uploaded successfully. Farm record will be created from uploaded files.",
          });
        }
      }

      // Reload farms after creation
      await loadFarms();
      setShowDrawField(false);
      setCalculatedArea("");
      setFieldStatus("Awaiting Geometry");
      setUploadedFiles([]);
    } catch (err: any) {
      console.error('Failed to sync field:', err);
      toast({
        title: "Error",
        description: err.message || 'Failed to create farm',
        variant: "destructive",
      });
    }
  };

  const handleAssessmentClick = async (assessment: AssessmentSummary) => {
    setSelectedAssessment(assessment);
    setViewMode("fieldSelection");
    
    // Load full assessment details from API
    try {
      const fullAssessment: any = await assessmentsApiService.getAssessmentById(assessment.id);
      console.log('Full assessment details:', fullAssessment);
      // Update selected assessment with full details if needed
      if (fullAssessment && typeof fullAssessment === 'object' && !Array.isArray(fullAssessment)) {
        setSelectedAssessment(Object.assign({}, assessment, fullAssessment) as AssessmentSummary);
      }
    } catch (err: any) {
      console.error('Failed to load assessment details:', err);
      toast({
        title: "Warning",
        description: err.message || "Could not load full assessment details. Showing summary only.",
        variant: "default",
      });
      // Continue with summary data even if full details fail
    }
  };

  const handleFieldClick = (field: Field) => {
    setSelectedField(field);
    setViewMode("fieldDetail");
  };

  const handleBackToList = () => {
    setViewMode("list");
    setSelectedAssessment(null);
    setSelectedField(null);
  };

  const handleFarmerClick = (farmer: {farmerId: string; farmerName: string; location: string}) => {
    setSelectedFarmer(farmer);
    setActiveView("farmerFields");
  };

  const handleBackToFarmers = () => {
    setActiveView("farmers");
    setSelectedFarmer(null);
  };

  const handleBackToFields = () => {
    setViewMode("fieldSelection");
    setSelectedField(null);
  };

  // Get fields for selected farmer
  const getFarmerFields = () => {
    if (!selectedFarmer) return [];
    
    // Find the original farmer ID from assessments
    const assessmentForFarmer = assessments.find(a => a.farmerName === selectedFarmer.farmerName);
    const originalFarmerId = assessmentForFarmer?.farmerId || selectedFarmer.farmerId.replace('F-', '');
    
    const farmerFarms = Array.isArray(farms) 
      ? farms.filter(farm => {
          const farmFarmerId = farm.farmerId || farm.farmer?._id || farm.farmer?.id || '';
          return farmFarmerId === originalFarmerId ||
                 farmFarmerId === selectedFarmer.farmerId ||
                 farm.farmerName === selectedFarmer.farmerName;
        })
      : [];
    
    return farmerFarms.map((farm: any, index: number) => {
      const fieldId = farm._id || farm.id;
      const isProcessed = farm.status === 'Processed' || farm.status === 'processed' || (farm.boundary && farm.boundary.coordinates);
      
      return {
        id: fieldId || `temp-${index}`,
        fieldId: fieldId ? `FLD-${String(fieldId).slice(-3).padStart(3, '0')}` : "Not processed",
        farmerName: farm.farmerName || selectedFarmer.farmerName,
        crop: farm.cropType || farm.crop || "Unknown",
        area: farm.area || 0,
        season: farm.season || (index % 2 === 0 ? "A" : "B"),
        status: isProcessed ? "Processed" : "Processing Needed",
        rawFarm: farm
      };
    });
  };

  // Render Farmer Fields View
  const renderFarmerFields = () => {
    if (!selectedFarmer) return null;
    const fields = getFarmerFields();
    
    return (
      <div className="min-h-screen bg-gray-50 pt-6 pb-8">
        <div className={`${sidebarCollapsed ? 'max-w-full' : 'max-w-7xl'} mx-auto px-6 space-y-4`}>
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm">
            <button 
              onClick={handleBackToFarmers}
              className="text-gray-600 hover:text-gray-700"
            >
              All Farmers
            </button>
            <span className="text-gray-900/60">/</span>
            <span className="text-gray-900">{selectedFarmer.farmerName}</span>
          </div>

          {/* Table */}
          <Card className="bg-white border border-gray-200 shadow-sm">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b-2 border-gray-200">
                    <th className="text-left py-2.5 px-4 font-semibold text-gray-700 text-xs uppercase tracking-wider">Field ID</th>
                    <th className="text-left py-2.5 px-4 font-semibold text-gray-700 text-xs uppercase tracking-wider">Farmer</th>
                    <th className="text-left py-2.5 px-4 font-semibold text-gray-700 text-xs uppercase tracking-wider">Crop</th>
                    <th className="text-left py-2.5 px-4 font-semibold text-gray-700 text-xs uppercase tracking-wider">Area (ha)</th>
                    <th className="text-left py-2.5 px-4 font-semibold text-gray-700 text-xs uppercase tracking-wider">Season</th>
                    <th className="text-left py-2.5 px-4 font-semibold text-gray-700 text-xs uppercase tracking-wider">Status</th>
                    <th className="text-left py-2.5 px-4 font-semibold text-gray-700 text-xs uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {fields.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-8 text-center text-sm text-gray-600">
                        No fields found for this farmer
                      </td>
                    </tr>
                  ) : (
                    fields.map((field, index) => (
                      <tr
                        key={field.id}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="py-2.5 px-4 whitespace-nowrap">
                          <div className={`text-sm font-medium ${
                            field.fieldId === "Not processed" 
                              ? "text-gray-400" 
                              : "text-gray-900"
                          }`}>
                            {field.fieldId}
                          </div>
                        </td>
                        <td className="py-2.5 px-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{field.farmerName}</div>
                        </td>
                        <td className="py-2.5 px-4 whitespace-nowrap">
                          <div className="flex items-center gap-1.5 text-sm text-gray-600">
                            <Sprout className="h-3.5 w-3.5 text-green-500 flex-shrink-0" />
                            <span>{field.crop}</span>
                          </div>
                        </td>
                        <td className="py-2.5 px-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{field.area.toFixed(1)} ha</div>
                        </td>
                        <td className="py-2.5 px-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{field.season}</div>
                        </td>
                        <td className="py-2.5 px-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold border ${
                            field.status === "Processed"
                              ? "bg-green-50 text-green-700 border-green-200"
                              : "bg-green-50 text-green-700 border-green-200"
                          }`}>
                            {field.status}
                          </span>
                        </td>
                        <td className="py-2.5 px-4 whitespace-nowrap">
                          {field.status === "Processed" ? (
                            <Button
                              onClick={(e) => {
                                e.stopPropagation();
                                const farmField: Field = {
                                  id: field.rawFarm._id || field.rawFarm.id,
                                  farmerName: field.farmerName,
                                  crop: field.crop,
                                  area: field.area,
                                  season: field.season,
                                  status: field.status,
                                  fieldName: field.rawFarm.name || "Field",
                                  sowingDate: field.rawFarm.sowingDate || ""
                                };
                                handleFieldClick(farmField);
                              }}
                              size="sm"
                              className="bg-green-600 hover:bg-green-700 text-white h-8 !rounded-none"
                            >
                              <Eye className="h-3.5 w-3.5 mr-1.5" />
                              View Data
                            </Button>
                          ) : (
                            <Button
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedFarmerForProcessing(field.farmerName);
                                setShowDrawField(true);
                              }}
                              size="sm"
                              className="bg-green-600 hover:bg-green-700 text-white h-8 !rounded-none"
                            >
                              <Edit className="h-3.5 w-3.5 mr-1.5" />
                              Process
                            </Button>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
        </div>
      </div>
    );
  };

  // Field Selection View
  const renderFieldSelection = () => {
    if (!selectedAssessment) return null;
    const fields = getFieldsForAssessment(selectedAssessment);
    
    return (
      <div className="min-h-screen bg-gray-50 pt-6 pb-8">
        <div className={`${sidebarCollapsed ? 'max-w-full' : 'max-w-7xl'} mx-auto px-6 space-y-6`}>
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm">
          <button 
            onClick={handleBackToList}
            className="text-gray-600 hover:text-gray-700"
          >
            All Assessments
          </button>
          <span className="text-gray-900/60">/</span>
          <span className="text-gray-900">{selectedAssessment.farmerName}</span>
        </div>

        {/* Table */}
        <Card className={`${dashboardTheme.card}`}>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-4 px-6 font-medium text-gray-900/80">Farmer</th>
                    <th className="text-left py-4 px-6 font-medium text-gray-900/80">Crop</th>
                    <th className="text-left py-4 px-6 font-medium text-gray-900/80">Area (ha)</th>
                    <th className="text-left py-4 px-6 font-medium text-gray-900/80">Season</th>
                    <th className="text-left py-4 px-6 font-medium text-gray-900/80">Status</th>
                    <th className="text-left py-4 px-6 font-medium text-gray-900/80">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {fields.map((field, index) => (
                    <tr
                      key={field.id}
                      className={`border-b border-gray-200 hover:bg-gray-50 transition-colors ${
                        index % 2 === 0 ? "bg-gray-50/30" : ""
                      }`}
                    >
                      <td className="py-4 px-6 text-gray-900">{field.farmerName}</td>
                      <td className="py-4 px-6 text-gray-900">
                        <div className="flex items-center gap-2">
                          <Leaf className="h-4 w-4 text-green-500" />
                          {field.crop}
                        </div>
                      </td>
                      <td className="py-4 px-6 text-gray-900">{Math.round(field.area)} ha</td>
                      <td className="py-4 px-6 text-gray-900">{field.season}</td>
                      <td className="py-4 px-6">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          field.status === "Processed"
                            ? "bg-green-500/20 text-green-600 border border-green-500/30"
                            : "bg-green-500/20 text-green-400 border border-green-500/30"
                        }`}>
                          {field.status}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        {field.status === "Processed" ? (
                          <Button
                            onClick={() => handleFieldClick(field)}
                            className="bg-gray-200 hover:bg-gray-300 text-gray-900 border border-gray-300 !rounded-none"
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            View Data
                          </Button>
                        ) : (
                          <Button
                            onClick={() => handleFieldClick(field)}
                            className="bg-gray-200 hover:bg-gray-300 text-gray-900 border border-gray-300 !rounded-none"
                          >
                            <Edit className="h-4 w-4 mr-2" />
                            Process
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
        </div>
      </div>
    );
  };

  // Field Detail View
  const renderFieldDetail = () => {
    if (!selectedField) return null;
    const fieldDetails = getFieldDetails(selectedField);

    return (
      <div className="min-h-screen bg-gray-50 pt-6 pb-8">
        <div className={`${sidebarCollapsed ? 'max-w-full' : 'max-w-7xl'} mx-auto px-6 space-y-6`}>
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm">
          <button 
            onClick={handleBackToList}
            className="text-gray-600 hover:text-gray-700"
          >
            All Assessments
          </button>
          <span className="text-gray-900/60">/</span>
          <button 
            onClick={handleBackToFields}
            className="text-gray-600 hover:text-gray-700"
          >
            {selectedAssessment?.farmerName}
          </button>
        </div>
        
        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold text-gray-900">
            Field Detail View
          </h1>
          <p className="text-gray-900/70 mt-2">
            <span className="text-gray-700">{fieldDetails.farmer}</span> - <span className="text-gray-700">{fieldDetails.cropType}</span>
          </p>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className={`${dashboardTheme.card} border border-gray-200`}>
            <TabsTrigger 
              value="basic-info" 
              className="data-[state=active]:bg-gray-200 data-[state=active]:text-gray-900 text-gray-700"
            >
              <FileSpreadsheet className="h-4 w-4 mr-2" />
              Basic Info
            </TabsTrigger>
            <TabsTrigger 
              value="weather" 
              className="data-[state=active]:bg-gray-200 data-[state=active]:text-gray-900 text-gray-700"
            >
              <CloudRain className="h-4 w-4 mr-2" />
              Weather Analysis
            </TabsTrigger>
            <TabsTrigger 
              value="crop" 
              className="data-[state=active]:bg-gray-200 data-[state=active]:text-gray-900 text-gray-700"
            >
              <Leaf className="h-4 w-4 mr-2" />
              Crop Analysis
            </TabsTrigger>
            <TabsTrigger 
              value="overview" 
              className="data-[state=active]:bg-gray-200 data-[state=active]:text-gray-900 text-gray-700"
            >
              <FileText className="h-4 w-4 mr-2" />
              Overview
            </TabsTrigger>
          </TabsList>

          {/* Tab Contents */}
          <TabsContent value="basic-info" className="mt-6">
            <div className="grid gap-6 md:grid-cols-2">
              {/* Field Information */}
              <Card className={`${dashboardTheme.card}`}>
                <CardHeader>
                  <CardTitle className="text-gray-900">Field Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center border-b border-gray-200 pb-3">
                    <span className="text-gray-600">Field Name</span>
                    <span className="text-gray-700 font-medium">{fieldDetails.fieldName}</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-gray-200 pb-3">
                    <span className="text-gray-600">Farmer</span>
                    <span className="text-gray-700 font-medium">{fieldDetails.farmer}</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-gray-200 pb-3">
                    <span className="text-gray-600">Crop Type</span>
                    <div className="flex items-center gap-2">
                      <Leaf className="h-4 w-4 text-gray-600" />
                      <span className="text-gray-700 font-medium">{fieldDetails.cropType}</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center border-b border-gray-200 pb-3">
                    <span className="text-gray-600">Area</span>
                    <span className="text-gray-700 font-medium">{fieldDetails.area} hectares</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-gray-200 pb-3">
                    <span className="text-gray-600">Season</span>
                    <span className="text-gray-700 font-medium">Season {fieldDetails.season}</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-gray-200 pb-3">
                    <span className="text-gray-600">Sowing Date</span>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gray-600" />
                      <span className="text-gray-700 font-medium">{fieldDetails.sowingDate}</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center pb-3">
                    <span className="text-gray-600">Location</span>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-gray-600" />
                      <span className="text-gray-700 font-medium">{fieldDetails.location}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Field Map */}
              <Card className={`${dashboardTheme.card}`}>
                <CardHeader>
                  <CardTitle className="text-gray-900">Field Map</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="border border-gray-200 rounded-lg overflow-hidden">
                    <LeafletMap
                      center={(() => {
                        // Parse location coordinates if available
                        if (fieldDetails.location.includes(',')) {
                          const parts = fieldDetails.location.split(',');
                          const lat = parseFloat(parts[0]?.trim() || "-1.9441");
                          const lng = parseFloat(parts[1]?.trim() || "30.0619");
                          return [lat, lng];
                        }
                        return [-1.9441, 30.0619]; // Default: Kigali, Rwanda
                      })()}
                      zoom={15}
                      height="500px"
                      tileLayer="satellite"
                      showControls={true}
                      className="w-full"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="weather" className="mt-6">
            <WeatherAnalysisTab location={fieldDetails.location} />
          </TabsContent>

          <TabsContent value="crop" className="mt-6">
            <CropAnalysisTab fieldDetails={fieldDetails} />
          </TabsContent>

          <TabsContent value="overview" className="mt-6">
            <Card className={`${dashboardTheme.card}`}>
              <CardHeader>
                <CardTitle className="text-gray-900">Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-900/60">Field overview and summary will be displayed here.</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        </div>
      </div>
    );
  };

  // Export functions
  const exportToCSV = () => {
    const currentDate = new Date().toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
    
    let csvContent = '';
    let filename = '';
    
    if (activeView === 'farmers') {
      // CSV Header with Starhawk branding
      csvContent = `STARHAWK - Agricultural Insurance Platform\n`;
      csvContent += `Farmers Management Report\n`;
      csvContent += `Generated: ${currentDate}\n`;
      csvContent += `\n`;
      csvContent += `Name,Email,Phone,National ID,Location\n`;
      
      // CSV Data
      farmers.forEach(farmer => {
        const farmerName = 
          farmer.name || 
          (farmer.firstName && farmer.lastName ? `${farmer.firstName} ${farmer.lastName}`.trim() : '') ||
          farmer.firstName || 
          farmer.lastName || 
          "Unknown";
        const location = 
          farmer.location || 
          (farmer.province && farmer.district ? `${farmer.province}, ${farmer.district}` : '') ||
          farmer.province ||
          farmer.district ||
          "N/A";
        const email = (farmer.email || "N/A").replace(/,/g, ';');
        const phone = farmer.phoneNumber || farmer.phone || "N/A";
        const nationalId = farmer.nationalId || farmer.nationalID || "N/A";
        
        csvContent += `${farmerName},${email},${phone},${nationalId},${location}\n`;
      });
      
      csvContent += `\n`;
      csvContent += `Powered by Starhawk\n`;
      csvContent += `Agricultural Insurance Solutions\n`;
      
      filename = `starhawk-farmers-report-${new Date().toISOString().split('T')[0]}.csv`;
    } else {
      // Fields export
      csvContent = `STARHAWK - Agricultural Insurance Platform\n`;
      csvContent += `Fields Management Report\n`;
      csvContent += `Generated: ${currentDate}\n`;
      csvContent += `\n`;
      csvContent += `Field ID,Farmer Name,Crop Type,Area (ha),Status\n`;
      
      filteredFields.forEach(field => {
        const fieldId = field._id || field.id || '';
        const displayFieldId = fieldId ? `FLD-${String(fieldId).slice(-3).padStart(3, '0')}` : 'FLD-000';
        const farmerName = field.farmerName || field.rawFarm?.name || "Unknown";
        const cropType = field.crop || field.cropType || "N/A";
        const area = field.area || 0;
        const status = field.status || "N/A";
        
        csvContent += `${displayFieldId},${farmerName},${cropType},${area},${status}\n`;
      });
      
      csvContent += `\n`;
      csvContent += `Powered by Starhawk\n`;
      csvContent += `Agricultural Insurance Solutions\n`;
      
      filename = `starhawk-fields-report-${new Date().toISOString().split('T')[0]}.csv`;
    }
    
    // Create blob and download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "Export successful",
      description: `Report exported as CSV successfully.`,
    });
  };

  const exportToPDF = async () => {
    // Dynamic import to avoid bundling issues
    const { default: jsPDF } = await import('jspdf');
    
    const currentDate = new Date().toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
    
    const doc = new jsPDF('l', 'mm', 'a4'); // landscape orientation
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    let yPosition = 20;
    
    // Header with Starhawk branding
    doc.setFillColor(5, 150, 105); // Green color #059669
    doc.rect(0, 0, pageWidth, 40, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(28);
    doc.setFont('helvetica', 'bold');
    doc.text('STARHAWK', pageWidth / 2, 20, { align: 'center' });
    
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text('Agricultural Insurance Platform', pageWidth / 2, 30, { align: 'center' });
    
    yPosition = 50;
    
    // Report info
    doc.setTextColor(31, 41, 55);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Report Type:', 20, yPosition);
    doc.setFont('helvetica', 'normal');
    doc.text(activeView === 'farmers' ? 'Farmers Management' : 'Fields Management', 60, yPosition);
    
    yPosition += 8;
    doc.setFont('helvetica', 'bold');
    doc.text('Generated:', 20, yPosition);
    doc.setFont('helvetica', 'normal');
    doc.text(currentDate, 60, yPosition);
    
    yPosition += 15;
    
    // Table header
    doc.setFillColor(243, 244, 246);
    doc.rect(20, yPosition - 8, pageWidth - 40, 10, 'F');
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(31, 41, 55);
    
    if (activeView === 'farmers') {
      doc.text('Name', 25, yPosition);
      doc.text('Email', 70, yPosition);
      doc.text('Phone', 120, yPosition);
      doc.text('National ID', 155, yPosition);
      doc.text('Location', 210, yPosition);
    } else {
      doc.text('Field ID', 25, yPosition);
      doc.text('Farmer Name', 60, yPosition);
      doc.text('Crop Type', 120, yPosition);
      doc.text('Area (ha)', 165, yPosition);
      doc.text('Status', 200, yPosition);
    }
    
    yPosition += 10;
    
    // Table data
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(31, 41, 55);
    
    const data = activeView === 'farmers' ? farmers : filteredFields;
    
    data.forEach((item: any, index: number) => {
      // Check if we need a new page
      if (yPosition > pageHeight - 30) {
        doc.addPage();
        yPosition = 20;
        
        // Repeat header on new page
        doc.setFillColor(243, 244, 246);
        doc.rect(20, yPosition - 8, pageWidth - 40, 10, 'F');
        doc.setFontSize(10);
        doc.setFont('helvetica', 'bold');
        if (activeView === 'farmers') {
          doc.text('Name', 25, yPosition);
          doc.text('Email', 70, yPosition);
          doc.text('Phone', 120, yPosition);
          doc.text('National ID', 155, yPosition);
          doc.text('Location', 210, yPosition);
        } else {
          doc.text('Field ID', 25, yPosition);
          doc.text('Farmer Name', 60, yPosition);
          doc.text('Crop Type', 120, yPosition);
          doc.text('Area (ha)', 165, yPosition);
          doc.text('Status', 200, yPosition);
        }
        yPosition += 10;
        doc.setFontSize(9);
        doc.setFont('helvetica', 'normal');
      }
      
      if (activeView === 'farmers') {
        const farmerName = 
          item.name || 
          (item.firstName && item.lastName ? `${item.firstName} ${item.lastName}`.trim() : '') ||
          item.firstName || 
          item.lastName || 
          "Unknown";
        const location = 
          item.location || 
          (item.province && item.district ? `${item.province}, ${item.district}` : '') ||
          item.province ||
          item.district ||
          "N/A";
        const email = (item.email || "N/A").substring(0, 25);
        const phone = (item.phoneNumber || item.phone || "N/A").substring(0, 15);
        const nationalId = (item.nationalId || item.nationalID || "N/A").substring(0, 15);
        
        doc.text(farmerName.substring(0, 30), 25, yPosition);
        doc.text(email, 70, yPosition);
        doc.text(phone, 120, yPosition);
        doc.text(nationalId, 155, yPosition);
        doc.text(location.substring(0, 35), 210, yPosition);
      } else {
        const fieldId = item._id || item.id || '';
        const displayFieldId = fieldId ? `FLD-${String(fieldId).slice(-3).padStart(3, '0')}` : 'FLD-000';
        const farmerName = (item.farmerName || item.rawFarm?.name || "Unknown").substring(0, 25);
        const cropType = (item.crop || item.cropType || "N/A").substring(0, 25);
        const area = String(item.area || 0);
        const status = (item.status || "N/A").substring(0, 20);
        
        doc.text(displayFieldId, 25, yPosition);
        doc.text(farmerName, 60, yPosition);
        doc.text(cropType, 120, yPosition);
        doc.text(area, 165, yPosition);
        doc.text(status, 200, yPosition);
      }
      
      yPosition += 8;
    });
    
    // Footer
    const footerY = pageHeight - 20;
    doc.setDrawColor(229, 231, 235);
    doc.line(20, footerY - 10, pageWidth - 20, footerY - 10);
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(5, 150, 105);
    doc.text('Powered by Starhawk', pageWidth / 2, footerY, { align: 'center' });
    
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(107, 114, 128);
    doc.text('Agricultural Insurance Solutions', pageWidth / 2, footerY + 5, { align: 'center' });
    
    // Save the PDF
    const filename = `starhawk-${activeView === 'farmers' ? 'farmers' : 'fields'}-report-${new Date().toISOString().split('T')[0]}.pdf`;
    doc.save(filename);
    
    toast({
      title: "Export successful",
      description: `PDF report downloaded successfully.`,
    });
  };

  const renderDashboard = () => (
    <div className="min-h-screen bg-gray-50 pt-6 pb-8">
      {/* Main Content */}
      <div className={`${sidebarCollapsed ? 'max-w-full' : 'max-w-7xl'} mx-auto px-6`}>
        {/* Summary Cards - Clean Modern Style */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card className="bg-white border border-gray-200 shadow-sm hover:shadow transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-xs text-gray-500 mb-1">Total Farmers</p>
                  <p className="text-xl font-semibold text-gray-900">{totalFarmers}</p>
                  <p className="text-xs text-green-600 mt-1">All registered</p>
                </div>
                <div className="flex items-center justify-center">
                  <Users className="h-6 w-6 text-green-600" />
                </div>
              </div>
          </CardContent>
        </Card>

          <Card className="bg-white border border-gray-200 shadow-sm hover:shadow transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-xs text-gray-500 mb-1">Total Fields</p>
                  <p className="text-xl font-semibold text-gray-900">{totalFields}</p>
                  <p className="text-xs text-green-600 mt-1">Across all farmers</p>
                </div>
                <div className="flex items-center justify-center">
                  <Sprout className="h-6 w-6 text-green-600" />
                </div>
              </div>
          </CardContent>
        </Card>

          <Card className="bg-white border border-gray-200 shadow-sm hover:shadow transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-xs text-gray-500 mb-1">Total Area</p>
                  <p className="text-xl font-semibold text-gray-900">{totalArea.toFixed(1)} ha</p>
                  <p className="text-xs text-green-600 mt-1">Cultivated area</p>
                </div>
                <div className="flex items-center justify-center">
                  <MapPin className="h-6 w-6 text-green-600" />
                </div>
              </div>
          </CardContent>
        </Card>

          <Card className="bg-white border border-gray-200 shadow-sm hover:shadow transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-xs text-gray-500 mb-1">Active Assessments</p>
                  <p className="text-xl font-semibold text-gray-900">{activeAssessments}</p>
                  <p className="text-xs text-green-600 mt-1">In progress</p>
              </div>
                <div className="flex items-center justify-center">
                  <Calendar className="h-6 w-6 text-green-600" />
                </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Action Bar */}
        <div className="flex items-center justify-between flex-wrap gap-3 mb-6">
              <div className="flex items-center gap-2">
              <Button
              onClick={() => setActiveView("farmers")}
                size="sm"
              className={activeView === "farmers"
                ? "bg-green-600 hover:bg-green-700 text-white h-9 !rounded-none"
                : "bg-gray-200 hover:bg-gray-300 text-gray-700 h-9 !rounded-none"}
              >
              View Farmers
              </Button>
        <Button
              onClick={() => setActiveView("fields")}
              size="sm"
              className={activeView === "fields"
                ? "bg-green-600 hover:bg-green-700 text-white h-9 !rounded-none"
                : "bg-gray-200 hover:bg-gray-300 text-gray-700 h-9 !rounded-none"}
            >
              View All Fields
        </Button>
          </div>
          
          <div className="flex items-center gap-2">
          <div className="relative">
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
            <Input
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 h-9 w-56 text-sm bg-white border-gray-300"
            />
          </div>
                  <Button 
                    variant="outline" 
              size="sm"
              onClick={() => setFilterDialogOpen(true)}
              className="bg-white border-gray-300 h-9 !rounded-none"
                  >
              <Filter className="h-3.5 w-3.5 mr-1.5" />
              Filter
                  </Button>
                  <Button 
              onClick={() => setShowDrawField(true)}
              size="sm"
              className="bg-green-600 hover:bg-green-700 text-white h-9 !rounded-none"
                  >
              <Plus className="h-3.5 w-3.5 mr-1.5" />
              Add Field
                  </Button>
                </div>
          </div>

      {/* Error Message */}
      {(error || farmsError) && (
        <Card className="bg-white border-l-4 border-l-red-500">
          <CardContent className="p-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-green-500" />
                <p className="text-sm text-green-500">{error || farmsError}</p>
        </div>
              <Button
                onClick={() => { loadAssessments(); loadFarms(); }}
                variant="outline"
                size="sm"
                className="border-gray-300 h-8 !rounded-none"
              >
                <RefreshCw className="h-3 w-3 mr-1.5" />
                Retry
              </Button>
      </div>
          </CardContent>
        </Card>
      )}

      {/* Data Table */}
        <Card className="bg-white border border-gray-200 shadow-sm">
          <CardHeader className="border-b border-gray-200 bg-white px-6 py-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-semibold text-gray-900">
                {activeView === "farmers" ? "Farmers Management" : "Fields Management"}
              </CardTitle>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-green-600 hover:bg-green-700 text-white border-green-600 h-8 px-3 text-xs !rounded-none"
                  >
                    <Download className="h-3.5 w-3.5 mr-1.5" />
                    Export
                    <ChevronDown className="h-3.5 w-3.5 ml-1.5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="!rounded-none">
                  <DropdownMenuItem onClick={exportToCSV} className="!rounded-none">
                    <FileSpreadsheet className="h-4 w-4 mr-2" />
                    Export as CSV
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={exportToPDF} className="!rounded-none">
                    <FileText className="h-4 w-4 mr-2" />
                    Export as PDF
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardHeader>
        <CardContent className="p-0">
            {loading || farmsLoading ? (
              <div className="flex items-center justify-center py-8">
              <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-3"></div>
                  <p className="text-sm text-gray-600">Loading data...</p>
              </div>
            </div>
            ) : activeView === "farmerFields" ? (
              renderFarmerFields()
            ) : activeView === "farmers" ? (
              farmers.length === 0 ? (
                <div className="p-12 text-center">
                  <Users className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-sm font-medium text-gray-900 mb-1">No farmers found</p>
                  <p className="text-xs text-gray-500">Try adjusting your search criteria</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b-2 border-gray-200">
                    <th className="text-left py-4 px-6 font-semibold text-gray-700 text-sm uppercase tracking-wider">Name</th>
                    <th className="text-left py-4 px-6 font-semibold text-gray-700 text-sm uppercase tracking-wider">Email</th>
                    <th className="text-left py-4 px-6 font-semibold text-gray-700 text-sm uppercase tracking-wider">Phone</th>
                    <th className="text-left py-4 px-6 font-semibold text-gray-700 text-sm uppercase tracking-wider">National ID</th>
                    <th className="text-left py-4 px-6 font-semibold text-gray-700 text-sm uppercase tracking-wider">Location</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {farmers
                    .filter(farmer => {
                      if (!searchQuery) return true;
                      const farmerName = 
                        farmer.name || 
                        (farmer.firstName && farmer.lastName ? `${farmer.firstName} ${farmer.lastName}`.trim() : '') ||
                        farmer.firstName || 
                        farmer.lastName || 
                        "";
                      const location = 
                        farmer.location || 
                        (farmer.province && farmer.district ? `${farmer.province}, ${farmer.district}` : '') ||
                        farmer.province ||
                        farmer.district ||
                        "";
                      const searchLower = searchQuery.toLowerCase();
                      return (
                        farmerName.toLowerCase().includes(searchLower) ||
                        (farmer.email || "").toLowerCase().includes(searchLower) ||
                        (farmer.phoneNumber || farmer.phone || "").includes(searchQuery) ||
                        (farmer.nationalId || farmer.nationalID || "").includes(searchQuery) ||
                        location.toLowerCase().includes(searchLower)
                      );
                    })
                    .map((farmer, index) => {
                      // Get the actual farmer ID - don't use index as fallback for loading fields
                      const farmerId = farmer._id || farmer.id;
                      if (!farmerId) {
                        console.warn(`Farmer at index ${index} has no ID:`, farmer);
                      }
                      const farmerIdKey = farmerId || `temp-${index}`; // Use temp key only for UI, not for API calls
                      const isExpanded = expandedFarmers.has(farmerIdKey);
                      const farmerFieldsList = farmerFields[farmerIdKey] || [];
                      const isLoadingFields = loadingFields[farmerIdKey] || false;
                      
                      const farmerName = 
                        farmer.name || 
                        (farmer.firstName && farmer.lastName ? `${farmer.firstName} ${farmer.lastName}`.trim() : '') ||
                        farmer.firstName || 
                        farmer.lastName || 
                        "Unknown";
                      
                      const location = 
                        farmer.location || 
                        (farmer.province && farmer.district ? `${farmer.province}, ${farmer.district}` : '') ||
                        farmer.province ||
                        farmer.district ||
                        "N/A";

                      return (
                        <>
                          <tr
                            key={farmerIdKey}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleViewFarmerFields(farmer);
                            }}
                            className="hover:bg-gray-50/50 transition-all duration-150 border-b border-gray-100 cursor-pointer"
                          >
                            <td className="py-4 px-6 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">{farmerName}</div>
                              {farmerFieldsList.length > 0 && (
                                <div className="text-xs text-gray-500 mt-0.5">
                                  {farmerFieldsList.length} field{farmerFieldsList.length !== 1 ? 's' : ''}
                        </div>
                              )}
                      </td>
                            <td className="py-4 px-6 whitespace-nowrap">
                              <div className="text-sm text-gray-600">{farmer.email || "N/A"}</div>
                      </td>
                            <td className="py-4 px-6 whitespace-nowrap">
                              <div className="text-sm text-gray-600">{farmer.phoneNumber || farmer.phone || "N/A"}</div>
                      </td>
                            <td className="py-4 px-6 whitespace-nowrap">
                              <div className="text-sm text-gray-600">{farmer.nationalId || farmer.nationalID || "N/A"}</div>
                            </td>
                            <td className="py-4 px-6 whitespace-nowrap">
                              <div className="text-sm text-gray-600">{location}</div>
                            </td>
                          </tr>
                        </>
                      );
                    })}
                </tbody>
              </table>
                        </div>
              )
            ) : (
              filteredFields.length === 0 ? (
                <div className="p-12 text-center">
                  <Sprout className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-sm font-medium text-gray-900 mb-1">No fields found</p>
                  <p className="text-xs text-gray-500">Try adjusting your search criteria</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                      <tr className="bg-gray-50 border-b border-gray-200">
                        <th className="text-left py-3 px-6 font-medium text-gray-700 text-xs">Field ID</th>
                        <th className="text-left py-3 px-6 font-medium text-gray-700 text-xs">Farmer Name</th>
                        <th className="text-left py-3 px-6 font-medium text-gray-700 text-xs">Crop Type</th>
                        <th className="text-left py-3 px-6 font-medium text-gray-700 text-xs">Area (ha)</th>
                        <th className="text-left py-3 px-6 font-medium text-gray-700 text-xs">Status</th>
                  </tr>
                </thead>
                    <tbody className="bg-white divide-y divide-gray-100">
                      {filteredFields.map((field, index) => {
                        const fieldId = field._id || field.id || '';
                        const displayFieldId = fieldId ? `FLD-${String(fieldId).slice(-3).padStart(3, '0')}` : 'FLD-000';
                        return (
                          <tr
                            key={field._id || field.id || index}
                            onClick={() => {
                              // Convert farm to Field format and navigate to field detail
                              const fieldData: Field = {
                                id: fieldId,
                                farmerName: field.farmerName || field.rawFarm?.name || "Unknown",
                                crop: field.cropType || field.crop || "N/A",
                                area: field.area || 0,
                                season: field.season || "A",
                                status: field.status || "Active",
                                fieldName: field.name || "Unnamed Field",
                                sowingDate: field.sowingDate || field.plantingDate || new Date().toISOString().split('T')[0]
                              };
                              handleFieldClick(fieldData);
                            }}
                            className="hover:bg-green-50/30 transition-colors cursor-pointer"
                          >
                            <td className="py-3.5 px-6 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">{displayFieldId}</div>
                      </td>
                            <td className="py-3.5 px-6 whitespace-nowrap">
                              <div className="text-sm text-gray-900">{field.farmerName || "Unknown"}</div>
                      </td>
                            <td className="py-3.5 px-6 whitespace-nowrap">
                              <div className="flex items-center gap-2 text-sm text-gray-600">
                                <Sprout className="h-4 w-4 text-gray-400" />
                                <span>{field.cropType || "N/A"}</span>
                        </div>
                      </td>
                            <td className="py-3.5 px-6 whitespace-nowrap">
                              <div className="text-sm text-gray-900">{(field.area || 0).toFixed(1)}</div>
                            </td>
                            <td className="py-3.5 px-6 whitespace-nowrap">
                              <span className="inline-flex items-center px-2.5 py-1 rounded text-xs font-medium bg-green-50 text-green-700 border border-green-200">
                                {field.status || "Active"}
                              </span>
                      </td>
                    </tr>
                        );
                      })}
                </tbody>
              </table>
            </div>
              )
          )}
        </CardContent>
      </Card>
      </div>

      {/* Draw Field Dialog */}
      <Dialog open={showDrawField} onOpenChange={setShowDrawField}>
        <DialogContent className={`${dashboardTheme.card} border-gray-200 max-w-6xl max-h-[90vh]`}>
          <DialogHeader>
            <DialogTitle className="text-gray-900">Process Field: {selectedFarmerForProcessing}</DialogTitle>
            <p className="text-sm text-gray-900/70 mt-2">Select the field adding option</p>
          </DialogHeader>
          
          <Tabs value={fieldMethod} onValueChange={(value) => setFieldMethod(value as "upload" | "draw")} className="mt-4">
            <TabsList className={`${dashboardTheme.card} border border-gray-200 w-fit mb-4`}>
              <TabsTrigger 
                value="upload" 
                className="data-[state=active]:bg-gray-200 data-[state=active]:text-gray-900 text-gray-700"
              >
                <Upload className="h-4 w-4 mr-2" />
                Upload fields
              </TabsTrigger>
              <TabsTrigger 
                value="draw" 
                className="data-[state=active]:bg-gray-200 data-[state=active]:text-gray-900 text-gray-700"
              >
                <Map className="h-4 w-4 mr-2" />
                Draw Field on Map
              </TabsTrigger>
            </TabsList>

            <TabsContent value="upload" className="mt-0">
              <div className="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center hover:border-green-500 transition-colors">
                <Upload className="h-12 w-12 mx-auto mb-4 text-gray-900/40" />
                <p className="text-gray-900 mb-2">Drag-and-drop here or select files with the field contours for the upload to start</p>
                {uploadedFiles.length === 0 && (
                  <p className="text-sm text-gray-900/60 mb-4">No file chosen</p>
                )}
                <input
                  type="file"
                  id="field-upload"
                  className="hidden"
                  accept=".kml,.kmz,.geojson,.shp,.zip"
                  multiple
                  onChange={handleFileUpload}
                />
                <Button
                  onClick={() => document.getElementById('field-upload')?.click()}
                  className="bg-green-600 hover:bg-green-700 text-white !rounded-none"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  SELECT FILES
                </Button>
                {uploadedFiles.length > 0 && (
                  <div className="mt-4 space-y-2">
                    {uploadedFiles.map((fileName, idx) => (
                      <div key={idx} className="p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
                        <p className="text-gray-900/80 text-sm">{fileName}</p>
                      </div>
                    ))}
                  </div>
                )}
                <div className="mt-4">
                  <p className="text-xs text-gray-900/60 mb-2">Supported formats are:</p>
                  <p className="text-xs text-gray-900/50">.kml, .kmz, .geojson, .shp or zip</p>
                  <p className="text-xs text-gray-900/50 mt-1">(containing .shp, .shx, .dbf files)</p>
                  <div className="mt-3">
                    <a href="#" className="text-green-400 hover:text-green-300 text-sm">
                      Download sample ▼
                    </a>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="draw" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Map Section */}
                <div className="md:col-span-2">
                  <div className="border border-gray-200 rounded-lg overflow-hidden">
                    <LeafletMap
                      center={[-1.9441, 30.0619]}
                      zoom={13}
                      height="500px"
                      tileLayer="satellite"
                      showControls={true}
                      className="w-full"
                      onMapClick={(lat, lng) => {
                        // Handle map click for drawing polygon
                        console.log('Map clicked:', lat, lng);
                      }}
                    />
                  </div>
                      {!calculatedArea && (
                    <div className="mt-4 text-center">
                        <Button
                          onClick={handlePolygonComplete}
                        className="bg-green-600 hover:bg-green-700 text-white !rounded-none"
                        >
                          Complete Polygon
                        </Button>
                    </div>
                      )}
                </div>

                {/* Field Metadata */}
                <div className="space-y-4">
                  <Card className={`${dashboardTheme.card}`}>
                    <CardHeader>
                      <CardTitle className="text-sm text-gray-900">Field Metadata</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Label className="text-xs text-gray-900/70 mb-1 block">Farmer</Label>
                        <p className="text-sm font-medium text-gray-900">{selectedFarmerForProcessing}</p>
                      </div>
                      <div>
                        <Label className="text-xs text-gray-900/70 mb-1 block">Calculated Area</Label>
                        <p className="text-sm font-medium text-gray-900">{calculatedArea || "Draw polygon to calculate"}</p>
                      </div>
                      <div>
                        <Label className="text-xs text-gray-900/70 mb-1 block">Season (Auto-filled)</Label>
                        <p className="text-sm font-medium text-gray-700">Season B</p>
                      </div>
                      <div>
                        <Label className="text-xs text-gray-900/70 mb-1 block">Status</Label>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          fieldStatus === "Awaiting Geometry" 
                            ? "bg-green-500/20 text-green-400 border border-green-500/30"
                            : "bg-green-500/20 text-green-600 border border-green-500/30"
                        }`}>
                          {fieldStatus}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 mt-6">
            <Button
              onClick={() => setShowDrawField(false)}
              variant="outline"
              className="border-gray-300 text-gray-900 hover:bg-gray-800 !rounded-none"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSyncField}
              className="bg-green-600 hover:bg-green-700 text-white !rounded-none"
              disabled={fieldMethod === "draw" ? !calculatedArea : uploadedFiles.length === 0}
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Sync & Process Field
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );

// Complex assessment forms removed - using simplified dashboard

  const handlePageChange = (page: string) => {
    setActivePage(page);
    // Reset view mode when navigating away from dashboard
    if (page !== "dashboard") {
      setViewMode("list");
      setSelectedAssessment(null);
      setSelectedField(null);
    }
  };

  const renderPage = () => {
    // Handle view modes within dashboard
    if (activePage === "dashboard") {
      switch (viewMode) {
        case "fieldDetail":
          return renderFieldDetail();
        case "fieldSelection":
          return renderFieldSelection();
        default:
          return renderDashboard();
      }
    }

    // Handle other pages
    switch (activePage) {
      case "risk-assessments": return <RiskAssessmentSystem assessments={assessments} onRefresh={loadAssessments} />;
      case "loss-assessments": return <LossAssessmentSystem />;
      case "farmers": 
        if (showFarmerFieldsView) {
          return renderFarmerFieldsView();
        }
        return renderFarmersList();
      case "crop-monitoring": return renderCropMonitoring();
      case "notifications": return <AssessorNotifications />;
      case "profile-settings": return <AssessorProfileSettings />;
      default: 
        if (showFarmerFieldsView) {
          return renderFarmerFieldsView();
        }
        return renderDashboard();
    }
  };

  const renderFarmersList = () => {
    return (
      <div className="min-h-screen bg-gray-50 pt-6 pb-8">

        {/* Main Content */}
        <div className={`${sidebarCollapsed ? 'max-w-full' : 'max-w-7xl'} mx-auto px-6`}>
          {farmersLoading && (
            <Card className={`${dashboardTheme.card}`}>
              <CardContent className="p-12">
                <div className="flex items-center justify-center">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading farmers...</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {farmersError && !farmersLoading && (
            <Card className={`${dashboardTheme.card}`}>
              <CardContent className="p-6">
                <div className="text-center text-green-600">
                  <AlertTriangle className="h-12 w-12 mx-auto mb-4" />
                  <p>{farmersError}</p>
                  <Button
                    onClick={loadFarmers}
                    className="mt-4 bg-green-600 hover:bg-green-700 text-white !rounded-none"
                  >
                    Retry
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {!farmersLoading && !farmersError && (
            <Card className={`${dashboardTheme.card}`}>
              <CardHeader>
                <CardTitle className="text-gray-900">Farmers</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                {farmers.length === 0 ? (
                  <div className="text-center py-12">
                    <Users className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                    <p className="text-gray-600 text-lg mb-2">No farmers found</p>
                    <p className="text-gray-500 text-sm">There are no farmers available at the moment</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-gray-50 border-b-2 border-gray-200">
                          <th className="text-left py-4 px-6 font-semibold text-gray-700 text-sm uppercase tracking-wider">Name</th>
                          <th className="text-left py-4 px-6 font-semibold text-gray-700 text-sm uppercase tracking-wider">Email</th>
                          <th className="text-left py-4 px-6 font-semibold text-gray-700 text-sm uppercase tracking-wider">Phone</th>
                          <th className="text-left py-4 px-6 font-semibold text-gray-700 text-sm uppercase tracking-wider">National ID</th>
                          <th className="text-left py-4 px-6 font-semibold text-gray-700 text-sm uppercase tracking-wider">Location</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {farmers.map((farmer, index) => {
                          // Get the actual farmer ID - don't use index as fallback for loading fields
                          const farmerId = farmer._id || farmer.id;
                          if (!farmerId) {
                            console.warn(`Farmer at index ${index} has no ID:`, farmer);
                          }
                          const farmerIdKey = farmerId || `temp-${index}`; // Use temp key only for UI, not for API calls
                          const isExpanded = expandedFarmers.has(farmerIdKey);
                          const farmerFieldsList = farmerFields[farmerIdKey] || [];
                          const isLoadingFields = loadingFields[farmerIdKey] || false;
                          
                          const farmerName = 
                            farmer.name || 
                            (farmer.firstName && farmer.lastName ? `${farmer.firstName} ${farmer.lastName}`.trim() : '') ||
                            farmer.firstName || 
                            farmer.lastName || 
                            "Unknown";
                          
                          const location = 
                            farmer.location || 
                            (farmer.province && farmer.district ? `${farmer.province}, ${farmer.district}` : '') ||
                            farmer.province ||
                            farmer.district ||
                            "N/A";

                          return (
                            <>
                              <tr
                                key={farmerIdKey}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleViewFarmerFields(farmer);
                                }}
                                className="hover:bg-gray-50/50 transition-all duration-150 border-b border-gray-100 cursor-pointer"
                              >
                                <td className="py-4 px-6 whitespace-nowrap">
                                  <div className="text-sm font-medium text-gray-900">{farmerName}</div>
                                  {farmerFieldsList.length > 0 && (
                                    <div className="text-xs text-gray-500 mt-0.5">
                                      {farmerFieldsList.length} field{farmerFieldsList.length !== 1 ? 's' : ''}
                                    </div>
                                  )}
                                </td>
                                <td className="py-4 px-6 whitespace-nowrap">
                                  <div className="text-sm text-gray-600">{farmer.email || "N/A"}</div>
                                </td>
                                <td className="py-4 px-6 whitespace-nowrap">
                                  <div className="text-sm text-gray-600">{farmer.phoneNumber || farmer.phone || "N/A"}</div>
                                </td>
                                <td className="py-4 px-6 whitespace-nowrap">
                                  <div className="text-sm text-gray-600">{farmer.nationalId || "N/A"}</div>
                                </td>
                                <td className="py-4 px-6 whitespace-nowrap">
                                  <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <MapPin className="h-4 w-4 text-green-500 flex-shrink-0" />
                                    <span className="truncate max-w-[200px]">{location}</span>
                                  </div>
                                </td>
                              </tr>
                            </>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    );
  };

  // Load monitoring data for a specific farm
  const loadFarmMonitoring = async (farmId: string) => {
    setMonitoringLoading(true);
    setMonitoringError(null);
    try {
      const token = getAuthToken();
      const url = `${API_BASE_URL}/monitoring/farms/${farmId}`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` })
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to load monitoring data: ${response.status}`);
      }

      const data = await response.json();
      setMonitoringData(prev => ({ ...prev, [farmId]: data.data || data }));
    } catch (err: any) {
      console.error('Failed to load farm monitoring:', err);
      setMonitoringError(err.message || 'Failed to load monitoring data');
      toast({
        title: 'Error loading monitoring data',
        description: err.message || 'Failed to load monitoring data',
        variant: 'destructive'
      });
    } finally {
      setMonitoringLoading(false);
    }
  };

  // Load all alerts
  const loadAlerts = async (farmId?: string) => {
    setAlertsLoading(true);
    try {
      const token = getAuthToken();
      const url = farmId 
        ? `${API_BASE_URL}/monitoring/alerts/${farmId}`
        : `${API_BASE_URL}/monitoring/alerts`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` })
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to load alerts: ${response.status}`);
      }

      const data = await response.json();
      const alertsList = data.data || data.items || data || [];
      setAlerts(Array.isArray(alertsList) ? alertsList : []);
    } catch (err: any) {
      console.error('Failed to load alerts:', err);
      toast({
        title: 'Error loading alerts',
        description: err.message || 'Failed to load alerts',
        variant: 'destructive'
      });
    } finally {
      setAlertsLoading(false);
    }
  };

  // Mark alert as read
  const markAlertAsRead = async (alertId: string) => {
    try {
      const token = getAuthToken();
      const url = `${API_BASE_URL}/monitoring/alerts/${alertId}/read`;
      
      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` })
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to mark alert as read: ${response.status}`);
      }

      // Update the alert in the local state
      setAlerts(prev => prev.map(alert => 
        alert._id === alertId || alert.id === alertId
          ? { ...alert, read: true, readAt: new Date().toISOString() }
          : alert
      ));

      toast({
        title: 'Success',
        description: 'Alert marked as read',
      });
    } catch (err: any) {
      console.error('Failed to mark alert as read:', err);
      toast({
        title: 'Error',
        description: err.message || 'Failed to mark alert as read',
        variant: 'destructive'
      });
    }
  };

  // Load alerts and farms when crop monitoring page is shown
  useEffect(() => {
    if (activePage === "crop-monitoring") {
      loadFarmers();
      loadAlerts();
      loadFarms();
    }
  }, [activePage]);

  // Convert farm to Field format for detail view
  const getFarmAsField = (farm: any, farmer: any): Field => {
    const farmerName = 
      farmer?.name || 
      (farmer?.firstName && farmer?.lastName ? `${farmer.firstName} ${farmer.lastName}`.trim() : '') ||
      farmer?.firstName || 
      farmer?.lastName || 
      "Unknown Farmer";
    
    return {
      id: farm._id || farm.id || '',
      farmerName,
      crop: farm.cropType || farm.crop || "Unknown",
      area: farm.area || farm.size || 0,
      season: farm.season || "A",
      status: farm.status || "Active",
      fieldName: farm.name || "Unnamed Farm",
      sowingDate: farm.sowingDate || farm.plantingDate || new Date().toISOString().split('T')[0]
    };
  };

  // Get field details from farm
  const getFieldDetailsFromFarm = (farm: any, farmer: any): FieldDetail => {
    const field = getFarmAsField(farm, farmer);
    const farmerName = 
      farmer?.name || 
      (farmer?.firstName && farmer?.lastName ? `${farmer.firstName} ${farmer.lastName}`.trim() : '') ||
      farmer?.firstName || 
      farmer?.lastName || 
      "Unknown Farmer";
    
    return {
      fieldId: farm._id || farm.id || '',
      fieldName: farm.name || "Unnamed Farm",
      farmer: farmerName,
      cropType: farm.cropType || farm.crop || "Unknown",
      area: farm.area || farm.size || 0,
      season: farm.season || "A",
      sowingDate: farm.sowingDate || farm.plantingDate || new Date().toISOString().split('T')[0],
      location: farmer?.location || 
        (farmer?.province && farmer?.district ? `${farmer.province}, ${farmer.district}` : '') ||
        farmer?.province ||
        farmer?.district ||
        "Unknown Location"
    };
  };

  // Render field detail view for crop monitoring
  const renderCropMonitoringFieldDetail = () => {
    if (!selectedFarmForDetail || !selectedFarmerForDetail) return null;
    
    const fieldDetails = getFieldDetailsFromFarm(selectedFarmForDetail, selectedFarmerForDetail);
    const fieldId = selectedFarmForDetail._id || selectedFarmForDetail.id || '';
    const displayFieldId = fieldId ? `FLD-${String(fieldId).slice(-3).padStart(3, '0')}` : 'FLD-000';

    return (
      <div className="min-h-screen bg-gray-50 pt-6 pb-8">
        <div className={`${sidebarCollapsed ? 'max-w-full' : 'max-w-7xl'} mx-auto px-6 space-y-6`}>
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm">
            <button 
              onClick={() => {
                setCropMonitoringViewMode("list");
                setSelectedFarmerForDetail(null);
                setSelectedFarmForDetail(null);
              }}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-700"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Crop Monitoring
            </button>
          </div>
          
          {/* Header */}
          <div>
            <h1 className="text-4xl font-bold text-gray-900">
              Field Detail View: {displayFieldId}
            </h1>
            <p className="text-gray-900/70 mt-2">
              {fieldDetails.farmer} - {fieldDetails.cropType}
            </p>
          </div>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className={`${dashboardTheme.card} border border-gray-200`}>
              <TabsTrigger 
                value="basic-info" 
                className="data-[state=active]:bg-gray-200 data-[state=active]:text-gray-900 text-gray-700"
              >
                <FileSpreadsheet className="h-4 w-4 mr-2" />
                Basic Info
              </TabsTrigger>
              <TabsTrigger 
                value="weather" 
                className="data-[state=active]:bg-gray-200 data-[state=active]:text-gray-900 text-gray-700"
              >
                <CloudRain className="h-4 w-4 mr-2" />
                Weather Analysis
              </TabsTrigger>
              <TabsTrigger 
                value="crop" 
                className="data-[state=active]:bg-gray-200 data-[state=active]:text-gray-900 text-gray-700"
              >
                <Leaf className="h-4 w-4 mr-2" />
                Crop Analysis (Satellite)
              </TabsTrigger>
              <TabsTrigger 
                value="overview" 
                className="data-[state=active]:bg-gray-200 data-[state=active]:text-gray-900 text-gray-700"
              >
                <FileText className="h-4 w-4 mr-2" />
                Overview
              </TabsTrigger>
            </TabsList>

            {/* Tab Contents */}
            <TabsContent value="basic-info" className="mt-6">
              <div className="grid gap-6 md:grid-cols-2">
                {/* Field Information */}
                <Card className={`${dashboardTheme.card}`}>
                  <CardHeader>
                    <CardTitle className="text-gray-900">Field Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between items-center border-b border-gray-200 pb-3">
                      <span className="text-gray-600">Field ID</span>
                      <span className="text-gray-700 font-medium">{displayFieldId}</span>
                    </div>
                    <div className="flex justify-between items-center border-b border-gray-200 pb-3">
                      <span className="text-gray-600">Field Name</span>
                      <span className="text-gray-700 font-medium">{fieldDetails.fieldName}</span>
                    </div>
                    <div className="flex justify-between items-center border-b border-gray-200 pb-3">
                      <span className="text-gray-600">Farmer</span>
                      <span className="text-gray-700 font-medium">{fieldDetails.farmer}</span>
                    </div>
                    <div className="flex justify-between items-center border-b border-gray-200 pb-3">
                      <span className="text-gray-600">Crop Type</span>
                      <div className="flex items-center gap-2">
                        <Leaf className="h-4 w-4 text-gray-600" />
                        <span className="text-gray-700 font-medium">{fieldDetails.cropType}</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center border-b border-gray-200 pb-3">
                      <span className="text-gray-600">Area</span>
                      <span className="text-gray-700 font-medium">{fieldDetails.area} hectares</span>
                    </div>
                    <div className="flex justify-between items-center border-b border-gray-200 pb-3">
                      <span className="text-gray-600">Season</span>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-gray-600" />
                        <span className="text-gray-700 font-medium">Season {fieldDetails.season}</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center pb-3">
                      <span className="text-gray-600">Location</span>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-gray-600" />
                        <span className="text-gray-700 font-medium">{fieldDetails.location}</span>
                      </div>
                    </div>
                    <div className="flex gap-2 pt-3 border-t border-gray-200 mt-3">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 bg-white border-gray-300 text-gray-700 hover:bg-gray-50 !rounded-none"
                      >
                        <Edit className="h-3.5 w-3.5 mr-1.5" />
                        Edit Info
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 bg-white border-gray-300 text-gray-700 hover:bg-gray-50 !rounded-none"
                      >
                        <FileText className="h-3.5 w-3.5 mr-1.5" />
                        View History
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Map View */}
                <Card className={`${dashboardTheme.card}`}>
                  <CardHeader>
                    <CardTitle className="text-gray-900">Map View</CardTitle>
                  </CardHeader>
                  <CardContent className="h-[500px] flex items-center justify-center bg-gray-50 rounded-lg border border-gray-200">
                    <div className="text-center">
                      <MapPin className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                      <p className="text-gray-900 text-lg font-medium">Map View</p>
                      <p className="text-sm text-gray-600 mt-2">Field: {displayFieldId}</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="weather" className="mt-6">
              <WeatherAnalysisTab location={fieldDetails.location} />
            </TabsContent>

            <TabsContent value="crop" className="mt-6">
              <CropAnalysisTab fieldDetails={fieldDetails} />
            </TabsContent>

            <TabsContent value="overview" className="mt-6">
              <Card className={`${dashboardTheme.card}`}>
                <CardHeader>
                  <CardTitle className="text-gray-900">Overview</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-900/60">Field overview and summary will be displayed here.</p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    );
  };

  const renderCropMonitoring = () => {
    // Show field detail if farmer/farm is selected
    if (cropMonitoringViewMode === "fieldDetail") {
      return renderCropMonitoringFieldDetail();
    }

    const unreadAlerts = alerts.filter(a => !a.read && !a.readAt);
    const highSeverityAlerts = alerts.filter(a => a.severity === 'high' || a.severity === 'critical');
    const farmsWithMonitoring = Object.keys(monitoringData).length;
    
    return (
      <div className="min-h-screen bg-gray-50 pt-6 pb-8">

        {/* Main Content */}
        <div className={`${sidebarCollapsed ? 'max-w-full' : 'max-w-7xl'} mx-auto px-6`}>

          {/* Loading State */}
          {(alertsLoading || farmsLoading) && (
            <Card className={`${dashboardTheme.card}`}>
              <CardContent className="p-12">
                <div className="flex items-center justify-center">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-green-600 mx-auto mb-4"></div>
                    <p className="text-sm text-gray-600">Loading data...</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Error State */}
          {monitoringError && !alertsLoading && !farmsLoading && (
            <Card className={`${dashboardTheme.card} border-green-200`}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-green-500" />
                    <p className="text-sm text-green-600">{monitoringError}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Farmers and Farms Table - Grouped by Farmer */}
          {!alertsLoading && !farmsLoading && (
            <Card className={`${dashboardTheme.card}`}>
              <CardHeader>
                <CardTitle className="text-gray-900">Farmers and Farms Monitoring</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                {farmers.length === 0 && farms.length === 0 ? (
                  <div className="text-center py-12">
                    <Sprout className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                    <p className="text-gray-600 text-lg mb-2">No farmers or farms found</p>
                    <p className="text-gray-500 text-sm">There are no farmers or farms available for monitoring</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-gray-50 border-b-2 border-gray-200">
                          <th className="text-left py-4 px-6 font-semibold text-gray-700 text-sm uppercase tracking-wider w-10"></th>
                          <th className="text-left py-4 px-6 font-semibold text-gray-700 text-sm uppercase tracking-wider">Farmer Name</th>
                          <th className="text-left py-4 px-6 font-semibold text-gray-700 text-sm uppercase tracking-wider">Location</th>
                          <th className="text-left py-4 px-6 font-semibold text-gray-700 text-sm uppercase tracking-wider">Total Farms</th>
                          <th className="text-left py-4 px-6 font-semibold text-gray-700 text-sm uppercase tracking-wider">Monitored Farms</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {farmers.map((farmer, index) => {
                          const farmerId = farmer._id || farmer.id;
                          if (!farmerId) return null;
                          
                          const farmerIdKey = farmerId.toString();
                          const isExpanded = expandedFarmers.has(farmerIdKey);
                          
                          // Get farms for this farmer
                          const farmerFarms = farms.filter(farm => {
                            const farmFarmerId = farm.farmerId?._id || farm.farmerId || farm.farmer?._id || farm.farmer?.id || farm.farmer || '';
                            return farmFarmerId.toString() === farmerIdKey;
                          });
                          
                          // Count monitored farms
                          const monitoredFarmsCount = farmerFarms.filter(farm => {
                            const farmId = farm._id || farm.id;
                            return monitoringData[farmId];
                          }).length;
                          
                          const farmerName = 
                            farmer.name || 
                            (farmer.firstName && farmer.lastName ? `${farmer.firstName} ${farmer.lastName}`.trim() : '') ||
                            farmer.firstName || 
                            farmer.lastName || 
                            "Unknown Farmer";
                          
                          const location = 
                            farmer.location || 
                            (farmer.province && farmer.district ? `${farmer.province}, ${farmer.district}` : '') ||
                            farmer.province ||
                            farmer.district ||
                            "N/A";

                          return (
                            <>
                              <tr
                                key={farmerIdKey}
                                className="hover:bg-gray-50/50 transition-all duration-150 border-b border-gray-100 cursor-pointer"
                                onClick={(e) => {
                                  // Only navigate if clicking on the row, not on the expand button
                                  if ((e.target as HTMLElement).closest('button')) {
                                    return; // Let the expand button handle its own click
                                  }
                                  // If farmer has farms, show the first farm's detail view
                                  if (farmerFarms.length > 0) {
                                    setSelectedFarmerForDetail(farmer);
                                    setSelectedFarmForDetail(farmerFarms[0]);
                                    setCropMonitoringViewMode("fieldDetail");
                                    setActiveTab("basic-info");
                                  }
                                }}
                              >
                                <td className="py-4 px-6 whitespace-nowrap">
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      if (farmerId) {
                                        toggleFarmerExpansion(farmerId.toString());
                                        if (!isExpanded && farmerFarms.length > 0) {
                                          // Load fields if not already loaded
                                          if (!farmerFields[farmerIdKey] || farmerFields[farmerIdKey].length === 0) {
                                            loadFarmerFields(farmerId.toString());
                                          }
                                        }
                                      }
                                    }}
                                    className="flex items-center justify-center w-8 h-8 rounded hover:bg-gray-200 transition-colors"
                                    disabled={!farmerId || farmerFarms.length === 0}
                                  >
                                    {farmerFarms.length > 0 ? (
                                      isExpanded ? (
                                        <ChevronDown className="h-4 w-4 text-gray-600" />
                                      ) : (
                                        <ChevronRight className="h-4 w-4 text-gray-600" />
                                      )
                                    ) : (
                                      <span className="w-4 h-4"></span>
                                    )}
                                  </button>
                                </td>
                                <td className="py-4 px-6 whitespace-nowrap">
                                  <div className="text-sm font-medium text-gray-900">{farmerName}</div>
                                </td>
                                <td className="py-4 px-6 whitespace-nowrap">
                                  <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <MapPin className="h-4 w-4 text-green-500 flex-shrink-0" />
                                    <span className="truncate max-w-[200px]">{location}</span>
                                  </div>
                                </td>
                                <td className="py-4 px-6 whitespace-nowrap">
                                  <div className="text-sm text-gray-900 font-medium">{farmerFarms.length}</div>
                                </td>
                                <td className="py-4 px-6 whitespace-nowrap">
                                  <div className="flex items-center gap-2">
                                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">
                                      <Monitor className="h-3 w-3 mr-1" />
                                      {monitoredFarmsCount}
                                    </span>
                                  </div>
                                </td>
                              </tr>
                              {isExpanded && farmerFarms.length > 0 && (
                                <tr key={`${farmerIdKey}-farms`}>
                                  <td colSpan={5} className="px-0 py-0 bg-gray-50">
                                    <div className="px-6 py-4">
                                      <div className="overflow-x-auto">
                                        <table className="w-full">
                                          <thead>
                                            <tr className="bg-white border-b border-gray-200">
                                              <th className="text-left py-3 px-4 font-medium text-gray-700 text-xs uppercase">Farm Name</th>
                                              <th className="text-left py-3 px-4 font-medium text-gray-700 text-xs uppercase">Crop Type</th>
                                              <th className="text-left py-3 px-4 font-medium text-gray-700 text-xs uppercase">Area (ha)</th>
                                              <th className="text-left py-3 px-4 font-medium text-gray-700 text-xs uppercase">Status</th>
                                              <th className="text-left py-3 px-4 font-medium text-gray-700 text-xs uppercase">Actions</th>
                                            </tr>
                                          </thead>
                                          <tbody className="bg-white divide-y divide-gray-100">
                                            {farmerFarms.map((farm, farmIndex) => {
                                              const farmId = farm._id || farm.id || farmIndex;
                                              const hasMonitoring = monitoringData[farmId];
                                              const farmAlerts = alerts.filter(a => {
                                                const alertFarmId = a.farmId?._id || a.farmId || a.farmId;
                                                return alertFarmId?.toString() === farmId.toString();
                                              });
                                              const unreadFarmAlerts = farmAlerts.filter(a => !a.read && !a.readAt);
                                              
                                              return (
                                                <tr
                                                  key={farmId}
                                                  className="hover:bg-gray-50/50 transition-all duration-150"
                                                >
                                                  <td className="py-3 px-4 whitespace-nowrap">
                                                    <div className="text-sm font-medium text-gray-900">{farm.name || "Unnamed Farm"}</div>
                                                  </td>
                                                  <td className="py-3 px-4 whitespace-nowrap">
                                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                                      <Leaf className="h-4 w-4 text-teal-500 flex-shrink-0" />
                                                      <span>{farm.cropType || farm.crop || "N/A"}</span>
                                                    </div>
                                                  </td>
                                                  <td className="py-3 px-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-600">
                                                      {farm.area ? `${Math.round(farm.area)} ha` : farm.size ? `${Math.round(farm.size)} ha` : "N/A"}
                                                    </div>
                                                  </td>
                                                  <td className="py-3 px-4 whitespace-nowrap">
                                                    <div className="flex items-center gap-2">
                                                      {hasMonitoring ? (
                                                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">
                                                          <Monitor className="h-3 w-3 mr-1" />
                                                          Monitored
                                                        </span>
                                                      ) : (
                                                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-800">
                                                          Not Monitored
                                                        </span>
                                                      )}
                                                      {unreadFarmAlerts.length > 0 && (
                                                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-800">
                                                          {unreadFarmAlerts.length} Alert{unreadFarmAlerts.length > 1 ? 's' : ''}
                                                        </span>
                                                      )}
                                                    </div>
                                                  </td>
                                                  <td className="py-3 px-4 whitespace-nowrap">
                                                    <div className="flex items-center gap-2">
                                                      <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() => {
                                                          setSelectedFarmForMonitoring(farmId.toString());
                                                          loadFarmMonitoring(farmId.toString());
                                                          if (farmAlerts.length > 0) {
                                                            loadAlerts(farmId.toString());
                                                          }
                                                        }}
                                                        className="border-green-600 text-green-600 hover:bg-green-50 !rounded-none"
                                                      >
                                                        <Eye className="h-3.5 w-3.5 mr-1.5" />
                                                        View
                                                      </Button>
                                                    </div>
                                                  </td>
                                                </tr>
                                              );
                                            })}
                                          </tbody>
                                        </table>
                                      </div>
                                    </div>
                                  </td>
                                </tr>
                              )}
                            </>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Alerts Section */}
          {!alertsLoading && alerts.length > 0 && (
            <Card className={`${dashboardTheme.card} mt-6`}>
              <CardHeader>
                <CardTitle className="text-gray-900 flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-orange-500" />
                  Recent Alerts
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {alerts.slice(0, 5).map((alert, index) => {
                    const alertId = alert._id || alert.id || index;
                    const isRead = alert.read || alert.readAt;
                    const severity = alert.severity || alert.level || 'medium';
                    
                    return (
                      <div
                        key={alertId}
                        className={`p-4 rounded-lg border ${
                          isRead 
                            ? 'bg-gray-50 border-gray-200' 
                            : severity === 'high' || severity === 'critical'
                            ? 'bg-red-50 border-red-200'
                            : severity === 'medium'
                            ? 'bg-yellow-50 border-yellow-200'
                            : 'bg-blue-50 border-blue-200'
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-semibold text-gray-900">{alert.title || alert.message || 'Alert'}</h4>
                              {!isRead && (
                                <span className="px-2 py-0.5 bg-red-500 text-white text-xs rounded-full">New</span>
                              )}
                            </div>
                            <p className="text-sm text-gray-600 mb-2">{alert.message || alert.description || 'No description'}</p>
                            <div className="flex items-center gap-4 text-xs text-gray-500">
                              {alert.farmId && (
                                <span className="flex items-center gap-1">
                                  <MapPin className="h-3 w-3" />
                                  Farm: {alert.farmId}
                                </span>
                              )}
                              {alert.createdAt && (
                                <span className="flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  {new Date(alert.createdAt).toLocaleString()}
                                </span>
                              )}
                            </div>
                          </div>
                          {!isRead && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => markAlertAsRead(alertId.toString())}
                              className="ml-4"
                            >
                              Mark as Read
                            </Button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Farm Monitoring Detail - Show when farm is selected */}
          {selectedFarmForMonitoring && monitoringData[selectedFarmForMonitoring] && (
            <Card className={`${dashboardTheme.card} mt-6`}>
              <CardHeader>
                <CardTitle className="text-gray-900 flex items-center gap-2">
                  <Monitor className="h-5 w-5 text-green-500" />
                  Monitoring Data
                </CardTitle>
              </CardHeader>
              <CardContent>
                {monitoringLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500 mr-3"></div>
                    <span className="text-sm text-gray-600">Loading monitoring data...</span>
                  </div>
                ) : (
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <pre className="text-xs bg-white p-3 rounded border border-gray-200 overflow-auto max-h-96">
                      {JSON.stringify(monitoringData[selectedFarmForMonitoring], null, 2)}
                    </pre>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    );
  };

  const navigationItems = [
    { id: "dashboard", label: "Dashboard", icon: BarChart3 },
    { id: "risk-assessments", label: "Risk Assessment", icon: Shield },
    { id: "loss-assessments", label: "Loss Assessment", icon: AlertCircle },
    { id: "farmers", label: "Farmers", icon: Users },
    { id: "crop-monitoring", label: "Crop Monitoring", icon: Monitor },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "profile-settings", label: "Profile Settings", icon: User }
  ];

  // Get display name from profile if available
  const displayName = assessorProfile 
    ? (assessorProfile.firstName && assessorProfile.lastName 
        ? `${assessorProfile.firstName} ${assessorProfile.lastName}`.trim()
        : assessorProfile.name || assessorProfile.firstName || assessorProfile.lastName || assessorName)
    : assessorName;

  return (
    <DashboardLayout
      userType="assessor"
      userId={assessorId}
      userName={displayName}
      navigationItems={navigationItems}
      activePage={activePage} 
      onPageChange={handlePageChange}
      onLogout={() => {
        // Clear localStorage and redirect to login
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        localStorage.removeItem('userId');
        localStorage.removeItem('phoneNumber');
        localStorage.removeItem('email');
        window.location.href = '/role-selection';
      }}
    >
      {renderPage()}

      {/* Upload KML Modal */}
      {showUploadModal && selectedFieldForUpload && (
        <Dialog open={showUploadModal} onOpenChange={setShowUploadModal}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Upload Field Contours</DialogTitle>
              <DialogDescription>
                Upload KML or KMZ file with field boundaries for {selectedFieldForUpload.cropType || "this field"}
              </DialogDescription>
            </DialogHeader>
            <div className="mt-4">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-green-500 transition-colors">
                <Upload className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <p className="text-gray-700 mb-2 font-medium">Drag-and-drop here or select files</p>
                <p className="text-sm text-gray-500 mb-4">with the field contours for the upload to start</p>
                <input
                  type="file"
                  id="kml-upload"
                  className="hidden"
                  accept=".kml,.kmz"
                  onChange={handleFileSelect}
                  disabled={uploadingFile}
                />
                <Button
                  onClick={() => document.getElementById('kml-upload')?.click()}
                  disabled={uploadingFile}
                  className="bg-green-600 hover:bg-green-700 text-white !rounded-none"
                >
                  {uploadingFile ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="h-4 w-4 mr-2" />
                      SELECT FILES
                    </>
                  )}
                </Button>
                <p className="text-xs text-gray-500 mt-4">
                  Supported formats are: .kml, .kmz
                </p>
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setShowUploadModal(false);
                  setSelectedFieldForUpload(null);
                }}
                disabled={uploadingFile}
                className="!rounded-none"
              >
                Cancel
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

    </DashboardLayout>
  );
}
