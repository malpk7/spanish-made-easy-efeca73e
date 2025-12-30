import React, { useState } from 'react';
import { LanguageProvider, useLanguage } from '@/contexts/LanguageContext';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Search, Eye, Edit, Trash2, Mail, Phone, MapPin } from 'lucide-react';
import { mockUsers, mockPayments, mockPacks, moroccanCities, type MockUser, type UserStatus } from '@/data/mockData';
import { toast } from 'sonner';

const AdminStudentsContent: React.FC = () => {
  const { language } = useLanguage();
  const [students, setStudents] = useState(mockUsers.filter(u => u.role === 'student'));
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<MockUser | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editForm, setEditForm] = useState<Partial<MockUser>>({});
  const [newStudent, setNewStudent] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    city: '',
    date_of_birth: '',
    profession: '',
    status: 'active' as UserStatus,
  });

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
    if (confirm(language === 'fr' ? 'Êtes-vous sûr de vouloir supprimer cet étudiant ?' : 'Are you sure you want to delete this student?')) {
      setStudents(prev => prev.filter(s => s.id !== studentId));
      toast.success(language === 'fr' ? 'Étudiant supprimé' : 'Student deleted');
    }
  };

  const handleViewStudent = (student: MockUser) => {
    setSelectedStudent(student);
    setViewDialogOpen(true);
  };

  const handleEditStudent = (student: MockUser) => {
    setSelectedStudent(student);
    setEditForm({ ...student });
    setEditDialogOpen(true);
  };

  const handleSaveEdit = () => {
    if (!selectedStudent || !editForm) return;
    setStudents(prev => prev.map(s =>
      s.id === selectedStudent.id ? { ...s, ...editForm } as MockUser : s
    ));
    setEditDialogOpen(false);
    toast.success(language === 'fr' ? 'Étudiant modifié' : 'Student updated');
  };

  const handleAddStudent = () => {
    const newId = `student-${Date.now()}`;
    const newCode = String(20000 + students.length + 1).padStart(5, '0');
    const student: MockUser = {
      id: newId,
      code: newCode,
      email: newStudent.email,
      password: 'student123',
      role: 'student',
      first_name: newStudent.first_name,
      last_name: newStudent.last_name,
      phone: newStudent.phone,
      city: newStudent.city,
      date_of_birth: newStudent.date_of_birth,
      profession: newStudent.profession,
      date_inscription: new Date().toISOString().split('T')[0],
      status: newStudent.status,
    };
    setStudents(prev => [...prev, student]);
    setAddDialogOpen(false);
    setNewStudent({
      first_name: '',
      last_name: '',
      email: '',
      phone: '',
      city: '',
      date_of_birth: '',
      profession: '',
      status: 'active',
    });
    toast.success(language === 'fr' ? 'Étudiant ajouté' : 'Student added');
  };

  const handleUpdateStudentStatus = (studentId: string, status: UserStatus) => {
    setStudents(prev => prev.map(s =>
      s.id === studentId ? { ...s, status } : s
    ));
    toast.success(language === 'fr' ? 'Statut modifié' : 'Status updated');
  };

  const handleUpdatePaymentStatus = (paymentId: string, status: 'pending' | 'validated' | 'rejected') => {
    // In real app, this would update the database
    toast.success(language === 'fr' ? 'Statut de paiement modifié' : 'Payment status updated');
  };

  const statusColors = {
    pending: 'bg-orange-100 text-orange-700 border-orange-200',
    validated: 'bg-green-100 text-green-700 border-green-200',
    rejected: 'bg-red-100 text-red-700 border-red-200',
  };

  const statusLabels = {
    pending: language === 'fr' ? '🟠 En attente' : '🟠 Pending',
    validated: language === 'fr' ? '🟢 Validé' : '🟢 Validated',
    rejected: language === 'fr' ? '🔴 Refusé' : '🔴 Rejected',
  };

  const userStatusColors = {
    active: 'bg-green-100 text-green-700 border-green-200',
    inactive: 'bg-gray-100 text-gray-700 border-gray-200',
  };

  const userStatusLabels = {
    active: language === 'fr' ? '🟢 Actif' : '🟢 Active',
    inactive: language === 'fr' ? '⚫ Inactif' : '⚫ Inactive',
  };

  return (
    <DashboardLayout title={language === 'fr' ? 'Gestion des Étudiants' : 'Student Management'}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder={language === 'fr' ? 'Rechercher par nom, email ou code...' : 'Search by name, email or code...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button className="gap-2" onClick={() => setAddDialogOpen(true)}>
            <Plus className="w-4 h-4" />
            {language === 'fr' ? 'Ajouter un étudiant' : 'Add student'}
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <p className="text-2xl font-bold text-primary">{students.length}</p>
              <p className="text-sm text-muted-foreground">{language === 'fr' ? 'Total étudiants' : 'Total students'}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-2xl font-bold text-green-600">{students.filter(s => s.status === 'active').length}</p>
              <p className="text-sm text-muted-foreground">{language === 'fr' ? 'Actifs' : 'Active'}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-2xl font-bold text-green-500">
                {mockPayments.filter(p => p.status === 'validated').length}
              </p>
              <p className="text-sm text-muted-foreground">{language === 'fr' ? 'Paiements validés' : 'Validated payments'}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-2xl font-bold text-orange-500">
                {mockPayments.filter(p => p.status === 'pending').length}
              </p>
              <p className="text-sm text-muted-foreground">{language === 'fr' ? 'En attente' : 'Pending'}</p>
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
                    <TableHead>{language === 'fr' ? 'Nom Complet' : 'Full Name'}</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>{language === 'fr' ? 'Ville' : 'City'}</TableHead>
                    <TableHead>Packs</TableHead>
                    <TableHead>{language === 'fr' ? 'Statut Étudiant' : 'Student Status'}</TableHead>
                    <TableHead>{language === 'fr' ? 'Statut Paiement' : 'Payment Status'}</TableHead>
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
                              <span className="text-muted-foreground text-sm">{language === 'fr' ? 'Aucun' : 'None'}</span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Select
                            value={student.status}
                            onValueChange={(value: UserStatus) => handleUpdateStudentStatus(student.id, value)}
                          >
                            <SelectTrigger className="w-32 h-8">
                              <Badge className={userStatusColors[student.status]}>
                                {userStatusLabels[student.status]}
                              </Badge>
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="active">{language === 'fr' ? 'Actif' : 'Active'}</SelectItem>
                              <SelectItem value="inactive">{language === 'fr' ? 'Inactif' : 'Inactive'}</SelectItem>
                            </SelectContent>
                          </Select>
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
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleEditStudent(student)}
                            >
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
              <DialogTitle>{language === 'fr' ? "Détails de l'étudiant" : 'Student Details'}</DialogTitle>
            </DialogHeader>
            {selectedStudent && (
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-xl font-bold text-primary">
                    {selectedStudent.first_name[0]}{selectedStudent.last_name[0]}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold">
                      {selectedStudent.first_name} {selectedStudent.last_name}
                    </h3>
                    <p className="text-muted-foreground">Code: {selectedStudent.code}</p>
                    <Badge className={userStatusColors[selectedStudent.status]}>
                      {userStatusLabels[selectedStudent.status]}
                    </Badge>
                  </div>
                </div>

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
                    <span>{language === 'fr' ? 'Né(e) le' : 'Born on'} {new Date(selectedStudent.date_of_birth).toLocaleDateString(language === 'fr' ? 'fr-FR' : 'en-US')}</span>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">{language === 'fr' ? 'Packs inscrits' : 'Enrolled packs'}</h4>
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
                      <p className="text-muted-foreground text-center py-4">{language === 'fr' ? 'Aucun pack inscrit' : 'No enrolled packs'}</p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Edit Student Dialog */}
        <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>{language === 'fr' ? "Modifier l'étudiant" : 'Edit Student'}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>{language === 'fr' ? 'Prénom' : 'First name'}</Label>
                  <Input
                    value={editForm.first_name || ''}
                    onChange={(e) => setEditForm({ ...editForm, first_name: e.target.value })}
                  />
                </div>
                <div>
                  <Label>{language === 'fr' ? 'Nom' : 'Last name'}</Label>
                  <Input
                    value={editForm.last_name || ''}
                    onChange={(e) => setEditForm({ ...editForm, last_name: e.target.value })}
                  />
                </div>
              </div>
              <div>
                <Label>Email</Label>
                <Input
                  type="email"
                  value={editForm.email || ''}
                  onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                />
              </div>
              <div>
                <Label>{language === 'fr' ? 'Téléphone' : 'Phone'}</Label>
                <Input
                  value={editForm.phone || ''}
                  onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                />
              </div>
              <div>
                <Label>{language === 'fr' ? 'Ville' : 'City'}</Label>
                <Select
                  value={editForm.city || ''}
                  onValueChange={(value) => setEditForm({ ...editForm, city: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {moroccanCities.map(city => (
                      <SelectItem key={city} value={city}>{city}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>{language === 'fr' ? 'Statut' : 'Status'}</Label>
                <Select
                  value={editForm.status || 'active'}
                  onValueChange={(value: UserStatus) => setEditForm({ ...editForm, status: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">{language === 'fr' ? 'Actif' : 'Active'}</SelectItem>
                    <SelectItem value="inactive">{language === 'fr' ? 'Inactif' : 'Inactive'}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
                  {language === 'fr' ? 'Annuler' : 'Cancel'}
                </Button>
                <Button onClick={handleSaveEdit}>
                  {language === 'fr' ? 'Enregistrer' : 'Save'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Add Student Dialog */}
        <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>{language === 'fr' ? 'Ajouter un étudiant' : 'Add Student'}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>{language === 'fr' ? 'Prénom' : 'First name'} *</Label>
                  <Input
                    value={newStudent.first_name}
                    onChange={(e) => setNewStudent({ ...newStudent, first_name: e.target.value })}
                  />
                </div>
                <div>
                  <Label>{language === 'fr' ? 'Nom' : 'Last name'} *</Label>
                  <Input
                    value={newStudent.last_name}
                    onChange={(e) => setNewStudent({ ...newStudent, last_name: e.target.value })}
                  />
                </div>
              </div>
              <div>
                <Label>Email *</Label>
                <Input
                  type="email"
                  value={newStudent.email}
                  onChange={(e) => setNewStudent({ ...newStudent, email: e.target.value })}
                />
              </div>
              <div>
                <Label>{language === 'fr' ? 'Téléphone' : 'Phone'} *</Label>
                <Input
                  value={newStudent.phone}
                  onChange={(e) => setNewStudent({ ...newStudent, phone: e.target.value })}
                />
              </div>
              <div>
                <Label>{language === 'fr' ? 'Ville' : 'City'} *</Label>
                <Select
                  value={newStudent.city}
                  onValueChange={(value) => setNewStudent({ ...newStudent, city: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={language === 'fr' ? 'Sélectionner une ville' : 'Select a city'} />
                  </SelectTrigger>
                  <SelectContent>
                    {moroccanCities.map(city => (
                      <SelectItem key={city} value={city}>{city}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>{language === 'fr' ? 'Date de naissance' : 'Date of birth'} *</Label>
                <Input
                  type="date"
                  value={newStudent.date_of_birth}
                  onChange={(e) => setNewStudent({ ...newStudent, date_of_birth: e.target.value })}
                />
              </div>
              <div>
                <Label>Profession</Label>
                <Input
                  value={newStudent.profession}
                  onChange={(e) => setNewStudent({ ...newStudent, profession: e.target.value })}
                />
              </div>
              <div>
                <Label>{language === 'fr' ? 'Statut' : 'Status'}</Label>
                <Select
                  value={newStudent.status}
                  onValueChange={(value: UserStatus) => setNewStudent({ ...newStudent, status: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">{language === 'fr' ? 'Actif' : 'Active'}</SelectItem>
                    <SelectItem value="inactive">{language === 'fr' ? 'Inactif' : 'Inactive'}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setAddDialogOpen(false)}>
                  {language === 'fr' ? 'Annuler' : 'Cancel'}
                </Button>
                <Button onClick={handleAddStudent} disabled={!newStudent.first_name || !newStudent.last_name || !newStudent.email || !newStudent.city}>
                  {language === 'fr' ? 'Ajouter' : 'Add'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
};

const AdminStudents: React.FC = () => (
  <LanguageProvider>
    <AdminStudentsContent />
  </LanguageProvider>
);

export default AdminStudents;
