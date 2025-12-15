import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useTranslation } from '@/lib/translations';
import { useApp } from '@/contexts/AppContext';
import { Sun, Moon, RotateCcw, Volume2, VolumeX, Sparkles, Flower, Music, Settings2, History } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';

const MANTRAS = [
    { id: 'krishna', name: 'Hare Krishna', text: ["Hare Krishna Hare Krishna", "Krishna Krishna Hare Hare", "Hare Rama Hare Rama", "Rama Rama Hare Hare"] },
    { id: 'shiva', name: 'Om Namah Shivaya', text: ["Om Namah Shivaya"] },
    { id: 'om', name: 'Om', text: ["Om..."] },
    { id: 'ram', name: 'Sri Rama', text: ["Sri Ram Jai Ram", "Jai Jai Ram"] },
    { id: 'hanuman', name: 'Om Hanumate Namah', text: ["Om Hanumate Namah"] },
];

export default function Meditation() {
    const { settings } = useApp();
    const t = useTranslation(settings.language);
    const { toast } = useToast();

    // State
    const [count, setCount] = useState(0);
    const [target, setTarget] = useState(108);
    const [round, setRound] = useState(0);
    const [theme, setTheme] = useState<'devotional' | 'dark' | 'nature'>('devotional');
    const [isSoundEnabled, setIsSoundEnabled] = useState(false);
    const [selectedMantra, setSelectedMantra] = useState(MANTRAS[0]);
    const [showConfetti, setShowConfetti] = useState(false);

    // Refs
    const lastTap = useRef(0);
    const clickSound = useRef<HTMLAudioElement | null>(null);

    // Initialize sound
    useEffect(() => {
        clickSound.current = new Audio('/sounds/click.mp3'); // Placeholder path
        clickSound.current.volume = 0.5;
    }, []);

    // Confetti cleanup
    useEffect(() => {
        if (showConfetti) {
            const timer = setTimeout(() => setShowConfetti(false), 3000);
            return () => clearTimeout(timer);
        }
    }, [showConfetti]);

    const handleTap = () => {
        const now = Date.now();
        if (now - lastTap.current < 50) return; // Debounce
        lastTap.current = now;

        // Sound
        if (isSoundEnabled) {
            // In a real app, play sound here. 
            // clickSound.current?.currentTime = 0; 
            // clickSound.current?.play().catch(e => {}); 
        }

        // Haptics
        if (navigator.vibrate) navigator.vibrate(5);

        const newCount = count + 1;

        if (newCount >= target) {
            completeRound();
        } else {
            setCount(newCount);
        }
    };

    const completeRound = () => {
        setCount(0);
        setRound(r => r + 1);
        setShowConfetti(true);

        if (navigator.vibrate) navigator.vibrate([100, 50, 100]);

        toast({
            title: "Round Completed! 🌸",
            description: `You have completed ${round + 1} rounds of ${selectedMantra.name}.`,
            className: "bg-primary/20 border-primary/50 text-foreground"
        });
    };

    const resetCounter = () => {
        if (confirm("Reset current counter?")) {
            setCount(0);
        }
    };

    // Colors
    const getThemeColors = () => {
        switch (theme) {
            case 'devotional': return { bg: 'bg-[#FFF5E1]', text: 'text-[#5C2E00]', accent: 'bg-[#FF9933]', ring: 'ring-[#FF9933]/50', card: 'bg-white/90' };
            case 'dark': return { bg: 'bg-slate-950', text: 'text-slate-100', accent: 'bg-indigo-600', ring: 'ring-indigo-500/50', card: 'bg-slate-900/90' };
            case 'nature': return { bg: 'bg-[#F0FDF4]', text: 'text-[#14532D]', accent: 'bg-[#16A34A]', ring: 'ring-[#16A34A]/50', card: 'bg-white/90' };
            default: return { bg: 'bg-background', text: 'text-foreground', accent: 'bg-primary', ring: 'ring-primary/50', card: 'bg-card' };
        }
    };

    const styles = getThemeColors();

    const currentMantraLine = selectedMantra.text[count % selectedMantra.text.length];

    return (
        <div className={`relative min-h-[calc(100vh-250px)] w-full rounded-3xl overflow-hidden transition-colors duration-500 ${styles.bg} animate-fade-in`}>

            {/* Visual Effects Background */}
            <div className="absolute inset-0 pointer-events-none opacity-10">
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-current to-transparent opacity-20"></div>
            </div>

            {/* Confetti Overlay */}
            {showConfetti && (
                <div className="absolute inset-0 pointer-events-none z-50 flex items-center justify-center overflow-hidden">
                    {Array.from({ length: 50 }).map((_, i) => (
                        <div
                            key={i}
                            className="absolute w-2 h-2 bg-primary rounded-full animate-ping"
                            style={{
                                left: `${Math.random() * 100}%`,
                                top: `${Math.random() * 100}%`,
                                animationDuration: `${0.5 + Math.random()}s`,
                                backgroundColor: ['#FF9933', '#FF3333', '#33FF33', '#3399FF'][Math.floor(Math.random() * 4)]
                            }}
                        />
                    ))}
                </div>
            )}

            {/* Top Bar */}
            <div className="relative z-10 flex justify-between items-center p-6">
                <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${styles.card} shadow-sm`}>
                        {theme === 'devotional' ? <Flower className="w-6 h-6 text-orange-600" /> :
                            theme === 'dark' ? <Moon className="w-6 h-6 text-indigo-400" /> :
                                <Sparkles className="w-6 h-6 text-green-600" />}
                    </div>
                    <div>
                        <h1 className={`text-xl font-bold ${styles.text}`}>Mantra Counter</h1>
                        <p className={`text-xs opacity-70 ${styles.text}`}>Focus & Chant</p>
                    </div>
                </div>

                <div className="flex gap-2">
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button variant="ghost" size="icon" className="hover:bg-black/5">
                                <Settings2 className={`w-5 h-5 ${styles.text}`} />
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Meditation Settings</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4 py-4">
                                <div className="space-y-2">
                                    <Label>Theme</Label>
                                    <Select value={theme} onValueChange={(v: any) => setTheme(v)}>
                                        <SelectTrigger><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="devotional">Devotional (Saffron)</SelectItem>
                                            <SelectItem value="nature">Nature (Green)</SelectItem>
                                            <SelectItem value="dark">Dark Mode</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label>Target per Round</Label>
                                    <Select value={target.toString()} onValueChange={(v) => setTarget(parseInt(v))}>
                                        <SelectTrigger><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="11">11</SelectItem>
                                            <SelectItem value="21">21</SelectItem>
                                            <SelectItem value="51">51</SelectItem>
                                            <SelectItem value="108">108</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            {/* Main Content */}
            <div className="relative z-10 flex flex-col items-center justify-center p-4 gap-8 min-h-[50vh]">

                {/* Mantra Selector */}
                <Select value={selectedMantra.id} onValueChange={(v) => setSelectedMantra(MANTRAS.find(m => m.id === v) || MANTRAS[0])}>
                    <SelectTrigger className={`w-64 backdrop-blur-md border-0 shadow-lg ${styles.card} ${styles.text} font-semibold`}>
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        {MANTRAS.map(m => (
                            <SelectItem key={m.id} value={m.id}>{m.name}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                {/* Counter Button */}
                <div className="relative group">
                    {/* Ripple Effect Rings */}
                    <div className={`absolute inset-0 rounded-full border-4 opacity-20 scale-100 group-active:scale-110 transition-transform ${styles.text} border-current`}></div>
                    <div className={`absolute -inset-4 rounded-full border-2 opacity-10 scale-105 group-active:scale-125 transition-transform ${styles.text} border-current`}></div>

                    <button
                        onClick={handleTap}
                        className={`w-64 h-64 md:w-80 md:h-80 rounded-full ${styles.accent} 
                                    shadow-[0_10px_40px_-10px_rgba(0,0,0,0.3)] 
                                    flex flex-col items-center justify-center gap-2
                                    text-white transition-all duration-100 transform active:scale-95 
                                    touch-none select-none outline-none ring-8 ${styles.ring} ring-offset-4 ring-offset-transparent`}
                        style={{ WebkitTapHighlightColor: 'transparent' }}
                    >
                        <span className="text-8xl md:text-9xl font-bold font-mono tracking-tighter filter drop-shadow-md">
                            {count}
                        </span>
                        <span className="text-sm md:text-base font-medium opacity-90 uppercase tracking-widest">
                            / {target}
                        </span>
                    </button>
                </div>

                {/* Chant Text */}
                <div className="text-center h-16 flex items-center justify-center">
                    <p className={`text-xl md:text-2xl font-medium ${styles.text} animate-in fade-in slide-in-from-bottom-2 duration-300 key={count}`}>
                        {currentMantraLine}
                    </p>
                </div>

                {/* Bottom Controls */}
                <div className="flex items-center gap-6 mt-4">
                    <div className={`flex flex-col items-center p-3 rounded-2xl min-w-[100px] ${styles.card}`}>
                        <span className="text-xs uppercase tracking-wider opacity-60 font-semibold mb-1">Rounds</span>
                        <span className="text-2xl font-bold">{round}</span>
                    </div>

                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={resetCounter}
                        className={`rounded-full w-12 h-12 hover:bg-black/5 ${styles.text}`}
                    >
                        <RotateCcw className="w-5 h-5" />
                    </Button>

                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setIsSoundEnabled(!isSoundEnabled)}
                        className={`rounded-full w-12 h-12 hover:bg-black/5 ${styles.text}`}
                    >
                        {isSoundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5 opacity-50" />}
                    </Button>
                </div>

            </div>

        </div>
    );
}
