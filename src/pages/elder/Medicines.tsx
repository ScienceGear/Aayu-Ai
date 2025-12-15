import React, { useState } from 'react';
import { ElderLayout } from '@/components/layout/ElderLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import {
  Pill,
  Plus,
  Clock,
  AlertCircle,
  CheckCircle2,
  Upload,
  FileText,
  Calendar,
  Edit,
  Trash2,
  Loader2,
  User
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Medicine {
  id: string;
  name: string;
  dosage: string;
  frequency: 'daily' | 'twice-daily' | 'weekly';
  time: string;
  stock: number;
  lowStockThreshold: number;
  withFood: boolean;
  image?: string;
  addedBy?: 'self' | 'caretaker';
  caretakerNote?: string;
}

const mockMedicines: Medicine[] = [
  {
    id: '1',
    name: 'Metformin 500mg',
    dosage: '1 tablet',
    frequency: 'twice-daily',
    time: '08:00',
    stock: 12,
    lowStockThreshold: 10,
    withFood: true,
    addedBy: 'self',
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=150&h=150&fit=crop'
  },
  {
    id: '2',
    name: 'Amlodipine 5mg',
    dosage: '1 tablet',
    frequency: 'daily',
    time: '09:00',
    stock: 28,
    lowStockThreshold: 7,
    withFood: false,
    addedBy: 'caretaker',
    caretakerNote: 'Please ensure dad takes this after breakfast.',
    image: 'https://images.unsplash.com/photo-1585435557343-3b092031a831?w=150&h=150&fit=crop'
  },
  {
    id: '3',
    name: 'Aspirin 75mg',
    dosage: '1 tablet',
    frequency: 'daily',
    time: '08:00',
    stock: 45,
    lowStockThreshold: 10,
    withFood: true
  },
  {
    id: '4',
    name: 'Atorvastatin 10mg',
    dosage: '1 tablet',
    frequency: 'daily',
    time: '21:00',
    stock: 30,
    lowStockThreshold: 10,
    withFood: false
  },
];

export default function Medicines() {
  const { toast } = useToast();
  const [medicines, setMedicines] = useState(mockMedicines);
  const [isUploading, setIsUploading] = useState(false);
  const [newMedicine, setNewMedicine] = useState<Partial<Medicine> & { name: string; dosage: string; frequency: string; time: string; stock: string; withFood: boolean }>({
    name: '',
    dosage: '',
    frequency: 'daily',
    time: '',
    stock: '',
    withFood: false,
  });

  const handleAddMedicine = () => {
    if (!newMedicine.name || !newMedicine.dosage || !newMedicine.time) {
      toast({
        title: 'Missing Information',
        description: 'Please fill in all required fields.',
        variant: 'destructive',
      });
      return;
    }

    const medicine: Medicine = {
      id: Date.now().toString(),
      name: newMedicine.name,
      dosage: newMedicine.dosage,
      frequency: newMedicine.frequency as Medicine['frequency'],
      time: newMedicine.time,
      stock: parseInt(newMedicine.stock) || 30,
      lowStockThreshold: 10,
      withFood: newMedicine.withFood,
      image: newMedicine.image,
      addedBy: 'self'
    };

    setMedicines(prev => [...prev, medicine]);
    setNewMedicine({
      name: '',
      dosage: '',
      frequency: 'daily',
      time: '',
      stock: '',
      withFood: false,
    });

    toast({
      title: 'Medicine Added',
      description: `${medicine.name} has been added to your list.`,
    });
  };

  const handleUploadPrescription = () => {
    setIsUploading(true);

    // Simulate AI extraction
    setTimeout(() => {
      setIsUploading(false);
      toast({
        title: 'Prescription Scanned',
        description: 'AI has extracted medicine details. Please review and confirm.',
      });
      // Add extracted medicine
      setNewMedicine({
        name: 'Pantoprazole 40mg',
        dosage: '1 tablet',
        frequency: 'daily',
        time: '07:00',
        stock: '30',
        withFood: false,
      });
    }, 2000);
  };

  const deleteMedicine = (id: string) => {
    setMedicines(prev => prev.filter(m => m.id !== id));
    toast({
      title: 'Medicine Removed',
      description: 'The medicine has been removed from your list.',
    });
  };

  const getNextDose = (time: string) => {
    const [hours, minutes] = time.split(':').map(Number);
    const now = new Date();
    const doseTime = new Date();
    doseTime.setHours(hours, minutes, 0);

    if (doseTime < now) {
      doseTime.setDate(doseTime.getDate() + 1);
    }

    const diff = doseTime.getTime() - now.getTime();
    const hoursLeft = Math.floor(diff / (1000 * 60 * 60));
    const minutesLeft = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    if (hoursLeft > 0) {
      return `${hoursLeft}h ${minutesLeft}m`;
    }
    return `${minutesLeft}m`;
  };

  return (
    <ElderLayout>
      <div className="space-y-6 animate-fade-in">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <Pill className="w-8 h-8 text-secondary" />
              My Medicines
            </h1>
            <p className="text-muted-foreground mt-1">Manage your daily medications</p>
          </div>
        </div>

        <Tabs defaultValue="current" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="current">Current Medicines</TabsTrigger>
            <TabsTrigger value="add">Add Medicine</TabsTrigger>
            <TabsTrigger value="schedule">Schedule</TabsTrigger>
          </TabsList>

          {/* Current Medicines Tab */}
          <TabsContent value="current">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {medicines.map(medicine => (
                <Card key={medicine.id} variant="elevated" className="overflow-hidden flex flex-col h-full">
                  <div className={`h-2 ${medicine.stock <= medicine.lowStockThreshold ? 'bg-warning' : 'bg-success'}`} />
                  <CardContent className="p-4 flex-1 flex flex-col">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex gap-3">
                        {medicine.image ? (
                          <img src={medicine.image} alt={medicine.name} className="w-12 h-12 rounded-full object-cover border-2 border-primary/20" />
                        ) : (
                          <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center">
                            <Pill className="w-6 h-6 text-secondary" />
                          </div>
                        )}
                        <div>
                          <h3 className="font-semibold text-lg leading-tight">{medicine.name}</h3>
                          <p className="text-sm text-muted-foreground">{medicine.dosage}</p>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Edit className="w-3.5 h-3.5" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => deleteMedicine(medicine.id)}>
                          <Trash2 className="w-3.5 h-3.5 text-danger" />
                        </Button>
                      </div>
                    </div>

                    {medicine.addedBy === 'caretaker' && (
                      <div className="bg-primary/5 border border-primary/10 rounded-lg p-2.5 mb-3 text-sm">
                        <span className="flex items-center gap-1.5 text-primary font-medium text-xs mb-1">
                          <User className="w-3 h-3" />
                          Added by Caretaker
                        </span>
                        {medicine.caretakerNote && (
                          <p className="text-muted-foreground italic text-xs">"{medicine.caretakerNote}"</p>
                        )}
                      </div>
                    )}

                    <div className="space-y-3 mt-auto">
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="w-4 h-4 text-primary" />
                        <span>Next dose in <strong>{getNextDose(medicine.time)}</strong></span>
                      </div>

                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="w-4 h-4 text-secondary" />
                        <span className="capitalize">{medicine.frequency.replace('-', ' ')}</span>
                        {medicine.withFood && (
                          <span className="text-xs bg-muted px-2 py-0.5 rounded">With food</span>
                        )}
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Stock</span>
                          <span className={medicine.stock <= medicine.lowStockThreshold ? 'text-warning flex items-center gap-1' : ''}>
                            {medicine.stock <= medicine.lowStockThreshold && <AlertCircle className="w-3 h-3" />}
                            {medicine.stock} tablets
                          </span>
                        </div>
                        <Progress
                          value={(medicine.stock / 60) * 100}
                          className="h-2"
                        />
                      </div>

                      <Button variant="secondary" className="w-full" size="sm">
                        <CheckCircle2 className="w-4 h-4 mr-2" />
                        Mark as Taken
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Add Medicine Tab */}
          <TabsContent value="add">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Manual Entry */}
              <Card variant="elevated">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Plus className="w-5 h-5" />
                    Add Manually
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="medicine-image">Medicine Image</Label>
                    <div className="flex items-center gap-4">
                      <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center overflow-hidden border">
                        {newMedicine.image ? (
                          <img src={newMedicine.image} alt="Preview" className="h-full w-full object-cover" />
                        ) : (
                          <Upload className="h-6 w-6 text-muted-foreground" />
                        )}
                      </div>
                      <Input
                        id="medicine-image"
                        type="file"
                        accept="image/*"
                        className="flex-1"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const url = URL.createObjectURL(file);
                            setNewMedicine(prev => ({ ...prev, image: url }));
                          }
                        }}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="name">Medicine Name *</Label>
                    <Input
                      id="name"
                      placeholder="e.g., Metformin 500mg"
                      value={newMedicine.name}
                      onChange={(e) => setNewMedicine(prev => ({ ...prev, name: e.target.value }))}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="dosage">Dosage *</Label>
                      <Input
                        id="dosage"
                        placeholder="e.g., 1 tablet"
                        value={newMedicine.dosage}
                        onChange={(e) => setNewMedicine(prev => ({ ...prev, dosage: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="stock">Stock Count</Label>
                      <Input
                        id="stock"
                        type="number"
                        placeholder="30"
                        value={newMedicine.stock}
                        onChange={(e) => setNewMedicine(prev => ({ ...prev, stock: e.target.value }))}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="frequency">Frequency *</Label>
                      <Select
                        value={newMedicine.frequency}
                        onValueChange={(v) => setNewMedicine(prev => ({ ...prev, frequency: v }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="daily">Once Daily</SelectItem>
                          <SelectItem value="twice-daily">Twice Daily</SelectItem>
                          <SelectItem value="weekly">Weekly</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="time">Time *</Label>
                      <Input
                        id="time"
                        type="time"
                        value={newMedicine.time}
                        onChange={(e) => setNewMedicine(prev => ({ ...prev, time: e.target.value }))}
                      />
                    </div>
                  </div>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={newMedicine.withFood}
                      onChange={(e) => setNewMedicine(prev => ({ ...prev, withFood: e.target.checked }))}
                      className="rounded border-border"
                    />
                    <span className="text-sm">Take with food</span>
                  </label>

                  <Button variant="hero" className="w-full" onClick={handleAddMedicine}>
                    <Plus className="w-5 h-5 mr-2" />
                    Add Medicine
                  </Button>
                </CardContent>
              </Card>

              {/* Upload Prescription */}
              <Card variant="elevated">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Upload className="w-5 h-5" />
                    Upload Prescription
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="border-2 border-dashed border-border rounded-xl p-8 text-center">
                    <FileText className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                    <h3 className="font-semibold mb-2">Upload your prescription</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Our AI will automatically extract medicine details
                    </p>

                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      id="prescription-upload"
                      onChange={handleUploadPrescription}
                    />
                    <label htmlFor="prescription-upload">
                      <Button
                        variant="secondary"
                        className="cursor-pointer"
                        disabled={isUploading}
                        asChild
                      >
                        <span>
                          {isUploading ? (
                            <>
                              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                              Scanning...
                            </>
                          ) : (
                            <>
                              <Upload className="w-5 h-5 mr-2" />
                              Choose File
                            </>
                          )}
                        </span>
                      </Button>
                    </label>
                  </div>

                  <div className="mt-4 p-4 bg-muted rounded-xl">
                    <h4 className="font-medium mb-2">Supported formats</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Photos of prescription</li>
                      <li>• PDF documents</li>
                      <li>• Scanned images</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Schedule Tab */}
          <TabsContent value="schedule">
            <Card variant="elevated">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Today's Schedule
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {['07:00', '08:00', '09:00', '12:00', '18:00', '21:00'].map(time => {
                    const medsAtTime = medicines.filter(m => m.time === time);
                    const isPast = new Date().getHours() > parseInt(time.split(':')[0]);

                    return (
                      <div
                        key={time}
                        className={`flex items-start gap-4 p-4 rounded-xl ${isPast ? 'bg-muted/50' : 'bg-muted'
                          }`}
                      >
                        <div className="text-center min-w-[60px]">
                          <span className={`text-lg font-bold ${isPast ? 'text-muted-foreground' : ''}`}>
                            {time}
                          </span>
                        </div>
                        <div className="flex-1">
                          {medsAtTime.length > 0 ? (
                            <div className="space-y-2">
                              {medsAtTime.map(med => (
                                <div
                                  key={med.id}
                                  className={`flex items-center justify-between p-2 rounded-lg ${isPast ? 'bg-success/10' : 'bg-card'
                                    }`}
                                >
                                  <div className="flex items-center gap-2">
                                    {isPast ? (
                                      <CheckCircle2 className="w-5 h-5 text-success" />
                                    ) : (
                                      <Pill className="w-5 h-5 text-secondary" />
                                    )}
                                    <span className={isPast ? 'line-through text-muted-foreground' : ''}>
                                      {med.name}
                                    </span>
                                  </div>
                                  <span className="text-sm text-muted-foreground">{med.dosage}</span>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="text-sm text-muted-foreground">No medicines scheduled</p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </ElderLayout>
  );
}
