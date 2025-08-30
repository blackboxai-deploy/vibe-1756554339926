import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useLanguage } from '@/lib/useLanguage';
import { VoiceAssistant } from '@/components/VoiceAssistant';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Home, 
  Camera, 
  Cloud, 
  Satellite, 
  Phone, 
  HelpCircle, 
  User,
  Menu,
  X,
  Mic,
  MicOff,
  Volume2,
  Languages
} from 'lucide-react';

const translations = {
  en: {
    home: "Dashboard",
    scanCrop: "Scan Crop",
    weather: "Weather",
    nasaData: "NASA Data",
    help: "Help",
    profile: "Profile",
    voiceCommands: "Voice Commands",
    listening: "Listening...",
    notListening: "Voice Off",
    sayCommand: "Say a command:",
    availableCommands: "Available Commands:",
    commandScanCrop: "Scan Crop - Start camera for crop analysis",
    commandWeather: "Check Weather - View weather updates",
    commandNasaData: "NASA Data - View satellite information",
    commandDashboard: "Dashboard - Return to home",
    commandHelp: "Help - Show all commands",
    navigation: "Navigation",
    quickActions: "Quick Actions"
  },
  hi: {
    home: "डैशबोर्ड",
    scanCrop: "फसल स्कैन करें",
    weather: "मौसम",
    nasaData: "नासा डेटा",
    help: "सहायता",
    profile: "प्रोफाइल",
    voiceCommands: "आवाज़ कमांड",
    listening: "सुन रहा है...",
    notListening: "आवाज़ बंद",
    sayCommand: "कमांड बोलें:",
    availableCommands: "उपलब्ध कमांड:",
    commandScanCrop: "फसल स्कैन - फसल विश्लेषण के लिए कैमरा शुरू करें",
    commandWeather: "मौसम जांचें - मौसम अपडेट देखें",
    commandNasaData: "नासा डेटा - उपग्रह जानकारी देखें",
    commandDashboard: "डैशबोर्ड - होम पर वापस जाएं",
    commandHelp: "सहायता - सभी कमांड दिखाएं",
    navigation: "नेवीगेशन",
    quickActions: "त्वरित कार्य"
  },
  te: {
    home: "డ్యాష్‌బోర్డ్",
    scanCrop: "పంట స్కాన్",
    weather: "వాతావరణం",
    nasaData: "నాసా డేటా",
    help: "సహాయం",
    profile: "ప్రొఫైల్",
    voiceCommands: "వాయిస్ కమాండ్స్",
    listening: "వింటున్నాను...",
    notListening: "వాయిస్ ఆఫ్",
    sayCommand: "కమాండ్ చెప్పండి:",
    availableCommands: "అందుబాటులో ఉన్న కమాండ్స్:",
    commandScanCrop: "పంట స్కాన్ - పంట విశ్లేషణ కోసం కెమెరా ప్రారంభించండి",
    commandWeather: "వాతావరణం తనిఖీ - వాతావరణ అప్‌డేట్‌లను చూడండి",
    commandNasaData: "నాసా డేటా - ఉపగ్రహ సమాచారాన్ని చూడండి",
    commandDashboard: "డ్యాష్‌బోర్డ్ - హోమ్‌కు తిరిగి వెళ్లండి",
    commandHelp: "సహాయం - అన్ని కమాండ్‌లను చూపించు",
    navigation: "నావిగేషన్",
    quickActions: "త్వరిత చర్యలు"
  }
};

interface NavigationProps {
  currentPage?: string;
  onNavigate?: (page: string) => void;
}

export const Navigation: React.FC<NavigationProps> = ({ 
  currentPage = 'dashboard',
  onNavigate 
}) => {
  const router = useRouter();
  const { language, setLanguage } = useLanguage();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const [showVoiceHelp, setShowVoiceHelp] = useState(false);
  const [lastCommand, setLastCommand] = useState('');

  const tr = translations[language as keyof typeof translations];

  const navigationItems = [
    { 
      id: 'dashboard', 
      label: tr.home, 
      icon: Home, 
      path: '/',
      voiceCommands: ['dashboard', 'home', 'डैशबोर्ड', 'होम', 'డ్యాష్‌బోర్డ్', 'హోమ్']
    },
    { 
      id: 'scan', 
      label: tr.scanCrop, 
      icon: Camera, 
      path: '/scan',
      voiceCommands: ['scan crop', 'camera', 'फसल स्कैन', 'कैमरा', 'పంట స్కాన్', 'కెమెరా']
    },
    { 
      id: 'weather', 
      label: tr.weather, 
      icon: Cloud, 
      path: '/weather',
      voiceCommands: ['weather', 'check weather', 'मौसम', 'వాతావరణం']
    },
    { 
      id: 'nasa', 
      label: tr.nasaData, 
      icon: Satellite, 
      path: '/nasa-data',
      voiceCommands: ['nasa data', 'satellite', 'नासा डेटा', 'उपग्रह', 'నాసా డేటా', 'ఉపగ్రహం']
    },
    { 
      id: 'help', 
      label: tr.help, 
      icon: HelpCircle, 
      path: '/help',
      voiceCommands: ['help', 'सहायता', 'సహాయం']
    },
    { 
      id: 'profile', 
      label: tr.profile, 
      icon: User, 
      path: '/profile',
      voiceCommands: ['profile', 'प्रोफाइल', 'ప్రొఫైల్']
    }
  ];

  const handleNavigation = (item: typeof navigationItems[0]) => {
    if (onNavigate) {
      onNavigate(item.id);
    } else {
      router.push(item.path);
    }
    setIsMenuOpen(false);
    announceNavigation(item.label);
  };

  const handleVoiceCommand = (command: string) => {
    const lowerCommand = command.toLowerCase();
    setLastCommand(command);
    
    // Find matching navigation item
    const matchedItem = navigationItems.find(item => 
      item.voiceCommands.some(cmd => 
        lowerCommand.includes(cmd.toLowerCase())
      )
    );

    if (matchedItem) {
      handleNavigation(matchedItem);
    } else if (lowerCommand.includes('help') || lowerCommand.includes('commands')) {
      setShowVoiceHelp(true);
      announceText(tr.availableCommands);
    } else if (lowerCommand.includes('menu')) {
      setIsMenuOpen(!isMenuOpen);
    }
  };

  const announceText = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = language === 'hi' ? 'hi-IN' : language === 'te' ? 'te-IN' : 'en-US';
      speechSynthesis.speak(utterance);
    }
  };

  const announceNavigation = (destination: string) => {
    const announcement = language === 'hi' 
      ? `${destination} पर जा रहे हैं`
      : language === 'te'
      ? `${destination} కి వెళ్తున్నాము`
      : `Navigating to ${destination}`;
    
    announceText(announcement);
  };

  const toggleLanguage = () => {
    const languages = ['en', 'hi', 'te'];
    const currentIndex = languages.indexOf(language);
    const nextIndex = (currentIndex + 1) % languages.length;
    setLanguage(languages[nextIndex]);
    
    const langNames = { en: 'English', hi: 'हिंदी', te: 'తెలుగు' };
    announceText(`Language changed to ${langNames[languages[nextIndex] as keyof typeof langNames]}`);
  };

  return (
    <>
      <VoiceAssistant 
        onCommand={handleVoiceCommand}
        isActive={isVoiceActive}
        onActiveChange={setIsVoiceActive}
      />

      {/* Mobile Navigation Header */}
      <div className="lg:hidden bg-white shadow-sm border-b sticky top-0 z-40">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
            <h1 className="font-semibold text-lg">AgriConnect</h1>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleLanguage}
            >
              <Languages className="w-4 h-4" />
            </Button>
            
            <Button
              variant={isVoiceActive ? "default" : "ghost"}
              size="sm"
              onClick={() => setIsVoiceActive(!isVoiceActive)}
            >
              {isVoiceActive ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
            </Button>
          </div>
        </div>

        {/* Voice Status Bar */}
        {isVoiceActive && (
          <div className="bg-blue-50 px-4 py-2 border-t">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Volume2 className="w-4 h-4 text-blue-600" />
                <span className="text-sm text-blue-800">
                  {tr.listening}
                </span>
              </div>
              {lastCommand && (
                <Badge variant="secondary" className="text-xs">
                  {lastCommand}
                </Badge>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black bg-opacity-50">
          <div className="bg-white w-80 h-full shadow-lg">
            <div className="p-4 border-b">
              <div className="flex items-center justify-between">
                <h2 className="font-semibold text-lg">{tr.navigation}</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>
            </div>
            
            <div className="p-4 space-y-2">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentPage === item.id;
                
                return (
                  <Button
                    key={item.id}
                    variant={isActive ? "default" : "ghost"}
                    className="w-full justify-start"
                    onClick={() => handleNavigation(item)}
                  >
                    <Icon className="w-4 h-4 mr-3" />
                    {item.label}
                  </Button>
                );
              })}
            </div>

            {/* Voice Commands Help */}
            <div className="p-4 border-t">
              <Button
                variant="outline"
                className="w-full"
                onClick={() => setShowVoiceHelp(!showVoiceHelp)}
              >
                <HelpCircle className="w-4 h-4 mr-2" />
                {tr.voiceCommands}
              </Button>
              
              {showVoiceHelp && (
                <Card className="mt-2">
                  <CardContent className="p-3">
                    <p className="text-sm font-medium mb-2">{tr.sayCommand}</p>
                    <div className="space-y-1 text-xs">
                      <div>• "{tr.commandScanCrop.split(' - ')[0]}"</div>
                      <div>• "{tr.commandWeather.split(' - ')[0]}"</div>
                      <div>• "{tr.commandNasaData.split(' - ')[0]}"</div>
                      <div>• "{tr.commandDashboard.split(' - ')[0]}"</div>
                      <div>• "{tr.commandHelp.split(' - ')[0]}"</div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Desktop Sidebar */}
      <div className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0 lg:bg-white lg:border-r lg:shadow-sm">
        <div className="flex flex-col flex-grow pt-5 pb-4 overflow-y-auto">
          <div className="flex items-center flex-shrink-0 px-4">
            <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
              <Satellite className="w-5 h-5 text-white" />
            </div>
            <h1 className="ml-3 text-xl font-semibold">AgriConnect</h1>
          </div>
          
          <div className="mt-8 flex-grow flex flex-col">
            <nav className="flex-1 px-2 space-y-1">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentPage === item.id;
                
                return (
                  <Button
                    key={item.id}
                    variant={isActive ? "default" : "ghost"}
                    className="w-full justify-start"
                    onClick={() => handleNavigation(item)}
                  >
                    <Icon className="w-5 h-5 mr-3" />
                    {item.label}
                  </Button>
                );
              })}
            </nav>
            
            {/* Desktop Voice Controls */}
            <div className="px-2 mt-6 space-y-2">
              <div className="flex items-center justify-between">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={toggleLanguage}
                  className="flex-1 mr-2"
                >
                  <Languages className="w-4 h-4 mr-1" />
                  {language.toUpperCase()}
                </Button>
                
                <Button
                  variant={isVoiceActive ? "default" : "outline"}
                  size="sm"
                  onClick={() => setIsVoiceActive(!isVoiceActive)}
                  className="flex-1"
                >
                  {isVoiceActive ? (
                    <>
                      <Mic className="w-4 h-4 mr-1" />
                      ON
                    </>
                  ) : (
                    <>
                      <MicOff className="w-4 h-4 mr-1" />
                      OFF
                    </>
                  )}
                </Button>
              </div>
              
              {isVoiceActive && (
                <div className="bg-blue-50 rounded-lg p-3">
                  <div className="flex items-center space-x-2 mb-2">
                    <Volume2 className="w-4 h-4 text-blue-600" />
                    <span className="text-sm font-medium text-blue-800">
                      {tr.listening}
                    </span>
                  </div>
                  {lastCommand && (
                    <Badge variant="secondary" className="text-xs">
                      {lastCommand}
                    </Badge>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Voice Help Modal */}
      {showVoiceHelp && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-md">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">{tr.voiceCommands}</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowVoiceHelp(false)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
              
              <div className="space-y-3">
                <div>
                  <p className="font-medium text-sm">{tr.commandScanCrop}</p>
                </div>
                <div>
                  <p className="font-medium text-sm">{tr.commandWeather}</p>
                </div>
                <div>
                  <p className="font-medium text-sm">{tr.commandNasaData}</p>
                </div>
                <div>
                  <p className="font-medium text-sm">{tr.commandDashboard}</p>
                </div>
                <div>
                  <p className="font-medium text-sm">{tr.commandHelp}</p>
                </div>
              </div>
              
              <Button
                className="w-full mt-4"
                onClick={() => setShowVoiceHelp(false)}
              >
                Got it
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
};