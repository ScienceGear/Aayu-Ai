import React, { useEffect, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Phone, Video, X } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';

export function IncomingCall() {
    const { incomingCall, answerCall, rejectCall } = useApp();
    const audioRef = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        if (incomingCall) {
            // Play ringing sound
            // Using a reliable public domain sound or generate one
            audioRef.current = new Audio('https://codeskulptor-demos.commondatastorage.googleapis.com/GalaxyInvaders/bonus.wav'); // Placeholder generic sound
            audioRef.current.loop = true;
            audioRef.current.play().catch(e => console.error("Audio play failed", e));
        } else {
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current = null;
            }
        }

        return () => {
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current = null;
            }
        };
    }, [incomingCall]);

    if (!incomingCall) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background/80 backdrop-blur-sm animate-in fade-in zoom-in duration-300">
            <Card className="w-80 shadow-2xl border-primary/20 bg-card/90">
                <CardContent className="p-6 flex flex-col items-center text-center space-y-6">
                    <div className="relative">
                        <div className="absolute inset-0 rounded-full bg-primary/20 animate-ping" />
                        <Avatar className="w-24 h-24 border-4 border-background relative z-10">
                            <AvatarFallback className="text-2xl bg-primary text-primary-foreground">
                                {incomingCall.callerName.charAt(0)}
                            </AvatarFallback>
                        </Avatar>
                    </div>

                    <div>
                        <h3 className="text-2xl font-bold">{incomingCall.callerName}</h3>
                        <p className="text-muted-foreground animate-pulse">
                            Incoming {incomingCall.type === 'video' ? 'Video' : 'Voice'} Call...
                        </p>
                    </div>

                    <div className="flex gap-4 w-full justify-center">
                        <Button
                            variant="destructive"
                            size="lg"
                            className="rounded-full w-14 h-14 p-0 shadow-lg hover:scale-110 transition-transform"
                            onClick={rejectCall}
                        >
                            <X className="w-6 h-6" />
                        </Button>

                        <Button
                            variant="default" // Green usually
                            size="lg"
                            className="rounded-full w-14 h-14 p-0 bg-green-500 hover:bg-green-600 shadow-lg hover:scale-110 transition-transform animate-bounce"
                            onClick={answerCall}
                        >
                            {incomingCall.type === 'video' ? <Video className="w-6 h-6" /> : <Phone className="w-6 h-6" />}
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
