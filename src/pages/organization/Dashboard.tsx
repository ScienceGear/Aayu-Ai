import React, { useState, useEffect } from 'react';
import { OrganizationLayout } from '@/components/layout/OrganizationLayout';
import { useApp } from '@/contexts/AppContext';
import { useTranslation } from '@/lib/translations';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, AlertTriangle, Activity, UserPlus, TrendingUp } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';

export default function OrganizationDashboard() {
    const { user, settings, users } = useApp();
    const t = useTranslation(settings.language);
    const navigate = useNavigate();

    const [activeAlerts, setActiveAlerts] = useState<any[]>([]);
    const [pendingReports, setPendingReports] = useState<any[]>([]);
    const API_URL = import.meta.env.VITE_API_URL || '/api';

    useEffect(() => {
        const fetchData = async () => {
            try {
                const alertsRes = await fetch(`${API_URL}/care/alerts`);
                if (alertsRes.ok) {
                    const data = await alertsRes.json();
                    setActiveAlerts(data.filter((a: any) => a.status === 'active'));
                }
                const reportsRes = await fetch(`${API_URL}/care/reports`);
                if (reportsRes.ok) {
                    const data = await reportsRes.json();
                    setPendingReports(data.filter((r: any) => r.status === 'pending' || r.status === 'sent'));
                }
            } catch (e) { console.error(e); }
        };
        fetchData();
    }, []);

    const totalElders = users.filter(u => u.role === 'elder').length;
    const totalCaregivers = users.filter(u => u.role === 'caregiver').length;

    // Determine Health Status
    const criticalElderIds = new Set(activeAlerts.map(a => a.elderId));
    const attentionElderIds = new Set(pendingReports.map(r => r.userId).filter(id => !criticalElderIds.has(id)));

    // Ensure we count actual elders available in the system
    const realCriticalCount = users.filter(u => u.role === 'elder' && criticalElderIds.has(u.id)).length;
    const realAttentionCount = users.filter(u => u.role === 'elder' && attentionElderIds.has(u.id)).length;
    const stableCount = Math.max(0, totalElders - realCriticalCount - realAttentionCount);

    const elderStatusData = [
        { name: 'Stable', value: stableCount, color: '#22c55e' },
        { name: 'Needs Attention', value: realAttentionCount, color: '#f97316' },
        { name: 'Critical', value: realCriticalCount, color: '#ef4444' },
    ];

    const stats = [
        { label: t.totalElders, value: totalElders, icon: Users, color: 'text-blue-500' },
        { label: 'Active Caregivers', value: totalCaregivers, icon: Activity, color: 'text-green-500' },
        { label: 'Pending Reports', value: pendingReports.length, icon: UserPlus, color: 'text-orange-500' },
        { label: t.activeAlerts, value: activeAlerts.length, icon: AlertTriangle, color: 'text-red-500' },
    ];

    // Recent Users (last 5)
    // Since we don't track 'created_at' in simple mock, we just take the last 5 in the array
    const recentUsers = [...users].slice(-5).reverse();

    return (
        <OrganizationLayout>
            <div className="space-y-6 animate-fade-in">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold">Organization Dashboard</h1>
                        <p className="text-muted-foreground mt-1">Overview of your care network.</p>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {stats.map((stat, index) => (
                        <Card key={index} className="card-hover">
                            <CardContent className="p-6 flex items-center gap-4">
                                <div className={`p-3 rounded-full bg-muted ${stat.color}`}>
                                    <stat.icon className="w-6 h-6" />
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                                    <p className="text-2xl font-bold">{stat.value}</p>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Elder Status Chart */}
                    <Card className="lg:col-span-2">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <TrendingUp className="w-5 h-5" />
                                Elder Health Distribution
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={elderStatusData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={100}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {elderStatusData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                    <Legend verticalAlign="bottom" height={36} />
                                </PieChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>

                    {/* Recent Users / Pending Approvals */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <UserPlus className="w-5 h-5" />
                                Recently Added Users
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {recentUsers.map((u, i) => (
                                    <div key={i} className="flex items-center justify-between p-2 bg-muted/20 rounded-lg">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold uppercase">
                                                {u.name[0]}
                                            </div>
                                            <div>
                                                <p className="font-medium text-sm">{u.name}</p>
                                                <p className="text-xs text-muted-foreground capitalize">{u.role}</p>
                                            </div>
                                        </div>
                                        <Button size="sm" variant="ghost" className="h-8 text-xs" onClick={() => navigate('/organization/caregivers')}>
                                            View
                                        </Button>
                                    </div>
                                ))}
                            </div>
                            <Button className="w-full mt-4" variant="outline" onClick={() => navigate('/organization/caregivers')}>
                                Manage All Users
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </OrganizationLayout>
    );
}
