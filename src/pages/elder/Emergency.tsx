import React, { useState } from 'react';
import { ElderLayout } from '@/components/layout/ElderLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useApp } from '@/contexts/AppContext';

const emergencyContacts = [
  { id: '1', name: 'Rajesh Kumar', relation: 'Son', phone: '+91 98765 43210', avatar: '' },
  { id: '2', name: 'Priya Sharma', relation: 'Daughter', phone: '+91 87654 32109', avatar: '' },
  { id: '3', name: 'Dr. Anil Mehta', relation: 'Doctor', phone: '+91 76543 21098', avatar: '' },
];

const emergencyInfo = {
  bloodGroup: 'B+',
  allergies: ['Penicillin', 'Peanuts'],
  conditions: ['Type 2 Diabetes', 'Hypertension'],
  currentMedications: ['Metformin', 'Amlodipine', 'Aspirin'],
};

export default function Emergency() {
  const { toast } = useToast();
  const { user } = useApp();
  const [sosTriggered, setSosTriggered] = useState(false);

  const triggerSOS = () => {
    setSosTriggered(true);
    toast({
      title: '🚨 SOS Alert Sent!',
      description: 'Your emergency contacts and caregivers have been notified.',
      variant: 'destructive',
    });

    // Simulate alert being resolved after 5 seconds
    setTimeout(() => {
      setSosTriggered(false);
    }, 5000);
  };

  const callContact = (name: string, phone: string) => {
    toast({
      title: `Calling ${name}...`,
      description: phone,
    });
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
        <Card variant="elevated" className="overflow-hidden">
          <div className="h-2 bg-danger" />
          <CardContent className="p-8 text-center">
            <h2 className="text-xl font-semibold mb-4">
              {sosTriggered ? 'Alert Sent!' : 'Need Immediate Help?'}
            </h2>
            <p className="text-muted-foreground mb-6">
              {sosTriggered
                ? 'Your emergency contacts are being notified. Stay calm.'
                : 'Press the button below to alert all your emergency contacts and caregivers.'}
            </p>
            
            <button
              onClick={triggerSOS}
              disabled={sosTriggered}
              className={`w-40 h-40 rounded-full mx-auto flex items-center justify-center transition-all ${
                sosTriggered
                  ? 'bg-success text-success-foreground'
                  : 'bg-danger text-danger-foreground pulse-danger hover:scale-105'
              }`}
            >
              <div className="text-center">
                <AlertTriangle className="w-16 h-16 mx-auto mb-2" />
                <span className="text-2xl font-bold">
                  {sosTriggered ? 'SENT' : 'SOS'}
                </span>
              </div>
            </button>

            {sosTriggered && (
              <div className="mt-6 p-4 bg-success/10 rounded-xl">
                <p className="text-success font-medium">
                  ✓ Alerts sent to 3 contacts
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
              <Button variant="ghost" size="icon">
                <Plus className="w-5 h-5" />
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {emergencyContacts.map(contact => (
                <div
                  key={contact.id}
                  className="flex items-center justify-between p-4 bg-muted rounded-xl"
                >
                  <div className="flex items-center gap-3">
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={contact.avatar} />
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        {contact.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h4 className="font-semibold">{contact.name}</h4>
                      <p className="text-sm text-muted-foreground">{contact.relation}</p>
                    </div>
                  </div>
                  <Button
                    variant="success"
                    size="icon"
                    onClick={() => callContact(contact.name, contact.phone)}
                    className="rounded-full"
                  >
                    <Phone className="w-5 h-5" />
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Medical Information */}
          <Card variant="elevated">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Heart className="w-5 h-5 text-danger" />
                Medical Information
              </CardTitle>
              <Button variant="ghost" size="icon">
                <Edit className="w-5 h-5" />
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-danger/10 rounded-xl text-center">
                  <Droplets className="w-8 h-8 mx-auto text-danger mb-2" />
                  <p className="text-sm text-muted-foreground">Blood Group</p>
                  <p className="text-2xl font-bold text-danger">{emergencyInfo.bloodGroup}</p>
                </div>
                <div className="p-4 bg-warning/10 rounded-xl">
                  <p className="text-sm text-muted-foreground mb-2">Allergies</p>
                  <div className="flex flex-wrap gap-1">
                    {emergencyInfo.allergies.map(allergy => (
                      <span key={allergy} className="text-xs bg-warning text-warning-foreground px-2 py-1 rounded">
                        {allergy}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-4 bg-muted rounded-xl">
                <p className="text-sm text-muted-foreground mb-2">Medical Conditions</p>
                <div className="flex flex-wrap gap-2">
                  {emergencyInfo.conditions.map(condition => (
                    <span key={condition} className="text-sm bg-primary/10 text-primary px-3 py-1 rounded-full">
                      {condition}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-4 bg-muted rounded-xl">
                <p className="text-sm text-muted-foreground mb-2">Current Medications</p>
                <div className="flex flex-wrap gap-2">
                  {emergencyInfo.currentMedications.map(med => (
                    <span key={med} className="text-sm bg-secondary/10 text-secondary px-3 py-1 rounded-full">
                      {med}
                    </span>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Location Sharing */}
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

        {/* Past Emergencies */}
        <Card variant="elevated">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-muted-foreground" />
              Past Emergencies
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-4 bg-muted/50 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-success" />
                  <div>
                    <p className="font-medium">False Alarm</p>
                    <p className="text-sm text-muted-foreground">Resolved • Dec 5, 2024</p>
                  </div>
                </div>
                <span className="text-xs text-muted-foreground">2 contacts notified</span>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-muted/50 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-warning" />
                  <div>
                    <p className="font-medium">Feeling Unwell</p>
                    <p className="text-sm text-muted-foreground">Doctor called • Nov 28, 2024</p>
                  </div>
                </div>
                <span className="text-xs text-muted-foreground">3 contacts notified</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </ElderLayout>
  );
}
