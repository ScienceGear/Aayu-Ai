import React, { useState } from 'react';
import { ElderLayout } from '@/components/layout/ElderLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useApp } from '@/contexts/AppContext';
import { useTranslation } from '@/lib/translations';
import {
  Users,
  Phone,
  Video,
  MessageCircle,
  Search,
  Star,
  Clock,
  Heart,
  Shield,
  MapPin,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Caregiver {
  id: string;
  name: string;
  avatar: string;
  role: string;
  specialization: string;
  phone: string;
  email: string;
  isOnline: boolean;
  lastSeen?: string;
  rating: number;
  experience: string;
  location: string;
  assignedSince: string;
}

const mockCaregivers: Caregiver[] = [
  {
    id: '1',
    name: 'Dr. Priya Sharma',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=priya',
    role: 'Primary Caregiver',
    specialization: 'Geriatric Care',
    phone: '+91 98765 43210',
    email: 'priya.sharma@care.com',
    isOnline: true,
    rating: 4.9,
    experience: '8 years',
    location: 'Mumbai, Maharashtra',
    assignedSince: 'Jan 2024',
  },
  {
    id: '2',
    name: 'Rajesh Kumar',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=rajesh',
    role: 'Health Assistant',
    specialization: 'Physical Therapy',
    phone: '+91 87654 32109',
    email: 'rajesh.kumar@care.com',
    isOnline: false,
    lastSeen: '2 hours ago',
    rating: 4.7,
    experience: '5 years',
    location: 'Mumbai, Maharashtra',
    assignedSince: 'Mar 2024',
  },
  {
    id: '3',
    name: 'Sunita Patel',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sunita',
    role: 'Nurse',
    specialization: 'Medicine Management',
    phone: '+91 76543 21098',
    email: 'sunita.patel@care.com',
    isOnline: true,
    rating: 4.8,
    experience: '10 years',
    location: 'Pune, Maharashtra',
    assignedSince: 'Feb 2024',
  },
];

export default function Caregivers() {
  const { settings } = useApp();
  const t = useTranslation(settings.language);
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCaregiver, setSelectedCaregiver] = useState<Caregiver | null>(null);

  const filteredCaregivers = mockCaregivers.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.specialization.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCall = (caregiver: Caregiver, type: 'voice' | 'video') => {
    toast({
      title: type === 'voice' ? t.callCaregiver : t.videoCall,
      description: `Connecting to ${caregiver.name}...`,
    });
  };

  const handleChat = (caregiver: Caregiver) => {
    toast({
      title: t.chat,
      description: `Opening chat with ${caregiver.name}...`,
    });
  };

  return (
    <ElderLayout>
      <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-secondary flex items-center justify-center">
                <Users className="w-5 h-5 sm:w-6 sm:h-6 text-secondary-foreground" />
              </div>
              {t.myCaregivers}
            </h1>
            <p className="text-muted-foreground mt-1">{t.assignedCaregivers}</p>
          </div>
          
          {/* Search */}
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search caregivers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-3 gap-3 sm:gap-4">
          <Card variant="elevated" className="text-center p-3 sm:p-4">
            <div className="text-2xl sm:text-3xl font-bold text-primary">{mockCaregivers.length}</div>
            <p className="text-xs sm:text-sm text-muted-foreground">Total Caregivers</p>
          </Card>
          <Card variant="elevated" className="text-center p-3 sm:p-4">
            <div className="text-2xl sm:text-3xl font-bold text-success">{mockCaregivers.filter(c => c.isOnline).length}</div>
            <p className="text-xs sm:text-sm text-muted-foreground">{t.online}</p>
          </Card>
          <Card variant="elevated" className="text-center p-3 sm:p-4">
            <div className="text-2xl sm:text-3xl font-bold text-secondary">4.8</div>
            <p className="text-xs sm:text-sm text-muted-foreground">Avg Rating</p>
          </Card>
        </div>

        {/* Caregivers List */}
        <div className="space-y-4">
          {filteredCaregivers.length === 0 ? (
            <Card variant="elevated" className="p-8 text-center">
              <Users className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">{t.noCaregivers}</h3>
              <p className="text-muted-foreground">
                Caregivers will appear here once assigned to you.
              </p>
            </Card>
          ) : (
            filteredCaregivers.map((caregiver) => (
              <Card
                key={caregiver.id}
                variant="elevated"
                className="overflow-hidden transition-all hover:shadow-lg"
              >
                <CardContent className="p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row gap-4">
                    {/* Avatar & Status */}
                    <div className="flex items-start gap-4 sm:gap-0">
                      <div className="relative">
                        <Avatar className="w-16 h-16 sm:w-20 sm:h-20 border-4 border-background shadow-lg">
                          <AvatarImage src={caregiver.avatar} />
                          <AvatarFallback className="bg-primary/10 text-primary text-lg">
                            {caregiver.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div
                          className={`absolute bottom-1 right-1 w-4 h-4 rounded-full border-2 border-background ${
                            caregiver.isOnline ? 'bg-success' : 'bg-muted-foreground'
                          }`}
                        />
                      </div>
                      
                      {/* Mobile: Basic Info next to avatar */}
                      <div className="flex-1 sm:hidden">
                        <h3 className="text-lg font-semibold">{caregiver.name}</h3>
                        <Badge variant="secondary" className="mt-1">
                          {caregiver.role}
                        </Badge>
                        <p className="text-sm text-muted-foreground mt-1">
                          {caregiver.isOnline ? (
                            <span className="text-success font-medium">{t.online}</span>
                          ) : (
                            <span>{t.lastSeen} {caregiver.lastSeen}</span>
                          )}
                        </p>
                      </div>
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      {/* Desktop: Basic Info */}
                      <div className="hidden sm:block">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="text-xl font-semibold">{caregiver.name}</h3>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant="secondary">{caregiver.role}</Badge>
                              <span className="text-sm text-muted-foreground">
                                {caregiver.specialization}
                              </span>
                            </div>
                          </div>
                          <div className="text-right">
                            {caregiver.isOnline ? (
                              <Badge className="bg-success/10 text-success border-success/20">
                                {t.online}
                              </Badge>
                            ) : (
                              <span className="text-sm text-muted-foreground">
                                {t.lastSeen} {caregiver.lastSeen}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Details Grid */}
                      <div className="grid grid-cols-2 gap-x-4 gap-y-2 mt-3 text-sm">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Star className="w-4 h-4 text-warning" />
                          <span>{caregiver.rating} Rating</span>
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Clock className="w-4 h-4" />
                          <span>{caregiver.experience}</span>
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <MapPin className="w-4 h-4" />
                          <span className="truncate">{caregiver.location}</span>
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Heart className="w-4 h-4" />
                          <span>Since {caregiver.assignedSince}</span>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex flex-wrap gap-2 mt-4">
                        <Button
                          variant="default"
                          size="sm"
                          className="flex-1 sm:flex-none gap-2"
                          onClick={() => handleCall(caregiver, 'voice')}
                        >
                          <Phone className="w-4 h-4" />
                          <span className="hidden xs:inline">{t.callCaregiver}</span>
                          <span className="xs:hidden">Call</span>
                        </Button>
                        <Button
                          variant="secondary"
                          size="sm"
                          className="flex-1 sm:flex-none gap-2"
                          onClick={() => handleCall(caregiver, 'video')}
                        >
                          <Video className="w-4 h-4" />
                          <span className="hidden xs:inline">{t.videoCall}</span>
                          <span className="xs:hidden">Video</span>
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1 sm:flex-none gap-2"
                          onClick={() => handleChat(caregiver)}
                        >
                          <MessageCircle className="w-4 h-4" />
                          {t.chat}
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Emergency Contact Card */}
        <Card variant="elevated" className="border-danger/20 bg-danger/5">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-danger/10 flex items-center justify-center">
                <Shield className="w-6 h-6 text-danger" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-danger">Emergency Support</h3>
                <p className="text-sm text-muted-foreground">
                  24/7 emergency helpline available
                </p>
              </div>
              <Button variant="destructive" size="sm" className="gap-2">
                <Phone className="w-4 h-4" />
                <span className="hidden sm:inline">Call Now</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </ElderLayout>
  );
}
