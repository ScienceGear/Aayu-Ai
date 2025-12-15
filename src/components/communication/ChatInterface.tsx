import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '@/contexts/AppContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { X, Send, Image as ImageIcon } from 'lucide-react';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';

interface ChatInterfaceProps {
    recipientId: string;
    onClose: () => void;
}

export function ChatInterface({ recipientId, onClose }: ChatInterfaceProps) {
    const { user, messages, sendMessage, users } = useApp();
    const [newMessage, setNewMessage] = useState('');
    const scrollRef = useRef<HTMLDivElement>(null);

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

    const handleSend = () => {
        if (!newMessage.trim()) return;
        sendMessage(recipientId, newMessage);
        setNewMessage('');
    };

    if (!recipient) return null;

    return (
        <Card className="fixed bottom-4 right-4 w-80 sm:w-96 shadow-2xl z-50 flex flex-col h-[500px] border-primary/20 animate-in slide-in-from-bottom-10 fade-in duration-300 rounded-2xl">
            <CardHeader className="p-4 border-b bg-muted/50 flex flex-row items-center justify-between space-y-0">
                <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10 border-2 border-background">
                        <AvatarImage src={recipient.profilePic} />
                        <AvatarFallback>{recipient.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                        <h4 className="font-semibold text-sm">{recipient.name}</h4>
                        <span className="text-xs text-muted-foreground flex items-center gap-1.5">
                            <span className="h-2 w-2 rounded-full bg-green-500 block" /> Online
                        </span>
                    </div>
                </div>
                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-destructive/10 hover:text-destructive" onClick={onClose}>
                    <X className="h-4 w-4" />
                </Button>
            </CardHeader>

            <CardContent className="flex-1 p-0 overflow-hidden">
                <div ref={scrollRef} className="h-full overflow-y-auto p-4 space-y-4 bg-slate-50 dark:bg-slate-950/50">
                    {conversation.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-muted-foreground text-sm space-y-2">
                            <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center">
                                <Send className="h-6 w-6 opacity-50" />
                            </div>
                            <p>Say hello to {recipient.name}!</p>
                        </div>
                    ) : (
                        conversation.map((msg) => {
                            const isMe = msg.senderId === user?.id;
                            return (
                                <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                                    <div
                                        className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm shadow-sm ${isMe
                                            ? 'bg-primary text-primary-foreground rounded-br-none'
                                            : 'bg-white dark:bg-slate-800 border rounded-bl-none'
                                            }`}
                                    >
                                        <p>{msg.content}</p>
                                        <span className={`text-[10px] block mt-1 opacity-70 ${isMe ? 'text-primary-foreground' : 'text-muted-foreground'}`}>
                                            {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </CardContent>

            <CardFooter className="p-3 bg-background border-t">
                <form
                    className="flex w-full items-center gap-2"
                    onSubmit={(e) => {
                        e.preventDefault();
                        handleSend();
                    }}
                >
                    <Button type="button" variant="ghost" size="icon" className="shrink-0 text-muted-foreground hover:text-primary">
                        <ImageIcon className="h-5 w-5" />
                    </Button>
                    <Input
                        placeholder="Type a message..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        className="flex-1 rounded-full bg-muted/50 border-0 focus-visible:ring-1 focus-visible:ring-primary/20"
                    />
                    <Button type="submit" size="icon" className="shrink-0 rounded-full" disabled={!newMessage.trim()}>
                        <Send className="h-4 w-4" />
                    </Button>
                </form>
            </CardFooter>
        </Card>
    );
}
