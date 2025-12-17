import React, { useState, useEffect } from 'react';
import { OrganizationLayout } from '@/components/layout/OrganizationLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle, MapPin, Clock, CheckCircle } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';

interface SOSAlert {
    id: string;
    elderId: string;
    name: string;
    location: string;
    time: string;
    status: 'active' | 'resolved';
}

export default function OrganizationAlerts() {
    const { socketRef } = useApp();
    const [alerts, setAlerts] = useState<SOSAlert[]>([]);
    const API_URL = import.meta.env.VITE_API_URL || '/api';

    useEffect(() => {
        const fetchAlerts = async () => {
            try {
                const res = await fetch(`${API_URL}/care/alerts`);
                if (res.ok) {
                    const data = await res.json();
                    setAlerts(data);
                }
            } catch (error) {
                console.error("Failed to fetch alerts", error);
            }
        };
        fetchAlerts();

        if (socketRef.current) {
            socketRef.current.on('sos_alert', (data: any) => {
                setAlerts(prev => [{
                    id: crypto.randomUUID(),
                    elderId: data.elderId,
                    name: data.name,
                    location: data.location,
                    time: data.time,
                    status: 'active'
                }, ...prev]);
            });
        }
    }, [socketRef]);

    return (
        <OrganizationLayout>
            <div className="space-y-6 animate-fade-in">
                <div>
                    <h1 className="text-3xl font-bold flex items-center gap-3 text-destructive">
                        <AlertTriangle className="w-8 h-8" />
                        Network Alerts
                    </h1>
                    <p className="text-muted-foreground mt-1">Monitor all emergency alerts across the network.</p>
                </div>

                <div className="grid gap-4">
                    {alerts.length === 0 ? (
                        <Card className="p-8 text-center text-muted-foreground">
                            <p>No active alerts in the network.</p>
                        </Card>
                    ) : (
                        alerts.map(alert => (
                            <Card key={alert.id} className={`border-l-4 ${alert.status === 'active' ? 'border-l-red-500 bg-red-50/50' : 'border-l-green-500 bg-muted/30'}`}>
                                <CardContent className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2">
                                            <h3 className="text-xl font-bold text-foreground">{alert.name}</h3>
                                            <span className={`text-xs px-2 py-1 rounded-full font-medium ${alert.status === 'active' ? 'bg-red-200 text-red-800' : 'bg-green-200 text-green-800'}`}>
                                                {alert.status === 'active' ? 'ACTIVE' : 'RESOLVED'}
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

                                    {/* Organizations can monitor but maybe not resolve? Or they can. I'll disable resolve for Org to keep it read-only monitoring, or enable it. I'll keep it read-only for now unless user asked. User said "see sos alerts". */}
                                    {/* Adding a 'View Details' generic button placeholder */}
                                </CardContent>
                            </Card>
                        ))
                    )}
                </div>
            </div>
        </OrganizationLayout>
    );
}
