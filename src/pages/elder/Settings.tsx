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
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

import { languages } from '@/lib/translations';

const textSizeOptions = [
  { value: 'medium', label: 'Medium', size: '16px' },
  { value: 'large', label: 'Large', size: '20px' },
  { value: 'xlarge', label: 'Extra Large', size: '24px' },
];

export default function Settings() {
  const { settings, updateSettings } = useApp();
  const { toast } = useToast();
  const [quietHoursEnabled, setQuietHoursEnabled] = useState(false);

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

        {/* Accessibility Settings */}
        <Card variant="elevated">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Accessibility className="w-5 h-5 text-primary" />
              Accessibility
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Text Size */}
            <div className="space-y-4">
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
                    className="flex flex-col h-auto py-4"
                  >
                    <span style={{ fontSize: option.size }} className="font-semibold">Aa</span>
                    <span className="text-xs mt-1">{option.label}</span>
                  </Button>
                ))}
              </div>
              <div className="p-4 bg-muted rounded-xl">
                <p style={{ fontSize: textSizeOptions.find(o => o.value === settings.textSize)?.size }}>
                  Preview: This is how text will appear in the app.
                </p>
              </div>
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
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Volume2 className="w-5 h-5 text-muted-foreground" />
                <Label className="text-base">Voice Volume</Label>
              </div>
              <Slider defaultValue={[75]} max={100} step={5} />
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
              <Switch defaultChecked />
            </div>

            <div className="flex items-center justify-between py-2">
              <div>
                <Label className="text-base">Activity Reminders</Label>
                <p className="text-sm text-muted-foreground">Reminders for scheduled activities</p>
              </div>
              <Switch defaultChecked />
            </div>

            <div className="flex items-center justify-between py-2">
              <div>
                <Label className="text-base">Water Reminders</Label>
                <p className="text-sm text-muted-foreground">Periodic reminders to stay hydrated</p>
              </div>
              <Switch defaultChecked />
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
              <div className="grid grid-cols-2 gap-4 p-4 bg-muted rounded-xl">
                <div className="space-y-2">
                  <Label>Start Time</Label>
                  <input type="time" defaultValue="22:00" className="w-full rounded-lg border p-2" />
                </div>
                <div className="space-y-2">
                  <Label>End Time</Label>
                  <input type="time" defaultValue="07:00" className="w-full rounded-lg border p-2" />
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Theme */}
        <Card variant="elevated">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="w-5 h-5 text-warning" />
              Appearance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between py-2">
              <div>
                <Label className="text-base">Theme</Label>
                <p className="text-sm text-muted-foreground">
                  {settings.theme === 'light' ? 'Light mode is enabled' : 'Dark mode is enabled'}
                </p>
              </div>
              <Button
                variant="outline"
                size="lg"
                onClick={handleThemeToggle}
                className="gap-2"
              >
                {settings.theme === 'light' ? (
                  <>
                    <Moon className="w-5 h-5" />
                    Dark Mode
                  </>
                ) : (
                  <>
                    <Sun className="w-5 h-5" />
                    Light Mode
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </ElderLayout>
  );
}
