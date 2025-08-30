import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Volume2, VolumeX, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/lib/useLanguage';

interface VoiceAssistantProps {
  onCommand?: (command: string) => void;
  className?: string;
}

const translations = {
  en: {
    listening: "Listening...",
    notListening: "Click to speak",
    processing: "Processing...",
    error: "Voice not supported",
    commands: {
      scanCrop: "scan crop",
      checkWeather: "check weather",
      nasaData: "nasa data",
      takePhoto: "take photo",
      help: "help",
      dashboard: "dashboard",
      login: "login",
      register: "register"
    },
    responses: {
      scanCrop: "Opening crop scanner. Point your camera at the crop leaves.",
      checkWeather: "Loading weather information for your location.",
      nasaData: "Displaying NASA satellite data for your fields.",
      takePhoto: "Camera is ready. Tap the capture button when ready.",
      help: "Available commands: scan crop, check weather, NASA data, take photo, dashboard.",
      dashboard: "Returning to main dashboard.",
      login: "Opening login page.",
      register: "Opening registration form.",
      unknown: "Sorry, I didn't understand. Say 'help' for available commands."
    }
  },
  hi: {
    listening: "सुन रहा हूँ...",
    notListening: "बोलने के लिए क्लिक करें",
    processing: "प्रोसेसिंग...",
    error: "आवाज़ समर्थित नहीं",
    commands: {
      scanCrop: "फसल स्कैन",
      checkWeather: "मौसम देखें",
      nasaData: "नासा डेटा",
      takePhoto: "फोटो लें",
      help: "मदद",
      dashboard: "डैशबोर्ड",
      login: "लॉगिन",
      register: "रजिस्टर"
    },
    responses: {
      scanCrop: "फसल स्कैनर खोल रहे हैं। अपना कैमरा फसल की पत्तियों पर लगाएं।",
      checkWeather: "आपके स्थान के लिए मौसम की जानकारी लोड कर रहे हैं।",
      nasaData: "आपके खेतों के लिए नासा सैटेलाइट डेटा दिखा रहे हैं।",
      takePhoto: "कैमरा तैयार है। तैयार होने पर कैप्चर बटन दबाएं।",
      help: "उपलब्ध कमांड: फसल स्कैन, मौसम देखें, नासा डेटा, फोटो लें, डैशबोर्ड।",
      dashboard: "मुख्य डैशबोर्ड पर वापस जा रहे हैं।",
      login: "लॉगिन पेज खोल रहे हैं।",
      register: "रजिस्ट्रेशन फॉर्म खोल रहे हैं।",
      unknown: "माफ करें, मैं समझ नहीं पाया। उपलब्ध कमांड के लिए 'मदद' कहें।"
    }
  },
  te: {
    listening: "వింటున్నాను...",
    notListening: "మాట్లాడటానికి క్లిక్ చేయండి",
    processing: "ప్రాసెసింగ్...",
    error: "వాయిస్ సపోర్ట్ లేదు",
    commands: {
      scanCrop: "పంట స్కాన్",
      checkWeather: "వాతావరణం చూడండి",
      nasaData: "నాసా డేటా",
      takePhoto: "ఫోటో తీయండి",
      help: "సహాయం",
      dashboard: "డ్యాష్‌బోర్డ్",
      login: "లాగిన్",
      register: "రిజిస్టర్"
    },
    responses: {
      scanCrop: "క్రాప్ స్కానర్ తెరుస్తున్నాము. మీ కెమెరాను పంట ఆకులపై పెట్టండి.",
      checkWeather: "మీ ప్రాంతానికి వాతావరణ సమాచారం లోడ్ చేస్తున్నాము.",
      nasaData: "మీ పొలాలకు నాసా ఉపగ్రహ డేటా చూపిస్తున్నాము.",
      takePhoto: "కెమెరా సిద్ధంగా ఉంది. సిద్ధంగా ఉన్నప్పుడు క్యాప్చర్ బటన్ నొక్కండి.",
      help: "అందుబాటులో ఉన్న కమాండ్‌లు: పంట స్కాన్, వాతావరణం చూడండి, నాసా డేటా, ఫోటో తీయండి, డ్యాష్‌బోర్డ్.",
      dashboard: "ప్రధాన డ్యాష్‌బోర్డ్‌కు తిరిగి వెళ్తున్నాము.",
      login: "లాగిన్ పేజీ తెరుస్తున్నాము.",
      register: "రిజిస్ట్రేషన్ ఫారం తెరుస్తున్నాము.",
      unknown: "క్షమించండి, నేను అర్థం చేసుకోలేకపోయాను. అందుబాటులో ఉన్న కమాండ్‌ల కోసం 'సహాయం' అనండి."
    }
  }
};

export const VoiceAssistant: React.FC<VoiceAssistantProps> = ({ onCommand, className }) => {
  const { language } = useLanguage();
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [confidence, setConfidence] = useState(0);
  const [lastCommand, setLastCommand] = useState('');
  const [isSupported, setIsSupported] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);

  const tr = translations[language as keyof typeof translations];

  useEffect(() => {
    // Check for speech recognition support
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const speechSynthesis = window.speechSynthesis;
    
    if (SpeechRecognition && speechSynthesis) {
      setIsSupported(true);
      recognitionRef.current = new SpeechRecognition();
      synthRef.current = speechSynthesis;
      
      const recognition = recognitionRef.current;
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = getLanguageCode(language);
      
      recognition.onstart = () => {
        setIsListening(true);
        setIsProcessing(false);
      };
      
      recognition.onresult = (event) => {
        const result = event.results[event.results.length - 1];
        if (result.isFinal) {
          const command = result[0].transcript.toLowerCase().trim();
          setConfidence(Math.round(result[0].confidence * 100));
          setLastCommand(command);
          setIsProcessing(true);
          processCommand(command);
        }
      };
      
      recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        setIsProcessing(false);
      };
      
      recognition.onend = () => {
        setIsListening(false);
        setIsProcessing(false);
      };
    }
  }, [language]);

  const getLanguageCode = (lang: string) => {
    switch (lang) {
      case 'hi': return 'hi-IN';
      case 'te': return 'te-IN';
      default: return 'en-US';
    }
  };

  const speak = (text: string) => {
    if (!synthRef.current) return;
    
    // Cancel any ongoing speech
    synthRef.current.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = getLanguageCode(language);
    utterance.rate = 0.9;
    utterance.pitch = 1;
    
    // Try to find a voice for the selected language
    const voices = synthRef.current.getVoices();
    const voice = voices.find(v => v.lang.startsWith(getLanguageCode(language).split('-')[0]));
    if (voice) {
      utterance.voice = voice;
    }
    
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    
    synthRef.current.speak(utterance);
  };

  const processCommand = (command: string) => {
    let response = tr.responses.unknown;
    let action = '';

    // Normalize command for matching
    const normalizedCommand = command.toLowerCase().trim();
    
    // Check for command matches in current language
    if (normalizedCommand.includes(tr.commands.scanCrop) || 
        normalizedCommand.includes('scan') || 
        normalizedCommand.includes('crop')) {
      response = tr.responses.scanCrop;
      action = 'scan-crop';
    } else if (normalizedCommand.includes(tr.commands.checkWeather) || 
               normalizedCommand.includes('weather') || 
               normalizedCommand.includes('मौसम') || 
               normalizedCommand.includes('వాతావరణం')) {
      response = tr.responses.checkWeather;
      action = 'check-weather';
    } else if (normalizedCommand.includes(tr.commands.nasaData) || 
               normalizedCommand.includes('nasa') || 
               normalizedCommand.includes('satellite')) {
      response = tr.responses.nasaData;
      action = 'nasa-data';
    } else if (normalizedCommand.includes(tr.commands.takePhoto) || 
               normalizedCommand.includes('photo') || 
               normalizedCommand.includes('picture') || 
               normalizedCommand.includes('capture')) {
      response = tr.responses.takePhoto;
      action = 'take-photo';
    } else if (normalizedCommand.includes(tr.commands.help) || 
               normalizedCommand.includes('help') || 
               normalizedCommand.includes('मदद') || 
               normalizedCommand.includes('సహాయం')) {
      response = tr.responses.help;
      action = 'help';
      setShowHelp(true);
    } else if (normalizedCommand.includes(tr.commands.dashboard) || 
               normalizedCommand.includes('dashboard') || 
               normalizedCommand.includes('home')) {
      response = tr.responses.dashboard;
      action = 'dashboard';
    } else if (normalizedCommand.includes(tr.commands.login) || 
               normalizedCommand.includes('login') || 
               normalizedCommand.includes('sign in')) {
      response = tr.responses.login;
      action = 'login';
    } else if (normalizedCommand.includes(tr.commands.register) || 
               normalizedCommand.includes('register') || 
               normalizedCommand.includes('signup')) {
      response = tr.responses.register;
      action = 'register';
    }

    // Speak the response
    speak(response);
    
    // Execute the action
    if (onCommand && action) {
      setTimeout(() => onCommand(action), 1000);
    }
  };

  const startListening = () => {
    if (!recognitionRef.current || isListening) return;
    
    try {
      recognitionRef.current.start();
    } catch (error) {
      console.error('Failed to start speech recognition:', error);
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
    }
  };

  const stopSpeaking = () => {
    if (synthRef.current) {
      synthRef.current.cancel();
      setIsSpeaking(false);
    }
  };

  if (!isSupported) {
    return (
      <div className={`fixed bottom-4 right-4 ${className}`}>
        <Badge variant="destructive">{tr.error}</Badge>
      </div>
    );
  }

  return (
    <div className={`fixed bottom-4 right-4 z-50 ${className}`}>
      {showHelp && (
        <Card className="mb-4 w-80">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold">Voice Commands</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowHelp(false)}
              >
                ×
              </Button>
            </div>
            <div className="space-y-1 text-sm">
              <div>• "{tr.commands.scanCrop}" - Start crop scanner</div>
              <div>• "{tr.commands.checkWeather}" - Check weather</div>
              <div>• "{tr.commands.nasaData}" - View NASA data</div>
              <div>• "{tr.commands.takePhoto}" - Take photo</div>
              <div>• "{tr.commands.dashboard}" - Go to dashboard</div>
            </div>
          </CardContent>
        </Card>
      )}
      
      <div className="flex flex-col items-end space-y-2">
        {lastCommand && (
          <Card className="p-2 max-w-xs">
            <div className="text-xs text-muted-foreground">
              Last: "{lastCommand}" ({confidence}%)
            </div>
          </Card>
        )}
        
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowHelp(!showHelp)}
          >
            <HelpCircle className="w-4 h-4" />
          </Button>
          
          {isSpeaking && (
            <Button
              variant="outline"
              size="sm"
              onClick={stopSpeaking}
            >
              <VolumeX className="w-4 h-4" />
            </Button>
          )}
          
          <Button
            variant={isListening ? "destructive" : "default"}
            size="lg"
            onClick={isListening ? stopListening : startListening}
            disabled={isProcessing}
            className="relative"
          >
            {isListening ? (
              <MicOff className="w-5 h-5" />
            ) : (
              <Mic className="w-5 h-5" />
            )}
            
            {isListening && (
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse" />
            )}
          </Button>
        </div>
        
        <div className="text-xs text-center text-muted-foreground max-w-32">
          {isListening ? tr.listening : isProcessing ? tr.processing : tr.notListening}
        </div>
      </div>
    </div>
  );
};