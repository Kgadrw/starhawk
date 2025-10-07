import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { dashboardTheme } from "@/utils/dashboardTheme";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { 
  MapPin,
  Calendar,
  User,
  Crop,
  AlertTriangle,
  Shield,
  BarChart3,
  Camera,
  FileText,
  Save,
  Send,
  Eye,
  Edit,
  Trash2,
  Plus,
  Search,
  Filter,
  Clock,
  CheckCircle,
  X,
  CloudRain,
  Sun,
  Wind,
  Thermometer,
  Droplets,
  Leaf,
  Bug,
  TrendingUp,
  TrendingDown,
  Activity,
  Satellite,
  Drone,
  Smartphone,
  Wifi,
  Battery,
  Signal,
  Navigation,
  Target,
  Zap,
  Globe,
  Layers,
  ArrowLeft
} from "lucide-react";

interface MonitoringSession {
  id: string;
  farmerId: string;
  farmerName: string;
  cropType: string;
  farmSize: number;
  location: string;
  monitorId: string;
  monitorName: string;
  status: "active" | "completed" | "scheduled" | "paused";
  startDate: string;
  endDate?: string;
  stage: "planting" | "germination" | "vegetative" | "flowering" | "fruiting" | "harvesting";
  progress: number;
  weatherData: {
    temperature: number;
    humidity: number;
    rainfall: number;
    windSpeed: number;
    uvIndex: number;
  };
  soilData: {
    moisture: number;
    ph: number;
    nutrients: {
      nitrogen: number;
      phosphorus: number;
      potassium: number;
    };
  };
  cropHealth: {
    overall: number;
    pestDamage: number;
    diseasePresence: number;
    growthRate: number;
  };
  alerts: Array<{
    id: string;
    type: "warning" | "critical" | "info";
    message: string;
    timestamp: string;
    resolved: boolean;
  }>;
  photos: string[];
  notes: string;
  gpsCoordinates: { lat: number; lng: number };
  lastUpdate: string;
}

interface WeatherForecast {
  date: string;
  temperature: { min: number; max: number };
  humidity: number;
  rainfall: number;
  windSpeed: number;
  conditions: string;
}

export default function CropMonitoringSystem() {
  const [sessions, setSessions] = useState<MonitoringSession[]>([
    {
      id: "MON-001",
      farmerId: "FMR-0247",
      farmerName: "Jean Baptiste",
      cropType: "Maize",
      farmSize: 2.5,
      location: "Nyagatare District",
      monitorId: "MON-001",
      monitorName: "Drone Pilot Alpha",
      status: "active",
      startDate: "2024-09-15",
      stage: "vegetative",
      progress: 65,
      weatherData: {
        temperature: 24,
        humidity: 68,
        rainfall: 0,
        windSpeed: 12,
        uvIndex: 7
      },
      soilData: {
        moisture: 45,
        ph: 6.8,
        nutrients: {
          nitrogen: 75,
          phosphorus: 60,
          potassium: 80
        }
      },
      cropHealth: {
        overall: 85,
        pestDamage: 15,
        diseasePresence: 5,
        growthRate: 90
      },
      alerts: [
        {
          id: "ALT-001",
          type: "warning",
          message: "Low soil moisture detected in sector 3",
          timestamp: "2024-10-05T10:30:00Z",
          resolved: false
        },
        {
          id: "ALT-002",
          type: "info",
          message: "Optimal growth conditions in sector 1",
          timestamp: "2024-10-05T09:15:00Z",
          resolved: true
        }
      ],
      photos: ["crop1.jpg", "crop2.jpg"],
      notes: "Crops showing good growth. Monitor soil moisture levels.",
      gpsCoordinates: { lat: -1.9441, lng: 30.0619 },
      lastUpdate: "2024-10-05T11:00:00Z"
    }
  ]);

  const [activeTab, setActiveTab] = useState("dashboard");
  const [selectedSession, setSelectedSession] = useState<MonitoringSession | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [stageFilter, setStageFilter] = useState("all");

  const [weatherForecast] = useState<WeatherForecast[]>([
    {
      date: "2024-10-06",
      temperature: { min: 18, max: 26 },
      humidity: 72,
      rainfall: 5,
      windSpeed: 8,
      conditions: "Partly Cloudy"
    },
    {
      date: "2024-10-07",
      temperature: { min: 16, max: 24 },
      humidity: 78,
      rainfall: 15,
      windSpeed: 10,
      conditions: "Light Rain"
    },
    {
      date: "2024-10-08",
      temperature: { min: 19, max: 27 },
      humidity: 65,
      rainfall: 0,
      windSpeed: 6,
      conditions: "Sunny"
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-100 text-green-800";
      case "completed": return "bg-blue-100 text-blue-800";
      case "scheduled": return "bg-yellow-100 text-yellow-800";
      case "paused": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active": return <Activity className="h-4 w-4" />;
      case "completed": return <CheckCircle className="h-4 w-4" />;
      case "scheduled": return <Clock className="h-4 w-4" />;
      case "paused": return <X className="h-4 w-4" />;
      default: return <Activity className="h-4 w-4" />;
    }
  };

  const getStageColor = (stage: string) => {
    switch (stage) {
      case "planting": return "bg-brown-100 text-brown-800";
      case "germination": return "bg-green-100 text-green-800";
      case "vegetative": return "bg-blue-100 text-blue-800";
      case "flowering": return "bg-purple-100 text-purple-800";
      case "fruiting": return "bg-orange-100 text-orange-800";
      case "harvesting": return "bg-yellow-100 text-yellow-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getAlertTypeColor = (type: string) => {
    switch (type) {
      case "critical": return "bg-red-100 text-red-800";
      case "warning": return "bg-yellow-100 text-yellow-800";
      case "info": return "bg-blue-100 text-blue-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const filteredSessions = sessions.filter(session => {
    const matchesSearch = session.farmerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         session.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         session.farmerId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || session.status === statusFilter;
    const matchesStage = stageFilter === "all" || session.stage === stageFilter;
    
    return matchesSearch && matchesStatus && matchesStage;
  });

  const renderDashboard = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Crop Monitoring Dashboard</h1>
          <p className="text-gray-600 mt-1">Real-time monitoring of crop health and field conditions</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          New Monitoring Session
        </Button>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-6 md:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Sessions</p>
                <p className="text-2xl font-bold text-gray-900">
                  {sessions.filter(s => s.status === 'active').length}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Activity className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Alerts</p>
                <p className="text-2xl font-bold text-gray-900">
                  {sessions.reduce((acc, s) => acc + s.alerts.filter(a => !a.resolved).length, 0)}
                </p>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg. Crop Health</p>
                <p className="text-2xl font-bold text-gray-900">
                  {Math.round(sessions.reduce((acc, s) => acc + s.cropHealth.overall, 0) / sessions.length)}%
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Leaf className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Fields Monitored</p>
                <p className="text-2xl font-bold text-gray-900">{sessions.length}</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Satellite className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Active Monitoring Sessions */}
      <Card>
        <CardHeader>
          <CardTitle>Active Monitoring Sessions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {sessions.filter(s => s.status === 'active').map((session) => (
              <div key={session.id} className="p-4 border rounded-lg hover:bg-gray-50">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                      <Activity className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-medium">{session.farmerName}</h3>
                      <p className="text-sm text-gray-500">{session.cropType} - {session.location}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Badge className={getStageColor(session.stage)}>
                      {session.stage}
                    </Badge>
                    <Badge className={getStatusColor(session.status)}>
                      {getStatusIcon(session.status)}
                      <span className="ml-1 capitalize">{session.status}</span>
                    </Badge>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-4 mb-3">
                  <div className="text-center">
                    <div className="flex items-center justify-center mb-1">
                      <Thermometer className="h-4 w-4 text-orange-500 mr-1" />
                      <span className="text-sm font-medium">{session.weatherData.temperature}°C</span>
                    </div>
                    <p className="text-xs text-gray-500">Temperature</p>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center mb-1">
                      <Droplets className="h-4 w-4 text-blue-500 mr-1" />
                      <span className="text-sm font-medium">{session.soilData.moisture}%</span>
                    </div>
                    <p className="text-xs text-gray-500">Soil Moisture</p>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center mb-1">
                      <Leaf className="h-4 w-4 text-green-500 mr-1" />
                      <span className="text-sm font-medium">{session.cropHealth.overall}%</span>
                    </div>
                    <p className="text-xs text-gray-500">Crop Health</p>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center mb-1">
                      <AlertTriangle className="h-4 w-4 text-red-500 mr-1" />
                      <span className="text-sm font-medium">
                        {session.alerts.filter(a => !a.resolved).length}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500">Active Alerts</p>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex-1 mr-4">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium">Growth Progress</span>
                      <span className="text-sm text-gray-500">{session.progress}%</span>
                    </div>
                    <Progress value={session.progress} className="h-2" />
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedSession(session)}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    View Details
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Weather Forecast */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <CloudRain className="h-5 w-5 mr-2" />
            Weather Forecast
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            {weatherForecast.map((forecast, index) => (
              <div key={index} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-medium">{forecast.date}</h3>
                  <Badge variant="outline">{forecast.conditions}</Badge>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Temperature</span>
                    <span className="text-sm font-medium">
                      {forecast.temperature.min}°C - {forecast.temperature.max}°C
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Humidity</span>
                    <span className="text-sm font-medium">{forecast.humidity}%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Rainfall</span>
                    <span className="text-sm font-medium">{forecast.rainfall}mm</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Wind Speed</span>
                    <span className="text-sm font-medium">{forecast.windSpeed} km/h</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderSessionDetails = () => {
    if (!selectedSession) return null;

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" onClick={() => setSelectedSession(null)}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Monitoring Session Details</h1>
              <p className="text-gray-600 mt-1">Session ID: {selectedSession.id}</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Badge className={getStatusColor(selectedSession.status)}>
              {getStatusIcon(selectedSession.status)}
              <span className="ml-1 capitalize">{selectedSession.status}</span>
            </Badge>
            <Button variant="outline">
              <Edit className="h-4 w-4 mr-2" />
              Edit Session
            </Button>
          </div>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="environmental">Environmental Data</TabsTrigger>
            <TabsTrigger value="crop-health">Crop Health</TabsTrigger>
            <TabsTrigger value="alerts">Alerts & Notes</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Session Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Farmer</Label>
                      <p className="text-sm text-gray-600">{selectedSession.farmerName}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Crop Type</Label>
                      <p className="text-sm text-gray-600">{selectedSession.cropType}</p>
                    </div>
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Farm Size</Label>
                      <p className="text-sm text-gray-600">{selectedSession.farmSize} hectares</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Location</Label>
                      <p className="text-sm text-gray-600">{selectedSession.location}</p>
                    </div>
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Current Stage</Label>
                      <Badge className={getStageColor(selectedSession.stage)}>
                        {selectedSession.stage}
                      </Badge>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Progress</Label>
                      <div className="flex items-center space-x-2">
                        <Progress value={selectedSession.progress} className="flex-1" />
                        <span className="text-sm font-medium">{selectedSession.progress}%</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Real-time Data</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Thermometer className="h-5 w-5 text-orange-500 mr-2" />
                        <span className="text-sm font-medium">Temperature</span>
                      </div>
                      <span className="text-lg font-bold">{selectedSession.weatherData.temperature}°C</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Droplets className="h-5 w-5 text-blue-500 mr-2" />
                        <span className="text-sm font-medium">Humidity</span>
                      </div>
                      <span className="text-lg font-bold">{selectedSession.weatherData.humidity}%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Leaf className="h-5 w-5 text-green-500 mr-2" />
                        <span className="text-sm font-medium">Soil Moisture</span>
                      </div>
                      <span className="text-lg font-bold">{selectedSession.soilData.moisture}%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Activity className="h-5 w-5 text-purple-500 mr-2" />
                        <span className="text-sm font-medium">Crop Health</span>
                      </div>
                      <span className="text-lg font-bold">{selectedSession.cropHealth.overall}%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="environmental" className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <CloudRain className="h-5 w-5 mr-2" />
                    Weather Conditions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Temperature</span>
                      <span className="font-bold">{selectedSession.weatherData.temperature}°C</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Humidity</span>
                      <span className="font-bold">{selectedSession.weatherData.humidity}%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Rainfall (24h)</span>
                      <span className="font-bold">{selectedSession.weatherData.rainfall}mm</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Wind Speed</span>
                      <span className="font-bold">{selectedSession.weatherData.windSpeed} km/h</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">UV Index</span>
                      <span className="font-bold">{selectedSession.weatherData.uvIndex}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Layers className="h-5 w-5 mr-2" />
                    Soil Conditions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Moisture Level</span>
                      <span className="font-bold">{selectedSession.soilData.moisture}%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">pH Level</span>
                      <span className="font-bold">{selectedSession.soilData.ph}</span>
                    </div>
                    <div className="space-y-2">
                      <span className="text-sm font-medium">Nutrient Levels</span>
                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-600">Nitrogen</span>
                          <span className="text-xs font-medium">{selectedSession.soilData.nutrients.nitrogen}%</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-600">Phosphorus</span>
                          <span className="text-xs font-medium">{selectedSession.soilData.nutrients.phosphorus}%</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-600">Potassium</span>
                          <span className="text-xs font-medium">{selectedSession.soilData.nutrients.potassium}%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="crop-health" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Leaf className="h-5 w-5 mr-2" />
                  Crop Health Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Overall Health</span>
                        <span className="font-bold">{selectedSession.cropHealth.overall}%</span>
                      </div>
                      <Progress value={selectedSession.cropHealth.overall} className="h-2" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Growth Rate</span>
                        <span className="font-bold">{selectedSession.cropHealth.growthRate}%</span>
                      </div>
                      <Progress value={selectedSession.cropHealth.growthRate} className="h-2" />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Pest Damage</span>
                        <span className="font-bold">{selectedSession.cropHealth.pestDamage}%</span>
                      </div>
                      <Progress value={selectedSession.cropHealth.pestDamage} className="h-2" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Disease Presence</span>
                        <span className="font-bold">{selectedSession.cropHealth.diseasePresence}%</span>
                      </div>
                      <Progress value={selectedSession.cropHealth.diseasePresence} className="h-2" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="alerts" className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <AlertTriangle className="h-5 w-5 mr-2" />
                    Active Alerts
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {selectedSession.alerts.filter(alert => !alert.resolved).map((alert) => (
                      <div key={alert.id} className="p-3 border rounded-lg">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              <Badge className={getAlertTypeColor(alert.type)}>
                                {alert.type}
                              </Badge>
                              <span className="text-xs text-gray-500">
                                {new Date(alert.timestamp).toLocaleString()}
                              </span>
                            </div>
                            <p className="text-sm">{alert.message}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <FileText className="h-5 w-5 mr-2" />
                    Session Notes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Textarea
                    value={selectedSession.notes}
                    readOnly
                    rows={6}
                    className="resize-none"
                  />
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {selectedSession ? renderSessionDetails() : renderDashboard()}
    </div>
  );
}
