import React, { useEffect, useRef, useState } from 'react';
import { useApp } from '@/contexts/AppContext';
import { Button } from '@/components/ui/button';
import { Mic, MicOff, Video, VideoOff, PhoneOff } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { io } from 'socket.io-client';

const getBaseUrl = () => {
    return '';
};

export function VideoCallInterface() {
    const { activeCall, endCall, user, users } = useApp();
    const [isMuted, setIsMuted] = useState(false);
    const [isVideoOff, setIsVideoOff] = useState(false);
    const [callDuration, setCallDuration] = useState(0);
    const [localStream, setLocalStream] = useState<MediaStream | null>(null);
    const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
    const [connectionState, setConnectionState] = useState<string>('new');

    const localVideoRef = useRef<HTMLVideoElement>(null);
    const remoteVideoRef = useRef<HTMLVideoElement>(null);
    const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
    const socketRef = useRef<any>(null);

    const otherParticipantId = activeCall?.participants.find(id => id !== user?.id);
    const otherParticipant = users.find(u => u.id === otherParticipantId);
    const isVideoCall = activeCall?.type === 'video';

    // Call duration timer
    useEffect(() => {
        if (activeCall?.status === 'connected') {
            const interval = setInterval(() => {
                setCallDuration(prev => prev + 1);
            }, 1000);
            return () => clearInterval(interval);
        } else {
            setCallDuration(0);
        }
    }, [activeCall?.status]);

    const formatDuration = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    // Initialize WebRTC
    useEffect(() => {
        if (!activeCall || !user || !otherParticipantId) return;

        let stream: MediaStream | null = null;
        socketRef.current = io(getBaseUrl());

        const initializeCall = async () => {
            try {
                // Get local media
                const constraints = {
                    audio: true,
                    video: isVideoCall ? { width: { ideal: 1280 }, height: { ideal: 720 }, facingMode: 'user' } : false
                };

                console.log('🎥 Requesting media:', constraints);
                stream = await navigator.mediaDevices.getUserMedia(constraints);
                setLocalStream(stream);

                if (localVideoRef.current && isVideoCall) {
                    localVideoRef.current.srcObject = stream;
                }

                // Create peer connection
                const configuration: RTCConfiguration = {
                    iceServers: [
                        { urls: 'stun:stun.l.google.com:19302' },
                        { urls: 'stun:stun1.l.google.com:19302' },
                    ]
                };

                const peerConnection = new RTCPeerConnection(configuration);
                peerConnectionRef.current = peerConnection;

                // Add local tracks
                stream.getTracks().forEach(track => {
                    console.log('➕ Adding track:', track.kind);
                    peerConnection.addTrack(track, stream!);
                });

                // Handle incoming tracks
                peerConnection.ontrack = (event) => {
                    console.log('📥 Received remote track:', event.track.kind);
                    const [remStream] = event.streams;
                    setRemoteStream(remStream);
                    if (remoteVideoRef.current) {
                        remoteVideoRef.current.srcObject = remStream;
                    }
                };

                // Handle ICE candidates
                peerConnection.onicecandidate = (event) => {
                    if (event.candidate) {
                        console.log('🧊 Sending ICE candidate');
                        socketRef.current?.emit('ice_candidate', {
                            to: otherParticipantId,
                            candidate: event.candidate
                        });
                    }
                };

                // Monitor connection state
                peerConnection.onconnectionstatechange = () => {
                    console.log('🔗 Connection state:', peerConnection.connectionState);
                    setConnectionState(peerConnection.connectionState);
                };

                // Join room
                socketRef.current.emit('join_room', user.id);

                // If caller, create offer
                if (activeCall.status === 'calling') {
                    console.log('📤 Creating offer...');
                    const offer = await peerConnection.createOffer();
                    await peerConnection.setLocalDescription(offer);

                    socketRef.current.emit('call_user', {
                        userToCall: otherParticipantId,
                        from: user.id,
                        name: user.name,
                        type: activeCall.type,
                        offer: offer
                    });
                }

                // Listen for answer
                const handleCallAnswered = async (event: any) => {
                    const answer = event.detail;
                    console.log('✅ Received answer');
                    if (peerConnection.signalingState !== 'stable') {
                        await peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
                    }
                };

                // Listen for ICE candidates
                const handleIceCandidate = async (event: any) => {
                    const candidate = event.detail;
                    console.log('🧊 Received ICE candidate');
                    if (candidate && peerConnection.remoteDescription) {
                        await peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
                    }
                };

                window.addEventListener('call-answered', handleCallAnswered);
                window.addEventListener('ice-candidate', handleIceCandidate);

                return () => {
                    window.removeEventListener('call-answered', handleCallAnswered);
                    window.removeEventListener('ice-candidate', handleIceCandidate);
                };

            } catch (err: any) {
                console.error('❌ Error:', err);
                // alert(`Call Error: ${err.message}`); // Removed alert for better UX
            }
        };

        initializeCall();

        return () => {
            if (stream) {
                console.log('🛑 Stopping media');
                stream.getTracks().forEach(track => track.stop());
            }
            if (peerConnectionRef.current) {
                peerConnectionRef.current.close();
            }
            if (socketRef.current) {
                socketRef.current.disconnect();
            }
        };
    }, [activeCall, user, otherParticipantId, isVideoCall]);

    // Toggle mute
    useEffect(() => {
        if (localStream) {
            localStream.getAudioTracks().forEach(track => {
                track.enabled = !isMuted;
            });
        }
    }, [isMuted, localStream]);

    // Toggle video
    useEffect(() => {
        if (localStream && isVideoCall) {
            localStream.getVideoTracks().forEach(track => {
                track.enabled = !isVideoOff;
            });
        }
    }, [isVideoOff, localStream, isVideoCall]);

    if (!activeCall) return null;

    return (
        <div className="fixed inset-0 z-[100] bg-gradient-to-br from-gray-900 via-gray-800 to-black flex flex-col">
            {/* Remote Video / Avatar */}
            <div className="relative flex-1 flex items-center justify-center overflow-hidden">
                {isVideoCall ? (
                    <div className="relative w-full h-full">
                        <video
                            ref={remoteVideoRef}
                            autoPlay
                            playsInline
                            className="w-full h-full object-cover"
                        />

                        {!remoteStream && (
                            <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-b from-gray-800 to-gray-900">
                                <Avatar className="h-32 w-32 border-4 border-white/20 mb-4">
                                    <AvatarImage src={otherParticipant?.profilePic} />
                                    <AvatarFallback className="text-4xl bg-primary">
                                        {otherParticipant?.name.charAt(0)}
                                    </AvatarFallback>
                                </Avatar>
                                <h2 className="text-2xl font-semibold text-white mb-2">{otherParticipant?.name}</h2>
                                <p className="text-primary text-sm">{connectionState === 'connected' ? 'Connected' : 'Connecting...'}</p>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center space-y-6">
                        <div className="relative">
                            <div className="absolute inset-0 rounded-full bg-primary/20 animate-[ping_2s_ease-in-out_infinite]" />
                            <Avatar className="h-40 w-40 border-4 border-white/30 relative z-10 shadow-2xl">
                                <AvatarImage src={otherParticipant?.profilePic} />
                                <AvatarFallback className="text-5xl bg-primary">
                                    {otherParticipant?.name.charAt(0)}
                                </AvatarFallback>
                            </Avatar>
                        </div>
                        <div className="text-center space-y-2">
                            <h2 className="text-4xl font-bold text-white">{otherParticipant?.name}</h2>
                            <p className="text-primary font-medium text-lg">
                                {connectionState === 'connected' ? formatDuration(callDuration) : 'Connecting...'}
                            </p>
                        </div>
                    </div>
                )}

                {/* Call Info */}
                <div className="absolute top-4 left-0 right-0 flex justify-center">
                    <div className="bg-black/40 backdrop-blur-md px-4 py-2 rounded-full">
                        <p className="text-white text-sm font-medium">
                            {connectionState === 'connected' ? formatDuration(callDuration) : 'Connecting...'}
                        </p>
                    </div>
                </div>
            </div>

            {/* Local Video (PiP) */}
            {isVideoCall && (
                <div className="absolute top-20 right-4 w-32 sm:w-40 md:w-48 aspect-[3/4] bg-gray-900 rounded-2xl overflow-hidden shadow-2xl border-2 border-white/20">
                    {!isVideoOff ? (
                        <video
                            ref={localVideoRef}
                            autoPlay
                            muted
                            playsInline
                            className="w-full h-full object-cover transform scale-x-[-1]"
                        />
                    ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900">
                            <VideoOff className="h-8 w-8 text-white/60 mb-2" />
                            <p className="text-white/60 text-xs">Camera off</p>
                        </div>
                    )}
                </div>
            )}

            {/* Controls */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-4 sm:gap-6 px-6 sm:px-8 py-4 bg-black/50 backdrop-blur-xl rounded-full border border-white/10 shadow-2xl">
                <Button
                    variant={isMuted ? "destructive" : "secondary"}
                    size="icon"
                    className="rounded-full h-12 w-12 sm:h-14 sm:w-14"
                    onClick={() => setIsMuted(!isMuted)}
                >
                    {isMuted ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
                </Button>

                {isVideoCall && (
                    <Button
                        variant={isVideoOff ? "destructive" : "secondary"}
                        size="icon"
                        className="rounded-full h-12 w-12 sm:h-14 sm:w-14"
                        onClick={() => setIsVideoOff(!isVideoOff)}
                    >
                        {isVideoOff ? <VideoOff className="h-5 w-5" /> : <Video className="h-5 w-5" />}
                    </Button>
                )}

                <Button
                    variant="destructive"
                    size="icon"
                    className="rounded-full h-14 w-14 sm:h-16 sm:w-16 bg-red-600 hover:bg-red-700"
                    onClick={endCall}
                >
                    <PhoneOff className="h-6 w-6" />
                </Button>
            </div>
        </div>
    );
}
