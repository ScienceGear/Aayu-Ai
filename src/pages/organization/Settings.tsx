import React from 'react';
import { OrganizationLayout } from '@/components/layout/OrganizationLayout';
import { useApp, Language } from '@/contexts/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Globe, Bell, Palette, Sun, Moon, User } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { languages } from '@/lib/translations';

export default function OrganizationSettings() {
    const { settings, updateSettings, user, updateUser } = useApp();
    const { toast } = useToast();

    // Profile State
    const [profileData, setProfileData] = React.useState({
        name: user?.name || '',
        email: user?.email || '',
    });

    React.useEffect(() => {
        if (user) {
            setProfileData({
                name: user.name,
                email: user.email,
            });
        }
    }, [user]);

    const handleSaveProfile = () => {
        updateUser({
            name: profileData.name,
        });
    };

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
        <OrganizationLayout>
            <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
                <h1 className="text-3xl font-bold">Settings</h1>

                {/* Profile Settings */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><User className="w-5 h-5" /> Organization Profile</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label>Organization Name</Label>
                            <Input value={profileData.name} onChange={e => setProfileData({ ...profileData, name: e.target.value })} />
                        </div>
                        <div className="space-y-2">
                            <Label>Email</Label>
                            <Input value={profileData.email} disabled className="bg-muted" />
                        </div>
                        <Button onClick={handleSaveProfile}>Save Details</Button>
                    </CardContent>
                </Card>

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
                            <Label>System Alerts</Label>
                            <Switch defaultChecked />
                        </div>
                        <div className="flex items-center justify-between">
                            <Label>Caregiver Updates</Label>
                            <Switch defaultChecked />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><Globe className="w-5 h-5" /> AI Configuration</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label>Gemini API Key</Label>
                            <div className="flex gap-2">
                                <Input
                                    type="password"
                                    placeholder="Enter your Gemini API Key"
                                    id="gemini-api-key"
                                    defaultValue={localStorage.getItem('VITE_GEMINI_API_KEY') || ''}
                                />
                                <Button onClick={() => {
                                    const input = document.getElementById('gemini-api-key') as HTMLInputElement;
                                    if (input.value) {
                                        localStorage.setItem('VITE_GEMINI_API_KEY', input.value);
                                        toast({ title: 'API Key Updated', description: 'Gemini API key has been saved successfully.' });
                                    }
                                }}>Save</Button>
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Get your API key from <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="text-primary underline">Google AI Studio</a>
                            </p>
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
        </OrganizationLayout>
    );
}
