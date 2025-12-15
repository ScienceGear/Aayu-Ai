import React, { useState, useRef, useEffect } from 'react';
import { ElderLayout } from '@/components/layout/ElderLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Bot,
  Mic,
  MicOff,
  Send,
  Camera,
  Pill,
  ClipboardList,
  Heart,
  Volume2,
  VolumeX,
  Loader2,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const quickActions = [
  { icon: Pill, label: 'Check medicine stock', prompt: 'What medicines do I have in stock?' },
  { icon: ClipboardList, label: "What did I miss today?", prompt: 'What activities did I miss today?' },
  { icon: Heart, label: 'How am I feeling?', prompt: 'How have I been feeling this week based on my mood logs?' },
  { icon: Camera, label: 'Camera mode', prompt: 'Enable camera mode' },
];

const greetings = [
  "नमस्ते! मैं आयु हूँ, आपकी स्वास्थ्य सहायक। आज मैं आपकी कैसे मदद कर सकती हूँ?",
  "Hello! I am Aayu, your health assistant. How can I help you today?",
];

export default function AayuAssistant() {
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: greetings[1],
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [cameraMode, setCameraMode] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (text?: string) => {
    const messageText = text || inputValue.trim();
    if (!messageText) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: messageText,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    // Check for camera mode
    if (messageText.toLowerCase().includes('camera')) {
      setCameraMode(true);
      toast({
        title: 'Camera Mode Enabled',
        description: 'Point your camera at a medicine to identify it.',
      });
    }

    // Simulate AI response
    setTimeout(() => {
      let responseText = '';
      
      if (messageText.toLowerCase().includes('medicine') || messageText.toLowerCase().includes('stock')) {
        responseText = "Based on your records, you have:\n\n• Metformin 500mg: 12 tablets (Low stock! Consider refilling soon)\n• Amlodipine 5mg: 28 tablets\n• Aspirin 75mg: 45 tablets\n\nWould you like me to remind you to refill any of these?";
      } else if (messageText.toLowerCase().includes('miss') || messageText.toLowerCase().includes('activities')) {
        responseText = "Looking at today's activities:\n\n✓ Blood pressure reading - Completed\n✗ Morning walk - Missed\n○ Call daughter - Pending (10:00 AM)\n○ Yoga session - Upcoming (5:00 PM)\n\nWould you like me to reschedule the morning walk for later today?";
      } else if (messageText.toLowerCase().includes('feeling') || messageText.toLowerCase().includes('mood')) {
        responseText = "Based on your mood logs this week:\n\n😊 Monday - Great\n😐 Tuesday - Okay\n😊 Wednesday - Great\n😴 Thursday - Tired\n😊 Today - Not logged yet\n\nOverall, you've been feeling positive! Would you like to log today's mood?";
      } else if (messageText.toLowerCase().includes('camera')) {
        responseText = "Camera mode is now active! Point your camera at any medicine and I'll help identify it and tell you:\n\n• What the medicine is for\n• When to take it\n• Any precautions\n\nJust tap the capture button when ready.";
      } else {
        responseText = "I understand you're asking about: \"" + messageText + "\"\n\nAs your health assistant, I can help you with:\n• Medicine reminders and information\n• Activity tracking\n• Health reports\n• Emergency contacts\n\nHow would you like me to assist you today?";
      }

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: responseText,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, aiMessage]);
      setIsLoading(false);
    }, 1500);
  };

  const toggleListening = () => {
    setIsListening(!isListening);
    if (!isListening) {
      toast({
        title: 'Listening...',
        description: 'Speak your question in any language.',
      });
      // Simulate voice input
      setTimeout(() => {
        setIsListening(false);
        setInputValue('What medicines should I take today?');
      }, 3000);
    }
  };

  return (
    <ElderLayout>
      <div className="h-[calc(100vh-12rem)] flex flex-col lg:flex-row gap-6 animate-fade-in">
        {/* AI Character Panel */}
        <div className="lg:w-1/3">
          <Card variant="elevated" className="h-full">
            <CardContent className="p-6 h-full flex flex-col items-center justify-center">
              {/* Animated AI Character */}
              <div className="relative mb-6">
                <div className={`w-40 h-40 rounded-full bg-gradient-primary flex items-center justify-center ${isLoading ? 'animate-pulse' : 'float'}`}>
                  <Bot className="w-20 h-20 text-primary-foreground" />
                </div>
                {isListening && (
                  <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <div
                        key={i}
                        className="w-1 bg-primary rounded-full animate-pulse"
                        style={{
                          height: `${Math.random() * 20 + 10}px`,
                          animationDelay: `${i * 0.1}s`,
                        }}
                      />
                    ))}
                  </div>
                )}
              </div>
              
              <h2 className="text-2xl font-bold mb-2">Aayu AI</h2>
              <p className="text-muted-foreground text-center mb-6">
                Your personal health assistant
              </p>

              {/* Voice Controls */}
              <div className="flex gap-3">
                <Button
                  variant={isListening ? 'danger' : 'default'}
                  size="icon-lg"
                  onClick={toggleListening}
                  className="rounded-full"
                >
                  {isListening ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
                </Button>
                <Button
                  variant={isSpeaking ? 'default' : 'outline'}
                  size="icon-lg"
                  onClick={() => setIsSpeaking(!isSpeaking)}
                  className="rounded-full"
                >
                  {isSpeaking ? <Volume2 className="w-6 h-6" /> : <VolumeX className="w-6 h-6" />}
                </Button>
                <Button
                  variant={cameraMode ? 'secondary' : 'outline'}
                  size="icon-lg"
                  onClick={() => setCameraMode(!cameraMode)}
                  className="rounded-full"
                >
                  <Camera className="w-6 h-6" />
                </Button>
              </div>

              {/* Camera Mode View */}
              {cameraMode && (
                <div className="mt-6 w-full">
                  <div className="aspect-video bg-muted rounded-xl flex items-center justify-center border-2 border-dashed border-border">
                    <div className="text-center">
                      <Camera className="w-12 h-12 mx-auto text-muted-foreground mb-2" />
                      <p className="text-sm text-muted-foreground">Camera preview</p>
                      <p className="text-xs text-muted-foreground mt-1">Point at medicine to identify</p>
                    </div>
                  </div>
                  <Button variant="secondary" className="w-full mt-3">
                    <Camera className="w-4 h-4 mr-2" />
                    Capture
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Chat Panel */}
        <div className="lg:w-2/3 flex flex-col">
          <Card variant="elevated" className="flex-1 flex flex-col overflow-hidden">
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map(message => (
                <div
                  key={message.id}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                      message.role === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted'
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{message.content}</p>
                    <span className="text-xs opacity-70 mt-1 block">
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              ))}
              
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-muted rounded-2xl px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Aayu is thinking...</span>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Actions */}
            <div className="p-4 border-t border-border">
              <div className="flex flex-wrap gap-2 mb-4">
                {quickActions.map((action, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => handleSend(action.prompt)}
                    className="text-xs"
                  >
                    <action.icon className="w-3 h-3 mr-1" />
                    {action.label}
                  </Button>
                ))}
              </div>

              {/* Input Area */}
              <div className="flex gap-2">
                <Button
                  variant={isListening ? 'danger' : 'outline'}
                  size="icon"
                  onClick={toggleListening}
                  className="shrink-0"
                >
                  {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                </Button>
                <Input
                  placeholder="Type your message or tap mic to speak..."
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  className="flex-1"
                />
                <Button
                  variant="hero"
                  size="icon"
                  onClick={() => handleSend()}
                  disabled={!inputValue.trim() || isLoading}
                  className="shrink-0"
                >
                  <Send className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </ElderLayout>
  );
}
