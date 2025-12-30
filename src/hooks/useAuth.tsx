import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { mockUsers, DEMO_CREDENTIALS, type AppRole, type MockUser } from '@/data/mockData';

interface AuthContextType {
  user: MockUser | null;
  loading: boolean;
  role: AppRole | null;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUp: (email: string, password: string, metadata: SignUpMetadata) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  demoCredentials: typeof DEMO_CREDENTIALS;
}

interface SignUpMetadata {
  first_name: string;
  last_name: string;
  phone: string;
  city: string;
  date_of_birth: string;
  profession?: string;
  recommendations?: string[];
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<MockUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState<AppRole | null>(null);

  // Check for existing session on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('espanol-facil-user');
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser) as MockUser;
        setUser(parsedUser);
        setRole(parsedUser.role);
      } catch (e) {
        localStorage.removeItem('espanol-facil-user');
      }
    }
    setLoading(false);
  }, []);

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Find user in mock data
      const foundUser = mockUsers.find(
        u => u.email.toLowerCase() === email.toLowerCase() && u.password === password
      );
      
      if (foundUser) {
        setUser(foundUser);
        setRole(foundUser.role);
        localStorage.setItem('espanol-facil-user', JSON.stringify(foundUser));
        return { error: null };
      }
      
      return { error: new Error('Email ou mot de passe incorrect') };
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, metadata: SignUpMetadata) => {
    setLoading(true);
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Check if email already exists
      const existingUser = mockUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
      if (existingUser) {
        return { error: new Error('Cet email est déjà utilisé') };
      }
      
      // Create new student user (in real app, this would be saved to database)
      const newUser: MockUser = {
        id: `student-${Date.now()}`,
        email,
        password,
        role: 'student',
        code: String(20000 + mockUsers.filter(u => u.role === 'student').length + 1).padStart(5, '0'),
        first_name: metadata.first_name,
        last_name: metadata.last_name,
        phone: metadata.phone,
        city: metadata.city,
        date_of_birth: metadata.date_of_birth,
        profession: metadata.profession,
        date_inscription: new Date().toISOString().split('T')[0],
      };
      
      // Add to mock users (won't persist after refresh in MVP)
      mockUsers.push(newUser);
      
      // Auto-login after signup
      setUser(newUser);
      setRole(newUser.role);
      localStorage.setItem('espanol-facil-user', JSON.stringify(newUser));
      
      return { error: null };
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    setUser(null);
    setRole(null);
    localStorage.removeItem('espanol-facil-user');
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      role, 
      signIn, 
      signUp, 
      signOut,
      demoCredentials: DEMO_CREDENTIALS 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
