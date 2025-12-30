import React, { useState } from 'react';
import { LanguageProvider, useLanguage } from '@/contexts/LanguageContext';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/hooks/useAuth';
import { mockPacks, mockPayments, bankInfo, type Pack, type Payment } from '@/data/mockData';
import { BookOpen, CreditCard, ExternalLink, Clock, Upload, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

const StudentDashboardContent: React.FC = () => {
  const { user } = useAuth();
  const { language } = useLanguage();

  const [payments, setPayments] = useState(mockPayments.filter(p => p.student_id === user?.id));
  const [enrollDialogOpen, setEnrollDialogOpen] = useState(false);
  const [selectedPack, setSelectedPack] = useState<Pack | null>(null);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [proofUrl, setProofUrl] = useState('');

  const myPacks = payments.map(payment => ({
    pack: mockPacks.find(p => p.id === payment.pack_id),
    payment
  })).filter(item => item.pack);

  const availablePacks = mockPacks.filter(pack =>
    pack.status === 'active' &&
    !payments.some(p => p.pack_id === pack.id) &&
    new Date(pack.date_deadline) >= new Date()
  );

  const statusConfig = {
    pending: { color: 'bg-orange-100 text-orange-700', label: language === 'fr' ? '🟠 En attente' : '🟠 Pending' },
    validated: { color: 'bg-green-100 text-green-700', label: language === 'fr' ? '🟢 Validé' : '🟢 Validated' },
    rejected: { color: 'bg-red-100 text-red-700', label: language === 'fr' ? '🔴 Refusé' : '🔴 Rejected' },
  };

  const canAccessCourse = (pack: Pack) => {
    const now = new Date();
    const startDate = new Date(pack.date_start);
    return now >= startDate;
  };

  const formatCourseMessage = (pack: Pack) => {
    const startDate = new Date(pack.date_start);
    if (language === 'fr') {
      return `Le cours commencera le ${startDate.toLocaleDateString('fr-FR')} à 10h00`;
    }
    return `The course will start on ${startDate.toLocaleDateString('en-US')} at 10:00 AM`;
  };

  const isDeadlinePassed = (pack: Pack) => {
    return new Date(pack.date_deadline) < new Date();
  };

  const handleEnroll = (pack: Pack) => {
    setSelectedPack(pack);
    setEnrollDialogOpen(true);
  };

  const handleSubmitEnrollment = () => {
    if (!selectedPack || !proofUrl) return;

    const newPayment: Payment = {
      id: `payment-${Date.now()}`,
      student_id: user?.id || '',
      pack_id: selectedPack.id,
      proof_image: proofUrl,
      status: 'pending',
      date_payment: new Date().toISOString().split('T')[0],
    };

    setPayments(prev => [...prev, newPayment]);
    setEnrollDialogOpen(false);
    setProofUrl('');
    setSelectedPack(null);
    toast.success(language === 'fr' ? 'Inscription soumise avec succès!' : 'Enrollment submitted successfully!');
  };

  const handleUpdateProof = (payment: Payment) => {
    setSelectedPayment(payment);
    setProofUrl('');
    setUploadDialogOpen(true);
  };

  const handleSubmitNewProof = () => {
    if (!selectedPayment || !proofUrl) return;

    setPayments(prev => prev.map(p =>
      p.id === selectedPayment.id ? { ...p, proof_image: proofUrl, status: 'pending' as const } : p
    ));
    setUploadDialogOpen(false);
    setProofUrl('');
    setSelectedPayment(null);
    toast.success(language === 'fr' ? 'Preuve de paiement mise à jour!' : 'Payment proof updated!');
  };

  const getMotif = (packCode: string) => {
    return bankInfo.motif.replace('{PACK_CODE}', packCode).replace('{STUDENT_CODE}', user?.code || '');
  };

  return (
    <DashboardLayout title={language === 'fr' ? 'Mon Espace Étudiant' : 'My Student Dashboard'}>
      <div className="space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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
                <p className="text-2xl font-bold">{payments.filter(p => p.status === 'validated').length}</p>
                <p className="text-sm text-muted-foreground">{language === 'fr' ? 'Paiements validés' : 'Validated payments'}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 flex items-center gap-4">
              <div className="p-3 rounded-lg bg-orange-500/10">
                <Clock className="w-6 h-6 text-orange-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{payments.filter(p => p.status === 'pending').length}</p>
                <p className="text-sm text-muted-foreground">{language === 'fr' ? 'En attente' : 'Pending'}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="my-courses">
          <TabsList>
            <TabsTrigger value="my-courses">{language === 'fr' ? 'Mes Cours' : 'My Courses'}</TabsTrigger>
            <TabsTrigger value="catalog">{language === 'fr' ? 'Catalogue' : 'Catalog'}</TabsTrigger>
          </TabsList>

          <TabsContent value="my-courses">
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
                        <div className="space-y-2">
                          <div className="p-3 bg-red-50 rounded-lg flex items-center gap-2">
                            <AlertCircle className="w-5 h-5 text-red-500" />
                            <p className="text-sm text-red-700">
                              {language === 'fr' ? 'Votre paiement a été refusé. Veuillez soumettre une nouvelle preuve.' : 'Your payment was rejected. Please submit a new proof.'}
                            </p>
                          </div>
                          <Button variant="outline" className="w-full gap-2" onClick={() => handleUpdateProof(payment)}>
                            <Upload className="w-4 h-4" />
                            {language === 'fr' ? 'Modifier la preuve de paiement' : 'Update payment proof'}
                          </Button>
                        </div>
                      )}

                      {payment.status === 'pending' && (
                        <div className="p-3 bg-orange-50 rounded-lg flex items-center gap-2">
                          <Clock className="w-5 h-5 text-orange-500" />
                          <p className="text-sm text-orange-700">
                            {language === 'fr' ? 'Votre paiement est en cours de vérification.' : 'Your payment is being verified.'}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                  {myPacks.length === 0 && (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground mb-4">
                        {language === 'fr' ? 'Aucun cours inscrit' : 'No enrolled courses'}
                      </p>
                      <Button onClick={() => document.querySelector('[value="catalog"]')?.dispatchEvent(new Event('click', { bubbles: true }))}>
                        {language === 'fr' ? 'Voir le catalogue' : 'View catalog'}
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="catalog">
            <Card>
              <CardHeader>
                <CardTitle>{language === 'fr' ? 'Cours Disponibles' : 'Available Courses'}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {availablePacks.map(pack => (
                    <div key={pack.id} className="p-4 border border-border rounded-lg">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-semibold">{pack.title}</h3>
                          <p className="text-sm text-muted-foreground font-mono">{pack.code}</p>
                        </div>
                        <Badge className="bg-green-100 text-green-700">
                          {language === 'fr' ? 'Disponible' : 'Available'}
                        </Badge>
                      </div>

                      <p className="text-sm text-muted-foreground mb-3">{pack.description}</p>

                      {pack.media_type === 'image' && (
                        <img src={pack.media_link} alt={pack.title} className="w-full h-32 object-cover rounded-lg mb-3" />
                      )}

                      <div className="text-sm text-muted-foreground mb-3 space-y-1">
                        <p>📅 {language === 'fr' ? 'Début' : 'Start'}: {new Date(pack.date_start).toLocaleDateString(language === 'fr' ? 'fr-FR' : 'en-US')}</p>
                        <p>⏰ {language === 'fr' ? 'Limite inscription' : 'Registration deadline'}: {new Date(pack.date_deadline).toLocaleDateString(language === 'fr' ? 'fr-FR' : 'en-US')}</p>
                      </div>

                      <Button className="w-full" onClick={() => handleEnroll(pack)} disabled={isDeadlinePassed(pack)}>
                        {isDeadlinePassed(pack)
                          ? (language === 'fr' ? 'Inscription fermée' : 'Registration closed')
                          : (language === 'fr' ? "S'inscrire" : 'Enroll')}
                      </Button>
                    </div>
                  ))}
                  {availablePacks.length === 0 && (
                    <div className="col-span-2 text-center py-8 text-muted-foreground">
                      {language === 'fr' ? 'Aucun cours disponible pour le moment' : 'No courses available at the moment'}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Enrollment Dialog */}
        <Dialog open={enrollDialogOpen} onOpenChange={setEnrollDialogOpen}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>{language === 'fr' ? "S'inscrire au cours" : 'Enroll in Course'}</DialogTitle>
            </DialogHeader>
            {selectedPack && (
              <div className="space-y-4">
                <div className="p-4 bg-muted rounded-lg">
                  <h3 className="font-semibold">{selectedPack.title}</h3>
                  <p className="text-sm text-muted-foreground font-mono">{selectedPack.code}</p>
                </div>

                <div className="p-4 border border-border rounded-lg">
                  <h4 className="font-semibold mb-3">{language === 'fr' ? 'Informations de virement' : 'Bank Transfer Information'}</h4>
                  <div className="space-y-2 text-sm">
                    <p><span className="text-muted-foreground">{language === 'fr' ? 'Banque' : 'Bank'}:</span> {bankInfo.bankName}</p>
                    <p><span className="text-muted-foreground">{language === 'fr' ? 'Titulaire' : 'Account holder'}:</span> {bankInfo.accountHolder}</p>
                    <p><span className="text-muted-foreground">RIB:</span> <span className="font-mono">{bankInfo.rib}</span></p>
                    <p><span className="text-muted-foreground">SWIFT:</span> <span className="font-mono">{bankInfo.swift}</span></p>
                    <p><span className="text-muted-foreground">{language === 'fr' ? 'Motif' : 'Reference'}:</span> <span className="font-mono font-semibold">{getMotif(selectedPack.code)}</span></p>
                  </div>
                </div>

                <div>
                  <Label>{language === 'fr' ? 'Lien de la preuve de paiement (capture d\'écran)' : 'Payment proof link (screenshot)'}</Label>
                  <Input
                    placeholder="https://..."
                    value={proofUrl}
                    onChange={(e) => setProofUrl(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    {language === 'fr' ? 'Uploadez votre capture sur un service de partage et collez le lien ici' : 'Upload your screenshot to a sharing service and paste the link here'}
                  </p>
                </div>

                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setEnrollDialogOpen(false)}>
                    {language === 'fr' ? 'Annuler' : 'Cancel'}
                  </Button>
                  <Button onClick={handleSubmitEnrollment} disabled={!proofUrl}>
                    {language === 'fr' ? 'Soumettre' : 'Submit'}
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Update Proof Dialog */}
        <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>{language === 'fr' ? 'Modifier la preuve de paiement' : 'Update Payment Proof'}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>{language === 'fr' ? 'Nouveau lien de la preuve de paiement' : 'New payment proof link'}</Label>
                <Input
                  placeholder="https://..."
                  value={proofUrl}
                  onChange={(e) => setProofUrl(e.target.value)}
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setUploadDialogOpen(false)}>
                  {language === 'fr' ? 'Annuler' : 'Cancel'}
                </Button>
                <Button onClick={handleSubmitNewProof} disabled={!proofUrl}>
                  {language === 'fr' ? 'Soumettre' : 'Submit'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
};

const StudentDashboard: React.FC = () => (
  <LanguageProvider><StudentDashboardContent /></LanguageProvider>
);

export default StudentDashboard;
