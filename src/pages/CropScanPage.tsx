import React, { useState, useRef, useCallback } from 'react';
import { useAuth } from '@/lib/useAuth';
import { useLanguage } from '@/lib/useLanguage';
import { VoiceAssistant } from '@/components/VoiceAssistant';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Camera, 
  Upload, 
  Scan, 
  CheckCircle, 
  AlertTriangle, 
  Leaf, 
  Bug, 
  Droplets,
  Thermometer,
  Sun,
  CloudRain,
  TrendingUp,
  MapPin,
  Calendar,
  Loader2
} from 'lucide-react';

const translations = {
  en: {
    title: "AI Crop Scanner",
    subtitle: "Scan your crops for health analysis and disease detection",
    takePhoto: "Take Photo",
    uploadPhoto: "Upload Photo",
    scanning: "Analyzing crop...",
    scanComplete: "Scan Complete",
    cropType: "Crop Type",
    healthScore: "Health Score",
    confidence: "Confidence",
    diseases: "Diseases Detected",
    recommendations: "Recommendations",
    nutritionalNeeds: "Nutritional Needs",
    nasaData: "NASA Satellite Data",
    ndvi: "Vegetation Index (NDVI)",
    soilMoisture: "Soil Moisture",
    temperature: "Surface Temperature",
    precipitation: "Precipitation",
    excellent: "Excellent",
    good: "Good",
    moderate: "Moderate",
    poor: "Poor",
    low: "Low",
    medium: "Medium",
    high: "High",
    critical: "Critical",
    voiceHint: "Say 'take photo' to capture or 'help' for commands",
    processing: "Processing with AI...",
    noDisease: "No diseases detected",
    healthyPlant: "Your crop appears healthy!",
    scanHistory: "Scan History",
    location: "Location",
    scanDate: "Scan Date",
    viewDetails: "View Details"
  },
  hi: {
    title: "एआई फसल स्कैनर",
    subtitle: "स्वास्थ्य विश्लेषण और रोग का पता लगाने के लिए अपनी फसलों को स्कैन करें",
    takePhoto: "फोटो लें",
    uploadPhoto: "फोटो अपलोड करें",
    scanning: "फसल का विश्लेषण कर रहे हैं...",
    scanComplete: "स्कैन पूरा",
    cropType: "फसल का प्रकार",
    healthScore: "स्वास्थ्य स्कोर",
    confidence: "विश्वास",
    diseases: "रोग का पता चला",
    recommendations: "सिफारिशें",
    nutritionalNeeds: "पोषण की आवश्यकताएं",
    nasaData: "नासा उपग्रह डेटा",
    ndvi: "वनस्पति सूचकांक (NDVI)",
    soilMoisture: "मिट्टी की नमी",
    temperature: "सतह का तापमान",
    precipitation: "वर्षा",
    excellent: "उत्कृष्ट",
    good: "अच्छा",
    moderate: "मध्यम",
    poor: "खराब",
    low: "कम",
    medium: "मध्यम",
    high: "उच्च",
    critical: "गंभीर",
    voiceHint: "कैप्चर करने के लिए 'फोटो लें' या कमांड के लिए 'मदद' कहें",
    processing: "एआई के साथ प्रसंस्करण...",
    noDisease: "कोई रोग नहीं मिला",
    healthyPlant: "आपकी फसल स्वस्थ दिखती है!",
    scanHistory: "स्कैन इतिहास",
    location: "स्थान",
    scanDate: "स्कैन दिनांक",
    viewDetails: "विवरण देखें"
  },
  te: {
    title: "AI పంట స్కానర్",
    subtitle: "ఆరోగ్య విశ్లేషణ మరియు వ్యాధి గుర్తింపు కోసం మీ పంటలను స్కాన్ చేయండి",
    takePhoto: "ఫోటో తీయండి",
    uploadPhoto: "ఫోటో అప్‌లోడ్ చేయండి",
    scanning: "పంటను విశ్లేషిస్తోంది...",
    scanComplete: "స్కాన్ పూర్తయింది",
    cropType: "పంట రకం",
    healthScore: "ఆరోగ్య స్కోర్",
    confidence: "విశ్వాసం",
    diseases: "వ్యాధులు గుర్తించబడ్డాయి",
    recommendations: "సిఫార్సులు",
    nutritionalNeeds: "పోషకాహార అవసరాలు",
    nasaData: "NASA ఉపగ్రహ డేటా",
    ndvi: "వృక్షసంపద సూచిక (NDVI)",
    soilMoisture: "మట్టి తేమ",
    temperature: "ఉపరితల ఉష్ణోగ్రత",
    precipitation: "వర్షపాతం",
    excellent: "అద్భుతమైన",
    good: "మంచి",
    moderate: "మధ్యస్థ",
    poor: "పేలవమైన",
    low: "తక్కువ",
    medium: "మధ్యస్థ",
    high: "అధిక",
    critical: "క్లిష్టమైన",
    voiceHint: "క్యాప్చర్ చేయడానికి 'ఫోటో తీయండి' లేదా కమాండ్‌ల కోసం 'సహాయం' అనండి",
    processing: "AI తో ప్రాసెసింగ్...",
    noDisease: "ఎటువంటి వ్యాధులు కనుగొనబడలేదు",
    healthyPlant: "మీ పంట ఆరోగ్యంగా కనిపిస్తోంది!",
    scanHistory: "స్కాన్ చరిత్ర",
    location: "స్థానం",
    scanDate: "స్కాన్ తేదీ",
    viewDetails: "వివరాలు చూడండి"
  }
};

interface ScanResult {
  crop: string;
  healthScore: number;
  confidence: number;
  diseases: Array<{
    name: string;
    probability: number;
    severity: 'low' | 'medium' | 'high' | 'critical';
  }>;
  recommendations: string[];
  nutritionalNeeds: string[];
  nasaData: {
    ndvi: number;
    soilMoisture: number;
    temperature: number;
    precipitation: number;
  };
  location: {
    lat: number;
    lng: number;
    address: string;
  };
  scanDate: string;
}

interface ScanHistory {
  id: string;
  result: ScanResult;
  imageUrl: string;
  timestamp: string;
}

export const CropScanPage: React.FC = () => {
  const { user } = useAuth();
  const { language, speak } = useLanguage();
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [scanHistory, setScanHistory] = useState<ScanHistory[]>([]);
  const [activeTab, setActiveTab] = useState('scanner');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [showCamera, setShowCamera] = useState(false);

  const tr = translations[language as keyof typeof translations];

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      });
      setStream(mediaStream);
      setShowCamera(true);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      speak(tr.voiceHint);
    } catch (error) {
      console.error('Error accessing camera:', error);
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setShowCamera(false);
  };

  const capturePhoto = useCallback(() => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      const context = canvas.getContext('2d');
      
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      if (context) {
        context.drawImage(video, 0, 0);
        const imageDataUrl = canvas.toDataURL('image/jpeg');
        setCapturedImage(imageDataUrl);
        stopCamera();
        processImage(imageDataUrl);
      }
    }
  }, []);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageDataUrl = e.target?.result as string;
        setCapturedImage(imageDataUrl);
        processImage(imageDataUrl);
      };
      reader.readAsDataURL(file);
    }
  };

  const processImage = async (imageUrl: string) => {
    setIsScanning(true);
    speak(tr.processing);

    // Simulate AI processing with realistic data
    await new Promise(resolve => setTimeout(resolve, 3000));

    // Get current location
    const location = await getCurrentLocation();

    // Generate realistic scan result
    const mockResult: ScanResult = {
      crop: "Tomato",
      healthScore: Math.floor(Math.random() * 30) + 70, // 70-100
      confidence: Math.floor(Math.random() * 20) + 80, // 80-100
      diseases: generateDiseases(),
      recommendations: generateRecommendations(),
      nutritionalNeeds: ["Nitrogen: Medium", "Phosphorus: Low", "Potassium: High"],
      nasaData: {
        ndvi: Math.random() * 0.4 + 0.6, // 0.6-1.0
        soilMoisture: Math.random() * 40 + 30, // 30-70%
        temperature: Math.random() * 10 + 25, // 25-35°C
        precipitation: Math.random() * 50 // 0-50mm
      },
      location,
      scanDate: new Date().toISOString()
    };

    setScanResult(mockResult);
    setIsScanning(false);

    // Add to history
    const historyItem: ScanHistory = {
      id: Date.now().toString(),
      result: mockResult,
      imageUrl,
      timestamp: new Date().toISOString()
    };
    setScanHistory(prev => [historyItem, ...prev]);

    // Voice feedback
    const healthStatus = getHealthStatus(mockResult.healthScore);
    speak(`${tr.scanComplete}. ${tr.cropType}: ${mockResult.crop}. ${tr.healthScore}: ${mockResult.healthScore}% - ${healthStatus}`);
  };

  const getCurrentLocation = async (): Promise<{ lat: number; lng: number; address: string }> => {
    return new Promise((resolve) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            resolve({
              lat: position.coords.latitude,
              lng: position.coords.longitude,
              address: "Current Location"
            });
          },
          () => {
            resolve({ lat: 0, lng: 0, address: "Location unavailable" });
          }
        );
      } else {
        resolve({ lat: 0, lng: 0, address: "Location unavailable" });
      }
    });
  };

  const generateDiseases = () => {
    const diseases = [
      { name: "Early Blight", probability: Math.random() * 30, severity: 'low' as const },
      { name: "Late Blight", probability: Math.random() * 20, severity: 'medium' as const },
      { name: "Bacterial Spot", probability: Math.random() * 15, severity: 'low' as const }
    ];
    return diseases.filter(d => d.probability > 10);
  };

  const generateRecommendations = () => {
    const recommendations = [
      "Apply organic fungicide spray in early morning",
      "Improve drainage around plant base",
      "Increase spacing between plants for better air circulation",
      "Monitor soil pH levels (optimal: 6.0-6.8)",
      "Apply balanced NPK fertilizer every 2 weeks"
    ];
    return recommendations.slice(0, Math.floor(Math.random() * 3) + 2);
  };

  const getHealthStatus = (score: number) => {
    if (score >= 90) return tr.excellent;
    if (score >= 75) return tr.good;
    if (score >= 60) return tr.moderate;
    return tr.poor;
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low': return 'bg-yellow-100 text-yellow-800';
      case 'medium': return 'bg-orange-100 text-orange-800';
      case 'high': return 'bg-red-100 text-red-800';
      case 'critical': return 'bg-red-200 text-red-900';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleVoiceCommand = (command: string) => {
    const lowerCommand = command.toLowerCase();
    if (lowerCommand.includes('take photo') || lowerCommand.includes('capture')) {
      if (showCamera) {
        capturePhoto();
      } else {
        startCamera();
      }
    } else if (lowerCommand.includes('upload')) {
      fileInputRef.current?.click();
    } else if (lowerCommand.includes('history')) {
      setActiveTab('history');
    } else if (lowerCommand.includes('scanner')) {
      setActiveTab('scanner');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-emerald-50 p-4">
      <VoiceAssistant onCommand={handleVoiceCommand} />
      
      <div className="max-w-4xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Scan className="w-6 h-6 text-green-600" />
              {tr.title}
            </CardTitle>
            <p className="text-sm text-muted-foreground">{tr.subtitle}</p>
            <p className="text-xs text-blue-600 italic">{tr.voiceHint}</p>
          </CardHeader>
        </Card>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="scanner">Scanner</TabsTrigger>
            <TabsTrigger value="history">{tr.scanHistory}</TabsTrigger>
          </TabsList>

          <TabsContent value="scanner" className="space-y-6">
            {/* Camera/Upload Section */}
            <Card>
              <CardContent className="p-6">
                {showCamera ? (
                  <div className="space-y-4">
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      className="w-full max-w-md mx-auto rounded-lg"
                    />
                    <canvas ref={canvasRef} className="hidden" />
                    <div className="flex gap-4 justify-center">
                      <Button onClick={capturePhoto} size="lg">
                        <Camera className="w-5 h-5 mr-2" />
                        {tr.takePhoto}
                      </Button>
                      <Button onClick={stopCamera} variant="outline">
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {capturedImage && (
                      <div className="text-center">
                        <img
                          src={capturedImage}
                          alt="Captured crop"
                          className="max-w-md mx-auto rounded-lg shadow-lg"
                        />
                      </div>
                    )}
                    
                    <div className="flex gap-4 justify-center">
                      <Button onClick={startCamera} size="lg">
                        <Camera className="w-5 h-5 mr-2" />
                        {tr.takePhoto}
                      </Button>
                      <Button
                        onClick={() => fileInputRef.current?.click()}
                        variant="outline"
                        size="lg"
                      >
                        <Upload className="w-5 h-5 mr-2" />
                        {tr.uploadPhoto}
                      </Button>
                    </div>
                    
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Scanning Progress */}
            {isScanning && (
              <Card>
                <CardContent className="p-6">
                  <div className="text-center space-y-4">
                    <Loader2 className="w-12 h-12 animate-spin mx-auto text-green-600" />
                    <p className="text-lg font-medium">{tr.scanning}</p>
                    <Progress value={66} className="w-full max-w-md mx-auto" />
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Scan Results */}
            {scanResult && !isScanning && (
              <div className="space-y-6">
                {/* Main Results */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CheckCircle className="w-6 h-6 text-green-600" />
                      {tr.scanComplete}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="text-center">
                        <Leaf className="w-8 h-8 mx-auto text-green-600 mb-2" />
                        <p className="text-sm text-muted-foreground">{tr.cropType}</p>
                        <p className="text-lg font-semibold">{scanResult.crop}</p>
                      </div>
                      <div className="text-center">
                        <div className="w-8 h-8 mx-auto mb-2 flex items-center justify-center">
                          <TrendingUp className="w-6 h-6 text-blue-600" />
                        </div>
                        <p className="text-sm text-muted-foreground">{tr.healthScore}</p>
                        <p className="text-lg font-semibold">{scanResult.healthScore}%</p>
                        <Badge variant="outline">{getHealthStatus(scanResult.healthScore)}</Badge>
                      </div>
                      <div className="text-center">
                        <div className="w-8 h-8 mx-auto mb-2 flex items-center justify-center">
                          <CheckCircle className="w-6 h-6 text-purple-600" />
                        </div>
                        <p className="text-sm text-muted-foreground">{tr.confidence}</p>
                        <p className="text-lg font-semibold">{scanResult.confidence}%</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Diseases */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Bug className="w-5 h-5 text-red-600" />
                      {tr.diseases}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {scanResult.diseases.length > 0 ? (
                      <div className="space-y-3">
                        {scanResult.diseases.map((disease, index) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div>
                              <p className="font-medium">{disease.name}</p>
                              <p className="text-sm text-muted-foreground">
                                Probability: {disease.probability.toFixed(1)}%
                              </p>
                            </div>
                            <Badge className={getSeverityColor(disease.severity)}>
                              {disease.severity}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <Alert>
                        <CheckCircle className="w-4 h-4" />
                        <AlertDescription>{tr.noDisease}</AlertDescription>
                      </Alert>
                    )}
                  </CardContent>
                </Card>

                {/* NASA Data */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Sun className="w-5 h-5 text-orange-600" />
                      {tr.nasaData}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center p-3 bg-green-50 rounded-lg">
                        <Leaf className="w-6 h-6 mx-auto text-green-600 mb-2" />
                        <p className="text-xs text-muted-foreground">{tr.ndvi}</p>
                        <p className="font-semibold">{scanResult.nasaData.ndvi.toFixed(2)}</p>
                      </div>
                      <div className="text-center p-3 bg-blue-50 rounded-lg">
                        <Droplets className="w-6 h-6 mx-auto text-blue-600 mb-2" />
                        <p className="text-xs text-muted-foreground">{tr.soilMoisture}</p>
                        <p className="font-semibold">{scanResult.nasaData.soilMoisture.toFixed(1)}%</p>
                      </div>
                      <div className="text-center p-3 bg-orange-50 rounded-lg">
                        <Thermometer className="w-6 h-6 mx-auto text-orange-600 mb-2" />
                        <p className="text-xs text-muted-foreground">{tr.temperature}</p>
                        <p className="font-semibold">{scanResult.nasaData.temperature.toFixed(1)}°C</p>
                      </div>
                      <div className="text-center p-3 bg-purple-50 rounded-lg">
                        <CloudRain className="w-6 h-6 mx-auto text-purple-600 mb-2" />
                        <p className="text-xs text-muted-foreground">{tr.precipitation}</p>
                        <p className="font-semibold">{scanResult.nasaData.precipitation.toFixed(1)}mm</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Recommendations */}
                <Card>
                  <CardHeader>
                    <CardTitle>{tr.recommendations}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {scanResult.recommendations.map((rec, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                          <span className="text-sm">{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>
            )}
          </TabsContent>

          <TabsContent value="history" className="space-y-4">
            {scanHistory.length > 0 ? (
              <div className="grid gap-4">
                {scanHistory.map((item) => (
                  <Card key={item.id}>
                    <CardContent className="p-4">
                      <div className="flex gap-4">
                        <img
                          src={item.imageUrl}
                          alt="Scan"
                          className="w-20 h-20 object-cover rounded-lg"
                        />
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="font-semibold">{item.result.crop}</h3>
                            <Badge>{item.result.healthScore}%</Badge>
                          </div>
                          <div className="text-sm text-muted-foreground space-y-1">
                            <div className="flex items-center gap-1">
                              <MapPin className="w-3 h-3" />
                              {item.result.location.address}
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {new Date(item.timestamp).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="p-8 text-center">
                  <Scan className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No scan history yet</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};