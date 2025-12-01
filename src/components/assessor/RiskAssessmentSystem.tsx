import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { dashboardTheme } from "@/utils/dashboardTheme";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import meteosourceApiService from "@/services/meteosourceApi";
import assessmentsApiService from "@/services/assessmentsApi";
import { getFarms, getFarmById } from "@/services/farmsApi";
import { getUserById } from "@/services/usersAPI";
import { getUserId } from "@/services/authAPI";
import { useToast } from "@/hooks/use-toast";
import { 
  MapPin,
  Search,
  Filter,
  Plus,
  FileText,
  Shield,
  CloudRain,
  Leaf,
  FileSpreadsheet,
  Sun,
  Wind,
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
  RefreshCw
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

export default function RiskAssessmentSystem({ assessments: propAssessments, onRefresh }: RiskAssessmentSystemProps = {}) {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterDialogOpen, setFilterDialogOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState("all");
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

  // Load farms when an assessment is selected
  useEffect(() => {
    if (selectedAssessment && viewMode === "fieldSelection") {
      loadFarmsForAssessment(selectedAssessment);
    }
  }, [selectedAssessment, viewMode]);

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

      // Map API response to AssessmentSummary interface
      const mappedAssessments: AssessmentSummary[] = await Promise.all(
        filteredAssessments.map(async (assessment: any) => {
          const farmId = assessment.farmId || assessment.farm?._id || assessment.farm?.id;
          let farmerName = "Unknown Farmer";
          let location = "Unknown Location";

          // Try to get farmer info from assessment data
          if (assessment.farm) {
            farmerName = assessment.farm.farmerId?.firstName && assessment.farm.farmerId?.lastName
              ? `${assessment.farm.farmerId.firstName} ${assessment.farm.farmerId.lastName}`
              : assessment.farm.farmerId?.email || assessment.farm.farmerId?.phoneNumber || "Unknown Farmer";
            
            if (assessment.farm.location) {
              if (typeof assessment.farm.location === 'string') {
                location = assessment.farm.location;
              } else if (assessment.farm.location.coordinates && Array.isArray(assessment.farm.location.coordinates)) {
                location = `${assessment.farm.location.coordinates[1]?.toFixed(4)}, ${assessment.farm.location.coordinates[0]?.toFixed(4)}`;
              }
            }
          }

          // Try to get farmer info from API if not in assessment
          if (farmerName === "Unknown Farmer" && farmId) {
            try {
              const farmData = await getFarmById(farmId);
              const farm = farmData.data || farmData;
              if (farm?.farmerId) {
                const farmerInfo = typeof farm.farmerId === 'string' 
                  ? await getUserById(farm.farmerId).catch(() => null)
                  : farm.farmerId;
                if (farmerInfo) {
                  const farmer = farmerInfo.data || farmerInfo;
                  farmerName = farmer.firstName && farmer.lastName
                    ? `${farmer.firstName} ${farmer.lastName}`
                    : farmer.email || farmer.phoneNumber || "Unknown Farmer";
                }
              }
              if (farm?.location && !location) {
                if (typeof farm.location === 'string') {
                  location = farm.location;
                } else if (farm.location.coordinates && Array.isArray(farm.location.coordinates)) {
                  location = `${farm.location.coordinates[1]?.toFixed(4)}, ${farm.location.coordinates[0]?.toFixed(4)}`;
                }
              }
            } catch (err) {
              console.error('Failed to load farm data:', err);
            }
          }

          return {
            id: assessment._id || assessment.id || `RISK-${assessment.assessmentId || 'UNKNOWN'}`,
            farmerId: assessment.farm?.farmerId?._id || assessment.farm?.farmerId || assessment.farmId || "",
            farmerName,
            location,
            type: assessment.type || "Risk Assessment",
            status: assessment.status || "Pending",
            date: assessment.createdAt || assessment.assessmentDate || assessment.date || new Date().toISOString().split('T')[0]
          };
        })
      );

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

  const loadFarmsForAssessment = async (assessment: AssessmentSummary) => {
    setLoadingFarms(true);
    try {
      // Get all farms and filter by farmer
      const response: any = await getFarms(1, 100);
      const farmsData = response.data || response || [];
      const farmsArray = Array.isArray(farmsData) ? farmsData : (farmsData.items || farmsData.results || []);

      // Filter farms by the farmer ID from assessment
      const relevantFarms = farmsArray.filter((farm: any) => {
        const farmerId = farm.farmerId?._id || farm.farmerId || farm.farmer;
        return farmerId === assessment.farmerId || farmerId === assessment.farmerId?.toString();
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

  const getFieldsForAssessment = (assessment: AssessmentSummary): Field[] => {
    if (!farms || farms.length === 0) return [];

    // Map farms to Field interface
    return farms.map((farm: any) => {
      const farmer = farmers[assessment.farmerId] || {};
      const farmerName = farmer.firstName && farmer.lastName
        ? `${farmer.firstName} ${farmer.lastName}`
        : assessment.farmerName;

      return {
        id: farm._id || farm.id || `FLD-${farm.name || 'UNKNOWN'}`,
        farmerName,
        crop: farm.cropType || farm.crop || "Unknown",
        area: farm.area || farm.size || 0,
        season: farm.season || "A",
        status: farm.status || "Active",
        fieldName: farm.name || "Unnamed Farm",
        sowingDate: farm.sowingDate || farm.plantingDate || new Date().toISOString().split('T')[0]
      };
    });
  };

  // Clear all filters
  const clearFilters = () => {
    setStatusFilter("all");
    setSearchQuery("");
  };

  const handleAssessmentClick = (assessment: AssessmentSummary) => {
    setSelectedAssessment(assessment);
    setViewMode("fieldSelection");
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
        <div className="space-y-6">
          <div className="flex items-center gap-2 text-sm">
            <button 
              onClick={handleBackToList}
              className="text-gray-600 hover:text-gray-700"
            >
              Risk Assessments
            </button>
            <span className="text-gray-600">/</span>
            <span className="text-gray-700">{selectedAssessment.farmerName}</span>
          </div>
          <Card className={`${dashboardTheme.card}`}>
            <CardContent className="p-12">
              <div className="flex items-center justify-center">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500 mx-auto mb-4"></div>
                  <p className="text-gray-600">Loading farms...</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    const fields = getFieldsForAssessment(selectedAssessment);
    
    return (
      <div className="space-y-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm">
          <button 
            onClick={handleBackToList}
            className="text-gray-600 hover:text-gray-700"
          >
            Risk Assessments
          </button>
            <span className="text-gray-600">/</span>
            <span className="text-gray-700">{selectedAssessment.farmerName}</span>
        </div>

        {/* Table */}
        <Card className={`${dashboardTheme.card}`}>
          <CardContent className="p-0">
            {fields.length === 0 ? (
              <div className="p-12 text-center">
                  <p className="text-gray-600">No farms found for this assessment.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-4 px-6 font-medium text-gray-700">Field ID</th>
                      <th className="text-left py-4 px-6 font-medium text-gray-700">Farmer</th>
                      <th className="text-left py-4 px-6 font-medium text-gray-700">Crop</th>
                      <th className="text-left py-4 px-6 font-medium text-gray-700">Area (ha)</th>
                      <th className="text-left py-4 px-6 font-medium text-gray-700">Season</th>
                      <th className="text-left py-4 px-6 font-medium text-gray-700">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {fields.map((field, index) => (
                      <tr
                        key={field.id}
                        onClick={() => handleFieldClick(field)}
                        className={`border-b border-gray-200 hover:bg-gray-50 transition-colors cursor-pointer ${
                          index % 2 === 0 ? "bg-gray-50" : ""
                        }`}
                      >
                        <td className="py-4 px-6 text-gray-700">{field.id}</td>
                        <td className="py-4 px-6 text-gray-700">{field.farmerName}</td>
                        <td className="py-4 px-6 text-gray-700">{field.crop}</td>
                        <td className="py-4 px-6 text-gray-700">{field.area} ha</td>
                        <td className="py-4 px-6 text-gray-700">{field.season}</td>
                        <td className="py-4 px-6">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            field.status === "Processed" || field.status === "Active"
                              ? "bg-green-100 text-green-700 border border-green-200"
                              : "bg-yellow-100 text-yellow-700 border border-yellow-200"
                          }`}>
                            {field.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  };

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
        return <Sun className="h-8 w-8 text-yellow-500" />;
      } else if (summaryLower.includes('cloudy') || summaryLower.includes('overcast')) {
        return <Cloud className="h-8 w-8 text-gray-500" />;
      } else if (summaryLower.includes('rain') || summaryLower.includes('drizzle')) {
        return <CloudRain className="h-8 w-8 text-blue-500" />;
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
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading weather data...</p>
          </div>
        </div>
      );
    }

    if (error || !weatherData) {
      return (
        <Card className={`${dashboardTheme.card}`}>
          <CardContent className="p-6">
            <div className="text-center text-red-400">
              <Cloud className="h-12 w-12 mx-auto mb-4" />
              <p>{error || 'Failed to load weather data'}</p>
              <Button 
                onClick={loadWeatherData} 
                className="mt-4 bg-teal-500 hover:bg-teal-600 text-white"
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
                <span className="text-xs text-gray-600">Updated: {formatTime(lastUpdated)}</span>
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
              <div className="flex items-center text-gray-700">
                <Wind className="h-5 w-5 mr-2 text-gray-600" />
                <div>
                  <div className="text-xs text-gray-600">Wind</div>
                  <div className="font-medium text-gray-700">{weatherData.current.windSpeed} km/h</div>
                </div>
              </div>
              <div className="flex items-center text-gray-700">
                <Droplets className="h-5 w-5 mr-2 text-gray-600" />
                <div>
                  <div className="text-xs text-gray-600">Humidity</div>
                  <div className="font-medium text-gray-700">{weatherData.current.humidity}%</div>
                </div>
              </div>
              <div className="flex items-center text-gray-700">
                <CloudRain className="h-5 w-5 mr-2 text-gray-600" />
                <div>
                  <div className="text-xs text-gray-600">Precipitation</div>
                  <div className="font-medium text-gray-700">{weatherData.current.precipitation}mm</div>
                </div>
              </div>
              <div className="flex items-center text-gray-700">
                <Thermometer className="h-5 w-5 mr-2 text-gray-600" />
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
                    <div className="text-gray-700 font-bold mb-1">{hour.temperature}°</div>
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
                    <tr key={idx} className={`border-b border-gray-200 hover:bg-gray-50 transition-colors ${
                      idx % 2 === 0 ? "bg-gray-50" : ""
                    }`}>
                      <td className="py-4 px-4 text-gray-700 font-medium">{formatDate(day.date)}</td>
                      <td className="py-4 px-4 text-gray-700">
                        <span className="font-bold">{day.temperature.max}°</span> / <span>{day.temperature.min}°</span>
                      </td>
                      <td className="py-4 px-4 text-gray-700">{day.precipitation}</td>
                      <td className="py-4 px-4 text-gray-700">{day.humidity}%</td>
                      <td className="py-4 px-4 text-gray-700">{day.icon < 2 ? '30%' : day.icon < 3 ? '45%' : day.icon < 4 ? '60%' : '75%'}</td>
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
    
    // Manual input metrics state
    const [stressDetected, setStressDetected] = useState<number[]>([17.6]);
    const [soilMoisture, setSoilMoisture] = useState<number[]>([58]);
    const [weedArea, setWeedArea] = useState<number[]>([7.3]);
    const [pestArea, setPestArea] = useState<number[]>([4.4]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        setSelectedFile(file.name);
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
              <TabsList className={`${dashboardTheme.card} border border-gray-800 w-fit`}>
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
                    <Label className="text-gray-700 mb-2 block">Drone Data Upload</Label>
                    <p className="text-sm text-gray-600 mb-4">Upload JSON or GeoJSON</p>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-teal-500 transition-colors">
                      <Upload className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                      <p className="text-gray-700 mb-2">Drag file here or click to browse</p>
                      {!selectedFile && (
                        <p className="text-sm text-gray-500 mb-4">No file chosen</p>
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
                        className="bg-teal-500 hover:bg-teal-600 text-white"
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        Choose File
                      </Button>
                      {selectedFile && (
                        <div className="mt-4 p-3 bg-teal-500/10 border border-teal-500/30 rounded-lg">
                          <p className="text-gray-700 text-sm">File selected: {selectedFile}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Flight Date */}
                  <div>
                    <Label htmlFor="flight-date" className="text-gray-700 mb-2 block">Flight Date</Label>
                    <Input
                      id="flight-date"
                      type="date"
                      value={flightDate}
                      onChange={(e) => setFlightDate(e.target.value)}
                      className={`${dashboardTheme.input} border-gray-700`}
                    />
                  </div>

                  {/* Drone Metrics */}
                  <div>
                    <Label className="text-gray-700 mb-4 block">Drone Metrics</Label>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                      <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                        <p className="text-xs text-gray-600 mb-1 font-medium">Healthy Area</p>
                        <p className="text-xl font-bold text-gray-700">2.8 ha</p>
                      </div>
                      <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                        <p className="text-xs text-gray-600 mb-1 font-medium">Stress Detected</p>
                        <p className="text-xl font-bold text-gray-700">17.6%</p>
                      </div>
                      <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                        <p className="text-xs text-gray-600 mb-1 font-medium">Soil Moisture</p>
                        <p className="text-xl font-bold text-gray-700">58%</p>
                      </div>
                      <div className="bg-orange-500/10 border border-orange-500/30 rounded-lg p-4">
                        <p className="text-xs text-gray-600 mb-1 font-medium">Weed Area</p>
                        <p className="text-xl font-bold text-gray-700">0.25 ha</p>
                        <p className="text-xs text-gray-500">(7.3%)</p>
                      </div>
                      <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
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
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-gray-900 font-medium">Map View</p>
                            <p className="text-xs text-gray-600">Field ID: {fieldDetails.fieldId}</p>
                          </div>
                          <div className="flex items-center gap-4">
                            <p className="text-sm text-gray-700">Layer: 🌱 Plant Health (NDVI)</p>
                            <Select defaultValue="ndvi">
                              <SelectTrigger className={`${dashboardTheme.select} w-64`}>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent className={dashboardTheme.card}>
                                <SelectItem value="ndvi">
                                  🌱 Plant Health (NDVI) ⭐
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="h-[400px] bg-gray-50 rounded-lg border border-gray-200 flex items-center justify-center relative">
                          <div className="text-center">
                            <Map className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                            <p className="text-gray-600 text-lg">Field Visualization Map</p>
                            <p className="text-gray-500 text-sm mt-2">NDVI Data Visualization</p>
                          </div>
                          {/* Legend */}
                          <div className="absolute bottom-4 left-4 bg-white border border-gray-200 rounded-lg p-4">
                            <p className="text-gray-900 font-medium mb-3">Legend</p>
                            <div className="space-y-2">
                              <div className="flex items-center gap-2">
                                <div className="w-4 h-4 bg-green-500 rounded"></div>
                                <span className="text-gray-900 text-sm">Healthy</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <div className="w-4 h-4 bg-yellow-500 rounded"></div>
                                <span className="text-gray-900 text-sm">Moderate</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <div className="w-4 h-4 bg-red-500 rounded"></div>
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
                      className="bg-teal-500 hover:bg-teal-600 text-white flex-1"
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Save Analysis
                    </Button>
                    <Button
                      onClick={handleDownload}
                      variant="outline"
                      className="border-gray-300 text-gray-700 hover:bg-gray-100 flex-1"
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
                    <Label className="text-gray-700 mb-2 block">Manual Assessment Date</Label>
                    <p className="text-sm text-gray-600 mb-2">Physical Check Date:</p>
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
                    <Label className="text-gray-700 mb-4 block">Manual Input Metrics</Label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 space-y-3 hover:border-yellow-500/50 transition-colors">
                        <div className="flex items-center justify-between mb-2">
                          <p className="text-sm text-gray-700 font-medium">Stress Detected</p>
                          <p className="text-2xl font-bold text-gray-700">{stressDetected[0].toFixed(1)}%</p>
                        </div>
                        <Slider
                          value={stressDetected}
                          onValueChange={setStressDetected}
                          max={100}
                          min={0}
                          step={0.1}
                          className="w-full [&_[role=slider]]:bg-yellow-500 [&_[role=slider]]:border-yellow-400 [&_[role=slider]]:shadow-lg [&_[role=slider]]:shadow-yellow-500/20 [&>span[data-range]]:bg-yellow-500"
                        />
                        <div className="flex justify-between text-xs text-gray-500">
                          <span>0%</span>
                          <span>50%</span>
                          <span>100%</span>
                        </div>
                      </div>
                      <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 space-y-3 hover:border-blue-500/50 transition-colors">
                        <div className="flex items-center justify-between mb-2">
                          <p className="text-sm text-gray-700 font-medium">Soil Moisture</p>
                          <p className="text-2xl font-bold text-gray-700">{soilMoisture[0].toFixed(1)}%</p>
                        </div>
                        <Slider
                          value={soilMoisture}
                          onValueChange={setSoilMoisture}
                          max={100}
                          min={0}
                          step={0.1}
                          className="w-full [&_[role=slider]]:bg-blue-500 [&_[role=slider]]:border-blue-400 [&_[role=slider]]:shadow-lg [&_[role=slider]]:shadow-blue-500/20 [&>span[data-range]]:bg-blue-500"
                        />
                        <div className="flex justify-between text-xs text-gray-500">
                          <span>0%</span>
                          <span>50%</span>
                          <span>100%</span>
                        </div>
                      </div>
                      <div className="bg-orange-500/10 border border-orange-500/30 rounded-lg p-4 space-y-3 hover:border-orange-500/50 transition-colors">
                        <div className="flex items-center justify-between mb-2">
                          <p className="text-sm text-gray-700 font-medium">Weed Area (Estimated)</p>
                          <p className="text-2xl font-bold text-gray-700">{weedArea[0].toFixed(1)}%</p>
                        </div>
                        <Slider
                          value={weedArea}
                          onValueChange={setWeedArea}
                          max={100}
                          min={0}
                          step={0.1}
                          className="w-full [&_[role=slider]]:bg-orange-500 [&_[role=slider]]:border-orange-400 [&_[role=slider]]:shadow-lg [&_[role=slider]]:shadow-orange-500/20 [&>span[data-range]]:bg-orange-500"
                        />
                        <div className="flex justify-between text-xs text-gray-500">
                          <span>0%</span>
                          <span>50%</span>
                          <span>100%</span>
                        </div>
                      </div>
                      <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 space-y-3 hover:border-red-500/50 transition-colors">
                        <div className="flex items-center justify-between mb-2">
                          <p className="text-sm text-gray-700 font-medium">Pest Area (Estimated)</p>
                          <p className="text-2xl font-bold text-gray-700">{pestArea[0].toFixed(1)}%</p>
                        </div>
                        <Slider
                          value={pestArea}
                          onValueChange={setPestArea}
                          max={100}
                          min={0}
                          step={0.1}
                          className="w-full [&_[role=slider]]:bg-red-500 [&_[role=slider]]:border-red-400 [&_[role=slider]]:shadow-lg [&_[role=slider]]:shadow-red-500/20 [&>span[data-range]]:bg-red-500"
                        />
                        <div className="flex justify-between text-xs text-gray-500">
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
                            <p className="text-xs text-gray-600">Field ID: {fieldDetails.fieldId}</p>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="h-[400px] bg-gray-50 rounded-lg border border-gray-200 flex items-center justify-center relative">
                          <div className="text-center">
                            <Map className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                            <p className="text-gray-600 text-lg">Field Reference Map</p>
                            <p className="text-gray-500 text-sm mt-2">Physical Assessment Location</p>
                          </div>
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
                      className="bg-teal-500 hover:bg-teal-600 text-white flex-1"
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Save Analysis
                    </Button>
                    <Button
                      onClick={handleDownload}
                      variant="outline"
                      className="border-gray-300 text-gray-700 hover:bg-gray-100 flex-1"
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

  const renderFieldDetail = () => {
    if (!selectedField) return null;
    const fieldDetails = getFieldDetails(selectedField);

    return (
      <div className="space-y-6">
        <div className="flex items-center gap-2 text-sm">
          <button 
            onClick={handleBackToList}
            className="text-gray-600 hover:text-gray-700"
          >
            Risk Assessments
          </button>
            <span className="text-gray-600">/</span>
          <button 
            onClick={handleBackToFields}
            className="text-gray-600 hover:text-gray-700"
          >
            {selectedAssessment?.farmerName}
          </button>
        </div>
        
        <div>
          <h1 className="text-4xl font-bold text-gray-900">
            Field Detail View: <span className="text-teal-400">{fieldDetails.fieldId}</span>
          </h1>
          <p className="text-gray-600 mt-2">
            <span className="text-blue-300">{fieldDetails.farmer}</span> - <span className="text-green-300">{fieldDetails.cropType}</span>
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className={`${dashboardTheme.card} border border-gray-800`}>
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
          </TabsList>

          <TabsContent value="basic-info" className="mt-6">
            <div className="grid gap-6 md:grid-cols-2">
              <Card className={`${dashboardTheme.card}`}>
                <CardHeader>
                  <CardTitle className="text-gray-900">Field Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center border-b border-gray-200 pb-3">
                    <span className="text-gray-600">Field ID</span>
                    <span className="text-gray-700 font-medium">{fieldDetails.fieldId}</span>
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

              <Card className={`${dashboardTheme.card}`}>
                <CardHeader>
                  <CardTitle className="text-gray-900">Field Map</CardTitle>
                </CardHeader>
                <CardContent className="h-[500px] flex items-center justify-center bg-gray-900/50 rounded-lg border border-gray-800">
                  <div className="text-center">
                    <MapPin className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                    <p className="text-gray-600 text-lg">Map Integration</p>
                    <p className="text-gray-500 text-sm mt-2">Field boundary visualization</p>
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
        </Tabs>
      </div>
    );
  };

  const renderDashboard = () => {
    // Filter assessments
    const filteredAssessments = assessments.filter(assessment => {
      const matchesSearch = searchQuery === "" ||
        assessment.farmerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        assessment.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        assessment.location.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesStatus = statusFilter === "all" || assessment.status.toLowerCase() === statusFilter.toLowerCase();
      
      return matchesSearch && matchesStatus;
    });

    return (
      <div className="space-y-6">
        {/* Action Bar */}
        <div className="flex items-center justify-end gap-4">
          <div className="flex gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`${dashboardTheme.input} pl-10 w-64 border-gray-300`}
              />
            </div>
            <Dialog open={filterDialogOpen} onOpenChange={setFilterDialogOpen}>
              <DialogTrigger asChild>
                <Button className={`${dashboardTheme.card} text-gray-900 hover:bg-gray-100 border border-gray-300`}>
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
              </DialogTrigger>
              <DialogContent className={`${dashboardTheme.card} border-gray-800`}>
                <DialogHeader>
                  <DialogTitle className="text-gray-900">Filter Risk Assessments</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 mt-4">
                  <div>
                    <Label htmlFor="status-filter" className="text-gray-700">Status</Label>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger id="status-filter" className={`${dashboardTheme.select} mt-1`}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className={dashboardTheme.card}>
                        <SelectItem value="all">All Statuses</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="submitted">Submitted</SelectItem>
                        <SelectItem value="under review">Under Review</SelectItem>
                        <SelectItem value="approved">Approved</SelectItem>
                        <SelectItem value="rejected">Rejected</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex justify-between pt-4">
                    <Button 
                      variant="outline" 
                      onClick={clearFilters}
                      className="border-gray-300 text-gray-900 hover:bg-gray-100"
                    >
                      Clear Filters
                    </Button>
                    <Button 
                      onClick={() => setFilterDialogOpen(false)}
                      className="bg-teal-500 hover:bg-teal-600 text-white"
                    >
                      Apply Filters
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
            <Button 
              onClick={loadAssessments}
              variant="outline"
              className="border-gray-300 text-gray-700 hover:bg-gray-100"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <Card className={`${dashboardTheme.card}`}>
            <CardContent className="p-12">
              <div className="flex items-center justify-center">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500 mx-auto mb-4"></div>
                  <p className="text-gray-600">Loading assessments...</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Error State */}
        {error && !loading && (
          <Card className={`${dashboardTheme.card}`}>
            <CardContent className="p-6">
              <div className="text-center text-red-400">
                <AlertTriangle className="h-12 w-12 mx-auto mb-4" />
                <p>{error}</p>
                <Button 
                  onClick={loadAssessments} 
                  className="mt-4 bg-teal-500 hover:bg-teal-600 text-white"
                >
                  Retry
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Data Table */}
        {!loading && !error && (
          <Card className={`${dashboardTheme.card}`}>
            <CardContent className="p-0">
              {filteredAssessments.length === 0 ? (
                <div className="p-12 text-center">
                  <p className="text-gray-600">No assessments found.</p>
                  {assessments.length === 0 && !assessorId && (
                    <p className="text-gray-500 text-sm mt-2">Please log in to view assessments.</p>
                  )}
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-4 px-6 font-medium text-gray-700">Assessment ID</th>
                        <th className="text-left py-4 px-6 font-medium text-gray-700">Farmer Name</th>
                        <th className="text-left py-4 px-6 font-medium text-gray-700">Location</th>
                        <th className="text-left py-4 px-6 font-medium text-gray-700">Status</th>
                        <th className="text-left py-4 px-6 font-medium text-gray-700">Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredAssessments.map((assessment, index) => (
                        <tr
                          key={assessment.id}
                          onClick={() => handleAssessmentClick(assessment)}
                          className={`border-b border-gray-200 hover:bg-gray-50 transition-colors cursor-pointer ${
                            index % 2 === 0 ? "bg-gray-50" : ""
                          }`}
                        >
                          <td className="py-4 px-6 text-gray-700">{assessment.id}</td>
                          <td className="py-4 px-6 text-gray-700">{assessment.farmerName}</td>
                          <td className="py-4 px-6 text-gray-700">
                            <div className="flex items-center gap-2">
                              <MapPin className="h-4 w-4 text-gray-600" />
                              {assessment.location}
                            </div>
                          </td>
                          <td className="py-4 px-6">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${
                              assessment.status.toLowerCase() === 'approved' || assessment.status.toLowerCase() === 'submitted'
                                ? "bg-green-100 text-green-700 border border-green-200"
                                : assessment.status.toLowerCase() === 'rejected'
                                ? "bg-red-100 text-red-700 border border-red-200"
                                : "bg-yellow-100 text-yellow-700 border border-yellow-200"
                            }`}>
                              {assessment.status}
                            </span>
                          </td>
                          <td className="py-4 px-6 text-gray-700">
                            {new Date(assessment.date).toLocaleDateString()}
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
  };

  // Render view based on mode
  if (viewMode === "fieldSelection") {
    return renderFieldSelection();
  }

  if (viewMode === "fieldDetail") {
    return renderFieldDetail();
  }

  return renderDashboard();
}
