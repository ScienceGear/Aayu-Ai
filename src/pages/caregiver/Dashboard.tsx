import React, { useEffect, useState } from 'react';
import { CaregiverLayout } from '@/components/layout/CaregiverLayout';
import { useApp } from '@/contexts/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, FileText, AlertTriangle, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function CaregiverDashboard() {
    const { user, users, reports } = useApp();
    const navigate = useNavigate();

    // State for real data fetching
    const [alertCount, setAlertCount] = useState(0);
    const [recentAlerts, setRecentAlerts] = useState<any[]>([]);

    // 1. Filter Assigned Elders
    // Only show elders where assignedCaregiverId matches current user ID
    const myElders = users.filter(u => u.role === 'elder' && u.assignedCaregiverId === user?.id);
    const myElderIds = myElders.map(u => u.id);

    // 2. Filter Reports (Assuming report.userId matches elderId)
    // Filter reports to only show those belonging to my assigned elders
    const myReports = reports.filter(r => myElderIds.includes(r.userId));
    const newReportsCount = myReports.filter(r => r.status === 'sent' || r.status === 'pending').length;

    // 3. Fetch Real Alerts
    useEffect(() => {
        const fetchAlerts = async () => {
            const API_URL = import.meta.env.VITE_API_URL || '/api';
            try {
                const res = await fetch(`${API_URL}/care/alerts`);
                if (res.ok) {
                    const data = await res.json();
                    // Filter alerts for my elders
                    const myActiveAlerts = data.filter((a: any) => myElderIds.includes(a.elderId) && a.status === 'active');
                    setAlertCount(myActiveAlerts.length);
                    setRecentAlerts(myActiveAlerts.slice(0, 3));
                }
            } catch (e) { console.error(e); }
        };
        if (user?.id) fetchAlerts();
    }, [user?.id, users]); // Trigger when user or user list (assignments) changes

    return (
        <CaregiverLayout>
            <div className="space-y-6 animate-fade-in">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold">Dashboard</h1>
                        <p className="text-muted-foreground mt-1">Overview of your assigned elders and their health status.</p>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card onClick={() => navigate('/caregiver/elders')} className="cursor-pointer hover:border-primary/50 transition-colors">
                        <CardContent className="p-6 flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Assigned Elders</p>
                                <h3 className="text-3xl font-bold mt-2">{myElders.length}</h3>
                            </div>
                            <div className="p-3 bg-blue-100 rounded-full text-blue-600">
                                <Users className="w-6 h-6" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card onClick={() => navigate('/caregiver/reports')} className="cursor-pointer hover:border-primary/50 transition-colors">
                        <CardContent className="p-6 flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">New Reports</p>
                                <h3 className="text-3xl font-bold mt-2 text-orange-600">{newReportsCount}</h3>
                            </div>
                            <div className="p-3 bg-orange-100 rounded-full text-orange-600">
                                <FileText className="w-6 h-6" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card onClick={() => navigate('/caregiver/sos')} className="cursor-pointer hover:border-primary/50 transition-colors">
                        <CardContent className="p-6 flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Active Alerts</p>
                                <h3 className="text-3xl font-bold mt-2 text-red-600">{alertCount}</h3>
                            </div>
                            <div className="p-3 bg-red-100 rounded-full text-red-600">
                                <AlertTriangle className="w-6 h-6" />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Recent Reports Preview */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle className="text-lg">Recent Reports</CardTitle>
                            <Button variant="ghost" size="sm" onClick={() => navigate('/caregiver/reports')}>View All <ArrowRight className="w-4 h-4 ml-1" /></Button>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {myReports.slice(0, 3).map(report => (
                                    <div key={report.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                                        <div>
                                            <p className="font-medium">{report.issue}</p>
                                            <p className="text-xs text-muted-foreground">{report.date}</p>
                                        </div>
                                        <BadgeStatus status={report.status} />
                                    </div>
                                ))}
                                {myReports.length === 0 && <p className="text-muted-foreground text-sm">No recent reports from your assigned elders.</p>}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Quick Alerts */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Recent Alerts</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {recentAlerts.map((alert: any) => (
                                    <div key={alert.id} className="flex items-start gap-3 p-3 bg-red-50/50 border border-red-100 rounded-lg">
                                        <AlertTriangle className="w-5 h-5 text-red-500 mt-0.5" />
                                        <div>
                                            <p className="font-medium text-sm text-red-900">{alert.message || `SOS from ${alert.name}`}</p>
                                            <p className="text-xs text-red-700 mt-1">{alert.time}</p>
                                        </div>
                                    </div>
                                ))}
                                {recentAlerts.length === 0 && <p className="text-muted-foreground text-sm">No active alerts.</p>}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </CaregiverLayout>
    );
}

function BadgeStatus({ status }: { status: string }) {
    if (status === 'sent') return <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-medium">New</span>;
    if (status === 'seen') return <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium">Seen</span>;
    return <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full font-medium">{status}</span>;
}
