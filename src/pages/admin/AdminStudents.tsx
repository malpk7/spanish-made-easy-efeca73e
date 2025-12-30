import React, { useState } from 'react';
import { LanguageProvider } from '@/contexts/LanguageContext';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Plus, Search, Eye, Edit, Trash2, Mail, Phone, MapPin } from 'lucide-react';
import { mockUsers, mockPayments, mockPacks, type MockUser } from '@/data/mockData';
import { toast } from 'sonner';

const AdminStudentsContent: React.FC = () => {
  const [students, setStudents] = useState(mockUsers.filter(u => u.role === 'student'));
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<MockUser | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);

  const filteredStudents = students.filter(student => 
    student.first_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.last_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.code.includes(searchQuery)
  );

  const getStudentPayments = (studentId: string) => {
    return mockPayments.filter(p => p.student_id === studentId);
  };

  const getStudentPacks = (studentId: string) => {
    const payments = getStudentPayments(studentId);
    return payments.map(p => {
      const pack = mockPacks.find(pack => pack.id === p.pack_id);
      return { pack, payment: p };
    });
  };

  const handleDeleteStudent = (studentId: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet étudiant ?')) {
      setStudents(prev => prev.filter(s => s.id !== studentId));
      toast.success('Étudiant supprimé');
    }
  };

  const handleViewStudent = (student: MockUser) => {
    setSelectedStudent(student);
    setViewDialogOpen(true);
  };

  const statusColors = {
    pending: 'bg-orange-100 text-orange-700 border-orange-200',
    validated: 'bg-green-100 text-green-700 border-green-200',
    rejected: 'bg-red-100 text-red-700 border-red-200',
  };

  const statusLabels = {
    pending: '🟠 En attente',
    validated: '🟢 Validé',
    rejected: '🔴 Refusé',
  };

  return (
    <DashboardLayout title="Gestion des Étudiants">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher par nom, email ou code..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            Ajouter un étudiant
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4">
              <p className="text-2xl font-bold text-primary">{students.length}</p>
              <p className="text-sm text-muted-foreground">Total étudiants</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-2xl font-bold text-green-500">
                {mockPayments.filter(p => p.status === 'validated').length}
              </p>
              <p className="text-sm text-muted-foreground">Paiements validés</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-2xl font-bold text-orange-500">
                {mockPayments.filter(p => p.status === 'pending').length}
              </p>
              <p className="text-sm text-muted-foreground">En attente</p>
            </CardContent>
          </Card>
        </div>

        {/* Table */}
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Code</TableHead>
                    <TableHead>Nom Complet</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Ville</TableHead>
                    <TableHead>Packs</TableHead>
                    <TableHead>Statut Paiement</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredStudents.map((student) => {
                    const studentPacks = getStudentPacks(student.id);
                    const latestPayment = studentPacks[0]?.payment;
                    
                    return (
                      <TableRow key={student.id}>
                        <TableCell className="font-mono text-sm">{student.code}</TableCell>
                        <TableCell className="font-medium">
                          {student.first_name} {student.last_name}
                        </TableCell>
                        <TableCell>{student.email}</TableCell>
                        <TableCell>{student.city}</TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {studentPacks.length > 0 ? (
                              studentPacks.map(({ pack }) => (
                                <Badge key={pack?.id} variant="outline" className="text-xs">
                                  {pack?.code}
                                </Badge>
                              ))
                            ) : (
                              <span className="text-muted-foreground text-sm">Aucun</span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          {latestPayment ? (
                            <Badge className={statusColors[latestPayment.status]}>
                              {statusLabels[latestPayment.status]}
                            </Badge>
                          ) : (
                            <span className="text-muted-foreground text-sm">-</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex justify-end gap-2">
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => handleViewStudent(student)}
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="icon">
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => handleDeleteStudent(student.id)}
                            >
                              <Trash2 className="w-4 h-4 text-destructive" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* View Student Dialog */}
        <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Détails de l'étudiant</DialogTitle>
            </DialogHeader>
            {selectedStudent && (
              <div className="space-y-6">
                {/* Profile Info */}
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-xl font-bold text-primary">
                    {selectedStudent.first_name[0]}{selectedStudent.last_name[0]}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold">
                      {selectedStudent.first_name} {selectedStudent.last_name}
                    </h3>
                    <p className="text-muted-foreground">Code: {selectedStudent.code}</p>
                  </div>
                </div>

                {/* Contact Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                    <Mail className="w-5 h-5 text-muted-foreground" />
                    <span>{selectedStudent.email}</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                    <Phone className="w-5 h-5 text-muted-foreground" />
                    <span>{selectedStudent.phone}</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                    <MapPin className="w-5 h-5 text-muted-foreground" />
                    <span>{selectedStudent.city}</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                    <span className="text-muted-foreground">📅</span>
                    <span>Né(e) le {new Date(selectedStudent.date_of_birth).toLocaleDateString('fr-FR')}</span>
                  </div>
                </div>

                {/* Packs & Payments */}
                <div>
                  <h4 className="font-semibold mb-3">Packs inscrits</h4>
                  <div className="space-y-2">
                    {getStudentPacks(selectedStudent.id).map(({ pack, payment }) => (
                      <div key={pack?.id} className="flex items-center justify-between p-3 border border-border rounded-lg">
                        <div>
                          <p className="font-medium">{pack?.title}</p>
                          <p className="text-sm text-muted-foreground">{pack?.code}</p>
                        </div>
                        <Badge className={statusColors[payment.status]}>
                          {statusLabels[payment.status]}
                        </Badge>
                      </div>
                    ))}
                    {getStudentPacks(selectedStudent.id).length === 0 && (
                      <p className="text-muted-foreground text-center py-4">Aucun pack inscrit</p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
};

const AdminStudents: React.FC = () => {
  return (
    <LanguageProvider>
      <AdminStudentsContent />
    </LanguageProvider>
  );
};

export default AdminStudents;
