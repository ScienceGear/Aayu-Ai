import React, { useState } from 'react';
import { OrganizationLayout } from '@/components/layout/OrganizationLayout';
import { useApp } from '@/contexts/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Search, Trash2, Check, X, Plus } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function OrganizationCaregivers() {
    const { users, addUser, removeUser } = useApp();
    const [search, setSearch] = useState('');
    const [isAddUserOpen, setIsAddUserOpen] = useState(false);

    // New User Form State
    const [newUser, setNewUser] = useState({
        name: '',
        email: '',
        password: '',
        role: 'caregiver',
    });

    // Filter mainly for caregivers, but show all for admin management power if needed
    // The requirement says "manage caregivers", but user said "add and remove account too" in general.
    // Let's list all users but group them or filter.
    // For this specific page "Manage Caregivers", let's prioritize Caregivers but maybe show a toggle or tabs later.
    // However, to keep it simple and powerful as requested:
    const filteredUsers = users.filter(u =>
        (u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase())) &&
        u.role !== 'organization' // Don't let them delete themselves or other admins easily here
    );

    const handleAddUser = () => {
        if (!newUser.name || !newUser.email || !newUser.password) return;

        addUser({
            id: '', // Generated in context
            name: newUser.name,
            email: newUser.email,
            password: newUser.password,
            role: newUser.role as any,
            profilePic: `https://api.dicebear.com/7.x/avataaars/svg?seed=${newUser.email}`,
        });
        setIsAddUserOpen(false);
        setNewUser({ name: '', email: '', password: '', role: 'caregiver' });
    };

    return (
        <OrganizationLayout>
            <div className="space-y-6 animate-fade-in">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold">User Management</h1>
                        <p className="text-muted-foreground">Manage elders and caregivers in your network.</p>
                    </div>

                    <div className="flex items-center gap-2 w-full md:w-auto">
                        <div className="relative flex-1 md:w-64">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                type="search"
                                placeholder="Search users..."
                                className="pl-8"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>

                        <Dialog open={isAddUserOpen} onOpenChange={setIsAddUserOpen}>
                            <DialogTrigger asChild>
                                <Button className="gap-2">
                                    <Plus className="w-4 h-4" /> Add User
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Add New User</DialogTitle>
                                </DialogHeader>
                                <div className="space-y-4 py-4">
                                    <div className="space-y-2">
                                        <Label>Full Name</Label>
                                        <Input
                                            value={newUser.name}
                                            onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                                            placeholder="John Doe"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Email</Label>
                                        <Input
                                            type="email"
                                            value={newUser.email}
                                            onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                                            placeholder="john@example.com"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Password</Label>
                                        <Input
                                            type="password"
                                            value={newUser.password}
                                            onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                                            placeholder="********"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Role</Label>
                                        <Select
                                            value={newUser.role}
                                            onValueChange={(v) => setNewUser({ ...newUser, role: v })}
                                        >
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="caregiver">Caregiver</SelectItem>
                                                <SelectItem value="elder">Elder</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                                <DialogFooter>
                                    <Button variant="outline" onClick={() => setIsAddUserOpen(false)}>Cancel</Button>
                                    <Button onClick={handleAddUser}>Create Account</Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Registered Users</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {filteredUsers.map(u => (
                                <div key={u.id} className="flex items-center justify-between p-4 bg-muted/30 rounded-xl hover:bg-muted/50 transition-colors">
                                    <div className="flex items-center gap-4">
                                        <Avatar>
                                            <AvatarImage src={u.profilePic} />
                                            <AvatarFallback>{u.name[0]}</AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <h4 className="font-semibold">{u.name}</h4>
                                            <p className="text-sm text-muted-foreground">{u.email}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-6">
                                        <div className="min-w-[100px] text-center">
                                            <Badge variant={u.role === 'caregiver' ? 'default' : 'secondary'}>
                                                {u.role ? u.role.charAt(0).toUpperCase() + u.role.slice(1) : 'Unknown'}
                                            </Badge>
                                        </div>

                                        <div className="flex gap-2">
                                            <Button
                                                size="icon"
                                                variant="outline"
                                                className="h-8 w-8 text-red-600 hover:bg-red-50 hover:text-red-700"
                                                onClick={() => removeUser(u.id)}
                                                disabled={u.id.startsWith('demo-')}
                                                title={u.id.startsWith('demo-') ? "Cannot remove demo user" : "Remove user"}
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {filteredUsers.length === 0 && (
                                <div className="text-center py-8 text-muted-foreground">
                                    No users found matching your search.
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </OrganizationLayout>
    );
}
