import React, { useState, useEffect } from 'react';
import { ElderLayout } from '@/components/layout/ElderLayout';
import { useApp } from '@/contexts/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
  Dumbbell,
  Play,
  Pause,
  RotateCcw,
  CheckCircle2,
  Clock,
  Flame,
  Heart,
  Sparkles,
  ChevronRight,
  Plus,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function Exercise() {
  const { user, exercises, toggleExercise, addExercise } = useApp();
  const { toast } = useToast();
  const [activeExercise, setActiveExercise] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newExercise, setNewExercise] = useState({
    name: '',
    duration: '',
    calories: '',
    difficulty: 'easy',
    instructions: ''
  });

  // Filter exercises for current user
  const myExercises = exercises.filter(e => e.userId === user?.id);

  const completedCount = myExercises.filter(e => e.completed).length;
  const totalCalories = myExercises.filter(e => e.completed).reduce((sum, e) => sum + e.calories, 0);
  const progressPercent = myExercises.length > 0 ? (completedCount / myExercises.length) * 100 : 0;

  const handleAdd = () => {
    if (!newExercise.name || !newExercise.duration) return;

    addExercise({
      id: crypto.randomUUID(),
      userId: user?.id || '',
      assignedBy: 'self',
      name: newExercise.name,
      duration: newExercise.duration,
      calories: parseInt(newExercise.calories) || 0,
      difficulty: newExercise.difficulty as any,
      instructions: newExercise.instructions,
      completed: false,
      date: new Date().toISOString()
    });
    setIsAddOpen(false);
    setNewExercise({ name: '', duration: '', calories: '', difficulty: 'easy', instructions: '' });
  };

  const startExercise = (id: string) => {
    setActiveExercise(id);
    setIsPlaying(true);
    toast({
      title: 'Exercise Started',
      description: 'Follow the instructions.',
    });
  };

  return (
    <ElderLayout>
      <div className="space-y-4 md:space-y-6 animate-fade-in overflow-hidden">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="min-w-0">
            <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-2">
              <Dumbbell className="w-6 h-6 md:w-8 md:h-8 text-secondary shrink-0" />
              <span className="truncate">Exercise Planner</span>
            </h1>
            <p className="text-sm text-muted-foreground mt-1">Personalized exercises for you</p>
          </div>

          <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2 shrink-0 self-start sm:self-auto">
                <Plus className="w-4 h-4" />
                New Exercise
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Custom Exercise</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>Exercise Name</Label>
                  <Input value={newExercise.name} onChange={e => setNewExercise({ ...newExercise, name: e.target.value })} placeholder="e.g. Morning Stretch" />
                </div>
                <div className="flex gap-4">
                  <div className="space-y-2 flex-1">
                    <Label>Duration</Label>
                    <Input value={newExercise.duration} onChange={e => setNewExercise({ ...newExercise, duration: e.target.value })} placeholder="e.g. 5 min" />
                  </div>
                  <div className="space-y-2 flex-1">
                    <Label>Calories</Label>
                    <Input type="number" value={newExercise.calories} onChange={e => setNewExercise({ ...newExercise, calories: e.target.value })} placeholder="e.g. 50" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Difficulty</Label>
                  <Select value={newExercise.difficulty} onValueChange={v => setNewExercise({ ...newExercise, difficulty: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="easy">Easy</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="hard">Hard</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Instructions</Label>
                  <Input value={newExercise.instructions} onChange={e => setNewExercise({ ...newExercise, instructions: e.target.value })} placeholder="Short description..." />
                </div>
              </div>
              <DialogFooter>
                <Button onClick={handleAdd}>Add to Plan</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-4 gap-2 md:gap-4">
          <Card variant="elevated" className="text-center p-2 md:p-4">
            <div className="w-8 h-8 md:w-12 md:h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-1 md:mb-2">
              <CheckCircle2 className="w-4 h-4 md:w-6 md:h-6 text-primary" />
            </div>
            <p className="text-lg md:text-2xl font-bold">{completedCount}/{myExercises.length}</p>
            <p className="text-[10px] md:text-sm text-muted-foreground">Done</p>
          </Card>

          <Card variant="elevated" className="text-center p-2 md:p-4">
            <div className="w-8 h-8 md:w-12 md:h-12 rounded-full bg-secondary/10 flex items-center justify-center mx-auto mb-1 md:mb-2">
              <Flame className="w-4 h-4 md:w-6 md:h-6 text-secondary" />
            </div>
            <p className="text-lg md:text-2xl font-bold">{totalCalories}</p>
            <p className="text-[10px] md:text-sm text-muted-foreground">Cal</p>
          </Card>

          <Card variant="elevated" className="text-center p-2 md:p-4">
            <div className="w-8 h-8 md:w-12 md:h-12 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-1 md:mb-2">
              <Clock className="w-4 h-4 md:w-6 md:h-6 text-success" />
            </div>
            <p className="text-lg md:text-2xl font-bold">15</p>
            <p className="text-[10px] md:text-sm text-muted-foreground">Min</p>
          </Card>

          <Card variant="elevated" className="text-center p-2 md:p-4">
            <div className="w-8 h-8 md:w-12 md:h-12 rounded-full bg-danger/10 flex items-center justify-center mx-auto mb-1 md:mb-2">
              <Heart className="w-4 h-4 md:w-6 md:h-6 text-danger" />
            </div>
            <p className="text-lg md:text-2xl font-bold">3</p>
            <p className="text-[10px] md:text-sm text-muted-foreground">Streak</p>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
          {/* Today's Plan */}
          <Card variant="elevated" className="lg:col-span-2 overflow-hidden">
            <CardHeader className="pb-2 px-4 md:px-6">
              <div className="flex items-center justify-between gap-2">
                <CardTitle className="text-base md:text-lg">Your Plan</CardTitle>
                <span className="text-xs md:text-sm text-muted-foreground shrink-0">{Math.round(progressPercent)}%</span>
              </div>
              <Progress value={progressPercent} className="h-2 mt-2" />
            </CardHeader>
            <CardContent className="space-y-2 px-4 md:px-6 pb-4">
              {myExercises.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No exercises added yet. Click "New Exercise" or wait for your caregiver to assign some.
                </div>
              ) : (
                myExercises.map((exercise, index) => (
                  <div
                    key={exercise.id}
                    className={`flex items-center gap-2 md:gap-3 p-2 md:p-3 rounded-xl transition-all ${exercise.completed
                        ? 'bg-success/10'
                        : activeExercise === exercise.id
                          ? 'bg-primary/10'
                          : 'bg-muted'
                      }`}
                  >
                    <button
                      onClick={() => toggleExercise(exercise.id)}
                      className={`w-7 h-7 md:w-8 md:h-8 rounded-full flex items-center justify-center shrink-0 text-xs md:text-sm ${exercise.completed
                          ? 'bg-success text-success-foreground'
                          : 'bg-muted-foreground/20 text-muted-foreground'
                        }`}
                    >
                      {exercise.completed ? (
                        <CheckCircle2 className="w-4 h-4 md:w-5 md:h-5" />
                      ) : (
                        <span className="font-medium">{index + 1}</span>
                      )}
                    </button>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className={`font-medium text-sm md:text-base truncate ${exercise.completed ? 'line-through text-muted-foreground' : ''}`}>
                          {exercise.name}
                        </h4>
                        {exercise.assignedBy !== 'self' && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-blue-100 text-blue-700">Assigned by Caregiver</span>
                        )}
                      </div>

                      <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                        <span className="text-[10px] md:text-xs flex items-center gap-0.5 text-muted-foreground">
                          <Clock className="w-3 h-3" /> {exercise.duration}
                        </span>
                        <span className="text-[10px] md:text-xs flex items-center gap-0.5 text-muted-foreground">
                          <Flame className="w-3 h-3" /> {exercise.calories}
                        </span>
                        <span className={`text-[10px] md:text-xs px-1.5 py-0.5 rounded-full ${exercise.difficulty === 'easy' ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning'
                          }`}>
                          {exercise.difficulty}
                        </span>
                      </div>
                    </div>

                    {!exercise.completed && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => startExercise(exercise.id)}
                        className="shrink-0 w-8 h-8"
                      >
                        {activeExercise === exercise.id && isPlaying ? (
                          <Pause className="w-4 h-4" />
                        ) : (
                          <Play className="w-4 h-4" />
                        )}
                      </Button>
                    )}
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          {/* Right Column */}
          <div className="space-y-4">
            {/* AI Tip */}
            <Card variant="gradient">
              <CardContent className="p-4">
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center shrink-0">
                    <Sparkles className="w-5 h-5 text-accent" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-semibold text-sm">AI Tip</h4>
                    <p className="text-xs text-muted-foreground">For you</p>
                  </div>
                </div>
                <p className="text-sm mb-3">
                  Try a 5-min walk after lunch to boost energy!
                </p>
                <Button variant="outline" size="sm" className="w-full text-xs">
                  More Tips
                  <ChevronRight className="w-3 h-3 ml-1" />
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </ElderLayout>
  );
}
