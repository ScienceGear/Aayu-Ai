import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useApp } from '@/contexts/AppContext';
import { useToast } from '@/hooks/use-toast';
import { Pill, Activity, User, Clock, AlertCircle, Loader2, ArrowLeft, Stethoscope, HeartPulse, Plus } from 'lucide-react';

export default function DoctorAddMedicine() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { addMedicine, users } = useApp();
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(false);

    const userId = searchParams.get('userId');
    const token = searchParams.get('token');

    // Find the patient name
    const patient = users.find(u => u.id === userId);

    const [newMedicine, setNewMedicine] = useState({
        name: '',
        dosage: '',
        frequency: 'daily',
        time: '',
        stock: '30',
        withFood: false,
    });

    const isTokenValid = userId && token && btoa(userId) === token;

    const handleAdd = async () => {
        if (!newMedicine.name || !newMedicine.dosage || !newMedicine.time || !userId) {
            toast({
                title: 'Missing Information',
                description: 'Please fill in all required fields.',
                variant: 'destructive',
            });
            return;
        }

        setIsLoading(true);
        try {
            const medicine: any = {
                id: Date.now().toString(),
                userId: userId,
                assignedBy: 'Doctor',
                name: newMedicine.name,
                dosage: newMedicine.dosage,
                frequency: newMedicine.frequency,
                time: newMedicine.time,
                stock: parseInt(newMedicine.stock) || 30,
                lowStockThreshold: 10,
                taken: false,
                withFood: newMedicine.withFood,
                assignedAt: new Date().toISOString()
            };

            await addMedicine(medicine);

            toast({
                title: 'Medicine Prescribed',
                description: `${newMedicine.name} added to ${patient?.name || 'patient'}'s schedule.`,
            });

            // Clear form
            setNewMedicine({
                name: '',
                dosage: '',
                frequency: 'daily',
                time: '',
                stock: '30',
                withFood: false,
            });
        } catch (error) {
            toast({
                title: 'Error',
                description: 'Failed to add medicine. Please try again.',
                variant: 'destructive',
            });
        } finally {
            setIsLoading(false);
        }
    };

    if (!isTokenValid) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
                <Card className="max-w-md w-full border-destructive/50 shadow-xl overflow-hidden">
                    <div className="bg-destructive/10 p-6 flex flex-col items-center gap-4">
                        <AlertCircle className="w-16 h-16 text-destructive animate-pulse" />
                        <CardTitle className="text-destructive font-bold text-2xl">Access Denied</CardTitle>
                    </div>
                    <CardContent className="p-8 text-center space-y-6">
                        <p className="text-muted-foreground leading-relaxed">
                            This link is invalid or has expired. Please ask the patient to generate a new QR code for medicine access.
                        </p>
                        <Button variant="outline" className="w-full h-12 rounded-xl group" onClick={() => navigate('/')}>
                            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" /> Back to Home
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-4 md:p-8 flex items-center justify-center">
            <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-primary/10 to-transparent pointer-events-none" />

            <Card className="w-full max-w-2xl border-none shadow-2xl overflow-hidden relative z-10">
                <div className="bg-primary p-8 text-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-10 rotate-12 scale-150">
                        <Stethoscope className="w-32 h-32" />
                    </div>
                    <div className="flex items-center gap-2 mb-4">
                        <HeartPulse className="w-6 h-6 animate-pulse" />
                        <span className="text-xs font-bold tracking-widest uppercase opacity-80">Doctor's Portal</span>
                    </div>
                    <CardTitle className="text-3xl font-bold flex items-center gap-3">
                        <Pill className="w-10 h-10" />
                        Prescribe Medication
                    </CardTitle>
                    <CardDescription className="text-primary-foreground/80 mt-2 text-lg">
                        Adding medicine for <span className="text-white font-bold underline underline-offset-4 decoration-2">{patient?.name || 'Patient'}</span>
                    </CardDescription>
                </div>

                <CardContent className="p-8 space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-3">
                            <Label htmlFor="med-name" className="text-sm font-semibold flex items-center gap-2">
                                <Activity className="w-4 h-4 text-primary" /> Medicine Name
                            </Label>
                            <Input
                                id="med-name"
                                placeholder="e.g., Paracetamol"
                                className="h-12 border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20"
                                value={newMedicine.name}
                                onChange={e => setNewMedicine({ ...newMedicine, name: e.target.value })}
                            />
                        </div>

                        <div className="space-y-3">
                            <Label htmlFor="med-dosage" className="text-sm font-semibold flex items-center gap-2">
                                <Activity className="w-4 h-4 text-primary" /> Dosage
                            </Label>
                            <Input
                                id="med-dosage"
                                placeholder="e.g., 500mg"
                                className="h-12 border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20"
                                value={newMedicine.dosage}
                                onChange={e => setNewMedicine({ ...newMedicine, dosage: e.target.value })}
                            />
                        </div>

                        <div className="space-y-3">
                            <Label htmlFor="med-freq" className="text-sm font-semibold flex items-center gap-2">
                                <Clock className="w-4 h-4 text-primary" /> Frequency
                            </Label>
                            <Select
                                value={newMedicine.frequency}
                                onValueChange={v => setNewMedicine({ ...newMedicine, frequency: v })}
                            >
                                <SelectTrigger id="med-freq" className="h-12 border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20">
                                    <SelectValue placeholder="Select frequency" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="daily text-sm">Daily</SelectItem>
                                    <SelectItem value="twice-daily">Twice Daily</SelectItem>
                                    <SelectItem value="thrice-daily">Thrice Daily</SelectItem>
                                    <SelectItem value="as-needed">As Needed (SOS)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-3">
                            <Label htmlFor="med-time" className="text-sm font-semibold flex items-center gap-2">
                                <Clock className="w-4 h-4 text-primary" /> Preferred Time
                            </Label>
                            <Input
                                id="med-time"
                                type="time"
                                className="h-12 border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20"
                                value={newMedicine.time}
                                onChange={e => setNewMedicine({ ...newMedicine, time: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="flex items-center space-x-3 bg-slate-50 dark:bg-slate-900 p-6 rounded-2xl border border-dashed border-slate-200">
                        <Checkbox
                            id="med-food"
                            checked={newMedicine.withFood}
                            onCheckedChange={checked => setNewMedicine({ ...newMedicine, withFood: !!checked })}
                            className="w-5 h-5 rounded-md"
                        />
                        <div className="grid gap-1.5 leading-none">
                            <Label
                                htmlFor="med-food"
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                            >
                                Take with food
                            </Label>
                            <p className="text-xs text-muted-foreground">
                                Should this medicine be taken after meals?
                            </p>
                        </div>
                    </div>

                    <div className="pt-4 flex flex-col sm:flex-row gap-4">
                        <Button
                            className="flex-1 h-14 rounded-2xl text-lg font-bold shadow-lg shadow-primary/20 group hover:scale-[1.02] transition-all"
                            onClick={handleAdd}
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <Loader2 className="w-6 h-6 animate-spin mr-2" />
                            ) : (
                                <Plus className="w-6 h-6 mr-2 group-hover:rotate-90 transition-transform" />
                            )}
                            Prescribe & Add
                        </Button>
                        <Button
                            variant="outline"
                            className="h-14 px-8 rounded-2xl font-semibold border-slate-200"
                            onClick={() => window.location.href = '/'}
                        >
                            Finish
                        </Button>
                    </div>

                    <div className="bg-blue-50 dark:bg-blue-900/30 p-6 rounded-2xl flex items-start gap-4">
                        <AlertCircle className="w-6 h-6 text-blue-600 mt-0.5" />
                        <div className="text-sm text-blue-700 dark:text-blue-300">
                            <p className="font-bold mb-1">Doctor's Note:</p>
                            Adding this medicine will instantly update the patient's schedule and notify their caregivers if critical. Please ensure dosage accuracy.
                        </div>
                    </div>
                </CardContent>
            </Card>

            <p className="absolute bottom-8 left-0 w-full text-center text-xs text-muted-foreground uppercase tracking-widest font-bold">
                Aayu AI • Medical Dashboard 2.0
            </p>
        </div>
    );
}
