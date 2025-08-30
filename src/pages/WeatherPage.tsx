import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/lib/useLanguage';
import { VoiceAssistant } from '@/components/VoiceAssistant';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Cloud, 
  CloudRain, 
  Sun, 
  Wind, 
  Thermometer, 
  Droplets, 
  Eye, 
  Gauge,
  AlertTriangle,
  Satellite,
  Navigation,
  MapPin,
  Calendar,
  Clock,
  TrendingUp,
  TrendingDown,
  Activity
} from 'lucide-react';

const translations = {
  en: {
    title: "Weather Intelligence",
    subtitle: "NASA Satellite Weather Data & Forecasts",
    currentWeather: "Current Conditions",
    forecast: "7-Day Forecast",
    alerts: "Weather Alerts",
    nasaData: "NASA Satellite Data",
    temperature: "Temperature",
    humidity: "Humidity",
    windSpeed: "Wind Speed",
    pressure: "Pressure",
    visibility: "Visibility",
    uvIndex: "UV Index",
    rainfall: "Rainfall",
    soilMoisture: "Soil Moisture",
    cloudCover: "Cloud Cover",
    dewPoint: "Dew Point",
    feelsLike: "Feels Like",
    sunrise: "Sunrise",
    sunset: "Sunset",
    moonPhase: "Moon Phase",
    high: "High",
    low: "Low",
    critical: "Critical",
    moderate: "Moderate",
    good: "Good",
    excellent: "Excellent",
    cycloneAlert: "Cyclone Alert",
    floodWarning: "Flood Warning",
    droughtAlert: "Drought Alert",
    heatWave: "Heat Wave",
    coldWave: "Cold Wave",
    recommendations: "Farming Recommendations",
    irrigationAdvice: "Irrigation Advice",
    sprayingConditions: "Spraying Conditions",
    harvestingAdvice: "Harvesting Advice",
    voiceHint: "Say 'weather update' or 'forecast' for voice guidance",
    location: "Location",
    lastUpdated: "Last Updated",
    dataSource: "Data Source",
    satelliteData: "Satellite Data",
    groundStations: "Ground Stations",
    weatherModels: "Weather Models"
  },
  hi: {
    title: "मौसम बुद्धिमत्ता",
    subtitle: "नासा उपग्रह मौसम डेटा और पूर्वानुमान",
    currentWeather: "वर्तमान स्थितियां",
    forecast: "7-दिन का पूर्वानुमान",
    alerts: "मौसम चेतावनी",
    nasaData: "नासा उपग्रह डेटा",
    temperature: "तापमान",
    humidity: "आर्द्रता",
    windSpeed: "हवा की गति",
    pressure: "दबाव",
    visibility: "दृश्यता",
    uvIndex: "यूवी सूचकांक",
    rainfall: "वर्षा",
    soilMoisture: "मिट्टी की नमी",
    cloudCover: "बादल आवरण",
    dewPoint: "ओस बिंदु",
    feelsLike: "महसूस होता है",
    sunrise: "सूर्योदय",
    sunset: "सूर्यास्त",
    moonPhase: "चांद की कला",
    high: "उच्च",
    low: "निम्न",
    critical: "गंभीर",
    moderate: "मध्यम",
    good: "अच्छा",
    excellent: "उत्कृष्ट",
    cycloneAlert: "चक्रवात चेतावनी",
    floodWarning: "बाढ़ चेतावनी",
    droughtAlert: "सूखा चेतावनी",
    heatWave: "गर्मी की लहर",
    coldWave: "ठंड की लहर",
    recommendations: "कृषि सिफारिशें",
    irrigationAdvice: "सिंचाई सलाह",
    sprayingConditions: "छिड़काव स्थितियां",
    harvestingAdvice: "कटाई सलाह",
    voiceHint: "आवाज़ गाइड के लिए 'मौसम अपडेट' या 'पूर्वानुमान' कहें",
    location: "स्थान",
    lastUpdated: "अंतिम अपडेट",
    dataSource: "डेटा स्रोत",
    satelliteData: "उपग्रह डेटा",
    groundStations: "भूमि स्टेशन",
    weatherModels: "मौसम मॉडल"
  },
  te: {
    title: "వాతావరణ మేధస్సు",
    subtitle: "నాసా ఉపగ్రహ వాతావరణ డేటా & అంచనాలు",
    currentWeather: "ప్రస్తుత పరిస్థితులు",
    forecast: "7-రోజుల అంచనా",
    alerts: "వాతావరణ హెచ్చరికలు",
    nasaData: "నాసా ఉపగ్రహ డేటా",
    temperature: "ఉష్ణోగ్రత",
    humidity: "తేమ",
    windSpeed: "గాలి వేగం",
    pressure: "ఒత్తిడి",
    visibility: "దృశ్యత",
    uvIndex: "యూవీ సూచిక",
    rainfall: "వర్షపాతం",
    soilMoisture: "మట్టి తేమ",
    cloudCover: "మేఘ కవరేజ్",
    dewPoint: "మంచు బిందు",
    feelsLike: "అనుభవం",
    sunrise: "సూర్యోదయం",
    sunset: "సూర్యాస్తమయం",
    moonPhase: "చంద్ర దశ",
    high: "అధిక",
    low: "తక్కువ",
    critical: "క్లిష్టమైన",
    moderate: "మధ్యస్థ",
    good: "మంచి",
    excellent: "అద్భుతమైన",
    cycloneAlert: "తుఫాను హెచ్చరిక",
    floodWarning: "వరద హెచ్చరిక",
    droughtAlert: "కరువు హెచ్చరిక",
    heatWave: "వేడిమి తరంగం",
    coldWave: "చల్లని తరంగం",
    recommendations: "వ్యవసాయ సిఫార్సులు",
    irrigationAdvice: "నీటిపారుదల సలహా",
    sprayingConditions: "స్ప్రే పరిస్థితులు",
    harvestingAdvice: "కోత సలహా",
    voiceHint: "వాయిస్ గైడన్స్ కోసం 'వాతావరణ అప్‌డేట్' లేదా 'అంచనా' అనండి",
    location: "స్థానం",
    lastUpdated: "చివరిగా అప్‌డేట్ చేయబడింది",
    dataSource: "డేటా మూలం",
    satelliteData: "ఉపగ్రహ డేటా",
    groundStations: "భూమి కేంద్రాలు",
    weatherModels: "వాతావరణ నమూనాలు"
  }
};

interface WeatherData {
  current: {
    temperature: number;
    feelsLike: number;
    humidity: number;
    windSpeed: number;
    pressure: number;
    visibility: number;
    uvIndex: number;
    cloudCover: number;
    dewPoint: number;
    condition: string;
    icon: string;
  };
  forecast: Array<{
    date: string;
    high: number;
    low: number;
    condition: string;
    icon: string;
    precipitation: number;
    windSpeed: number;
    humidity: number;
  }>;
  alerts: Array<{
    id: string;
    type: string;
    severity: 'low' | 'moderate' | 'high' | 'critical';
    title: string;
    description: string;
    validUntil: string;
  }>;
  nasaData: {
    soilMoisture: number;
    rainfall24h: number;
    rainfall48h: number;
    ndvi: number;
    surfaceTemperature: number;
    lastUpdated: string;
  };
  recommendations: {
    irrigation: string;
    spraying: string;
    harvesting: string;
    general: string[];
  };
}

export const WeatherPage: React.FC = () => {
  const { language } = useLanguage();
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedLocation, setSelectedLocation] = useState('Pune, Maharashtra');

  useEffect(() => {
    fetchWeatherData();
  }, [selectedLocation]);

  const fetchWeatherData = async () => {
    setLoading(true);
    // Simulate API call with realistic data
    setTimeout(() => {
      setWeatherData({
        current: {
          temperature: 28.5,
          feelsLike: 32.1,
          humidity: 65,
          windSpeed: 12.5,
          pressure: 1013.2,
          visibility: 10,
          uvIndex: 7,
          cloudCover: 45,
          dewPoint: 21.3,
          condition: 'Partly Cloudy',
          icon: 'partly-cloudy'
        },
        forecast: [
          { date: '2024-08-31', high: 30, low: 22, condition: 'Sunny', icon: 'sunny', precipitation: 0, windSpeed: 10, humidity: 60 },
          { date: '2024-09-01', high: 29, low: 21, condition: 'Partly Cloudy', icon: 'partly-cloudy', precipitation: 10, windSpeed: 15, humidity: 65 },
          { date: '2024-09-02', high: 27, low: 20, condition: 'Rainy', icon: 'rainy', precipitation: 85, windSpeed: 20, humidity: 80 },
          { date: '2024-09-03', high: 26, low: 19, condition: 'Thunderstorm', icon: 'thunderstorm', precipitation: 120, windSpeed: 25, humidity: 85 },
          { date: '2024-09-04', high: 28, low: 21, condition: 'Cloudy', icon: 'cloudy', precipitation: 20, windSpeed: 12, humidity: 70 },
          { date: '2024-09-05', high: 31, low: 23, condition: 'Sunny', icon: 'sunny', precipitation: 0, windSpeed: 8, humidity: 55 },
          { date: '2024-09-06', high: 32, low: 24, condition: 'Hot', icon: 'hot', precipitation: 0, windSpeed: 6, humidity: 50 }
        ],
        alerts: [
          {
            id: '1',
            type: 'thunderstorm',
            severity: 'high',
            title: 'Thunderstorm Warning',
            description: 'Severe thunderstorms expected with heavy rainfall (100-150mm) and strong winds (40-50 km/h) on September 3rd.',
            validUntil: '2024-09-04T06:00:00Z'
          },
          {
            id: '2',
            type: 'heat',
            severity: 'moderate',
            title: 'Heat Advisory',
            description: 'High temperatures expected (32-35°C) from September 5-6. Take precautions during outdoor activities.',
            validUntil: '2024-09-07T18:00:00Z'
          }
        ],
        nasaData: {
          soilMoisture: 45.2,
          rainfall24h: 12.5,
          rainfall48h: 28.7,
          ndvi: 0.72,
          surfaceTemperature: 29.8,
          lastUpdated: '2024-08-30T12:00:00Z'
        },
        recommendations: {
          irrigation: 'Delay irrigation by 2 days due to expected rainfall on September 2-3.',
          spraying: 'Avoid spraying on September 3rd due to thunderstorm conditions. Best time: September 1st morning.',
          harvesting: 'Complete harvesting of ready crops before September 2nd to avoid rain damage.',
          general: [
            'Monitor soil moisture levels closely',
            'Prepare drainage systems for heavy rainfall',
            'Store equipment safely during thunderstorm',
            'Apply potassium fertilizer during sunny periods'
          ]
        }
      });
      setLoading(false);
    }, 1500);
  };

  const handleVoiceCommand = (command: string) => {
    const lowerCommand = command.toLowerCase();
    if (lowerCommand.includes('weather') || lowerCommand.includes('forecast')) {
      // Voice feedback would be implemented here
      console.log('Weather update requested via voice');
    }
  };

  const getWeatherIcon = (condition: string) => {
    switch (condition.toLowerCase()) {
      case 'sunny': return <Sun className="w-8 h-8 text-yellow-500" />;
      case 'partly-cloudy': return <Cloud className="w-8 h-8 text-gray-500" />;
      case 'rainy': return <CloudRain className="w-8 h-8 text-blue-500" />;
      case 'thunderstorm': return <CloudRain className="w-8 h-8 text-purple-500" />;
      case 'cloudy': return <Cloud className="w-8 h-8 text-gray-600" />;
      default: return <Sun className="w-8 h-8 text-yellow-500" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 border-red-500 text-red-800';
      case 'high': return 'bg-orange-100 border-orange-500 text-orange-800';
      case 'moderate': return 'bg-yellow-100 border-yellow-500 text-yellow-800';
      case 'low': return 'bg-blue-100 border-blue-500 text-blue-800';
      default: return 'bg-gray-100 border-gray-500 text-gray-800';
    }
  };

  const tr = translations[language as keyof typeof translations];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-sky-50 to-cyan-50 flex items-center justify-center">
        <div className="text-center">
          <Satellite className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-lg font-medium">Loading NASA Weather Data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-sky-50 to-cyan-50 p-4">
      <VoiceAssistant onCommand={handleVoiceCommand} />
      
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-gray-900">{tr.title}</h1>
          <p className="text-gray-600">{tr.subtitle}</p>
          <p className="text-sm text-blue-600 italic">{tr.voiceHint}</p>
          
          <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
            <MapPin className="w-4 h-4" />
            <span>{selectedLocation}</span>
            <span>•</span>
            <Clock className="w-4 h-4" />
            <span>{tr.lastUpdated}: {new Date().toLocaleTimeString()}</span>
          </div>
        </div>

        {/* Weather Alerts */}
        {weatherData?.alerts && weatherData.alerts.length > 0 && (
          <div className="space-y-3">
            <h2 className="text-xl font-semibold flex items-center">
              <AlertTriangle className="w-5 h-5 mr-2 text-orange-500" />
              {tr.alerts}
            </h2>
            {weatherData.alerts.map((alert) => (
              <Alert key={alert.id} className={getSeverityColor(alert.severity)}>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <strong>{alert.title}</strong>
                      <Badge variant="outline" className="text-xs">
                        {alert.severity.toUpperCase()}
                      </Badge>
                    </div>
                    <p className="text-sm">{alert.description}</p>
                    <p className="text-xs opacity-75">
                      Valid until: {new Date(alert.validUntil).toLocaleString()}
                    </p>
                  </div>
                </AlertDescription>
              </Alert>
            ))}
          </div>
        )}

        {/* Current Weather */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Thermometer className="w-5 h-5 mr-2" />
              {tr.currentWeather}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center">
                {getWeatherIcon(weatherData?.current.condition || 'sunny')}
                <div className="mt-2">
                  <div className="text-3xl font-bold">{weatherData?.current.temperature}°C</div>
                  <div className="text-sm text-gray-500">{tr.feelsLike}: {weatherData?.current.feelsLike}°C</div>
                  <div className="text-sm font-medium">{weatherData?.current.condition}</div>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="flex items-center text-sm">
                    <Droplets className="w-4 h-4 mr-1" />
                    {tr.humidity}
                  </span>
                  <span className="font-medium">{weatherData?.current.humidity}%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center text-sm">
                    <Wind className="w-4 h-4 mr-1" />
                    {tr.windSpeed}
                  </span>
                  <span className="font-medium">{weatherData?.current.windSpeed} km/h</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center text-sm">
                    <Gauge className="w-4 h-4 mr-1" />
                    {tr.pressure}
                  </span>
                  <span className="font-medium">{weatherData?.current.pressure} hPa</span>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="flex items-center text-sm">
                    <Eye className="w-4 h-4 mr-1" />
                    {tr.visibility}
                  </span>
                  <span className="font-medium">{weatherData?.current.visibility} km</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">{tr.uvIndex}</span>
                  <span className="font-medium">{weatherData?.current.uvIndex}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">{tr.cloudCover}</span>
                  <span className="font-medium">{weatherData?.current.cloudCover}%</span>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <Satellite className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                  <div className="text-sm font-medium text-blue-800">{tr.nasaData}</div>
                  <div className="text-xs text-blue-600 mt-1">MODIS • SMAP • GPM</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* NASA Satellite Data */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Satellite className="w-5 h-5 mr-2" />
              {tr.satelliteData}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-700">{weatherData?.nasaData.soilMoisture}%</div>
                <div className="text-sm text-green-600">{tr.soilMoisture}</div>
                <div className="text-xs text-gray-500 mt-1">SMAP</div>
              </div>
              
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-700">{weatherData?.nasaData.rainfall24h}mm</div>
                <div className="text-sm text-blue-600">24h {tr.rainfall}</div>
                <div className="text-xs text-gray-500 mt-1">GPM</div>
              </div>
              
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-700">{weatherData?.nasaData.rainfall48h}mm</div>
                <div className="text-sm text-purple-600">48h {tr.rainfall}</div>
                <div className="text-xs text-gray-500 mt-1">GPM</div>
              </div>
              
              <div className="text-center p-4 bg-emerald-50 rounded-lg">
                <div className="text-2xl font-bold text-emerald-700">{weatherData?.nasaData.ndvi}</div>
                <div className="text-sm text-emerald-600">NDVI</div>
                <div className="text-xs text-gray-500 mt-1">MODIS</div>
              </div>
              
              <div className="text-center p-4 bg-orange-50 rounded-lg">
                <div className="text-2xl font-bold text-orange-700">{weatherData?.nasaData.surfaceTemperature}°C</div>
                <div className="text-sm text-orange-600">Surface Temp</div>
                <div className="text-xs text-gray-500 mt-1">LANDSAT</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 7-Day Forecast */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="w-5 h-5 mr-2" />
              {tr.forecast}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
              {weatherData?.forecast.map((day, index) => (
                <div key={index} className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-sm font-medium mb-2">
                    {new Date(day.date).toLocaleDateString('en', { weekday: 'short' })}
                  </div>
                  {getWeatherIcon(day.icon)}
                  <div className="mt-2 space-y-1">
                    <div className="flex items-center justify-center space-x-2">
                      <span className="text-sm font-bold">{day.high}°</span>
                      <span className="text-sm text-gray-500">{day.low}°</span>
                    </div>
                    <div className="text-xs text-blue-600">{day.precipitation}mm</div>
                    <div className="text-xs text-gray-500">{day.windSpeed} km/h</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Farming Recommendations */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Activity className="w-5 h-5 mr-2" />
              {tr.recommendations}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-3">
                <h3 className="font-semibold text-blue-700">{tr.irrigationAdvice}</h3>
                <p className="text-sm text-gray-700">{weatherData?.recommendations.irrigation}</p>
              </div>
              
              <div className="space-y-3">
                <h3 className="font-semibold text-green-700">{tr.sprayingConditions}</h3>
                <p className="text-sm text-gray-700">{weatherData?.recommendations.spraying}</p>
              </div>
              
              <div className="space-y-3">
                <h3 className="font-semibold text-orange-700">{tr.harvestingAdvice}</h3>
                <p className="text-sm text-gray-700">{weatherData?.recommendations.harvesting}</p>
              </div>
            </div>
            
            <div className="mt-6">
              <h3 className="font-semibold text-gray-800 mb-3">General Recommendations</h3>
              <ul className="space-y-2">
                {weatherData?.recommendations.general.map((rec, index) => (
                  <li key={index} className="flex items-start">
                    <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    <span className="text-sm text-gray-700">{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};