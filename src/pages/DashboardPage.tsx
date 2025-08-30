import React, { useState, useEffect } from 'react';
import { useAuth } from '@/lib/useAuth';
import { useLanguage } from '@/lib/useLanguage';
import { VoiceAssistant } from '@/components/VoiceAssistant';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Satellite, 
  Camera, 
  CloudRain, 
  Thermometer, 
  Droplets, 
  Leaf, 
  AlertTriangle, 
  TrendingUp, 
  Phone, 
  Calendar,
  MapPin,
  Sprout,
  Sun,
  Wind,
  Eye,
  Bell,
  BarChart3,
  Users
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const translations = {
  en: {
    title: "Farm Dashboard",
    welcome: "Welcome back",
    quickActions: "Quick Actions",
    scanCrop: "Scan Crop",
    checkWeather: "Check Weather",
    nasaData: "NASA Data",
    expertAdvice: "Expert Advice",
    cropHealth: "Crop Health Overview",
    weatherAlerts: "Weather Alerts",
    recentScans: "Recent Crop Scans",
    farmStats: "Farm Statistics",
    ndviScore: "NDVI Health Score",
    soilMoisture: "Soil Moisture",
    temperature: "Temperature",
    rainfall: "48H Rainfall",
    excellent: "Excellent",
    good: "Good",
    moderate: "Moderate",
    poor: "Poor",
    high: "High",
    medium: "Medium",
    low: "Low",
    critical: "Critical",
    viewDetails: "View Details",
    noAlerts: "No active weather alerts",
    noScans: "No recent scans available",
    totalFields: "Total Fields",
    activeCrops: "Active Crops",
    lastScan: "Last Scan",
    healthTrend: "Health Trend",
    voiceHint: "Say commands like 'scan crop', 'weather', or 'NASA data'",
    cycloneWarning: "Cyclone approaching in 48 hours",
    droughtAlert: "Low soil moisture detected",
    floodWarning: "Heavy rainfall expected",
    diseaseAlert: "Disease risk detected in tomato field",
    recommendations: "AI Recommendations",
    govAdvisory: "Government Advisory",
    kisanCenter: "Kisan Call Center: 1800-180-1551"
  },
  hi: {
    title: "फार्म डैशबोर्ड",
    welcome: "वापसी पर स्वागत है",
    quickActions: "त्वरित कार्य",
    scanCrop: "फसल स्कैन करें",
    checkWeather: "मौसम जांचें",
    nasaData: "नासा डेटा",
    expertAdvice: "विशेषज्ञ सलाह",
    cropHealth: "फसल स्वास्थ्य अवलोकन",
    weatherAlerts: "मौसम चेतावनी",
    recentScans: "हाल की फसल स्कैन",
    farmStats: "फार्म आंकड़े",
    ndviScore: "NDVI स्वास्थ्य स्कोर",
    soilMoisture: "मिट्टी की नमी",
    temperature: "तापमान",
    rainfall: "48 घंटे बारिश",
    excellent: "उत्कृष्ट",
    good: "अच्छा",
    moderate: "मध्यम",
    poor: "खराब",
    high: "उच्च",
    medium: "मध्यम",
    low: "कम",
    critical: "गंभीर",
    viewDetails: "विवरण देखें",
    noAlerts: "कोई सक्रिय मौसम चेतावनी नहीं",
    noScans: "कोई हाल की स्कैन उपलब्ध नहीं",
    totalFields: "कुल खेत",
    activeCrops: "सक्रिय फसलें",
    lastScan: "अंतिम स्कैन",
    healthTrend: "स्वास्थ्य प्रवृत्ति",
    voiceHint: "'फसल स्कैन', 'मौसम', या 'नासा डेटा' जैसे कमांड कहें",
    cycloneWarning: "48 घंटों में चक्रवात आ रहा है",
    droughtAlert: "कम मिट्टी की नमी का पता चला",
    floodWarning: "भारी बारिश की उम्मीद",
    diseaseAlert: "टमाटर के खेत में बीमारी का खतरा",
    recommendations: "AI सिफारिशें",
    govAdvisory: "सरकारी सलाह",
    kisanCenter: "किसान कॉल सेंटर: 1800-180-1551"
  },
  te: {
    title: "వ్యవసాయ డ్యాష్‌బోర్డ్",
    welcome: "తిరిగి స్వాగతం",
    quickActions: "త్వరిత చర్యలు",
    scanCrop: "పంట స్కాన్ చేయండి",
    checkWeather: "వాతావరణం తనిఖీ చేయండి",
    nasaData: "నాసా డేటా",
    expertAdvice: "నిపుణుల సలహా",
    cropHealth: "పంట ఆరోగ్య అవలోకనం",
    weatherAlerts: "వాతావరణ హెచ్చరికలు",
    recentScans: "ఇటీవలి పంట స్కాన్‌లు",
    farmStats: "వ్యవసాయ గణాంకాలు",
    ndviScore: "NDVI ఆరోగ్య స్కోర్",
    soilMoisture: "మట్టి తేమ",
    temperature: "ఉష్ణోగ్రత",
    rainfall: "48 గంటల వర్షపాతం",
    excellent: "అద్భుతమైన",
    good: "మంచి",
    moderate: "మధ్యస్థ",
    poor: "పేలవమైన",
    high: "అధిక",
    medium: "మధ్యస్థ",
    low: "తక్కువ",
    critical: "క్లిష్టమైన",
    viewDetails: "వివరాలు చూడండి",
    noAlerts: "చురుకైన వాతావరణ హెచ్చరికలు లేవు",
    noScans: "ఇటీవలి స్కాన్‌లు అందుబాటులో లేవు",
    totalFields: "మొత్తం పొలాలు",
    activeCrops: "చురుకైన పంటలు",
    lastScan: "చివరి స్కాన్",
    healthTrend: "ఆరోగ్య ధోరణి",
    voiceHint: "'పంట స్కాన్', 'వాతావరణం', లేదా 'నాసా డేటా' వంటి కమాండ్‌లు చెప్పండి",
    cycloneWarning: "48 గంటల్లో తుఫాను వస్తోంది",
    droughtAlert: "తక్కువ మట్టి తేమ గుర్తించబడింది",
    floodWarning: "భారీ వర్షాలు అంచనా",
    diseaseAlert: "టమాటో పొలంలో వ్యాధి ప్రమాదం గుర్తించబడింది",
    recommendations: "AI సిఫార్సులు",
    govAdvisory: "ప్రభుత్వ సలహా",
    kisanCenter: "కిసాన్ కాల్ సెంటర్: 1800-180-1551"
  }
};

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const { language } = useLanguage();
  const navigate = useNavigate();
  const [nasaData, setNasaData] = useState({
    ndvi: 0.72,
    soilMoisture: 45,
    temperature: 28.5,
    rainfall: 125
  });
  const [weatherAlerts, setWeatherAlerts] = useState([
    {
      id: 1,
      type: 'cyclone',
      severity: 'high',
      title: 'Cyclone MICHAUNG',
      description: 'Severe cyclone approaching coast',
      validUntil: '2024-12-08T18:00:00Z'
    },
    {
      id: 2,
      type: 'drought',
      severity: 'medium',
      title: 'Soil Moisture Alert',
      description: 'Below optimal levels in north field',
      validUntil: '2024-12-10T12:00:00Z'
    }
  ]);
  const [recentScans, setRecentScans] = useState([
    {
      id: 1,
      crop: 'Tomato',
      healthScore: 78,
      scanDate: '2024-12-05T10:30:00Z',
      diseases: ['Early Blight'],
      confidence: 89
    },
    {
      id: 2,
      crop: 'Rice',
      healthScore: 92,
      scanDate: '2024-12-04T15:45:00Z',
      diseases: [],
      confidence: 95
    }
  ]);

  const tr = translations[language as keyof typeof translations];

  const handleVoiceCommand = (command: string) => {
    const lowerCommand = command.toLowerCase();
    if (lowerCommand.includes('scan') || lowerCommand.includes('crop')) {
      navigate('/scan');
    } else if (lowerCommand.includes('weather')) {
      navigate('/weather');
    } else if (lowerCommand.includes('nasa') || lowerCommand.includes('satellite')) {
      navigate('/nasa-data');
    } else if (lowerCommand.includes('expert') || lowerCommand.includes('advice')) {
      navigate('/expert-advice');
    }
  };

  const getHealthStatus = (score: number) => {
    if (score >= 80) return { label: tr.excellent, color: 'bg-green-500' };
    if (score >= 60) return { label: tr.good, color: 'bg-blue-500' };
    if (score >= 40) return { label: tr.moderate, color: 'bg-yellow-500' };
    return { label: tr.poor, color: 'bg-red-500' };
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'destructive';
      case 'medium': return 'default';
      case 'low': return 'secondary';
      default: return 'default';
    }
  };

  const getNDVIStatus = (ndvi: number) => {
    if (ndvi > 0.6) return { label: tr.excellent, color: 'text-green-600' };
    if (ndvi > 0.4) return { label: tr.good, color: 'text-blue-600' };
    if (ndvi > 0.2) return { label: tr.moderate, color: 'text-yellow-600' };
    return { label: tr.poor, color: 'text-red-600' };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-emerald-50 p-4">
      <VoiceAssistant onCommand={handleVoiceCommand} />
      
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{tr.title}</h1>
            <p className="text-gray-600">{tr.welcome}, {user?.user_metadata?.full_name || 'Farmer'}</p>
            <p className="text-sm text-blue-600 italic">{tr.voiceHint}</p>
          </div>
          <div className="flex items-center space-x-2">
            <MapPin className="w-4 h-4 text-gray-500" />
            <span className="text-sm text-gray-600">{user?.user_metadata?.location || 'Location'}</span>
          </div>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Sprout className="w-5 h-5 mr-2" />
              {tr.quickActions}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Button 
                onClick={() => navigate('/scan')} 
                className="h-20 flex flex-col items-center justify-center space-y-2"
              >
                <Camera className="w-6 h-6" />
                <span className="text-sm">{tr.scanCrop}</span>
              </Button>
              <Button 
                onClick={() => navigate('/weather')} 
                variant="outline"
                className="h-20 flex flex-col items-center justify-center space-y-2"
              >
                <CloudRain className="w-6 h-6" />
                <span className="text-sm">{tr.checkWeather}</span>
              </Button>
              <Button 
                onClick={() => navigate('/nasa-data')} 
                variant="outline"
                className="h-20 flex flex-col items-center justify-center space-y-2"
              >
                <Satellite className="w-6 h-6" />
                <span className="text-sm">{tr.nasaData}</span>
              </Button>
              <Button 
                onClick={() => navigate('/expert-advice')} 
                variant="outline"
                className="h-20 flex flex-col items-center justify-center space-y-2"
              >
                <Phone className="w-6 h-6" />
                <span className="text-sm">{tr.expertAdvice}</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Farm Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{tr.totalFields}</p>
                  <p className="text-2xl font-bold">3</p>
                </div>
                <MapPin className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{tr.activeCrops}</p>
                  <p className="text-2xl font-bold">5</p>
                </div>
                <Leaf className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{tr.lastScan}</p>
                  <p className="text-2xl font-bold">2d</p>
                </div>
                <Camera className="w-8 h-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{tr.healthTrend}</p>
                  <p className="text-2xl font-bold text-green-600">↗ +12%</p>
                </div>
                <TrendingUp className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Crop Health Overview */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Leaf className="w-5 h-5 mr-2" />
                  {tr.cropHealth}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="flex items-center justify-center mb-2">
                      <Eye className="w-6 h-6 text-green-600" />
                    </div>
                    <p className="text-sm text-gray-600">{tr.ndviScore}</p>
                    <p className={`text-lg font-bold ${getNDVIStatus(nasaData.ndvi).color}`}>
                      {(nasaData.ndvi * 100).toFixed(0)}%
                    </p>
                    <p className={`text-xs ${getNDVIStatus(nasaData.ndvi).color}`}>
                      {getNDVIStatus(nasaData.ndvi).label}
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center mb-2">
                      <Droplets className="w-6 h-6 text-blue-600" />
                    </div>
                    <p className="text-sm text-gray-600">{tr.soilMoisture}</p>
                    <p className="text-lg font-bold">{nasaData.soilMoisture}%</p>
                    <Progress value={nasaData.soilMoisture} className="w-full h-2 mt-1" />
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center mb-2">
                      <Thermometer className="w-6 h-6 text-orange-600" />
                    </div>
                    <p className="text-sm text-gray-600">{tr.temperature}</p>
                    <p className="text-lg font-bold">{nasaData.temperature}°C</p>
                    <p className="text-xs text-gray-500">Optimal</p>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center mb-2">
                      <CloudRain className="w-6 h-6 text-purple-600" />
                    </div>
                    <p className="text-sm text-gray-600">{tr.rainfall}</p>
                    <p className="text-lg font-bold">{nasaData.rainfall}mm</p>
                    <Badge variant="secondary" className="text-xs">{tr.high}</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Scans */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Camera className="w-5 h-5 mr-2" />
                  {tr.recentScans}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {recentScans.length > 0 ? (
                  <div className="space-y-4">
                    {recentScans.map((scan) => {
                      const healthStatus = getHealthStatus(scan.healthScore);
                      return (
                        <div key={scan.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center space-x-4">
                            <div className={`w-3 h-3 rounded-full ${healthStatus.color}`}></div>
                            <div>
                              <p className="font-medium">{scan.crop}</p>
                              <p className="text-sm text-gray-600">
                                {new Date(scan.scanDate).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-bold">{scan.healthScore}%</p>
                            <p className="text-xs text-gray-500">{scan.confidence}% confidence</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-8">{tr.noScans}</p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Weather Alerts & Recommendations */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <AlertTriangle className="w-5 h-5 mr-2" />
                  {tr.weatherAlerts}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {weatherAlerts.length > 0 ? (
                  <div className="space-y-3">
                    {weatherAlerts.map((alert) => (
                      <Alert key={alert.id} variant={getSeverityColor(alert.severity) as any}>
                        <AlertTriangle className="h-4 w-4" />
                        <AlertDescription>
                          <div className="space-y-1">
                            <p className="font-medium">{alert.title}</p>
                            <p className="text-sm">{alert.description}</p>
                            <Badge variant="outline" size="sm">
                              {alert.severity.toUpperCase()}
                            </Badge>
                          </div>
                        </AlertDescription>
                      </Alert>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-4">{tr.noAlerts}</p>
                )}
              </CardContent>
            </Card>

            {/* AI Recommendations */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart3 className="w-5 h-5 mr-2" />
                  {tr.recommendations}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm font-medium text-blue-800">Irrigation Timing</p>
                    <p className="text-xs text-blue-600">Delay watering by 2 days due to high soil moisture</p>
                  </div>
                  <div className="p-3 bg-green-50 rounded-lg">
                    <p className="text-sm font-medium text-green-800">Fertilizer Application</p>
                    <p className="text-xs text-green-600">Apply potassium fertilizer for tomato flowering</p>
                  </div>
                  <div className="p-3 bg-yellow-50 rounded-lg">
                    <p className="text-sm font-medium text-yellow-800">Disease Prevention</p>
                    <p className="text-xs text-yellow-600">Monitor for early blight symptoms in humid conditions</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Government Advisory */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="w-5 h-5 mr-2" />
                  {tr.govAdvisory}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Phone className="w-4 h-4 text-green-600" />
                    <p className="text-sm">{tr.kisanCenter}</p>
                  </div>
                  <Button variant="outline" size="sm" className="w-full">
                    <Calendar className="w-4 h-4 mr-2" />
                    Book KVK Session
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};