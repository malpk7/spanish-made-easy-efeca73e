import React from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { 
  LayoutDashboard, 
  Users, 
  GraduationCap, 
  Package, 
  CreditCard, 
  LogOut,
  Menu,
  X,
  BookOpen,
  User
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface DashboardLayoutProps {
  children: React.ReactNode;
  title: string;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children, title }) => {
  const { t } = useLanguage();
  const { user, role, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  const adminLinks = [
    { to: '/admin', icon: LayoutDashboard, label: 'Dashboard', end: true },
    { to: '/admin/students', icon: Users, label: 'Étudiants' },
    { to: '/admin/professors', icon: GraduationCap, label: 'Professeurs' },
    { to: '/admin/packs', icon: Package, label: 'Packs' },
    { to: '/admin/payments', icon: CreditCard, label: 'Paiements' },
  ];

  const professorLinks = [
    { to: '/professor', icon: LayoutDashboard, label: 'Dashboard', end: true },
    { to: '/professor/courses', icon: BookOpen, label: 'Mes Cours' },
    { to: '/professor/students', icon: Users, label: 'Mes Étudiants' },
  ];

  const studentLinks = [
    { to: '/student', icon: LayoutDashboard, label: 'Dashboard', end: true },
    { to: '/student/courses', icon: BookOpen, label: 'Mes Cours' },
    { to: '/student/packs', icon: Package, label: 'Catalogue' },
    { to: '/student/profile', icon: User, label: 'Mon Profil' },
  ];

  const links = role === 'admin' ? adminLinks : role === 'professor' ? professorLinks : studentLinks;
  const basePath = role === 'admin' ? '/admin' : role === 'professor' ? '/professor' : '/student';

  const roleColors = {
    admin: 'bg-spanish-red',
    professor: 'bg-spanish-gold',
    student: 'bg-primary',
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 bg-card border-r border-border transform transition-transform duration-200 lg:translate-x-0 lg:static",
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-border">
            <div className="flex items-center justify-between">
              <div>
                <span className="font-display text-xl font-bold text-spanish-red">Español</span>
                {' '}
                <span className="font-display text-xl font-bold text-spanish-gold">Fácil</span>
              </div>
              <button onClick={() => setSidebarOpen(false)} className="lg:hidden">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className={cn(
              "mt-2 inline-flex items-center px-2 py-1 rounded text-xs font-medium text-white",
              roleColors[role || 'student']
            )}>
              {role === 'admin' ? 'Administrateur' : role === 'professor' ? 'Professeur' : 'Étudiant'}
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.end}
                className={({ isActive }) => cn(
                  "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
                  isActive 
                    ? "bg-primary text-primary-foreground" 
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
                onClick={() => setSidebarOpen(false)}
              >
                <link.icon className="w-5 h-5" />
                <span className="font-medium">{link.label}</span>
              </NavLink>
            ))}
          </nav>

          {/* User info & logout */}
          <div className="p-4 border-t border-border">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                <User className="w-5 h-5 text-muted-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{user?.first_name} {user?.last_name}</p>
                <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
              </div>
            </div>
            <Button variant="outline" className="w-full justify-start gap-2" onClick={handleLogout}>
              <LogOut className="w-4 h-4" />
              Déconnexion
            </Button>
          </div>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden" 
          onClick={() => setSidebarOpen(false)} 
        />
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="sticky top-0 z-30 bg-background border-b border-border px-4 lg:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setSidebarOpen(true)} 
              className="lg:hidden p-2 hover:bg-muted rounded-lg"
            >
              <Menu className="w-5 h-5" />
            </button>
            <h1 className="text-xl font-semibold">{title}</h1>
          </div>
          <LanguageSwitcher />
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 lg:p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
