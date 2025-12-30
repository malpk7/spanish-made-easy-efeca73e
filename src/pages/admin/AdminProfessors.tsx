import React, { useState } from 'react';
import { LanguageProvider } from '@/contexts/LanguageContext';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Plus, Search, Eye, Edit, Trash2 } from 'lucide-react';
import { mockUsers, mockPacks, type MockUser, type Pack } from '@/data/mockData';
import { toast } from 'sonner';

const AdminProfessorsContent: React.FC = () => {
  const [professors, setProfessors] = useState(mockUsers.filter(u => u.role === 'professor'));
  const [packs] = useState(mockPacks);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProfessor, setSelectedProfessor] = useState<MockUser | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [assignDialogOpen, setAssignDialogOpen] = useState(false);

  const filteredProfessors = professors.filter(professor => 
    professor.first_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    professor.last_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    professor.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    professor.code.includes(searchQuery)
  );

  const getProfessorPacks = (professorId: string) => {
    return packs.filter(p => p.assigned_professors.includes(professorId));
  };

  const handleDeleteProfessor = (professorId: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce professeur ?')) {
      setProfessors(prev => prev.filter(p => p.id !== professorId));
      toast.success('Professeur supprimé');
    }
  };

  const handleViewProfessor = (professor: MockUser) => {
    setSelectedProfessor(professor);
    setViewDialogOpen(true);
  };

  const handleAssignPacks = (professor: MockUser) => {
    setSelectedProfessor(professor);
    setAssignDialogOpen(true);
  };

  return (
    <DashboardLayout title="Gestion des Professeurs">
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
            Ajouter un professeur
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4">
              <p className="text-2xl font-bold text-spanish-gold">{professors.length}</p>
              <p className="text-sm text-muted-foreground">Total professeurs</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-2xl font-bold text-green-500">{packs.filter(p => p.status === 'active').length}</p>
              <p className="text-sm text-muted-foreground">Packs actifs</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-2xl font-bold text-primary">
                {packs.reduce((sum, p) => sum + p.assigned_professors.length, 0)}
              </p>
              <p className="text-sm text-muted-foreground">Affectations totales</p>
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
                    <TableHead>Packs Assignés</TableHead>
                    <TableHead>Date Inscription</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProfessors.map((professor) => {
                    const professorPacks = getProfessorPacks(professor.id);
                    
                    return (
                      <TableRow key={professor.id}>
                        <TableCell className="font-mono text-sm">{professor.code}</TableCell>
                        <TableCell className="font-medium">
                          {professor.first_name} {professor.last_name}
                        </TableCell>
                        <TableCell>{professor.email}</TableCell>
                        <TableCell>{professor.city}</TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {professorPacks.length > 0 ? (
                              professorPacks.map((pack) => (
                                <Badge key={pack.id} variant="outline" className="text-xs bg-spanish-gold/10 border-spanish-gold/30">
                                  {pack.code}
                                </Badge>
                              ))
                            ) : (
                              <span className="text-muted-foreground text-sm">Aucun</span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          {new Date(professor.date_inscription).toLocaleDateString('fr-FR')}
                        </TableCell>
                        <TableCell>
                          <div className="flex justify-end gap-2">
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => handleViewProfessor(professor)}
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => handleAssignPacks(professor)}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => handleDeleteProfessor(professor.id)}
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

        {/* View Professor Dialog */}
        <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Détails du professeur</DialogTitle>
            </DialogHeader>
            {selectedProfessor && (
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 rounded-full bg-spanish-gold/10 flex items-center justify-center text-xl font-bold text-spanish-gold">
                    {selectedProfessor.first_name[0]}{selectedProfessor.last_name[0]}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold">
                      {selectedProfessor.first_name} {selectedProfessor.last_name}
                    </h3>
                    <p className="text-muted-foreground">Code: {selectedProfessor.code}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-3 bg-muted rounded-lg">
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="font-medium">{selectedProfessor.email}</p>
                  </div>
                  <div className="p-3 bg-muted rounded-lg">
                    <p className="text-sm text-muted-foreground">Téléphone</p>
                    <p className="font-medium">{selectedProfessor.phone}</p>
                  </div>
                  <div className="p-3 bg-muted rounded-lg">
                    <p className="text-sm text-muted-foreground">Ville</p>
                    <p className="font-medium">{selectedProfessor.city}</p>
                  </div>
                  <div className="p-3 bg-muted rounded-lg">
                    <p className="text-sm text-muted-foreground">Inscrit le</p>
                    <p className="font-medium">
                      {new Date(selectedProfessor.date_inscription).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">Packs assignés</h4>
                  <div className="space-y-2">
                    {getProfessorPacks(selectedProfessor.id).map((pack) => (
                      <div key={pack.id} className="flex items-center justify-between p-3 border border-border rounded-lg">
                        <div>
                          <p className="font-medium">{pack.title}</p>
                          <p className="text-sm text-muted-foreground">{pack.code}</p>
                        </div>
                        <Badge className={pack.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}>
                          {pack.status === 'active' ? 'Actif' : 'Inactif'}
                        </Badge>
                      </div>
                    ))}
                    {getProfessorPacks(selectedProfessor.id).length === 0 && (
                      <p className="text-muted-foreground text-center py-4">Aucun pack assigné</p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Assign Packs Dialog */}
        <Dialog open={assignDialogOpen} onOpenChange={setAssignDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Assigner des packs</DialogTitle>
            </DialogHeader>
            {selectedProfessor && (
              <div className="space-y-4">
                <p className="text-muted-foreground">
                  Assigner des packs à {selectedProfessor.first_name} {selectedProfessor.last_name}
                </p>
                <div className="space-y-3">
                  {packs.map((pack) => (
                    <div key={pack.id} className="flex items-center gap-3 p-3 border border-border rounded-lg">
                      <Checkbox 
                        id={pack.id}
                        checked={pack.assigned_professors.includes(selectedProfessor.id)}
                      />
                      <Label htmlFor={pack.id} className="flex-1 cursor-pointer">
                        <p className="font-medium">{pack.title}</p>
                        <p className="text-sm text-muted-foreground">{pack.code}</p>
                      </Label>
                    </div>
                  ))}
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setAssignDialogOpen(false)}>
                    Annuler
                  </Button>
                  <Button onClick={() => {
                    toast.success('Packs mis à jour');
                    setAssignDialogOpen(false);
                  }}>
                    Enregistrer
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
};

const AdminProfessors: React.FC = () => {
  return (
    <LanguageProvider>
      <AdminProfessorsContent />
    </LanguageProvider>
  );
};

export default AdminProfessors;
