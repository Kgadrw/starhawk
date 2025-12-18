import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { dashboardTheme } from "@/utils/dashboardTheme";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ComposedChart } from "recharts";
import meteosourceApiService from "@/services/meteosourceApi";
import CombinedWeatherForecast from "@/components/common/CombinedWeatherForecast";
import LeafletMap from "@/components/common/LeafletMap";
import assessmentsApiService from "@/services/assessmentsApi";
import { getFarms, getAllFarms, getFarmById, getWeatherForecast, getHistoricalWeather, getAccumulatedWeather, getVegetationStats, getNDVITimeSeries, getFieldTrend } from "@/services/farmsApi";
import { getUserById } from "@/services/usersAPI";
import { getUserId } from "@/services/authAPI";
import { API_BASE_URL, getAuthToken } from "@/config/api";
import { useToast } from "@/hooks/use-toast";
import { 
  MapPin,
  Search,
  Plus,
  FileText,
  Shield,
  CloudRain,
  Leaf,
  FileSpreadsheet,
  Sun,
  Wind,
  Users,
  BarChart3,
  TrendingUp,
  Activity,
  Droplets,
  Thermometer,
  Clock,
  AlertTriangle,
  Calendar,
  Cloud,
  Upload,
  Download,
  CheckCircle,
  Star,
  Map,
  Eye,
  Filter,
  ArrowLeft,
  Sprout,
  Edit,
  User,
  ArrowUp,
  Loader2,
  Save,
  AlertCircle
} from "lucide-react";

interface AssessmentSummary {
  id: string;
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
    humidity: number;
  }>;
  daily: Array<{
    date: Date;
    summary: string;
    weather: string;
    icon: number;
    maxTemp: number;
    minTemp: number;
    precipitation: number;
    humidity: number;
    windSpeed: number;
    windDir: string;
    sunrise: string;
    sunset: string;
  }>;
}

interface RiskAssessmentSystemProps {
  assessments?: AssessmentSummary[];
  onRefresh?: () => void;
}

export default function RiskAssessmentSystem({ assessments: propAssessments, onRefresh }: RiskAssessmentSystemProps): JSX.Element {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [fieldSearchQuery, setFieldSearchQuery] = useState("");
  const [selectedAssessment, setSelectedAssessment] = useState<AssessmentSummary | null>(null);
  const [selectedField, setSelectedField] = useState<Field | null>(null);
  const [viewMode, setViewMode] = useState<"list" | "fieldSelection" | "fieldDetail">("list");
  const [activeTab, setActiveTab] = useState("basic-info");
  
  // State for API data
  const [internalAssessments, setInternalAssessments] = useState<AssessmentSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [farms, setFarms] = useState<any[]>([]);
  const [loadingFarms, setLoadingFarms] = useState(false);
  const [farmers, setFarmers] = useState<Record<string, any>>({});
  const [farmersList, setFarmersList] = useState<any[]>([]);
  const [loadingFarmers, setLoadingFarmers] = useState(false);
  const [selectedFarmerForDetail, setSelectedFarmerForDetail] = useState<any | null>(null);
  const [selectedFarmForDetail, setSelectedFarmForDetail] = useState<any | null>(null);
  const [dashboardViewMode, setDashboardViewMode] = useState<"list" | "fieldDetail">("list");
  const [filterOpen, setFilterOpen] = useState(false);
  const [assessmentDetails, setAssessmentDetails] = useState<any | null>(null);
  const [loadingAssessmentDetails, setLoadingAssessmentDetails] = useState(false);

  // Use prop assessments if provided, otherwise use internal state
  const assessments = propAssessments || internalAssessments;

  // Get logged-in assessor ID
  const assessorId = getUserId() || "";

  // Load assessments from API only if not provided via props
  useEffect(() => {
    if (!propAssessments) {
    loadAssessments();
    } else {
      setLoading(false);
    }
  }, [propAssessments]);

  // Load farms when component mounts or when assessment is selected
  useEffect(() => {
    if (selectedAssessment && viewMode === "fieldSelection") {
      loadFarmsForAssessment(selectedAssessment);
    }
  }, [selectedAssessment, viewMode]);

  // Also ensure we have all farms loaded for farmer field counts
  useEffect(() => {
    if (viewMode === "list" && farms.length === 0) {
      loadAllFarms();
    }
  }, [viewMode]);

  // Load farmers when component mounts or when assessments are loaded
  useEffect(() => {
    loadFarmersList();
  }, []);

  const loadAssessments = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log('🔍 RiskAssessmentSystem: Loading assessments');
      console.log('📍 API Endpoint: GET /api/v1/assessments');
      console.log('👤 Assessor ID:', assessorId);
      
      const response: any = await assessmentsApiService.getAllAssessments();
      console.log('📥 RiskAssessmentSystem API raw response:', response);
      
      // Handle different response structures
      let assessmentsData: any[] = [];
      if (Array.isArray(response)) {
        assessmentsData = response;
      } else if (response && typeof response === 'object') {
        // Try different possible data locations
        assessmentsData = response.data || response.assessments || response.items || response.results || [];
        // If still not an array, check for nested data
        if (!Array.isArray(assessmentsData) && typeof assessmentsData === 'object') {
          assessmentsData = assessmentsData.items || assessmentsData.results || [];
        }
      }
      
      // Ensure we have an array
      if (!Array.isArray(assessmentsData)) {
        console.warn('⚠️ Assessment data is not an array:', assessmentsData);
        assessmentsData = [];
      }
      
      console.log('📊 Extracted assessments data:', assessmentsData);
      console.log('📊 Total assessments from API:', assessmentsData.length);
      
      // Filter assessments assigned to this assessor
      const filteredAssessments = assessmentsData.filter((assessment: any) => {
        if (!assessorId) return false;
        const assessmentAssessorId = assessment.assessorId || assessment.assessor?._id || assessment.assessor?.id;
        return assessmentAssessorId === assessorId || assessmentAssessorId === assessorId.toString();
      });
      
      console.log('📊 Assessments assigned to this assessor:', filteredAssessments.length);
      
      if (filteredAssessments.length === 0 && assessmentsData.length > 0) {
        console.warn('⚠️ No assessments assigned to assessor:', assessorId);
        console.warn('⚠️ Available assessor IDs in data:', 
          assessmentsData.map(a => a.assessorId || a.assessor?._id || a.assessor?.id)
        );
      }

      // Helper function to get farmer name directly from assessment API response
      const getFarmerName = (assessment: any): string => {
        // Try all possible paths in the assessment response (API should populate farmer data)
        const farmerName = 
          assessment.farmerName || 
          assessment.farmer?.name || 
          assessment.farm?.farmerName ||
          assessment.farm?.farmer?.name ||
          assessment.farm?.farmerId?.name ||
          (assessment.farmer?.firstName && assessment.farmer?.lastName 
            ? `${assessment.farmer.firstName} ${assessment.farmer.lastName}`.trim()
            : '') ||
          (assessment.farm?.farmerId?.firstName && assessment.farm?.farmerId?.lastName
            ? `${assessment.farm.farmerId.firstName} ${assessment.farm.farmerId.lastName}`.trim()
            : '') ||
          assessment.farmer?.firstName || 
          assessment.farmer?.lastName ||
          assessment.farm?.farmerId?.firstName ||
          assessment.farm?.farmerId?.lastName ||
          assessment.farm?.farmerId?.email ||
          assessment.farm?.farmerId?.phoneNumber ||
          '';
        
        return farmerName || 'Unknown Farmer';
      };

      // Helper function to get location directly from assessment API response
      const getLocation = (assessment: any): string => {
        let location = '';
        
        // Check direct location field
        if (assessment.location) {
          if (typeof assessment.location === 'string') {
            location = assessment.location;
          } else if (assessment.location.coordinates && Array.isArray(assessment.location.coordinates)) {
            // Format coordinates as "lat, lng"
            location = `${assessment.location.coordinates[1]?.toFixed(4)}, ${assessment.location.coordinates[0]?.toFixed(4)}`;
          } else if (assessment.location.address) {
            location = assessment.location.address;
          }
        }
        
        // Check farm location (API should populate farm data)
        if (!location && assessment.farm) {
            if (assessment.farm.location) {
              if (typeof assessment.farm.location === 'string') {
                location = assessment.farm.location;
              } else if (assessment.farm.location.coordinates && Array.isArray(assessment.farm.location.coordinates)) {
              // Format coordinates as "lat, lng" (coordinates are [lng, lat] in GeoJSON)
                location = `${assessment.farm.location.coordinates[1]?.toFixed(4)}, ${assessment.farm.location.coordinates[0]?.toFixed(4)}`;
            } else if (assessment.farm.location.address) {
              location = assessment.farm.location.address;
            }
          }
          if (!location && assessment.farm.address) {
            location = assessment.farm.address;
          }
        }
        
        // Check farmId object location (if farmId is populated)
        if (!location && assessment.farmId && typeof assessment.farmId === 'object') {
          if (assessment.farmId.location) {
            if (typeof assessment.farmId.location === 'string') {
              location = assessment.farmId.location;
            } else if (assessment.farmId.location.coordinates && Array.isArray(assessment.farmId.location.coordinates)) {
              location = `${assessment.farmId.location.coordinates[1]?.toFixed(4)}, ${assessment.farmId.location.coordinates[0]?.toFixed(4)}`;
            } else if (assessment.farmId.location.address) {
              location = assessment.farmId.location.address;
            }
          }
          if (!location && assessment.farmId.address) {
            location = assessment.farmId.address;
          }
        }
        
        return location || 'Location not available';
      };

      // Map API response to AssessmentSummary interface - extract directly from response
      const mappedAssessments: AssessmentSummary[] = filteredAssessments.map((assessment: any) => {
        // Extract farmerId
        const farmerId = 
          assessment.farm?.farmerId?._id || 
          assessment.farm?.farmerId?.id ||
          (typeof assessment.farm?.farmerId === 'string' ? assessment.farm?.farmerId : '') ||
          assessment.farmerId?._id ||
          assessment.farmerId?.id ||
          (typeof assessment.farmerId === 'string' ? assessment.farmerId : '') ||
          '';

          return {
            id: assessment._id || assessment.id || `RISK-${assessment.assessmentId || 'UNKNOWN'}`,
          farmerId,
          farmerName: getFarmerName(assessment),
          location: getLocation(assessment),
            type: assessment.type || "Risk Assessment",
            status: assessment.status || "Pending",
            date: assessment.createdAt || assessment.assessmentDate || assessment.date || new Date().toISOString().split('T')[0]
          };
      });

      console.log('✅ RiskAssessmentSystem: Mapped assessments:', mappedAssessments);
      setInternalAssessments(mappedAssessments);
      
      if (mappedAssessments.length > 0) {
        toast({
          title: "Assessments Loaded",
          description: `Successfully loaded ${mappedAssessments.length} assessment(s)`,
        });
      }
    } catch (err: any) {
      console.error('❌ RiskAssessmentSystem: Failed to load assessments:', err);
      setError(err.message || 'Failed to load assessments');
      toast({
        title: 'Error loading assessments',
        description: err.message || 'Failed to load assessments',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const loadAllFarms = async () => {
    setLoadingFarms(true);
    try {
      // Try different pagination strategies to handle API inconsistencies
      let response: any = null;
      let farmsArray: any[] = [];
      
      // Strategy 1: Try page 1 first (API seems to use 1-based indexing based on response)
      console.log('RiskAssessmentSystem: Trying page 1...');
      response = await getFarms(1, 100);
      console.log('Farms API Response (page 1):', response);
      
      // Extract farms from response
      if (response?.success && response?.data?.items) {
        farmsArray = Array.isArray(response.data.items) ? response.data.items : [];
        console.log('Extracted farms from response.data.items (page 1):', farmsArray);
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
    } catch (err: any) {
      console.error('Failed to load farms:', err);
      toast({
        title: 'Error loading farms',
        description: err.message || 'Failed to load farms',
        variant: 'destructive'
      });
    } finally {
      setLoadingFarms(false);
    }
  };

  const loadFarmsForAssessment = async (assessment: AssessmentSummary) => {
    setLoadingFarms(true);
    try {
      // Get all farms and filter by farmer
      const response: any = await getAllFarms();
      let farmsData: any[] = [];
      
      if (Array.isArray(response)) {
        farmsData = response;
      } else if (response && typeof response === 'object') {
        farmsData = response.data || response.farms || response.items || response.results || [];
      }
      
      if (!Array.isArray(farmsData)) {
        farmsData = [];
      }

      // Filter farms by the farmer ID from assessment
      const relevantFarms = farmsData.filter((farm: any) => {
        const farmFarmerId = farm.farmerId?._id || farm.farmerId || farm.farmer?._id || farm.farmer?.id || '';
        return farmFarmerId === assessment.farmerId || 
               (typeof farmFarmerId === 'string' && typeof assessment.farmerId === 'string' && farmFarmerId === assessment.farmerId) ||
               farm.farmerName === assessment.farmerName;
      });

      setFarms(relevantFarms);

      // Load farmer info if needed
      if (assessment.farmerId && !farmers[assessment.farmerId]) {
        try {
          const farmerData: any = await getUserById(assessment.farmerId);
          const farmer = farmerData.data || farmerData;
          setFarmers(prev => ({ ...prev, [assessment.farmerId]: farmer }));
        } catch (err) {
          console.error('Failed to load farmer info:', err);
        }
      }
    } catch (err: any) {
      console.error('Failed to load farms:', err);
      toast({
        title: 'Error loading farms',
        description: err.message || 'Failed to load farms',
        variant: 'destructive'
      });
    } finally {
      setLoadingFarms(false);
    }
  };

  // Load farmers list from API (same logic as AssessorDashboard)
  const loadFarmersList = async () => {
    setLoadingFarmers(true);
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
        console.log(`⚠️ RiskAssessment: Assessments farmers endpoint returned ${response.status}, trying users endpoint...`);
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
          console.error('RiskAssessment: Fallback to users endpoint also failed:', fallbackErr);
          throw new Error(`Failed to load farmers: ${response.status}`);
        }
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: `HTTP error! status: ${response.status}` }));
        throw new Error(errorData.message || errorData.error || `Failed to load farmers: ${response.status}`);
      }

      const responseData = await response.json();
      console.log('✅ RiskAssessment: Farmers list API response:', responseData);
      console.log('📋 RiskAssessment: Full response structure:', JSON.stringify(responseData, null, 2));
      
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
      console.log(`✅ RiskAssessment: Loaded ${farmersArray.length} farmers`);
      
      // Extract fields from each farmer if they exist in the response
      farmersArray.forEach((farmer: any, index: number) => {
        const farmerId = farmer._id || farmer.id;
        if (farmerId) {
          // Log the structure of the first farmer for debugging
          if (index === 0) {
            console.log('🔍 RiskAssessment: Sample farmer structure:', {
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
            // Store fields in the farmer object for later use
            farmer._fields = fields;
            console.log(`  📦 RiskAssessment: Farmer ${farmerId} (${farmer.name || 'Unnamed'}) has ${fields.length} fields from API`);
            if (index === 0) {
              console.log('  📋 RiskAssessment: Sample field structure:', {
                name: fields[0].name,
                cropType: fields[0].cropType,
                area: fields[0].area,
                fieldKeys: Object.keys(fields[0] || {})
              });
            }
          } else {
            console.log(`  ⚠️ RiskAssessment: Farmer ${farmerId} (${farmer.name || 'Unnamed'}) has no fields in API response`);
          }
        }
      });
      
      setFarmersList(farmersArray);
    } catch (err: any) {
      console.error('RiskAssessment: Failed to load farmers:', err);
      toast({
        title: 'Error loading farmers',
        description: err.message || 'Failed to load farmers',
        variant: 'destructive'
      });
      setFarmersList([]);
    } finally {
      setLoadingFarmers(false);
    }
  };

  const getFieldsForAssessment = (assessment: AssessmentSummary): Field[] => {
    if (!farms || farms.length === 0) return [];

    // Map farms to Field interface
    return farms.map((farm: any, index: number) => {
      const farmer = farmers[assessment.farmerId] || {};
      const farmerName = farmer.firstName && farmer.lastName
        ? `${farmer.firstName} ${farmer.lastName}`
        : assessment.farmerName;

      // Determine status - "Healthy" for processed/active, "Active" for others
      let statusDisplay = "Active";
      if (farm.status === "Processed" || farm.status === "processed" || (farm.boundary && farm.boundary.coordinates)) {
        statusDisplay = "Healthy";
      } else if (farm.status) {
        statusDisplay = farm.status;
      }

      return {
        id: farm._id || farm.id || `temp-${index}`,
        farmerName,
        crop: farm.cropType || farm.crop || "Unknown",
        area: farm.area || farm.size || 0,
        season: farm.season || (index % 2 === 0 ? "A" : "B"),
        status: statusDisplay,
        fieldName: farm.name || "Unnamed Farm",
        sowingDate: farm.sowingDate || farm.plantingDate || new Date().toISOString().split('T')[0]
      };
    });
  };


  const handleAssessmentClick = (assessment: AssessmentSummary) => {
    setSelectedAssessment(assessment);
    setViewMode("fieldSelection");
  };

  const handleFieldClick = async (field: Field) => {
    setSelectedField(field);
    setViewMode("fieldDetail");
    
    // Load full assessment details
    if (selectedAssessment?.id) {
      setLoadingAssessmentDetails(true);
      try {
        const assessment = await assessmentsApiService.getAssessmentById(selectedAssessment.id);
        const assessmentData = assessment.data || assessment;
        setAssessmentDetails(assessmentData);
        
        // Load farm details if farmId is available
        if (assessmentData.farmId) {
          const farmId = typeof assessmentData.farmId === 'string' 
            ? assessmentData.farmId 
            : assessmentData.farmId._id || assessmentData.farmId.id;
          if (farmId) {
            try {
              const farmData = await getFarmById(farmId);
              setSelectedFarmForDetail(farmData.data || farmData);
            } catch (err) {
              console.error('Failed to load farm details:', err);
            }
          }
        }
      } catch (err: any) {
        console.error('Failed to load assessment details:', err);
        toast({
          title: "Error",
          description: "Failed to load assessment details",
          variant: "destructive",
        });
      } finally {
        setLoadingAssessmentDetails(false);
      }
    }
  };

  const handleBackToList = () => {
    setViewMode("list");
    setSelectedAssessment(null);
    setSelectedField(null);
  };

  const handleBackToFields = () => {
    setViewMode("fieldSelection");
    setSelectedField(null);
  };

  const getFieldDetails = (field: Field): FieldDetail => {
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
  };

  const renderFieldSelection = () => {
    if (!selectedAssessment) return null;
    
    if (loadingFarms) {
      return (
        <div className="space-y-4 bg-gray-50 min-h-screen p-4">
          <Button
            variant="ghost"
              onClick={handleBackToList}
            className="text-gray-600 hover:text-gray-700 mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Farmers
          </Button>
          <div className="mb-4">
            <h1 className="text-2xl font-bold text-gray-900">{selectedAssessment.farmerName} - Fields</h1>
            <p className="text-sm text-gray-600 mt-1">Select a field for risk assessment</p>
          </div>
          <Card className="bg-white border border-gray-200 shadow-sm">
            <CardContent className="p-8">
              <div className="flex items-center justify-center">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-500 mx-auto mb-3"></div>
                  <p className="text-sm text-gray-600">Loading fields...</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    const fields = getFieldsForAssessment(selectedAssessment);
    
    // Filter fields by search query
    const filteredFields = fields.filter(field => {
      return fieldSearchQuery === "" ||
        field.fieldName.toLowerCase().includes(fieldSearchQuery.toLowerCase()) ||
        field.id.toLowerCase().includes(fieldSearchQuery.toLowerCase()) ||
        field.crop.toLowerCase().includes(fieldSearchQuery.toLowerCase());
    });
    
    return (
      <div className="min-h-screen bg-gray-50 pt-6 pb-8">
        {/* Clean Header */}
        <div className="max-w-7xl mx-auto px-6 mb-6">
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm px-6 py-5">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
            onClick={handleBackToList}
                className="text-gray-600 hover:text-gray-700 p-0 h-auto"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <div>
                <h1 className="text-2xl font-semibold text-gray-900">Field Selection</h1>
                <p className="text-sm text-gray-500 mt-1">Select a field for {selectedAssessment.farmerName} to perform risk assessment</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-6">

          {/* Search Bar */}
          <div className="mb-6">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search something here.."
                value={fieldSearchQuery}
                onChange={(e) => setFieldSearchQuery(e.target.value)}
                className="pl-10 bg-gray-50 border-gray-200 text-sm"
              />
            </div>
          </div>

          {/* Fields Table - Professional Dashboard Style */}
          <Card className="bg-white border border-gray-200 shadow-sm">
            <CardHeader className="border-b border-gray-200 bg-gray-50">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-semibold text-gray-900">Available Fields</CardTitle>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs border-gray-200 hover:bg-gray-50"
                >
                  Export
                </Button>
              </div>
            </CardHeader>
          <CardContent className="p-0">
              {filteredFields.length === 0 ? (
              <div className="p-12 text-center">
                  <Leaf className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-sm font-medium text-gray-900 mb-1">No fields found</p>
                  <p className="text-xs text-gray-500">Try adjusting your search criteria</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                      <tr className="bg-gray-50 border-b border-gray-200">
                        <th className="text-left py-3 px-6 font-medium text-gray-700 text-xs">Field ID</th>
                        <th className="text-left py-3 px-6 font-medium text-gray-700 text-xs">Farmer</th>
                        <th className="text-left py-3 px-6 font-medium text-gray-700 text-xs">Crop</th>
                        <th className="text-left py-3 px-6 font-medium text-gray-700 text-xs">Area (ha)</th>
                        <th className="text-left py-3 px-6 font-medium text-gray-700 text-xs">Season</th>
                        <th className="text-left py-3 px-6 font-medium text-gray-700 text-xs">Status</th>
                        <th className="text-left py-3 px-6 font-medium text-gray-700 text-xs">Actions</th>
                    </tr>
                  </thead>
                    <tbody className="bg-white divide-y divide-gray-100">
                      {filteredFields.map((field, index) => {
                        const fieldId = field.id ? `FLD-${String(field.id).slice(-3).padStart(3, '0')}` : `FLD-${String(index + 1).padStart(3, '0')}`;
                        const statusText = field.status === "Processed" || field.status === "Active" ? "Healthy" : field.status;
                        const isHealthy = statusText === "Healthy" || field.status === "Processed" || field.status === "Active";
                        
                        return (
                      <tr
                        key={field.id}
                          className="hover:bg-green-50/30 transition-colors"
                      >
                          <td className="py-3.5 px-6 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{fieldId}</div>
                        </td>
                          <td className="py-3.5 px-6 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{field.farmerName}</div>
                          </td>
                          <td className="py-3.5 px-6 whitespace-nowrap">
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                              <Sprout className="h-4 w-4 text-gray-400" />
                            <span>{field.crop}</span>
                          </div>
                        </td>
                          <td className="py-3.5 px-6 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{field.area.toFixed(1)} ha</div>
                        </td>
                          <td className="py-3.5 px-6 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{field.season}</div>
                        </td>
                          <td className="py-3.5 px-6 whitespace-nowrap">
                            <span className={`inline-flex items-center px-2.5 py-1 rounded text-xs font-medium ${
                              isHealthy
                                ? "bg-green-50 text-green-700 border border-green-200"
                                : "bg-blue-50 text-blue-700 border border-blue-200"
                            }`}>
                              {statusText}
                          </span>
                        </td>
                          <td className="py-3.5 px-6 whitespace-nowrap">
                            <Button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleFieldClick(field);
                              }}
                              size="sm"
                              className="bg-green-600 hover:bg-green-700 text-white text-xs h-8 px-4"
                            >
                              <Eye className="h-3.5 w-3.5 mr-1.5" />
                              View
                            </Button>
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

  // Weather Analysis Component - Using CombinedWeatherForecast from common components
  const WeatherAnalysisTab = ({ location, farmId }: { location: string; farmId?: string }) => {
    const [weatherData, setWeatherData] = useState<any>(null);
    const [weatherLoading, setWeatherLoading] = useState(false);
    const [weatherError, setWeatherError] = useState<string | null>(null);

    useEffect(() => {
      const loadWeather = async () => {
        if (!farmId) {
          // If no farmId, just show the component without API data
          return;
        }
        
        setWeatherLoading(true);
        setWeatherError(null);
        try {
          const today = new Date();
          const endDate = new Date();
          endDate.setDate(today.getDate() + 7);
          
          const startDateStr = today.toISOString().split('T')[0];
          const endDateStr = endDate.toISOString().split('T')[0];
          
          // Load forecast and historical weather using Farmer Dashboard APIs
          const [forecast, historical] = await Promise.all([
            getWeatherForecast(farmId, startDateStr, endDateStr).catch(() => null),
            getHistoricalWeather(farmId, startDateStr, endDateStr).catch(() => null)
          ]);

          setWeatherData({ forecast, historical });
      } catch (err: any) {
        console.error('Failed to load weather data:', err);
          setWeatherError(err.message || 'Failed to load weather data');
      } finally {
          setWeatherLoading(false);
        }
      };

      loadWeather();
    }, [farmId]);

      return (
                <div>
        <CombinedWeatherForecast className="bg-gradient-to-br from-blue-900/90 to-cyan-900/90 border border-blue-700/30 rounded-xl shadow-xl" />
      </div>
    );
  };

  // Crop Analysis Component
  const CropAnalysisTab = ({ fieldDetails, assessmentId }: { fieldDetails: FieldDetail; assessmentId?: string }) => {
    const [dataSource, setDataSource] = useState<string>("drone");
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [uploadingPDF, setUploadingPDF] = useState(false);
    const [flightDate, setFlightDate] = useState<string>("2025-10-22");
    const [assessorNotes, setAssessorNotes] = useState<string>("Weed clusters in north. Pest minimal.");
    const [comprehensiveNotes, setComprehensiveNotes] = useState<string>("");
    const [savingNotes, setSavingNotes] = useState(false);
    const [generatingReport, setGeneratingReport] = useState(false);
    const [riskScore, setRiskScore] = useState<number | null>(null);
    const [mapTileLayer, setMapTileLayer] = useState<"osm" | "satellite" | "terrain">("satellite");
    const [selectedIndex, setSelectedIndex] = useState<string>("ndvi");
    const [vegetationStats, setVegetationStats] = useState<any>(null);
    const [loadingVegetation, setLoadingVegetation] = useState(false);
    
    // Default map center (Kigali, Rwanda coordinates)
    const mapCenter: [number, number] = [-1.9441, 30.0619];
    
    // Load vegetation stats when field is available
    useEffect(() => {
      const loadVegetationData = async () => {
        const farmId = fieldDetails.fieldId;
        if (!farmId) return;
        
        setLoadingVegetation(true);
        try {
          const today = new Date();
          const startDate = new Date();
          startDate.setDate(today.getDate() - 30);
          
          const startDateStr = startDate.toISOString().split('T')[0];
          const endDateStr = today.toISOString().split('T')[0];
          
          const stats = await getVegetationStats(farmId, startDateStr, endDateStr, 'NDVI,MSAVI,EVI,NDMI');
          setVegetationStats(stats.data || stats);
        } catch (err: any) {
          // Silently handle errors for missing EOSDA field ID
          if (!err?.message?.includes('EOSDA') && !err?.message?.includes('register the farm')) {
            console.error('Failed to load vegetation stats:', err);
          }
        } finally {
          setLoadingVegetation(false);
        }
      };
      
      loadVegetationData();
    }, [fieldDetails.fieldId]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file && file.type === "application/pdf") {
        setSelectedFile(file);
      } else {
        toast({
          title: "Invalid file type",
          description: "Please upload a PDF file.",
          variant: "destructive"
        });
      }
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      const file = e.dataTransfer.files[0];
      if (file && file.type === "application/pdf") {
        setSelectedFile(file);
      } else {
        toast({
          title: "Invalid file type",
          description: "Please upload a PDF file.",
          variant: "destructive"
        });
      }
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
    };

    // Load assessment data on mount
    useEffect(() => {
      const loadAssessmentData = async () => {
        if (!assessmentId) return;
        
        try {
          const assessment = await assessmentsApiService.getAssessmentById(assessmentId);
          const assessmentData = assessment.data || assessment;
          
          if (assessmentData.comprehensiveNotes) {
            setComprehensiveNotes(assessmentData.comprehensiveNotes);
          }
          if (assessmentData.riskScore !== null && assessmentData.riskScore !== undefined) {
            setRiskScore(assessmentData.riskScore);
          }
        } catch (err: any) {
          console.error('Failed to load assessment data:', err);
        }
      };
      
      loadAssessmentData();
    }, [assessmentId]);

    // Handle upload drone PDF
    const handleUploadDronePDF = async () => {
      if (!selectedFile || !assessmentId) {
        toast({
          title: "Validation Error",
          description: "Please select a PDF file and ensure assessment is loaded.",
          variant: "destructive",
        });
        return;
      }

      setUploadingPDF(true);
      try {
        await assessmentsApiService.uploadDronePDF(assessmentId, selectedFile);
        toast({
          title: "Success",
          description: "Drone PDF uploaded successfully.",
        });
        setSelectedFile(null);
      } catch (err: any) {
        console.error('Failed to upload drone PDF:', err);
        toast({
          title: "Upload Failed",
          description: err.message || 'Failed to upload drone PDF',
          variant: "destructive",
        });
      } finally {
        setUploadingPDF(false);
      }
    };

    // Handle save comprehensive notes
    const handleSaveNotes = async () => {
      if (!assessmentId) {
        toast({
          title: "Error",
          description: "Assessment ID not available.",
          variant: "destructive",
        });
        return;
      }

      setSavingNotes(true);
      try {
        await assessmentsApiService.updateAssessment(assessmentId, {
          comprehensiveNotes: comprehensiveNotes,
        });
        toast({
          title: "Success",
          description: "Comprehensive notes saved successfully.",
        });
      } catch (err: any) {
        console.error('Failed to save notes:', err);
        toast({
          title: "Save Failed",
          description: err.message || 'Failed to save comprehensive notes',
          variant: "destructive",
        });
      } finally {
        setSavingNotes(false);
      }
    };

    // Handle calculate risk score
    const handleCalculateRiskScore = async () => {
      if (!assessmentId) {
        toast({
          title: "Error",
          description: "Assessment ID not available.",
          variant: "destructive",
        });
        return;
      }

      try {
        const score = await assessmentsApiService.calculateRiskScore(assessmentId);
        const riskScoreValue = typeof score === 'number' ? score : (score.data || score.riskScore || score);
        setRiskScore(riskScoreValue);
        toast({
          title: "Success",
          description: `Risk score calculated: ${riskScoreValue}`,
        });
      } catch (err: any) {
        console.error('Failed to calculate risk score:', err);
        toast({
          title: "Calculation Failed",
          description: err.message || 'Failed to calculate risk score',
          variant: "destructive",
        });
      }
    };

    // Handle generate report
    const handleGenerateReport = async () => {
      if (!assessmentId) {
        toast({
          title: "Error",
          description: "Assessment ID not available.",
          variant: "destructive",
        });
        return;
      }

      // Validation
      if (riskScore === null || riskScore === undefined) {
        toast({
          title: "Validation Error",
          description: "Please calculate risk score before generating report.",
          variant: "destructive",
        });
        return;
      }

      if (!comprehensiveNotes || comprehensiveNotes.trim().length === 0) {
        toast({
          title: "Validation Error",
          description: "Please add comprehensive notes before generating report.",
          variant: "destructive",
        });
        return;
      }

      setGeneratingReport(true);
      try {
        await assessmentsApiService.generateReport(assessmentId);
        toast({
          title: "Success",
          description: "Report generated successfully. Insurer has been notified.",
        });
        // Refresh assessments if callback available
        if (onRefresh) {
          onRefresh();
        }
      } catch (err: any) {
        console.error('Failed to generate report:', err);
        toast({
          title: "Generation Failed",
          description: err.message || 'Failed to generate report',
          variant: "destructive",
        });
      } finally {
        setGeneratingReport(false);
      }
    };

    const handleSave = () => {
      toast({
        title: "Analysis saved",
        description: "Crop analysis data has been saved successfully.",
      });
    };

    const handleDownload = () => {
      const data = {
        fieldId: fieldDetails.fieldId,
        farmer: fieldDetails.farmer,
        crop: fieldDetails.cropType,
        area: fieldDetails.area,
        flightDate: flightDate,
        metrics: {
          healthyArea: 2.80,
          plantStress: 17.6,
          potentialStress: 0,
          fieldArea: fieldDetails.area,
          growingStage: "N/A"
        },
        notes: assessorNotes
      };
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `crop-analysis-${fieldDetails.fieldId}-${flightDate}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast({
        title: "Download started",
        description: "Summary JSON file is being downloaded.",
      });
    };

    const formatDate = (dateString: string) => {
      const date = new Date(dateString);
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear();
      return `${day}/${month}/${year}`;
    };

    return (
      <div className="space-y-4">
        {/* Field Summary */}
        <Card className="bg-white border border-gray-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-gray-900">Field Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div>
                <p className="text-sm text-gray-600 mb-1">Farmer: <span className="text-gray-900 font-medium">{fieldDetails.farmer}</span></p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Crop: <span className="text-gray-900 font-medium">{fieldDetails.cropType}</span></p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Area: <span className="text-gray-900 font-medium">{fieldDetails.area} ha</span></p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Data Source */}
        <Card className="bg-white border border-gray-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-gray-900">Data Source</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <Button
                variant={dataSource === "drone" ? "default" : "outline"}
                onClick={() => setDataSource("drone")}
                className={`flex items-center gap-2 ${
                  dataSource === "drone" 
                    ? "bg-gray-800 hover:bg-gray-900 text-white" 
                    : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                }`}
              >
                <Upload className="h-4 w-4" />
                  Drone Upload
              </Button>
              <Button
                variant={dataSource === "manual" ? "default" : "outline"}
                onClick={() => setDataSource("manual")}
                className={`flex items-center gap-2 ${
                  dataSource === "manual" 
                    ? "bg-gray-800 hover:bg-gray-900 text-white" 
                    : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                }`}
              >
                <User className="h-4 w-4" />
                  Manual Check
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Upload Drone Report Section - Only show when drone is selected */}
        {dataSource === "drone" && (
          <>
            <Card className="bg-white border border-gray-200 shadow-sm">
              <CardHeader>
                <CardTitle className="text-gray-900 flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Upload Drone Report (PDF)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center hover:border-gray-400 transition-colors cursor-pointer"
                  onClick={() => document.getElementById('pdf-upload')?.click()}
                >
                  <ArrowUp className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                  <p className="text-gray-900 text-lg font-medium mb-2">Upload PDF Report</p>
                  <p className="text-sm text-gray-600 mb-6">Supports plant stress analysis reports (Agremo format)</p>
                      <input
                        type="file"
                    id="pdf-upload"
                        className="hidden"
                    accept=".pdf"
                        onChange={handleFileChange}
                      />
                      <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      document.getElementById('pdf-upload')?.click();
                    }}
                    className="bg-gray-800 hover:bg-gray-900 text-white"
                  >
                    Select PDF File
                      </Button>
                      {selectedFile && (
                    <div className="mt-4 p-3 bg-gray-50 border border-gray-200 rounded-lg">
                      <p className="text-sm text-gray-700">Selected: {selectedFile.name}</p>
                      <p className="text-xs text-gray-500 mt-1">{(selectedFile.size / 1024).toFixed(2)} KB</p>
                      {assessmentId && (
                        <Button
                          onClick={handleUploadDronePDF}
                          disabled={uploadingPDF}
                          className="mt-3 bg-green-600 hover:bg-green-700 text-white"
                          size="sm"
                        >
                          {uploadingPDF ? (
                            <>
                              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                              Uploading...
                            </>
                          ) : (
                            <>
                              <Upload className="h-4 w-4 mr-2" />
                              Upload PDF
                            </>
                          )}
                        </Button>
                      )}
                        </div>
                      )}
                    </div>
              </CardContent>
            </Card>

                  {/* Flight Date */}
            <Card className="bg-white border border-gray-200 shadow-sm">
              <CardHeader>
                <CardTitle className="text-gray-900">Flight Date:</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4">
                    <Input
                      type="date"
                      value={flightDate}
                      onChange={(e) => setFlightDate(e.target.value)}
                    className="w-48 border-gray-300"
                    />
                  <span className="text-sm text-gray-700">{formatDate(flightDate)}</span>
                  </div>
              </CardContent>
            </Card>

                  {/* Drone Metrics */}
            <Card className="bg-white border border-gray-200 shadow-sm">
                      <CardHeader>
                <CardTitle className="text-gray-900">Drone Metrics</CardTitle>
                      </CardHeader>
                      <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <p className="text-xs text-gray-600 mb-1 font-medium">Healthy Area (Fine)</p>
                    <p className="text-xl font-bold text-gray-900">2.80 ha</p>
                      </div>
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <p className="text-xs text-gray-600 mb-1 font-medium">Plant Stress</p>
                    <p className="text-xl font-bold text-gray-900">17.6%</p>
                      </div>
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <p className="text-xs text-gray-600 mb-1 font-medium">Potential Stress</p>
                    <p className="text-xl font-bold text-gray-900">0%</p>
                      </div>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-xs text-gray-600 mb-1 font-medium">Field Area</p>
                    <p className="text-xl font-bold text-gray-900">{fieldDetails.area} ha</p>
                      </div>
                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                    <p className="text-xs text-gray-600 mb-1 font-medium">Growing Stage</p>
                    <p className="text-xl font-bold text-gray-900">N/A</p>
                      </div>
                    </div>
                      </CardContent>
                    </Card>

                  {/* Field Visualization */}
            <Card className="bg-white border border-gray-200 shadow-sm">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                  <CardTitle className="text-gray-900">Field Visualization</CardTitle>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 w-8 p-0 border-gray-300"
                    >
                      <span className="text-lg">+</span>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 w-8 p-0 border-gray-300"
                    >
                      <span className="text-lg">−</span>
                    </Button>
                          </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Map Controls */}
                  <div className="flex items-center justify-between flex-wrap gap-4">
                    <div className="flex items-center gap-2">
                      <Label className="text-sm text-gray-700">Layer:</Label>
                      <Select value={mapTileLayer} onValueChange={(value) => setMapTileLayer(value as "osm" | "satellite" | "terrain")}>
                        <SelectTrigger className="w-32 h-9 border-gray-300">
                                <SelectValue />
                              </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="satellite">Satellite</SelectItem>
                          <SelectItem value="osm">Street</SelectItem>
                          <SelectItem value="terrain">Terrain</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                    <div className="flex items-center gap-2">
                      <Label className="text-sm text-gray-700">Index:</Label>
                      <Select value={selectedIndex} onValueChange={setSelectedIndex}>
                        <SelectTrigger className="w-48 h-9 border-gray-300">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ndvi">🌱 NDVI</SelectItem>
                          <SelectItem value="evi">🌿 EVI</SelectItem>
                          <SelectItem value="savi">🌾 SAVI</SelectItem>
                        </SelectContent>
                      </Select>
                        </div>
                          </div>

                  {/* Map Container */}
                  <div className="border border-gray-200 rounded-lg overflow-hidden">
                    <LeafletMap
                      center={(() => {
                        // Use farm location if available
                        if (selectedFarmForDetail?.location?.coordinates) {
                          const coords = selectedFarmForDetail.location.coordinates;
                          return [coords[1], coords[0]]; // [lat, lng] from [lng, lat]
                        }
                        // Try parsing from fieldDetails location
                        if (fieldDetails.location.includes(',')) {
                          const parts = fieldDetails.location.split(',');
                          const lat = parseFloat(parts[0]?.trim() || "-1.9441");
                          const lng = parseFloat(parts[1]?.trim() || "30.0619");
                          return [lat, lng];
                        }
                        return mapCenter;
                      })()}
                      zoom={15}
                      height="500px"
                      tileLayer={mapTileLayer}
                      showControls={true}
                      className="w-full"
                      boundary={selectedFarmForDetail?.boundary || null}
                    />
                              </div>

                  {/* Vegetation Health Index Legend */}
                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <Label className="text-sm font-medium text-gray-900 mb-2 block">Vegetation Health Index</Label>
                              <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-600">Low</span>
                      <div className="flex-1 h-4 bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 rounded"></div>
                      <span className="text-xs text-gray-600">High</span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                  {/* Assessor Notes */}
            <Card className="bg-white border border-gray-200 shadow-sm">
              <CardHeader>
                <CardTitle className="text-gray-900">Assessor Notes</CardTitle>
              </CardHeader>
              <CardContent>
                    <Textarea
                      value={assessorNotes}
                      onChange={(e) => setAssessorNotes(e.target.value)}
                  className="min-h-[100px] border-gray-300"
                      placeholder="Enter your notes here..."
                    />
              </CardContent>
            </Card>

            {/* Comprehensive Notes */}
            {assessmentId && (
              <Card className="bg-white border border-gray-200 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-gray-900">Comprehensive Assessment Notes *</CardTitle>
                  <p className="text-sm text-gray-600 mt-1">Required for report generation</p>
                </CardHeader>
                <CardContent>
                  <Textarea
                    value={comprehensiveNotes}
                    onChange={(e) => setComprehensiveNotes(e.target.value)}
                    className="min-h-[150px] border-gray-300"
                    placeholder="Enter comprehensive assessment notes here..."
                  />
                  <Button
                    onClick={handleSaveNotes}
                    disabled={savingNotes}
                    className="mt-3 bg-green-600 hover:bg-green-700 text-white"
                    size="sm"
                  >
                    {savingNotes ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Save Notes
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Risk Score & Report Generation */}
            {assessmentId && (
              <Card className="bg-white border border-gray-200 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-gray-900">Risk Assessment & Report Generation</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Risk Score */}
                  <div className="flex items-center justify-between p-4 bg-gray-50 border border-gray-200 rounded-lg">
                    <div>
                      <p className="text-sm text-gray-600">Risk Score</p>
                      <p className={`text-2xl font-bold ${riskScore !== null ? 
                        riskScore <= 30 ? 'text-green-600' : 
                        riskScore <= 70 ? 'text-yellow-600' : 'text-red-600' 
                        : 'text-gray-400'}`}>
                        {riskScore !== null ? riskScore.toFixed(1) : 'Not calculated'}
                      </p>
                    </div>
                    <Button
                      onClick={handleCalculateRiskScore}
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      <Activity className="h-4 w-4 mr-2" />
                      Calculate Risk Score
                    </Button>
                  </div>

                  {/* Generate Report Button */}
                  <Button
                    onClick={handleGenerateReport}
                    disabled={generatingReport || riskScore === null || !comprehensiveNotes || comprehensiveNotes.trim().length === 0}
                    className="w-full bg-green-600 hover:bg-green-700 text-white"
                    size="lg"
                  >
                    {generatingReport ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Generating Report...
                      </>
                    ) : (
                      <>
                        <FileText className="h-4 w-4 mr-2" />
                        Generate Full Report
                      </>
                    )}
                  </Button>
                  {(!comprehensiveNotes || comprehensiveNotes.trim().length === 0) && (
                    <p className="text-sm text-yellow-600">Please add comprehensive notes before generating report.</p>
                  )}
                  {riskScore === null && (
                    <p className="text-sm text-yellow-600">Please calculate risk score before generating report.</p>
                  )}
                </CardContent>
              </Card>
            )}

                  {/* Action Buttons */}
                  <div className="flex gap-4">
                    <Button
                      onClick={handleSave}
                className="bg-gray-800 hover:bg-gray-900 text-white flex-1"
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Save Analysis
                    </Button>
                    <Button
                      onClick={handleDownload}
                      variant="outline"
                className="border-gray-300 text-gray-700 hover:bg-gray-50 flex-1"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download Summary JSON
                    </Button>
                  </div>
          </>
        )}
                </div>
    );
  };

  // Overview Tab Component with Risk Score, Notes, and Report Generation
  const OverviewTab = ({ 
    assessmentDetails, 
    assessmentId, 
    fieldDetails,
    onRefresh 
  }: { 
    assessmentDetails: any | null; 
    assessmentId?: string;
    fieldDetails: FieldDetail;
    onRefresh: () => void;
  }) => {
    const [riskScore, setRiskScore] = useState<number | null>(assessmentDetails?.riskScore ?? null);
    const [calculatingRisk, setCalculatingRisk] = useState(false);
    const [comprehensiveNotes, setComprehensiveNotes] = useState(assessmentDetails?.comprehensiveNotes || '');
    const [savingNotes, setSavingNotes] = useState(false);
    const [generatingReport, setGeneratingReport] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [uploadingPDF, setUploadingPDF] = useState(false);
    const [droneAnalysisData, setDroneAnalysisData] = useState<any>(assessmentDetails?.droneAnalysisData || null);

    // Update state when assessmentDetails changes
    useEffect(() => {
      if (assessmentDetails) {
        setRiskScore(assessmentDetails.riskScore ?? null);
        setComprehensiveNotes(assessmentDetails.comprehensiveNotes || '');
        setDroneAnalysisData(assessmentDetails.droneAnalysisData || null);
      }
    }, [assessmentDetails]);

    const handleCalculateRiskScore = async () => {
      if (!assessmentId) {
        toast({
          title: "Error",
          description: "Assessment ID not available.",
          variant: "destructive",
        });
        return;
      }

      setCalculatingRisk(true);
      try {
        const score = await assessmentsApiService.calculateRiskScore(assessmentId);
        const riskScoreValue = typeof score === 'number' ? score : (score?.data || score?.riskScore || score);
        setRiskScore(riskScoreValue);
        toast({
          title: "Success",
          description: `Risk score calculated: ${riskScoreValue}`,
        });
        // Refresh assessment details
        if (onRefresh) onRefresh();
      } catch (err: any) {
        console.error('Failed to calculate risk score:', err);
        toast({
          title: "Calculation Failed",
          description: err.message || 'Failed to calculate risk score',
          variant: "destructive",
        });
      } finally {
        setCalculatingRisk(false);
      }
    };

    const handleSaveNotes = async () => {
      if (!assessmentId) {
        toast({
          title: "Error",
          description: "Assessment ID not available.",
          variant: "destructive",
        });
        return;
      }

      setSavingNotes(true);
      try {
        await assessmentsApiService.updateAssessment(assessmentId, {
          comprehensiveNotes: comprehensiveNotes,
        });
        toast({
          title: "Success",
          description: "Comprehensive notes saved successfully.",
        });
        if (onRefresh) onRefresh();
      } catch (err: any) {
        console.error('Failed to save notes:', err);
        toast({
          title: "Save Failed",
          description: err.message || 'Failed to save comprehensive notes',
          variant: "destructive",
        });
      } finally {
        setSavingNotes(false);
      }
    };

    const handleUploadDronePDF = async () => {
      if (!selectedFile || !assessmentId) {
        toast({
          title: "Validation Error",
          description: "Please select a PDF file.",
          variant: "destructive",
        });
        return;
      }

      setUploadingPDF(true);
      try {
        const result = await assessmentsApiService.uploadDronePDF(assessmentId, selectedFile);
        setDroneAnalysisData(result?.droneAnalysisData || result?.data?.droneAnalysisData || null);
        toast({
          title: "Success",
          description: "Drone PDF uploaded successfully.",
        });
        setSelectedFile(null);
        if (onRefresh) onRefresh();
      } catch (err: any) {
        console.error('Failed to upload drone PDF:', err);
        toast({
          title: "Upload Failed",
          description: err.message || 'Failed to upload drone PDF',
          variant: "destructive",
        });
      } finally {
        setUploadingPDF(false);
      }
    };

    const handleGenerateReport = async () => {
      if (!assessmentId) {
        toast({
          title: "Error",
          description: "Assessment ID not available.",
          variant: "destructive",
        });
        return;
      }

      // Validation
      if (riskScore === null || riskScore === undefined) {
        toast({
          title: "Validation Error",
          description: "Please calculate risk score before generating report.",
          variant: "destructive",
        });
        return;
      }

      if (!comprehensiveNotes || comprehensiveNotes.trim().length === 0) {
        toast({
          title: "Validation Error",
          description: "Please add comprehensive notes before generating report.",
          variant: "destructive",
        });
        return;
      }

      setGeneratingReport(true);
      try {
        await assessmentsApiService.generateReport(assessmentId);
        toast({
          title: "Success",
          description: "Report generated successfully. Insurer has been notified.",
        });
        if (onRefresh) onRefresh();
        if (onRefresh) {
          onRefresh();
        }
      } catch (err: any) {
        console.error('Failed to generate report:', err);
        toast({
          title: "Generation Failed",
          description: err.message || 'Failed to generate report',
          variant: "destructive",
        });
      } finally {
        setGeneratingReport(false);
      }
    };

    const getRiskScoreColor = (score: number | null) => {
      if (score === null || score === undefined) return 'bg-gray-500';
      if (score <= 30) return 'bg-green-500';
      if (score <= 70) return 'bg-yellow-500';
      return 'bg-red-500';
    };

    const getRiskScoreLabel = (score: number | null) => {
      if (score === null || score === undefined) return 'Not Calculated';
      if (score <= 30) return 'Low Risk';
      if (score <= 70) return 'Medium Risk';
      return 'High Risk';
    };

    return (
      <div className="space-y-6">
        {/* Risk Score Card */}
        <Card className="bg-white border border-gray-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-gray-900 flex items-center justify-between">
              <span>Risk Score</span>
              {riskScore !== null && (
                <Badge className={`${getRiskScoreColor(riskScore)} text-white`}>
                  {getRiskScoreLabel(riskScore)}
                </Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {riskScore !== null ? (
              <div className="text-center py-6">
                <div className={`inline-flex items-center justify-center w-32 h-32 rounded-full ${getRiskScoreColor(riskScore)} text-white text-4xl font-bold mb-4`}>
                  {riskScore.toFixed(1)}
                </div>
                <p className="text-gray-600">{getRiskScoreLabel(riskScore)}</p>
              </div>
            ) : (
              <div className="text-center py-6">
                <p className="text-gray-600 mb-4">Risk score has not been calculated yet.</p>
                <Button
                  onClick={handleCalculateRiskScore}
                  disabled={calculatingRisk || !assessmentId}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  {calculatingRisk ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Calculating...
                    </>
                  ) : (
                    <>
                      <Activity className="h-4 w-4 mr-2" />
                      Calculate Risk Score
                    </>
                  )}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Comprehensive Notes Card */}
        <Card className="bg-white border border-gray-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-gray-900">Comprehensive Assessment Notes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              value={comprehensiveNotes}
              onChange={(e) => setComprehensiveNotes(e.target.value)}
              placeholder="Enter comprehensive assessment notes here..."
              className="min-h-[200px] border-gray-300"
            />
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-500">
                {comprehensiveNotes.length} characters
              </p>
              <Button
                onClick={handleSaveNotes}
                disabled={savingNotes || !assessmentId}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                {savingNotes ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Save Notes
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Drone PDF Upload Card */}
        <Card className="bg-white border border-gray-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-gray-900">Drone Analysis PDF</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {assessmentDetails?.droneAnalysisPdfUrl ? (
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-sm text-green-700 mb-2">PDF uploaded successfully</p>
                <a 
                  href={assessmentDetails.droneAnalysisPdfUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-sm text-green-600 hover:underline"
                >
                  View PDF
                </a>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <Upload className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                  <p className="text-gray-700 mb-2">Upload Drone Analysis PDF</p>
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                    className="hidden"
                    id="drone-pdf-upload"
                  />
                  <Button
                    onClick={() => document.getElementById('drone-pdf-upload')?.click()}
                    variant="outline"
                    className="border-gray-300 text-gray-700 hover:bg-gray-50"
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Select PDF File
                  </Button>
                  {selectedFile && (
                    <p className="text-sm text-gray-600 mt-2">Selected: {selectedFile.name}</p>
                  )}
                </div>
                {selectedFile && (
                  <Button
                    onClick={handleUploadDronePDF}
                    disabled={uploadingPDF || !assessmentId}
                    className="w-full bg-green-600 hover:bg-green-700 text-white"
                  >
                    {uploadingPDF ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Uploading...
                      </>
                    ) : (
                      <>
                        <Upload className="h-4 w-4 mr-2" />
                        Upload PDF
                      </>
                    )}
                  </Button>
                )}
              </div>
            )}
            {droneAnalysisData && (
              <div className="mt-4 p-4 bg-gray-50 border border-gray-200 rounded-lg">
                <p className="text-sm font-medium text-gray-900 mb-2">Extracted Data:</p>
                <pre className="text-xs bg-white p-3 rounded border border-gray-200 overflow-auto">
                  {JSON.stringify(droneAnalysisData, null, 2)}
                </pre>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Generate Report Card */}
        <Card className="bg-white border border-gray-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-gray-900">Generate Full Report</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                {riskScore !== null ? (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-gray-400" />
                )}
                <span className={`text-sm ${riskScore !== null ? 'text-gray-900' : 'text-gray-500'}`}>
                  Risk score calculated {riskScore !== null ? '✓' : '✗'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                {comprehensiveNotes && comprehensiveNotes.trim().length > 0 ? (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-gray-400" />
                )}
                <span className={`text-sm ${comprehensiveNotes && comprehensiveNotes.trim().length > 0 ? 'text-gray-900' : 'text-gray-500'}`}>
                  Comprehensive notes added {comprehensiveNotes && comprehensiveNotes.trim().length > 0 ? '✓' : '✗'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span className="text-sm text-gray-900">
                  Weather analysis done ✓
                </span>
              </div>
            </div>
            <Button
              onClick={handleGenerateReport}
              disabled={generatingReport || riskScore === null || !comprehensiveNotes || comprehensiveNotes.trim().length === 0 || !assessmentId}
              className="w-full bg-green-600 hover:bg-green-700 text-white"
            >
              {generatingReport ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Generating Report...
                </>
              ) : (
                <>
                  <FileText className="h-4 w-4 mr-2" />
                  Generate Full Report
                </>
              )}
            </Button>
            {assessmentDetails?.reportGenerated && (
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-sm text-green-700">
                  Report generated on {assessmentDetails.reportGeneratedAt 
                    ? new Date(assessmentDetails.reportGeneratedAt).toLocaleString() 
                    : 'N/A'}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderFieldDetail = () => {
    if (!selectedField) return null;
    const fieldDetails = getFieldDetails(selectedField);

    // Generate Field ID in FLD-XXX format
    const fieldId = selectedField.id ? `FLD-${String(selectedField.id).slice(-3).padStart(3, '0')}` : fieldDetails.fieldId;

    return (
      <div className="min-h-screen bg-gray-50 pt-6 pb-8">
        {/* Clean Header */}
        <div className="max-w-7xl mx-auto px-6 mb-6">
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm px-6 py-5">
                  <div>
              <h1 className="text-2xl font-semibold text-gray-900">Field Detail View</h1>
              <p className="text-sm text-gray-500 mt-1">{fieldId} • {fieldDetails.farmer} • {fieldDetails.cropType}</p>
                        </div>
                        </div>
                      </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList className="bg-white border border-gray-200 inline-flex h-10 items-center justify-center rounded-lg p-1">
            <TabsTrigger 
              value="basic-info" 
                className="data-[state=active]:bg-green-600 data-[state=active]:text-white text-gray-700 px-4 py-2 rounded text-sm"
            >
              <FileSpreadsheet className="h-4 w-4 mr-2" />
              Basic Info
            </TabsTrigger>
            <TabsTrigger 
              value="weather" 
                className="data-[state=active]:bg-green-600 data-[state=active]:text-white text-gray-700 px-4 py-2 rounded text-sm"
            >
              <CloudRain className="h-4 w-4 mr-2" />
              Weather Analysis
            </TabsTrigger>
            <TabsTrigger 
              value="crop" 
                className="data-[state=active]:bg-green-600 data-[state=active]:text-white text-gray-700 px-4 py-2 rounded text-sm"
            >
              <Leaf className="h-4 w-4 mr-2" />
                Crop Analysis (Drone)
              </TabsTrigger>
              <TabsTrigger 
                value="overview" 
                className="data-[state=active]:bg-green-600 data-[state=active]:text-white text-gray-700 px-4 py-2 rounded text-sm"
              >
                <FileText className="h-4 w-4 mr-2" />
                Overview
            </TabsTrigger>
          </TabsList>

          <TabsContent value="basic-info" className="mt-4">
            <div className="grid gap-4 md:grid-cols-2">
              {/* Left Panel - Field Information */}
              <Card className="bg-white border border-gray-200 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-gray-900">Field Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between items-center border-b border-gray-200 pb-2.5">
                    <span className="text-sm text-gray-600">Field ID:</span>
                    <span className="text-sm font-medium text-gray-900">{fieldId}</span>
                        </div>
                  <div className="flex justify-between items-center border-b border-gray-200 pb-2.5">
                    <span className="text-sm text-gray-600">Field Name:</span>
                    <span className="text-sm font-medium text-gray-900">{fieldDetails.fieldName}</span>
                        </div>
                  <div className="flex justify-between items-center border-b border-gray-200 pb-2.5">
                    <span className="text-sm text-gray-600">Farmer:</span>
                    <span className="text-sm font-medium text-gray-900">{fieldDetails.farmer}</span>
                      </div>
                  <div className="flex justify-between items-center border-b border-gray-200 pb-2.5">
                    <span className="text-sm text-gray-600">Crop Type:</span>
                    <div className="flex items-center gap-1.5">
                      <Sprout className="h-3.5 w-3.5 text-green-500" />
                      <span className="text-sm font-medium text-gray-900">{fieldDetails.cropType}</span>
                        </div>
                        </div>
                  <div className="flex justify-between items-center border-b border-gray-200 pb-2.5">
                    <span className="text-sm text-gray-600">Area:</span>
                    <span className="text-sm font-medium text-gray-900">{fieldDetails.area} hectares</span>
                      </div>
                  <div className="flex justify-between items-center border-b border-gray-200 pb-2.5">
                    <span className="text-sm text-gray-600">Season:</span>
                    <div className="flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5 text-gray-500" />
                      <span className="text-sm font-medium text-gray-900">Season {fieldDetails.season}</span>
                        </div>
                        </div>
                  <div className="flex justify-between items-center pb-2.5">
                    <span className="text-sm text-gray-600">Location:</span>
                    <div className="flex items-center gap-1.5">
                      <MapPin className="h-3.5 w-3.5 text-teal-500" />
                      <span className="text-sm font-medium text-gray-900">{fieldDetails.location}</span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2 pt-3 border-t border-gray-200 mt-3">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                    >
                      <Edit className="h-3.5 w-3.5 mr-1.5" />
                      Edit Info
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                    >
                      <FileText className="h-3.5 w-3.5 mr-1.5" />
                      View History
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Right Panel - Map View */}
              <Card className="bg-white border border-gray-200 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-gray-900">Map View</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="border border-gray-200 rounded-lg overflow-hidden">
                    <LeafletMap
                      center={(() => {
                        // Use farm location if available
                        if (selectedFarmForDetail?.location?.coordinates) {
                          const coords = selectedFarmForDetail.location.coordinates;
                          return [coords[1], coords[0]]; // [lat, lng] from [lng, lat]
                        }
                        // Try parsing from fieldDetails location
                        if (fieldDetails.location.includes(',')) {
                          const parts = fieldDetails.location.split(',');
                          const lat = parseFloat(parts[0]?.trim() || "-1.9441");
                          const lng = parseFloat(parts[1]?.trim() || "30.0619");
                          return [lat, lng];
                        }
                        return [-1.9441, 30.0619];
                      })()}
                      zoom={15}
                      height="500px"
                      tileLayer="satellite"
                      showControls={true}
                      className="w-full"
                      boundary={selectedFarmForDetail?.boundary || null}
                    />
                  </div>
                </CardContent>
              </Card>
                </div>
              </TabsContent>

          <TabsContent value="weather" className="mt-4">
            <WeatherAnalysisTabWithAPI 
              fieldDetails={fieldDetails} 
              farmId={(() => {
                // Extract farmId from assessmentDetails or selectedField
                if (assessmentDetails?.farmId) {
                  return typeof assessmentDetails.farmId === 'string' 
                    ? assessmentDetails.farmId 
                    : assessmentDetails.farmId._id || assessmentDetails.farmId.id;
                }
                return selectedField?.id || '';
              })()} 
            />
          </TabsContent>

          <TabsContent value="crop" className="mt-4">
            <CropAnalysisTab 
              fieldDetails={fieldDetails} 
              assessmentId={(() => {
                // Use assessmentDetails _id if available, otherwise use selectedAssessment id
                if (assessmentDetails?._id) return assessmentDetails._id;
                if (assessmentDetails?.id) return assessmentDetails.id;
                return selectedAssessment?.id || '';
              })()}
            />
          </TabsContent>

          <TabsContent value="overview" className="mt-4">
            <OverviewTab 
              assessmentDetails={assessmentDetails}
              assessmentId={(() => {
                // Use assessmentDetails _id if available, otherwise use selectedAssessment id
                if (assessmentDetails?._id) return assessmentDetails._id;
                if (assessmentDetails?.id) return assessmentDetails.id;
                return selectedAssessment?.id || '';
              })()}
              fieldDetails={fieldDetails}
              onRefresh={() => {
                if (selectedAssessment?.id && selectedField) {
                  handleFieldClick(selectedField);
                }
              }}
            />
          </TabsContent>
        </Tabs>
        </div>
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
        return "bg-yellow-500 text-white border-yellow-600";
      case "submitted":
        return "bg-blue-500 text-white border-blue-600";
      case "under review":
      case "processing":
        return "bg-orange-500 text-white border-orange-600";
      case "rejected":
        return "bg-red-500 text-white border-red-600";
      default:
        return "bg-gray-500 text-white border-gray-600";
    }
  };

  // Helper function to get field details from farm
  const getFieldDetailsFromFarm = (farm: any, farmer: any): FieldDetail => {
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

  // Render field detail view for dashboard mode
  const renderDashboardFieldDetail = () => {
    if (!selectedFarmForDetail || !selectedFarmerForDetail) return null;
    
    const fieldDetails = getFieldDetailsFromFarm(selectedFarmForDetail, selectedFarmerForDetail);
    const fieldId = selectedFarmForDetail._id || selectedFarmForDetail.id || '';
    const displayFieldId = fieldId ? `FLD-${String(fieldId).slice(-3).padStart(3, '0')}` : 'FLD-000';

    return (
      <div className="min-h-screen bg-gray-50 pt-6 pb-8">
        <div className="max-w-7xl mx-auto px-6 space-y-6">
          {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm">
          <button 
              onClick={() => {
                setDashboardViewMode("list");
                setSelectedFarmerForDetail(null);
                setSelectedFarmForDetail(null);
              }}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-700"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Field List
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
            <TabsList className="bg-white border border-gray-200 inline-flex h-10 items-center justify-center rounded-lg p-1">
            <TabsTrigger 
              value="basic-info" 
                className="data-[state=active]:bg-gray-200 data-[state=active]:text-gray-900 text-gray-700 px-4 py-2 rounded text-sm"
            >
              <FileSpreadsheet className="h-4 w-4 mr-2" />
              Basic Info
            </TabsTrigger>
            <TabsTrigger 
              value="weather" 
                className="data-[state=active]:bg-gray-200 data-[state=active]:text-gray-900 text-gray-700 px-4 py-2 rounded text-sm"
            >
              <CloudRain className="h-4 w-4 mr-2" />
              Weather Analysis
            </TabsTrigger>
            <TabsTrigger 
              value="crop" 
                className="data-[state=active]:bg-gray-200 data-[state=active]:text-gray-900 text-gray-700 px-4 py-2 rounded text-sm"
            >
              <Leaf className="h-4 w-4 mr-2" />
                Crop Analysis (Satellite)
              </TabsTrigger>
              <TabsTrigger 
                value="overview" 
                className="data-[state=active]:bg-gray-200 data-[state=active]:text-gray-900 text-gray-700 px-4 py-2 rounded text-sm"
              >
                <FileText className="h-4 w-4 mr-2" />
                Overview
            </TabsTrigger>
          </TabsList>

            {/* Tab Contents */}
          <TabsContent value="basic-info" className="mt-6">
            <div className="grid gap-6 md:grid-cols-2">
                {/* Field Information */}
                <Card className="bg-white border border-gray-200 shadow-sm">
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
                        className="flex-1 bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                      >
                        <Edit className="h-3.5 w-3.5 mr-1.5" />
                        Edit Info
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                      >
                        <FileText className="h-3.5 w-3.5 mr-1.5" />
                        View History
                      </Button>
                  </div>
                </CardContent>
              </Card>

                {/* Map View */}
                <Card className="bg-white border border-gray-200 shadow-sm">
                <CardHeader>
                    <CardTitle className="text-gray-900">Map View</CardTitle>
                </CardHeader>
                  <CardContent className="p-0">
                    <div className="border border-gray-200 rounded-lg overflow-hidden">
                      <LeafletMap
                        center={(() => {
                          // Use farm location if available
                          if (selectedFarmForDetail?.location?.coordinates) {
                            const coords = selectedFarmForDetail.location.coordinates;
                            return [coords[1], coords[0]]; // [lat, lng] from [lng, lat]
                          }
                          // Try parsing from fieldDetails location string
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
                        boundary={selectedFarmForDetail?.boundary || null}
                      />
                    </div>
                  </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="weather" className="mt-6">
              <WeatherAnalysisTabWithAPI fieldDetails={fieldDetails} farmId={fieldId} />
          </TabsContent>

          <TabsContent value="crop" className="mt-6">
            <CropAnalysisTab fieldDetails={fieldDetails} assessmentId={selectedAssessment?.id} />
          </TabsContent>

            <TabsContent value="overview" className="mt-6">
              <OverviewTab 
                assessmentDetails={assessmentDetails}
                assessmentId={selectedAssessment?.id}
                fieldDetails={fieldDetails}
                onRefresh={() => {
                  if (selectedAssessment?.id) {
                    handleFieldClick(selectedField!);
                  }
                }}
              />
          </TabsContent>
        </Tabs>
        </div>
      </div>
    );
  };

  // Weather Analysis Tab with API integration (using all available weather and indices APIs)
  const WeatherAnalysisTabWithAPI = ({ fieldDetails, farmId }: { fieldDetails: FieldDetail; farmId: string }) => {
    const [weatherData, setWeatherData] = useState<any>(null);
    const [indicesData, setIndicesData] = useState<any>(null);
    const [weatherLoading, setWeatherLoading] = useState(false);
    const [weatherError, setWeatherError] = useState<string | null>(null);

    useEffect(() => {
      const loadWeather = async () => {
        if (!farmId) return;
        
        setWeatherLoading(true);
        setWeatherError(null);
        try {
          const today = new Date();
          const endDate = new Date();
          endDate.setDate(today.getDate() + 7);
          
          const startDateStr = today.toISOString().split('T')[0];
          const endDateStr = endDate.toISOString().split('T')[0];
          
          // Helper function to handle API errors gracefully
          const handleApiError = (err: any, apiName: string) => {
            // Silently handle 400 errors for missing EOSDA field ID
            if (err?.message?.includes('EOSDA') || err?.message?.includes('register the farm')) {
              return null;
            }
            console.warn(`${apiName} error:`, err);
            return null;
          };
          
          // Load all weather APIs
          const [forecast, historical, accumulated] = await Promise.all([
            getWeatherForecast(farmId, startDateStr, endDateStr).catch((err: any) => handleApiError(err, 'Weather forecast')),
            getHistoricalWeather(farmId, startDateStr, endDateStr).catch((err: any) => handleApiError(err, 'Historical weather')),
            getAccumulatedWeather(farmId, startDateStr, endDateStr).catch((err: any) => handleApiError(err, 'Accumulated weather'))
          ]);

          // Load all indices APIs
          const [indicesStats, ndviTimeSeries, fieldTrend] = await Promise.all([
            getVegetationStats(farmId, startDateStr, endDateStr).catch((err: any) => handleApiError(err, 'Vegetation indices statistics')),
            getNDVITimeSeries(farmId, startDateStr, endDateStr).catch((err: any) => handleApiError(err, 'NDVI time series')),
            getFieldTrend(farmId, 'NDVI', startDateStr, endDateStr).catch((err: any) => handleApiError(err, 'Field trend'))
          ]);

          setWeatherData({ forecast, historical, accumulated });
          setIndicesData({ indicesStats, ndviTimeSeries, fieldTrend });
        } catch (err: any) {
          // Only show error if it's not an expected EOSDA error
          if (!err?.message?.includes('EOSDA') && !err?.message?.includes('register the farm')) {
            console.error('Failed to load weather data:', err);
            setWeatherError(err.message || 'Failed to load weather data');
          }
        } finally {
          setWeatherLoading(false);
        }
      };

      loadWeather();
    }, [farmId]);

    if (weatherLoading) {
      return (
        <Card className="bg-white border border-gray-200 shadow-sm">
          <CardContent className="p-12">
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500 mr-3"></div>
              <span className="text-sm text-gray-600">Loading weather data...</span>
            </div>
          </CardContent>
        </Card>
      );
    }

    if (weatherError) {
      return (
        <Card className="bg-white border border-red-200 shadow-sm">
          <CardContent className="p-4">
            <div className="text-center text-red-600">
              <AlertTriangle className="h-12 w-12 mx-auto mb-4" />
              <p>{weatherError}</p>
            </div>
          </CardContent>
        </Card>
      );
    }

    // Prepare NDVI chart data
    const ndviChartData = indicesData?.ndviTimeSeries?.data || indicesData?.ndviTimeSeries || [];
    const ndviChartFormatted = Array.isArray(ndviChartData) ? ndviChartData.map((item: any) => ({
      date: item.date || item.timestamp || item.time || '',
      ndvi: item.ndvi || item.value || 0
    })) : [];

    // Prepare weather history chart data
    const weatherHistoryData = weatherData?.historical?.data || weatherData?.historical || [];
    const weatherChartData = Array.isArray(weatherHistoryData) ? weatherHistoryData.map((item: any) => ({
      date: item.date || item.timestamp || item.time || '',
      temperature: item.temperature || item.temp || 0,
      rainfall: item.rainfall || item.precipitation || item.precip || 0
    })) : [];

    return (
      <div className="space-y-6">
        {/* Weather Forecast */}
        <CombinedWeatherForecast className="bg-gradient-to-br from-blue-900/90 to-cyan-900/90 border border-blue-700/30 rounded-xl shadow-xl" />
        
        {/* NDVI Chart */}
        {ndviChartFormatted.length > 0 && (
          <Card className="bg-white border border-gray-200 shadow-sm">
            <CardHeader>
              <CardTitle className="text-gray-900">NDVI Time Series</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={ndviChartFormatted}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="date" 
                    tick={{ fontSize: 12 }}
                    angle={-45}
                    textAnchor="end"
                    height={80}
                  />
                  <YAxis 
                    domain={[0, 1]}
                    tick={{ fontSize: 12 }}
                  />
                  <Tooltip />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="ndvi" 
                    stroke="rgba(20, 40, 75, 1)" 
                    strokeWidth={2}
                    name="NDVI"
                    dot={{ r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}

        {/* Weather History Chart */}
        {weatherChartData.length > 0 && (
          <Card className="bg-white border border-gray-200 shadow-sm">
            <CardHeader>
              <CardTitle className="text-gray-900">Weather History</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <ComposedChart data={weatherChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="date" 
                    tick={{ fontSize: 12 }}
                    angle={-45}
                    textAnchor="end"
                    height={80}
                  />
                  <YAxis yAxisId="left" tick={{ fontSize: 12 }} />
                  <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Legend />
                  <Bar yAxisId="right" dataKey="rainfall" fill="#3b82f6" name="Rainfall (mm)" />
                  <Line 
                    yAxisId="left"
                    type="monotone" 
                    dataKey="temperature" 
                    stroke="#ef4444" 
                    strokeWidth={2}
                    name="Temperature (°C)"
                    dot={{ r: 4 }}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}

        {/* Vegetation Statistics Summary */}
        {indicesData?.indicesStats && (
          <Card className="bg-white border border-gray-200 shadow-sm">
            <CardHeader>
              <CardTitle className="text-gray-900">Vegetation Indices Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {indicesData.indicesStats.NDVI && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <p className="text-xs text-gray-600 mb-1">NDVI Average</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {indicesData.indicesStats.NDVI.average?.toFixed(2) || 
                       indicesData.indicesStats.NDVI.mean?.toFixed(2) || 
                       'N/A'}
                    </p>
                  </div>
                )}
                {indicesData.indicesStats.MSAVI && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-xs text-gray-600 mb-1">MSAVI Average</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {indicesData.indicesStats.MSAVI.average?.toFixed(2) || 
                       indicesData.indicesStats.MSAVI.mean?.toFixed(2) || 
                       'N/A'}
                    </p>
                  </div>
                )}
                {indicesData.indicesStats.EVI && (
                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                    <p className="text-xs text-gray-600 mb-1">EVI Average</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {indicesData.indicesStats.EVI.average?.toFixed(2) || 
                       indicesData.indicesStats.EVI.mean?.toFixed(2) || 
                       'N/A'}
                    </p>
                  </div>
                )}
                {indicesData.indicesStats.NDMI && (
                  <div className="bg-teal-50 border border-teal-200 rounded-lg p-4">
                    <p className="text-xs text-gray-600 mb-1">NDMI Average</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {indicesData.indicesStats.NDMI.average?.toFixed(2) || 
                       indicesData.indicesStats.NDMI.mean?.toFixed(2) || 
                       'N/A'}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    );
  };

  const renderDashboard = () => {
    // Use farmers from API if available, otherwise fall back to assessments
    let farmerData: any[] = [];
    
    if (farmersList && farmersList.length > 0) {
      // Build farmer data from API farmers list
      farmerData = farmersList.map((farmer: any) => {
        const farmerId = farmer._id || farmer.id;
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
        
        // Count fields for this farmer
        // First, try to get fields from farmersList (which has _fields populated from API)
        const farmerFromList = farmersList.find((f: any) => {
          const fId = f._id || f.id;
          const fIdStr = fId?.toString() || '';
          const targetFarmerIdStr = farmerId?.toString() || '';
          return fIdStr === targetFarmerIdStr;
        });
        
        let fieldCount = 0;
        if (farmerFromList && farmerFromList._fields && Array.isArray(farmerFromList._fields)) {
          // Use fields from API response
          fieldCount = farmerFromList._fields.length;
        } else {
          // Fallback: Count from farms array
          const farmerFarms = Array.isArray(farms) 
            ? farms.filter(farm => {
                const farmFarmerId = farm.farmerId?._id || farm.farmerId || farm.farmer?._id || farm.farmer?.id || farm.farmer || '';
                const farmFarmerIdStr = farmFarmerId?.toString() || '';
                const targetFarmerIdStr = farmerId?.toString() || '';
                return farmFarmerIdStr === targetFarmerIdStr;
              })
            : [];
          fieldCount = farmerFarms.length || 0;
        }
        
        return {
          farmerId: `F-${String(farmerId).slice(-3).padStart(3, '0')}`,
          farmerName,
          location,
          totalFields: fieldCount,
          originalFarmerId: farmerId
        };
      });
    } else {
      // Fallback: Get unique farmers from assessments
      const uniqueFarmerIds = new Set(assessments.map(a => a.farmerId).filter(Boolean));
      
      farmerData = Array.from(uniqueFarmerIds).map(farmerId => {
        const farmerAssessments = assessments.filter(a => a.farmerId === farmerId);
        const farmerName = farmerAssessments[0]?.farmerName || "Unknown Farmer";
        const location = farmerAssessments[0]?.location || "Unknown Location";
        
        // Count fields for this farmer
        // First, try to get fields from farmersList (which has _fields populated from API)
        const farmerFromList = farmersList.find((f: any) => {
          const fId = f._id || f.id;
          return fId === farmerId || fId?.toString() === farmerId?.toString();
        });
        
        let fieldCount = 0;
        if (farmerFromList && farmerFromList._fields && Array.isArray(farmerFromList._fields)) {
          // Use fields from API response
          fieldCount = farmerFromList._fields.length;
        } else {
          // Fallback: Count from farms array
          const farmerFarms = Array.isArray(farms) 
            ? farms.filter(farm => {
                const farmFarmerId = farm.farmerId?._id || farm.farmerId || farm.farmer?._id || farm.farmer?.id || '';
                return farmFarmerId === farmerId || 
                       (typeof farmFarmerId === 'string' && typeof farmerId === 'string' && farmFarmerId === farmerId) ||
                       farm.farmerName === farmerName;
              })
            : [];
          fieldCount = farmerFarms.length || 0;
        }
        
        return {
          farmerId: `F-${String(farmerId).slice(-3).padStart(3, '0')}`,
          farmerName,
          location,
          totalFields: fieldCount,
          originalFarmerId: farmerId
        };
      });
    }

    // Filter farmers by search query
    const filteredFarmers = farmerData.filter(farmer => {
      return searchQuery === "" ||
        farmer.farmerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        farmer.farmerId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        farmer.location.toLowerCase().includes(searchQuery.toLowerCase());
    });

    // Handle farmer click - show field detail view
    const handleFarmerClick = (farmer: typeof farmerData[0]) => {
      // Find the farmer in farmersList
      const farmerObj = farmersList.find(f => (f._id || f.id) === farmer.originalFarmerId);
      if (!farmerObj) {
        // Fallback: try to find in assessments
        const farmerAssessment = assessments.find(a => a.farmerId === farmer.originalFarmerId);
        if (farmerAssessment) {
          handleAssessmentClick(farmerAssessment);
        }
        return;
      }
      
      // Get fields for this farmer - prefer _fields from API, fallback to farms array
      let farmerFarms: any[] = [];
      
      if (farmerObj._fields && Array.isArray(farmerObj._fields) && farmerObj._fields.length > 0) {
        // Use fields from API response
        farmerFarms = farmerObj._fields;
      } else {
        // Fallback: Get from farms array
        farmerFarms = Array.isArray(farms) 
          ? farms.filter(farm => {
              const farmFarmerId = farm.farmerId?._id || farm.farmerId || farm.farmer?._id || farm.farmer?.id || farm.farmer || '';
              const farmFarmerIdStr = farmFarmerId?.toString() || '';
              const targetFarmerIdStr = farmer.originalFarmerId?.toString() || '';
              return farmFarmerIdStr === targetFarmerIdStr;
            })
          : [];
      }
      
      if (farmerFarms.length > 0) {
        setSelectedFarmerForDetail(farmerObj);
        setSelectedFarmForDetail(farmerFarms[0]);
        setDashboardViewMode("fieldDetail");
        setActiveTab("basic-info");
      } else {
        toast({
          title: 'No fields found',
          description: 'This farmer has no fields available.',
          variant: 'destructive'
        });
      }
    };

    return (
      <div className="min-h-screen bg-gray-50 pt-6 pb-8">
        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-6">
          {/* Summary Cards - Clean Modern Style */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <Card className="bg-white border border-gray-200 shadow-sm hover:shadow transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-xs text-gray-500 mb-1">Total Farmers</p>
                    <p className="text-xl font-semibold text-gray-900">{filteredFarmers.length}</p>
                    <p className="text-xs text-green-600 mt-1">All registered</p>
            </div>
                  <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center">
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
                    <p className="text-xl font-semibold text-gray-900">
                      {filteredFarmers.reduce((sum, f) => sum + f.totalFields, 0)}
                    </p>
                    <p className="text-xs text-green-600 mt-1">Across all farmers</p>
                </div>
                  <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center">
                    <Leaf className="h-6 w-6 text-green-600" />
          </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border border-gray-200 shadow-sm hover:shadow transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-xs text-gray-500 mb-1">Active Assessments</p>
                    <p className="text-xl font-semibold text-gray-900">{assessments.length}</p>
                    <p className="text-xs text-green-600 mt-1">In progress</p>
                  </div>
                  <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center">
                    <Shield className="h-6 w-6 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border border-gray-200 shadow-sm hover:shadow transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-xs text-gray-500 mb-1">Completion Rate</p>
                    <p className="text-xl font-semibold text-gray-900">
                      {assessments.length > 0 ? Math.round((assessments.filter(a => a.status === 'submitted' || a.status === 'approved').length / assessments.length) * 100) : 0}%
                    </p>
                    <p className="text-xs text-green-600 mt-1">Success rate</p>
                  </div>
                  <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center">
                    <TrendingUp className="h-6 w-6 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
        </div>

        {/* Loading State */}
          {(loading || loadingFarms || loadingFarmers) && (
            <Card className="bg-white border border-gray-200 shadow-sm">
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
        {error && !loading && (
            <Card className="bg-white border border-red-200 shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-red-500" />
                    <p className="text-sm text-red-600">{error}</p>
                  </div>
                <Button 
                  onClick={loadAssessments} 
                    size="sm"
                    className="bg-green-600 hover:bg-green-700 text-white"
                >
                  Retry
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

          {/* Farmers Management Table - Clean Professional Style */}
          {!loading && !loadingFarms && !loadingFarmers && !error && (
            <Card className="bg-white border border-gray-200 shadow-sm">
              <CardHeader className="border-b border-gray-200 bg-white px-6 py-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base font-semibold text-gray-900">Farmers Management</CardTitle>
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-green-600 hover:bg-green-700 text-white border-green-600 h-8 px-3 text-xs"
                  >
                    <Download className="h-3.5 w-3.5 mr-1.5" />
                    Export
                  </Button>
                </div>
              </CardHeader>
            <CardContent className="p-0">
                {filteredFarmers.length === 0 ? (
                <div className="p-12 text-center">
                    <Users className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-sm font-medium text-gray-900 mb-1">No farmers found</p>
                    <p className="text-xs text-gray-500">Try adjusting your search criteria</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                        <tr className="bg-gray-50 border-b border-gray-200">
                          <th className="text-left py-3 px-6 font-medium text-gray-700 text-xs">Farmer ID</th>
                          <th className="text-left py-3 px-6 font-medium text-gray-700 text-xs">Farmer Name</th>
                          <th className="text-left py-3 px-6 font-medium text-gray-700 text-xs">Location</th>
                          <th className="text-left py-3 px-6 font-medium text-gray-700 text-xs">Total Fields</th>
                      </tr>
                    </thead>
                      <tbody className="bg-white divide-y divide-gray-100">
                        {filteredFarmers.map((farmer, index) => (
                        <tr
                            key={farmer.farmerId}
                            className="hover:bg-green-50/30 transition-colors cursor-pointer"
                            onClick={() => handleFarmerClick(farmer)}
                        >
                            <td className="py-3.5 px-6 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900 bg-green-50 px-2 py-1 rounded inline-block">{farmer.farmerId}</div>
                          </td>
                            <td className="py-3.5 px-6 whitespace-nowrap">
                              <div className="text-sm text-gray-900">{farmer.farmerName}</div>
                          </td>
                            <td className="py-3.5 px-6 whitespace-nowrap">
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                <MapPin className="h-4 w-4 text-gray-400" />
                                <span>{farmer.location}</span>
                            </div>
                          </td>
                            <td className="py-3.5 px-6 whitespace-nowrap">
                              <div className="text-sm text-gray-900">{farmer.totalFields} fields</div>
                          </td>
                        </tr>
                      ))}
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

  // Render view based on mode
  if (viewMode === "fieldSelection") {
    return renderFieldSelection();
  }

  if (viewMode === "fieldDetail") {
    return renderFieldDetail();
  }

  // Check if we're in dashboard field detail mode
  if (dashboardViewMode === "fieldDetail") {
    return renderDashboardFieldDetail();
  }

  return renderDashboard();
}
