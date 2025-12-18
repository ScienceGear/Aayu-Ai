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
  Headset,
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

import { useApp } from '@/contexts/AppContext';
import { getGeminiResponse, analyzeMedicineImage } from '@/lib/gemini';

// ... existing interfaces ...

export default function AayuAssistant() {
  const { toast } = useToast();
  const { user, medicines, activities, exercises, reports, settings } = useApp(); // Added reports

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
  const [isSpeaking, setIsSpeaking] = useState(false); // Default to FALSE to fix "always uses tts"
  const [isLoading, setIsLoading] = useState(false);
  const [cameraMode, setCameraMode] = useState(false);
  const [isConversationMode, setIsConversationMode] = useState(false); // New state for continuous mode
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Voice State Refs
  const recognitionRef = useRef<any>(null);
  const synthRef = useRef<SpeechSynthesis>(window.speechSynthesis);

  // Language Mapping
  const getLanguageTag = (lang: string) => {
    const map: Record<string, string> = {
      'en': 'en-US',
      'hi': 'hi-IN',
      'ta': 'ta-IN',
      'te': 'te-IN',
      'bn': 'bn-IN',
      'mr': 'mr-IN',
      'gu': 'gu-IN',
      'kn': 'kn-IN',
      'ml': 'ml-IN',
      'pa': 'pa-IN',
      'or': 'or-IN',
      'as': 'as-IN'
    };
    return map[lang] || 'en-US';
  };

  // Improved Voice Selection
  const getBestVoice = (langTag: string) => {
    if (!synthRef.current) return null;
    const voices = synthRef.current.getVoices();
    // Prioritize Google or Microsoft "Natural" voices
    return voices.find(v =>
      v.lang === langTag && (v.name.includes("Google") || v.name.includes("Natural"))
    ) || voices.find(v => v.lang === langTag) || null;
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };




  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // STT Initialization
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputValue(transcript);
        handleSend(transcript);
        setIsListening(false);
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error', event.error);
        setIsListening(false);
        toast({
          title: 'Voice Error',
          description: 'Could not categorize speech. Please try again.',
          variant: 'destructive'
        });
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    } else {
      console.warn("Web Speech API not supported in this browser.");
    }

    return () => {
      if (recognitionRef.current) recognitionRef.current.stop();
      if (synthRef.current) synthRef.current.cancel();
    };
  }, []);

  // Update Recognition Language dynamically
  useEffect(() => {
    if (recognitionRef.current && settings?.language) {
      recognitionRef.current.lang = getLanguageTag(settings.language);
    }
  }, [settings?.language]);


  const speakText = (text: string) => {
    if (!isSpeaking || !synthRef.current) return;

    // Cancel previous speech
    synthRef.current.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    const langTag = getLanguageTag(settings?.language || 'en');
    utterance.lang = langTag;

    const bestVoice = getBestVoice(langTag);
    if (bestVoice) {
      utterance.voice = bestVoice;
    }

    // Tweak properties for more natural sound
    utterance.rate = 0.95; // Slightly slower
    utterance.pitch = 1.05; // Slightly higher/clearer

    utterance.onend = () => {
      // Continuous Conversation Logic
      if (isConversationMode) {
        setTimeout(() => {
          if (!isListening) {
            try {
              recognitionRef.current?.start();
              setIsListening(true);
              toast({ description: "Listening for your reply..." });
            } catch (e) {
              // ignore if already started
            }
          }
        }, 500); // Small pause before listening
      }
    };

    synthRef.current.speak(utterance);
  };

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

    // Stop speaking when user sends new message
    if (synthRef.current) synthRef.current.cancel();
    if (recognitionRef.current) recognitionRef.current.stop(); // Stop listening while processing
    setIsListening(false);

    // Check for camera mode command (local logic)
    if (messageText.toLowerCase().includes('camera')) {
      setCameraMode(true);
      toast({
        title: 'Camera Mode Enabled',
        description: 'Point your camera at a medicine to identify it.',
      });
      // We can still let Gemini respond about the camera
    }

    // Build Comprehensive Context
    const myMedicines = medicines.filter(m => m.userId === user?.id);
    const myActivities = activities.filter(a => a.userId === user?.id);
    const myExercises = (exercises || []).filter(e => e.userId === user?.id);
    const myReports = (reports || []).filter(r => r.userId === user?.id);

    const contextInfo = `
      User Profile:
      - Name: ${user?.name || 'Elder'}
      - Age: ${user?.age || 'Not specified'}
      - Gender: ${user?.gender || 'Not specified'}
      - Height: ${user?.height || 'Not specified'} cm
      - Weight: ${user?.weight || 'Not specified'} kg
      - Blood Group: ${user?.bloodGroup || 'Not specified'}
      
      Current Language: ${settings?.language || 'en'}
      
      Health Schedule & Logs:
      
      1. Medicines Tracking:
      ${myMedicines.length > 0 ? myMedicines.map(m => `- ${m.name} (${m.dosage}): ${m.stock} units in stock. Scheduled for: ${m.time}`).join('\n') : 'No medicines scheduled.'}
      
      2. Today's Activities:
      ${myActivities.length > 0 ? myActivities.map(a => `- ${a.title} at ${a.dueTime} (Status: ${a.completed ? 'Completed' : 'Pending'})`).join('\n') : 'No activities scheduled today.'}
      
      3. Prescribed Exercises:
      ${myExercises.length > 0 ? myExercises.map(e => `- ${e.name} (${e.duration}): ${e.instructions} (Status: ${e.completed ? 'Done' : 'Pending'})`).join('\n') : 'No exercises assigned.'}

      4. Recent Health & Mood Reports (last week):
      ${myReports.length > 0 ? myReports.slice(0, 10).map(r => `- ${new Date(r.date).toLocaleDateString()}: ${r.issue} - ${r.description}`).join('\n') : 'No mood logs or reports found for this week.'}

      Instructions for Aayu:
      - Keep responses brief and conversational as they are spoken aloud.
      - Use the context above (especially reports) to answer specific questions about health, mood, or schedule.
      - If the user asks about how they have been feeling, analyze the reports in section 4.
      - Be warm and supportive like a family member.
    `;

    try {
      const responseText = await getGeminiResponse(messageText, contextInfo);

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: responseText,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, aiMessage]);
      speakText(responseText); // Speak the response

    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to get response from Aayu.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCameraCapture = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    setCameraMode(false); // Close preview

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: '📸 [Uploaded medicine image for analysis]',
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, userMessage]);

    try {
      const result = await analyzeMedicineImage(file);
      if (result) {
        const analysisText = `I have analyzed the medicine image:
        
💊 Name: ${result.name}
⚖️ Dosage: ${result.dosage}
🕒 Frequency: ${result.frequency}
🍽️ Instructions: ${result.withFood ? 'Take with food' : 'Can be taken without food'}
📦 Estimated Stock: ${result.stock} units

What would you like me to do with this information?`;

        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: analysisText,
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, aiMessage]);
        speakText(analysisText);
      } else {
        throw new Error("Analysis failed");
      }
    } catch (error) {
      toast({
        title: "Analysis Failed",
        description: "I couldn't identify the medicine. Please ensure the image is clear.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      setIsConversationMode(false); // Stop loop if manually stopped
    } else {
      try {
        recognitionRef.current?.start();
        setIsListening(true);
        toast({
          title: "Listening...",
          description: `Speak in ${settings?.language === 'hi' ? 'Hindi' : 'English'}...`
        });
      } catch (err) {
        console.error("Failed to start recognition:", err);
      }
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
                  className={`rounded-full ${isListening ? 'animate-pulse' : ''}`}
                  title="Single Query"
                >
                  {isListening ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
                </Button>

                <Button
                  variant={isConversationMode ? 'default' : 'outline'}
                  size="icon-lg"
                  onClick={() => {
                    const newState = !isConversationMode;
                    setIsConversationMode(newState);
                    if (newState) {
                      // Turn on speaking for conversation mode
                      setIsSpeaking(true);
                      if (!isListening) toggleListening();
                    } else {
                      recognitionRef.current?.stop();
                      synthRef.current?.cancel();
                      setIsListening(false);
                    }
                  }}
                  className={`rounded-full ${isConversationMode ? 'ring-2 ring-primary ring-offset-2 bg-primary text-primary-foreground' : ''}`}
                  title="Live Conversation Mode"
                >
                  <Headset className="w-6 h-6" />
                </Button>

                <Button
                  variant={isSpeaking ? 'default' : 'outline'}
                  size="icon-lg"
                  onClick={() => {
                    if (isSpeaking) {
                      synthRef.current?.cancel();
                    }
                    setIsSpeaking(!isSpeaking);
                  }}
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
                  <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept="image/*"
                    onChange={handleCameraCapture}
                  />
                  <Button
                    variant="secondary"
                    className="w-full mt-3"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Camera className="w-4 h-4 mr-2" />
                    Capture / Upload
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
                    className={`max-w-[80%] rounded-2xl px-4 py-3 ${message.role === 'user'
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
                  className={`shrink-0 ${isListening ? 'animate-pulse' : ''}`}
                >
                  {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                </Button>
                <Input
                  placeholder={`Type or speak in ${settings?.language === 'hi' ? 'Hindi' : 'English'}...`}
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
