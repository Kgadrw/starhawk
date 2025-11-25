import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { dashboardTheme } from "@/utils/dashboardTheme";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import DashboardLayout from "../layout/DashboardLayout";
import { getUserId, getPhoneNumber, getEmail } from "@/services/authAPI";
import { getUserProfile } from "@/services/usersAPI";
import { getFarms, getAllFarms, createFarm, createInsuranceRequest, getFarmById, getWeatherForecast, getHistoricalWeather, getVegetationStats, uploadShapefile } from "@/services/farmsApi";
import { getClaims, createClaim } from "@/services/claimsApi";
import { getPolicies } from "@/services/policiesApi";
import { useToast } from "@/hooks/use-toast";
import { 
  User, 
  FileText, 
  AlertTriangle,
  CheckCircle,
  Clock,
  Phone,
  Mail,
  Settings,
  Camera,
  Crop,
  BarChart3,
  Plus,
  ArrowLeft,
  Save,
  Shield,
  Eye,
  TrendingUp,
  CloudRain,
  Droplets,
  Thermometer,
  Wind,
  X,
  Sun
} from "lucide-react";
import { 
  LineChart, 
  Line,
  BarChart,
  Bar,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend,
  ComposedChart
} from "recharts";

export default function FarmerDashboard() {
  const { toast } = useToast();
  const [activePage, setActivePage] = useState("dashboard");
  
  // Get logged-in farmer data from localStorage
  const farmerId = getUserId() || "";
  const farmerPhone = getPhoneNumber() || "";
  const farmerEmail = getEmail() || "";
  const farmerName = farmerEmail || farmerPhone || "Farmer";
  
  // State for My Fields page
  const [farms, setFarms] = useState<any[]>([]);
  const [farmsLoading, setFarmsLoading] = useState(false);
  const [farmsError, setFarmsError] = useState<string | null>(null);
  
  // State for Loss Reports page
  const [claims, setClaims] = useState<any[]>([]);
  const [claimsLoading, setClaimsLoading] = useState(false);
  const [claimsError, setClaimsError] = useState<string | null>(null);
  
  // State for Create Farm Page
  const [isCreating, setIsCreating] = useState(false);
  const [newFieldData, setNewFieldData] = useState({
    name: "",
    cropType: "",
    latitude: "",
    longitude: "",
    boundaryCoordinates: ""
  });
  const [boundaryError, setBoundaryError] = useState<string | null>(null);
  const [boundaryStats, setBoundaryStats] = useState<{ rings: number; points: number } | null>(null);
  
  // State for Shapefile Upload
  const [shapefile, setShapefile] = useState<File | null>(null);
  const [isUploadingShapefile, setIsUploadingShapefile] = useState(false);
  const [uploadMethod, setUploadMethod] = useState<"manual" | "shapefile">("manual");
  
  // State for File Claim Page
  const [policies, setPolicies] = useState<any[]>([]);
  const [policiesLoading, setPoliciesLoading] = useState(false);
  const [isSubmittingClaim, setIsSubmittingClaim] = useState(false);
  const [claimFormData, setClaimFormData] = useState({
    policyId: "",
    lossEventType: "",
    lossDescription: "",
    damagePhotos: [] as string[],
    eventDate: "",
    estimatedLoss: ""
  });
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [uploadingPhotos, setUploadingPhotos] = useState(false);

  // State for Insurance Request
  const [insuranceRequestDialog, setInsuranceRequestDialog] = useState<{
    open: boolean;
    farmId: string | null;
    farmName: string;
  }>({ open: false, farmId: null, farmName: "" });
  const [insuranceRequestNotes, setInsuranceRequestNotes] = useState("");
  const [isRequestingInsurance, setIsRequestingInsurance] = useState(false);

  // State for Farm Details View
  const [selectedFarm, setSelectedFarm] = useState<any | null>(null);
  const [farmDetailsLoading, setFarmDetailsLoading] = useState(false);

  // State for Farm Analytics
  const [farmAnalytics, setFarmAnalytics] = useState<{
    weatherForecast: any;
    historicalWeather: any;
    vegetationStats: any;
    loading: boolean;
  }>({
    weatherForecast: null,
    historicalWeather: null,
    vegetationStats: null,
    loading: false
  });

  // State for Profile
  const [farmerProfile, setFarmerProfile] = useState<any>(null);
  const [profileLoading, setProfileLoading] = useState(false);
  
  // Load data for dashboard and pages
  useEffect(() => {
    if (farmerId) {
      if (activePage === "dashboard") {
        loadFarms();
        loadClaims();
        loadFarmerProfile();
      } else if (activePage === "my-fields") {
        loadFarms();
      } else if (activePage === "create-farm") {
        loadFarms();
      } else if (activePage === "loss-reports") {
        loadClaims();
      } else if (activePage === "file-claim") {
        loadPolicies();
      } else if (activePage === "farm-details" && selectedFarm) {
        const farmId = selectedFarm._id || selectedFarm.id;
        if (farmId) loadFarmDetails(farmId);
      } else if (activePage === "farm-analytics" && selectedFarm) {
        const farmId = selectedFarm._id || selectedFarm.id;
        if (farmId) loadFarmAnalytics(farmId);
      } else if (activePage === "profile") {
        loadFarmerProfile();
      }
    }
  }, [activePage, farmerId, selectedFarm]);

  const loadFarmerProfile = async () => {
    if (profileLoading) return;
    setProfileLoading(true);
    try {
      const profile = await getUserProfile();
      setFarmerProfile(profile.data || profile);
    } catch (err: any) {
      console.error('Failed to load farmer profile:', err);
    } finally {
      setProfileLoading(false);
    }
  };
  
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
        console.log('1. The farmer has no farms assigned');
        console.log('2. The API is filtering by farmer and this farmer has no farms');
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
    } finally {
      setFarmsLoading(false);
    }
  };
  
  const loadClaims = async () => {
    setClaimsLoading(true);
    setClaimsError(null);
    try {
      const response: any = await getClaims(1, 100);
      const claimsData = response.data || response || [];
      const claimsArray = Array.isArray(claimsData) ? claimsData : (claimsData.items || claimsData.results || []);
      
      // Filter claims by the logged-in farmer
      const farmerClaims = claimsArray.filter((claim: any) => {
        const claimFarmerId = claim.farmerId?._id || claim.farmerId || claim.farmer?._id || claim.farmer;
        return claimFarmerId === farmerId || claimFarmerId === farmerId.toString();
      });
      
      setClaims(farmerClaims);
    } catch (err: any) {
      console.error('Failed to load claims:', err);
      setClaimsError(err.message || 'Failed to load claims');
      toast({
        title: 'Error loading claims',
        description: err.message || 'Failed to load claims',
        variant: 'destructive'
      });
    } finally {
      setClaimsLoading(false);
    }
  };

  const loadPolicies = async () => {
    setPoliciesLoading(true);
    try {
      const response: any = await getPolicies(1, 100);
      const policiesData = response.data || response || [];
      const policiesArray = Array.isArray(policiesData) ? policiesData : (policiesData.items || policiesData.results || []);
      
      // Filter policies for the logged-in farmer
      const farmerPolicies = policiesArray.filter((policy: any) => {
        const policyFarmerId = policy.farmerId?._id || policy.farmerId || policy.farmer?._id || policy.farmer;
        return policyFarmerId === farmerId || policyFarmerId === farmerId.toString();
      });
      
      setPolicies(farmerPolicies);
    } catch (err: any) {
      console.error('Failed to load policies:', err);
      toast({
        title: 'Error loading policies',
        description: err.message || 'Failed to load policies',
        variant: 'destructive'
      });
    } finally {
      setPoliciesLoading(false);
    }
  };

  // Handle Insurance Request
  const handleRequestInsurance = async () => {
    if (!insuranceRequestDialog.farmId) return;

    setIsRequestingInsurance(true);
    try {
      await createInsuranceRequest(
        insuranceRequestDialog.farmId,
        insuranceRequestNotes || undefined
      );

      toast({
        title: 'Success',
        description: 'Insurance request submitted successfully! An insurer will review your request.',
      });

      // Close dialog and reset
      setInsuranceRequestDialog({ open: false, farmId: null, farmName: "" });
      setInsuranceRequestNotes("");
      
      // Reload farms to update status
      await loadFarms();
    } catch (err: any) {
      console.error('Failed to request insurance:', err);
      toast({
        title: 'Error',
        description: err.message || 'Failed to submit insurance request',
        variant: 'destructive'
      });
    } finally {
      setIsRequestingInsurance(false);
    }
  };

  // Load Farm Details
  const loadFarmDetails = async (farmId: string) => {
    setFarmDetailsLoading(true);
    try {
      const farm = await getFarmById(farmId);
      setSelectedFarm(farm.data || farm);
      setActivePage("farm-details");
    } catch (err: any) {
      console.error('Failed to load farm details:', err);
      toast({
        title: 'Error',
        description: err.message || 'Failed to load farm details',
        variant: 'destructive'
      });
    } finally {
      setFarmDetailsLoading(false);
    }
  };

  // Load Farm Analytics
  const loadFarmAnalytics = async (farmId: string) => {
    setFarmAnalytics({ ...farmAnalytics, loading: true });
    try {
      const endDate = new Date().toISOString().split('T')[0];
      const startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      const historicalStartDate = new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

      const [forecast, historical, stats] = await Promise.all([
        getWeatherForecast(farmId, startDate, endDate).catch(() => null),
        getHistoricalWeather(farmId, historicalStartDate, endDate).catch(() => null),
        getVegetationStats(farmId, startDate, endDate).catch(() => null)
      ]);

      setFarmAnalytics({
        weatherForecast: forecast,
        historicalWeather: historical,
        vegetationStats: stats,
        loading: false
      });
    } catch (err: any) {
      console.error('Failed to load farm analytics:', err);
      setFarmAnalytics({ ...farmAnalytics, loading: false });
    }
  };

  // Convert file to base64
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };

  // Handle file selection
  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    if (files.length === 0) return;

    // Validate file types
    const validFiles = files.filter(file => {
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        toast({
          title: 'Invalid File Type',
          description: `${file.name} is not a valid image. Please upload JPG, PNG, or WEBP files.`,
          variant: 'destructive'
        });
        return false;
      }
      // Check file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: 'File Too Large',
          description: `${file.name} is too large. Maximum size is 10MB.`,
          variant: 'destructive'
        });
        return false;
      }
      return true;
    });

    if (validFiles.length === 0) return;

    // Check total files limit (max 10 photos)
    if (uploadedFiles.length + validFiles.length > 10) {
      toast({
        title: 'Too Many Files',
        description: 'Maximum 10 photos allowed. Please remove some photos first.',
        variant: 'destructive'
      });
      return;
    }

    setUploadingPhotos(true);
    try {
      // Convert files to base64
      const base64Promises = validFiles.map(file => fileToBase64(file));
      const base64Strings = await Promise.all(base64Promises);
      
      // Add to uploaded files and photo URLs
      setUploadedFiles(prev => [...prev, ...validFiles]);
      setClaimFormData(prev => ({
        ...prev,
        damagePhotos: [...prev.damagePhotos, ...base64Strings]
      }));
      
      toast({
        title: 'Success',
        description: `${validFiles.length} photo(s) uploaded successfully`,
      });
    } catch (err: any) {
      console.error('Failed to process files:', err);
      toast({
        title: 'Error',
        description: 'Failed to process uploaded files',
        variant: 'destructive'
      });
    } finally {
      setUploadingPhotos(false);
      // Reset file input
      if (e.target) {
        e.target.value = '';
      }
    }
  };

  // Remove uploaded photo
  const handleRemovePhoto = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
    setClaimFormData(prev => ({
      ...prev,
      damagePhotos: prev.damagePhotos.filter((_, i) => i !== index)
    }));
  };

  const upsertCreatedFarm = (farmResponse: any) => {
    if (!farmResponse) return;
    const createdFarm = typeof farmResponse === 'object'
      ? (farmResponse.data || farmResponse)
      : null;
    if (!createdFarm || typeof createdFarm !== 'object') return;

    const farmId = createdFarm._id || createdFarm.id || createdFarm.uuid || createdFarm.farmId;
    const normalizedFarm = {
      status: createdFarm.status || 'REGISTERED',
      ...createdFarm,
      _tempId: farmId ? undefined : `temp-${Date.now()}`
    };

    setFarms(prev => {
      if (!prev || prev.length === 0) {
        return [normalizedFarm];
      }

      const identifier = farmId || normalizedFarm._tempId;
      if (!identifier) {
        return [normalizedFarm, ...prev];
      }

      const updated = prev.some(f => {
        const existingId = f._id || f.id || f.uuid || f.farmId || f._tempId;
        return existingId && existingId === identifier;
      })
        ? prev.map(f => {
            const existingId = f._id || f.id || f.uuid || f.farmId || f._tempId;
            return existingId === identifier ? { ...f, ...normalizedFarm } : f;
          })
        : [normalizedFarm, ...prev];

      return updated;
    });
  };

  const normalizeBoundaryCoordinates = (rawInput: string): number[][][] => {
    if (!rawInput?.trim()) {
      throw new Error('Boundary coordinates are required');
    }

    let parsed: any;
    try {
      parsed = JSON.parse(rawInput);
    } catch {
      throw new Error('Boundary coordinates must be valid JSON.');
    }

    let coordinates = parsed;
    if (parsed?.type === 'Polygon' && Array.isArray(parsed.coordinates)) {
      coordinates = parsed.coordinates;
    }

    if (!Array.isArray(coordinates)) {
      throw new Error('Boundary coordinates must be an array of coordinate rings.');
    }

    if (coordinates.length === 0) {
      throw new Error('At least one ring is required.');
    }

    coordinates.forEach((ring: any, ringIndex: number) => {
      if (!Array.isArray(ring) || ring.length < 4) {
        throw new Error(`Ring ${ringIndex + 1} must contain at least 4 points.`);
      }

      ring.forEach((point: any, pointIndex: number) => {
        if (
          !Array.isArray(point) ||
          point.length < 2 ||
          typeof point[0] !== 'number' ||
          typeof point[1] !== 'number'
        ) {
          throw new Error(`Invalid coordinate at ring ${ringIndex + 1}, point ${pointIndex + 1}.`);
        }
      });
    });

    return coordinates as number[][][];
  };

  const handleBoundaryInputChange = (value: string) => {
    setNewFieldData(prev => ({ ...prev, boundaryCoordinates: value }));

    if (!value.trim()) {
      setBoundaryError(null);
      setBoundaryStats(null);
      return;
    }

    try {
      const coordinates = normalizeBoundaryCoordinates(value);
      setBoundaryError(null);

      let pointCount = 0;
      coordinates.forEach(ring => {
        if (Array.isArray(ring)) {
          ring.forEach(point => {
            if (Array.isArray(point) && point.length >= 2) {
              pointCount += 1;
            }
          });
        }
      });

      setBoundaryStats({
        rings: coordinates.length,
        points: pointCount
      });
    } catch (err: any) {
      setBoundaryError(err.message || 'Invalid boundary coordinates');
      setBoundaryStats(null);
    }
  };

  const handleSubmitClaim = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!claimFormData.policyId) {
      toast({
        title: 'Validation Error',
        description: 'Please select a policy',
        variant: 'destructive'
      });
      return;
    }
    
    if (!claimFormData.lossEventType) {
      toast({
        title: 'Validation Error',
        description: 'Please select a loss event type',
        variant: 'destructive'
      });
      return;
    }
    
    if (!claimFormData.lossDescription) {
      toast({
        title: 'Validation Error',
        description: 'Please provide a loss description',
        variant: 'destructive'
      });
      return;
    }

    if (!claimFormData.eventDate) {
      toast({
        title: 'Validation Error',
        description: 'Event date is required',
        variant: 'destructive'
      });
      return;
    }

    if (!claimFormData.estimatedLoss || isNaN(parseFloat(claimFormData.estimatedLoss))) {
      toast({
        title: 'Validation Error',
        description: 'Estimated loss is required and must be a valid number',
        variant: 'destructive'
      });
      return;
    }

    setIsSubmittingClaim(true);
    try {
      const claimData: any = {
        policyId: claimFormData.policyId,
        eventType: claimFormData.lossEventType.toUpperCase(),
        eventDate: new Date(claimFormData.eventDate).toISOString(),
        description: claimFormData.lossDescription,
        estimatedLoss: parseFloat(claimFormData.estimatedLoss),
        damagePhotos: claimFormData.damagePhotos || []
      };
      
      await createClaim(claimData);
      
      toast({
        title: 'Success',
        description: 'Claim filed successfully!',
      });
      
      // Reset form
      setClaimFormData({
        policyId: "",
        lossEventType: "",
        lossDescription: "",
        damagePhotos: [],
        eventDate: "",
        estimatedLoss: ""
      });
      setUploadedFiles([]);
      
      // Navigate to loss reports to see the new claim
      setActivePage("loss-reports");
      loadClaims();
    } catch (err: any) {
      console.error('Failed to file claim:', err);
      toast({
        title: 'Error filing claim',
        description: err.message || 'Failed to file claim',
        variant: 'destructive'
      });
    } finally {
      setIsSubmittingClaim(false);
    }
  };

  const handleCreateField = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const trimmedName = newFieldData.name.trim();
    if (!trimmedName) {
      toast({
        title: 'Validation Error',
        description: 'Farm name is required',
        variant: 'destructive'
      });
      return;
    }

    if (!newFieldData.cropType) {
      toast({
        title: 'Validation Error',
        description: 'Crop type is required',
        variant: 'destructive'
      });
      return;
    }

    if (!newFieldData.latitude || !newFieldData.longitude) {
      toast({
        title: 'Validation Error',
        description: 'Latitude and longitude are required',
        variant: 'destructive'
      });
      return;
    }

    const lat = parseFloat(newFieldData.latitude);
    const lng = parseFloat(newFieldData.longitude);

    if (isNaN(lat) || isNaN(lng)) {
      toast({
        title: 'Validation Error',
        description: 'Latitude and longitude must be numeric values',
        variant: 'destructive'
      });
      return;
    }

    if (lat < -90 || lat > 90) {
      toast({
        title: 'Validation Error',
        description: 'Latitude must be between -90 and 90 degrees',
        variant: 'destructive'
      });
      return;
    }

    if (lng < -180 || lng > 180) {
      toast({
        title: 'Validation Error',
        description: 'Longitude must be between -180 and 180 degrees',
        variant: 'destructive'
      });
      return;
    }

    let boundaryCoordinates: number[][][];
    try {
      boundaryCoordinates = normalizeBoundaryCoordinates(newFieldData.boundaryCoordinates);
      setBoundaryError(null);
    } catch (err: any) {
      const message = err.message || 'Boundary coordinates are invalid';
      setBoundaryError(message);
      toast({
        title: 'Invalid Boundary',
        description: message,
        variant: 'destructive'
      });
      return;
    }

    setIsCreating(true);
    try {
      const farmData: any = {
        name: trimmedName,
        location: {
          type: 'Point',
          coordinates: [lng, lat] // [longitude, latitude]
        },
        boundary: {
          type: 'Polygon',
          coordinates: boundaryCoordinates
        },
        cropType: newFieldData.cropType.trim().toUpperCase()
      };

      console.log('📤 Preparing to create farm with data:', JSON.stringify(farmData, null, 2));

      const response = await createFarm(farmData);
      console.log('✅ Farm creation API response:', response);
      upsertCreatedFarm(response);
      
      toast({
        title: 'Success',
        description: 'Farm created successfully!',
      });

      setNewFieldData({
        name: "",
        cropType: "",
        latitude: "",
        longitude: "",
        boundaryCoordinates: ""
      });
      setBoundaryStats(null);
      setBoundaryError(null);
      await loadFarms();
    } catch (err: any) {
      console.error('Failed to create farm:', err);
      toast({
        title: 'Error creating farm',
        description: err.message || 'Failed to create farm',
        variant: 'destructive'
      });
    } finally {
      setIsCreating(false);
    }
  };

  const handleShapefileUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!shapefile) {
      toast({
        title: 'Validation Error',
        description: 'Please select a shapefile to upload',
        variant: 'destructive'
      });
      return;
    }

    // Validate file type - shapefiles typically come as .zip containing .shp, .shx, .dbf, etc.
    const validExtensions = ['.zip', '.shp'];
    const fileName = shapefile.name.toLowerCase();
    const hasValidExtension = validExtensions.some(ext => fileName.endsWith(ext));
    
    if (!hasValidExtension) {
      toast({
        title: 'Invalid File Type',
        description: 'Please upload a shapefile (.zip or .shp format)',
        variant: 'destructive'
      });
      return;
    }

    setIsUploadingShapefile(true);
    try {
      console.log('📤 Uploading shapefile:', shapefile.name);
      
      const response = await uploadShapefile(shapefile);
      console.log('✅ Shapefile upload response:', response);
      
      // The API returns the created farm data
      const farmResponse = response.data || response;
      upsertCreatedFarm(farmResponse);
      
      toast({
        title: 'Success',
        description: 'Farm created successfully from shapefile!',
      });

      // Reset form
      setShapefile(null);
      setUploadMethod("manual");
      await loadFarms();
      
      // Navigate to my-fields page
        setActivePage("my-fields");
    } catch (err: any) {
      console.error('Failed to upload shapefile:', err);
      toast({
        title: 'Error uploading shapefile',
        description: err.message || 'Failed to upload shapefile',
        variant: 'destructive'
      });
    } finally {
      setIsUploadingShapefile(false);
    }
  };

  const handleShapefileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setShapefile(file);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-100 text-green-800";
      case "pending": return "bg-yellow-100 text-yellow-800";
      case "in_review": return "bg-blue-100 text-blue-800";
      case "approved": return "bg-green-100 text-green-800";
      case "rejected": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active": return <CheckCircle className="h-4 w-4" />;
      case "pending": return <Clock className="h-4 w-4" />;
      case "in_review": return <Clock className="h-4 w-4" />;
      case "approved": return <CheckCircle className="h-4 w-4" />;
      case "rejected": return <AlertTriangle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const renderDashboard = () => {
    // Get display name from profile if available
    const displayName = farmerProfile 
      ? (farmerProfile.firstName && farmerProfile.lastName 
          ? `${farmerProfile.firstName} ${farmerProfile.lastName}`.trim()
          : farmerProfile.name || farmerProfile.firstName || farmerProfile.lastName || farmerName)
      : farmerName;

    return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-6 shadow-sm">
          <h1 className="text-2xl font-bold text-gray-900">
            Welcome back, {displayName}
        </h1>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-4">
        <Card className={`${dashboardTheme.card} hover:border-green-300 transition-all duration-300 rounded-2xl shadow-sm`}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">My Farms</p>
                <p className="text-2xl font-bold text-gray-900">{farms.length}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <Crop className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:border-teal-300 transition-all duration-300 bg-white border border-gray-200 rounded-2xl shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Claims</p>
                <p className="text-2xl font-bold text-gray-900">{claims.length}</p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
                <FileText className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:border-blue-300 transition-all duration-300 bg-white border border-gray-200 rounded-2xl shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending Claims</p>
                <p className="text-2xl font-bold text-gray-900">{claims.filter(c => c.status?.toLowerCase() === 'pending').length}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <Clock className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:border-green-300 transition-all duration-300 bg-white border border-gray-200 rounded-2xl shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Approved Claims</p>
                <p className="text-2xl font-bold text-gray-900">{claims.filter(c => c.status?.toLowerCase() === 'approved').length}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
  };


  const renderMyFields = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">My Farms</h2>
          <p className="text-gray-600">Manage and view your registered farms</p>
        </div>
        <div className="flex gap-3">
          <Button 
            variant="outline" 
            onClick={loadFarms}
            disabled={farmsLoading}
            className="border-gray-300 text-gray-700 hover:bg-gray-100"
          >
            <Crop className={`h-4 w-4 mr-2 ${farmsLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button 
            onClick={() => setActivePage("create-farm")}
            className="bg-green-600 hover:bg-green-700 text-gray-900"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create Farm
          </Button>
        </div>
      </div>

      {farmsLoading && (
        <Card className={`${dashboardTheme.card}`}>
          <CardContent className="p-12">
            <div className="flex items-center justify-center">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading farms...</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {farmsError && !farmsLoading && (
        <Card className={`${dashboardTheme.card}`}>
          <CardContent className="p-6">
            <div className="text-center text-red-600">
              <AlertTriangle className="h-12 w-12 mx-auto mb-4" />
              <p>{farmsError}</p>
              <Button 
                onClick={loadFarms} 
                className="mt-4 bg-green-600 hover:bg-green-700 text-gray-900"
              >
                Retry
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {!farmsLoading && !farmsError && (
        <Card className={`${dashboardTheme.card}`}>
          <CardHeader>
            <CardTitle className="text-gray-900">Registered Farms</CardTitle>
          </CardHeader>
          <CardContent>
            {farms.length === 0 ? (
              <div className="text-center py-12">
                <Crop className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-600 text-lg mb-2">No farms registered</p>
                <p className="text-gray-500 text-sm">Register your farms to get started with crop insurance</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-1.5 px-2 font-medium text-gray-700 text-xs">Farm Name</th>
                      <th className="text-left py-1.5 px-2 font-medium text-gray-700 text-xs">Crop Type</th>
                      <th className="text-left py-1.5 px-2 font-medium text-gray-700 text-xs">Area (ha)</th>
                      <th className="text-left py-1.5 px-2 font-medium text-gray-700 text-xs">Location</th>
                      <th className="text-left py-1.5 px-2 font-medium text-gray-700 text-xs">Status</th>
                      <th className="text-left py-1.5 px-2 font-medium text-gray-700 text-xs">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {farms.map((farm, index) => {
                      const farmId = farm._id || farm.id;
                      const isInsured = farm.status === 'INSURED' || farm.status === 'insured';
                      const isRegistered = farm.status === 'REGISTERED' || farm.status === 'registered' || !farm.status;
                      
                      return (
                        <tr 
                          key={farmId || index} 
                          className={`border-b border-gray-200 hover:bg-gray-50 transition-colors ${
                            index % 2 === 0 ? "bg-gray-50" : ""
                          }`}
                        >
                          <td className="py-1 px-2 text-gray-900 font-medium text-xs">{farm.name || "Unnamed Farm"}</td>
                          <td className="py-1 px-2 text-gray-700 text-xs">
                            {farm.cropType || farm.crop || "N/A"}
                          </td>
                          <td className="py-1 px-2 text-gray-700 text-xs">
                            {farm.area ? `${farm.area} ha` : farm.size ? `${farm.size} ha` : "N/A"}
                          </td>
                          <td className="py-1 px-2 text-gray-700 text-xs">
                            {farm.location?.coordinates && Array.isArray(farm.location.coordinates) && farm.location.coordinates.length >= 2
                              ? `${farm.location.coordinates[1]?.toFixed(4)}, ${farm.location.coordinates[0]?.toFixed(4)}`
                              : farm.coordinates && Array.isArray(farm.coordinates) && farm.coordinates.length >= 2
                              ? `${farm.coordinates[1]?.toFixed(4)}, ${farm.coordinates[0]?.toFixed(4)}`
                              : farm.location || "N/A"}
                          </td>
                          <td className="py-1 px-2">
                            <Badge className={`text-xs py-0 px-1.5 ${
                              farm.status === 'PENDING' || farm.status === 'pending' 
                                ? "bg-yellow-100 text-yellow-700 border border-yellow-200"
                                : farm.status === 'INSURED' || farm.status === 'insured'
                                ? "bg-green-100 text-green-700 border border-green-200"
                                : farm.status === 'REGISTERED' || farm.status === 'registered'
                                ? "bg-blue-100 text-blue-700 border border-blue-200"
                                : "bg-gray-100 text-gray-700 border border-gray-200"
                            }`}>
                              {farm.status || "REGISTERED"}
                            </Badge>
                          </td>
                          <td className="py-1 px-2">
                            <div className="flex gap-1 flex-wrap">
                              {isRegistered && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => setInsuranceRequestDialog({
                                    open: true,
                                    farmId: farmId,
                                    farmName: farm.name || "Unnamed Farm"
                                  })}
                                  className="border-green-600 text-green-600 hover:bg-green-50 text-xs h-6 px-2"
                                >
                                  <Shield className="h-2.5 w-2.5 mr-0.5" />
                                  Insurance
                                </Button>
                              )}
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => loadFarmDetails(farmId)}
                                className="border-gray-300 text-gray-700 hover:bg-gray-50 text-xs h-6 px-2"
                              >
                                <Eye className="h-2.5 w-2.5 mr-0.5" />
                                View
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                  setSelectedFarm(farm);
                                  loadFarmAnalytics(farmId);
                                  setActivePage("farm-analytics");
                                }}
                                className="border-blue-600 text-blue-600 hover:bg-blue-50 text-xs h-6 px-2"
                              >
                                <TrendingUp className="h-2.5 w-2.5 mr-0.5" />
                                Analytics
                              </Button>
                            </div>
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
      )}

      {/* Insurance Request Dialog */}
      <Dialog open={insuranceRequestDialog.open} onOpenChange={(open) => 
        setInsuranceRequestDialog({ ...insuranceRequestDialog, open })
      }>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="text-gray-900">Request Insurance</DialogTitle>
            <DialogDescription className="text-gray-600">
              Request insurance coverage for: <strong>{insuranceRequestDialog.farmName}</strong>
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div>
              <Label className="text-gray-700">Additional Notes (Optional)</Label>
              <Textarea
                value={insuranceRequestNotes}
                onChange={(e) => setInsuranceRequestNotes(e.target.value)}
                placeholder="Please provide any additional information about your farm..."
                className="mt-2 border-gray-300"
                rows={4}
              />
            </div>
            <div className="flex gap-3 justify-end">
              <Button
                variant="outline"
                onClick={() => {
                  setInsuranceRequestDialog({ open: false, farmId: null, farmName: "" });
                  setInsuranceRequestNotes("");
                }}
                className="border-gray-300 text-gray-700 hover:bg-gray-100"
              >
                Cancel
              </Button>
              <Button
                onClick={handleRequestInsurance}
                disabled={isRequestingInsurance}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                {isRequestingInsurance ? (
                  <>
                    <Clock className="h-4 w-4 mr-2 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Shield className="h-4 w-4 mr-2" />
                    Submit Request
                  </>
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

    </div>
  );

  const renderCreateFarm = () => (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <Button
              variant="ghost"
              onClick={() => setActivePage("my-fields")}
              className="text-gray-900 hover:bg-gray-50 mb-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to My Farms
            </Button>
          <h2 className="text-2xl font-bold text-gray-900">Register New Farm</h2>
          <p className="text-gray-600">
            Submit the official farm record required by Starhawk&apos;s backend APIs.
          </p>
          </div>
        </div>

        <Card className={`${dashboardTheme.card}`}>
          <CardHeader>
          <CardTitle className="text-gray-900">Farm Information</CardTitle>
          </CardHeader>
          <CardContent>
          {/* Upload Method Selection */}
          <div className="mb-6 pb-4 border-b border-gray-200">
            <Label className="text-gray-900 mb-3 block">Upload Method</Label>
            <div className="flex gap-4">
              <Button
                type="button"
                variant={uploadMethod === "manual" ? "default" : "outline"}
                onClick={() => {
                  setUploadMethod("manual");
                  setShapefile(null);
                }}
                className={uploadMethod === "manual" 
                  ? "bg-green-600 hover:bg-green-700 text-white" 
                  : "border-gray-300 text-gray-700 hover:bg-gray-50"
                }
              >
                Manual Entry
              </Button>
              <Button
                type="button"
                variant={uploadMethod === "shapefile" ? "default" : "outline"}
                onClick={() => {
                  setUploadMethod("shapefile");
                  setNewFieldData({
                    name: "",
                    cropType: "",
                    latitude: "",
                    longitude: "",
                    boundaryCoordinates: ""
                  });
                  setBoundaryError(null);
                  setBoundaryStats(null);
                }}
                className={uploadMethod === "shapefile" 
                  ? "bg-green-600 hover:bg-green-700 text-white" 
                  : "border-gray-300 text-gray-700 hover:bg-gray-50"
                }
              >
                Upload Shapefile
              </Button>
            </div>
          </div>

          {uploadMethod === "shapefile" ? (
            <form onSubmit={handleShapefileUpload} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="shapefile" className="text-gray-900">Shapefile *</Label>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <label
                      htmlFor="shapefile"
                      className="flex items-center gap-2 px-4 py-2 border-2 border-dashed rounded-lg cursor-pointer transition-colors border-green-300 bg-green-50 hover:bg-green-100 hover:border-green-400"
                    >
                      <FileText className="h-5 w-5 text-green-600" />
                      <span className="text-sm font-medium text-green-700">
                        {shapefile ? 'Change File' : 'Select Shapefile'}
                      </span>
                    </label>
                    <input
                      id="shapefile"
                      type="file"
                      accept=".zip,.shp"
                      onChange={handleShapefileSelect}
                      className="hidden"
                      required
                    />
                    {shapefile && (
                      <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 px-3 py-2 rounded-lg border border-gray-200">
                        <FileText className="h-4 w-4" />
                        <span className="max-w-xs truncate">{shapefile.name}</span>
                        <span className="text-xs text-gray-500">
                          ({(shapefile.size / 1024 / 1024).toFixed(2)} MB)
                        </span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => setShapefile(null)}
                          className="h-6 w-6 p-0 text-gray-500 hover:text-gray-700"
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
                <p className="text-xs text-gray-500">
                  Upload a shapefile (.zip or .shp format). The shapefile should contain the farm boundary and location data.
                </p>
              </div>

              <div className="flex gap-3 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setActivePage("my-fields");
                    setShapefile(null);
                    setUploadMethod("manual");
                  }}
                  className="flex-1 bg-gray-50 hover:bg-gray-100 border border-gray-300 text-gray-900"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isUploadingShapefile || !shapefile}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                >
                  {isUploadingShapefile ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Upload & Create Farm
                    </>
                  )}
                </Button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleCreateField} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="fieldName" className="text-gray-900">Farm Name *</Label>
                <Input
                  id="fieldName"
                  value={newFieldData.name}
                  onChange={(e) => setNewFieldData({ ...newFieldData, name: e.target.value })}
                placeholder="e.g., Main Farm"
                  required
                className="bg-gray-50 border-gray-300 text-gray-900 placeholder:text-gray-500"
                />
              <p className="text-xs text-gray-500">
                Use the same farm name that appears on your insurance paperwork.
              </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="cropType" className="text-gray-900">Crop Type *</Label>
              <Input
                id="cropType"
                  value={newFieldData.cropType}
                onChange={(e) => setNewFieldData({ ...newFieldData, cropType: e.target.value })}
                placeholder="e.g., MAIZE, RICE, BEANS"
                  required
                className="bg-gray-50 border-gray-300 text-gray-900 placeholder:text-gray-500"
              />
              <p className="text-xs text-gray-500">
                Enter crop type (will be converted to uppercase).
              </p>
              </div>

            <div className="space-y-3">
              <div className="border-b border-gray-200 pb-3">
                <h3 className="text-gray-900 font-semibold text-base mb-1">Location (GeoJSON Point) *</h3>
                <p className="text-xs text-gray-500">
                  Enter the coordinates for the farm location.
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="latitude" className="text-sm text-gray-700">Latitude *</Label>
                  <Input
                    id="latitude"
                    type="number"
                    step="any"
                    value={newFieldData.latitude}
                    onChange={(e) => setNewFieldData({ ...newFieldData, latitude: e.target.value })}
                    placeholder="-1.9441"
                    required
                    className="bg-gray-50 border-gray-300 text-gray-900 placeholder:text-gray-500"
                  />
                  <p className="text-xs text-gray-500">
                    Decimal degrees between -90 and 90.
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="longitude" className="text-sm text-gray-700">Longitude *</Label>
                  <Input
                    id="longitude"
                    type="number"
                    step="any"
                    value={newFieldData.longitude}
                    onChange={(e) => setNewFieldData({ ...newFieldData, longitude: e.target.value })}
                    placeholder="30.0619"
                    required
                    className="bg-gray-50 border-gray-300 text-gray-900 placeholder:text-gray-500"
                  />
                  <p className="text-xs text-gray-500">
                    Decimal degrees between -180 and 180.
                  </p>
                </div>
                </div>
              </div>

              <div className="space-y-2">
              <Label htmlFor="boundaryCoordinates" className="text-gray-900">
                Boundary (GeoJSON Polygon) *
              </Label>
              <Textarea
                id="boundaryCoordinates"
                value={newFieldData.boundaryCoordinates}
                onChange={(e) => handleBoundaryInputChange(e.target.value)}
                rows={8}
                placeholder={`[
  [
    [30.0619, -1.9441],
    [30.0625, -1.9441],
    [30.0625, -1.9435],
    [30.0619, -1.9435],
    [30.0619, -1.9441]
  ]
]`}
                className="bg-gray-50 border-gray-300 text-gray-900 font-mono text-xs"
                required
              />
              {boundaryError && (
                <p className="text-sm text-red-600">{boundaryError}</p>
              )}
              {boundaryStats && (
                <p className="text-xs text-green-600">
                  Detected {boundaryStats.rings} ring(s) • {boundaryStats.points} coordinate pairs
                </p>
              )}
              <p className="text-xs text-gray-500">
                Paste the coordinates array from your GIS tool or the entire GeoJSON Polygon.
              </p>
              </div>

            <div className="flex gap-3 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setActivePage("my-fields");
                    setNewFieldData({
                      name: "",
                      cropType: "",
                      latitude: "",
                      longitude: "",
                    boundaryCoordinates: ""
                    });
                  setBoundaryError(null);
                  setBoundaryStats(null);
                  }}
                className="flex-1 bg-gray-50 hover:bg-gray-100 border border-gray-300 text-gray-900"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isCreating}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                >
                  {isCreating ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Creating...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Create Farm
                    </>
                  )}
                </Button>
              </div>
            </form>
          )}
          </CardContent>
        </Card>
      </div>
    );

  const renderFileClaim = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">File a Claim</h2>
          <p className="text-gray-600">Report crop damage and request compensation</p>
        </div>
      </div>

      <Card className={`${dashboardTheme.card}`}>
        <CardHeader>
          <CardTitle className="text-gray-900">Claim Information</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmitClaim} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="policyId" className="text-gray-900">Policy *</Label>
              {policiesLoading ? (
                <div className="text-gray-500">Loading policies...</div>
              ) : policies.length === 0 ? (
                <div className="text-gray-500">
                  <p>No active policies found. You need an active policy to file a claim.</p>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setActivePage("dashboard")}
                    className="mt-2 border-gray-300 text-gray-900 hover:bg-gray-50"
                  >
                    Go to Dashboard
                  </Button>
                </div>
              ) : (
                <Select
                  value={claimFormData.policyId}
                  onValueChange={(value) => setClaimFormData({ ...claimFormData, policyId: value })}
                  required
                >
                  <SelectTrigger className="bg-gray-50 border-gray-300 text-gray-900 ">
                    <SelectValue placeholder="Select a policy" />
                  </SelectTrigger>
                  <SelectContent>
                    {policies.map((policy) => (
                      <SelectItem key={policy._id || policy.id} value={policy._id || policy.id}>
                        {policy.cropType || 'Policy'} - {policy.coverageAmount ? `RWF ${policy.coverageAmount.toLocaleString()}` : 'Active'}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
              <p className="text-xs text-gray-500">Select the policy for this claim</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="lossEventType" className="text-gray-900">Loss Event Type *</Label>
              <Select
                value={claimFormData.lossEventType}
                onValueChange={(value) => setClaimFormData({ ...claimFormData, lossEventType: value })}
                required
              >
                <SelectTrigger className="bg-gray-50 border-gray-300 text-gray-900 ">
                  <SelectValue placeholder="Select loss event type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="DROUGHT">Drought</SelectItem>
                  <SelectItem value="FLOOD">Flood</SelectItem>
                  <SelectItem value="PEST_ATTACK">Pest Attack</SelectItem>
                  <SelectItem value="DISEASE_OUTBREAK">Disease Outbreak</SelectItem>
                  <SelectItem value="HAIL">Hail Damage</SelectItem>
                  <SelectItem value="FIRE">Fire</SelectItem>
                  <SelectItem value="THEFT">Theft</SelectItem>
                  <SelectItem value="STORM">Storm</SelectItem>
                  <SelectItem value="FROST">Frost</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-gray-500">Type of event that caused the loss</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="eventDate" className="text-gray-900">Event Date *</Label>
              <Input
                id="eventDate"
                type="date"
                value={claimFormData.eventDate}
                onChange={(e) => setClaimFormData({ ...claimFormData, eventDate: e.target.value })}
                required
                className="bg-gray-50 border-gray-300 text-gray-900"
                max={new Date().toISOString().split('T')[0]}
              />
              <p className="text-xs text-gray-500">Date when the loss event occurred</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="estimatedLoss" className="text-gray-900">Estimated Loss (RWF) *</Label>
              <Input
                id="estimatedLoss"
                type="number"
                step="0.01"
                min="0"
                value={claimFormData.estimatedLoss}
                onChange={(e) => setClaimFormData({ ...claimFormData, estimatedLoss: e.target.value })}
                placeholder="500000"
                required
                className="bg-gray-50 border-gray-300 text-gray-900 placeholder:text-gray-500"
              />
              <p className="text-xs text-gray-500">Estimated financial loss in Rwandan Francs</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="lossDescription" className="text-gray-900">Loss Description *</Label>
              <Textarea
                id="lossDescription"
                value={claimFormData.lossDescription}
                onChange={(e) => setClaimFormData({ ...claimFormData, lossDescription: e.target.value })}
                placeholder="Describe the loss event and damage to your crops in detail..."
                rows={6}
                required
                className="bg-gray-50 border-gray-300 text-gray-900 placeholder:text-gray-500 "
              />
              <p className="text-xs text-gray-500">Provide a detailed description of the loss event</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="damagePhotos" className="text-gray-900">Damage Photos (Optional)</Label>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <input
                    type="file"
                id="damagePhotos"
                    accept="image/jpeg,image/jpg,image/png,image/webp"
                    multiple
                    onChange={handleFileSelect}
                    disabled={uploadingPhotos || uploadedFiles.length >= 10}
                    className="hidden"
                  />
                  <label
                    htmlFor="damagePhotos"
                    className={`flex items-center gap-2 px-4 py-2 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${
                      uploadingPhotos || uploadedFiles.length >= 10
                        ? 'border-gray-300 bg-gray-100 cursor-not-allowed'
                        : 'border-green-300 bg-green-50 hover:bg-green-100 hover:border-green-400'
                    }`}
                  >
                    <Camera className={`h-5 w-5 ${uploadingPhotos || uploadedFiles.length >= 10 ? 'text-gray-400' : 'text-green-600'}`} />
                    <span className={`text-sm font-medium ${uploadingPhotos || uploadedFiles.length >= 10 ? 'text-gray-500' : 'text-green-700'}`}>
                      {uploadingPhotos 
                        ? 'Uploading...' 
                        : uploadedFiles.length >= 10
                        ? 'Maximum 10 photos reached'
                        : 'Upload Photos from Device'}
                    </span>
                  </label>
                  {uploadedFiles.length > 0 && (
                    <span className="text-sm text-gray-600">
                      {uploadedFiles.length} / 10 photos
                    </span>
                  )}
                </div>

                
                {uploadedFiles.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
                    {uploadedFiles.map((file, index) => {
                      // Use base64 from claimFormData for preview (already converted to base64)
                      const previewUrl = claimFormData.damagePhotos[index] || URL.createObjectURL(file);
                      
                      return (
                        <div key={index} className="relative group">
                          <div className="aspect-square rounded-lg overflow-hidden border-2 border-gray-200 bg-gray-50">
                            <img
                              src={previewUrl}
                              alt={`Damage photo ${index + 1}`}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <button
                            type="button"
                            onClick={() => handleRemovePhoto(index)}
                            className="absolute top-1 right-1 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                            title="Remove photo"
                          >
                            <X className="h-3 w-3" />
                          </button>
                          <p className="text-xs text-gray-600 mt-1 truncate" title={file.name}>
                            {file.name}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                )}
                
                <p className="text-xs text-gray-500">
                  Upload photos showing the damage (JPG, PNG, WEBP - Max 10MB per file, up to 10 photos)
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-4 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setActivePage("loss-reports")}
                className="border-gray-300 text-gray-900 hover:bg-gray-50"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmittingClaim || policies.length === 0}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                {isSubmittingClaim ? (
                  <>
                    <Clock className="h-4 w-4 mr-2 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <FileText className="h-4 w-4 mr-2" />
                    Submit Claim
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );

  const renderLossReports = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Loss Reports</h2>
          <p className="text-gray-600">View and track your claim reports</p>
        </div>
        <Button 
          variant="outline" 
          onClick={loadClaims}
          disabled={claimsLoading}
          className="border-gray-300 text-gray-900 hover:bg-gray-100"
        >
          <BarChart3 className={`h-4 w-4 mr-2 ${claimsLoading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {claimsLoading && (
        <Card className={`${dashboardTheme.card}`}>
          <CardContent className="p-12">
            <div className="flex items-center justify-center">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
                <p className="text-gray-500">Loading loss reports...</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {claimsError && !claimsLoading && (
        <Card className={`${dashboardTheme.card}`}>
          <CardContent className="p-6">
            <div className="text-center text-red-600">
              <AlertTriangle className="h-12 w-12 mx-auto mb-4" />
              <p>{claimsError}</p>
              <Button 
                onClick={loadClaims} 
                className="mt-4 bg-green-600 hover:bg-green-700 text-gray-900"
              >
                Retry
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {!claimsLoading && !claimsError && (
        <Card className={`${dashboardTheme.card}`}>
          <CardHeader>
            <CardTitle className="text-gray-900">Claim Reports</CardTitle>
          </CardHeader>
          <CardContent>
            {claims.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-500 text-lg mb-2">No loss reports found</p>
                <p className="text-gray-400 text-sm">Your claim reports will appear here</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-1.5 px-2 font-medium text-gray-600 text-xs">Claim ID</th>
                      <th className="text-left py-1.5 px-2 font-medium text-gray-600 text-xs">Crop</th>
                      <th className="text-left py-1.5 px-2 font-medium text-gray-600 text-xs">Date</th>
                      <th className="text-left py-1.5 px-2 font-medium text-gray-600 text-xs">Damage Type</th>
                      <th className="text-left py-1.5 px-2 font-medium text-gray-600 text-xs">Amount</th>
                      <th className="text-left py-1.5 px-2 font-medium text-gray-600 text-xs">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {claims.map((claim, index) => (
                      <tr 
                        key={claim._id || claim.id || index} 
                        className={`border-b border-gray-200 hover:bg-gray-50 transition-colors ${
                          index % 2 === 0 ? "bg-gray-50" : ""
                        }`}
                      >
                        <td className="py-1 px-2 text-gray-900 font-medium text-xs">{claim.claimNumber || claim._id || claim.id || "N/A"}</td>
                        <td className="py-1 px-2 text-gray-900 text-xs">{claim.cropType || claim.crop || "N/A"}</td>
                        <td className="py-1 px-2 text-gray-900 text-xs">
                          {claim.createdAt || claim.submittedAt || claim.date 
                            ? new Date(claim.createdAt || claim.submittedAt || claim.date).toLocaleDateString()
                            : "N/A"}
                        </td>
                        <td className="py-1 px-2 text-gray-900 text-xs">{claim.lossEventType || claim.damageType || "N/A"}</td>
                        <td className="py-1 px-2 text-gray-900 text-xs">
                          {claim.amount || claim.claimAmount 
                            ? `${(claim.amount || claim.claimAmount).toLocaleString()} RWF`
                            : "N/A"}
                        </td>
                        <td className="py-1 px-2">
                          <Badge className={`text-xs py-0 px-1.5 ${getStatusColor(claim.status?.toLowerCase() || "pending")}`}>
                            {getStatusIcon(claim.status?.toLowerCase() || "pending")}
                            <span className="ml-1 capitalize">{claim.status?.replace('_', ' ') || "Pending"}</span>
                          </Badge>
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
  );

  const renderFarmDetails = () => {
    if (!selectedFarm) {
      return (
        <div className="space-y-6">
          <Button
            variant="ghost"
            onClick={() => setActivePage("my-fields")}
            className="text-gray-900 hover:bg-gray-50"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to My Fields
          </Button>
          <Card className={dashboardTheme.card}>
            <CardContent className="p-12 text-center">
              <p className="text-gray-600">No farm selected</p>
            </CardContent>
          </Card>
        </div>
      );
    }

    const farm = selectedFarm;
    const coordinates = farm.location?.coordinates || farm.coordinates || [];

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            {/* Breadcrumb Navigation */}
            <div className="flex items-center gap-2 text-sm mb-4">
              <button
                onClick={() => {
                  setActivePage("my-fields");
                  setSelectedFarm(null);
                }}
                className="text-gray-600 hover:text-gray-700 font-medium"
              >
                My Fields
              </button>
              <span className="text-gray-400">/</span>
              <span className="text-gray-900 font-medium">Farm Details</span>
            </div>
            
            {/* Back Button */}
            <div className="mb-4">
          <Button
            variant="ghost"
            onClick={() => {
              setActivePage("my-fields");
              setSelectedFarm(null);
            }}
            className="text-gray-900 hover:bg-gray-50"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Fields List
          </Button>
        </div>

            {/* Title */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">{farm.name || "Unnamed Farm"}</h2>
          <p className="text-gray-600">Farm Details</p>
            </div>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card className={dashboardTheme.card}>
            <CardHeader>
              <CardTitle className="text-gray-900">Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Farm Name:</span>
                <span className="text-gray-900 font-medium">{farm.name || "N/A"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Crop Type:</span>
                <span className="text-gray-900 font-medium">{farm.cropType || farm.crop || "N/A"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Area:</span>
                <span className="text-gray-900 font-medium">
                  {farm.area ? `${farm.area} ha` : farm.size ? `${farm.size} ha` : "N/A"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Status:</span>
                <Badge className={`
                  ${farm.status === 'INSURED' || farm.status === 'insured'
                    ? "bg-green-100 text-green-700 border border-green-200"
                    : farm.status === 'REGISTERED' || farm.status === 'registered'
                    ? "bg-blue-100 text-blue-700 border border-blue-200"
                    : "bg-gray-100 text-gray-700 border border-gray-200"
                  }
                `}>
                  {farm.status || "REGISTERED"}
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card className={dashboardTheme.card}>
            <CardHeader>
              <CardTitle className="text-gray-900">Location</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {coordinates.length >= 2 && (
                <>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Latitude:</span>
                    <span className="text-gray-900 font-medium">{coordinates[1]?.toFixed(6)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Longitude:</span>
                    <span className="text-gray-900 font-medium">{coordinates[0]?.toFixed(6)}</span>
                  </div>
                </>
              )}
              {farm.eosdaFieldId && (
                <div className="flex justify-between">
                  <span className="text-gray-600">EOSDA Farm ID:</span>
                  <span className="text-gray-900 font-medium">{farm.eosdaFieldId}</span>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <Card className={dashboardTheme.card}>
          <CardHeader>
            <CardTitle className="text-gray-900">Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-3">
              {farm.status === 'REGISTERED' || farm.status === 'registered' || !farm.status ? (
                <Button
                  onClick={() => setInsuranceRequestDialog({
                    open: true,
                    farmId: farm._id || farm.id,
                    farmName: farm.name || "Unnamed Farm"
                  })}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  <Shield className="h-4 w-4 mr-2" />
                  Request Insurance
                </Button>
              ) : null}
              <Button
                variant="outline"
                onClick={() => {
                  setSelectedFarm(farm);
                  loadFarmAnalytics(farm._id || farm.id);
                  setActivePage("farm-analytics");
                }}
                className="border-blue-600 text-blue-600 hover:bg-blue-50"
              >
                <TrendingUp className="h-4 w-4 mr-2" />
                View Analytics
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderFarmAnalytics = () => {
    if (!selectedFarm) {
      return (
        <div className="space-y-6">
          <Button
            variant="ghost"
            onClick={() => setActivePage("my-fields")}
            className="text-gray-900 hover:bg-gray-50"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to My Fields
          </Button>
          <Card className={dashboardTheme.card}>
            <CardContent className="p-12 text-center">
              <p className="text-gray-600">No farm selected</p>
            </CardContent>
          </Card>
        </div>
      );
    }

    const { weatherForecast, historicalWeather, vegetationStats, loading } = farmAnalytics;

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            {/* Breadcrumb Navigation */}
            <div className="flex items-center gap-2 text-sm mb-4">
              <button
                onClick={() => {
                  setActivePage("my-fields");
                  setSelectedFarm(null);
                }}
                className="text-gray-600 hover:text-gray-700 font-medium"
              >
                My Fields
              </button>
              <span className="text-gray-400">/</span>
              <button
                onClick={() => {
                  setActivePage("farm-details");
                }}
                className="text-gray-600 hover:text-gray-700 font-medium"
              >
                {selectedFarm.name || "Farm Details"}
              </button>
              <span className="text-gray-400">/</span>
              <span className="text-gray-900 font-medium">Analytics</span>
            </div>
            
            {/* Back Button */}
            <div className="mb-4">
            <Button
              variant="ghost"
              onClick={() => {
                  setActivePage("my-fields");
                  setSelectedFarm(null);
              }}
              className="text-gray-900 hover:bg-gray-50"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Fields List
            </Button>
            </div>
            
            {/* Title */}
            <h2 className="text-2xl font-bold text-gray-900">
              Farm Analytics: {selectedFarm.name || "Unnamed Farm"}
            </h2>
            <p className="text-gray-600 mt-1">Weather forecasts, historical data, and vegetation indices</p>
          </div>
          <Button
            variant="outline"
            onClick={() => {
              const farmId = selectedFarm._id || selectedFarm.id;
              if (farmId) loadFarmAnalytics(farmId);
            }}
            disabled={loading}
            className="border-gray-300 text-gray-700 hover:bg-gray-100"
          >
            <Clock className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>

        {loading ? (
          <Card className={dashboardTheme.card}>
            <CardContent className="p-12 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading analytics data...</p>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Weather Forecast */}
            <Card className={dashboardTheme.card}>
              <CardHeader>
                <CardTitle className="text-gray-900 flex items-center gap-2">
                  <CloudRain className="h-5 w-5" />
                  Weather Forecast
                </CardTitle>
              </CardHeader>
              <CardContent>
                {weatherForecast ? (
                  <div className="text-gray-600">
                    <pre className="whitespace-pre-wrap text-sm bg-gray-50 p-4 rounded border border-gray-200">
                      {JSON.stringify(weatherForecast, null, 2)}
                    </pre>
                  </div>
                ) : (
                  <p className="text-gray-500">No weather forecast data available</p>
                )}
              </CardContent>
            </Card>

            {/* Historical Weather */}
            <Card className={dashboardTheme.card}>
              <CardHeader>
                <CardTitle className="text-gray-900 flex items-center gap-2">
                  <Thermometer className="h-5 w-5" />
                  Historical Weather
                </CardTitle>
              </CardHeader>
              <CardContent>
                {historicalWeather ? (() => {
                  // Extract data array from response - handle different response structures
                  let dataArray: any[] = [];
                  
                  if (Array.isArray(historicalWeather)) {
                    dataArray = historicalWeather;
                  } else if (historicalWeather?.data && Array.isArray(historicalWeather.data)) {
                    dataArray = historicalWeather.data;
                  } else if (historicalWeather?.data?.data && Array.isArray(historicalWeather.data.data)) {
                    dataArray = historicalWeather.data.data;
                  } else if (historicalWeather?.results && Array.isArray(historicalWeather.results)) {
                    dataArray = historicalWeather.results;
                  } else if (historicalWeather?.items && Array.isArray(historicalWeather.items)) {
                    dataArray = historicalWeather.items;
                  }
                  
                  if (dataArray.length === 0) {
                    return <p className="text-gray-500">No historical weather data available</p>;
                  }

                  // Calculate summary statistics
                  const totalRainfall = dataArray.reduce((sum: number, d: any) => sum + (d.rainfall || 0), 0);
                  const avgRainfall = totalRainfall / dataArray.length;
                  const maxRainfall = Math.max(...dataArray.map((d: any) => d.rainfall || 0));
                  const avgTempMin = dataArray.reduce((sum: number, d: any) => sum + (d.temperature_min || 0), 0) / dataArray.length;
                  const avgTempMax = dataArray.reduce((sum: number, d: any) => sum + (d.temperature_max || 0), 0) / dataArray.length;
                  const avgHumidity = dataArray.reduce((sum: number, d: any) => sum + (d.humidity_day_avg || 0), 0) / dataArray.length;

                  // Prepare chart data (limit to last 60 days for readability)
                  const chartData = dataArray.slice(-60).map((d: any) => ({
                    date: new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                    rainfall: Math.round(d.rainfall * 10) / 10,
                    tempMin: d.temperature_min,
                    tempMax: d.temperature_max,
                    humidity: Math.round(d.humidity_day_avg * 10) / 10,
                    tempAvg: Math.round((d.temperature_min + d.temperature_max) / 2 * 10) / 10
                  }));

                  // Get recent data for table (last 30 days)
                  const tableData = dataArray.slice(-30).reverse();

                  return (
                    <div className="space-y-6">
                      {/* Summary Cards */}
                      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                        <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                          <div className="flex items-center gap-2 mb-2">
                            <Droplets className="h-4 w-4 text-blue-600" />
                            <p className="text-xs text-blue-700 font-medium">Avg Rainfall</p>
                  </div>
                          <p className="text-2xl font-bold text-blue-900">{avgRainfall.toFixed(1)}mm</p>
                          <p className="text-xs text-blue-600 mt-1">Max: {maxRainfall.toFixed(1)}mm</p>
                        </div>
                        
                        <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
                          <div className="flex items-center gap-2 mb-2">
                            <Thermometer className="h-4 w-4 text-orange-600" />
                            <p className="text-xs text-orange-700 font-medium">Avg Temp</p>
                          </div>
                          <p className="text-2xl font-bold text-orange-900">{avgTempMax.toFixed(1)}°C</p>
                          <p className="text-xs text-orange-600 mt-1">Range: {avgTempMin.toFixed(1)}-{avgTempMax.toFixed(1)}°C</p>
                        </div>
                        
                        <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                          <div className="flex items-center gap-2 mb-2">
                            <Wind className="h-4 w-4 text-purple-600" />
                            <p className="text-xs text-purple-700 font-medium">Humidity</p>
                          </div>
                          <p className="text-2xl font-bold text-purple-900">{avgHumidity.toFixed(1)}%</p>
                          <p className="text-xs text-purple-600 mt-1">Daily average</p>
                        </div>
                        
                        <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                          <div className="flex items-center gap-2 mb-2">
                            <BarChart3 className="h-4 w-4 text-green-600" />
                            <p className="text-xs text-green-700 font-medium">Data Points</p>
                          </div>
                          <p className="text-2xl font-bold text-green-900">{dataArray.length}</p>
                          <p className="text-xs text-green-600 mt-1">Days recorded</p>
                        </div>
                        
                        <div className="bg-red-50 rounded-lg p-4 border border-red-200">
                          <div className="flex items-center gap-2 mb-2">
                            <AlertTriangle className="h-4 w-4 text-red-600" />
                            <p className="text-xs text-red-700 font-medium">Critical Days</p>
                          </div>
                          <p className="text-2xl font-bold text-red-900">
                            {dataArray.filter((d: any) => d.temp_critical > 0).length}
                          </p>
                          <p className="text-xs text-red-600 mt-1">Temp alerts</p>
                        </div>
                      </div>

                      {/* Charts */}
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Temperature Chart */}
                        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                          <h4 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
                            <Thermometer className="h-4 w-4" />
                            Temperature Trends (Last 60 Days)
                          </h4>
                          <ResponsiveContainer width="100%" height={250}>
                            <ComposedChart data={chartData}>
                              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                              <XAxis 
                                dataKey="date" 
                                tick={{ fontSize: 10 }}
                                interval="preserveStartEnd"
                                stroke="#6b7280"
                              />
                              <YAxis 
                                yAxisId="temp"
                                label={{ value: 'Temperature (°C)', angle: -90, position: 'insideLeft' }}
                                tick={{ fontSize: 10 }}
                                stroke="#6b7280"
                              />
                              <Tooltip 
                                contentStyle={{ backgroundColor: 'white', border: '1px solid #e5e7eb', borderRadius: '6px' }}
                              />
                              <Legend />
                              <Bar 
                                yAxisId="temp"
                                dataKey="tempMin" 
                                fill="#93c5fd" 
                                name="Min Temp (°C)"
                                radius={[4, 4, 0, 0]}
                              />
                              <Bar 
                                yAxisId="temp"
                                dataKey="tempMax" 
                                fill="#f97316" 
                                name="Max Temp (°C)"
                                radius={[4, 4, 0, 0]}
                              />
                            </ComposedChart>
                          </ResponsiveContainer>
                        </div>

                        {/* Rainfall Chart */}
                        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                          <h4 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
                            <Droplets className="h-4 w-4" />
                            Rainfall (Last 60 Days)
                          </h4>
                          <ResponsiveContainer width="100%" height={250}>
                            <BarChart data={chartData}>
                              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                              <XAxis 
                                dataKey="date" 
                                tick={{ fontSize: 10 }}
                                interval="preserveStartEnd"
                                stroke="#6b7280"
                              />
                              <YAxis 
                                label={{ value: 'Rainfall (mm)', angle: -90, position: 'insideLeft' }}
                                tick={{ fontSize: 10 }}
                                stroke="#6b7280"
                              />
                              <Tooltip 
                                contentStyle={{ backgroundColor: 'white', border: '1px solid #e5e7eb', borderRadius: '6px' }}
                              />
                              <Bar 
                                dataKey="rainfall" 
                                fill="#3b82f6" 
                                name="Rainfall (mm)"
                                radius={[4, 4, 0, 0]}
                              />
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                      </div>

                      {/* Humidity Chart */}
                      <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                        <h4 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
                          <Wind className="h-4 w-4" />
                          Humidity Trend (Last 60 Days)
                        </h4>
                        <ResponsiveContainer width="100%" height={250}>
                          <LineChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                            <XAxis 
                              dataKey="date" 
                              tick={{ fontSize: 10 }}
                              interval="preserveStartEnd"
                              stroke="#6b7280"
                            />
                            <YAxis 
                              label={{ value: 'Humidity (%)', angle: -90, position: 'insideLeft' }}
                              tick={{ fontSize: 10 }}
                              domain={[0, 100]}
                              stroke="#6b7280"
                            />
                            <Tooltip 
                              contentStyle={{ backgroundColor: 'white', border: '1px solid #e5e7eb', borderRadius: '6px' }}
                            />
                            <Line 
                              type="monotone" 
                              dataKey="humidity" 
                              stroke="#8b5cf6" 
                              strokeWidth={2}
                              dot={{ r: 3 }}
                              name="Humidity (%)"
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>

                      {/* Data Table */}
                      <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                        <h4 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
                          <BarChart3 className="h-4 w-4" />
                          Recent Weather Data (Last 30 Days)
                        </h4>
                        <div className="overflow-x-auto">
                          <table className="w-full text-xs">
                            <thead>
                              <tr className="border-b border-gray-300">
                                <th className="text-left py-2 px-3 font-medium text-gray-700">Date</th>
                                <th className="text-left py-2 px-3 font-medium text-gray-700">Rainfall (mm)</th>
                                <th className="text-left py-2 px-3 font-medium text-gray-700">Temp Range (°C)</th>
                                <th className="text-left py-2 px-3 font-medium text-gray-700">Avg Temp (°C)</th>
                                <th className="text-left py-2 px-3 font-medium text-gray-700">Humidity (%)</th>
                                <th className="text-left py-2 px-3 font-medium text-gray-700">Status</th>
                              </tr>
                            </thead>
                            <tbody>
                              {tableData.map((day: any, idx: number) => {
                                const avgTemp = (day.temperature_min + day.temperature_max) / 2;
                                const date = new Date(day.date);
                                const isRecent = idx < 7;
                                
                                return (
                                  <tr 
                                    key={idx} 
                                    className={`border-b border-gray-200 hover:bg-gray-100 transition-colors ${
                                      idx % 2 === 0 ? "bg-white" : "bg-gray-50"
                                    }`}
                                  >
                                    <td className="py-2 px-3 text-gray-900 font-medium">
                                      {date.toLocaleDateString('en-US', { 
                                        weekday: 'short', 
                                        month: 'short', 
                                        day: 'numeric',
                                        year: 'numeric'
                                      })}
                                      {isRecent && (
                                        <Badge className="ml-2 bg-blue-100 text-blue-700 text-xs">Recent</Badge>
                                      )}
                                    </td>
                                    <td className="py-2 px-3 text-gray-700">
                                      <div className="flex items-center gap-2">
                                        <Droplets className="h-3 w-3 text-blue-500" />
                                        <span className="font-medium">{day.rainfall?.toFixed(1) || '0.0'}</span>
                                      </div>
                                    </td>
                                    <td className="py-2 px-3 text-gray-700">
                                      <span className="font-medium text-orange-600">{day.temperature_max}°</span>
                                      <span className="text-gray-400 mx-1">/</span>
                                      <span className="text-blue-600">{day.temperature_min}°</span>
                                    </td>
                                    <td className="py-2 px-3 text-gray-700 font-medium">
                                      {avgTemp.toFixed(1)}°
                                    </td>
                                    <td className="py-2 px-3 text-gray-700">
                                      <div className="flex items-center gap-1">
                                        <Wind className="h-3 w-3 text-purple-500" />
                                        <span>{day.humidity_day_avg?.toFixed(1) || '0.0'}</span>
                                      </div>
                                    </td>
                                    <td className="py-2 px-3">
                                      {day.temp_critical > 0 ? (
                                        <Badge className="bg-red-100 text-red-700 text-xs">Critical</Badge>
                                      ) : day.rainfall > 20 ? (
                                        <Badge className="bg-blue-100 text-blue-700 text-xs">Heavy Rain</Badge>
                                      ) : day.rainfall > 5 ? (
                                        <Badge className="bg-blue-100 text-blue-700 text-xs">Rain</Badge>
                                      ) : (
                                        <Badge className="bg-green-100 text-green-700 text-xs">Normal</Badge>
                                      )}
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  );
                })() : (
                  <p className="text-gray-500">No historical weather data available</p>
                )}
              </CardContent>
            </Card>

            {/* Vegetation Statistics */}
            <Card className={dashboardTheme.card}>
              <CardHeader>
                <CardTitle className="text-gray-900 flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Vegetation Indices (NDVI)
                </CardTitle>
              </CardHeader>
              <CardContent>
                {vegetationStats ? (
                  <div className="text-gray-600">
                    <pre className="whitespace-pre-wrap text-sm bg-gray-50 p-4 rounded border border-gray-200">
                      {JSON.stringify(vegetationStats, null, 2)}
                    </pre>
                  </div>
                ) : (
                  <p className="text-gray-500">No vegetation statistics available</p>
                )}
              </CardContent>
            </Card>
          </>
        )}
      </div>
    );
  };

  const renderProfileSettings = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Profile Settings</h2>
        <Button variant="outline" onClick={() => setActivePage("dashboard")}>
          Back to Dashboard
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input id="fullName" value={farmerName} readOnly />
                </div>
            <div className="space-y-2">
              <Label htmlFor="farmerId">Farmer ID</Label>
              <Input id="farmerId" value={farmerId} disabled />
                </div>
                </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input id="phone" value={farmerPhone || ""} readOnly placeholder="+250 7XX XXX XXX" />
              </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={farmerEmail || ""} readOnly placeholder="your.email@example.com" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input id="location" placeholder="Province, District, Sector, Cell, Village" />
          </div>

          <Button className="bg-green-600 hover:bg-green-700">
            Update Profile
          </Button>
        </CardContent>
      </Card>
    </div>
  );

  const renderPage = () => {
    switch (activePage) {
      case "dashboard": return renderDashboard();
      case "my-fields": return renderMyFields();
      case "create-farm": return renderCreateFarm();
      case "file-claim": return renderFileClaim();
      case "loss-reports": return renderLossReports();
      case "farm-details": return renderFarmDetails();
      case "farm-analytics": return renderFarmAnalytics();
      case "profile": return renderProfileSettings();
      default: return renderDashboard();
    }
  };

  const navigationItems = [
    { id: "dashboard", label: "Dashboard", icon: BarChart3 },
    { id: "my-fields", label: "My Farms", icon: Crop },
    { id: "file-claim", label: "File Claim", icon: AlertTriangle },
    { id: "loss-reports", label: "Loss Reports", icon: FileText },
    { id: "profile", label: "Profile", icon: User }
  ];

  // Get display name from profile if available
  const displayName = farmerProfile 
    ? (farmerProfile.firstName && farmerProfile.lastName 
        ? `${farmerProfile.firstName} ${farmerProfile.lastName}`.trim()
        : farmerProfile.name || farmerProfile.firstName || farmerProfile.lastName || farmerName)
    : farmerName;

  return (
    <DashboardLayout
      userType="farmer"
      userId={farmerId}
      userName={displayName}
      navigationItems={navigationItems}
      activePage={activePage} 
      onPageChange={setActivePage}
      onLogout={() => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        localStorage.removeItem('userId');
        localStorage.removeItem('phoneNumber');
        localStorage.removeItem('email');
        window.location.href = '/farmer-login';
      }}
    >
      {renderPage()}
    </DashboardLayout>
  );
}
