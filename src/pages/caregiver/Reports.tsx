import React from 'react';
import { CaregiverLayout } from '@/components/layout/CaregiverLayout';
import { useApp } from '@/contexts/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, CheckCheck, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function CaregiverReports() {
    const { reports, markReportAsSeen, users, user } = useApp();

    const myElders = users.filter(u => u.role === 'elder' && u.assignedCaregiverId === user?.id);
    const myElderIds = myElders.map(u => u.id);

    // Filter reports
    const myReports = reports.filter(r => myElderIds.includes(r.userId));

    const getElderName = (userId: string) => {
        const elder = users.find(u => u.id === userId);
        return elder ? elder.name : 'Unknown Elder';
    };

    const sortedReports = [...myReports].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return (
        <CaregiverLayout>
            <div className="space-y-6 animate-fade-in">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold">Health Reports</h1>
                        <p className="text-muted-foreground mt-1">Review reports submitted by elders.</p>
                    </div>
                </div>

                <div className="grid gap-6">
                    {sortedReports.length === 0 ? (
                        <Card>
                            <CardContent className="p-8 text-center text-muted-foreground">
                                No reports received yet.
                            </CardContent>
                        </Card>
                    ) : (
                        sortedReports.map((report) => (
                            <Card key={report.id} className={`transition-all ${report.status === 'sent' ? 'border-primary/50 bg-primary/5' : ''}`}>
                                <CardHeader className="flex flex-row items-start justify-between pb-2">
                                    <div>
                                        <CardTitle className="text-lg flex items-center gap-2">
                                            {report.issue}
                                            {report.status === 'sent' && <Badge variant="default" className="bg-blue-500">New</Badge>}
                                            {report.status === 'seen' && <Badge variant="outline" className="text-green-600 border-green-200">Viewed</Badge>}
                                        </CardTitle>
                                        <p className="text-sm text-muted-foreground font-medium mt-1">
                                            From: {getElderName(report.userId)}
                                        </p>
                                    </div>
                                    <div className="flex flex-col items-end gap-1">
                                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                                            <Clock className="w-3 h-3" /> {report.date}
                                        </span>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-4 text-sm">
                                            <div className="flex items-center gap-2">
                                                <span className="font-semibold text-muted-foreground">Pain Level:</span>
                                                <span className={`px-2 py-0.5 rounded text-white font-bold ${report.painLevel > 5 ? 'bg-red-500' : 'bg-green-500'}`}>
                                                    {report.painLevel}/10
                                                </span>
                                            </div>
                                        </div>
                                        <div className="bg-background p-3 rounded-md border text-sm">
                                            <span className="font-semibold block mb-1 text-muted-foreground">Description:</span>
                                            {report.description || "No description provided."}
                                        </div>

                                        {report.status === 'sent' && (
                                            <div className="flex justify-end pt-2">
                                                <Button size="sm" onClick={() => markReportAsSeen(report.id)}>
                                                    <CheckCheck className="w-4 h-4 mr-2" /> Mark as Seen
                                                </Button>
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        ))
                    )}
                </div>
            </div>
        </CaregiverLayout>
    );
}
