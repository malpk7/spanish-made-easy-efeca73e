import { useState, useEffect, createContext, useContext, ReactNode } from 'react';

type AppRole = 'admin' | 'professor' | 'student';

interface AuthContextType {
  user: { id: string; email: string } | null;
  loading: boolean;
  role: AppRole | null;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUp: (email: string, password: string, metadata: SignUpMetadata) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
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
  const [user, setUser] = useState<{ id: string; email: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState<AppRole | null>(null);

  // Mock implementation - will be replaced with Supabase integration
  const signIn = async (email: string, password: string) => {
    setLoading(true);
    try {
      // Mock sign in - replace with actual Supabase auth
      if (email && password) {
        setUser({ id: '1', email });
        setRole('student');
        return { error: null };
      }
      return { error: new Error('Invalid credentials') };
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, metadata: SignUpMetadata) => {
    setLoading(true);
    try {
      // Mock sign up - replace with actual Supabase auth
      if (email && password && metadata.first_name && metadata.last_name) {
        return { error: null };
      }
      return { error: new Error('Invalid data') };
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    setUser(null);
    setRole(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, role, signIn, signUp, signOut }}>
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
