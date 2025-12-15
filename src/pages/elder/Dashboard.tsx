import React, { useState, useEffect } from 'react';
import { ElderLayout } from '@/components/layout/ElderLayout';
import { useApp } from '@/contexts/AppContext';
import { useTranslation } from '@/lib/translations';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
  CheckCircle2,
  Circle,
  Clock,
  Droplets,
  Plus,
  Pill,
  Music,
  AlertCircle,
  Sparkles,
  Heart,
} from 'lucide-react';
import { MoodGreat, MoodOkay, MoodSad, MoodUpset, MoodTired } from '@/components/icons/MoodIcons';
import { useToast } from '@/hooks/use-toast';

// Mock data
const mockActivities = [
  { id: '1', title: 'Morning Walk', completed: false, dueTime: '7:00 AM', priority: 'high' as const },
  { id: '2', title: 'Take Blood Pressure Reading', completed: true, dueTime: '8:00 AM', priority: 'high' as const },
  { id: '3', title: 'Call Daughter', completed: false, dueTime: '10:00 AM', priority: 'medium' as const },
  { id: '4', title: 'Yoga Session', completed: false, dueTime: '5:00 PM', priority: 'low' as const },
];

const mockMedicine = {
  name: 'Metformin 500mg',
  dosage: '1 tablet',
  nextDose: '12:30 PM',
  stock: 12,
  lowStockThreshold: 10,
};

const moodOptions = [
  { icon: MoodGreat, label: 'Great', value: 'great', color: 'text-success', bg: 'bg-success/10', activeBg: 'bg-success' },
  { icon: MoodOkay, label: 'Okay', value: 'okay', color: 'text-warning', bg: 'bg-warning/10', activeBg: 'bg-warning' },
  { icon: MoodSad, label: 'Sad', value: 'sad', color: 'text-primary', bg: 'bg-primary/10', activeBg: 'bg-primary' },
  { icon: MoodUpset, label: 'Upset', value: 'upset', color: 'text-danger', bg: 'bg-danger/10', activeBg: 'bg-danger' },
  { icon: MoodTired, label: 'Tired', value: 'tired', color: 'text-accent', bg: 'bg-accent/10', activeBg: 'bg-accent' },
];

export default function ElderDashboard() {
  const { user, settings } = useApp();
  const t = useTranslation(settings.language);
  const { toast } = useToast();
  const [greeting, setGreeting] = useState('');
  const [activities, setActivities] = useState(mockActivities);
  const [waterGlasses, setWaterGlasses] = useState(3);
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const waterGoal = 8;

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting(t.goodMorning);
    else if (hour < 17) setGreeting(t.goodAfternoon);
    else setGreeting(t.goodEvening);
  }, [t]);

  const toggleActivity = (id: string) => {
    setActivities(prev =>
      prev.map(activity =>
        activity.id === id ? { ...activity, completed: !activity.completed } : activity
      )
    );
    toast({
      title: 'Activity Updated',
      description: 'Your activity has been marked as complete.',
    });
  };

  const addWater = () => {
    if (waterGlasses < waterGoal) {
      setWaterGlasses(prev => prev + 1);
      toast({
        title: 'Great job! 💧',
        description: `You've had ${waterGlasses + 1} glasses of water today.`,
      });
    }
  };

  const handleMoodSelect = (mood: string) => {
    setSelectedMood(mood);
    toast({
      title: 'Mood Logged',
      description: `You're feeling ${mood} today. Take care of yourself!`,
    });
  };

  const completedActivities = activities.filter(a => a.completed).length;
  const progressPercentage = (completedActivities / activities.length) * 100;

  return (
    <ElderLayout>
      <div className="space-y-6 animate-fade-in">
        {/* Greeting Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">{greeting}, {user?.name?.split(' ')[0]}! 👋</h1>
            <p className="text-muted-foreground mt-1">{t.todayActivity} Summary</p>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="w-4 h-4" />
            <span>{new Date().toLocaleDateString(settings.language === 'en' ? 'en-IN' : `${settings.language}-IN`, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
          </div>
        </div>

        {/* Main Dashboard Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Pending Activities Card */}
          <Card variant="elevated" className="lg:col-span-1">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-primary" />
                {t.todayActivity}
              </CardTitle>
              <span className="text-sm text-muted-foreground">{completedActivities}/{activities.length}</span>
            </CardHeader>
            <CardContent>
              <Progress value={progressPercentage} className="mb-4 h-2" />
              <div className="space-y-3">
                {activities.map(activity => (
                  <button
                    key={activity.id}
                    onClick={() => toggleActivity(activity.id)}
                    className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${activity.completed
                        ? 'bg-success/10 text-success'
                        : 'bg-muted hover:bg-muted/80'
                      }`}
                  >
                    {activity.completed ? (
                      <CheckCircle2 className="w-5 h-5 shrink-0" />
                    ) : (
                      <Circle className="w-5 h-5 shrink-0" />
                    )}
                    <span className={`flex-1 text-left ${activity.completed ? 'line-through' : ''}`}>
                      {activity.title}
                    </span>
                    <span className="text-xs text-muted-foreground">{activity.dueTime}</span>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Medicine Reminder Card */}
          <Card variant="elevated">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2">
                <Pill className="w-5 h-5 text-secondary" />
                {t.nextMedicine}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-secondary/10 rounded-xl p-4 mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-lg">{mockMedicine.name}</span>
                  {mockMedicine.stock <= mockMedicine.lowStockThreshold && (
                    <span className="flex items-center gap-1 text-xs text-warning">
                      <AlertCircle className="w-3 h-3" />
                      Low stock
                    </span>
                  )}
                </div>
                <p className="text-muted-foreground">{mockMedicine.dosage}</p>
                <div className="flex items-center gap-2 mt-3 text-2xl font-bold text-secondary">
                  <Clock className="w-6 h-6" />
                  {mockMedicine.nextDose}
                </div>
              </div>
              <Button variant="secondary" className="w-full" size="lg">
                <CheckCircle2 className="w-5 h-5 mr-2" />
                Mark as Taken
              </Button>
              <p className="text-center text-sm text-muted-foreground mt-3">
                {mockMedicine.stock} tablets remaining
              </p>
            </CardContent>
          </Card>

          {/* How Are You Feeling Card + Quick Health Stats */}
          <div className="flex flex-col gap-6">
            <Card variant="elevated">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Sparkles className="w-5 h-5 text-accent" />
                  {t.howAreYou}
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex flex-wrap justify-center gap-2">
                  {moodOptions.map(mood => {
                    const isSelected = selectedMood === mood.value;
                    return (
                      <button
                        key={mood.value}
                        onClick={() => handleMoodSelect(mood.value)}
                        className={`group flex flex-col items-center gap-1.5 px-3 py-2.5 rounded-2xl transition-all duration-200 ${isSelected
                            ? `${mood.activeBg} text-white shadow-md scale-105`
                            : `${mood.bg} ${mood.color} hover:scale-105`
                          }`}
                      >
                        <mood.icon className="w-7 h-7" />
                        <span className="text-[11px] font-medium">{mood.label}</span>
                      </button>
                    );
                  })}
                </div>
                {selectedMood && (
                  <div className="mt-4 bg-muted/50 rounded-xl px-4 py-2.5 text-center border border-border/30">
                    <p className="text-sm text-foreground">
                      Feeling <span className="font-semibold capitalize">{selectedMood}</span> · {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Quick Health Stats */}
            <Card variant="elevated">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Heart className="w-5 h-5 text-danger" />
                  {t.healthSummary}
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-success/10 rounded-xl p-3 text-center">
                    <div className="text-2xl font-bold text-success">72</div>
                    <p className="text-xs text-muted-foreground">Heart Rate</p>
                  </div>
                  <div className="bg-primary/10 rounded-xl p-3 text-center">
                    <div className="text-2xl font-bold text-primary">120/80</div>
                    <p className="text-xs text-muted-foreground">BP</p>
                  </div>
                  <div className="bg-secondary/10 rounded-xl p-3 text-center">
                    <div className="text-2xl font-bold text-secondary">98.4°</div>
                    <p className="text-xs text-muted-foreground">Temp</p>
                  </div>
                  <div className="bg-accent/10 rounded-xl p-3 text-center">
                    <div className="text-2xl font-bold text-accent">6,240</div>
                    <p className="text-xs text-muted-foreground">Steps</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Water Intake Tracker */}
          <Card variant="elevated">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2">
                <Droplets className="w-5 h-5 text-primary" />
                {t.waterIntake}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-center mb-4">
                <div className="relative w-32 h-40">
                  {/* Glass Container */}
                  <div className="absolute inset-0 border-4 border-primary/30 rounded-b-3xl rounded-t-lg overflow-hidden">
                    {/* Water Fill */}
                    <div
                      className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-primary to-primary/70 transition-all duration-500"
                      style={{ height: `${(waterGlasses / waterGoal) * 100}%` }}
                    />
                  </div>
                  {/* Glass Number */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-3xl font-bold text-foreground drop-shadow-lg">
                      {waterGlasses}/{waterGoal}
                    </span>
                  </div>
                </div>
              </div>
              <Progress value={(waterGlasses / waterGoal) * 100} className="mb-4 h-3" />
              <Button
                variant="default"
                className="w-full"
                size="lg"
                onClick={addWater}
                disabled={waterGlasses >= waterGoal}
              >
                <Plus className="w-5 h-5 mr-2" />
                Add Glass
              </Button>
            </CardContent>
          </Card>

          {/* Meditation & Relaxation */}
          <Card variant="gradient" className="lg:col-span-2">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2">
                <Music className="w-5 h-5 text-accent" />
                Relax & Meditate
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <button className="bg-card hover:bg-card/80 rounded-xl p-4 text-center transition-all hover:scale-105">
                  <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-2">
                    <Music className="w-6 h-6 text-accent" />
                  </div>
                  <h4 className="font-semibold">Play Bhajan</h4>
                  <p className="text-xs text-muted-foreground">Peaceful devotional music</p>
                </button>

                <button className="bg-card hover:bg-card/80 rounded-xl p-4 text-center transition-all hover:scale-105">
                  <div className="w-12 h-12 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-2 breathe">
                    <div className="w-6 h-6 rounded-full bg-success" />
                  </div>
                  <h4 className="font-semibold">Breathing Exercise</h4>
                  <p className="text-xs text-muted-foreground">Calm your mind</p>
                </button>

                <button className="bg-card hover:bg-card/80 rounded-xl p-4 text-center transition-all hover:scale-105">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-2">
                    <Clock className="w-6 h-6 text-primary" />
                  </div>
                  <h4 className="font-semibold">Meditation Timer</h4>
                  <p className="text-xs text-muted-foreground">5, 10, or 15 minutes</p>
                </button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </ElderLayout>
  );
}
