import React, { createContext, useContext, useState, useEffect, ReactNode, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';
import { io, Socket } from 'socket.io-client';

const getBaseUrl = () => {
  const hostname = window.location.hostname;
  // If running completely locally
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return 'http://localhost:5000';
  }
  // If running on network (e.g. 192.168.x.x)
  return `http://${hostname}:5000`;
};

const BASE_URL = getBaseUrl();
const API_URL = `${BASE_URL}/api`;

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
  height?: number; // cm
  weight?: number; // kg
  bloodGroup?: string;
  // Caregiver fields
  rating?: number;
  ratingsCount?: number;
  isOnline?: boolean;
  lastSeen?: string;
  experience?: string;
  location?: string;
  specialization?: string;
  feedbacks?: {
    elderId: string;
    elderName: string;
    rating: number;
    comment: string;
    date: string;
  }[];
  emergencyContacts?: { name: string; phone: string; relation: string }[];
}

export interface Exercise {
  id: string;
  userId: string;
  assignedBy: string;
  name: string;
  duration: string;
  calories: number;
  completed: boolean;
  instructions: string;
  difficulty: ExerciseDifficulty;
  date: string;
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

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: string;
  type: 'text' | 'image';
}

export interface Call {
  id: string;
  participants: string[];
  type: 'voice' | 'video';
  status: 'calling' | 'connected' | 'ended';
  startTime?: string;
}

export interface Activity {
  id: string;
  userId: string;
  title: string;
  completed: boolean;
  dueTime: string;
  priority: 'high' | 'medium' | 'low';
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
  updateUser: (updatedData: Partial<User>) => void;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  signup: (userData: Partial<User>, password: string) => Promise<boolean>;

  users: User[];
  addUser: (newUser: User) => void;
  removeUser: (userId: string) => void;

  exercises: Exercise[];
  medicines: Medicine[];
  addExercise: (exercise: Exercise) => void;
  removeExercise: (id: string) => void;
  toggleExercise: (id: string) => void;
  addMedicine: (medicine: Medicine) => void;
  removeMedicine: (id: string) => void;
  toggleMedicine: (id: string) => void;

  messages: Message[];
  sendMessage: (receiverId: string, content: string) => void;
  activeCall: Call | null;
  startCall: (receiverId: string, type: 'voice' | 'video') => void;
  endCall: () => void;
  incomingCall: { callId: string, callerId: string, callerName: string, signal: any, type: 'voice' | 'video' } | null;
  answerCall: () => void;
  rejectCall: () => void;

  activities: Activity[];
  addActivity: (activity: Activity) => void;
  removeActivity: (id: string) => void;
  toggleActivityStatus: (id: string) => void;
}

const defaultSettings: Settings = {
  textSize: 'medium',
  theme: 'light',
  language: 'en',
  reduceMotion: false,
  highContrast: false,
  voicePreference: 'female',
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const [users, setUsers] = useState<User[]>([]);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [activeCall, setActiveCall] = useState<Call | null>(null);
  const [incomingCall, setIncomingCall] = useState<{ callId: string, callerId: string, callerName: string, signal: any, type: 'voice' | 'video' } | null>(null);
  const { toast } = useToast();

  const socketRef = useRef<Socket | null>(null);

  // Initialize Data & Socket
  useEffect(() => {
    // Connect Socket with better configuration
    console.log('🔌 Connecting to Socket.IO server at:', BASE_URL);
    socketRef.current = io(BASE_URL, {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    socketRef.current.on('connect', () => {
      console.log('✅ Connected to socket server, Socket ID:', socketRef.current?.id);
      const savedUser = localStorage.getItem('aayu-user');
      if (savedUser) {
        const userData = JSON.parse(savedUser);
        console.log('👤 Joining room for user:', userData.id);
        socketRef.current?.emit('join_room', userData.id);
      }
    });

    socketRef.current.on('connect_error', (error) => {
      console.error('❌ Socket connection error:', error.message);
    });

    socketRef.current.on('receive_message', (data: Message) => {
      console.log('📨 Received message:', data);
      setMessages(prev => [...prev, data]);
      toast({ title: 'New Message', description: data.content.substring(0, 50) });
    });

    // WebRTC Signaling Events
    socketRef.current.on('incoming_call', (data: any) => {
      console.log("📞 Incoming call:", data);
      setIncomingCall({
        callId: crypto.randomUUID(),
        callerId: data.from,
        callerName: data.name || 'Unknown',
        signal: data.offer,
        type: data.type || 'video'
      });
    });

    socketRef.current.on('call_answered', (data: any) => {
      console.log("✅ Call answered with answer:", data.answer);
      // This will be handled in VideoCallInterface
      window.dispatchEvent(new CustomEvent('call-answered', { detail: data.answer }));
    });

    socketRef.current.on('ice_candidate', (data: any) => {
      console.log("🧊 Received ICE candidate");
      // This will be handled in VideoCallInterface
      window.dispatchEvent(new CustomEvent('ice-candidate', { detail: data.candidate }));
    });

    socketRef.current.on('call_ended', () => {
      console.log("📴 Call ended by remote");
      setActiveCall(null);
      setIncomingCall(null);
      toast({ description: 'Call ended' });
    });

    // Fetch Initial Data
    fetchInitialData();

    // Load Settings
    const savedSettings = localStorage.getItem('aayu-settings');
    if (savedSettings) setSettings({ ...defaultSettings, ...JSON.parse(savedSettings) });

    const savedUser = localStorage.getItem('aayu-user');
    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);
      setUser(parsedUser);
      socketRef.current?.emit('join_room', parsedUser.id);
    }

    return () => {
      socketRef.current?.disconnect();
    };
  }, []);

  const fetchInitialData = async () => {
    try {
      const [usersRes, exercisesRes, medicinesRes] = await Promise.all([
        fetch(`${API_URL}/users`),
        fetch(`${API_URL}/care/exercises`),
        fetch(`${API_URL}/care/medicines`)
      ]);

      if (usersRes.ok) setUsers(await usersRes.json());
      if (exercisesRes.ok) setExercises(await exercisesRes.json());
      if (medicinesRes.ok) setMedicines(await medicinesRes.json());

    } catch (err) {
      console.error("Failed to fetch data:", err);
    }
  };

  // Fetch messages when user changes
  useEffect(() => {
    if (user) {
      fetch(`${API_URL}/messages/${user.id}`)
        .then(res => res.json())
        .then(data => setMessages(data))
        .catch(err => console.error(err));
    }
  }, [user]);

  // Settings Effect
  useEffect(() => {
    document.documentElement.classList.toggle('dark', settings.theme === 'dark');
    document.documentElement.classList.remove('text-size-medium', 'text-size-large', 'text-size-xlarge');
    document.documentElement.classList.add(`text-size-${settings.textSize}`);
    localStorage.setItem('aayu-settings', JSON.stringify(settings));
  }, [settings]);

  const updateSettings = (newSettings: Partial<Settings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  // --- Auth ---
  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      if (res.ok) {
        const data = await res.json();
        setUser(data);
        localStorage.setItem('aayu-user', JSON.stringify(data));
        socketRef.current?.emit('join_room', data.id);
        return true;
      } else {
        return false;
      }
    } catch (err) {
      console.error(err);
      return false;
    }
  };

  const signup = async (userData: Partial<User>, password: string): Promise<boolean> => {
    try {
      const newUser = {
        id: crypto.randomUUID(), // Or let backend handle ID
        ...userData,
        password
      };
      const res = await fetch(`${API_URL}/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUser)
      });

      if (res.ok) {
        const data = await res.json();
        setUser(data);
        setUsers(prev => [...prev, data]);
        localStorage.setItem('aayu-user', JSON.stringify(data));
        socketRef.current?.emit('join_room', data.id);
        return true;
      } else {
        const err = await res.json();
        console.error("Signup failed:", err);
        toast({ title: 'Registration Failed', description: err.message || 'Validation error', variant: 'destructive' });
        return false;
      }
    } catch (err) {
      console.error("Signup exception:", err);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('aayu-user');
    window.location.href = '/login';
  };

  // --- User Management ---
  const addUser = async (newUser: User) => {
    await signup({ ...newUser, password: 'password123' }, 'password123'); // Hacky reuse of signup
    toast({ title: 'Success', description: 'User added successfully.' });
  };

  const removeUser = async (userId: string) => {
    await fetch(`${API_URL}/users/${userId}`, { method: 'DELETE' });
    setUsers(users.filter(u => u.id !== userId));
    toast({ title: 'User Removed', description: 'The user account has been deleted.' });
  };

  const updateUser = async (updatedData: Partial<User>) => {
    if (!user) return;
    const res = await fetch(`${API_URL}/users/${user.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedData)
    });

    if (res.ok) {
      const data = await res.json();
      setUser(data);
      localStorage.setItem('aayu-user', JSON.stringify(data));
      setUsers(users.map(u => u.id === user.id ? data : u));
      toast({ title: 'Profile Updated', description: 'Your information has been saved.' });
    }
  };

  // --- Care Logic ---
  const addExercise = async (exercise: Exercise) => {
    const res = await fetch(`${API_URL}/care/exercises`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(exercise)
    });
    if (res.ok) {
      const data = await res.json();
      setExercises(prev => [...prev, data]);
      toast({ title: 'Plan Updated', description: 'New exercise added.' });
    }
  };

  const removeExercise = async (id: string) => {
    await fetch(`${API_URL}/care/exercises/${id}`, { method: 'DELETE' });
    setExercises(prev => prev.filter(e => e.id !== id));
    toast({ title: 'Removed', description: 'Exercise removed from plan.' });
  };

  const toggleExercise = async (id: string) => {
    // Optimistic update
    const ex = exercises.find(e => e.id === id);
    if (!ex) return;
    const updated = { ...ex, completed: !ex.completed };

    setExercises(prev => prev.map(e => e.id === id ? updated : e));
    await fetch(`${API_URL}/care/exercises/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updated)
    });
  };

  const addMedicine = async (medicine: Medicine) => {
    const res = await fetch(`${API_URL}/care/medicines`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(medicine)
    });
    if (res.ok) {
      const data = await res.json();
      setMedicines(prev => [...prev, data]);
      toast({ title: 'Medicine Added', description: 'New medicine tracked.' });
    }
  };

  const removeMedicine = async (id: string) => {
    await fetch(`${API_URL}/care/medicines/${id}`, { method: 'DELETE' });
    setMedicines(prev => prev.filter(m => m.id !== id));
  };

  const toggleMedicine = async (id: string) => {
    const med = medicines.find(m => m.id === id);
    if (!med) return;
    const updated = { ...med, taken: !med.taken };

    setMedicines(prev => prev.map(m => m.id === id ? updated : m));
    await fetch(`${API_URL}/care/medicines/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updated)
    });
  };

  // --- Communication Logic ---
  const sendMessage = async (receiverId: string, content: string) => {
    if (!user) return;
    const newMessage = {
      id: crypto.randomUUID(),
      senderId: user.id,
      receiverId,
      content,
      timestamp: new Date().toISOString(),
      type: 'text',
    };

    // Save to DB
    await fetch(`${API_URL}/messages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newMessage)
    });

    // Emit via Socket
    socketRef.current?.emit('send_message', newMessage);

    // Update Local State
    setMessages(prev => [...prev, newMessage as Message]);
  };

  const startCall = async (receiverId: string, type: 'voice' | 'video') => {
    if (!user) return;
    console.log(`📞 Starting ${type} call to:`, receiverId);

    setActiveCall({
      id: crypto.randomUUID(),
      participants: [user.id, receiverId],
      type,
      status: 'calling',
      startTime: new Date().toISOString(),
    });

    // Emit call event - WebRTC offer will be created in VideoCallInterface
    socketRef.current?.emit('call_user', {
      userToCall: receiverId,
      from: user.id,
      name: user.name,
      type: type,
      offer: null // Will be set by VideoCallInterface
    });
  };

  const endCall = () => {
    const receiverId = activeCall?.participants.find(p => p !== user?.id);
    if (receiverId) {
      socketRef.current?.emit('end_call', { to: receiverId });
    }
    setActiveCall(null);
    setIncomingCall(null);
  };

  const answerCall = () => {
    if (!incomingCall || !user) return;
    setActiveCall({
      id: incomingCall.callId,
      participants: [user.id, incomingCall.callerId],
      type: incomingCall.type,
      status: 'connected',
      startTime: new Date().toISOString()
    });
    setIncomingCall(null);

    socketRef.current?.emit('answer_call', { signal: {}, to: incomingCall.callerId });
  };

  const rejectCall = () => {
    if (!incomingCall) return;
    socketRef.current?.emit('end_call', { to: incomingCall.callerId });
    setIncomingCall(null);
  };

  // --- Activity Management ---
  const addActivity = (activity: Activity) => {
    setActivities(prev => [...prev, activity]);
    toast({ title: 'Activity Added', description: 'New task scheduled.' });
  };

  const removeActivity = (id: string) => {
    setActivities(prev => prev.filter(a => a.id !== id));
  };

  const toggleActivityStatus = (id: string) => {
    setActivities(prev => prev.map(a => a.id === id ? { ...a, completed: !a.completed } : a));
  };

  return (
    <AppContext.Provider
      value={{
        user, setUser, settings, updateSettings, isAuthenticated: !!user,
        login, logout, signup, users, addUser, removeUser,
        exercises, medicines, addExercise, removeExercise, toggleExercise,
        addMedicine, removeMedicine, toggleMedicine, updateUser,
        messages, sendMessage, activeCall, startCall, endCall,
        incomingCall, answerCall, rejectCall,
        activities, addActivity, removeActivity, toggleActivityStatus
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
