import React, { useState } from 'react';
import { OrganizationLayout } from '@/components/layout/OrganizationLayout';
import { useApp } from '@/contexts/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Search, Trash2, UserPlus, Users, UserCog, MoreHorizontal, CheckCircle, XCircle } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

export default function OrganizationCaregivers() {
    const { users, addUser, removeUser, updateUser } = useApp();
    const { toast } = useToast();
    const [search, setSearch] = useState('');
    const [activeTab, setActiveTab] = useState<'caregivers' | 'elders'>('caregivers');

    // Selection state
    const [selectedElderIds, setSelectedElderIds] = useState<string[]>([]);
    const [isAssignOpen, setIsAssignOpen] = useState(false);
    const [selectedCaregiverId, setSelectedCaregiverId] = useState<string>('');

    // Add User
    const [isAddUserOpen, setIsAddUserOpen] = useState(false);
    const [newUser, setNewUser] = useState({ name: '', email: '', password: '', role: 'caregiver', status: 'active' });

    // Filtered lists
    const caregivers = users.filter(u => u.role === 'caregiver' &&
        (u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase()))
    );
    const elders = users.filter(u => u.role === 'elder' &&
        (u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase()))
    );

    const allCaregivers = users.filter(u => u.role === 'caregiver'); // For assignment dropdown

    // --- Actions ---
    const handleAddUser = () => {
        if (!newUser.name || !newUser.email || !newUser.password) return;
        addUser({
            id: '',
            name: newUser.name,
            email: newUser.email,
            password: newUser.password,
            role: newUser.role as any,
            status: newUser.status as any,
            profilePic: `https://api.dicebear.com/7.x/avataaars/svg?seed=${newUser.email}`,
        });
        setIsAddUserOpen(false);
        setNewUser({ name: '', email: '', password: '', role: 'caregiver', status: 'active' });
    };

    const toggleApprove = async (id: string, currentStatus: string | undefined) => {
        const newStatus = currentStatus === 'active' ? 'pending' : 'active';
        // Optimistic update - in real app, update context properly or refetch
        // updateUser is defined in AppContext to persist to local/state
        // But for backend sync we need to call API. updateUser calls API? 
        // Let's assume updateUser handles it or I call API directly.
        // AppContext updateUser saves to localStorage. I added API call in previous steps to AppContext updateUser? 
        // No, I added it to a specific spot. Let's do API call here to be safe.
        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
        try {
            await fetch(`${API_URL}/users/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus })
            });
            // Force refresh or update context manually if needed. 
            // Since we rely on 'users' from context, we need context to update.
            // I'll assume users context refreshes or I trigger a reload.
            // For now, simple toast.
            toast({ title: `User ${newStatus === 'active' ? 'Approved' : 'Suspended'}` });
            window.location.reload(); // Quick dirty refresh to see changes if context doesn't auto-update
        } catch (e) {
            console.error(e);
        }
    };

    // --- Elder Assignment ---
    const toggleSelectElder = (id: string) => {
        if (selectedElderIds.includes(id)) {
            setSelectedElderIds(prev => prev.filter(x => x !== id));
        } else {
            setSelectedElderIds(prev => [...prev, id]);
        }
    };

    const toggleSelectAllElders = () => {
        if (selectedElderIds.length === elders.length) {
            setSelectedElderIds([]);
        } else {
            setSelectedElderIds(elders.map(u => u.id));
        }
    };

    const handleAssignCaregiver = async () => {
        if (!selectedCaregiverId) return;
        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
        let count = 0;

        for (const id of selectedElderIds) {
            try {
                await fetch(`${API_URL}/users/${id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ assignedCaregiverId: selectedCaregiverId })
                });
                count++;
            } catch (e) { console.error(e); }
        }

        toast({ title: 'Assignment Complete', description: `Assigned ${count} elders.` });
        setIsAssignOpen(false);
        setSelectedElderIds([]);
        window.location.reload();
    };

    return (
        <OrganizationLayout>
            <div className="space-y-6 animate-fade-in">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold">User Management</h1>
                        <p className="text-muted-foreground">Approve caregivers and assign them to elders.</p>
                    </div>
                </div>

                {/* Custom Tabs */}
                <div className="flex gap-4 border-b">
                    <button
                        onClick={() => setActiveTab('caregivers')}
                        className={cn(
                            "pb-3 text-sm font-medium transition-colors border-b-2",
                            activeTab === 'caregivers'
                                ? "border-primary text-primary"
                                : "border-transparent text-muted-foreground hover:text-foreground"
                        )}
                    >
                        Caregiver Approvals
                    </button>
                    <button
                        onClick={() => setActiveTab('elders')}
                        className={cn(
                            "pb-3 text-sm font-medium transition-colors border-b-2",
                            activeTab === 'elders'
                                ? "border-primary text-primary"
                                : "border-transparent text-muted-foreground hover:text-foreground"
                        )}
                    >
                        Elder Assignment
                    </button>
                </div>

                {/* Toolbar */}
                <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                    <div className="relative flex-1 w-full md:max-w-xs">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            type="search"
                            placeholder={activeTab === 'caregivers' ? "Search caregivers..." : "Search elders..."}
                            className="pl-8"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>

                    <div className="flex gap-2 w-full md:w-auto">
                        {activeTab === 'elders' && selectedElderIds.length > 0 && (
                            <Dialog open={isAssignOpen} onOpenChange={setIsAssignOpen}>
                                <DialogTrigger asChild>
                                    <Button variant="secondary" className="gap-2">
                                        <UserCog className="w-4 h-4" /> Assign Caregiver ({selectedElderIds.length})
                                    </Button>
                                </DialogTrigger>
                                <DialogContent>
                                    <DialogHeader><DialogTitle>Assign Caregiver</DialogTitle></DialogHeader>
                                    <div className="py-4">
                                        <Label>Select Caregiver</Label>
                                        <Select onValueChange={setSelectedCaregiverId}>
                                            <SelectTrigger><SelectValue placeholder="Choose..." /></SelectTrigger>
                                            <SelectContent>
                                                {allCaregivers.map(c => (
                                                    <SelectItem key={c.id} value={c.id}>{c.name} {c.status === 'pending' && '(Pending)'}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <DialogFooter><Button onClick={handleAssignCaregiver}>Confirm</Button></DialogFooter>
                                </DialogContent>
                            </Dialog>
                        )}

                        <Dialog open={isAddUserOpen} onOpenChange={setIsAddUserOpen}>
                            <DialogTrigger asChild>
                                <Button className="gap-2"><UserPlus className="w-4 h-4" /> Add New</Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader><DialogTitle>Add User</DialogTitle></DialogHeader>
                                <div className="space-y-4 py-4">
                                    <div className="grid gap-2"><Label>Name</Label><Input value={newUser.name} onChange={e => setNewUser({ ...newUser, name: e.target.value })} /></div>
                                    <div className="grid gap-2"><Label>Email</Label><Input value={newUser.email} onChange={e => setNewUser({ ...newUser, email: e.target.value })} /></div>
                                    <div className="grid gap-2"><Label>Password</Label><Input type="password" value={newUser.password} onChange={e => setNewUser({ ...newUser, password: e.target.value })} /></div>
                                    <div className="grid gap-2"><Label>Role</Label>
                                        <Select value={newUser.role} onValueChange={v => setNewUser({ ...newUser, role: v })}>
                                            <SelectTrigger><SelectValue /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="caregiver">Caregiver</SelectItem>
                                                <SelectItem value="elder">Elder</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="grid gap-2"><Label>Status</Label>
                                        <Select value={newUser.status} onValueChange={v => setNewUser({ ...newUser, status: v })}>
                                            <SelectTrigger><SelectValue /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="active">Active</SelectItem>
                                                <SelectItem value="pending">Pending</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                                <DialogFooter><Button onClick={handleAddUser}>Create</Button></DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>

                {/* Content */}
                <Card>
                    <CardContent className="p-0">
                        {activeTab === 'caregivers' && (
                            <div className="divide-y">
                                {caregivers.map(u => (
                                    <div key={u.id} className="p-4 flex items-center justify-between hover:bg-muted/50 transition-colors">
                                        <div className="flex items-center gap-4">
                                            <Avatar>
                                                <AvatarImage src={u.profilePic} />
                                                <AvatarFallback>{u.name[0]}</AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <h4 className="font-semibold flex items-center gap-2">
                                                    {u.name}
                                                    {u.status === 'active' ?
                                                        <CheckCircle className="w-4 h-4 text-green-500" /> :
                                                        <Badge variant="outline" className="text-orange-500 border-orange-200 bg-orange-50">Pending Approval</Badge>
                                                    }
                                                </h4>
                                                <p className="text-sm text-muted-foreground">{u.email}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            {u.status !== 'active' ? (
                                                <Button size="sm" className="bg-green-600 hover:bg-green-700" onClick={() => toggleApprove(u.id, u.status)}>
                                                    Approve
                                                </Button>
                                            ) : (
                                                <Button size="sm" variant="outline" className="text-orange-600 border-orange-200" onClick={() => toggleApprove(u.id, u.status)}>
                                                    Suspend
                                                </Button>
                                            )}
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon"><MoreHorizontal className="w-4 h-4" /></Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem onClick={() => removeUser(u.id)} className="text-red-600">Delete</DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>
                                    </div>
                                ))}
                                {caregivers.length === 0 && <div className="p-8 text-center text-muted-foreground">No caregivers found.</div>}
                            </div>
                        )}

                        {activeTab === 'elders' && (
                            <div className="divide-y">
                                <div className="p-2 bg-muted/30 flex items-center gap-2">
                                    <Checkbox
                                        checked={selectedElderIds.length > 0 && selectedElderIds.length === elders.length}
                                        onCheckedChange={toggleSelectAllElders}
                                        className="ml-2"
                                    />
                                    <span className="text-xs font-semibold uppercase text-muted-foreground">Select All</span>
                                </div>
                                {elders.map(u => (
                                    <div key={u.id} className={`p-4 flex items-center justify-between hover:bg-muted/50 transition-colors ${selectedElderIds.includes(u.id) ? 'bg-primary/5' : ''}`}>
                                        <div className="flex items-center gap-4">
                                            <Checkbox
                                                checked={selectedElderIds.includes(u.id)}
                                                onCheckedChange={() => toggleSelectElder(u.id)}
                                            />
                                            <Avatar>
                                                <AvatarImage src={u.profilePic} />
                                                <AvatarFallback>{u.name[0]}</AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <h4 className="font-semibold">{u.name}</h4>
                                                <p className="text-sm text-muted-foreground">{u.email}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-4">
                                            <div className="text-right">
                                                <p className="text-xs text-muted-foreground">Assigned To</p>
                                                <p className="text-sm font-medium">
                                                    {u.assignedCaregiverId ?
                                                        (allCaregivers.find(c => c.id === u.assignedCaregiverId)?.name || 'Unknown ID')
                                                        : <span className="text-orange-500">Unassigned</span>}
                                                </p>
                                            </div>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon"><MoreHorizontal className="w-4 h-4" /></Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem onClick={() => removeUser(u.id)} className="text-red-600">Delete</DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>
                                    </div>
                                ))}
                                {elders.length === 0 && <div className="p-8 text-center text-muted-foreground">No elders found.</div>}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </OrganizationLayout>
    );
}
