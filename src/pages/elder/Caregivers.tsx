import React, { useState } from 'react';
import { ElderLayout } from '@/components/layout/ElderLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useApp } from '@/contexts/AppContext';
import { useTranslation } from '@/lib/translations';
import { ChatInterface } from '@/components/communication/ChatInterface';
import { VideoCallInterface } from '@/components/communication/VideoCallInterface';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
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
  ThumbsUp,
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
  ratingsCount: number;
  experience: string;
  location: string;
  assignedSince: string;
}

export default function Caregivers() {
  const { settings, users, startCall, activeCall, user: currentUser } = useApp();
  const t = useTranslation(settings.language);
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [openChatId, setOpenChatId] = useState<string | null>(null);

  // Rating State
  const [ratingModalOpen, setRatingModalOpen] = useState(false);
  const [selectedCaregiver, setSelectedCaregiver] = useState<Caregiver | null>(null);
  const [ratingValue, setRatingValue] = useState(5);
  const [ratingComment, setRatingComment] = useState('');

  // Filter real users with role 'caregiver' and map to Caregiver interface
  const realCaregivers: Caregiver[] = users
    .filter(u => u.role === 'caregiver')
    .map(u => ({
      id: u.id,
      name: u.name,
      avatar: u.profilePic || `https://api.dicebear.com/7.x/avataaars/svg?seed=${u.email}`,
      role: 'Caregiver',
      specialization: u.specialization || 'General Assistance',
      phone: u.phone || 'Not provided',
      email: u.email,
      isOnline: u.isOnline || false,
      lastSeen: u.lastSeen ? new Date(u.lastSeen).toLocaleTimeString() : 'Recently',
      rating: u.rating || 4.5, // Default if 0
      ratingsCount: u.ratingsCount || 0,
      experience: u.experience || 'Experienced',
      location: u.location || 'On Call',
      assignedSince: new Date(parseInt(u.id.substring(0, 8), 16) * 1000).getFullYear().toString() || '2024',
    }));

  const filteredCaregivers = realCaregivers.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.specialization.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCall = (caregiver: Caregiver, type: 'voice' | 'video') => {
    startCall(caregiver.id, type);
    toast({
      title: type === 'voice' ? t.callCaregiver : t.videoCall,
      description: `Connecting to ${caregiver.name}...`,
    });
  };

  const handleChat = (caregiver: Caregiver) => {
    setOpenChatId(caregiver.id);
  };

  const openRatingModal = (caregiver: Caregiver) => {
    setSelectedCaregiver(caregiver);
    setRatingValue(5);
    setRatingComment('');
    setRatingModalOpen(true);
  };

  const submitRating = async () => {
    if (!selectedCaregiver || !currentUser) return;

    try {
      const response = await fetch(`/api/users/${selectedCaregiver.id}/rate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          elderId: currentUser.id,
          elderName: currentUser.name,
          rating: ratingValue,
          comment: ratingComment
        })
      });

      if (response.ok) {
        toast({ title: "Feedback Sent", description: "Thank you for your feedback!" });
        setRatingModalOpen(false);
        // Ideally trigger refresh of users list here
      } else {
        toast({ title: "Error", description: "Could not save rating.", variant: "destructive" });
      }
    } catch (e) {
      toast({ title: "Error", description: "Failed to connect to server.", variant: "destructive" });
    }
  };

  return (
    <ElderLayout>
      <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
        {openChatId ? (
          <div className="animate-in fade-in slide-in-from-right-10 duration-300 h-[calc(100vh-100px)] flex flex-col">
            <div className="pb-2">
              <Button
                variant="ghost"
                className="gap-2 text-muted-foreground hover:text-foreground pl-0 hover:bg-transparent"
                onClick={() => setOpenChatId(null)}
              >
                <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                  <Users className="h-4 w-4" />
                </div>
                Back to All Caregivers
              </Button>
            </div>
            <div className="flex-1 overflow-hidden">
              <ChatInterface
                recipientId={openChatId}
                onClose={() => setOpenChatId(null)}
              />
            </div>
          </div>
        ) : (
          <>
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
              <Card className="text-center p-3 sm:p-4">
                <div className="text-2xl sm:text-3xl font-bold text-primary">{realCaregivers.length}</div>
                <p className="text-xs sm:text-sm text-muted-foreground">Total Caregivers</p>
              </Card>
              <Card className="text-center p-3 sm:p-4">
                <div className="text-2xl sm:text-3xl font-bold text-success">{realCaregivers.filter(c => c.isOnline).length}</div>
                <p className="text-xs sm:text-sm text-muted-foreground">{t.online}</p>
              </Card>
              <Card className="text-center p-3 sm:p-4">
                <div className="text-2xl sm:text-3xl font-bold text-secondary">
                  {(realCaregivers.reduce((acc, c) => acc + c.rating, 0) / (realCaregivers.length || 1)).toFixed(1)}
                </div>
                <p className="text-xs sm:text-sm text-muted-foreground">Avg Rating</p>
              </Card>
            </div>

            {/* Caregivers List */}
            <div className="space-y-4">
              {filteredCaregivers.length === 0 ? (
                <Card className="p-8 text-center">
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
                              className={`absolute bottom-1 right-1 w-4 h-4 rounded-full border-2 border-background ${caregiver.isOnline ? 'bg-success' : 'bg-muted-foreground'
                                }`}
                            />
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
                                  <div className="flex flex-col items-end">
                                    <span className="text-sm text-muted-foreground">{t.lastSeen} {caregiver.lastSeen}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Details Grid */}
                          <div className="grid grid-cols-2 gap-x-4 gap-y-2 mt-3 text-sm">
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <Star className="w-4 h-4 text-warning fill-warning" />
                              <span>{caregiver.rating.toFixed(1)} ({caregiver.ratingsCount} reviews)</span>
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
                            <Button
                              variant="ghost"
                              size="icon"
                              className="hidden sm:inline-flex text-muted-foreground hover:text-primary"
                              onClick={() => openRatingModal(caregiver)}
                            >
                              <ThumbsUp className="w-4 h-4" />
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
            <Card className="border-danger/20 bg-danger/5">
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

            {/* Rating Dialog */}
            <Dialog open={ratingModalOpen} onOpenChange={setRatingModalOpen}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Rate {selectedCaregiver?.name}</DialogTitle>
                  <DialogDescription>
                    Share your feedback to help us improve our care services.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="flex flex-col items-center gap-2">
                    <Label>Rating</Label>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          onClick={() => setRatingValue(star)}
                          className={`text-2xl transition-colors ${star <= ratingValue ? 'text-warning' : 'text-muted-foreground'}`}
                        >
                          ★
                        </button>
                      ))}
                    </div>
                    <span className="text-sm font-medium text-muted-foreground">
                      {ratingValue === 5 ? "Excellent" : ratingValue === 4 ? "Good" : ratingValue === 3 ? "Okay" : "Needs Improvement"}
                    </span>
                  </div>
                  <div className="space-y-2">
                    <Label>Feedback (Optional)</Label>
                    <Textarea
                      placeholder="Write a few words about your experience..."
                      value={ratingComment}
                      onChange={e => setRatingComment(e.target.value)}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setRatingModalOpen(false)}>Cancel</Button>
                  <Button onClick={submitRating}>Submit Feedback</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </>
        )}

        {activeCall && <VideoCallInterface />}
      </div>
    </ElderLayout>
  );
}
