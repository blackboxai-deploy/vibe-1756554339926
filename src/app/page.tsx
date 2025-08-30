'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Camera, 
  Cloud, 
  Satellite, 
  Phone, 
  Users, 
  Thermometer, 
  Droplets, 
  Wind, 
  Sun, 
  AlertTriangle,
  Mic,
  MicOff,
  Volume2,
  Globe,
  User,
  Home,
  BarChart3,
  Settings,
  LogOut,
  Menu,
  X
} from 'lucide-react';

// Language Context
const LanguageContext = React.createContext({
  language: 'en',
  setLanguage: (lang: string) => {},
  t: (key: string) => key
});

const translations = {
  en: {
    title: "AgriConnect - NASA Powered Smart Farming",
    subtitle: "Advanced satellite technology for modern agriculture",
    scanCrop: "Scan Crop",
    checkWeather: "Check Weather",
    nasaData: "NASA Data",
    dashboard: "Dashboard",
    login: "Login",
    voiceAssistant: "Voice Assistant",
    listening: "Listening...",
    notListening: "Click to speak",
    weatherTitle: "Weather Intelligence",
    nasaTitle: "NASA Satellite Data",
    expertTitle: "Expert Advice",
    cropHealth: "Crop Health",
    soilMoisture: "Soil Moisture",
    temperature: "Temperature",
    rainfall: "Rainfall",
    ndvi: "Vegetation Index",
    excellent: "Excellent",
    good: "Good",
    moderate: "Moderate",
    poor: "Poor",
    high: "High",
    medium: "Medium",
    low: "Low",
    kisamCallCenter: "Kisan Call Center",
    kvkCenter: "KVK Center",
    stateAgri: "State Agriculture",
    voiceCommands: "Voice Commands",
    sayTakePhoto: "Say 'take photo' to capture crop image",
    sayWeather: "Say 'weather' for current conditions",
    sayNasa: "Say 'NASA data' for satellite information",
    sayHelp: "Say 'help' for all commands",
    recentScans: "Recent Crop Scans",
    weatherAlerts: "Weather Alerts",
    govAdvisories: "Government Advisories",
    menu: "Menu",
    close: "Close"
  },
  hi: {
    title: "एग्रीकनेक्ट - नासा संचालित स्मार्ट खेती",
    subtitle: "आधुनिक कृषि के लिए उन्नत उपग्रह तकनीक",
    scanCrop: "फसल स्कैन करें",
    checkWeather: "मौसम जांचें",
    nasaData: "नासा डेटा",
    dashboard: "डैशबोर्ड",
    login: "लॉगिन",
    voiceAssistant: "आवाज सहायक",
    listening: "सुन रहा है...",
    notListening: "बोलने के लिए क्लिक करें",
    weatherTitle: "मौसम बुद्धिमत्ता",
    nasaTitle: "नासा उपग्रह डेटा",
    expertTitle: "विशेषज्ञ सलाह",
    cropHealth: "फसल स्वास्थ्य",
    soilMoisture: "मिट्टी की नमी",
    temperature: "तापमान",
    rainfall: "वर्षा",
    ndvi: "वनस्पति सूचकांक",
    excellent: "उत्कृष्ट",
    good: "अच्छा",
    moderate: "मध्यम",
    poor: "खराब",
    high: "उच्च",
    medium: "मध्यम",
    low: "कम",
    kisamCallCenter: "किसान कॉल सेंटर",
    kvkCenter: "केवीके केंद्र",
    stateAgri: "राज्य कृषि",
    voiceCommands: "आवाज कमांड",
    sayTakePhoto: "फसल की तस्वीर लेने के लिए 'फोटो लें' कहें",
    sayWeather: "वर्तमान स्थितियों के लिए 'मौसम' कहें",
    sayNasa: "उपग्रह जानकारी के लिए 'नासा डेटा' कहें",
    sayHelp: "सभी कमांड के लिए 'मदद' कहें",
    recentScans: "हाल की फसल स्कैन",
    weatherAlerts: "मौसम चेतावनी",
    govAdvisories: "सरकारी सलाह",
    menu: "मेनू",
    close: "बंद करें"
  },
  te: {
    title: "అగ్రికనెక్ట్ - నాసా శక్తితో స్మార్ట్ వ్యవసాయం",
    subtitle: "ఆధునిక వ్యవసాయం కోసం అధునాతన ఉపగ్రహ సాంకేతికత",
    scanCrop: "పంట స్కాన్ చేయండి",
    checkWeather: "వాతావరణం తనిఖీ చేయండి",
    nasaData: "నాసా డేటా",
    dashboard: "డ్యాష్‌బోర్డ్",
    login: "లాగిన్",
    voiceAssistant: "వాయిస్ అసిస్టెంట్",
    listening: "వింటోంది...",
    notListening: "మాట్లాడటానికి క్లిక్ చేయండి",
    weatherTitle: "వాతావరణ మేధస్సు",
    nasaTitle: "నాసా ఉపగ్రహ డేటా",
    expertTitle: "నిపుణుల సలహా",
    cropHealth: "పంట ఆరోగ్యం",
    soilMoisture: "మట్టి తేమ",
    temperature: "ఉష్ణోగ్రత",
    rainfall: "వర్షపాతం",
    ndvi: "వృక్షసంపద సూచిక",
    excellent: "అద్భుతమైన",
    good: "మంచి",
    moderate: "మధ్యస్థ",
    poor: "పేలవమైన",
    high: "అధిక",
    medium: "మధ్యస్థ",
    low: "తక్కువ",
    kisamCallCenter: "కిసాన్ కాల్ సెంటర్",
    kvkCenter: "కేవీకే కేంద్రం",
    stateAgri: "రాష్ట్ర వ్యవసాయం",
    voiceCommands: "వాయిస్ కమాండ్‌లు",
    sayTakePhoto: "పంట చిత్రం తీయడానికి 'ఫోటో తీయండి' అనండి",
    sayWeather: "ప్రస్తుత పరిస్థితుల కోసం 'వాతావరణం' అనండి",
    sayNasa: "ఉపగ్రహ సమాచారం కోసం 'నాసా డేటా' అనండి",
    sayHelp: "అన్ని కమాండ్‌ల కోసం 'సహాయం' అనండి",
    recentScans: "ఇటీవలి పంట స్కాన్‌లు",
    weatherAlerts: "వాతావరణ హెచ్చరికలు",
    govAdvisories: "ప్రభుత్వ సలహాలు",
    menu: "మెనూ",
    close: "మూసివేయండి"
  }
};

// Voice Assistant Component
const VoiceAssistant = ({ onCommand }: { onCommand: (command: string) => void }) => {
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState<any>(null);
  const { language, t } = React.useContext(LanguageContext);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition;
      const recognitionInstance = new SpeechRecognition();
      
      recognitionInstance.continuous = false;
      recognitionInstance.interimResults = false;
      recognitionInstance.lang = language === 'hi' ? 'hi-IN' : language === 'te' ? 'te-IN' : 'en-US';
      
      recognitionInstance.onresult = (event: any) => {
        const command = event.results[0][0].transcript.toLowerCase();
        onCommand(command);
        setIsListening(false);
      };
      
      recognitionInstance.onend = () => {
        setIsListening(false);
      };
      
      setRecognition(recognitionInstance);
    }
  }, [language, onCommand]);

  const toggleListening = () => {
    if (!recognition) return;
    
    if (isListening) {
      recognition.stop();
      setIsListening(false);
    } else {
      recognition.start();
      setIsListening(true);
    }
  };

  const speak = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = language === 'hi' ? 'hi-IN' : language === 'te' ? 'te-IN' : 'en-US';
      speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Button
        onClick={toggleListening}
        className={`rounded-full w-16 h-16 ${isListening ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-500 hover:bg-blue-600'}`}
      >
        {isListening ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
      </Button>
      {isListening && (
        <div className="absolute bottom-20 right-0 bg-white p-2 rounded-lg shadow-lg">
          <p className="text-sm">{t('listening')}</p>
        </div>
      )}
    </div>
  );
};

// Language Provider
const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
  const [language, setLanguage] = useState('en');

  const t = (key: string) => {
    return translations[language as keyof typeof translations]?.[key as keyof typeof translations.en] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

// Main Dashboard Component
const Dashboard = () => {
  const { language, setLanguage, t } = React.useContext(LanguageContext);
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState(null);

  // Mock data for demonstration
  const weatherData = {
    temperature: 28,
    humidity: 65,
    rainfall: 125,
    windSpeed: 12
  };

  const nasaData = {
    ndvi: 0.75,
    soilMoisture: 45,
    surfaceTemp: 32,
    precipitation: 15
  };

  const handleVoiceCommand = (command: string) => {
    const lowerCommand = command.toLowerCase();
    
    if (lowerCommand.includes('scan') || lowerCommand.includes('photo') || lowerCommand.includes('camera')) {
      setCurrentPage('scan');
      speak(t('scanCrop'));
    } else if (lowerCommand.includes('weather')) {
      setCurrentPage('weather');
      speak(t('checkWeather'));
    } else if (lowerCommand.includes('nasa') || lowerCommand.includes('satellite')) {
      setCurrentPage('nasa');
      speak(t('nasaData'));
    } else if (lowerCommand.includes('dashboard') || lowerCommand.includes('home')) {
      setCurrentPage('dashboard');
      speak(t('dashboard'));
    } else if (lowerCommand.includes('help')) {
      speak(`${t('sayTakePhoto')}. ${t('sayWeather')}. ${t('sayNasa')}`);
    }
  };

  const speak = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = language === 'hi' ? 'hi-IN' : language === 'te' ? 'te-IN' : 'en-US';
      speechSynthesis.speak(utterance);
    }
  };

  const getHealthStatus = (value: number) => {
    if (value > 0.6) return { status: t('excellent'), color: 'bg-green-500' };
    if (value > 0.4) return { status: t('good'), color: 'bg-blue-500' };
    if (value > 0.2) return { status: t('moderate'), color: 'bg-yellow-500' };
    return { status: t('poor'), color: 'bg-red-500' };
  };

  const renderDashboard = () => (
    <div className="space-y-6">
      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setCurrentPage('scan')}>
          <CardContent className="flex items-center p-6">
            <Camera className="w-8 h-8 text-green-600 mr-4" />
            <div>
              <h3 className="font-semibold">{t('scanCrop')}</h3>
              <p className="text-sm text-muted-foreground">AI-powered analysis</p>
            </div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setCurrentPage('weather')}>
          <CardContent className="flex items-center p-6">
            <Cloud className="w-8 h-8 text-blue-600 mr-4" />
            <div>
              <h3 className="font-semibold">{t('checkWeather')}</h3>
              <p className="text-sm text-muted-foreground">Real-time updates</p>
            </div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setCurrentPage('nasa')}>
          <CardContent className="flex items-center p-6">
            <Satellite className="w-8 h-8 text-purple-600 mr-4" />
            <div>
              <h3 className="font-semibold">{t('nasaData')}</h3>
              <p className="text-sm text-muted-foreground">Satellite insights</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Weather Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Cloud className="w-5 h-5 mr-2" />
            {t('weatherTitle')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <Thermometer className="w-6 h-6 mx-auto mb-2 text-red-500" />
              <p className="text-2xl font-bold">{weatherData.temperature}°C</p>
              <p className="text-sm text-muted-foreground">{t('temperature')}</p>
            </div>
            <div className="text-center">
              <Droplets className="w-6 h-6 mx-auto mb-2 text-blue-500" />
              <p className="text-2xl font-bold">{weatherData.humidity}%</p>
              <p className="text-sm text-muted-foreground">Humidity</p>
            </div>
            <div className="text-center">
              <Cloud className="w-6 h-6 mx-auto mb-2 text-gray-500" />
              <p className="text-2xl font-bold">{weatherData.rainfall}mm</p>
              <p className="text-sm text-muted-foreground">{t('rainfall')}</p>
            </div>
            <div className="text-center">
              <Wind className="w-6 h-6 mx-auto mb-2 text-green-500" />
              <p className="text-2xl font-bold">{weatherData.windSpeed} km/h</p>
              <p className="text-sm text-muted-foreground">Wind</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* NASA Data Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Satellite className="w-5 h-5 mr-2" />
            {t('nasaTitle')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span>{t('ndvi')}</span>
                <Badge className={getHealthStatus(nasaData.ndvi).color}>
                  {getHealthStatus(nasaData.ndvi).status}
                </Badge>
              </div>
              <Progress value={nasaData.ndvi * 100} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between items-center mb-2">
                <span>{t('soilMoisture')}</span>
                <span>{nasaData.soilMoisture}%</span>
              </div>
              <Progress value={nasaData.soilMoisture} className="h-2" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Voice Commands Help */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Volume2 className="w-5 h-5 mr-2" />
            {t('voiceCommands')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <p>• {t('sayTakePhoto')}</p>
            <p>• {t('sayWeather')}</p>
            <p>• {t('sayNasa')}</p>
            <p>• {t('sayHelp')}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderScanPage = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Camera className="w-5 h-5 mr-2" />
            {t('scanCrop')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center space-y-4">
            <div className="w-64 h-64 mx-auto bg-gray-100 rounded-lg flex items-center justify-center">
              <Camera className="w-16 h-16 text-gray-400" />
            </div>
            <Button className="w-full">
              <Camera className="w-4 h-4 mr-2" />
              Take Photo
            </Button>
            <p className="text-sm text-muted-foreground">
              Point camera at crop leaves for AI analysis
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderWeatherPage = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Cloud className="w-5 h-5 mr-2" />
            {t('weatherTitle')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center">
                  <Thermometer className="w-8 h-8 text-red-500 mr-3" />
                  <div>
                    <p className="font-semibold">{t('temperature')}</p>
                    <p className="text-2xl font-bold">{weatherData.temperature}°C</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                <div className="flex items-center">
                  <Droplets className="w-8 h-8 text-blue-500 mr-3" />
                  <div>
                    <p className="font-semibold">Humidity</p>
                    <p className="text-2xl font-bold">{weatherData.humidity}%</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  High rainfall expected in next 48 hours. Consider drainage preparation.
                </AlertDescription>
              </Alert>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderNASAPage = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Satellite className="w-5 h-5 mr-2" />
            {t('nasaTitle')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 border rounded-lg">
                <h3 className="font-semibold mb-2">MODIS NDVI</h3>
                <div className="flex items-center justify-between">
                  <span>Vegetation Health</span>
                  <Badge className="bg-green-500">Excellent</Badge>
                </div>
                <Progress value={75} className="mt-2" />
              </div>
              <div className="p-4 border rounded-lg">
                <h3 className="font-semibold mb-2">SMAP Soil Moisture</h3>
                <div className="flex items-center justify-between">
                  <span>Moisture Level</span>
                  <span>45%</span>
                </div>
                <Progress value={45} className="mt-2" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden"
              >
                {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </Button>
              <h1 className="text-xl font-bold text-green-600 ml-2">AgriConnect</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Language Selector */}
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="text-sm border rounded px-2 py-1"
              >
                <option value="en">English</option>
                <option value="hi">हिंदी</option>
                <option value="te">తెలుగు</option>
              </select>
              
              {!user && (
                <Button variant="outline" size="sm">
                  <User className="w-4 h-4 mr-1" />
                  {t('login')}
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-b">
          <div className="px-4 py-2 space-y-2">
            <Button
              variant="ghost"
              className="w-full justify-start"
              onClick={() => { setCurrentPage('dashboard'); setIsMenuOpen(false); }}
            >
              <Home className="w-4 h-4 mr-2" />
              {t('dashboard')}
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start"
              onClick={() => { setCurrentPage('scan'); setIsMenuOpen(false); }}
            >
              <Camera className="w-4 h-4 mr-2" />
              {t('scanCrop')}
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start"
              onClick={() => { setCurrentPage('weather'); setIsMenuOpen(false); }}
            >
              <Cloud className="w-4 h-4 mr-2" />
              {t('checkWeather')}
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start"
              onClick={() => { setCurrentPage('nasa'); setIsMenuOpen(false); }}
            >
              <Satellite className="w-4 h-4 mr-2" />
              {t('nasaData')}
            </Button>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Navigation - Desktop */}
          <aside className="hidden md:block w-64 space-y-2">
            <Button
              variant={currentPage === 'dashboard' ? 'default' : 'ghost'}
              className="w-full justify-start"
              onClick={() => setCurrentPage('dashboard')}
            >
              <Home className="w-4 h-4 mr-2" />
              {t('dashboard')}
            </Button>
            <Button
              variant={currentPage === 'scan' ? 'default' : 'ghost'}
              className="w-full justify-start"
              onClick={() => setCurrentPage('scan')}
            >
              <Camera className="w-4 h-4 mr-2" />
              {t('scanCrop')}
            </Button>
            <Button
              variant={currentPage === 'weather' ? 'default' : 'ghost'}
              className="w-full justify-start"
              onClick={() => setCurrentPage('weather')}
            >
              <Cloud className="w-4 h-4 mr-2" />
              {t('checkWeather')}
            </Button>
            <Button
              variant={currentPage === 'nasa' ? 'default' : 'ghost'}
              className="w-full justify-start"
              onClick={() => setCurrentPage('nasa')}
            >
              <Satellite className="w-4 h-4 mr-2" />
              {t('nasaData')}
            </Button>
          </aside>

          {/* Main Content Area */}
          <div className="flex-1">
            {currentPage === 'dashboard' && renderDashboard()}
            {currentPage === 'scan' && renderScanPage()}
            {currentPage === 'weather' && renderWeatherPage()}
            {currentPage === 'nasa' && renderNASAPage()}
          </div>
        </div>
      </main>

      {/* Voice Assistant */}
      <VoiceAssistant onCommand={handleVoiceCommand} />
    </div>
  );
};

// Main App Component
export default function Home() {
  return (
    <LanguageProvider>
      <Dashboard />
    </LanguageProvider>
  );
}