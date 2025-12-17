import React, { useState } from 'react';
import { CaregiverLayout } from '@/components/layout/CaregiverLayout';
import { useApp } from '@/contexts/AppContext';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Search, MessageSquare, Video, Phone } from 'lucide-react';
import { ChatInterface } from '@/components/communication/ChatInterface';
import { VideoCallInterface } from '@/components/communication/VideoCallInterface';
import { Button } from '@/components/ui/button';

export default function Messages() {
    const { user, users, messages, startCall, activeCall } = useApp();
    const [searchQuery, setSearchQuery] = useState('');
    const [activeChatId, setActiveChatId] = useState<string | null>(null);

    // Get assigned elders only
    const elders = users.filter(u => u.role === 'elder' && u.assignedCaregiverId === user?.id);

    const filteredUsers = elders.filter(u =>
        u.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const getLastMessage = (userId: string) => {
        const userMessages = messages.filter(m => m.senderId === userId || m.receiverId === userId);
        if (userMessages.length === 0) return null;
        return userMessages[userMessages.length - 1];
    };

    return (
        <CaregiverLayout>
            <div className="h-[calc(100vh-8rem)] flex gap-6">
                {/* Sidebar List */}
                <Card className="w-full md:w-80 flex flex-col">
                    <CardHeader className="p-4 border-b">
                        <h2 className="font-semibold text-lg mb-4">Messages</h2>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search..."
                                className="pl-9"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </CardHeader>
                    <ScrollArea className="flex-1">
                        <div className="p-2 space-y-2">
                            {filteredUsers.map(elder => {
                                const lastMessage = getLastMessage(elder.id);
                                return (
                                    <div
                                        key={elder.id}
                                        className={`p-3 rounded-xl cursor-pointer hover:bg-muted transition-colors flex items-center gap-3 ${activeChatId === elder.id ? 'bg-muted' : ''}`}
                                        onClick={() => setActiveChatId(elder.id)}
                                    >
                                        <div className="relative">
                                            <Avatar>
                                                <AvatarImage src={elder.profilePic} />
                                                <AvatarFallback>{elder.name.charAt(0)}</AvatarFallback>
                                            </Avatar>
                                            <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-background" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex justify-between items-start">
                                                <h4 className="font-medium truncate">{elder.name}</h4>
                                                {lastMessage && (
                                                    <span className="text-[10px] text-muted-foreground">
                                                        {new Date(lastMessage.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-sm text-muted-foreground truncate">
                                                {lastMessage ? lastMessage.content : 'No messages yet'}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </ScrollArea>
                </Card>

                {/* Chat Area - Desktop */}
                <div className="hidden md:flex flex-1 flex-col">
                    {activeChatId ? (
                        <ChatInterface recipientId={activeChatId} onClose={() => setActiveChatId(null)} />
                    ) : (
                        <div className="flex-1 flex items-center justify-center text-muted-foreground">
                            <div className="text-center">
                                <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
                                <p>Select a user to start messaging</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {activeCall && <VideoCallInterface />}
        </CaregiverLayout>
    );
}
