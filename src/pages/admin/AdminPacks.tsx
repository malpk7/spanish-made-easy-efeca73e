import React, { useState } from 'react';
import { LanguageProvider } from '@/contexts/LanguageContext';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Edit, Trash2, Video, Image, Calendar, Users, Link as LinkIcon } from 'lucide-react';
import { mockPacks, mockPayments, mockUsers, type Pack } from '@/data/mockData';
import { toast } from 'sonner';

const AdminPacksContent: React.FC = () => {
  const [packs, setPacks] = useState(mockPacks);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedPack, setSelectedPack] = useState<Pack | null>(null);
  const [formData, setFormData] = useState<Partial<Pack>>({});

  const professors = mockUsers.filter(u => u.role === 'professor');

  const getEnrolledCount = (packId: string) => {
    return mockPayments.filter(p => p.pack_id === packId && p.status === 'validated').length;
  };

  const getPackProfessors = (pack: Pack) => {
    return professors.filter(p => pack.assigned_professors.includes(p.id));
  };

  const isDeadlinePassed = (deadline: string) => {
    return new Date(deadline) < new Date();
  };

  const handleEditPack = (pack: Pack) => {
    setSelectedPack(pack);
    setFormData(pack);
    setEditDialogOpen(true);
  };

  const handleCreatePack = () => {
    setSelectedPack(null);
    setFormData({
      code: `PACK-${Math.random().toString(36).substring(2, 5).toUpperCase()}`,
      title: '',
      description: '',
      date_start: '',
      date_end: '',
      date_deadline: '',
      course_link: '',
      media_type: 'video',
      media_link: '',
      status: 'active',
      assigned_professors: [],
    });
    setEditDialogOpen(true);
  };

  const handleDeletePack = (packId: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce pack ?')) {
      setPacks(prev => prev.filter(p => p.id !== packId));
      toast.success('Pack supprimé');
    }
  };

  const handleSavePack = () => {
    if (selectedPack) {
      setPacks(prev => prev.map(p => p.id === selectedPack.id ? { ...p, ...formData } : p));
      toast.success('Pack mis à jour');
    } else {
      const newPack: Pack = {
        ...formData as Pack,
        id: `pack-${Date.now()}`,
      };
      setPacks(prev => [...prev, newPack]);
      toast.success('Pack créé');
    }
    setEditDialogOpen(false);
  };

  const getDaysUntil = (date: string) => {
    const diff = new Date(date).getTime() - new Date().getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  return (
    <DashboardLayout title="Gestion des Packs">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <p className="text-muted-foreground">
              Maximum 3 packs actifs · {packs.filter(p => p.status === 'active').length}/3 actifs
            </p>
          </div>
          <Button 
            className="gap-2" 
            onClick={handleCreatePack}
            disabled={packs.filter(p => p.status === 'active').length >= 3}
          >
            <Plus className="w-4 h-4" />
            Nouveau Pack
          </Button>
        </div>

        {/* Packs Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {packs.map((pack) => {
            const enrolledCount = getEnrolledCount(pack.id);
            const packProfessors = getPackProfessors(pack);
            const deadlinePassed = isDeadlinePassed(pack.date_deadline);
            const daysUntilStart = getDaysUntil(pack.date_start);
            const daysUntilDeadline = getDaysUntil(pack.date_deadline);

            return (
              <Card key={pack.id} className={`overflow-hidden ${pack.status === 'inactive' ? 'opacity-60' : ''}`}>
                {/* Media Preview */}
                <div className="aspect-video bg-muted relative">
                  {pack.media_type === 'video' ? (
                    <div className="w-full h-full flex items-center justify-center bg-gray-900">
                      <Video className="w-12 h-12 text-white/50" />
                    </div>
                  ) : (
                    <img 
                      src={pack.media_link} 
                      alt={pack.title}
                      className="w-full h-full object-cover"
                    />
                  )}
                  <div className="absolute top-2 right-2 flex gap-2">
                    <Badge className={pack.status === 'active' ? 'bg-green-500' : 'bg-gray-500'}>
                      {pack.status === 'active' ? 'Actif' : 'Inactif'}
                    </Badge>
                  </div>
                  <div className="absolute top-2 left-2">
                    <Badge className="bg-spanish-gold text-white font-mono">
                      {pack.code}
                    </Badge>
                  </div>
                </div>

                <CardContent className="p-4 space-y-4">
                  <div>
                    <h3 className="font-semibold text-lg">{pack.title}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">{pack.description}</p>
                  </div>

                  {/* Dates */}
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <span>Début: {new Date(pack.date_start).toLocaleDateString('fr-FR')}</span>
                      {daysUntilStart > 0 && (
                        <Badge variant="outline" className="ml-auto text-xs">
                          J-{daysUntilStart}
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <span>Fin: {new Date(pack.date_end).toLocaleDateString('fr-FR')}</span>
                    </div>
                    <div className={`flex items-center gap-2 ${deadlinePassed ? 'text-red-500' : ''}`}>
                      <Calendar className="w-4 h-4" />
                      <span>Inscription: {new Date(pack.date_deadline).toLocaleDateString('fr-FR')}</span>
                      {!deadlinePassed && daysUntilDeadline > 0 && (
                        <Badge variant="outline" className="ml-auto text-xs bg-orange-100 text-orange-700">
                          J-{daysUntilDeadline}
                        </Badge>
                      )}
                      {deadlinePassed && (
                        <Badge className="ml-auto text-xs bg-red-100 text-red-700">
                          Fermé
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Info */}
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-muted-foreground" />
                      <span>{enrolledCount} inscrits</span>
                    </div>
                    <div className="flex items-center gap-1">
                      {packProfessors.map(prof => (
                        <span key={prof.id} className="w-6 h-6 rounded-full bg-spanish-gold/20 flex items-center justify-center text-xs font-medium text-spanish-gold">
                          {prof.first_name[0]}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Course Link */}
                  <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted p-2 rounded">
                    <LinkIcon className="w-3 h-3" />
                    <span className="truncate">{pack.course_link}</span>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      className="flex-1 gap-2"
                      onClick={() => handleEditPack(pack)}
                    >
                      <Edit className="w-4 h-4" />
                      Modifier
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => handleDeletePack(pack.id)}
                    >
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Edit/Create Dialog */}
        <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{selectedPack ? 'Modifier le pack' : 'Créer un nouveau pack'}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Code du pack</Label>
                  <Input 
                    value={formData.code || ''} 
                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                    placeholder="PACK-XXX"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Statut</Label>
                  <Select 
                    value={formData.status} 
                    onValueChange={(v) => setFormData({ ...formData, status: v as 'active' | 'inactive' })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Actif</SelectItem>
                      <SelectItem value="inactive">Inactif</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Titre du pack</Label>
                <Input 
                  value={formData.title || ''} 
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Español Básico A1"
                />
              </div>

              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea 
                  value={formData.description || ''} 
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Description du cours..."
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Date de début</Label>
                  <Input 
                    type="date"
                    value={formData.date_start || ''} 
                    onChange={(e) => setFormData({ ...formData, date_start: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Date de fin</Label>
                  <Input 
                    type="date"
                    value={formData.date_end || ''} 
                    onChange={(e) => setFormData({ ...formData, date_end: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Date limite inscription</Label>
                  <Input 
                    type="date"
                    value={formData.date_deadline || ''} 
                    onChange={(e) => setFormData({ ...formData, date_deadline: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Lien du cours (Google Meet / Teams / Zoom)</Label>
                <Input 
                  value={formData.course_link || ''} 
                  onChange={(e) => setFormData({ ...formData, course_link: e.target.value })}
                  placeholder="https://meet.google.com/..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Type de média</Label>
                  <Select 
                    value={formData.media_type} 
                    onValueChange={(v) => setFormData({ ...formData, media_type: v as 'video' | 'image' })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="video">Vidéo YouTube</SelectItem>
                      <SelectItem value="image">Image</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Lien du média</Label>
                  <Input 
                    value={formData.media_link || ''} 
                    onChange={(e) => setFormData({ ...formData, media_link: e.target.value })}
                    placeholder={formData.media_type === 'video' ? 'https://youtube.com/...' : 'https://...'}
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
                  Annuler
                </Button>
                <Button onClick={handleSavePack}>
                  {selectedPack ? 'Enregistrer' : 'Créer'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
};

const AdminPacks: React.FC = () => {
  return (
    <LanguageProvider>
      <AdminPacksContent />
    </LanguageProvider>
  );
};

export default AdminPacks;
