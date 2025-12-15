import React, { useState, useEffect, useRef } from 'react';
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
  Trash2,
  Undo,
  Calendar
} from 'lucide-react';
import { MoodGreat, MoodOkay, MoodSad, MoodUpset, MoodTired } from '@/components/icons/MoodIcons';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription } from '@/components/ui/alert';

// Mock data
// Mock data removed in favor of AppContext
const moodOptions = [
  { icon: MoodGreat, label: 'Great', value: 'great', color: 'text-success', bg: 'bg-success/10', activeBg: 'bg-success' },
  { icon: MoodOkay, label: 'Okay', value: 'okay', color: 'text-warning', bg: 'bg-warning/10', activeBg: 'bg-warning' },
  { icon: MoodSad, label: 'Sad', value: 'sad', color: 'text-primary', bg: 'bg-primary/10', activeBg: 'bg-primary' },
  { icon: MoodUpset, label: 'Upset', value: 'upset', color: 'text-danger', bg: 'bg-danger/10', activeBg: 'bg-danger' },
  { icon: MoodTired, label: 'Tired', value: 'tired', color: 'text-accent', bg: 'bg-accent/10', activeBg: 'bg-accent' },
];

export default function ElderDashboard() {
  const { user, settings, activities, addActivity, removeActivity, toggleActivityStatus, medicines, toggleMedicine } = useApp();
  const t = useTranslation(settings.language);
  const { toast } = useToast();
  const [greeting, setGreeting] = useState('');
  // Filter data for current user
  const myActivities = activities.filter(a => a.userId === user?.id);
  // Sort by time
  const sortedActivities = [...myActivities].sort((a, b) => a.dueTime.localeCompare(b.dueTime));

  const myMedicines = medicines.filter(m => m.userId === user?.id);
  // Sort medicines by time
  const sortedMedicines = [...myMedicines].sort((a, b) => a.time.localeCompare(b.time));

  const [waterGlasses, setWaterGlasses] = useState(3);
  const [waterGoal, setWaterGoal] = useState(8);
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const deletedActivityRef = useRef<{ item: any } | null>(null);

  // Add Activity State
  const [isAddActivityOpen, setIsAddActivityOpen] = useState(false);
  const [newActivityTitle, setNewActivityTitle] = useState('');
  const [newActivityTime, setNewActivityTime] = useState('');


  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting(t.goodMorning);
    else if (hour < 17) setGreeting(t.goodAfternoon);
    else setGreeting(t.goodEvening);

    // Load water goal
    const savedGoal = localStorage.getItem('waterGoal');
    if (savedGoal) setWaterGoal(parseInt(savedGoal));

    // Load water intake with date check
    const today = new Date().toDateString();
    const lastDate = localStorage.getItem('waterDate');
    const savedIntake = localStorage.getItem('waterIntake');

    if (lastDate === today && savedIntake) {
      setWaterGlasses(parseInt(savedIntake));
    } else {
      localStorage.setItem('waterDate', today);
      localStorage.setItem('waterIntake', '0');
      setWaterGlasses(0);
    }

    // Listen for storage events to update water goal instantly if changed in settings
    const handleStorageChange = () => {
      const updatedGoal = localStorage.getItem('waterGoal');
      if (updatedGoal) setWaterGoal(parseInt(updatedGoal));
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);

  }, [t]);

  const toggleActivity = (id: string) => {
    toggleActivityStatus(id);
  };

  const handleAddActivity = () => {
    if (!newActivityTitle || !newActivityTime || !user) return;

    addActivity({
      id: Date.now().toString(),
      userId: user.id,
      title: newActivityTitle,
      completed: false,
      dueTime: newActivityTime,
      priority: 'medium',
    });

    setNewActivityTitle('');
    setNewActivityTime('');
    setIsAddActivityOpen(false);
    toast({
      title: 'Activity Added',
      description: 'New activity has been added to your schedule.',
    });
  };

  const handleDeleteActivity = (id: string) => {
    const item = myActivities.find(a => a.id === id);
    if (!item) return;

    deletedActivityRef.current = { item };
    removeActivity(id);

    toast({
      title: "Activity Deleted",
      description: "Activity moved to trash.",
      action: (
        <Button variant="outline" size="sm" onClick={handleUndoDelete} className="gap-1">
          <Undo className="w-3 h-3" /> Undo
        </Button>
      ),
    });
  };

  const handleUndoDelete = () => {
    if (deletedActivityRef.current) {
      addActivity(deletedActivityRef.current.item);
      deletedActivityRef.current = null;
      toast({ title: "Restored", description: "Activity restored successfully." });
    }
  };

  const addWater = () => {
    if (waterGlasses < waterGoal) {
      const newCount = waterGlasses + 1;
      setWaterGlasses(newCount);
      localStorage.setItem('waterIntake', newCount.toString());
      localStorage.setItem('waterDate', new Date().toDateString());

      toast({
        title: 'Water Logged 💧',
        description: `Great job! ${newCount}/${waterGoal} glasses today.`,
      });
    }
  };

  const handleMoodSelect = (mood: string) => {
    setSelectedMood(mood);
    toast({
      title: 'Mood Reported',
      description: `Your caregiver has been notified that you are feeling ${mood}.`,
    });
  };

  const completedActivities = sortedActivities.filter(a => a.completed).length;
  const progressPercentage = sortedActivities.length > 0 ? (completedActivities / sortedActivities.length) * 100 : 0;

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
          <Card variant="elevated" className="lg:col-span-1 flex flex-col max-h-[500px]">
            <CardHeader className="flex flex-row items-center justify-between pb-2 shrink-0">
              <CardTitle className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-primary" />
                {t.todayActivity}
              </CardTitle>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">{completedActivities}/{sortedActivities.length}</span>
                <Dialog open={isAddActivityOpen} onOpenChange={setIsAddActivityOpen}>
                  <DialogTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-primary/20">
                      <Plus className="w-4 h-4 text-primary" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add New Activity</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="activity-title">Activity Name</Label>
                        <Input
                          id="activity-title"
                          placeholder="e.g., Evening Walk"
                          value={newActivityTitle}
                          onChange={(e) => setNewActivityTitle(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="activity-time">Time</Label>
                        <Input
                          id="activity-time"
                          type="time"
                          value={newActivityTime}
                          onChange={(e) => setNewActivityTime(e.target.value)}
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setIsAddActivityOpen(false)}>Cancel</Button>
                      <Button onClick={handleAddActivity}>Add Activity</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col min-h-0">
              <Progress value={progressPercentage} className="mb-4 h-2 shrink-0" />
              <div className="space-y-3 overflow-y-auto pr-2 custom-scrollbar flex-1">
                {sortedActivities.map(activity => (
                  <div
                    key={activity.id}
                    className={`group w-full flex items-center gap-3 p-3 rounded-xl transition-all ${activity.completed
                      ? 'bg-success/10 text-success'
                      : 'bg-muted hover:bg-muted/80'
                      }`}
                  >
                    <button
                      onClick={() => toggleActivity(activity.id)}
                      className="flex-1 flex items-center gap-3 text-left"
                    >
                      {activity.completed ? (
                        <CheckCircle2 className="w-5 h-5 shrink-0" />
                      ) : (
                        <Circle className="w-5 h-5 shrink-0" />
                      )}
                      <span className={`flex-1 ${activity.completed ? 'line-through' : ''}`}>
                        {activity.title}
                      </span>
                      <span className="text-xs text-muted-foreground">{activity.dueTime}</span>
                    </button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:text-destructive hover:bg-destructive/10"
                      onClick={() => handleDeleteActivity(activity.id)}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                ))}
                {sortedActivities.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground text-sm">
                    No activities for today.
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Medicine Reminder Card - NEXT 24HRS List */}
          <Card variant="elevated" className="max-h-[500px] flex flex-col">
            <CardHeader className="pb-2 shrink-0">
              <CardTitle className="flex items-center gap-2">
                <Pill className="w-5 h-5 text-secondary" />
                Upcoming Medicines (24h)
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 overflow-hidden flex flex-col">
              <div className="space-y-4 overflow-y-auto pr-2 custom-scrollbar">
                {sortedMedicines.map(medicine => (
                  <div key={medicine.id} className="bg-secondary/10 rounded-xl p-3 flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Clock className="w-4 h-4 text-secondary" />
                        <span className="font-bold text-lg text-secondary">{medicine.time}</span>
                      </div>
                      <h4 className="font-semibold">{medicine.name}</h4>
                      <p className="text-xs text-muted-foreground">{medicine.dosage} • {medicine.taken ? 'Taken' : 'Pending'}</p>
                    </div>
                    <Button
                      size="sm"
                      variant="secondary"
                      className="h-8"
                      onClick={() => toggleMedicine(medicine.id)}
                      disabled={medicine.taken}
                    >
                      {medicine.taken ? 'Taken' : 'Take'}
                    </Button>
                  </div>
                ))}
                {sortedMedicines.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground text-sm">
                    No medicines scheduled.
                  </div>
                )}
              </div>
              <div className="mt-4 pt-4 border-t border-border/50 text-center">
                <Button variant="outline" size="sm" className="w-full" asChild>
                  <a href="/elder/medicines">View Full Schedule</a>
                </Button>
              </div>
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
                  <div className="mt-4 bg-muted/50 rounded-xl px-4 py-2.5 text-center border border-border/30 animate-in fade-in zoom-in">
                    <p className="text-sm text-foreground">
                      Report sent to caregiver at {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

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
                        style={{ height: `${Math.min(100, (waterGlasses / waterGoal) * 100)}%` }}
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

          </div>

          {/* New Relax & Meditate Quick Access */}
          <Card variant="gradient" className="lg:col-span-3">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2">
                <Music className="w-5 h-5 text-accent" />
                Relax & Meditate
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Button variant="outline" className="h-auto p-4 flex flex-col gap-2" asChild>
                  <a href="/elder/garden">
                    <Music className="w-8 h-8 text-accent mb-1" />
                    <span className="font-semibold">Play Bhajans</span>
                    <span className="text-xs text-muted-foreground font-normal">Soothe your soul</span>
                  </a>
                </Button>

                <Button variant="outline" className="h-auto p-4 flex flex-col gap-2" asChild>
                  <a href="/elder/garden">
                    <div className="w-8 h-8 rounded-full bg-success/20 flex items-center justify-center mb-1">
                      <div className="w-4 h-4 rounded-full bg-success animate-pulse" />
                    </div>
                    <span className="font-semibold">Breathing</span>
                    <span className="text-xs text-muted-foreground font-normal">Calm anxiety</span>
                  </a>
                </Button>

                <Button variant="outline" className="h-auto p-4 flex flex-col gap-2" asChild>
                  <a href="/elder/garden">
                    <Clock className="w-8 h-8 text-primary mb-1" />
                    <span className="font-semibold">Timer</span>
                    <span className="text-xs text-muted-foreground font-normal">Set meditation time</span>
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </ElderLayout>
  );
}
