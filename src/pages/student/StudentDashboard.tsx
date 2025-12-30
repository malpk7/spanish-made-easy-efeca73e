import React from 'react';
import { LanguageProvider } from '@/contexts/LanguageContext';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { useLanguage } from '@/contexts/LanguageContext';
import { mockPacks, mockPayments, bankInfo } from '@/data/mockData';
import { BookOpen, CreditCard, ExternalLink, Clock } from 'lucide-react';

const StudentDashboardContent: React.FC = () => {
  const { user } = useAuth();
  const { t, language } = useLanguage();
  
  const myPayments = mockPayments.filter(p => p.student_id === user?.id);
  const myPacks = myPayments.map(payment => ({
    pack: mockPacks.find(p => p.id === payment.pack_id),
    payment
  })).filter(item => item.pack);

  const statusConfig = {
    pending: { color: 'bg-orange-100 text-orange-700', label: language === 'fr' ? '🟠 En attente' : '🟠 Pending' },
    validated: { color: 'bg-green-100 text-green-700', label: language === 'fr' ? '🟢 Validé' : '🟢 Validated' },
    rejected: { color: 'bg-red-100 text-red-700', label: language === 'fr' ? '🔴 Refusé' : '🔴 Rejected' },
  };

  const canAccessCourse = (pack: typeof mockPacks[0]) => {
    const now = new Date();
    const startDate = new Date(pack.date_start);
    return now >= startDate;
  };

  const formatCourseMessage = (pack: typeof mockPacks[0]) => {
    const startDate = new Date(pack.date_start);
    if (language === 'fr') {
      return `Le cours commencera le ${startDate.toLocaleDateString('fr-FR')} à 10h00`;
    }
    return `The course will start on ${startDate.toLocaleDateString('en-US')} at 10:00 AM`;
  };

  return (
    <DashboardLayout title={language === 'fr' ? 'Mon Espace Étudiant' : 'My Student Dashboard'}>
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Card>
            <CardContent className="p-6 flex items-center gap-4">
              <div className="p-3 rounded-lg bg-primary/10">
                <BookOpen className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{myPacks.length}</p>
                <p className="text-sm text-muted-foreground">{language === 'fr' ? 'Cours inscrits' : 'Enrolled courses'}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 flex items-center gap-4">
              <div className="p-3 rounded-lg bg-green-500/10">
                <CreditCard className="w-6 h-6 text-green-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{myPayments.filter(p => p.status === 'validated').length}</p>
                <p className="text-sm text-muted-foreground">{language === 'fr' ? 'Paiements validés' : 'Validated payments'}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{language === 'fr' ? 'Mes Cours' : 'My Courses'}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {myPacks.map(({ pack, payment }) => pack && (
                <div key={pack.id} className="p-4 border border-border rounded-lg">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold">{pack.title}</h3>
                      <p className="text-sm text-muted-foreground font-mono">{pack.code}</p>
                    </div>
                    <Badge className={statusConfig[payment.status].color}>
                      {statusConfig[payment.status].label}
                    </Badge>
                  </div>
                  
                  <p className="text-sm text-muted-foreground mb-4">{pack.description}</p>
                  
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                    <span>📅 {new Date(pack.date_start).toLocaleDateString(language === 'fr' ? 'fr-FR' : 'en-US')}</span>
                    <span>→</span>
                    <span>{new Date(pack.date_end).toLocaleDateString(language === 'fr' ? 'fr-FR' : 'en-US')}</span>
                  </div>

                  {payment.status === 'validated' && (
                    canAccessCourse(pack) ? (
                      <Button className="w-full gap-2" asChild>
                        <a href={pack.course_link} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="w-4 h-4" />
                          {language === 'fr' ? 'Accéder au cours' : 'Access Course'}
                        </a>
                      </Button>
                    ) : (
                      <div className="p-3 bg-muted rounded-lg text-center">
                        <Clock className="w-5 h-5 mx-auto mb-2 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground">{formatCourseMessage(pack)}</p>
                      </div>
                    )
                  )}

                  {payment.status === 'rejected' && (
                    <Button variant="outline" className="w-full">
                      {language === 'fr' ? 'Modifier la preuve de paiement' : 'Update payment proof'}
                    </Button>
                  )}
                </div>
              ))}
              {myPacks.length === 0 && (
                <p className="text-center text-muted-foreground py-8">
                  {language === 'fr' ? 'Aucun cours inscrit' : 'No enrolled courses'}
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

const StudentDashboard: React.FC = () => (
  <LanguageProvider><StudentDashboardContent /></LanguageProvider>
);

export default StudentDashboard;
