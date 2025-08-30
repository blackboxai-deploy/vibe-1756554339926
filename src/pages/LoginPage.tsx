import React, { useState } from 'react';
import { useAuth } from '@/lib/useAuth';
import { useLanguage } from '@/lib/useLanguage';
import { VoiceAssistant } from '@/components/VoiceAssistant';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, Smartphone, User, Phone, Mail } from 'lucide-react';

const translations = {
  en: {
    title: "AgriConnect Login",
    subtitle: "Access your personalized farming dashboard",
    phone: "Phone Number",
    email: "Email Address",
    password: "Password",
    name: "Full Name",
    farmName: "Farm Name",
    location: "Location",
    cropTypes: "Primary Crops",
    login: "Sign In",
    signup: "Create Account",
    loginTab: "Sign In",
    signupTab: "Register",
    phonePlaceholder: "+91 9876543210",
    emailPlaceholder: "farmer@example.com",
    passwordPlaceholder: "Enter your password",
    namePlaceholder: "Your full name",
    farmPlaceholder: "Your farm name",
    locationPlaceholder: "City, State",
    cropsPlaceholder: "Rice, Wheat, Cotton",
    loading: "Please wait...",
    phoneLogin: "Continue with Phone",
    emailLogin: "Continue with Email",
    newUser: "New to AgriConnect?",
    existingUser: "Already have an account?",
    voiceHint: "Say 'login' or 'register' for voice guidance"
  },
  hi: {
    title: "एग्रीकनेक्ट लॉगिन",
    subtitle: "अपने व्यक्तिगत कृषि डैशबोर्ड तक पहुंचें",
    phone: "फोन नंबर",
    email: "ईमेल पता",
    password: "पासवर्ड",
    name: "पूरा नाम",
    farmName: "फार्म का नाम",
    location: "स्थान",
    cropTypes: "मुख्य फसलें",
    login: "साइन इन करें",
    signup: "खाता बनाएं",
    loginTab: "साइन इन",
    signupTab: "रजिस्टर करें",
    phonePlaceholder: "+91 9876543210",
    emailPlaceholder: "farmer@example.com",
    passwordPlaceholder: "अपना पासवर्ड दर्ज करें",
    namePlaceholder: "आपका पूरा नाम",
    farmPlaceholder: "आपके फार्म का नाम",
    locationPlaceholder: "शहर, राज्य",
    cropsPlaceholder: "धान, गेहूं, कपास",
    loading: "कृपया प्रतीक्षा करें...",
    phoneLogin: "फोन से जारी रखें",
    emailLogin: "ईमेल से जारी रखें",
    newUser: "एग्रीकनेक्ट पर नए हैं?",
    existingUser: "पहले से खाता है?",
    voiceHint: "आवाज़ गाइड के लिए 'लॉगिन' या 'रजिस्टर' कहें"
  },
  te: {
    title: "అగ్రికనెక్ట్ లాగిన్",
    subtitle: "మీ వ్యక్తిగత వ్యవసాయ డ్యాష్‌బోర్డ్‌ను యాక్సెస్ చేయండి",
    phone: "ఫోన్ నంబర్",
    email: "ఇమెయిల్ చిరునామా",
    password: "పాస్‌వర్డ్",
    name: "పూర్తి పేరు",
    farmName: "పొలం పేరు",
    location: "స్థానం",
    cropTypes: "ప్రధాన పంటలు",
    login: "సైన్ ఇన్",
    signup: "ఖాతా సృష్టించండి",
    loginTab: "సైన్ ఇన్",
    signupTab: "రిజిస్టర్",
    phonePlaceholder: "+91 9876543210",
    emailPlaceholder: "farmer@example.com",
    passwordPlaceholder: "మీ పాస్‌వర్డ్ నమోదు చేయండి",
    namePlaceholder: "మీ పూర్తి పేరు",
    farmPlaceholder: "మీ పొలం పేరు",
    locationPlaceholder: "నగరం, రాష్ట్రం",
    cropsPlaceholder: "వరి, గోధుమ, పత్తి",
    loading: "దయచేసి వేచి ఉండండి...",
    phoneLogin: "ఫోన్‌తో కొనసాగండి",
    emailLogin: "ఇమెయిల్‌తో కొనసాగండి",
    newUser: "అగ్రికనెక్ట్‌కు కొత్తవారా?",
    existingUser: "ఇప్పటికే ఖాతా ఉందా?",
    voiceHint: "వాయిస్ గైడన్స్ కోసం 'లాగిన్' లేదా 'రిజిస్టర్' అనండి"
  }
};

export const LoginPage: React.FC = () => {
  const { signIn, signUp, loading } = useAuth();
  const { language, t } = useLanguage();
  const [isLogin, setIsLogin] = useState(true);
  const [loginMethod, setLoginMethod] = useState<'phone' | 'email'>('phone');
  const [formData, setFormData] = useState({
    phone: '',
    email: '',
    password: '',
    name: '',
    farmName: '',
    location: '',
    cropTypes: ''
  });
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    try {
      if (isLogin) {
        const identifier = loginMethod === 'phone' ? formData.phone : formData.email;
        await signIn(identifier, formData.password);
      } else {
        const userData = {
          email: formData.email || `${formData.phone}@agriconnect.com`,
          password: formData.password,
          phone: formData.phone,
          full_name: formData.name,
          farm_name: formData.farmName,
          location: formData.location,
          crop_types: formData.cropTypes.split(',').map(c => c.trim())
        };
        await signUp(userData);
      }
    } catch (error: any) {
      setError(error.message);
    }
  };

  const handleVoiceCommand = (command: string) => {
    const lowerCommand = command.toLowerCase();
    if (lowerCommand.includes('login') || lowerCommand.includes('sign in')) {
      setIsLogin(true);
    } else if (lowerCommand.includes('register') || lowerCommand.includes('signup')) {
      setIsLogin(false);
    }
  };

  const tr = translations[language as keyof typeof translations];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-emerald-50 flex items-center justify-center p-4">
      <VoiceAssistant onCommand={handleVoiceCommand} />
      
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-center mb-4">
            <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center">
              <User className="w-6 h-6 text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-center">{tr.title}</CardTitle>
          <p className="text-sm text-muted-foreground text-center">{tr.subtitle}</p>
          <p className="text-xs text-blue-600 text-center italic">{tr.voiceHint}</p>
        </CardHeader>
        
        <CardContent>
          <Tabs value={isLogin ? 'login' : 'signup'} onValueChange={(value) => setIsLogin(value === 'login')}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">{tr.loginTab}</TabsTrigger>
              <TabsTrigger value="signup">{tr.signupTab}</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login" className="space-y-4">
              <div className="space-y-4">
                <div className="flex space-x-2">
                  <Button
                    type="button"
                    variant={loginMethod === 'phone' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setLoginMethod('phone')}
                    className="flex-1"
                  >
                    <Phone className="w-4 h-4 mr-1" />
                    {tr.phone}
                  </Button>
                  <Button
                    type="button"
                    variant={loginMethod === 'email' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setLoginMethod('email')}
                    className="flex-1"
                  >
                    <Mail className="w-4 h-4 mr-1" />
                    {tr.email}
                  </Button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  {loginMethod === 'phone' ? (
                    <div className="space-y-2">
                      <Label htmlFor="phone">{tr.phone}</Label>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder={tr.phonePlaceholder}
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        required
                      />
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Label htmlFor="email">{tr.email}</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder={tr.emailPlaceholder}
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                      />
                    </div>
                  )}
                  
                  <div className="space-y-2">
                    <Label htmlFor="password">{tr.password}</Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder={tr.passwordPlaceholder}
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      required
                    />
                  </div>

                  {error && (
                    <Alert variant="destructive">
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        {tr.loading}
                      </>
                    ) : (
                      tr.login
                    )}
                  </Button>
                </form>
              </div>
            </TabsContent>
            
            <TabsContent value="signup" className="space-y-4">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signup-name">{tr.name}</Label>
                  <Input
                    id="signup-name"
                    type="text"
                    placeholder={tr.namePlaceholder}
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signup-phone">{tr.phone}</Label>
                  <Input
                    id="signup-phone"
                    type="tel"
                    placeholder={tr.phonePlaceholder}
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signup-email">{tr.email}</Label>
                  <Input
                    id="signup-email"
                    type="email"
                    placeholder={tr.emailPlaceholder}
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signup-password">{tr.password}</Label>
                  <Input
                    id="signup-password"
                    type="password"
                    placeholder={tr.passwordPlaceholder}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="farm-name">{tr.farmName}</Label>
                  <Input
                    id="farm-name"
                    type="text"
                    placeholder={tr.farmPlaceholder}
                    value={formData.farmName}
                    onChange={(e) => setFormData({ ...formData, farmName: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">{tr.location}</Label>
                  <Input
                    id="location"
                    type="text"
                    placeholder={tr.locationPlaceholder}
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="crops">{tr.cropTypes}</Label>
                  <Input
                    id="crops"
                    type="text"
                    placeholder={tr.cropsPlaceholder}
                    value={formData.cropTypes}
                    onChange={(e) => setFormData({ ...formData, cropTypes: e.target.value })}
                    required
                  />
                </div>

                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      {tr.loading}
                    </>
                  ) : (
                    tr.signup
                  )}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};