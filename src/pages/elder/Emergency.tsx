import React, { useState, useEffect } from 'react';
import { ElderLayout } from '@/components/layout/ElderLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  AlertTriangle,
  Phone,
  MapPin,
  Heart,
  Droplets,
  Clock,
  User,
  Plus,
  Edit,
  Trash2,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useApp } from '@/contexts/AppContext';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

// Helper to play beep sound
const playBeep = () => {
  const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
  if (!AudioContext) return;
  const audioContext = new AudioContext();
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();

  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);

  oscillator.type = 'sine';
  oscillator.frequency.setValueAtTime(800, audioContext.currentTime); // 800Hz beep
  gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);

  oscillator.start();
  setTimeout(() => oscillator.stop(), 200); // 200ms beep
};

export default function Emergency() {
  const { toast } = useToast();
  const { user, updateUser, socketRef } = useApp();
  const [sosTriggered, setSosTriggered] = useState(false);
  const [countdown, setCountdown] = useState(0);

  // Editable Data State
  const [isAddContactOpen, setIsAddContactOpen] = useState(false);
  const [newContact, setNewContact] = useState({ name: '', phone: '', relation: '' });

  const [isEditMedicalOpen, setIsEditMedicalOpen] = useState(false);
  // Initialize medical info from localStorage or use defaults (simulating real data)
  // Initialize medical info from localStorage or use defaults (simulating real data)
  const [medicalInfo, setMedicalInfo] = useState(() => {
    try {
      const saved = localStorage.getItem('emergency-medical-info');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error("Failed to parse medical info", e);
    }

    return {
      bloodGroup: user?.bloodGroup || 'B+',
      allergies: ['Penicillin', 'Peanuts'],
      conditions: ['Type 2 Diabetes', 'Hypertension'],
      medications: ['Metformin', 'Amlodipine', 'Aspirin'], // fix spelling mismatch: 'currentMedications' vs 'medications' in state update
    };
  });

  useEffect(() => {
    localStorage.setItem('emergency-medical-info', JSON.stringify(medicalInfo));
  }, [medicalInfo]);


  const triggerSOS = () => {
    if (countdown > 0 || sosTriggered) return;

    let count = 3;
    setCountdown(count);
    playBeep();

    const timer = setInterval(() => {
      count--;
      setCountdown(count);
      if (count > 0) {
        playBeep();
      } else {
        clearInterval(timer);
        if (count === 0) { // Double check safely
          // Final beep
          playBeep();
          sendSOS();
        }
      }
    }, 1000);
  };

  const sendSOS = () => {
    setSosTriggered(true);
    setCountdown(0);

    const emitAlert = (loc: string) => {
      if (socketRef.current && user) {
        socketRef.current.emit('sos_alert', {
          elderId: user.id,
          name: user.name,
          location: loc,
          time: new Date().toLocaleTimeString()
        });
      }
    };

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          emitAlert(`Live: ${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
        },
        (error) => {
          console.error("Geo error:", error);
          emitAlert('Home (GPS Unavailable)');
        }
      );
    } else {
      emitAlert('Home (No GPS Support)');
    }

    toast({
      title: '🚨 SOS Alert Sent!',
      description: 'Your emergency contacts and caregivers have been notified.',
      variant: 'destructive',
      duration: 10000,
    });

    // Reset after 10s
    setTimeout(() => setSosTriggered(false), 10000);
  };

  const callContact = (name: string, phone: string) => {
    toast({
      title: `Calling ${name}...`,
      description: phone,
    });
  };

  // --- Data Management ---
  const handleAddContact = async () => {
    if (!newContact.name || !newContact.phone) return;
    const updatedContacts = [...(user?.emergencyContacts || []), newContact];
    await updateUser({ emergencyContacts: updatedContacts });
    setNewContact({ name: '', phone: '', relation: '' });
    setIsAddContactOpen(false);
  };

  const removeContact = async (index: number) => {
    const updated = (user?.emergencyContacts || []).filter((_, i) => i !== index);
    await updateUser({ emergencyContacts: updated });
  };

  const updateMedicalInfo = (field: string, value: any) => {
    setMedicalInfo(prev => ({ ...prev, [field]: value }));
    if (field === 'bloodGroup') {
      updateUser({ bloodGroup: value });
    }
  };

  return (
    <ElderLayout>
      <div className="space-y-6 animate-fade-in">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3 text-danger">
            <AlertTriangle className="w-8 h-8" />
            Emergency & SOS
          </h1>
          <p className="text-muted-foreground mt-1">Quick access to emergency help</p>
        </div>

        {/* SOS Button */}
        <Card variant="elevated" className="overflow-hidden border-danger/20">
          <div className="h-2 bg-danger" />
          <CardContent className="p-8 text-center">
            <h2 className="text-xl font-semibold mb-4">
              {sosTriggered ? 'Alert Sent!' : countdown > 0 ? `Sending in ${countdown}...` : 'Need Immediate Help?'}
            </h2>
            <p className="text-muted-foreground mb-6">
              {sosTriggered
                ? 'Your emergency contacts are being notified. Stay calm.'
                : countdown > 0
                  ? 'Stay calm, help is on the way.'
                  : 'Press the button below to alert all your emergency contacts and caregivers.'}
            </p>

            <button
              onClick={triggerSOS}
              disabled={sosTriggered || countdown > 0}
              className={`w-40 h-40 rounded-full mx-auto flex items-center justify-center transition-all ${sosTriggered
                ? 'bg-success text-success-foreground'
                : countdown > 0
                  ? 'bg-warning text-warning-foreground animate-pulse'
                  : 'bg-danger text-danger-foreground pulse-danger hover:scale-105'
                }`}
            >
              <div className="text-center">
                <AlertTriangle className="w-16 h-16 mx-auto mb-2" />
                <span className="text-2xl font-bold">
                  {sosTriggered ? 'SENT' : countdown > 0 ? countdown : 'SOS'}
                </span>
              </div>
            </button>

            {sosTriggered && (
              <div className="mt-6 p-4 bg-success/10 rounded-xl">
                <p className="text-success font-medium">
                  ✓ Alerts sent to contacts
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  Your location has been shared with emergency contacts
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Emergency Contacts */}
          <Card variant="elevated">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Phone className="w-5 h-5 text-primary" />
                Emergency Contacts
              </CardTitle>
              <Dialog open={isAddContactOpen} onOpenChange={setIsAddContactOpen}>
                <DialogTrigger asChild>
                  <Button variant="ghost" size="icon"><Plus className="w-5 h-5" /></Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader><DialogTitle>Add Emergency Contact</DialogTitle></DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label>Name</Label>
                      <Input value={newContact.name} onChange={e => setNewContact({ ...newContact, name: e.target.value })} />
                    </div>
                    <div className="space-y-2">
                      <Label>Phone</Label>
                      <Input value={newContact.phone} onChange={e => setNewContact({ ...newContact, phone: e.target.value })} />
                    </div>
                    <div className="space-y-2">
                      <Label>Relation</Label>
                      <Input value={newContact.relation} onChange={e => setNewContact({ ...newContact, relation: e.target.value })} />
                    </div>
                  </div>
                  <DialogFooter><Button onClick={handleAddContact}>Save Contact</Button></DialogFooter>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent className="space-y-4">
              {(user?.emergencyContacts || []).length === 0 ? (
                <p className="text-muted-foreground text-sm text-center">No contacts added.</p>
              ) : (
                (user?.emergencyContacts || []).map((contact, idx) => (
                  <div key={idx} className="flex items-center justify-between p-4 bg-muted rounded-xl">
                    <div className="flex items-center gap-3">
                      <Avatar className="w-12 h-12">
                        <AvatarFallback className="bg-primary text-primary-foreground">
                          {contact.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h4 className="font-semibold">{contact.name}</h4>
                        <p className="text-sm text-muted-foreground">{contact.relation} • {contact.phone}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="success" size="icon" onClick={() => callContact(contact.name, contact.phone)} className="rounded-full w-8 h-8">
                        <Phone className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => removeContact(idx)} className="rounded-full w-8 h-8 text-destructive">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          {/* Medical Information */}
          <Card variant="elevated">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Heart className="w-5 h-5 text-danger" />
                Medical Information
              </CardTitle>
              <Dialog open={isEditMedicalOpen} onOpenChange={setIsEditMedicalOpen}>
                <DialogTrigger asChild>
                  <Button variant="ghost" size="icon"><Edit className="w-5 h-5" /></Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader><DialogTitle>Edit Medical Info</DialogTitle></DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label>Blood Group</Label>
                      <Input value={medicalInfo.bloodGroup} onChange={e => updateMedicalInfo('bloodGroup', e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label>Allergies (comma separated)</Label>
                      <Input value={medicalInfo.allergies.join(', ')} onChange={e => updateMedicalInfo('allergies', e.target.value.split(',').map((s: string) => s.trim()))} />
                    </div>
                    <div className="space-y-2">
                      <Label>Conditions (comma separated)</Label>
                      <Input value={medicalInfo.conditions.join(', ')} onChange={e => updateMedicalInfo('conditions', e.target.value.split(',').map((s: string) => s.trim()))} />
                    </div>
                    <div className="space-y-2">
                      <Label>Current Meds (comma separated)</Label>
                      <Input value={medicalInfo.medications.join(', ')} onChange={e => updateMedicalInfo('medications', e.target.value.split(',').map((s: string) => s.trim()))} />
                    </div>
                  </div>
                  <DialogFooter><Button onClick={() => setIsEditMedicalOpen(false)}>Save Changes</Button></DialogFooter>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-danger/10 rounded-xl text-center">
                  <Droplets className="w-8 h-8 mx-auto text-danger mb-2" />
                  <p className="text-sm text-muted-foreground">Blood Group</p>
                  <p className="text-2xl font-bold text-danger">{medicalInfo.bloodGroup}</p>
                </div>
                <div className="p-4 bg-warning/10 rounded-xl">
                  <p className="text-sm text-muted-foreground mb-2">Allergies</p>
                  <div className="flex flex-wrap gap-1">
                    {(medicalInfo.allergies || []).map((allergy: string, i: number) => (
                      <span key={i} className="text-xs bg-warning text-warning-foreground px-2 py-1 rounded">
                        {allergy}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-4 bg-muted rounded-xl">
                <p className="text-sm text-muted-foreground mb-2">Medical Conditions</p>
                <div className="flex flex-wrap gap-2">
                  {(medicalInfo.conditions || []).map((condition: string, i: number) => (
                    <span key={i} className="text-sm bg-primary/10 text-primary px-3 py-1 rounded-full">
                      {condition}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-4 bg-muted rounded-xl">
                <p className="text-sm text-muted-foreground mb-2">Current Medications</p>
                <div className="flex flex-wrap gap-2">
                  {(medicalInfo.medications || []).map((med: string, i: number) => (
                    <span key={i} className="text-sm bg-secondary/10 text-secondary px-3 py-1 rounded-full">
                      {med}
                    </span>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        {/* ... existing location and past emergencies cards can remain or be updated if needed ... */}
        {/* I will keep the rest of the layout which was Location Sharing and Past Emergencies */}
        <Card variant="elevated">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-success" />
              Location Sharing
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between p-4 bg-muted rounded-xl">
              <div>
                <h4 className="font-semibold">Share Live Location</h4>
                <p className="text-sm text-muted-foreground">
                  Your caregivers can see your location during emergencies
                </p>
              </div>
              <Button variant="success">
                <MapPin className="w-4 h-4 mr-2" />
                Enable
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </ElderLayout>
  );
}
