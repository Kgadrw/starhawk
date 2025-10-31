import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { dashboardTheme } from "@/utils/dashboardTheme";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import meteosourceApiService from "@/services/meteosourceApi";
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
  Cloud
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

export default function RiskAssessmentSystem() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterDialogOpen, setFilterDialogOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedAssessment, setSelectedAssessment] = useState<AssessmentSummary | null>(null);
  const [selectedField, setSelectedField] = useState<Field | null>(null);
  const [viewMode, setViewMode] = useState<"list" | "fieldSelection" | "fieldDetail">("list");
  const [activeTab, setActiveTab] = useState("basic-info");
  
  // Mock data for Risk Assessments only
  const assessments: AssessmentSummary[] = [
    {
      id: "RISK-001",
      farmerName: "Jean Baptiste",
      location: "Nyagatare, Eastern Province",
      type: "Risk Assessment",
      status: "Submitted",
      date: "2024-10-03"
    },
    {
      id: "RISK-002",
      farmerName: "Kamali Peace",
      location: "Gatsibo, Eastern Province",
      type: "Risk Assessment",
      status: "Pending",
      date: "2024-10-02"
    },
    {
      id: "RISK-003",
      farmerName: "Mugabo John",
      location: "Gatsibo, Eastern Province",
      type: "Risk Assessment",
      status: "Submitted",
      date: "2024-09-30"
    },
    {
      id: "RISK-004",
      farmerName: "Nkurunziza Richard",
      location: "Nyagatare, Eastern Province",
      type: "Risk Assessment",
      status: "Under Review",
      date: "2024-09-25"
    }
  ];

  // Mock field data for farmers
  const fieldsByFarmer: Record<string, Field[]> = {
    "Jean Baptiste": [
      {
        id: "FLD-002",
        farmerName: "Jean Baptiste",
        crop: "Maize",
        area: 2.8,
        season: "A",
        status: "Processed",
        fieldName: "Main Maize Field",
        sowingDate: "2025-03-05"
      }
    ],
    "Kamali Peace": [
      {
        id: "FLD-003",
        farmerName: "Kamali Peace",
        crop: "Rice",
        area: 1.5,
        season: "B",
        status: "Processed",
        fieldName: "Central Rice Field",
        sowingDate: "2025-09-20"
      }
    ],
    "Mugabo John": [
      {
        id: "FLD-001",
        farmerName: "Mugabo John",
        crop: "Maize",
        area: 3.4,
        season: "B",
        status: "Processed",
        fieldName: "North Maize Plot",
        sowingDate: "2025-09-15"
      },
      {
        id: "FLD-004",
        farmerName: "Mugabo John",
        crop: "Rice",
        area: 2.5,
        season: "A",
        status: "Processed",
        fieldName: "South Rice Field",
        sowingDate: "2025-03-01"
      },
      {
        id: "FLD-007",
        farmerName: "Mugabo John",
        crop: "Beans",
        area: 1.4,
        season: "B",
        status: "Processing Needed",
        fieldName: "East Beans Plot",
        sowingDate: "2025-09-10"
      }
    ],
    "Nkurunziza Richard": [
      {
        id: "FLD-005",
        farmerName: "Nkurunziza Richard",
        crop: "Potatoes",
        area: 2.0,
        season: "A",
        status: "Processed",
        fieldName: "West Potato Field",
        sowingDate: "2025-03-10"
      }
    ]
  };

  const getFieldsForAssessment = (assessment: AssessmentSummary): Field[] => {
    return fieldsByFarmer[assessment.farmerName] || [];
  };

  // Filter assessments
  const filteredAssessments = assessments.filter(assessment => {
    const matchesSearch = searchQuery === "" ||
      assessment.farmerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      assessment.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      assessment.location.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || assessment.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

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
    const fields = getFieldsForAssessment(selectedAssessment);
    
    return (
      <div className="space-y-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm">
          <button 
            onClick={handleBackToList}
            className="text-teal-400 hover:text-teal-300"
          >
            Risk Assessments
          </button>
          <span className="text-white/60">/</span>
          <span className="text-white">{selectedAssessment.farmerName}</span>
        </div>

        {/* Table */}
        <Card className={`${dashboardTheme.card}`}>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-800">
                    <th className="text-left py-4 px-6 font-medium text-white/80">Field ID</th>
                    <th className="text-left py-4 px-6 font-medium text-white/80">Farmer</th>
                    <th className="text-left py-4 px-6 font-medium text-white/80">Crop</th>
                    <th className="text-left py-4 px-6 font-medium text-white/80">Area (ha)</th>
                    <th className="text-left py-4 px-6 font-medium text-white/80">Season</th>
                    <th className="text-left py-4 px-6 font-medium text-white/80">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {fields.map((field, index) => (
                    <tr
                      key={field.id}
                      onClick={() => handleFieldClick(field)}
                      className={`border-b border-gray-800/50 hover:bg-gray-900/50 transition-colors cursor-pointer ${
                        index % 2 === 0 ? "bg-gray-950/30" : ""
                      }`}
                    >
                      <td className="py-4 px-6 text-white">{field.id}</td>
                      <td className="py-4 px-6 text-white">{field.farmerName}</td>
                      <td className="py-4 px-6 text-white">{field.crop}</td>
                      <td className="py-4 px-6 text-white">{field.area} ha</td>
                      <td className="py-4 px-6 text-white">{field.season}</td>
                      <td className="py-4 px-6">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          field.status === "Processed"
                            ? "bg-green-500/20 text-green-400 border border-green-500/30"
                            : "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30"
                        }`}>
                          {field.status}
                        </span>
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
            <p className="text-white/60">Loading weather data...</p>
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
                className="mt-4 bg-teal-600 hover:bg-teal-700 text-white"
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
            <CardTitle className="flex items-center justify-between text-white">
              <div className="flex items-center">
                <CloudRain className="h-5 w-5 mr-2" />
                Current Weather
              </div>
              {lastUpdated && (
                <span className="text-xs text-white/60">Updated: {formatTime(lastUpdated)}</span>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                {getWeatherIcon(weatherData.current.summary)}
                <div>
                  <div className="text-4xl font-bold text-white">
                    {weatherData.current.temperature}°C
                  </div>
                  <div className="text-lg text-white/70 capitalize">
                    {weatherData.current.summary}
                  </div>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-gray-800">
              <div className="flex items-center text-white/80">
                <Wind className="h-5 w-5 mr-2 text-teal-500" />
                <div>
                  <div className="text-xs text-white/60">Wind</div>
                  <div className="font-medium">{weatherData.current.windSpeed} km/h</div>
                </div>
              </div>
              <div className="flex items-center text-white/80">
                <Droplets className="h-5 w-5 mr-2 text-blue-500" />
                <div>
                  <div className="text-xs text-white/60">Humidity</div>
                  <div className="font-medium">{weatherData.current.humidity}%</div>
                </div>
              </div>
              <div className="flex items-center text-white/80">
                <CloudRain className="h-5 w-5 mr-2 text-cyan-500" />
                <div>
                  <div className="text-xs text-white/60">Precipitation</div>
                  <div className="font-medium">{weatherData.current.precipitation}mm</div>
                </div>
              </div>
              <div className="flex items-center text-white/80">
                <Thermometer className="h-5 w-5 mr-2 text-orange-500" />
                <div>
                  <div className="text-xs text-white/60">Pressure</div>
                  <div className="font-medium">{weatherData.current.pressure} hPa</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className={`${dashboardTheme.card}`}>
          <CardHeader>
            <CardTitle className="flex items-center text-white">
              <Clock className="h-5 w-5 mr-2" />
              8-Hour Forecast
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <div className="flex gap-4">
                {weatherData.hourly.map((hour, idx) => (
                  <div key={idx} className="min-w-[100px] text-center">
                    <div className="text-white/60 text-sm mb-2">{formatTime(hour.time)}</div>
                    <div className="flex justify-center mb-2">
                      {getWeatherIcon(hour.summary)}
                    </div>
                    <div className="text-white font-bold mb-1">{hour.temperature}°</div>
                    <div className="text-white/60 text-xs capitalize">{hour.summary}</div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className={`${dashboardTheme.card}`}>
          <CardHeader>
            <CardTitle className="flex items-center text-white">
              <Calendar className="h-5 w-5 mr-2" />
              7-Day Forecast
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {weatherData.daily.map((day, idx) => (
                <div key={idx} className="flex items-center justify-between py-3 border-b border-gray-800 last:border-0">
                  <div className="flex items-center space-x-3 flex-1">
                    <div className="text-white/70 w-20">{formatDate(day.date)}</div>
                    <div className="flex justify-center w-12">
                      {getWeatherIcon(day.summary)}
                    </div>
                    <div className="flex-1">
                      <div className="text-white capitalize">{day.summary}</div>
                      <div className="text-white/60 text-xs">
                        <Wind className="h-3 w-3 inline mr-1" />
                        {day.windSpeed}km/h {day.windDir} • {day.precipitation}mm
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-white font-bold">{day.temperature.max}°</div>
                    <div className="text-white/60 text-sm">{day.temperature.min}°</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  // Crop Analysis Component
  const CropAnalysisTab = ({ fieldDetails }: { fieldDetails: FieldDetail }) => {
    const [cropData, setCropData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      loadCropData();
    }, []);

    const loadCropData = async () => {
      setLoading(true);
      try {
        await new Promise(resolve => setTimeout(resolve, 800));
        
        const mockData = {
          currentStage: fieldDetails.cropType === "Maize" ? "flowering" : "vegetation",
          growthProgress: fieldDetails.cropType === "Maize" ? 65 : 45,
          overallHealth: 78,
          ndvi: 0.72,
          colorIndex: 0.68,
          moistureLevel: 72,
          growthRate: 2.3,
          threats: {
            weedInfestation: { detected: true, species: ["Amaranthus", "Bidens"], density: 25, coverage: 12 },
            diseaseOutbreak: { detected: false, diseaseType: [], severity: 0, affectedArea: 0 },
            pestActivity: { detected: true, pestType: ["Aphids"], population: 15, damage: 8 },
            nutrientDeficiency: { detected: true, deficientNutrients: ["Nitrogen"], severity: 20 },
            irrigationIssues: { detected: false, issueType: "", severity: 0 }
          },
          growthStages: [
            { stage: "planting", date: new Date("2025-09-15"), completed: true },
            { stage: "germination", date: new Date("2025-09-22"), completed: true },
            { stage: "vegetation", date: new Date("2025-10-10"), completed: true },
            { stage: "flowering", date: new Date("2025-10-28"), completed: false }
          ],
          recommendations: [
            "Apply nitrogen fertilizer to address deficiency",
            "Continue monitoring for aphid population growth",
            "Mechanical weeding recommended in next 7 days",
            "Increase irrigation frequency during flowering stage"
          ],
          lastUpdated: new Date()
        };
        
        setCropData(mockData);
      } catch (err: any) {
        console.error('Failed to load crop data:', err);
      } finally {
        setLoading(false);
      }
    };

    const getHealthColor = (health: number) => {
      if (health >= 80) return "text-green-500";
      if (health >= 60) return "text-yellow-500";
      if (health >= 40) return "text-orange-500";
      return "text-red-500";
    };

    const getThreatColor = (detected: boolean, severity: number) => {
      if (!detected) return "text-green-500";
      if (severity >= 50) return "text-red-500";
      if (severity >= 25) return "text-yellow-500";
      return "text-orange-500";
    };

    if (loading) {
      return (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
            <p className="text-white/60">Loading crop analysis data...</p>
          </div>
        </div>
      );
    }

    if (!cropData) {
      return (
        <Card className={`${dashboardTheme.card}`}>
          <CardContent className="p-6">
            <div className="text-center text-red-400">
              <Leaf className="h-12 w-12 mx-auto mb-4" />
              <p>Failed to load crop analysis data</p>
            </div>
          </CardContent>
        </Card>
      );
    }

    return (
      <div className="space-y-6">
        <div className="grid gap-6 md:grid-cols-3">
          <Card className={`${dashboardTheme.card} border-l-4 border-l-green-500`}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-white/70 mb-2">Overall Health</p>
                  <p className={`text-3xl font-bold ${getHealthColor(cropData.overallHealth)}`}>
                    {cropData.overallHealth}%
                  </p>
                </div>
                <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center">
                  <Leaf className="h-8 w-8 text-green-500" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className={`${dashboardTheme.card} border-l-4 border-l-blue-500`}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-white/70 mb-2">Growth Progress</p>
                  <p className="text-3xl font-bold text-white">
                    {cropData.growthProgress}%
                  </p>
                  <p className="text-xs text-white/60 mt-1">Stage: {cropData.currentStage}</p>
                </div>
                <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center">
                  <AlertTriangle className="h-8 w-8 text-blue-500" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className={`${dashboardTheme.card} border-l-4 border-l-teal-500`}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-white/70 mb-2">NDVI Index</p>
                  <p className="text-3xl font-bold text-white">
                    {cropData.ndvi.toFixed(2)}
                  </p>
                  <p className="text-xs text-white/60 mt-1">Healthy vegetation</p>
                </div>
                <div className="w-16 h-16 bg-teal-500/20 rounded-full flex items-center justify-center">
                  <Leaf className="h-8 w-8 text-teal-500" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className={`${dashboardTheme.card}`}>
          <CardHeader>
            <CardTitle className="flex items-center text-white">
              <AlertTriangle className="h-5 w-5 mr-2" />
              Threats Assessment
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div className={`p-4 rounded-lg border ${cropData.threats.weedInfestation.detected ? 'border-yellow-500/30 bg-yellow-500/10' : 'border-gray-800 bg-gray-800/30'}`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white font-medium">Weed Infestation</span>
                  <span className={`text-sm ${getThreatColor(cropData.threats.weedInfestation.detected, cropData.threats.weedInfestation.density)}`}>
                    {cropData.threats.weedInfestation.detected ? 'Detected' : 'None'}
                  </span>
                </div>
                {cropData.threats.weedInfestation.detected && (
                  <div className="text-sm text-white/70">
                    <p>Species: {cropData.threats.weedInfestation.species.join(', ')}</p>
                    <p>Density: {cropData.threats.weedInfestation.density} plants/m²</p>
                  </div>
                )}
              </div>

              <div className={`p-4 rounded-lg border ${cropData.threats.pestActivity.detected ? 'border-orange-500/30 bg-orange-500/10' : 'border-gray-800 bg-gray-800/30'}`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white font-medium">Pest Activity</span>
                  <span className={`text-sm ${getThreatColor(cropData.threats.pestActivity.detected, cropData.threats.pestActivity.damage)}`}>
                    {cropData.threats.pestActivity.detected ? 'Detected' : 'None'}
                  </span>
                </div>
                {cropData.threats.pestActivity.detected && (
                  <div className="text-sm text-white/70">
                    <p>Type: {cropData.threats.pestActivity.pestType.join(', ')}</p>
                    <p>Population: {cropData.threats.pestActivity.population}</p>
                  </div>
                )}
              </div>

              <div className={`p-4 rounded-lg border ${cropData.threats.nutrientDeficiency.detected ? 'border-red-500/30 bg-red-500/10' : 'border-gray-800 bg-gray-800/30'}`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white font-medium">Nutrient Deficiency</span>
                  <span className={`text-sm ${getThreatColor(cropData.threats.nutrientDeficiency.detected, cropData.threats.nutrientDeficiency.severity)}`}>
                    {cropData.threats.nutrientDeficiency.detected ? 'Detected' : 'None'}
                  </span>
                </div>
                {cropData.threats.nutrientDeficiency.detected && (
                  <div className="text-sm text-white/70">
                    <p>Nutrients: {cropData.threats.nutrientDeficiency.deficientNutrients.join(', ')}</p>
                    <p>Severity: {cropData.threats.nutrientDeficiency.severity}%</p>
                  </div>
                )}
              </div>

              <div className={`p-4 rounded-lg border ${cropData.threats.diseaseOutbreak.detected ? 'border-purple-500/30 bg-purple-500/10' : 'border-gray-800 bg-gray-800/30'}`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white font-medium">Disease Outbreak</span>
                  <span className={`text-sm ${getThreatColor(cropData.threats.diseaseOutbreak.detected, cropData.threats.diseaseOutbreak.severity)}`}>
                    {cropData.threats.diseaseOutbreak.detected ? 'Detected' : 'None'}
                  </span>
                </div>
                {cropData.threats.diseaseOutbreak.detected && (
                  <div className="text-sm text-white/70">
                    <p>Type: {cropData.threats.diseaseOutbreak.diseaseType.join(', ')}</p>
                    <p>Severity: {cropData.threats.diseaseOutbreak.severity}%</p>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className={`${dashboardTheme.card}`}>
          <CardHeader>
            <CardTitle className="text-white">Recommendations</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {cropData.recommendations.map((rec: string, idx: number) => (
                <li key={idx} className="flex items-start text-white/80">
                  <span className="mr-2 text-teal-500">•</span>
                  {rec}
                </li>
              ))}
            </ul>
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
            className="text-teal-400 hover:text-teal-300"
          >
            Risk Assessments
          </button>
          <span className="text-white/60">/</span>
          <button 
            onClick={handleBackToFields}
            className="text-teal-400 hover:text-teal-300"
          >
            {selectedAssessment?.farmerName}
          </button>
        </div>
        
        <div>
          <h1 className="text-4xl font-bold text-white">
            Field Detail View: {fieldDetails.fieldId}
          </h1>
          <p className="text-white/70 mt-2">
            {fieldDetails.farmer} - {fieldDetails.cropType}
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className={`${dashboardTheme.card} border border-gray-800`}>
            <TabsTrigger 
              value="basic-info" 
              className="data-[state=active]:bg-gray-800 data-[state=active]:text-white text-white/70"
            >
              <FileSpreadsheet className="h-4 w-4 mr-2" />
              Basic Info
            </TabsTrigger>
            <TabsTrigger 
              value="weather" 
              className="data-[state=active]:bg-gray-800 data-[state=active]:text-white text-white/70"
            >
              <CloudRain className="h-4 w-4 mr-2" />
              Weather Analysis
            </TabsTrigger>
            <TabsTrigger 
              value="crop" 
              className="data-[state=active]:bg-gray-800 data-[state=active]:text-white text-white/70"
            >
              <Leaf className="h-4 w-4 mr-2" />
              Crop Analysis
            </TabsTrigger>
          </TabsList>

          <TabsContent value="basic-info" className="mt-6">
            <div className="grid gap-6 md:grid-cols-2">
              <Card className={`${dashboardTheme.card}`}>
                <CardHeader>
                  <CardTitle className="text-white">Field Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center border-b border-gray-800 pb-3">
                    <span className="text-white/70">Field ID</span>
                    <span className="text-white font-medium">{fieldDetails.fieldId}</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-gray-800 pb-3">
                    <span className="text-white/70">Field Name</span>
                    <span className="text-white font-medium">{fieldDetails.fieldName}</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-gray-800 pb-3">
                    <span className="text-white/70">Farmer</span>
                    <span className="text-white font-medium">{fieldDetails.farmer}</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-gray-800 pb-3">
                    <span className="text-white/70">Crop Type</span>
                    <div className="flex items-center gap-2">
                      <Leaf className="h-4 w-4 text-green-500" />
                      <span className="text-white font-medium">{fieldDetails.cropType}</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center border-b border-gray-800 pb-3">
                    <span className="text-white/70">Area</span>
                    <span className="text-white font-medium">{fieldDetails.area} hectares</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-gray-800 pb-3">
                    <span className="text-white/70">Season</span>
                    <span className="text-white font-medium">Season {fieldDetails.season}</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-gray-800 pb-3">
                    <span className="text-white/70">Sowing Date</span>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-teal-500" />
                      <span className="text-white font-medium">{fieldDetails.sowingDate}</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center pb-3">
                    <span className="text-white/70">Location</span>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-teal-500" />
                      <span className="text-white font-medium">{fieldDetails.location}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className={`${dashboardTheme.card}`}>
                <CardHeader>
                  <CardTitle className="text-white">Field Map</CardTitle>
                </CardHeader>
                <CardContent className="h-[500px] flex items-center justify-center bg-gray-900/50 rounded-lg border border-gray-800">
                  <div className="text-center">
                    <MapPin className="h-16 w-16 mx-auto mb-4 text-white/30" />
                    <p className="text-white/60 text-lg">Map Integration</p>
                    <p className="text-white/40 text-sm mt-2">Field boundary visualization</p>
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

  const renderDashboard = () => (
    <div className="space-y-6">
      {/* Action Bar */}
      <div className="flex items-center justify-end gap-4">
        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/60" />
            <Input
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`${dashboardTheme.input} pl-10 w-64 border-gray-700`}
            />
          </div>
          <Dialog open={filterDialogOpen} onOpenChange={setFilterDialogOpen}>
            <DialogTrigger asChild>
              <Button className={`${dashboardTheme.card} text-white hover:bg-gray-800 border border-gray-700`}>
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
            </DialogTrigger>
            <DialogContent className={`${dashboardTheme.card} border-gray-800`}>
              <DialogHeader>
                <DialogTitle className="text-white">Filter Risk Assessments</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                <div>
                  <Label htmlFor="status-filter" className="text-white/80">Status</Label>
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
                <div className="flex justify-between pt-4">
                  <Button 
                    variant="outline" 
                    onClick={clearFilters}
                    className="border-gray-700 text-white hover:bg-gray-800"
                  >
                    Clear Filters
                  </Button>
                  <Button 
                    onClick={() => setFilterDialogOpen(false)}
                    className="bg-teal-600 hover:bg-teal-700 text-white"
                  >
                    Apply Filters
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
          <Button 
            className="bg-teal-600 hover:bg-teal-700 text-white"
          >
            <Plus className="h-4 w-4 mr-2" />
            New Risk Assessment
          </Button>
        </div>
      </div>

      {/* Data Table */}
      <Card className={`${dashboardTheme.card}`}>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-800">
                  <th className="text-left py-4 px-6 font-medium text-white/80">Assessment ID</th>
                  <th className="text-left py-4 px-6 font-medium text-white/80">Farmer Name</th>
                  <th className="text-left py-4 px-6 font-medium text-white/80">Location</th>
                  <th className="text-left py-4 px-6 font-medium text-white/80">Status</th>
                  <th className="text-left py-4 px-6 font-medium text-white/80">Date</th>
                </tr>
              </thead>
              <tbody>
                {filteredAssessments.map((assessment, index) => (
                    <tr
                      key={assessment.id}
                      onClick={() => handleAssessmentClick(assessment)}
                      className={`border-b border-gray-800/50 hover:bg-gray-900/50 transition-colors cursor-pointer ${
                        index % 2 === 0 ? "bg-gray-950/30" : ""
                      }`}
                    >
                      <td className="py-4 px-6 text-white">{assessment.id}</td>
                      <td className="py-4 px-6 text-white">{assessment.farmerName}</td>
                      <td className="py-4 px-6 text-white/80">
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-teal-500" />
                          {assessment.location}
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-yellow-500/20 text-yellow-400 border border-yellow-500/30">
                          {assessment.status}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-white/80">{assessment.date}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  // Render view based on mode
  if (viewMode === "fieldSelection") {
    return renderFieldSelection();
  }

  if (viewMode === "fieldDetail") {
    return renderFieldDetail();
  }

  return renderDashboard();
}
