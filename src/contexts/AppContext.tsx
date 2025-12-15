import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useToast } from '@/hooks/use-toast';

export type UserRole = 'elder' | 'caregiver' | 'organization' | null;
export type TextSize = 'medium' | 'large' | 'xlarge';
export type Language = 'en' | 'hi' | 'ta' | 'te' | 'bn' | 'mr' | 'gu' | 'kn' | 'ml' | 'pa' | 'or' | 'as';
export type ExerciseDifficulty = 'easy' | 'medium' | 'hard';

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
  role: UserRole;
  profilePic?: string;
  phone?: string;
  age?: number;
  gender?: 'male' | 'female' | 'other';
  bloodGroup?: string;
  emergencyContacts?: { name: string; phone: string; relation: string }[];
}

export interface Exercise {
  id: string;
  userId: string; // The elder this is assigned to
  assignedBy: string; // 'self' or caregiverId
  name: string;
  duration: string;
  calories: number;
  completed: boolean;
  instructions: string;
  difficulty: ExerciseDifficulty;
  date: string; // ISO date string
}

export interface Medicine {
  id: string;
  userId: string;
  assignedBy: string;
  name: string;
  dosage: string;
  time: string;
  stock: number;
  taken: boolean;
}

interface Settings {
  textSize: TextSize;
  theme: 'light' | 'dark';
  language: Language;
  reduceMotion: boolean;
  highContrast: boolean;
  voicePreference: 'male' | 'female' | 'neutral';
}

interface AppContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  settings: Settings;
  updateSettings: (settings: Partial<Settings>) => void;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  signup: (userData: Partial<User>, password: string) => Promise<boolean>;

  // Organization / Admin
  users: User[];
  addUser: (newUser: User) => void;
  removeUser: (userId: string) => void;

  // Care / Exercises / Medicines
  exercises: Exercise[];
  medicines: Medicine[];
  addExercise: (exercise: Exercise) => void;
  removeExercise: (id: string) => void;
  toggleExercise: (id: string) => void;
  addMedicine: (medicine: Medicine) => void;
  removeMedicine: (id: string) => void;
  toggleMedicine: (id: string) => void;
}

const defaultSettings: Settings = {
  textSize: 'medium',
  theme: 'light',
  language: 'en',
  reduceMotion: false,
  highContrast: false,
  voicePreference: 'female',
};

const DEMO_USERS: User[] = [
  {
    id: 'demo-elder-1',
    name: 'Ramesh Gupta',
    email: 'elder@aayu.com',
    password: 'password123',
    role: 'elder',
    profilePic: 'https://api.dicebear.com/7.x/avataaars/svg?seed=elder',
    age: 72,
    gender: 'male',
  },
  {
    id: 'demo-caregiver-1',
    name: 'Sarah Wilson',
    email: 'caregiver@aayu.com',
    password: 'password123',
    role: 'caregiver',
    profilePic: 'https://api.dicebear.com/7.x/avataaars/svg?seed=caregiver',
    phone: '+91 98765 43210',
  },
  {
    id: 'demo-org-1',
    name: 'Aayu Health Admin',
    email: 'admin@aayu.com',
    password: 'password123',
    role: 'organization',
    profilePic: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin',
  }
];

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const [users, setUsers] = useState<User[]>(DEMO_USERS);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const { toast } = useToast();

  // Load / Persist Logic
  useEffect(() => {
    const savedSettings = localStorage.getItem('aayu-settings');
    if (savedSettings) setSettings({ ...defaultSettings, ...JSON.parse(savedSettings) });

    const savedUser = localStorage.getItem('aayu-user');
    if (savedUser) setUser(JSON.parse(savedUser));

    const savedUsersDB = localStorage.getItem('aayu-users-db');
    if (savedUsersDB) setUsers(JSON.parse(savedUsersDB));

    const savedExercises = localStorage.getItem('aayu-exercises');
    if (savedExercises) setExercises(JSON.parse(savedExercises));

    const savedMedicines = localStorage.getItem('aayu-medicines');
    if (savedMedicines) setMedicines(JSON.parse(savedMedicines));
  }, []);

  useEffect(() => {
    localStorage.setItem('aayu-users-db', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem('aayu-exercises', JSON.stringify(exercises));
  }, [exercises]);

  useEffect(() => {
    localStorage.setItem('aayu-medicines', JSON.stringify(medicines));
  }, [medicines]);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', settings.theme === 'dark');
    document.documentElement.classList.remove('text-size-medium', 'text-size-large', 'text-size-xlarge');
    document.documentElement.classList.add(`text-size-${settings.textSize}`);
    localStorage.setItem('aayu-settings', JSON.stringify(settings));
  }, [settings]);

  const updateSettings = (newSettings: Partial<Settings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    await new Promise(resolve => setTimeout(resolve, 800));
    const foundUser = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (foundUser?.password === password) {
      setUser(foundUser);
      localStorage.setItem('aayu-user', JSON.stringify(foundUser));
      return true;
    }
    return false;
  };

  const signup = async (userData: Partial<User>, password: string): Promise<boolean> => {
    // ... (same as before)
    await new Promise(resolve => setTimeout(resolve, 800));
    if (users.some(u => u.email.toLowerCase() === userData.email?.toLowerCase())) {
      toast({ title: 'Email already registered', description: 'Please use a different email or login.', variant: 'destructive' });
      return false;
    }
    const newUser: User = {
      id: crypto.randomUUID(),
      name: userData.name || 'User',
      email: userData.email || '',
      password: password,
      role: userData.role || 'elder',
      profilePic: userData.profilePic || `https://api.dicebear.com/7.x/avataaars/svg?seed=${userData.email}`,
      phone: userData.phone,
      age: userData.age,
      gender: userData.gender,
      bloodGroup: userData.bloodGroup,
      emergencyContacts: userData.emergencyContacts,
    };
    const updatedUsers = [...users, newUser];
    setUsers(updatedUsers);
    setUser(newUser);
    localStorage.setItem('aayu-user', JSON.stringify(newUser));
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('aayu-user');
  };

  const addUser = (newUser: User) => {
    const updated = [...users, { ...newUser, id: crypto.randomUUID() }];
    setUsers(updated);
    toast({ title: 'Success', description: 'User added successfully.' });
  };

  const removeUser = (userId: string) => {
    if (userId.startsWith('demo-')) {
      toast({ title: 'Action Denied', description: 'Cannot delete core demo accounts.', variant: 'destructive' });
      return;
    }
    const updated = users.filter(u => u.id !== userId);
    setUsers(updated);
    toast({ title: 'User Removed', description: 'The user account has been deleted.' });
  };

  // --- Care Logic ---
  const addExercise = (exercise: Exercise) => {
    setExercises(prev => [...prev, exercise]);
    toast({ title: 'Plan Updated', description: 'New exercise added.' });
  };

  const removeExercise = (id: string) => {
    setExercises(prev => prev.filter(e => e.id !== id));
    toast({ title: 'Removed', description: 'Exercise removed from plan.' });
  };

  const toggleExercise = (id: string) => {
    setExercises(prev => prev.map(e => e.id === id ? { ...e, completed: !e.completed } : e));
  };

  const addMedicine = (medicine: Medicine) => {
    setMedicines(prev => [...prev, medicine]);
    toast({ title: 'Medicine Added', description: 'New medicine tracked.' });
  };

  const removeMedicine = (id: string) => {
    setMedicines(prev => prev.filter(m => m.id !== id));
  };

  const toggleMedicine = (id: string) => {
    setMedicines(prev => prev.map(m => m.id === id ? { ...m, taken: !m.taken } : m));
  };

  return (
    <AppContext.Provider
      value={{
        user, setUser, settings, updateSettings, isAuthenticated: !!user,
        login, logout, signup, users, addUser, removeUser,
        exercises, medicines, addExercise, removeExercise, toggleExercise,
        addMedicine, removeMedicine, toggleMedicine
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) throw new Error('useApp must be used within an AppProvider');
  return context;
}
