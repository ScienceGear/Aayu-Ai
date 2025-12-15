import React, { useEffect, useRef, useState } from 'react';
import { useApp } from '@/contexts/AppContext';
import { Button } from '@/components/ui/button';
import { Mic, MicOff, Video, VideoOff, PhoneOff, Users } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export function VideoCallInterface() {
    const { activeCall, endCall, user, users } = useApp();
    const [isMuted, setIsMuted] = useState(false);
    const [isVideoOff, setIsVideoOff] = useState(false);
    const localVideoRef = useRef<HTMLVideoElement>(null);

    // Find the other participant
    const otherParticipantId = activeCall?.participants.find(id => id !== user?.id);
    const otherParticipant = users.find(u => u.id === otherParticipantId);

    useEffect(() => {
        let stream: MediaStream | null = null;
        let p2pConnection: RTCPeerConnection | null = null; // Future implementations would go here

        const startMedia = async () => {
            try {
                const constraints = {
                    audio: true,
                    video: activeCall?.type === 'video'
                };

                stream = await navigator.mediaDevices.getUserMedia(constraints);

                if (localVideoRef.current && activeCall?.type === 'video') {
                    localVideoRef.current.srcObject = stream;
                }

                // For "Voice" calls, we might still want to visualize audio, but for now just getting the stream ensures mic is on.

            } catch (err) {
                console.error('Error accessing media devices:', err);
            }
        };

        if (activeCall?.status === 'connected' || activeCall?.status === 'calling') {
            startMedia();
        }

        return () => {
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
            }
        };
    }, [activeCall?.status, activeCall?.type]);

    if (!activeCall) return null;

    const isVideoCall = activeCall.type === 'video';

    return (
        <div className="fixed inset-0 z-[100] bg-slate-950 flex flex-col items-center justify-center animate-in fade-in duration-300">
            {/* Background Area */}
            <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
                {isVideoCall ? (
                    <div className="absolute inset-0 w-full h-full">
                        {/* Simulated Remote Video for Video Call */}
                        <video
                            ref={(el) => {
                                if (el && localVideoRef.current?.srcObject) {
                                    el.srcObject = localVideoRef.current.srcObject;
                                }
                            }}
                            autoPlay
                            muted
                            playsInline
                            className="w-full h-full object-cover opacity-50 blur-sm"
                        />
                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/30 backdrop-blur-[2px] space-y-6">
                            {/* Overlay content stays same */}
                            <Avatar className="h-32 w-32 mx-auto border-4 border-primary/20 animate-pulse">
                                <AvatarImage src={otherParticipant?.profilePic} />
                                <AvatarFallback className="text-4xl">{otherParticipant?.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div className="space-y-2 text-center pointer-events-none">
                                <h2 className="text-3xl font-bold text-white tracking-tight">{otherParticipant?.name}</h2>
                                <p className="text-slate-200 font-medium uppercase tracking-widest text-sm bg-black/40 px-3 py-1 rounded-full inline-block">
                                    {activeCall.status === 'calling' ? 'Calling...' : 'Connected (Simulated)'}
                                </p>
                            </div>
                        </div>
                    </div>
                ) : (
                    // Voice Call UI
                    <div className="absolute inset-0 w-full h-full flex flex-col items-center justify-center bg-gradient-to-b from-slate-900 to-slate-950 space-y-8">
                        <div className="relative">
                            <div className="absolute inset-0 rounded-full bg-primary/20 animate-[ping_2s_ease-in-out_infinite]" />
                            <div className="absolute inset-0 rounded-full bg-primary/10 animate-[ping_3s_ease-in-out_infinite_delay-1000]" />
                            <Avatar className="h-40 w-40 border-4 border-background relative z-10 shadow-2xl">
                                <AvatarImage src={otherParticipant?.profilePic} />
                                <AvatarFallback className="text-5xl">{otherParticipant?.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                        </div>

                        <div className="text-center space-y-2">
                            <h2 className="text-4xl font-bold text-white tracking-tight">{otherParticipant?.name}</h2>
                            <p className="text-primary font-medium uppercase tracking-widest text-sm bg-primary/10 px-4 py-1.5 rounded-full inline-block">
                                {activeCall.status === 'calling' ? 'Voice Calling...' : '00:00 • Voice Connected'}
                            </p>
                        </div>
                    </div>
                )}
            </div>

            {/* Local Video (only for Video Call) */}
            {isVideoCall && (
                <div className="absolute top-4 right-4 w-32 sm:w-48 aspect-video bg-slate-900 rounded-xl overflow-hidden shadow-2xl border border-white/10">
                    <video
                        ref={localVideoRef}
                        autoPlay
                        muted
                        playsInline
                        className={`w-full h-full object-cover transform scale-x-[-1] ${isVideoOff ? 'hidden' : ''}`}
                    />
                    {isVideoOff && (
                        <div className="w-full h-full flex items-center justify-center text-slate-500">
                            <VideoOff className="h-8 w-8" />
                        </div>
                    )}
                </div>
            )}

            {/* Controls */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-6 px-8 py-4 bg-slate-900/90 backdrop-blur-xl rounded-full border border-white/10 shadow-2xl">
                <Button
                    variant={isMuted ? "destructive" : "secondary"}
                    size="icon"
                    className="rounded-full h-14 w-14"
                    onClick={() => setIsMuted(!isMuted)}
                >
                    {isMuted ? <MicOff className="h-6 w-6" /> : <Mic className="h-6 w-6" />}
                </Button>

                <Button
                    variant="destructive"
                    size="icon"
                    className="rounded-full h-16 w-16 bg-red-600 hover:bg-red-700 shadow-red-900/20 shadow-lg"
                    onClick={endCall}
                >
                    <PhoneOff className="h-8 w-8" />
                </Button>

                {isVideoCall && (
                    <Button
                        variant={isVideoOff ? "destructive" : "secondary"}
                        size="icon"
                        className="rounded-full h-14 w-14"
                        onClick={() => setIsVideoOff(!isVideoOff)}
                    >
                        {isVideoOff ? <VideoOff className="h-6 w-6" /> : <Video className="h-6 w-6" />}
                    </Button>
                )}
            </div>
        </div>
    );
}
