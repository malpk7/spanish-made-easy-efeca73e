import React from 'react';
import { LanguageProvider } from '@/contexts/LanguageContext';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, GraduationCap, Package, CreditCard, TrendingUp, Clock } from 'lucide-react';
import { mockUsers, mockPacks, mockPayments } from '@/data/mockData';

const AdminDashboardContent: React.FC = () => {
  const students = mockUsers.filter(u => u.role === 'student');
  const professors = mockUsers.filter(u => u.role === 'professor');
  const activePacks = mockPacks.filter(p => p.status === 'active');
  const pendingPayments = mockPayments.filter(p => p.status === 'pending');
  const validatedPayments = mockPayments.filter(p => p.status === 'validated');

  const stats = [
    { 
      label: 'Total Étudiants', 
      value: students.length, 
      icon: Users, 
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10' 
    },
    { 
      label: 'Professeurs', 
      value: professors.length, 
      icon: GraduationCap, 
      color: 'text-spanish-gold',
      bgColor: 'bg-spanish-gold/10' 
    },
    { 
      label: 'Packs Actifs', 
      value: activePacks.length, 
      icon: Package, 
      color: 'text-green-500',
      bgColor: 'bg-green-500/10' 
    },
    { 
      label: 'Paiements en attente', 
      value: pendingPayments.length, 
      icon: Clock, 
      color: 'text-orange-500',
      bgColor: 'bg-orange-500/10' 
    },
  ];

  return (
    <DashboardLayout title="Tableau de bord Admin">
      <div className="space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <Card key={stat.label}>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                    <stat.icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Payments */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-spanish-red" />
                Paiements récents
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockPayments.slice(0, 5).map((payment) => {
                  const student = students.find(s => s.id === payment.student_id);
                  const pack = mockPacks.find(p => p.id === payment.pack_id);
                  const statusColors = {
                    pending: 'bg-orange-100 text-orange-700',
                    validated: 'bg-green-100 text-green-700',
                    rejected: 'bg-red-100 text-red-700',
                  };
                  const statusLabels = {
                    pending: '🟠 En attente',
                    validated: '🟢 Validé',
                    rejected: '🔴 Refusé',
                  };
                  
                  return (
                    <div key={payment.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <div>
                        <p className="font-medium">{student?.first_name} {student?.last_name}</p>
                        <p className="text-sm text-muted-foreground">{pack?.title}</p>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full ${statusColors[payment.status]}`}>
                        {statusLabels[payment.status]}
                      </span>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Recent Students */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5 text-spanish-gold" />
                Étudiants récents
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {students.slice(0, 5).map((student) => (
                  <div key={student.id} className="flex items-center gap-4 p-3 bg-muted/50 rounded-lg">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="font-medium text-primary">
                        {student.first_name[0]}{student.last_name[0]}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{student.first_name} {student.last_name}</p>
                      <p className="text-sm text-muted-foreground truncate">{student.email}</p>
                    </div>
                    <span className="text-xs text-muted-foreground">{student.city}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Active Packs */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="w-5 h-5 text-green-500" />
              Packs actifs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {activePacks.map((pack) => {
                const enrolledCount = mockPayments.filter(
                  p => p.pack_id === pack.id && p.status === 'validated'
                ).length;
                
                return (
                  <div key={pack.id} className="p-4 border border-border rounded-lg">
                    <div className="flex items-start justify-between mb-2">
                      <span className="text-xs bg-spanish-gold/20 text-spanish-gold px-2 py-1 rounded font-mono">
                        {pack.code}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {enrolledCount} inscrit(s)
                      </span>
                    </div>
                    <h3 className="font-semibold mb-1">{pack.title}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                      {pack.description}
                    </p>
                    <div className="text-xs text-muted-foreground space-y-1">
                      <p>📅 Début: {new Date(pack.date_start).toLocaleDateString('fr-FR')}</p>
                      <p>⏰ Inscription jusqu'au: {new Date(pack.date_deadline).toLocaleDateString('fr-FR')}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

const AdminDashboard: React.FC = () => {
  return (
    <LanguageProvider>
      <AdminDashboardContent />
    </LanguageProvider>
  );
};

export default AdminDashboard;
