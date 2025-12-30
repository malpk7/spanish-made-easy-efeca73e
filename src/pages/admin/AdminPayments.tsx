import React, { useState } from 'react';
import { LanguageProvider } from '@/contexts/LanguageContext';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Check, X, Eye, Clock, CheckCircle, XCircle } from 'lucide-react';
import { mockPayments, mockUsers, mockPacks, type Payment } from '@/data/mockData';
import { toast } from 'sonner';

const AdminPaymentsContent: React.FC = () => {
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

  const handleValidatePayment = (paymentId: string) => {
    setPayments(prev => prev.map(p => 
      p.id === paymentId ? { ...p, status: 'validated' as const } : p
    ));
    toast.success('Paiement validé - Étudiant ajouté au groupe du cours');
    setViewDialogOpen(false);
  };

  const handleRejectPayment = (paymentId: string) => {
    setPayments(prev => prev.map(p => 
      p.id === paymentId ? { ...p, status: 'rejected' as const } : p
    ));
    toast.error('Paiement refusé - L\'étudiant peut modifier la capture');
    setViewDialogOpen(false);
  };

  const handleViewPayment = (payment: Payment) => {
    setSelectedPayment(payment);
    setViewDialogOpen(true);
  };

  const statusConfig = {
    pending: { 
      color: 'bg-orange-100 text-orange-700 border-orange-200', 
      icon: Clock,
      label: '🟠 En attente' 
    },
    validated: { 
      color: 'bg-green-100 text-green-700 border-green-200', 
      icon: CheckCircle,
      label: '🟢 Validé' 
    },
    rejected: { 
      color: 'bg-red-100 text-red-700 border-red-200', 
      icon: XCircle,
      label: '🔴 Refusé' 
    },
  };

  const stats = {
    all: payments.length,
    pending: payments.filter(p => p.status === 'pending').length,
    validated: payments.filter(p => p.status === 'validated').length,
    rejected: payments.filter(p => p.status === 'rejected').length,
  };

  return (
    <DashboardLayout title="Gestion des Paiements">
      <div className="space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setActiveTab('all')}>
            <CardContent className="p-4">
              <p className="text-2xl font-bold">{stats.all}</p>
              <p className="text-sm text-muted-foreground">Total paiements</p>
            </CardContent>
          </Card>
          <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setActiveTab('pending')}>
            <CardContent className="p-4">
              <p className="text-2xl font-bold text-orange-500">{stats.pending}</p>
              <p className="text-sm text-muted-foreground">En attente</p>
            </CardContent>
          </Card>
          <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setActiveTab('validated')}>
            <CardContent className="p-4">
              <p className="text-2xl font-bold text-green-500">{stats.validated}</p>
              <p className="text-sm text-muted-foreground">Validés</p>
            </CardContent>
          </Card>
          <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setActiveTab('rejected')}>
            <CardContent className="p-4">
              <p className="text-2xl font-bold text-red-500">{stats.rejected}</p>
              <p className="text-sm text-muted-foreground">Refusés</p>
            </CardContent>
          </Card>
        </div>

        {/* Search & Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher par étudiant ou pack..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-auto">
            <TabsList>
              <TabsTrigger value="all">Tous</TabsTrigger>
              <TabsTrigger value="pending">En attente</TabsTrigger>
              <TabsTrigger value="validated">Validés</TabsTrigger>
              <TabsTrigger value="rejected">Refusés</TabsTrigger>
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
                    <TableHead>Étudiant</TableHead>
                    <TableHead>Pack</TableHead>
                    <TableHead>Preuve</TableHead>
                    <TableHead>Statut</TableHead>
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
                          {new Date(payment.date_payment).toLocaleDateString('fr-FR')}
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
                            alt="Preuve de paiement"
                            className="w-16 h-12 object-cover rounded cursor-pointer hover:opacity-80"
                            onClick={() => handleViewPayment(payment)}
                          />
                        </TableCell>
                        <TableCell>
                          <Badge className={statusConfig[payment.status].color}>
                            <StatusIcon className="w-3 h-3 mr-1" />
                            {statusConfig[payment.status].label}
                          </Badge>
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
                                  className="text-green-600 hover:text-green-700 hover:bg-green-50"
                                  onClick={() => handleValidatePayment(payment.id)}
                                >
                                  <Check className="w-4 h-4" />
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="icon"
                                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                  onClick={() => handleRejectPayment(payment.id)}
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
                        Aucun paiement trouvé
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
              <DialogTitle>Détails du paiement</DialogTitle>
            </DialogHeader>
            {selectedPayment && (() => {
              const student = getStudent(selectedPayment.student_id);
              const pack = getPack(selectedPayment.pack_id);
              
              return (
                <div className="space-y-6">
                  {/* Student & Pack Info */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-muted rounded-lg">
                      <p className="text-sm text-muted-foreground mb-1">Étudiant</p>
                      <p className="font-semibold">{student?.first_name} {student?.last_name}</p>
                      <p className="text-sm">{student?.email}</p>
                      <p className="text-xs text-muted-foreground mt-1">Code: {student?.code}</p>
                    </div>
                    <div className="p-4 bg-muted rounded-lg">
                      <p className="text-sm text-muted-foreground mb-1">Pack</p>
                      <p className="font-semibold">{pack?.title}</p>
                      <p className="text-sm font-mono">{pack?.code}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Début: {pack && new Date(pack.date_start).toLocaleDateString('fr-FR')}
                      </p>
                    </div>
                  </div>

                  {/* Payment Proof */}
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Preuve de paiement</p>
                    <div className="border border-border rounded-lg overflow-hidden">
                      <img 
                        src={selectedPayment.proof_image} 
                        alt="Preuve de paiement"
                        className="w-full h-auto max-h-96 object-contain bg-gray-50"
                      />
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      Soumis le {new Date(selectedPayment.date_payment).toLocaleDateString('fr-FR')}
                    </p>
                  </div>

                  {/* Status */}
                  <div className="flex items-center justify-between">
                    <Badge className={statusConfig[selectedPayment.status].color} >
                      {statusConfig[selectedPayment.status].label}
                    </Badge>
                    
                    {selectedPayment.status === 'pending' && (
                      <div className="flex gap-2">
                        <Button 
                          variant="outline"
                          className="gap-2 text-red-600 border-red-200 hover:bg-red-50"
                          onClick={() => handleRejectPayment(selectedPayment.id)}
                        >
                          <X className="w-4 h-4" />
                          Refuser
                        </Button>
                        <Button 
                          className="gap-2 bg-green-600 hover:bg-green-700"
                          onClick={() => handleValidatePayment(selectedPayment.id)}
                        >
                          <Check className="w-4 h-4" />
                          Valider
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

const AdminPayments: React.FC = () => {
  return (
    <LanguageProvider>
      <AdminPaymentsContent />
    </LanguageProvider>
  );
};

export default AdminPayments;
