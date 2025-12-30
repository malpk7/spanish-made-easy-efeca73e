import React, { useState } from 'react';
import { LanguageProvider, useLanguage } from '@/contexts/LanguageContext';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Check, X, Eye, Clock, CheckCircle, XCircle } from 'lucide-react';
import { mockPayments, mockUsers, mockPacks, type Payment } from '@/data/mockData';
import { toast } from 'sonner';

const AdminPaymentsContent: React.FC = () => {
  const { language } = useLanguage();
  const [payments, setPayments] = useState(mockPayments);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('all');

  const students = mockUsers.filter(u => u.role === 'student');

  const getStudent = (studentId: string) => students.find(s => s.id === studentId);
  const getPack = (packId: string) => mockPacks.find(p => p.id === packId);

  const filteredPayments = payments.filter(payment => {
    const student = getStudent(payment.student_id);
    const pack = getPack(payment.pack_id);
    const matchesSearch =
      student?.first_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student?.last_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pack?.code.toLowerCase().includes(searchQuery.toLowerCase());

    if (activeTab === 'all') return matchesSearch;
    return matchesSearch && payment.status === activeTab;
  });

  const handleUpdatePaymentStatus = (paymentId: string, status: 'pending' | 'validated' | 'rejected') => {
    setPayments(prev => prev.map(p =>
      p.id === paymentId ? { ...p, status } : p
    ));
    const messages = {
      validated: language === 'fr' ? 'Paiement validé - Étudiant ajouté au groupe du cours' : 'Payment validated - Student added to course group',
      rejected: language === 'fr' ? "Paiement refusé - L'étudiant peut modifier la capture" : 'Payment rejected - Student can update the proof',
      pending: language === 'fr' ? 'Paiement remis en attente' : 'Payment set to pending',
    };
    toast.success(messages[status]);
    if (selectedPayment?.id === paymentId) {
      setSelectedPayment({ ...selectedPayment, status });
    }
  };

  const handleViewPayment = (payment: Payment) => {
    setSelectedPayment(payment);
    setViewDialogOpen(true);
  };

  const statusConfig = {
    pending: {
      color: 'bg-orange-100 text-orange-700 border-orange-200',
      icon: Clock,
      label: language === 'fr' ? '🟠 En attente' : '🟠 Pending'
    },
    validated: {
      color: 'bg-green-100 text-green-700 border-green-200',
      icon: CheckCircle,
      label: language === 'fr' ? '🟢 Validé' : '🟢 Validated'
    },
    rejected: {
      color: 'bg-red-100 text-red-700 border-red-200',
      icon: XCircle,
      label: language === 'fr' ? '🔴 Refusé' : '🔴 Rejected'
    },
  };

  const stats = {
    all: payments.length,
    pending: payments.filter(p => p.status === 'pending').length,
    validated: payments.filter(p => p.status === 'validated').length,
    rejected: payments.filter(p => p.status === 'rejected').length,
  };

  return (
    <DashboardLayout title={language === 'fr' ? 'Gestion des Paiements' : 'Payment Management'}>
      <div className="space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <Card className="cursor-pointer shadow-sm hover:shadow-md transition-shadow" onClick={() => setActiveTab('all')}>
            <CardContent className="p-4">
              <p className="text-2xl font-bold">{stats.all}</p>
              <p className="text-sm text-muted-foreground">{language === 'fr' ? 'Total paiements' : 'Total payments'}</p>
            </CardContent>
          </Card>
          <Card className="cursor-pointer shadow-sm hover:shadow-md transition-shadow" onClick={() => setActiveTab('pending')}>
            <CardContent className="p-4">
              <p className="text-2xl font-bold text-orange-500">{stats.pending}</p>
              <p className="text-sm text-muted-foreground">{language === 'fr' ? 'En attente' : 'Pending'}</p>
            </CardContent>
          </Card>
          <Card className="cursor-pointer shadow-sm hover:shadow-md transition-shadow" onClick={() => setActiveTab('validated')}>
            <CardContent className="p-4">
              <p className="text-2xl font-bold text-green-500">{stats.validated}</p>
              <p className="text-sm text-muted-foreground">{language === 'fr' ? 'Validés' : 'Validated'}</p>
            </CardContent>
          </Card>
          <Card className="cursor-pointer shadow-sm hover:shadow-md transition-shadow" onClick={() => setActiveTab('rejected')}>
            <CardContent className="p-4">
              <p className="text-2xl font-bold text-red-500">{stats.rejected}</p>
              <p className="text-sm text-muted-foreground">{language === 'fr' ? 'Refusés' : 'Rejected'}</p>
            </CardContent>
          </Card>
        </div>

        {/* Search & Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder={language === 'fr' ? 'Rechercher par étudiant ou pack...' : 'Search by student or pack...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-auto">
            <TabsList>
              <TabsTrigger value="all">{language === 'fr' ? 'Tous' : 'All'}</TabsTrigger>
              <TabsTrigger value="pending">{language === 'fr' ? 'En attente' : 'Pending'}</TabsTrigger>
              <TabsTrigger value="validated">{language === 'fr' ? 'Validés' : 'Validated'}</TabsTrigger>
              <TabsTrigger value="rejected">{language === 'fr' ? 'Refusés' : 'Rejected'}</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Payments Table */}
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>{language === 'fr' ? 'Étudiant' : 'Student'}</TableHead>
                    <TableHead>Pack</TableHead>
                    <TableHead>{language === 'fr' ? 'Preuve' : 'Proof'}</TableHead>
                    <TableHead>{language === 'fr' ? 'Statut' : 'Status'}</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPayments.map((payment) => {
                    const student = getStudent(payment.student_id);
                    const pack = getPack(payment.pack_id);
                    const StatusIcon = statusConfig[payment.status].icon;

                    return (
                      <TableRow key={payment.id}>
                        <TableCell className="text-sm">
                          {new Date(payment.date_payment).toLocaleDateString(language === 'fr' ? 'fr-FR' : 'en-US')}
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{student?.first_name} {student?.last_name}</p>
                            <p className="text-xs text-muted-foreground">{student?.code}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{pack?.title}</p>
                            <p className="text-xs text-muted-foreground font-mono">{pack?.code}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <img
                            src={payment.proof_image}
                            alt={language === 'fr' ? 'Preuve de paiement' : 'Payment proof'}
                            className="w-16 h-12 object-cover rounded cursor-pointer shadow-sm hover:shadow-md transition-shadow"
                            onClick={() => handleViewPayment(payment)}
                          />
                        </TableCell>
                        <TableCell>
                          <Select
                            value={payment.status}
                            onValueChange={(value: 'pending' | 'validated' | 'rejected') => handleUpdatePaymentStatus(payment.id, value)}
                          >
                            <SelectTrigger className="w-40 h-8">
                              <Badge className={statusConfig[payment.status].color}>
                                <StatusIcon className="w-3 h-3 mr-1" />
                                {statusConfig[payment.status].label}
                              </Badge>
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pending">{language === 'fr' ? 'En attente' : 'Pending'}</SelectItem>
                              <SelectItem value="validated">{language === 'fr' ? 'Validé' : 'Validated'}</SelectItem>
                              <SelectItem value="rejected">{language === 'fr' ? 'Refusé' : 'Rejected'}</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell>
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleViewPayment(payment)}
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                            {payment.status === 'pending' && (
                              <>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="text-green-600"
                                  onClick={() => handleUpdatePaymentStatus(payment.id, 'validated')}
                                >
                                  <Check className="w-4 h-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="text-red-600"
                                  onClick={() => handleUpdatePaymentStatus(payment.id, 'rejected')}
                                >
                                  <X className="w-4 h-4" />
                                </Button>
                              </>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                  {filteredPayments.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                        {language === 'fr' ? 'Aucun paiement trouvé' : 'No payments found'}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* View Payment Dialog */}
        <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{language === 'fr' ? 'Détails du paiement' : 'Payment Details'}</DialogTitle>
            </DialogHeader>
            {selectedPayment && (() => {
              const student = getStudent(selectedPayment.student_id);
              const pack = getPack(selectedPayment.pack_id);

              return (
                <div className="space-y-6">
                  {/* Student & Pack Info */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-muted rounded-lg">
                      <p className="text-sm text-muted-foreground mb-1">{language === 'fr' ? 'Étudiant' : 'Student'}</p>
                      <p className="font-semibold">{student?.first_name} {student?.last_name}</p>
                      <p className="text-sm">{student?.email}</p>
                      <p className="text-xs text-muted-foreground mt-1">Code: {student?.code}</p>
                    </div>
                    <div className="p-4 bg-muted rounded-lg">
                      <p className="text-sm text-muted-foreground mb-1">Pack</p>
                      <p className="font-semibold">{pack?.title}</p>
                      <p className="text-sm font-mono">{pack?.code}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {language === 'fr' ? 'Début' : 'Start'}: {pack && new Date(pack.date_start).toLocaleDateString(language === 'fr' ? 'fr-FR' : 'en-US')}
                      </p>
                    </div>
                  </div>

                  {/* Payment Proof */}
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">{language === 'fr' ? 'Preuve de paiement' : 'Payment proof'}</p>
                    <div className="border border-border rounded-lg overflow-hidden">
                      <img
                        src={selectedPayment.proof_image}
                        alt={language === 'fr' ? 'Preuve de paiement' : 'Payment proof'}
                        className="w-full h-auto max-h-96 object-contain bg-muted"
                      />
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      {language === 'fr' ? 'Soumis le' : 'Submitted on'} {new Date(selectedPayment.date_payment).toLocaleDateString(language === 'fr' ? 'fr-FR' : 'en-US')}
                    </p>
                  </div>

                  {/* Status */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <span className="text-sm text-muted-foreground">{language === 'fr' ? 'Statut:' : 'Status:'}</span>
                      <Select
                        value={selectedPayment.status}
                        onValueChange={(value: 'pending' | 'validated' | 'rejected') => {
                          handleUpdatePaymentStatus(selectedPayment.id, value);
                        }}
                      >
                        <SelectTrigger className="w-40">
                          <Badge className={statusConfig[selectedPayment.status].color}>
                            {statusConfig[selectedPayment.status].label}
                          </Badge>
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">{language === 'fr' ? 'En attente' : 'Pending'}</SelectItem>
                          <SelectItem value="validated">{language === 'fr' ? 'Validé' : 'Validated'}</SelectItem>
                          <SelectItem value="rejected">{language === 'fr' ? 'Refusé' : 'Rejected'}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {selectedPayment.status === 'pending' && (
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          className="gap-2 text-red-600 border-red-200"
                          onClick={() => handleUpdatePaymentStatus(selectedPayment.id, 'rejected')}
                        >
                          <X className="w-4 h-4" />
                          {language === 'fr' ? 'Refuser' : 'Reject'}
                        </Button>
                        <Button
                          className="gap-2 bg-green-600"
                          onClick={() => handleUpdatePaymentStatus(selectedPayment.id, 'validated')}
                        >
                          <Check className="w-4 h-4" />
                          {language === 'fr' ? 'Valider' : 'Validate'}
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })()}
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
};

const AdminPayments: React.FC = () => (
  <LanguageProvider>
    <AdminPaymentsContent />
  </LanguageProvider>
);

export default AdminPayments;
