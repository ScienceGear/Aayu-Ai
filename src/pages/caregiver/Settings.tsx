import React from 'react';
import { CaregiverLayout } from '@/components/layout/CaregiverLayout';
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

export default function CaregiverSettings() {
    const { settings, updateSettings, user, updateUser } = useApp();
    const { toast } = useToast();

    // Profile State
    const [profileData, setProfileData] = React.useState({
        name: user?.name || '',
        phone: user?.phone || '',
        email: user?.email || '',
        profilePic: user?.profilePic || '',
    });

    const fileInputRef = React.useRef<HTMLInputElement>(null);

    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) { // 5MB limit
                toast({ title: "File too large", description: "Please upload an image smaller than 5MB.", variant: "destructive" });
                return;
            }

            // Using simple base64 for now to ensure it works without backend endpoint
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64 = reader.result as string;
                setProfileData(prev => ({ ...prev, profilePic: base64 }));
                updateUser({ profilePic: base64 }); // Save immediately
                toast({ title: "Image Uploaded", description: "Profile picture updated successfully." });
            };
            reader.readAsDataURL(file);
        }
    };


    React.useEffect(() => {
        if (user) {
            setProfileData({
                name: user.name,
                phone: user.phone || '',
                email: user.email,
                profilePic: user.profilePic || '',
            });
        }
    }, [user]);

    const handleSaveProfile = () => {
        updateUser({
            name: profileData.name,
            phone: profileData.phone,
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
        <CaregiverLayout>
            <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
                <h1 className="text-3xl font-bold">Settings</h1>

                {/* Profile Settings */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><User className="w-5 h-5" /> Profile</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {/* Profile Picture Upload */}
                        <div className="flex items-center gap-6">
                            <div className="relative group">
                                <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center overflow-hidden border-2 border-primary/20">
                                    {profileData.profilePic ? (
                                        <img src={profileData.profilePic} alt="Profile" className="w-full h-full object-cover" />
                                    ) : (
                                        <User className="w-10 h-10 text-muted-foreground" />
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
                            <div>
                                <h3 className="font-medium text-lg">Profile Picture</h3>
                                <p className="text-sm text-muted-foreground mb-2">Upload a professional photo (max 5MB)</p>
                                <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()}>
                                    Change Photo
                                </Button>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label>Full Name</Label>
                                <Input value={profileData.name} onChange={e => setProfileData({ ...profileData, name: e.target.value })} />
                            </div>
                            <div className="space-y-2">
                                <Label>Email</Label>
                                <Input value={profileData.email} disabled className="bg-muted" />
                            </div>
                            <div className="space-y-2">
                                <Label>Phone Number</Label>
                                <Input value={profileData.phone} onChange={e => setProfileData({ ...profileData, phone: e.target.value })} />
                            </div>
                            <Button onClick={handleSaveProfile}>Save Profile</Button>
                        </div>
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
