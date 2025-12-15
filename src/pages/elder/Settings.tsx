import React, { useState } from 'react';
import { ElderLayout } from '@/components/layout/ElderLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useApp, TextSize, Language } from '@/contexts/AppContext';
import {
  Settings as SettingsIcon,
  Eye,
  Globe,
  Bell,
  Palette,
  Sun,
  Moon,
  Volume2,
  Accessibility,
  Mic,
  User,
  Heart,
  Droplets,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

import { languages } from '@/lib/translations';

const textSizeOptions = [
  { value: 'medium', label: 'Medium', size: '16px' },
  { value: 'large', label: 'Large', size: '20px' },
  { value: 'xlarge', label: 'Extra Large', size: '24px' },
];

export default function Settings() {
  const { settings, updateSettings, user, updateUser } = useApp();
  const { toast } = useToast();

  // Notification States
  const [quietHoursEnabled, setQuietHoursEnabled] = useState(() => localStorage.getItem('quietHoursEnabled') === 'true');
  const [medicineReminders, setMedicineReminders] = useState(() => localStorage.getItem('medicineReminders') !== 'false');
  const [activityReminders, setActivityReminders] = useState(() => localStorage.getItem('activityReminders') !== 'false');
  const [waterReminders, setWaterReminders] = useState(() => localStorage.getItem('waterReminders') !== 'false');

  // Slider States
  const [volume, setVolume] = useState(75);
  const [waterGoal, setWaterGoal] = useState(() => parseInt(localStorage.getItem('waterGoal') || '8'));

  // File Upload Ref
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  // Profile Edit State
  const [profileData, setProfileData] = React.useState({
    name: user?.name || '',
    phone: user?.phone || '',
    email: user?.email || '',
    age: user?.age?.toString() || '',
    gender: user?.gender || 'male',
    height: user?.height?.toString() || '',
    weight: user?.weight?.toString() || '',
    bloodGroup: user?.bloodGroup || '',
    profilePic: user?.profilePic || ''
  });

  React.useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name,
        phone: user.phone || '',
        email: user.email,
        age: user.age?.toString() || '',
        gender: user.gender || 'male',
        height: user.height?.toString() || '',
        weight: user.weight?.toString() || '',
        bloodGroup: user.bloodGroup || '',
        profilePic: user.profilePic || ''
      });
    }
  }, [user]);

  // Effects for applying settings
  React.useEffect(() => {
    localStorage.setItem('quietHoursEnabled', quietHoursEnabled.toString());
  }, [quietHoursEnabled]);

  React.useEffect(() => {
    localStorage.setItem('medicineReminders', medicineReminders.toString());
  }, [medicineReminders]);

  React.useEffect(() => {
    localStorage.setItem('activityReminders', activityReminders.toString());
  }, [activityReminders]);

  React.useEffect(() => {
    localStorage.setItem('waterReminders', waterReminders.toString());
  }, [waterReminders]);

  React.useEffect(() => {
    // Apply visibility settings to body
    if (settings.highContrast) document.body.classList.add('high-contrast');
    else document.body.classList.remove('high-contrast');

    if (settings.reduceMotion) document.body.classList.add('reduce-motion');
    else document.body.classList.remove('reduce-motion');
  }, [settings.highContrast, settings.reduceMotion]);


  const handleTextSizeChange = (value: TextSize) => {
    updateSettings({ textSize: value });
    toast({
      title: 'Text Size Updated',
      description: `Text size changed to ${value}`,
    });
  };

  const handleLanguageChange = (value: Language) => {
    updateSettings({ language: value });
    toast({
      title: 'Language Updated',
      description: `App language changed successfully`,
    });
  };

  const handleThemeToggle = () => {
    const newTheme = settings.theme === 'light' ? 'dark' : 'light';
    updateSettings({ theme: newTheme });
    toast({
      title: 'Theme Updated',
      description: `Switched to ${newTheme} mode`,
    });
  };

  const handleSaveProfile = async () => {
    const payload = {
      name: profileData.name,
      phone: profileData.phone,
      email: profileData.email,
      age: parseInt(profileData.age) || 0,
      gender: profileData.gender as any,
      height: parseInt(profileData.height) || 0,
      weight: parseInt(profileData.weight) || 0,
      bloodGroup: profileData.bloodGroup,
      profilePic: profileData.profilePic
    };
    console.log("Saving profile payload:", payload);

    try {
      await updateUser(payload);
      // updateUser usually handles success toast, but let's add one here to be sure
      toast({ title: 'Success', description: 'Profile updated!' });
    } catch (err) {
      console.error("Failed to update profile:", err);
      toast({ title: 'Error', description: 'Failed to save profile', variant: 'destructive' });
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast({ title: "File too large", description: "Please upload an image smaller than 5MB.", variant: "destructive" });
        return;
      }

      const formData = new FormData();
      formData.append('file', file);

      try {
        // Determine API URL dynamically
        const hostname = window.location.hostname;
        const baseUrl = (hostname === 'localhost' || hostname === '127.0.0.1')
          ? 'http://localhost:5000'
          : `http://${hostname}:5000`;

        const res = await fetch(`${baseUrl}/api/upload`, {
          method: 'POST',
          body: formData,
        });

        if (res.ok) {
          const data = await res.json();
          // Construct full URL using the same base
          const fullUrl = `${baseUrl}${data.url}`;
          setProfileData(prev => ({ ...prev, profilePic: fullUrl }));
          toast({ title: "Image Uploaded", description: "Profile picture updated successfully." });
        } else {
          toast({ title: "Upload Failed", description: "Could not upload image.", variant: "destructive" });
        }
      } catch (error) {
        console.error("Upload error:", error);
        toast({ title: "Error", description: "Failed to connect to server.", variant: "destructive" });
      }
    }
  };

  return (
    <ElderLayout>
      <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <SettingsIcon className="w-8 h-8 text-primary" />
            Settings
          </h1>
          <p className="text-muted-foreground mt-1">Customize your Aayu AI experience</p>
        </div>

        {/* Profile Settings */}
        <Card variant="elevated">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5 text-primary" />
              Profile Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              {/* Avatar Section */}
              <div className="flex items-center gap-4">
                <div className="relative group">
                  <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center overflow-hidden border-2 border-primary/10">
                    {profileData.profilePic ? (
                      <img src={profileData.profilePic} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <User className="w-8 h-8 text-muted-foreground" />
                    )}
                  </div>
                  <Button
                    size="icon"
                    variant="secondary"
                    className="absolute bottom-0 right-0 w-8 h-8 rounded-full shadow-md"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <User className="w-4 h-4" />
                  </Button>
                  <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept="image/*"
                    onChange={handleFileUpload}
                  />
                </div>

                <div className="flex-1 space-y-2">
                  <Label>Profile Picture</Label>
                  <div className="flex flex-col gap-2">
                    <Button variant="outline" onClick={() => fileInputRef.current?.click()} className="w-full sm:w-auto">
                      Choose Image File
                    </Button>
                    <p className="text-xs text-muted-foreground">Supports JPG, PNG (max 5MB)</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Name</Label>
                  <Input value={profileData.name} onChange={e => setProfileData({ ...profileData, name: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input value={profileData.email} disabled className="bg-muted opacity-70" />
                </div>
                <div className="space-y-2">
                  <Label>Phone Number</Label>
                  <Input value={profileData.phone} onChange={e => setProfileData({ ...profileData, phone: e.target.value })} placeholder="+91 9876543210" />
                </div>
                <div className="space-y-2">
                  <Label>Age</Label>
                  <Input type="number" value={profileData.age} onChange={e => setProfileData({ ...profileData, age: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Gender</Label>
                  <Select value={profileData.gender} onValueChange={v => setProfileData({ ...profileData, gender: v as any })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Blood Group</Label>
                  <Select value={profileData.bloodGroup} onValueChange={v => setProfileData({ ...profileData, bloodGroup: v })}>
                    <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                    <SelectContent>
                      {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(bg => (
                        <SelectItem key={bg} value={bg}>{bg}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Height (cm)</Label>
                  <Input type="number" placeholder="170" value={profileData.height} onChange={e => setProfileData({ ...profileData, height: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Weight (kg)</Label>
                  <Input type="number" placeholder="70" value={profileData.weight} onChange={e => setProfileData({ ...profileData, weight: e.target.value })} />
                </div>
                <div className="col-span-full pt-2">
                  <Button onClick={handleSaveProfile} className="w-full sm:w-auto" size="lg">Save Profile Changes</Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Language & Voice */}
        <Card variant="elevated">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="w-5 h-5 text-secondary" />
              Language & Voice
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* App Language */}
            <div className="space-y-2">
              <Label className="text-base">App Language</Label>
              <Select value={settings.language} onValueChange={(v) => handleLanguageChange(v as Language)}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="max-h-64">
                  {languages.map(lang => (
                    <SelectItem key={lang.value} value={lang.value}>
                      <span className="flex items-center gap-2">
                        <span>{lang.nativeLabel}</span>
                        <span className="text-muted-foreground text-xs">({lang.label})</span>
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Voice Preference */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Mic className="w-5 h-5 text-muted-foreground" />
                <Label className="text-base">AI Voice Preference</Label>
              </div>
              <Select
                value={settings.voicePreference}
                onValueChange={(v) => updateSettings({ voicePreference: v as any })}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="female">Female Voice</SelectItem>
                  <SelectItem value="male">Male Voice</SelectItem>
                  <SelectItem value="neutral">Neutral Voice</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Volume Preview */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Volume2 className="w-5 h-5 text-muted-foreground" />
                  <Label className="text-base">Voice Volume</Label>
                </div>
                <span className="text-sm font-medium text-primary">{volume}%</span>
              </div>
              <Slider
                value={[volume]}
                onValueChange={(vals) => setVolume(vals[0])}
                max={100}
                step={5}
              />
            </div>
          </CardContent>
        </Card>

        {/* Health & Goals */}
        <Card variant="elevated">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-danger" />
              Health Goals
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Droplets className="w-5 h-5 text-primary" />
                  <Label className="text-base">Daily Water Goal</Label>
                </div>
                <span className="text-sm text-muted-foreground font-medium">
                  {waterGoal} glasses
                </span>
              </div>
              <Slider
                value={[waterGoal]}
                max={15}
                min={4}
                step={1}
                onValueChange={(vals) => {
                  setWaterGoal(vals[0]);
                  localStorage.setItem('waterGoal', vals[0].toString());
                  window.dispatchEvent(new Event('storage'));
                }}
              />
              <p className="text-xs text-muted-foreground">
                Recommended: 8 glasses per day
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card variant="elevated">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-accent" />
              Notifications
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between py-2">
              <div>
                <Label className="text-base">Medicine Reminders</Label>
                <p className="text-sm text-muted-foreground">Get notified when it's time to take medicine</p>
              </div>
              <Switch checked={medicineReminders} onCheckedChange={setMedicineReminders} />
            </div>

            <div className="flex items-center justify-between py-2">
              <div>
                <Label className="text-base">Activity Reminders</Label>
                <p className="text-sm text-muted-foreground">Reminders for scheduled activities</p>
              </div>
              <Switch checked={activityReminders} onCheckedChange={setActivityReminders} />
            </div>

            <div className="flex items-center justify-between py-2">
              <div>
                <Label className="text-base">Water Reminders</Label>
                <p className="text-sm text-muted-foreground">Periodic reminders to stay hydrated</p>
              </div>
              <Switch checked={waterReminders} onCheckedChange={setWaterReminders} />
            </div>

            <div className="flex items-center justify-between py-2">
              <div>
                <Label className="text-base">Quiet Hours</Label>
                <p className="text-sm text-muted-foreground">Silence notifications during set hours</p>
              </div>
              <Switch
                checked={quietHoursEnabled}
                onCheckedChange={setQuietHoursEnabled}
              />
            </div>

            {quietHoursEnabled && (
              <div className="grid grid-cols-2 gap-4 p-4 bg-muted rounded-xl animate-in slide-in-from-top-2">
                <div className="space-y-2">
                  <Label>Start Time</Label>
                  <input type="time" defaultValue="22:00" className="w-full rounded-lg border p-2 text-sm" />
                </div>
                <div className="space-y-2">
                  <Label>End Time</Label>
                  <input type="time" defaultValue="07:00" className="w-full rounded-lg border p-2 text-sm" />
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Theme & Display */}
        <Card variant="elevated">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="w-5 h-5 text-warning" />
              Appearance & Display
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between py-2">
              <div>
                <Label className="text-base">Theme</Label>
                <p className="text-sm text-muted-foreground">
                  {settings.theme === 'light' ? 'Light mode is enabled' : 'Dark mode is enabled'}
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleThemeToggle}
                className="gap-2"
              >
                {settings.theme === 'light' ? (
                  <>
                    <Moon className="w-4 h-4" />
                    Dark Mode
                  </>
                ) : (
                  <>
                    <Sun className="w-4 h-4" />
                    Light Mode
                  </>
                )}
              </Button>
            </div>

            {/* High Contrast */}
            <div className="flex items-center justify-between py-2">
              <div>
                <Label className="text-base">High Contrast Mode</Label>
                <p className="text-sm text-muted-foreground">Increase contrast for better visibility</p>
              </div>
              <Switch
                checked={settings.highContrast}
                onCheckedChange={(checked) => updateSettings({ highContrast: checked })}
              />
            </div>

            {/* Reduce Motion */}
            <div className="flex items-center justify-between py-2">
              <div>
                <Label className="text-base">Reduce Motion</Label>
                <p className="text-sm text-muted-foreground">Minimize animations and transitions</p>
              </div>
              <Switch
                checked={settings.reduceMotion}
                onCheckedChange={(checked) => updateSettings({ reduceMotion: checked })}
              />
            </div>

            {/* Text Size (Moved here for better grouping) */}
            <div className="space-y-4 pt-4 border-t">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Eye className="w-5 h-5 text-muted-foreground" />
                  <Label className="text-base">Text Size</Label>
                </div>
                <span className="text-sm text-muted-foreground">
                  {textSizeOptions.find(o => o.value === settings.textSize)?.size}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {textSizeOptions.map(option => (
                  <Button
                    key={option.value}
                    variant={settings.textSize === option.value ? 'default' : 'outline'}
                    onClick={() => handleTextSizeChange(option.value as TextSize)}
                    className="flex flex-col h-auto py-3"
                  >
                    <span style={{ fontSize: option.size }} className="font-semibold">Aa</span>
                    <span className="text-xs mt-1">{option.label}</span>
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </ElderLayout>
  );
}
