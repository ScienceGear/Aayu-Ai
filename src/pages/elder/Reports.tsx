import React, { useState } from 'react';
import { ElderLayout } from '@/components/layout/ElderLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { FileText, Plus, Calendar, Check, CheckCheck } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';

const mockReports = [
    { id: '1', type: 'Weekly Summary', date: '2024-12-10', status: 'Normal', doctor: 'Dr. Sharma' },
    { id: '2', type: 'Blood Test', date: '2024-12-01', status: 'Attention Needed', doctor: 'Dr. Gupta' },
];

export default function ElderReports() {
    const { user, addReport, reports } = useApp();
    const [painLevel, setPainLevel] = useState([0]);
    const [reportText, setReportText] = useState('');
    const [selectedIssue, setSelectedIssue] = useState<string | null>(null);

    const handleSubmitReport = () => {
        if (!selectedIssue && !reportText) return;

        addReport({
            id: Date.now().toString(),
            userId: user?.id || 'unknown',
            issue: selectedIssue || 'General Checkup',
            painLevel: painLevel[0],
            description: reportText,
            date: new Date().toLocaleString(),
            status: 'sent',
        });

        setReportText('');
        setPainLevel([0]);
        setSelectedIssue(null);
    };

    const issues = ['Sleeplessness', 'Joint Pain', 'Dizziness', 'Stomach Ache', 'Headache'];
    const myReports = reports.filter(r => r.userId === user?.id);

    return (
        <ElderLayout>
            <div className="space-y-6 animate-fade-in max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold">Health Reports</h1>

                {/* Report New Issue */}
                <Card variant="gradient">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Plus className="w-6 h-6" />
                            Report a Health Issue
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div>
                            <label className="text-sm font-medium mb-3 block">What is bothering you today?</label>
                            <div className="flex flex-wrap gap-2">
                                {issues.map(issue => (
                                    <Button
                                        key={issue}
                                        variant={selectedIssue === issue ? "secondary" : "outline"}
                                        onClick={() => setSelectedIssue(issue === selectedIssue ? null : issue)}
                                        className="rounded-full"
                                    >
                                        {issue}
                                    </Button>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-4">
                            <label className="text-sm font-medium flex justify-between">
                                <span>Pain Level (if any)</span>
                                <span className="font-bold text-primary">{painLevel[0]}/10</span>
                            </label>
                            <Slider
                                value={painLevel}
                                onValueChange={setPainLevel}
                                max={10}
                                step={1}
                                className="w-full"
                            />
                            <div className="flex justify-between text-xs text-muted-foreground">
                                <span>No Pain</span>
                                <span>Severe Pain</span>
                            </div>
                        </div>

                        <div>
                            <label className="text-sm font-medium mb-2 block">Additional Details</label>
                            <textarea
                                className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                placeholder="Describe how you are feeling..."
                                value={reportText}
                                onChange={(e) => setReportText(e.target.value)}
                            />
                        </div>

                        <Button onClick={handleSubmitReport} disabled={!selectedIssue && !reportText} className="w-full" size="lg">
                            Submit Report
                        </Button>
                    </CardContent>
                </Card>

                {/* Sent Reports Status */}
                {myReports.length > 0 && (
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <CheckCheck className="w-5 h-5 text-primary" />
                                Recent Updates
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {myReports.map(report => (
                                    <div key={report.id} className="flex items-center justify-between p-4 bg-muted/30 rounded-xl">
                                        <div>
                                            <h4 className="font-semibold">{report.issue}</h4>
                                            <p className="text-xs text-muted-foreground">{report.date}</p>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm">
                                            {report.status === 'sent' && <span className="text-muted-foreground flex items-center gap-1"><Check className="w-4 h-4" /> Sent</span>}
                                            {report.status === 'delivered' && <span className="text-muted-foreground flex items-center gap-1"><CheckCheck className="w-4 h-4" /> Delivered</span>}
                                            {report.status === 'seen' && <span className="text-primary flex items-center gap-1 font-medium"><CheckCheck className="w-4 h-4" /> Seen by Caregiver</span>}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Previous Reports - MOCKED for now */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <FileText className="w-5 h-5" />
                            Medical History
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {mockReports.map(report => (
                                <div key={report.id} className="flex items-center justify-between p-4 bg-muted/30 rounded-xl">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                                            <FileText className="w-5 h-5 text-primary" />
                                        </div>
                                        <div>
                                            <h4 className="font-semibold">{report.type}</h4>
                                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                <Calendar className="w-3 h-3" />
                                                <span>{report.date}</span>
                                                <span>•</span>
                                                <span>{report.doctor}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <Button variant="ghost" size="sm">View</Button>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </ElderLayout>
    );
}

