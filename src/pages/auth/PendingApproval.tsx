import React from 'react';
import { Button } from '@/components/ui/button';
import { useApp } from '@/contexts/AppContext';
import { useNavigate } from 'react-router-dom';
import { LogOut, Clock } from 'lucide-react';

export default function PendingApproval() {
    const { logout } = useApp();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-muted/20">
            <div className="max-w-md w-full p-8 bg-background border rounded-2xl shadow-lg text-center space-y-6">
                <div className="mx-auto w-16 h-16 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center">
                    <Clock className="w-8 h-8" />
                </div>
                <div>
                    <h1 className="text-2xl font-bold">Account Pending Approval</h1>
                    <p className="text-muted-foreground mt-2">
                        Your caregiver account is currently under review by the organization admin.
                        You will be able to access the dashboard once your account is approved.
                    </p>
                </div>
                <div className="pt-4 border-t">
                    <Button variant="outline" className="w-full" onClick={handleLogout}>
                        <LogOut className="w-4 h-4 mr-2" /> Sign Out
                    </Button>
                </div>
            </div>
        </div>
    );
}
