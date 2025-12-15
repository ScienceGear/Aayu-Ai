import React from 'react';
import { CaregiverLayout } from '@/components/layout/CaregiverLayout';
import { useApp, Language } from '@/contexts/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Globe, Bell, Palette, Sun, Moon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { languages } from '@/lib/translations';

export default function CaregiverSettings() {
    const { settings, updateSettings } = useApp();
    const { toast } = useToast();

    const handleLanguageChange = (value: Language) => {
        updateSettings({ language: value });
        toast({ title: 'Language Updated', description: `App language changed.` });
    };

    const handleThemeToggle = () => {
        const newTheme = settings.theme === 'light' ? 'dark' : 'light';
        updateSettings({ theme: newTheme });
        toast({ title: 'Theme Updated', description: `Switched to ${newTheme} mode` });
    };

    return (
        <CaregiverLayout>
            <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
                <h1 className="text-3xl font-bold">Settings</h1>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><Globe className="w-5 h-5" /> Language</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2">
                            <Label>App Language</Label>
                            <Select value={settings.language} onValueChange={(v) => handleLanguageChange(v as Language)}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent className="max-h-64">
                                    {languages.map(lang => (
                                        <SelectItem key={lang.value} value={lang.value}>{lang.label}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><Bell className="w-5 h-5" /> Notifications</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between">
                            <Label>SOS Alerts</Label>
                            <Switch defaultChecked />
                        </div>
                        <div className="flex items-center justify-between">
                            <Label>Message Notifications</Label>
                            <Switch defaultChecked />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><Palette className="w-5 h-5" /> Appearance</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center justify-between">
                            <Label>Theme</Label>
                            <Button variant="outline" onClick={handleThemeToggle} className="gap-2">
                                {settings.theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
                                {settings.theme === 'light' ? 'Dark Mode' : 'Light Mode'}
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </CaregiverLayout>
    );
}
