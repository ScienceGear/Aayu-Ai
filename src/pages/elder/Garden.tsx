import React, { useState, useEffect } from 'react';
import { ElderLayout } from '@/components/layout/ElderLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  TreePine,
  Droplets,
  Sun,
  Moon,
  Music,
  Volume2,
  VolumeX,
  Award,
  Sparkles,
  Play,
  Pause,
  Timer
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Meditation from './Meditation';

interface Plant {
  id: string;
  name: string;
  type: 'flower' | 'tree' | 'plant';
  growth: number;
  watered: boolean;
  lastWatered: Date;
}

const initialPlants: Plant[] = [
  { id: '1', name: 'Rose', type: 'flower', growth: 80, watered: false, lastWatered: new Date() },
  { id: '2', name: 'Tulsi', type: 'plant', growth: 100, watered: true, lastWatered: new Date() },
  { id: '3', name: 'Marigold', type: 'flower', growth: 60, watered: false, lastWatered: new Date() },
  { id: '4', name: 'Mango Tree', type: 'tree', growth: 45, watered: false, lastWatered: new Date() },
  { id: '5', name: 'Jasmine', type: 'flower', growth: 90, watered: true, lastWatered: new Date() },
  { id: '6', name: 'Neem', type: 'tree', growth: 30, watered: false, lastWatered: new Date() },
];

const achievements = [
  { id: '1', name: 'First Bloom', description: 'Grow your first flower', unlocked: true },
  { id: '2', name: 'Green Thumb', description: 'Water plants 7 days in a row', unlocked: true },
  { id: '3', name: 'Garden Master', description: 'Grow 10 plants to full size', unlocked: false },
  { id: '4', name: 'Zen Gardener', description: 'Meditate in the garden 5 times', unlocked: false },
];

export default function VirtualGarden() {
  const { toast } = useToast();
  const [plants, setPlants] = useState(initialPlants);
  const [isDay, setIsDay] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [selectedPlant, setSelectedPlant] = useState<Plant | null>(null);
  const [timerActive, setTimerActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timerActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setTimerActive(false);
      toast({
        title: "Session Complete",
        description: "Great job completing your meditation session!",
      });
    }
    return () => clearInterval(interval);
  }, [timerActive, timeLeft]);

  const waterPlant = (plantId: string) => {
    setPlants(prev =>
      prev.map(plant =>
        plant.id === plantId
          ? {
            ...plant,
            watered: true,
            growth: Math.min(100, plant.growth + 10),
            lastWatered: new Date(),
          }
          : plant
      )
    );
    toast({
      title: '💧 Plant Watered!',
      description: 'Your plant is happy and growing.',
    });
  };

  const getPlantEmoji = (plant: Plant) => {
    if (plant.growth < 30) return '🌱';
    if (plant.growth < 60) return plant.type === 'flower' ? '🌷' : '🌿';
    if (plant.growth < 90) return plant.type === 'flower' ? '🌸' : plant.type === 'tree' ? '🌳' : '🌿';
    return plant.type === 'flower' ? '🌺' : plant.type === 'tree' ? '🌳' : '🌿';
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <ElderLayout>
      <div className="space-y-6 animate-fade-in">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <TreePine className="w-8 h-8 text-success" />
              Virtual Garden & Wellness
            </h1>
            <p className="text-muted-foreground mt-1">Your space for peace and growth</p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant={isDay ? 'default' : 'outline'}
              size="icon"
              onClick={() => setIsDay(!isDay)}
            >
              {isDay ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </Button>
            <Button
              variant={soundEnabled ? 'default' : 'outline'}
              size="icon"
              onClick={() => setSoundEnabled(!soundEnabled)}
            >
              {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        <Tabs defaultValue="garden" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="garden">My Garden</TabsTrigger>
            <TabsTrigger value="meditate">Meditate</TabsTrigger>
            <TabsTrigger value="relax">Relax & Music</TabsTrigger>
          </TabsList>

          <TabsContent value="garden" className="space-y-6">
            <Card
              variant="elevated"
              className={`overflow-hidden transition-all duration-500 ${isDay ? 'bg-gradient-to-b from-sky-100 to-green-100 dark:from-sky-900/30 dark:to-green-900/30' : 'bg-gradient-to-b from-indigo-900/50 to-slate-900/50'
                }`}
            >
              <CardContent className="p-6">
                <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
                  {plants.map(plant => (
                    <button
                      key={plant.id}
                      onClick={() => setSelectedPlant(plant)}
                      className={`aspect-square rounded-2xl p-4 flex flex-col items-center justify-center transition-all hover:scale-105 ${selectedPlant?.id === plant.id
                        ? 'bg-card ring-2 ring-primary shadow-lg'
                        : 'bg-card/50 hover:bg-card'
                        }`}
                    >
                      <span className="text-4xl mb-2">{getPlantEmoji(plant)}</span>
                      <span className="text-xs font-medium truncate w-full text-center">
                        {plant.name}
                      </span>
                      <div className="w-full h-1 bg-muted rounded-full mt-2 overflow-hidden">
                        <div
                          className="h-full bg-success transition-all"
                          style={{ width: `${plant.growth}%` }}
                        />
                      </div>
                    </button>
                  ))}
                </div>

                {selectedPlant && (
                  <div className="mt-6 p-4 bg-card rounded-xl animate-in slide-in-from-bottom-2">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-4">
                        <span className="text-6xl">{getPlantEmoji(selectedPlant)}</span>
                        <div>
                          <h3 className="text-xl font-semibold">{selectedPlant.name}</h3>
                          <p className="text-sm text-muted-foreground capitalize">{selectedPlant.type}</p>
                          <div className="flex items-center gap-2 mt-2">
                            <span className="text-sm">Growth: {selectedPlant.growth}%</span>
                            {selectedPlant.watered && (
                              <span className="text-xs bg-success/10 text-success px-2 py-0.5 rounded">
                                Watered today
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <Button
                        variant="secondary"
                        onClick={() => waterPlant(selectedPlant.id)}
                        disabled={selectedPlant.watered}
                      >
                        <Droplets className="w-4 h-4 mr-2" />
                        {selectedPlant.watered ? 'Watered' : 'Water'}
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card variant="elevated">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-warning" />
                  Garden Achievements
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {achievements.map(achievement => (
                    <div
                      key={achievement.id}
                      className={`flex items-center gap-4 p-3 rounded-xl ${achievement.unlocked ? 'bg-warning/10' : 'bg-muted'
                        }`}
                    >
                      <div
                        className={`w-12 h-12 rounded-full flex items-center justify-center ${achievement.unlocked
                          ? 'bg-warning text-warning-foreground'
                          : 'bg-muted-foreground/20 text-muted-foreground'
                          }`}
                      >
                        <Award className="w-6 h-6" />
                      </div>
                      <div className="flex-1">
                        <h4 className={`font-medium ${!achievement.unlocked && 'text-muted-foreground'}`}>
                          {achievement.name}
                        </h4>
                        <p className="text-sm text-muted-foreground">{achievement.description}</p>
                      </div>
                      {achievement.unlocked && (
                        <span className="text-xs text-warning font-medium">Unlocked!</span>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="meditate" className="space-y-6">
            <Meditation />
          </TabsContent>

          <TabsContent value="relax" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { title: "Morning Bhajans", duration: "15:00", type: "Devotional" },
                { title: "Rain Sounds", duration: "30:00", type: "Nature" },
                { title: "Flute Meditation", duration: "10:00", type: "Instrumental" },
                { title: "Om Chanting", duration: "20:00", type: "Mantra" },
                { title: "Forest Walk", duration: "45:00", type: "Nature" },
                { title: "Evening Aarti", duration: "12:00", type: "Devotional" }
              ].map((track, i) => (
                <Card key={i} className="hover:border-primary/50 transition-colors cursor-pointer group">
                  <CardContent className="p-4 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center group-hover:bg-secondary group-hover:text-white transition-colors">
                      <Play className="w-5 h-5 ml-1" />
                    </div>
                    <div>
                      <h4 className="font-semibold">{track.title}</h4>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span>{track.duration}</span>
                        <span>•</span>
                        <span>{track.type}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </ElderLayout>
  );
}
