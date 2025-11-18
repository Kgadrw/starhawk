import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { dashboardTheme } from "@/utils/dashboardTheme";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import DashboardLayout from "../layout/DashboardLayout";
import AssessorNotifications from "../assessor/AssessorNotifications";
import AssessorProfileSettings from "../assessor/AssessorProfileSettings";
import RiskAssessmentSystem from "../assessor/RiskAssessmentSystem";
import LossAssessmentSystem from "../assessor/LossAssessmentSystem";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import meteosourceApiService from "@/services/meteosourceApi";
import assessmentsApiService from "@/services/assessmentsApi";
import farmsApiService, { getFarms, getFarmById, getWeatherForecast, getHistoricalWeather, getVegetationStats, uploadShapefile, uploadKML, createFarm, createInsuranceRequest, updateFarm } from "@/services/farmsApi";
import { getUserId, getPhoneNumber, getEmail } from "@/services/authAPI";
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
  RefreshCw
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
  const [activePage, setActivePage] = useState("dashboard");
  
  // Get logged-in assessor data from localStorage
  const assessorId = getUserId() || "";
  const assessorPhone = getPhoneNumber() || "";
  const assessorEmail = getEmail() || "";
  // Use email or phone number as display name, or fallback to "Assessor"
  const assessorName = assessorEmail || assessorPhone || "Assessor";
  const [activeView, setActiveView] = useState("assessments");
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
  const [weatherForecast, setWeatherForecast] = useState<any | null>(null);
  const [historicalWeather, setHistoricalWeather] = useState<any | null>(null);
  const [vegetationStats, setVegetationStats] = useState<any | null>(null);
  const [loadingWeather, setLoadingWeather] = useState(false);
  const [loadingVegetation, setLoadingVegetation] = useState(false);

  // Computed values for dashboard stats
  const totalAssessments = assessments.length;
  const totalRiskAssessments = assessments.filter(a => a.type === "Risk Assessment").length;
  const totalClaimAssessments = assessments.filter(a => a.type === "Claim Assessment").length;
  const pendingAssessments = assessments.filter(a => a.status === "Pending").length;

  // Fetch assessments from API
  useEffect(() => {
    loadAssessments();
  }, []);

  const loadAssessments = async () => {
    setLoading(true);
    setError(null);
    try {
      const response: any = await assessmentsApiService.getAllAssessments();
      // Map API response to AssessmentSummary format
      // Adjust mapping based on actual API response structure
      let assessmentsData: any[] = [];
      if (Array.isArray(response)) {
        assessmentsData = response;
      } else if (response && typeof response === 'object') {
        const responseObj = response as { data?: any[]; assessments?: any[] };
        assessmentsData = responseObj.data || responseObj.assessments || [];
      }
      
      const mappedAssessments: AssessmentSummary[] = assessmentsData.map((item: any) => ({
        id: item._id || item.id || '',
        farmerId: item.farmId || item.farmerId || '',
        farmerName: item.farmerName || item.farmer?.name || 'Unknown',
        location: item.location || item.farm?.location || '',
        type: item.type || 'Risk Assessment',
        status: item.status || 'Pending',
        date: item.createdAt ? new Date(item.createdAt).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]
      }));
      
      setAssessments(mappedAssessments);
    } catch (err: any) {
      console.error('Failed to load assessments:', err);
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
      const response: any = await getFarms(1, 100);
      let farmsData: any[] = [];
      
      if (Array.isArray(response)) {
        farmsData = response;
      } else if (response && typeof response === 'object') {
        farmsData = response.data || response.farms || response.items || [];
      }
      
      setFarms(farmsData);
    } catch (err: any) {
      console.error('Failed to load farms:', err);
      setFarmsError(err.message || 'Failed to load farms');
      toast({
        title: "Error",
        description: err.message || 'Failed to load farms',
        variant: "destructive",
      });
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
            <p className="text-gray-900/60">Loading weather data...</p>
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
                <Wind className="h-5 w-5 mr-2 text-teal-500" />
                <div>
                  <div className="text-xs text-gray-600">Wind</div>
                  <div className="font-medium text-gray-700">{weatherData.current.windSpeed} km/h</div>
                </div>
              </div>
              <div className="flex items-center text-gray-900/80">
                <Droplets className="h-5 w-5 mr-2 text-blue-500" />
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
                <Thermometer className="h-5 w-5 mr-2 text-orange-500" />
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
    
    // Manual input metrics state
    const [stressDetected, setStressDetected] = useState<number[]>([17.6]);
    const [soilMoisture, setSoilMoisture] = useState<number[]>([58]);
    const [weedArea, setWeedArea] = useState<number[]>([7.3]);
    const [pestArea, setPestArea] = useState<number[]>([4.4]);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        setSelectedFile(file.name);
        
        // Upload file to farms API if it's a shapefile or KML
        try {
          const fileExtension = file.name.split('.').pop()?.toLowerCase();
          if (fileExtension === 'kml' || fileExtension === 'kmz') {
            await uploadKML(file);
            toast({
              title: "Success",
              description: "KML file uploaded successfully",
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
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-teal-500 transition-colors">
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
                        className="bg-teal-500 hover:bg-teal-600 text-white"
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        Choose File
                      </Button>
                      {selectedFile && (
                        <div className="mt-4 p-3 bg-teal-500/10 border border-teal-500/30 rounded-lg">
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
                            <p className="text-xs text-gray-900/60">Field ID: {fieldDetails.fieldId}</p>
                          </div>
                          <div className="flex items-center gap-4">
                            <p className="text-sm text-gray-900/80">Layer: 🌱 Plant Health (NDVI)</p>
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
                        <div className="h-[400px] bg-white rounded-lg border border-gray-200 flex items-center justify-center relative">
                          <div className="text-center">
                            <Map className="h-16 w-16 mx-auto mb-4 text-gray-900/30" />
                            <p className="text-gray-900/60 text-lg">Field Visualization Map</p>
                            <p className="text-gray-900/40 text-sm mt-2">NDVI Data Visualization</p>
                          </div>
                          {/* Legend */}
                          <div className="absolute bottom-4 left-4 bg-white/90 border border-gray-200 rounded-lg p-4">
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
                      className="border-gray-300 text-gray-900 hover:bg-gray-100 flex-1"
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
                      <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 space-y-3 hover:border-yellow-500/50 transition-colors">
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
                          className="w-full [&_[role=slider]]:bg-yellow-500 [&_[role=slider]]:border-yellow-400 [&_[role=slider]]:shadow-lg [&_[role=slider]]:shadow-yellow-500/20 [&>span[data-range]]:bg-yellow-500"
                        />
                        <div className="flex justify-between text-xs text-gray-900/40">
                          <span>0%</span>
                          <span>50%</span>
                          <span>100%</span>
                        </div>
                      </div>
                      <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 space-y-3 hover:border-blue-500/50 transition-colors">
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
                          className="w-full [&_[role=slider]]:bg-blue-500 [&_[role=slider]]:border-blue-400 [&_[role=slider]]:shadow-lg [&_[role=slider]]:shadow-blue-500/20 [&>span[data-range]]:bg-blue-500"
                        />
                        <div className="flex justify-between text-xs text-gray-900/40">
                          <span>0%</span>
                          <span>50%</span>
                          <span>100%</span>
                        </div>
                      </div>
                      <div className="bg-orange-500/10 border border-orange-500/30 rounded-lg p-4 space-y-3 hover:border-orange-500/50 transition-colors">
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
                          className="w-full [&_[role=slider]]:bg-orange-500 [&_[role=slider]]:border-orange-400 [&_[role=slider]]:shadow-lg [&_[role=slider]]:shadow-orange-500/20 [&>span[data-range]]:bg-orange-500"
                        />
                        <div className="flex justify-between text-xs text-gray-900/40">
                          <span>0%</span>
                          <span>50%</span>
                          <span>100%</span>
                        </div>
                      </div>
                      <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 space-y-3 hover:border-red-500/50 transition-colors">
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
                          className="w-full [&_[role=slider]]:bg-red-500 [&_[role=slider]]:border-red-400 [&_[role=slider]]:shadow-lg [&_[role=slider]]:shadow-red-500/20 [&>span[data-range]]:bg-red-500"
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
                            <p className="text-xs text-gray-900/60">Field ID: {fieldDetails.fieldId}</p>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="h-[400px] bg-white rounded-lg border border-gray-200 flex items-center justify-center relative">
                          <div className="text-center">
                            <Map className="h-16 w-16 mx-auto mb-4 text-gray-900/30" />
                            <p className="text-gray-900/60 text-lg">Field Reference Map</p>
                            <p className="text-gray-900/40 text-sm mt-2">Physical Assessment Location</p>
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
                      className="border-gray-300 text-gray-900 hover:bg-gray-100 flex-1"
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
            await uploadKML(file);
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

  const handleBackToFields = () => {
    setViewMode("fieldSelection");
    setSelectedField(null);
  };

  // Field Selection View
  const renderFieldSelection = () => {
    if (!selectedAssessment) return null;
    const fields = getFieldsForAssessment(selectedAssessment);
    
    return (
      <div className="space-y-6">
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
                    <th className="text-left py-4 px-6 font-medium text-gray-900/80">Field ID</th>
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
                      <td className="py-4 px-6 text-gray-900">{field.id}</td>
                      <td className="py-4 px-6 text-gray-900">{field.farmerName}</td>
                      <td className="py-4 px-6 text-gray-900">
                        <div className="flex items-center gap-2">
                          <Leaf className="h-4 w-4 text-teal-500" />
                          {field.crop}
                        </div>
                      </td>
                      <td className="py-4 px-6 text-gray-900">{field.area} ha</td>
                      <td className="py-4 px-6 text-gray-900">{field.season}</td>
                      <td className="py-4 px-6">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          field.status === "Processed"
                            ? "bg-green-500/20 text-green-600 border border-green-500/30"
                            : "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30"
                        }`}>
                          {field.status}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        {field.status === "Processed" ? (
                          <Button
                            onClick={() => handleFieldClick(field)}
                            className="bg-gray-200 hover:bg-gray-300 text-gray-900 border border-gray-300"
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            View Data
                          </Button>
                        ) : (
                          <Button
                            onClick={() => handleFieldClick(field)}
                            className="bg-gray-200 hover:bg-gray-300 text-gray-900 border border-gray-300"
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
    );
  };

  // Field Detail View
  const renderFieldDetail = () => {
    if (!selectedField) return null;
    const fieldDetails = getFieldDetails(selectedField);

    return (
      <div className="space-y-6">
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
            Field Detail View: <span className="text-gray-700">{fieldDetails.fieldId}</span>
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

              {/* Field Map */}
              <Card className={`${dashboardTheme.card}`}>
                <CardHeader>
                  <CardTitle className="text-gray-900">Field Map</CardTitle>
                </CardHeader>
                <CardContent className="h-[500px] flex items-center justify-center bg-white rounded-lg border border-gray-200">
                  <div className="text-center">
                    <MapPin className="h-16 w-16 mx-auto mb-4 text-gray-900/30" />
                    <p className="text-gray-900/60 text-lg">Map Integration</p>
                    <p className="text-gray-900/40 text-sm mt-2">Field boundary visualization</p>
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
    );
  };

  const renderDashboard = () => (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className={`${dashboardTheme.card} border-l-4 border-l-blue-500`}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-900/80">Total Assessments</CardTitle>
            <FileText className="h-5 w-5 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">{totalAssessments}</div>
            <p className="text-xs text-gray-900/60 mt-1">All assessments</p>
          </CardContent>
        </Card>

        <Card className={`${dashboardTheme.card} border-l-4 border-l-green-500`}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-900/80">Risk Assessments</CardTitle>
            <Shield className="h-5 w-5 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">{totalRiskAssessments}</div>
            <p className="text-xs text-gray-900/60 mt-1">Risk evaluations</p>
          </CardContent>
        </Card>

        <Card className={`${dashboardTheme.card} border-l-4 border-l-blue-500`}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-900/80">Claim Assessments</CardTitle>
            <FileText className="h-5 w-5 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">{totalClaimAssessments}</div>
            <p className="text-xs text-gray-900/60 mt-1">Claims processed</p>
          </CardContent>
        </Card>

        <Card className={`${dashboardTheme.card} border-l-4 border-l-purple-500`}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-900/80">Pending Reviews</CardTitle>
            <Calendar className="h-5 w-5 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">{pendingAssessments}</div>
            <p className="text-xs text-gray-900/60 mt-1">Awaiting action</p>
          </CardContent>
        </Card>
      </div>

      {/* Error Message */}
      {error && (
        <Card className={`${dashboardTheme.card} border-l-4 border-l-red-500`}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-red-400" />
                <p className="text-red-400">{error}</p>
              </div>
              <Button
                onClick={loadAssessments}
                variant="outline"
                size="sm"
                className="border-gray-300 text-gray-900 hover:bg-gray-100"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Retry
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Action Bar */}
      <div className="flex items-center justify-between">
        <Button
          onClick={loadAssessments}
          disabled={loading}
          variant="outline"
          className="border-gray-300 text-gray-900 hover:bg-gray-800"
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-900/60" />
            <Input
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`${dashboardTheme.input} pl-10 w-64 border-gray-300`}
            />
          </div>
          <Dialog open={filterDialogOpen} onOpenChange={setFilterDialogOpen}>
            <DialogTrigger asChild>
              <Button className={`${dashboardTheme.card} text-gray-900 hover:bg-gray-800 border border-gray-300`}>
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
            </DialogTrigger>
            <DialogContent className={`${dashboardTheme.card} border-gray-200`}>
              <DialogHeader>
                <DialogTitle className="text-gray-900">Filter Assessments</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                <div>
                  <Label htmlFor="status-filter" className="text-gray-900/80">Status</Label>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger id="status-filter" className={`${dashboardTheme.select} mt-1`}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className={dashboardTheme.card}>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="Pending">Pending</SelectItem>
                      <SelectItem value="Submitted">Submitted</SelectItem>
                      <SelectItem value="Under Review">Under Review</SelectItem>
                      <SelectItem value="Approved">Approved</SelectItem>
                      <SelectItem value="Rejected">Rejected</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="type-filter" className="text-gray-900/80">Type</Label>
                  <Select value={typeFilter} onValueChange={setTypeFilter}>
                    <SelectTrigger id="type-filter" className={`${dashboardTheme.select} mt-1`}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className={dashboardTheme.card}>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="Risk Assessment">Risk Assessment</SelectItem>
                      <SelectItem value="Claim Assessment">Claim Assessment</SelectItem>
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
        </div>
      </div>

      {/* Data Table */}
      <Card className={`${dashboardTheme.card}`}>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500 mx-auto mb-4"></div>
                <p className="text-gray-900/60">Loading assessments...</p>
              </div>
            </div>
          ) : filteredAssessments.length === 0 ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <FileText className="h-12 w-12 mx-auto mb-4 text-gray-900/40" />
                <p className="text-gray-900/60">No assessments found</p>
                {!error && (
                  <Button
                    onClick={loadAssessments}
                    variant="outline"
                    className="mt-4 border-gray-300 text-gray-900 hover:bg-gray-800"
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Refresh
                  </Button>
                )}
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-4 px-6 font-medium text-gray-900/80">Farmer ID</th>
                    <th className="text-left py-4 px-6 font-medium text-gray-900/80">Farmer Name</th>
                    <th className="text-left py-4 px-6 font-medium text-gray-900/80">Location</th>
                    <th className="text-left py-4 px-6 font-medium text-gray-900/80">Type</th>
                    <th className="text-left py-4 px-6 font-medium text-gray-900/80">Status</th>
                    <th className="text-left py-4 px-6 font-medium text-gray-900/80">Date</th>
                    <th className="text-left py-4 px-6 font-medium text-gray-900/80">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAssessments.map((assessment, index) => (
                    <tr
                      key={assessment.id}
                      onClick={() => handleAssessmentClick(assessment)}
                      className={`border-b border-gray-200 hover:bg-gray-50 transition-colors cursor-pointer ${
                        index % 2 === 0 ? "bg-gray-50/30" : ""
                      }`}
                    >
                      <td className="py-4 px-6 text-gray-900">{assessment.farmerId}</td>
                      <td className="py-4 px-6 text-gray-900">{assessment.farmerName}</td>
                      <td className="py-4 px-6 text-gray-900/80">
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-teal-500" />
                          {assessment.location}
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-500/20 text-blue-600 border border-blue-500/30">
                          {assessment.type}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <div onClick={(e) => e.stopPropagation()}>
                          <Select 
                            value={assessment.status} 
                            onValueChange={(value) => handleStatusChange(assessment.id, value)}
                            disabled={updatingAssessment === assessment.id}
                          >
                            <SelectTrigger className={`${dashboardTheme.select} border-yellow-500/30 bg-yellow-500/20 text-yellow-400 h-auto py-1 px-3 w-32`}>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className={dashboardTheme.card}>
                              <SelectItem value="Pending">Pending</SelectItem>
                              <SelectItem value="Submitted">Submitted</SelectItem>
                              <SelectItem value="Under Review">Under Review</SelectItem>
                              <SelectItem value="Approved">Approved</SelectItem>
                              <SelectItem value="Rejected">Rejected</SelectItem>
                              <SelectItem value="Processing">Processing</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-gray-900/80">{assessment.date}</td>
                      <td className="py-4 px-6">
                        <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                          {assessment.status !== "Submitted" && (
                            <>
                              <Button
                                onClick={() => handleCalculateRisk(assessment.id)}
                                disabled={updatingAssessment === assessment.id}
                                size="sm"
                                variant="outline"
                                className="border-gray-300 text-gray-900 hover:bg-gray-100"
                              >
                                <Shield className="h-4 w-4" />
                              </Button>
                              <Button
                                onClick={() => handleSubmitAssessment(assessment.id)}
                                disabled={updatingAssessment === assessment.id}
                                size="sm"
                                className="bg-teal-500 hover:bg-teal-600 text-white"
                              >
                                <CheckCircle className="h-4 w-4" />
                              </Button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

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
              <div className="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center hover:border-teal-500 transition-colors">
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
                  className="bg-teal-500 hover:bg-teal-600 text-white"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  SELECT FILES
                </Button>
                {uploadedFiles.length > 0 && (
                  <div className="mt-4 space-y-2">
                    {uploadedFiles.map((fileName, idx) => (
                      <div key={idx} className="p-3 bg-teal-500/10 border border-teal-500/30 rounded-lg">
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
                    <a href="#" className="text-teal-400 hover:text-teal-300 text-sm">
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
                  <div className="h-[500px] bg-white rounded-lg border border-gray-200 flex items-center justify-center relative">
                    <div className="text-center">
                      <Map className="h-16 w-16 mx-auto mb-4 text-gray-900/30" />
                      <p className="text-gray-900/60 text-lg">Map View</p>
                      <p className="text-gray-900/40 text-sm mt-2">Draw polygon with polygon tool</p>
                      {!calculatedArea && (
                        <Button
                          onClick={handlePolygonComplete}
                          className="bg-teal-500 hover:bg-teal-600 text-white mt-4"
                        >
                          Complete Polygon
                        </Button>
                      )}
                    </div>
                  </div>
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
                            ? "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30"
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
              className="border-gray-300 text-gray-900 hover:bg-gray-800"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSyncField}
              className="bg-teal-600 hover:bg-teal-700 text-gray-900"
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
      case "risk-assessments": return <RiskAssessmentSystem />;
      case "loss-assessments": return <LossAssessmentSystem />;
      case "notifications": return <AssessorNotifications />;
      case "profile-settings": return <AssessorProfileSettings />;
      default: return renderDashboard();
    }
  };

  const navigationItems = [
    { id: "dashboard", label: "Dashboard", icon: BarChart3 },
    { id: "risk-assessments", label: "Risk Assessments", icon: Shield },
    { id: "loss-assessments", label: "Loss Assessment", icon: AlertCircle },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "profile-settings", label: "Profile Settings", icon: User }
  ];

  return (
    <DashboardLayout
      userType="assessor"
      userId={assessorId}
      userName={assessorName}
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
        window.location.href = '/assessor-login';
      }}
    >
      {renderPage()}
    </DashboardLayout>
  );
}
