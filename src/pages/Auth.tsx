import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage, LanguageProvider } from '@/contexts/LanguageContext';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Loader2, ArrowLeft, User, GraduationCap, Shield } from 'lucide-react';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { moroccanCities } from '@/data/mockData';

const DemoCredentials: React.FC = () => {
  const { demoCredentials } = useAuth();
  const { t } = useLanguage();
  
  const roles = [
    { key: 'admin', icon: Shield, label: 'Admin', color: 'text-spanish-red' },
    { key: 'professor', icon: GraduationCap, label: 'Professeur', color: 'text-spanish-gold' },
    { key: 'student', icon: User, label: 'Étudiant', color: 'text-primary' },
  ] as const;

  return (
    <div className="mt-6 p-4 bg-muted/50 rounded-lg border border-border">
      <p className="text-sm font-medium text-center mb-3 text-muted-foreground">
        🔐 Comptes de démonstration
      </p>
      <div className="space-y-2">
        {roles.map(({ key, icon: Icon, label, color }) => (
          <div key={key} className="flex items-center justify-between text-xs bg-background p-2 rounded">
            <div className="flex items-center gap-2">
              <Icon className={`w-4 h-4 ${color}`} />
              <span className="font-medium">{label}</span>
            </div>
            <div className="text-muted-foreground">
              <span>{demoCredentials[key].email}</span>
              <span className="mx-1">/</span>
              <span>{demoCredentials[key].password}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const AuthPage: React.FC = () => {
  const { t } = useLanguage();
  const { signIn, signUp, loading, user, role } = useAuth();
  const navigate = useNavigate();
  
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  
  const [registerData, setRegisterData] = useState({
    email: '',
    password: '',
    first_name: '',
    last_name: '',
    phone: '',
    city: '',
    date_of_birth: '',
    profession: '',
  });

  // Redirect if already logged in
  useEffect(() => {
    if (user && role) {
      if (role === 'admin') navigate('/admin');
      else if (role === 'professor') navigate('/professor');
      else navigate('/student');
    }
  }, [user, role, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await signIn(loginEmail, loginPassword);
    if (error) {
      toast.error(t('common.error'), { description: error.message });
    } else {
      toast.success(t('common.success'), { description: 'Connexion réussie!' });
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    const { email, password, ...metadata } = registerData;
    const { error } = await signUp(email, password, metadata);
    if (error) {
      toast.error(t('common.error'), { description: error.message });
    } else {
      toast.success(t('common.success'), { description: 'Inscription réussie!' });
    }
  };

  const fillDemoCredentials = (role: 'admin' | 'professor' | 'student') => {
    const { email, password } = { 
      admin: { email: 'admin@espanolfacil.com', password: 'admin123' },
      professor: { email: 'prof@espanolfacil.com', password: 'prof123' },
      student: { email: 'student@espanolfacil.com', password: 'student123' },
    }[role];
    setLoginEmail(email);
    setLoginPassword(password);
  };

  return (
    <div className="min-h-screen bg-gradient-warm flex items-center justify-center p-4">
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-spanish-gold/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-spanish-red/10 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Button variant="ghost" onClick={() => navigate('/')} className="gap-2">
            <ArrowLeft size={16} />
            {t('nav.home')}
          </Button>
          <LanguageSwitcher />
        </div>

        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="font-display text-3xl font-bold">
            <span className="text-spanish-red">Español</span>
            {' '}
            <span className="text-spanish-gold">Fácil</span>
          </h1>
        </div>

        <Card className="shadow-lg border-border/50">
          <Tabs defaultValue="login" className="w-full">
            <CardHeader>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">{t('auth.login')}</TabsTrigger>
                <TabsTrigger value="register">{t('auth.register')}</TabsTrigger>
              </TabsList>
            </CardHeader>
            
            <CardContent>
              <TabsContent value="login">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-email">{t('auth.email')}</Label>
                    <Input
                      id="login-email"
                      type="email"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      placeholder="email@example.com"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="login-password">{t('auth.password')}</Label>
                    <Input
                      id="login-password"
                      type="password"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                    />
                  </div>
                  
                  {/* Quick fill buttons */}
                  <div className="flex gap-2 flex-wrap">
                    <Button type="button" variant="outline" size="sm" onClick={() => fillDemoCredentials('admin')} className="text-xs">
                      <Shield className="w-3 h-3 mr-1" /> Admin
                    </Button>
                    <Button type="button" variant="outline" size="sm" onClick={() => fillDemoCredentials('professor')} className="text-xs">
                      <GraduationCap className="w-3 h-3 mr-1" /> Prof
                    </Button>
                    <Button type="button" variant="outline" size="sm" onClick={() => fillDemoCredentials('student')} className="text-xs">
                      <User className="w-3 h-3 mr-1" /> Étudiant
                    </Button>
                  </div>
                  
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
                    {t('auth.login')}
                  </Button>
                </form>
                
                <DemoCredentials />
              </TabsContent>

              <TabsContent value="register">
                <form onSubmit={handleRegister} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="first_name">Prénom *</Label>
                      <Input
                        id="first_name"
                        value={registerData.first_name}
                        onChange={(e) => setRegisterData({ ...registerData, first_name: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="last_name">Nom *</Label>
                      <Input
                        id="last_name"
                        value={registerData.last_name}
                        onChange={(e) => setRegisterData({ ...registerData, last_name: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="register-email">{t('auth.email')} *</Label>
                    <Input
                      id="register-email"
                      type="email"
                      value={registerData.email}
                      onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                      placeholder="email@example.com"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="register-password">{t('auth.password')} *</Label>
                    <Input
                      id="register-password"
                      type="password"
                      value={registerData.password}
                      onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                      placeholder="••••••••"
                      required
                      minLength={6}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="phone">Téléphone *</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={registerData.phone}
                        onChange={(e) => setRegisterData({ ...registerData, phone: e.target.value })}
                        placeholder="+212 6XX XXX XXX"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="city">Ville *</Label>
                      <Select 
                        value={registerData.city} 
                        onValueChange={(value) => setRegisterData({ ...registerData, city: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Choisir..." />
                        </SelectTrigger>
                        <SelectContent>
                          {moroccanCities.map(city => (
                            <SelectItem key={city} value={city}>{city}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="date_of_birth">Date de naissance *</Label>
                      <Input
                        id="date_of_birth"
                        type="date"
                        value={registerData.date_of_birth}
                        onChange={(e) => setRegisterData({ ...registerData, date_of_birth: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="profession">Profession</Label>
                      <Input
                        id="profession"
                        value={registerData.profession}
                        onChange={(e) => setRegisterData({ ...registerData, profession: e.target.value })}
                        placeholder="Optionnel"
                      />
                    </div>
                  </div>
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
                    {t('auth.register')}
                  </Button>
                </form>
              </TabsContent>
            </CardContent>
          </Tabs>
        </Card>
      </div>
    </div>
  );
};

const Auth: React.FC = () => {
  return (
    <LanguageProvider>
      <AuthPage />
    </LanguageProvider>
  );
};

export default Auth;
