import React, { useState } from 'react';
import { LanguageProvider, useLanguage } from '@/contexts/LanguageContext';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/hooks/useAuth';
import { mockPacks, mockPayments, mockUsers, type Pack } from '@/data/mockData';
import { Users, BookOpen, Calendar, Edit, Eye, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';

const ProfessorDashboardContent: React.FC = () => {
  const { user } = useAuth();
  const { language } = useLanguage();

  const [packs, setPacks] = useState(mockPacks.filter(p => p.assigned_professors.includes(user?.id || '')));
  const [selectedPack, setSelectedPack] = useState<Pack | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [studentsDialogOpen, setStudentsDialogOpen] = useState(false);
  const [editForm, setEditForm] = useState<Partial<Pack>>({});

  const students = mockUsers.filter(u => u.role === 'student');

  const getEnrolledStudents = (packId: string) => {
    const validatedPayments = mockPayments.filter(p => p.pack_id === packId && p.status === 'validated');
    return validatedPayments.map(p => {
      const student = students.find(s => s.id === p.student_id);
      return { student, payment: p };
    }).filter(item => item.student);
  };

  const totalStudents = packs.reduce((sum, pack) => sum + getEnrolledStudents(pack.id).length, 0);

  const handleViewPack = (pack: Pack) => {
    setSelectedPack(pack);
    setViewDialogOpen(true);
  };

  const handleEditPack = (pack: Pack) => {
    setSelectedPack(pack);
    setEditForm({ ...pack });
    setEditDialogOpen(true);
  };

  const handleViewStudents = (pack: Pack) => {
    setSelectedPack(pack);
    setStudentsDialogOpen(true);
  };

  const handleSaveEdit = () => {
    if (!selectedPack || !editForm) return;
    setPacks(prev => prev.map(p =>
      p.id === selectedPack.id ? { ...p, ...editForm } as Pack : p
    ));
    setEditDialogOpen(false);
    toast.success(language === 'fr' ? 'Cours modifié' : 'Course updated');
  };

  const statusLabels = {
    active: language === 'fr' ? 'Actif' : 'Active',
    inactive: language === 'fr' ? 'Inactif' : 'Inactive',
  };

  return (
    <DashboardLayout title={language === 'fr' ? 'Tableau de bord Professeur' : 'Professor Dashboard'}>
      <div className="space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-6 flex items-center gap-4">
              <div className="p-3 rounded-lg bg-spanish-gold/10">
                <BookOpen className="w-6 h-6 text-spanish-gold" />
              </div>
              <div>
                <p className="text-2xl font-bold">{packs.length}</p>
                <p className="text-sm text-muted-foreground">{language === 'fr' ? 'Cours assignés' : 'Assigned courses'}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 flex items-center gap-4">
              <div className="p-3 rounded-lg bg-primary/10">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{totalStudents}</p>
                <p className="text-sm text-muted-foreground">{language === 'fr' ? 'Total étudiants' : 'Total students'}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 flex items-center gap-4">
              <div className="p-3 rounded-lg bg-green-500/10">
                <Calendar className="w-6 h-6 text-green-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{packs.filter(p => p.status === 'active').length}</p>
                <p className="text-sm text-muted-foreground">{language === 'fr' ? 'Cours actifs' : 'Active courses'}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="courses">
          <TabsList>
            <TabsTrigger value="courses">{language === 'fr' ? 'Mes Cours' : 'My Courses'}</TabsTrigger>
            <TabsTrigger value="students">{language === 'fr' ? 'Tous les Étudiants' : 'All Students'}</TabsTrigger>
          </TabsList>

          <TabsContent value="courses">
            <Card>
              <CardHeader>
                <CardTitle>{language === 'fr' ? 'Mes Cours' : 'My Courses'}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {packs.map(pack => {
                    const enrolledStudents = getEnrolledStudents(pack.id);
                    return (
                      <div key={pack.id} className="p-4 border border-border rounded-lg">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="font-semibold">{pack.title}</h3>
                            <p className="text-sm text-muted-foreground font-mono">{pack.code}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge className={pack.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}>
                              {statusLabels[pack.status]}
                            </Badge>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">{pack.description}</p>
                        <div className="flex items-center gap-4 text-sm mb-4">
                          <span>📅 {new Date(pack.date_start).toLocaleDateString(language === 'fr' ? 'fr-FR' : 'en-US')}</span>
                          <span>→</span>
                          <span>{new Date(pack.date_end).toLocaleDateString(language === 'fr' ? 'fr-FR' : 'en-US')}</span>
                          <span>👥 {enrolledStudents.length} {language === 'fr' ? 'étudiants' : 'students'}</span>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" className="gap-1" onClick={() => handleViewPack(pack)}>
                            <Eye className="w-4 h-4" />
                            {language === 'fr' ? 'Voir' : 'View'}
                          </Button>
                          <Button variant="outline" size="sm" className="gap-1" onClick={() => handleEditPack(pack)}>
                            <Edit className="w-4 h-4" />
                            {language === 'fr' ? 'Modifier' : 'Edit'}
                          </Button>
                          <Button variant="outline" size="sm" className="gap-1" onClick={() => handleViewStudents(pack)}>
                            <Users className="w-4 h-4" />
                            {language === 'fr' ? 'Étudiants' : 'Students'}
                          </Button>
                          <Button variant="outline" size="sm" className="gap-1" asChild>
                            <a href={pack.course_link} target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="w-4 h-4" />
                              {language === 'fr' ? 'Lien cours' : 'Course link'}
                            </a>
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                  {packs.length === 0 && (
                    <p className="text-center text-muted-foreground py-8">{language === 'fr' ? 'Aucun cours assigné' : 'No assigned courses'}</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="students">
            <Card>
              <CardHeader>
                <CardTitle>{language === 'fr' ? 'Tous mes Étudiants' : 'All my Students'}</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Code</TableHead>
                        <TableHead>{language === 'fr' ? 'Nom' : 'Name'}</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>{language === 'fr' ? 'Téléphone' : 'Phone'}</TableHead>
                        <TableHead>{language === 'fr' ? 'Cours' : 'Course'}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {packs.flatMap(pack =>
                        getEnrolledStudents(pack.id).map(({ student }) => (
                          <TableRow key={`${pack.id}-${student?.id}`}>
                            <TableCell className="font-mono text-sm">{student?.code}</TableCell>
                            <TableCell className="font-medium">{student?.first_name} {student?.last_name}</TableCell>
                            <TableCell>{student?.email}</TableCell>
                            <TableCell>{student?.phone}</TableCell>
                            <TableCell>
                              <Badge variant="outline">{pack.code}</Badge>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                      {totalStudents === 0 && (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                            {language === 'fr' ? 'Aucun étudiant inscrit' : 'No enrolled students'}
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* View Pack Dialog */}
        <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{language === 'fr' ? 'Détails du cours' : 'Course Details'}</DialogTitle>
            </DialogHeader>
            {selectedPack && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">{language === 'fr' ? 'Titre' : 'Title'}</p>
                    <p className="font-semibold">{selectedPack.title}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Code</p>
                    <p className="font-mono">{selectedPack.code}</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Description</p>
                  <p>{selectedPack.description}</p>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">{language === 'fr' ? 'Début' : 'Start'}</p>
                    <p>{new Date(selectedPack.date_start).toLocaleDateString(language === 'fr' ? 'fr-FR' : 'en-US')}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">{language === 'fr' ? 'Fin' : 'End'}</p>
                    <p>{new Date(selectedPack.date_end).toLocaleDateString(language === 'fr' ? 'fr-FR' : 'en-US')}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">{language === 'fr' ? 'Limite inscription' : 'Registration deadline'}</p>
                    <p>{new Date(selectedPack.date_deadline).toLocaleDateString(language === 'fr' ? 'fr-FR' : 'en-US')}</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{language === 'fr' ? 'Lien du cours' : 'Course link'}</p>
                  <a href={selectedPack.course_link} target="_blank" rel="noopener noreferrer" className="text-primary underline">
                    {selectedPack.course_link}
                  </a>
                </div>
                {selectedPack.media_type === 'video' ? (
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">{language === 'fr' ? 'Vidéo' : 'Video'}</p>
                    <iframe
                      src={selectedPack.media_link}
                      className="w-full aspect-video rounded-lg"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                ) : (
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Image</p>
                    <img src={selectedPack.media_link} alt={selectedPack.title} className="w-full rounded-lg" />
                  </div>
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Edit Pack Dialog */}
        <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>{language === 'fr' ? 'Modifier le cours' : 'Edit Course'}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Description</Label>
                <Textarea
                  value={editForm.description || ''}
                  onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                  rows={3}
                />
              </div>
              <div>
                <Label>{language === 'fr' ? 'Lien du cours' : 'Course link'}</Label>
                <Input
                  value={editForm.course_link || ''}
                  onChange={(e) => setEditForm({ ...editForm, course_link: e.target.value })}
                />
              </div>
              <div>
                <Label>{language === 'fr' ? 'Lien média' : 'Media link'}</Label>
                <Input
                  value={editForm.media_link || ''}
                  onChange={(e) => setEditForm({ ...editForm, media_link: e.target.value })}
                />
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

        {/* Students Dialog */}
        <Dialog open={studentsDialogOpen} onOpenChange={setStudentsDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {language === 'fr' ? 'Étudiants inscrits' : 'Enrolled Students'} - {selectedPack?.title}
              </DialogTitle>
            </DialogHeader>
            {selectedPack && (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Code</TableHead>
                      <TableHead>{language === 'fr' ? 'Nom' : 'Name'}</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>{language === 'fr' ? 'Téléphone' : 'Phone'}</TableHead>
                      <TableHead>{language === 'fr' ? 'Ville' : 'City'}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {getEnrolledStudents(selectedPack.id).map(({ student }) => (
                      <TableRow key={student?.id}>
                        <TableCell className="font-mono text-sm">{student?.code}</TableCell>
                        <TableCell className="font-medium">{student?.first_name} {student?.last_name}</TableCell>
                        <TableCell>{student?.email}</TableCell>
                        <TableCell>{student?.phone}</TableCell>
                        <TableCell>{student?.city}</TableCell>
                      </TableRow>
                    ))}
                    {getEnrolledStudents(selectedPack.id).length === 0 && (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                          {language === 'fr' ? 'Aucun étudiant inscrit' : 'No enrolled students'}
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
};

const ProfessorDashboard: React.FC = () => (
  <LanguageProvider><ProfessorDashboardContent /></LanguageProvider>
);

export default ProfessorDashboard;
