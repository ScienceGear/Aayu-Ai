import React, { useState, useEffect } from 'react';
import { OrganizationLayout } from '@/components/layout/OrganizationLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, User, Calendar, CheckCircle } from 'lucide-react';

interface Report {
    id: string;
    elderId: string; // ID of elder
    title: string;
    description: string;
    type: string;
    status: 'pending' | 'seen';
    timestamp: string;
}

export default function OrganizationReports() {
    const [reports, setReports] = useState<Report[]>([]);
    const API_URL = import.meta.env.VITE_API_URL || '/api';

    useEffect(() => {
        const fetchReports = async () => {
            try {
                const res = await fetch(`${API_URL}/care/reports`);
                if (res.ok) {
                    const data = await res.json();
                    setReports(data);
                }
            } catch (error) {
                console.error("Failed to fetch reports", error);
            }
        };
        fetchReports();
    }, []);

    return (
        <OrganizationLayout>
            <div className="space-y-6 animate-fade-in">
                <div>
                    <h1 className="text-3xl font-bold flex items-center gap-3">
                        <FileText className="w-8 h-8" />
                        All Reports
                    </h1>
                    <p className="text-muted-foreground mt-1">Review activity and health reports from the network.</p>
                </div>

                <div className="grid gap-4">
                    {reports.length === 0 ? (
                        <Card className="p-8 text-center text-muted-foreground">
                            <p>No reports filed yet.</p>
                        </Card>
                    ) : (
                        reports.map(report => (
                            <Card key={report.id}>
                                <CardContent className="p-6">
                                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2">
                                                <h3 className="text-lg font-bold">{report.title}</h3>
                                                <span className="text-xs bg-muted px-2 py-1 rounded capitalize">{report.type}</span>
                                            </div>
                                            <p className="text-muted-foreground">{report.description}</p>
                                            <div className="flex items-center gap-4 text-sm text-muted-foreground mt-2">
                                                <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> {new Date(report.timestamp).toLocaleString()}</span>
                                                {/* In real app, we would fetch elder name using elderId */}
                                            </div>
                                        </div>
                                        <div>
                                            {report.status === 'seen' ? (
                                                <span className="flex items-center text-green-600 text-sm font-medium">
                                                    <CheckCircle className="w-4 h-4 mr-1" /> Reviewed
                                                </span>
                                            ) : (
                                                <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-xs font-semibold">
                                                    Pending Review
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))
                    )}
                </div>
            </div>
        </OrganizationLayout>
    );
}
