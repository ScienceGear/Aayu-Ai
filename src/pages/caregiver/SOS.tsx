import React, { useState, useEffect } from 'react';
import { CaregiverLayout } from '@/components/layout/CaregiverLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle, MapPin, Clock } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';

interface SOSAlert {
    id: string;
    elderId: string;
    name: string;
    location: string;
    time: string;
    status: 'active' | 'resolved';
}

export default function SOSPage() {
    const { socketRef, user, users } = useApp();
    const [alerts, setAlerts] = useState<SOSAlert[]>([]);

    const API_URL = import.meta.env.VITE_API_URL || '/api';

    // Get assigned elder IDs
    const myElders = users.filter(u => u.role === 'elder' && u.assignedCaregiverId === user?.id);
    const myElderIds = myElders.map(u => u.id);

    useEffect(() => {
        const fetchAlerts = async () => {
            try {
                const res = await fetch(`${API_URL}/care/alerts`);
                if (res.ok) {
                    const data = await res.json();
                    // Filter
                    const myAlerts = data.filter((a: any) => myElderIds.includes(a.elderId));
                    setAlerts(myAlerts);
                }
            } catch (error) {
                console.error("Failed to fetch alerts", error);
            }
        };
        if (user?.id) fetchAlerts();

        if (socketRef.current) {
            socketRef.current.on('sos_alert', (data: any) => {
                // Filter socket events
                if (myElderIds.includes(data.elderId)) {
                    setAlerts(prev => [{
                        id: crypto.randomUUID(),
                        elderId: data.elderId,
                        name: data.name,
                        location: data.location,
                        time: data.time,
                        status: 'active'
                    }, ...prev]);
                }
            });
        }
    }, [socketRef, user?.id, users]);

    const resolveAlert = async (id: string) => {
        setAlerts(prev => prev.map(a => a.id === id ? { ...a, status: 'resolved' } : a));
        try {
            await fetch(`${API_URL}/care/alerts/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: 'resolved' })
            });
        } catch (e) {
            console.error(e);
        }
    };

    return (
        <CaregiverLayout>
            <div className="space-y-6 animate-fade-in">
                <div>
                    <h1 className="text-3xl font-bold flex items-center gap-3 text-danger">
                        <AlertTriangle className="w-8 h-8" />
                        SOS Alerts
                    </h1>
                    <p className="text-muted-foreground mt-1">Real-time emergency notifications</p>
                </div>

                <div className="grid gap-4">
                    {alerts.length === 0 ? (
                        <Card className="p-8 text-center text-muted-foreground">
                            <p>No active SOS alerts.</p>
                        </Card>
                    ) : (
                        alerts.map(alert => (
                            <Card key={alert.id} className={`border-l-4 ${alert.status === 'active' ? 'border-l-danger bg-red-50' : 'border-l-success bg-muted'}`}>
                                <CardContent className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2">
                                            <h3 className="text-xl font-bold text-foreground">{alert.name}</h3>
                                            <span className={`text-xs px-2 py-1 rounded-full font-medium ${alert.status === 'active' ? 'bg-red-200 text-red-800' : 'bg-green-200 text-green-800'}`}>
                                                {alert.status === 'active' ? 'ACTIVE EMERGENCY' : 'RESOLVED'}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                            <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {alert.time}</span>
                                            <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {alert.location}</span>
                                        </div>
                                        {alert.location.startsWith('Live:') && (
                                            <a
                                                href={`https://www.google.com/maps?q=${alert.location.replace('Live: ', '')}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-primary hover:underline text-sm inline-flex items-center gap-1"
                                            >
                                                View on Maps <MapPin className="w-3 h-3" />
                                            </a>
                                        )}
                                    </div>

                                    {alert.status === 'active' && (
                                        <Button
                                            variant="outline"
                                            className="border-green-600 text-green-700 hover:bg-green-50"
                                            onClick={() => resolveAlert(alert.id)}
                                        >
                                            Mark Resolved
                                        </Button>
                                    )}
                                </CardContent>
                            </Card>
                        ))
                    )}
                </div>
            </div>
        </CaregiverLayout>
    );
}
