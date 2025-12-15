import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '@/contexts/AppContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ArrowLeft, Send, Phone, Video, Paperclip, CheckCheck, Image as ImageIcon } from 'lucide-react';

interface ChatInterfaceProps {
    recipientId: string;
    onClose: () => void;
}

export function ChatInterface({ recipientId, onClose }: ChatInterfaceProps) {
    const { user, messages, sendMessage, users, startCall } = useApp();
    const [newMessage, setNewMessage] = useState('');
    const scrollRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const recipient = users.find(u => u.id === recipientId);

    const conversation = messages.filter(m =>
        (m.senderId === user?.id && m.receiverId === recipientId) ||
        (m.senderId === recipientId && m.receiverId === user?.id)
    ).sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [conversation]);

    useEffect(() => {
        inputRef.current?.focus();
    }, []);

    const handleSend = () => {
        if (!newMessage.trim()) return;
        sendMessage(recipientId, newMessage);
        setNewMessage('');
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);

        try {
            const res = await fetch('http://localhost:5000/api/upload', {
                method: 'POST',
                body: formData,
            });
            const data = await res.json();

            if (data.url) {
                // Send message with image type
                // Note: sendMessage signature might need update or we handle object content
                // For now assuming we can send non-text or special marker
                // Or we extend sendMessage to accept type. 
                // The currrent sendMessage in AppContext takes (receiverId, content)
                // We will send a special JSON string or prefix for now, or assume content is the URL
                // Ideally AppContext should be updated. For this task, let's append a marker or just URL.
                // Actually, let's assume we can modify sendMessage/socket to handle 'type'.
                // But simply, let's send just the URL and detect it in rendering.
                const fullUrl = `http://localhost:5000${data.url}`;
                sendMessage(recipientId, fullUrl); // We'll detect 'http' and 'uploads' to render as image
            }
        } catch (error) {
            console.error('Upload failed:', error);
        }
    };

    const handleVoiceCall = () => {
        startCall(recipientId, 'voice');
    };

    const handleVideoCall = () => {
        startCall(recipientId, 'video');
    };

    if (!recipient) return null;

    const formatMessageTime = (timestamp: string) => {
        const date = new Date(timestamp);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const formatDateSeparator = (timestamp: string) => {
        const date = new Date(timestamp);
        const now = new Date();
        const diff = now.getTime() - date.getTime();
        const daysDiff = Math.floor(diff / (1000 * 60 * 60 * 24));

        if (daysDiff === 0) return 'Today';
        if (daysDiff === 1) return 'Yesterday';
        if (daysDiff < 7) return date.toLocaleDateString([], { weekday: 'long' });
        return date.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' });
    };

    // Helper to check if content is an image URL
    const isImage = (content: string) => {
        return content.match(/\.(jpeg|jpg|gif|png)$/) != null || content.includes('/uploads/');
    };

    return (
        <div className="flex flex-col h-[calc(100vh-140px)] bg-background border rounded-xl overflow-hidden shadow-sm">
            {/* Header - Fixed */}
            <div className="bg-card border-b px-4 py-3 flex items-center gap-3 shadow-sm shrink-0 z-10">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={onClose}
                    className="shrink-0"
                >
                    <ArrowLeft className="h-5 w-5" />
                </Button>

                <Avatar className="h-10 w-10 shrink-0">
                    <AvatarImage src={recipient.profilePic} />
                    <AvatarFallback>{recipient.name.charAt(0)}</AvatarFallback>
                </Avatar>

                <div className="flex-1 min-w-0">
                    <h3 className="font-semibold truncate">{recipient.name}</h3>
                    <p className="text-xs text-muted-foreground flex items-center">
                        <span className={`inline-block w-2 h-2 rounded-full mr-1.5 ${recipient.isOnline ? 'bg-green-500' : 'bg-gray-300'}`} />
                        {recipient.isOnline ? 'Online' : 'Offline'}
                    </p>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={handleVideoCall}
                        className="rounded-full"
                    >
                        <Video className="h-5 w-5" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={handleVoiceCall}
                        className="rounded-full"
                    >
                        <Phone className="h-5 w-5" />
                    </Button>
                </div>
            </div>

            {/* Messages Area - Scrollable */}
            <div
                ref={scrollRef}
                className="flex-1 overflow-y-auto px-4 py-6 space-y-4 bg-muted/20"
            >
                {conversation.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-muted-foreground space-y-3">
                        <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                            <Send className="h-8 w-8 text-primary" />
                        </div>
                        <p className="text-sm">No messages yet</p>
                        <p className="text-xs">Send a message to start the conversation</p>
                    </div>
                ) : (
                    <>
                        {conversation.map((msg, index) => {
                            const isMe = msg.senderId === user?.id;
                            const showDate = index === 0 ||
                                new Date(msg.timestamp).toDateString() !==
                                new Date(conversation[index - 1].timestamp).toDateString();
                            const isImg = isImage(msg.content);

                            return (
                                <React.Fragment key={msg.id}>
                                    {showDate && (
                                        <div className="flex justify-center my-4">
                                            <div className="bg-muted px-3 py-1 rounded-full">
                                                <p className="text-xs text-muted-foreground font-medium">
                                                    {formatDateSeparator(msg.timestamp)}
                                                </p>
                                            </div>
                                        </div>
                                    )}

                                    <div className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                                        <div className="max-w-[75%] sm:max-w-[65%]">
                                            <div
                                                className={`px-4 py-2.5 rounded-2xl shadow-sm ${isMe
                                                    ? 'bg-primary text-primary-foreground rounded-br-sm'
                                                    : 'bg-card border rounded-bl-sm'
                                                    }`}
                                            >
                                                {isImg ? (
                                                    <img
                                                        src={msg.content}
                                                        alt="Sent image"
                                                        className="max-w-full rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
                                                        onClick={() => window.open(msg.content, '_blank')}
                                                    />
                                                ) : (
                                                    <p className="text-sm break-words whitespace-pre-wrap">{msg.content}</p>
                                                )}

                                                <div className="flex items-center justify-end gap-1 mt-1">
                                                    <span className={`text-[11px] ${isMe ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>
                                                        {formatMessageTime(msg.timestamp)}
                                                    </span>
                                                    {isMe && (
                                                        <CheckCheck className="h-3.5 w-3.5 text-primary-foreground/70" />
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </React.Fragment>
                            );
                        })}
                    </>
                )}
            </div>

            {/* Input Area - Fixed */}
            <div className="bg-card border-t px-4 py-3 shrink-0">
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        handleSend();
                    }}
                    className="flex items-center gap-2"
                >
                    <input
                        type="file"
                        ref={fileInputRef}
                        className="hidden"
                        accept="image/*"
                        onChange={handleFileUpload}
                    />
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="shrink-0 text-muted-foreground hover:text-primary"
                        onClick={() => fileInputRef.current?.click()}
                    >
                        <ImageIcon className="h-5 w-5" />
                    </Button>

                    <Input
                        ref={inputRef}
                        placeholder="Type a message..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        className="flex-1"
                    />

                    <Button
                        type="submit"
                        size="icon"
                        disabled={!newMessage.trim()}
                        className="shrink-0"
                    >
                        <Send className="h-4 w-4" />
                    </Button>
                </form>
            </div>
        </div>
    );
}
