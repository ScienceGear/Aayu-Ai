import React, { useState } from 'react';
import { CaregiverLayout } from '@/components/layout/CaregiverLayout';
import { useApp } from '@/contexts/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
    Users,
    AlertTriangle,
    Pill,
    Dumbbell,
    Plus,
    Video,
    Phone,
    Trash2,
    Calendar
} from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function CaregiverDashboard() {
    const { user, users, exercises, medicines, addExercise, addMedicine, removeExercise, removeMedicine } = useApp();
    const [selectedElderId, setSelectedElderId] = useState<string | null>(null);

    // Dialog States
    const [isAddExerciseOpen, setIsAddExerciseOpen] = useState(false);
    const [newExercise, setNewExercise] = useState({
        name: '', duration: '', calories: '', difficulty: 'easy', instructions: ''
    });

    const [isAddMedicineOpen, setIsAddMedicineOpen] = useState(false);
    const [newMedicine, setNewMedicine] = useState({
        name: '', dosage: '', time: '', stock: ''
    });

    // Assume all elders are "assigned" for demo purposes, or filter if we had assignment logic
    const assignedElders = users.filter(u => u.role === 'elder');
    const selectedElder = assignedElders.find(u => u.id === selectedElderId);

    // Filtered Data for Selected Elder
    const elderExercises = exercises.filter(e => e.userId === selectedElderId);
    const elderMedicines = medicines.filter(m => m.userId === selectedElderId);

    const handleAddExercise = () => {
        if (!selectedElderId || !newExercise.name) return;
        addExercise({
            id: crypto.randomUUID(),
            userId: selectedElderId,
            assignedBy: user?.id || 'caregiver',
            name: newExercise.name,
            duration: newExercise.duration,
            calories: parseInt(newExercise.calories) || 0,
            difficulty: newExercise.difficulty as any,
            instructions: newExercise.instructions,
            completed: false,
            date: new Date().toISOString()
        });
        setIsAddExerciseOpen(false);
        setNewExercise({ name: '', duration: '', calories: '', difficulty: 'easy', instructions: '' });
    };

    const handleAddMedicine = () => {
        if (!selectedElderId || !newMedicine.name) return;
        addMedicine({
            id: crypto.randomUUID(),
            userId: selectedElderId,
            assignedBy: user?.id || 'caregiver',
            name: newMedicine.name,
            dosage: newMedicine.dosage,
            time: newMedicine.time,
            stock: parseInt(newMedicine.stock) || 0,
            taken: false,
        });
        setIsAddMedicineOpen(false);
        setNewMedicine({ name: '', dosage: '', time: '', stock: '' });
    };

    return (
        <CaregiverLayout>
            <div className="space-y-6 animate-fade-in">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold">Caregiver Dashboard</h1>
                        <p className="text-muted-foreground mt-1">Manage health plans for your assigned elders.</p>
                    </div>
                </div>

                {/* Elder Selection / List */}
                {!selectedElderId ? (
                    <div className="space-y-4">
                        <h2 className="text-xl font-semibold flex items-center gap-2">
                            <Users className="w-5 h-5" /> Assigned Elders
                        </h2>

                        {assignedElders.length === 0 ? (
                            <Card><CardContent className="p-8 text-center text-muted-foreground">No elders found. Contact admin to add users.</CardContent></Card>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {assignedElders.map(elder => (
                                    <Card key={elder.id} className="card-hover cursor-pointer" onClick={() => setSelectedElderId(elder.id)}>
                                        <CardContent className="p-6 flex flex-col items-center text-center gap-3">
                                            <Avatar className="w-20 h-20">
                                                <AvatarImage src={elder.profilePic} />
                                                <AvatarFallback>{elder.name[0]}</AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <h3 className="font-bold text-lg">{elder.name}</h3>
                                                <p className="text-sm text-muted-foreground">{elder.age} years • {elder.gender}</p>
                                            </div>
                                            <Button variant="outline" className="w-full mt-2">Manage Care Plan</Button>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        )}
                    </div>
                ) : (
                    // Detailed View for Selected Elder
                    <div className="space-y-6">
                        <Button variant="ghost" onClick={() => setSelectedElderId(null)} className="mb-2">← Back to All Elders</Button>

                        {/* Elder Profile Header */}
                        <div className="flex items-center gap-4 bg-muted/30 p-4 rounded-xl border border-border">
                            <Avatar className="w-16 h-16">
                                <AvatarImage src={selectedElder?.profilePic} />
                                <AvatarFallback>{selectedElder?.name[0]}</AvatarFallback>
                            </Avatar>
                            <div>
                                <h2 className="text-2xl font-bold">{selectedElder?.name}</h2>
                                <p className="text-muted-foreground">{selectedElder?.email} • {selectedElder?.phone || 'No phone'}</p>
                            </div>
                            <div className="ml-auto flex gap-2">
                                <Button size="sm" variant="outline"><Phone className="w-4 h-4 mr-2" /> Call</Button>
                                <Button size="sm" variant="outline"><Video className="w-4 h-4 mr-2" /> Video</Button>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Medicine Management */}
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between">
                                    <CardTitle className="flex items-center gap-2">
                                        <Pill className="w-5 h-5 text-blue-500" /> Medicines
                                    </CardTitle>
                                    <Dialog open={isAddMedicineOpen} onOpenChange={setIsAddMedicineOpen}>
                                        <DialogTrigger asChild>
                                            <Button size="sm" variant="outline"><Plus className="w-4 h-4 mr-2" /> Add Med</Button>
                                        </DialogTrigger>
                                        <DialogContent>
                                            <DialogHeader><DialogTitle>Add Medicine</DialogTitle></DialogHeader>
                                            <div className="space-y-4 py-4">
                                                <div className="space-y-2">
                                                    <Label>Medicine Name</Label>
                                                    <Input value={newMedicine.name} onChange={e => setNewMedicine({ ...newMedicine, name: e.target.value })} placeholder="e.g. Asprin" />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label>Dosage</Label>
                                                    <Input value={newMedicine.dosage} onChange={e => setNewMedicine({ ...newMedicine, dosage: e.target.value })} placeholder="e.g. 1 tablet" />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label>Time</Label>
                                                    <Input value={newMedicine.time} onChange={e => setNewMedicine({ ...newMedicine, time: e.target.value })} placeholder="e.g. 8:00 AM" />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label>Stock</Label>
                                                    <Input type="number" value={newMedicine.stock} onChange={e => setNewMedicine({ ...newMedicine, stock: e.target.value })} placeholder="e.g. 30" />
                                                </div>
                                            </div>
                                            <DialogFooter><Button onClick={handleAddMedicine}>Add Medicine</Button></DialogFooter>
                                        </DialogContent>
                                    </Dialog>
                                </CardHeader>
                                <CardContent>
                                    {elderMedicines.length === 0 ? (
                                        <p className="text-muted-foreground text-sm text-center py-4">No medicines assigned.</p>
                                    ) : (
                                        <div className="space-y-3">
                                            {elderMedicines.map(med => (
                                                <div key={med.id} className="flex justify-between items-center p-3 bg-muted/20 rounded-lg">
                                                    <div>
                                                        <p className="font-medium">{med.name}</p>
                                                        <p className="text-xs text-muted-foreground">{med.dosage} at {med.time}</p>
                                                    </div>
                                                    <Button size="icon" variant="ghost" className="text-red-500 h-8 w-8" onClick={() => removeMedicine(med.id)}>
                                                        <Trash2 className="w-4 h-4" />
                                                    </Button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </CardContent>
                            </Card>

                            {/* Exercise Management */}
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between">
                                    <CardTitle className="flex items-center gap-2">
                                        <Dumbbell className="w-5 h-5 text-green-500" /> Exercise Plan
                                    </CardTitle>
                                    <Dialog open={isAddExerciseOpen} onOpenChange={setIsAddExerciseOpen}>
                                        <DialogTrigger asChild>
                                            <Button size="sm" variant="outline"><Plus className="w-4 h-4 mr-2" /> Add Exercise</Button>
                                        </DialogTrigger>
                                        <DialogContent>
                                            <DialogHeader><DialogTitle>Add Exercise</DialogTitle></DialogHeader>
                                            <div className="space-y-4 py-4">
                                                <div className="space-y-2">
                                                    <Label>Exercise Name</Label>
                                                    <Input value={newExercise.name} onChange={e => setNewExercise({ ...newExercise, name: e.target.value })} placeholder="e.g. Walking" />
                                                </div>
                                                <div className="flex gap-4">
                                                    <div className="space-y-2 flex-1">
                                                        <Label>Duration</Label>
                                                        <Input value={newExercise.duration} onChange={e => setNewExercise({ ...newExercise, duration: e.target.value })} placeholder="e.g. 15 mins" />
                                                    </div>
                                                    <div className="space-y-2 flex-1">
                                                        <Label>Calories</Label>
                                                        <Input type="number" value={newExercise.calories} onChange={e => setNewExercise({ ...newExercise, calories: e.target.value })} placeholder="e.g. 50" />
                                                    </div>
                                                </div>
                                                <div className="space-y-2">
                                                    <Label>Difficulty</Label>
                                                    <Select value={newExercise.difficulty} onValueChange={v => setNewExercise({ ...newExercise, difficulty: v })}>
                                                        <SelectTrigger><SelectValue /></SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="easy">Easy</SelectItem>
                                                            <SelectItem value="medium">Medium</SelectItem>
                                                            <SelectItem value="hard">Hard</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                            </div>
                                            <DialogFooter><Button onClick={handleAddExercise}>Add Exercise</Button></DialogFooter>
                                        </DialogContent>
                                    </Dialog>
                                </CardHeader>
                                <CardContent>
                                    {elderExercises.length === 0 ? (
                                        <p className="text-muted-foreground text-sm text-center py-4">No exercises assigned.</p>
                                    ) : (
                                        <div className="space-y-3">
                                            {elderExercises.map(ex => (
                                                <div key={ex.id} className="flex justify-between items-center p-3 bg-muted/20 rounded-lg">
                                                    <div>
                                                        <p className="font-medium">{ex.name}</p>
                                                        <div className="flex gap-2 text-xs text-muted-foreground">
                                                            <span>{ex.duration}</span>
                                                            <span>•</span>
                                                            <span className="capitalize">{ex.difficulty}</span>
                                                        </div>
                                                    </div>
                                                    <Button size="icon" variant="ghost" className="text-red-500 h-8 w-8" onClick={() => removeExercise(ex.id)}>
                                                        <Trash2 className="w-4 h-4" />
                                                    </Button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                )}
            </div>
        </CaregiverLayout>
    );
}
