import React from 'react';
import { LanguageProvider } from '@/contexts/LanguageContext';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { mockPacks, mockPayments, mockUsers } from '@/data/mockData';
import { Users, BookOpen, Calendar } from 'lucide-react';

const ProfessorDashboardContent: React.FC = () => {
  const { user } = useAuth();
  
  const myPacks = mockPacks.filter(p => p.assigned_professors.includes(user?.id || ''));
  const students = mockUsers.filter(u => u.role === 'student');
  
  const getEnrolledStudents = (packId: string) => {
    const validatedPayments = mockPayments.filter(p => p.pack_id === packId && p.status === 'validated');
    return validatedPayments.map(p => students.find(s => s.id === p.student_id)).filter(Boolean);
  };

  return (
    <DashboardLayout title="Tableau de bord Professeur">
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-6 flex items-center gap-4">
              <div className="p-3 rounded-lg bg-spanish-gold/10">
                <BookOpen className="w-6 h-6 text-spanish-gold" />
              </div>
              <div>
                <p className="text-2xl font-bold">{myPacks.length}</p>
                <p className="text-sm text-muted-foreground">Cours assignés</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 flex items-center gap-4">
              <div className="p-3 rounded-lg bg-primary/10">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {myPacks.reduce((sum, pack) => sum + getEnrolledStudents(pack.id).length, 0)}
                </p>
                <p className="text-sm text-muted-foreground">Total étudiants</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 flex items-center gap-4">
              <div className="p-3 rounded-lg bg-green-500/10">
                <Calendar className="w-6 h-6 text-green-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{myPacks.filter(p => p.status === 'active').length}</p>
                <p className="text-sm text-muted-foreground">Cours actifs</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Mes Cours</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {myPacks.map(pack => {
                const enrolledStudents = getEnrolledStudents(pack.id);
                return (
                  <div key={pack.id} className="p-4 border border-border rounded-lg">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-semibold">{pack.title}</h3>
                        <p className="text-sm text-muted-foreground font-mono">{pack.code}</p>
                      </div>
                      <Badge className={pack.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}>
                        {pack.status === 'active' ? 'Actif' : 'Inactif'}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">{pack.description}</p>
                    <div className="flex items-center gap-4 text-sm">
                      <span>📅 {new Date(pack.date_start).toLocaleDateString('fr-FR')}</span>
                      <span>👥 {enrolledStudents.length} étudiants</span>
                    </div>
                  </div>
                );
              })}
              {myPacks.length === 0 && (
                <p className="text-center text-muted-foreground py-8">Aucun cours assigné</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

const ProfessorDashboard: React.FC = () => (
  <LanguageProvider><ProfessorDashboardContent /></LanguageProvider>
);

export default ProfessorDashboard;
