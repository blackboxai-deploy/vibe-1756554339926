import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/lib/useLanguage';
import { VoiceAssistant } from '@/components/VoiceAssistant';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Satellite, 
  Thermometer, 
  Droplets, 
  Cloud, 
  Layers, 
  TrendingUp, 
  TrendingDown,
  MapPin,
  Calendar,
  Zap,
  Eye,
  RefreshCw,
  Download,
  Share2
} from 'lucide-react';

const translations = {
  en: {
    title: "NASA Satellite Data",
    subtitle: "Real-time agricultural monitoring from space",
    ndvi: "Vegetation Health (NDVI)",
    soilMoisture: "Soil Moisture",
    temperature: "Land Temperature",
    precipitation: "Precipitation",
    excellent: "Excellent",
    good: "Good",
    moderate: "Moderate",
    poor: "Poor",
    high: "High",
    medium: "Medium",
    low: "Low",
    lastUpdated: "Last Updated",
    dataSource: "Data Source",
    confidence: "Confidence",
    trend: "Trend",
    increasing: "Increasing",
    decreasing: "Decreasing",
    stable: "Stable",
    fieldAnalysis: "Field Analysis",
    recommendations: "Recommendations",
    alerts: "Satellite Alerts",
    refresh: "Refresh Data",
    download: "Download Report",
    share: "Share Data",
    voiceHint: "Say 'refresh data' or 'show recommendations'",
    modisData: "MODIS Vegetation",
    smapData: "SMAP Soil Moisture",
    gpmData: "GPM Precipitation",
    landsatData: "Landsat Thermal",
    healthyVegetation: "Healthy vegetation detected across 85% of monitored area",
    optimalMoisture: "Soil moisture levels optimal for current crop stage",
    temperatureNormal: "Land surface temperature within normal range",
    noExtremeWeather: "No extreme weather events detected in next 48 hours",
    irrigationAdvice: "Reduce irrigation by 20% - soil moisture sufficient",
    fertilizerTiming: "Optimal time for nitrogen application based on vegetation index",
    harvestWindow: "Harvest window opens in 12-15 days based on crop maturity",
    weatherPrep: "Prepare for light rainfall in next 24-48 hours"
  },
  hi: {
    title: "नासा उपग्रह डेटा",
    subtitle: "अंतरिक्ष से वास्तविक समय कृषि निगरानी",
    ndvi: "वनस्पति स्वास्थ्य (NDVI)",
    soilMoisture: "मिट्टी की नमी",
    temperature: "भूमि तापमान",
    precipitation: "वर्षा",
    excellent: "उत्कृष्ट",
    good: "अच्छा",
    moderate: "मध्यम",
    poor: "खराब",
    high: "उच्च",
    medium: "मध्यम",
    low: "कम",
    lastUpdated: "अंतिम अपडेट",
    dataSource: "डेटा स्रोत",
    confidence: "विश्वसनीयता",
    trend: "रुझान",
    increasing: "बढ़ रहा",
    decreasing: "घट रहा",
    stable: "स्थिर",
    fieldAnalysis: "खेत विश्लेषण",
    recommendations: "सुझाव",
    alerts: "उपग्रह अलर्ट",
    refresh: "डेटा रीफ्रेश करें",
    download: "रिपोर्ट डाउनलोड करें",
    share: "डेटा साझा करें",
    voiceHint: "'डेटा रीफ्रेश करें' या 'सुझाव दिखाएं' कहें",
    modisData: "MODIS वनस्पति",
    smapData: "SMAP मिट्टी नमी",
    gpmData: "GPM वर्षा",
    landsatData: "Landsat थर्मल",
    healthyVegetation: "निगरानी क्षेत्र के 85% में स्वस्थ वनस्पति का पता चला",
    optimalMoisture: "वर्तमान फसल चरण के लिए मिट्टी की नमी का स्तर अनुकूल",
    temperatureNormal: "भूमि सतह का तापमान सामान्य सीमा में",
    noExtremeWeather: "अगले 48 घंटों में कोई चरम मौसम घटना का पता नहीं चला",
    irrigationAdvice: "सिंचाई 20% कम करें - मिट्टी की नमी पर्याप्त है",
    fertilizerTiming: "वनस्पति सूचकांक के आधार पर नाइट्रोजन के लिए अनुकूल समय",
    harvestWindow: "फसल परिपक्वता के आधार पर 12-15 दिनों में कटाई की खिड़की खुलती है",
    weatherPrep: "अगले 24-48 घंटों में हल्की बारिश की तैयारी करें"
  },
  te: {
    title: "నాసా ఉపగ్రహ డేటా",
    subtitle: "అంతరిక్షం నుండి రియల్-టైమ్ వ్యవసాయ పర్యవేక్షణ",
    ndvi: "వృక్షసంపద ఆరోగ్యం (NDVI)",
    soilMoisture: "మట్టి తేమ",
    temperature: "భూమి ఉష్ణోగ్రత",
    precipitation: "వర్షపాతం",
    excellent: "అద్భుతమైన",
    good: "మంచి",
    moderate: "మధ్యస్థ",
    poor: "దయనీయ",
    high: "అధిక",
    medium: "మధ్యస్థ",
    low: "తక్కువ",
    lastUpdated: "చివరిసారి నవీకరించబడింది",
    dataSource: "డేటా మూలం",
    confidence: "విశ్వసనీయత",
    trend: "ధోరణి",
    increasing: "పెరుగుతోంది",
    decreasing: "తగ్గుతోంది",
    stable: "స్థిరంగా",
    fieldAnalysis: "పొలం విశ్లేషణ",
    recommendations: "సిఫార్సులు",
    alerts: "ఉపగ్రహ హెచ్చరికలు",
    refresh: "డేటాను రిఫ్రెష్ చేయండి",
    download: "రిపోర్ట్ డౌన్‌లోడ్ చేయండి",
    share: "డేటాను పంచుకోండి",
    voiceHint: "'డేటా రిఫ్రెష్ చేయండి' లేదా 'సిఫార్సులు చూపించండి' అనండి",
    modisData: "MODIS వృక్షసంపద",
    smapData: "SMAP మట్టి తేమ",
    gpmData: "GPM వర్షపాతం",
    landsatData: "Landsat థర్మల్",
    healthyVegetation: "పర్యవేక్షణ ప్రాంతంలో 85% వరకు ఆరోగ్యకరమైన వృక్షసంపద గుర్తించబడింది",
    optimalMoisture: "ప్రస్తుత పంట దశకు మట్టి తేమ స్థాయిలు అనుకూలంగా ఉన్నాయి",
    temperatureNormal: "భూమి ఉపరితల ఉష్ణోగ్రత సాధారణ పరిధిలో ఉంది",
    noExtremeWeather: "రాబోయే 48 గంటల్లో తీవ్ర వాతావరణ సంఘటనలు గుర్తించబడలేదు",
    irrigationAdvice: "నీటిపారుదల 20% తగ్గించండి - మట్టి తేమ సరిపోతుంది",
    fertilizerTiming: "వృక్షసంపద సూచిక ఆధారంగా నత్రజని వేయడానికి అనుకూల సమయం",
    harvestWindow: "పంట పరిపక్వత ఆధారంగా 12-15 రోజుల్లో కోత కిటికీ తెరుచుకుంటుంది",
    weatherPrep: "రాబోయే 24-48 గంటల్లో తేలికపాటి వర్షానికి సిద్ధం అవ్వండి"
  }
};

interface SatelliteData {
  type: string;
  value: number;
  unit: string;
  status: 'excellent' | 'good' | 'moderate' | 'poor';
  trend: 'increasing' | 'decreasing' | 'stable';
  confidence: number;
  lastUpdated: string;
  source: string;
}

export const NASADataPage: React.FC = () => {
  const { language } = useLanguage();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTab, setSelectedTab] = useState('overview');
  const [satelliteData, setSatelliteData] = useState<SatelliteData[]>([
    {
      type: 'ndvi',
      value: 0.75,
      unit: 'index',
      status: 'excellent',
      trend: 'increasing',
      confidence: 92,
      lastUpdated: '2024-08-30T10:30:00Z',
      source: 'MODIS Terra'
    },
    {
      type: 'soilMoisture',
      value: 45,
      unit: '%',
      status: 'good',
      trend: 'stable',
      confidence: 88,
      lastUpdated: '2024-08-30T08:15:00Z',
      source: 'SMAP'
    },
    {
      type: 'temperature',
      value: 28.5,
      unit: '°C',
      status: 'good',
      trend: 'stable',
      confidence: 95,
      lastUpdated: '2024-08-30T12:00:00Z',
      source: 'Landsat 8'
    },
    {
      type: 'precipitation',
      value: 125,
      unit: 'mm',
      status: 'high',
      trend: 'increasing',
      confidence: 85,
      lastUpdated: '2024-08-30T11:45:00Z',
      source: 'GPM'
    }
  ]);

  const tr = translations[language as keyof typeof translations];

  const handleVoiceCommand = (command: string) => {
    const lowerCommand = command.toLowerCase();
    if (lowerCommand.includes('refresh') || lowerCommand.includes('update')) {
      handleRefreshData();
    } else if (lowerCommand.includes('recommendation') || lowerCommand.includes('advice')) {
      setSelectedTab('recommendations');
    } else if (lowerCommand.includes('alert') || lowerCommand.includes('warning')) {
      setSelectedTab('alerts');
    }
  };

  const handleRefreshData = async () => {
    setIsLoading(true);
    // Simulate API call to NASA services
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Update data with slight variations
    setSatelliteData(prev => prev.map(item => ({
      ...item,
      value: item.value + (Math.random() - 0.5) * 0.1 * item.value,
      lastUpdated: new Date().toISOString(),
      confidence: Math.max(80, Math.min(98, item.confidence + (Math.random() - 0.5) * 10))
    })));
    
    setIsLoading(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent': return 'bg-green-500';
      case 'good': return 'bg-blue-500';
      case 'moderate': return 'bg-yellow-500';
      case 'poor': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      default: return 'bg-gray-500';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'increasing': return <TrendingUp className="w-4 h-4 text-green-600" />;
      case 'decreasing': return <TrendingDown className="w-4 h-4 text-red-600" />;
      default: return <div className="w-4 h-4 bg-gray-400 rounded-full" />;
    }
  };

  const getDataIcon = (type: string) => {
    switch (type) {
      case 'ndvi': return <Layers className="w-5 h-5" />;
      case 'soilMoisture': return <Droplets className="w-5 h-5" />;
      case 'temperature': return <Thermometer className="w-5 h-5" />;
      case 'precipitation': return <Cloud className="w-5 h-5" />;
      default: return <Satellite className="w-5 h-5" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-green-50 to-emerald-50 p-4">
      <VoiceAssistant onCommand={handleVoiceCommand} />
      
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center mb-4">
            <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
              <Satellite className="w-6 h-6 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">{tr.title}</h1>
          <p className="text-gray-600">{tr.subtitle}</p>
          <p className="text-sm text-blue-600 italic">{tr.voiceHint}</p>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center space-x-4">
          <Button onClick={handleRefreshData} disabled={isLoading} variant="outline">
            <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            {tr.refresh}
          </Button>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            {tr.download}
          </Button>
          <Button variant="outline">
            <Share2 className="w-4 h-4 mr-2" />
            {tr.share}
          </Button>
        </div>

        {/* Main Content */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">{tr.fieldAnalysis}</TabsTrigger>
            <TabsTrigger value="recommendations">{tr.recommendations}</TabsTrigger>
            <TabsTrigger value="alerts">{tr.alerts}</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Satellite Data Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {satelliteData.map((data, index) => (
                <Card key={index} className="relative overflow-hidden">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        {getDataIcon(data.type)}
                        <CardTitle className="text-sm">
                          {tr[data.type as keyof typeof tr]}
                        </CardTitle>
                      </div>
                      {getTrendIcon(data.trend)}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="text-2xl font-bold">
                      {data.type === 'ndvi' ? data.value.toFixed(2) : Math.round(data.value)}
                      <span className="text-sm text-gray-500 ml-1">{data.unit}</span>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span>{tr.confidence}</span>
                        <span>{Math.round(data.confidence)}%</span>
                      </div>
                      <Progress value={data.confidence} className="h-1" />
                    </div>

                    <Badge className={`${getStatusColor(data.status)} text-white text-xs`}>
                      {tr[data.status as keyof typeof tr]}
                    </Badge>

                    <div className="text-xs text-gray-500 space-y-1">
                      <div className="flex items-center">
                        <Calendar className="w-3 h-3 mr-1" />
                        {new Date(data.lastUpdated).toLocaleString()}
                      </div>
                      <div className="flex items-center">
                        <Eye className="w-3 h-3 mr-1" />
                        {data.source}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Detailed Analysis */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Layers className="w-5 h-5 mr-2" />
                    {tr.modisData}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="h-32 bg-gradient-to-r from-red-200 via-yellow-200 to-green-200 rounded-lg flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-800">0.75</div>
                        <div className="text-sm text-green-600">NDVI Index</div>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600">{tr.healthyVegetation}</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Droplets className="w-5 h-5 mr-2" />
                    {tr.smapData}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="h-32 bg-gradient-to-t from-blue-100 to-blue-300 rounded-lg flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-800">45%</div>
                        <div className="text-sm text-blue-600">Soil Moisture</div>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600">{tr.optimalMoisture}</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="recommendations" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Alert>
                <Droplets className="h-4 w-4" />
                <AlertDescription>{tr.irrigationAdvice}</AlertDescription>
              </Alert>
              
              <Alert>
                <Zap className="h-4 w-4" />
                <AlertDescription>{tr.fertilizerTiming}</AlertDescription>
              </Alert>
              
              <Alert>
                <Calendar className="h-4 w-4" />
                <AlertDescription>{tr.harvestWindow}</AlertDescription>
              </Alert>
              
              <Alert>
                <Cloud className="h-4 w-4" />
                <AlertDescription>{tr.weatherPrep}</AlertDescription>
              </Alert>
            </div>
          </TabsContent>

          <TabsContent value="alerts" className="space-y-4">
            <div className="space-y-4">
              <Alert className="border-green-200 bg-green-50">
                <Layers className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800">
                  {tr.healthyVegetation}
                </AlertDescription>
              </Alert>
              
              <Alert className="border-blue-200 bg-blue-50">
                <Thermometer className="h-4 w-4 text-blue-600" />
                <AlertDescription className="text-blue-800">
                  {tr.temperatureNormal}
                </AlertDescription>
              </Alert>
              
              <Alert className="border-gray-200 bg-gray-50">
                <Cloud className="h-4 w-4 text-gray-600" />
                <AlertDescription className="text-gray-800">
                  {tr.noExtremeWeather}
                </AlertDescription>
              </Alert>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};