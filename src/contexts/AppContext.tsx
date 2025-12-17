import React, { createContext, useContext, useState, useEffect, ReactNode, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';
import { io, Socket } from 'socket.io-client';

const getBaseUrl = () => {
  // Use environment variable for API URL, or empty string for same-origin requests
  return import.meta.env.VITE_API_URL || '';
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
  assignedCaregiverId?: string;
  status?: 'active' | 'pending';
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
  videoLink?: string;
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

export interface Report {
  id: string;
  userId: string; // The elder who sent it
  issue: string;
  painLevel: number;
  description: string;
  date: string;
  status: 'sent' | 'delivered' | 'seen';
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
  updateMedicine: (id: string, updatedData: Medicine) => void;

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

  reports: Report[];
  addReport: (report: Report) => void;
  markReportAsSeen: (id: string) => void;

  socketRef: React.MutableRefObject<any>; // Using any for simplicity with Socket.IO type handling in React context

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
  const [reports, setReports] = useState<Report[]>([]);

  const [messages, setMessages] = useState<Message[]>([]);
  const [activeCall, setActiveCall] = useState<Call | null>(null);
  const [incomingCall, setIncomingCall] = useState<{ callId: string, callerId: string, callerName: string, signal: any, type: 'voice' | 'video' } | null>(null);
  const { toast } = useToast();

  const socketRef = useRef<Socket | null>(null);

  // Initialize Data & Socket
  useEffect(() => {
    // Connect Socket with better configuration
    console.log('🔌 Connecting to Socket.IO server at:', BASE_URL);

    // Railway supports WebSockets natively, so we prioritize 'websocket'
    socketRef.current = io(BASE_URL, {
      path: '/socket.io',
      transports: ['websocket', 'polling'], // Prioritize websocket
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
      timeout: 20000,
      autoConnect: true,
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

    // --- Data Sync Listener ---
    socketRef.current.on('sync_data', (data: any) => {
      console.log('🔄 Received Sync Data:', data.type, data.action);

      const updateState = (setter: React.Dispatch<React.SetStateAction<any[]>>) => {
        setter(prev => {
          if (data.action === 'add') {
            return prev.some(i => i.id === data.item.id) ? prev : [...prev, data.item];
          }
          if (data.action === 'update') {
            return prev.map(i => i.id === data.item.id ? data.item : i);
          }
          if (data.action === 'delete') {
            return prev.filter(i => i.id !== data.itemId);
          }
          return prev;
        });
      };

      if (data.type === 'exercise') updateState(setExercises);
      if (data.type === 'medicine') updateState(setMedicines);
      if (data.type === 'activity') updateState(setActivities);
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
      const [usersRes, exercisesRes, medicinesRes, activitiesRes, reportsRes] = await Promise.all([
        fetch(`${API_URL}/users`),
        fetch(`${API_URL}/care/exercises`),
        fetch(`${API_URL}/care/medicines`),
        fetch(`${API_URL}/care/activities`),
        fetch(`${API_URL}/care/reports`)
      ]);

      if (usersRes.ok) setUsers(await usersRes.json());
      if (exercisesRes.ok) setExercises(await exercisesRes.json());
      if (medicinesRes.ok) setMedicines(await medicinesRes.json());
      if (activitiesRes.ok) setActivities(await activitiesRes.json());
      if (reportsRes.ok) setReports(await reportsRes.json());

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

  // --- Medicine Compliance Monitor ---
  const [alertedMedicines, setAlertedMedicines] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!user || user.role !== 'elder') return;

    const checkMedicines = () => {
      const now = new Date();
      const currentMinutes = now.getHours() * 60 + now.getMinutes();
      const myMedicines = medicines.filter(m => m.userId === user.id);

      myMedicines.forEach(med => {
        // Parse time "HH:MM AM/PM"
        const [timePart, period] = med.time.split(' ');
        let [hours, minutes] = timePart.split(':').map(Number);

        if (period === 'PM' && hours !== 12) hours += 12;
        if (period === 'AM' && hours === 12) hours = 0;

        const medMinutes = hours * 60 + minutes;

        // Check instance: If med time is passed by > 15 mins and not taken
        // And we haven't alerted for this specific medicine TODAY
        const minutesDiff = currentMinutes - medMinutes;

        // Simple check: alert if 1 minute past due (for demo) up to 60 mins past
        if (minutesDiff > 1 && minutesDiff < 60 && !med.taken && !alertedMedicines.has(med.id)) {

          console.log(`🚨 Alerting for medicine: ${med.name}`);

          // 1. Send Report
          const report: Report = {
            id: crypto.randomUUID(),
            userId: user.id,
            issue: 'Missed Medicine',
            painLevel: 0,
            description: `Alert: ${user.name} missed their scheduled medicine: ${med.name} at ${med.time}.`,
            date: new Date().toLocaleString(),
            status: 'sent'
          };
          addReport(report);

          // 2. Emit Socket Alert
          socketRef.current?.emit('medicine_alert', {
            elderId: user.id,
            elderName: user.name,
            medicineName: med.name,
            time: med.time
          });

          // 3. Mark as alerted locally
          setAlertedMedicines(prev => new Set(prev).add(med.id));
        }
      });
    };

    const interval = setInterval(checkMedicines, 30000); // Check every 30s
    return () => clearInterval(interval);
  }, [user, medicines, alertedMedicines]);

  // Listen for alerts (Caregiver Side)
  useEffect(() => {
    if (socketRef.current) {
      socketRef.current.on('receive_medicine_alert', (data: any) => {
        // Only show if I am a caregiver
        if (user?.role === 'caregiver') {
          toast({
            title: '🚨 Medicine Missed!',
            description: `${data.elderName} missed ${data.medicineName} at ${data.time}`,
            variant: 'destructive',
            duration: 10000,
          });
          // Also play a sound if possible (omitted for strictness)
        }
      });

      // SOS Alert Listener
      socketRef.current.on('sos_alert', (data: any) => {
        console.log('🚨 Received SOS Alert:', data);
        if (user?.role === 'caregiver') {
          // Play Alarm Sound
          const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
          if (AudioContext) {
            const audioCtx = new AudioContext();
            const oscillator = audioCtx.createOscillator();
            const gainNode = audioCtx.createGain();

            oscillator.type = 'sawtooth'; // Aggressive alarm sound
            oscillator.frequency.setValueAtTime(440, audioCtx.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.5);
            oscillator.frequency.exponentialRampToValueAtTime(440, audioCtx.currentTime + 1.0);

            gainNode.gain.setValueAtTime(0.5, audioCtx.currentTime);

            oscillator.connect(gainNode);
            gainNode.connect(audioCtx.destination);

            oscillator.start();
            oscillator.stop(audioCtx.currentTime + 3); // Play for 3 seconds
          }

          toast({
            title: '🚨 SOS EMERGENCY!',
            description: `${data.name} triggered SOS at ${data.time}. Location: ${data.location}`,
            variant: 'destructive',
            duration: 20000,
          });
        }
      });
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
      socketRef.current?.emit('sync_data', { type: 'exercise', action: 'add', item: data, targetUserId: data.userId });
      toast({ title: 'Plan Updated', description: 'New exercise added.' });
    }
  };

  const removeExercise = async (id: string) => {
    await fetch(`${API_URL}/care/exercises/${id}`, { method: 'DELETE' });
    const ex = exercises.find(e => e.id === id); // Find to know userId
    setExercises(prev => prev.filter(e => e.id !== id));
    if (ex) socketRef.current?.emit('sync_data', { type: 'exercise', action: 'delete', itemId: id, targetUserId: ex.userId });
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
    socketRef.current?.emit('sync_data', { type: 'exercise', action: 'update', item: updated, targetUserId: updated.userId });
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
      socketRef.current?.emit('sync_data', { type: 'medicine', action: 'add', item: data, targetUserId: data.userId });
      toast({ title: 'Medicine Added', description: 'New medicine tracked.' });
    }
  };

  const removeMedicine = async (id: string) => {
    await fetch(`${API_URL}/care/medicines/${id}`, { method: 'DELETE' });
    const med = medicines.find(m => m.id === id);
    setMedicines(prev => prev.filter(m => m.id !== id));
    if (med) socketRef.current?.emit('sync_data', { type: 'medicine', action: 'delete', itemId: id, targetUserId: med.userId });
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
    socketRef.current?.emit('sync_data', { type: 'medicine', action: 'update', item: updated, targetUserId: updated.userId });
  };

  const updateMedicine = async (id: string, updatedData: Medicine) => {
    setMedicines(prev => prev.map(m => m.id === id ? updatedData : m));
    await fetch(`${API_URL}/care/medicines/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedData)
    });
    socketRef.current?.emit('sync_data', { type: 'medicine', action: 'update', item: updatedData, targetUserId: updatedData.userId });
    toast({ title: 'Medicine Updated', description: 'Changes saved successfully.' });
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
  const addActivity = async (activity: Activity) => {
    const res = await fetch(`${API_URL}/care/activities`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(activity)
    });
    if (res.ok) {
      const data = await res.json();
      setActivities(prev => [...prev, data]);
      socketRef.current?.emit('sync_data', { type: 'activity', action: 'add', item: data, targetUserId: data.userId });
      toast({ title: 'Activity Added', description: 'New task scheduled.' });
    }
  };

  const removeActivity = async (id: string) => {
    await fetch(`${API_URL}/care/activities/${id}`, { method: 'DELETE' });
    const act = activities.find(a => a.id === id);
    setActivities(prev => prev.filter(a => a.id !== id));
    if (act) socketRef.current?.emit('sync_data', { type: 'activity', action: 'delete', itemId: id, targetUserId: act.userId });
  };

  const toggleActivityStatus = async (id: string) => {
    const act = activities.find(a => a.id === id);
    if (!act) return;
    const updated = { ...act, completed: !act.completed };

    setActivities(prev => prev.map(a => a.id === id ? updated : a));
    await fetch(`${API_URL}/care/activities/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updated)
    });
    socketRef.current?.emit('sync_data', { type: 'activity', action: 'update', item: updated, targetUserId: updated.userId });
  };

  // --- Report Management ---
  const addReport = async (report: Report) => {
    const res = await fetch(`${API_URL}/care/reports`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(report)
    });
    if (res.ok) {
      const data = await res.json();
      setReports(prev => [data, ...prev]);
      toast({ title: 'Report Sent', description: 'Caregiver notified.' });
    }
  };

  const markReportAsSeen = async (id: string) => {
    const report = reports.find(r => r.id === id);
    if (!report) return;
    const updated: Report = { ...report, status: 'seen' as const };

    setReports(prev => prev.map(r => r.id === id ? updated : r));
    await fetch(`${API_URL}/care/reports/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updated)
    });
  };


  return (
    <AppContext.Provider
      value={{
        user, setUser, settings, updateSettings, isAuthenticated: !!user,
        login, logout, signup, users, addUser, removeUser,
        exercises, medicines, addExercise, removeExercise, toggleExercise,
        addMedicine, removeMedicine, toggleMedicine, updateMedicine, updateUser,
        messages, sendMessage, activeCall, startCall, endCall,
        incomingCall, answerCall, rejectCall,
        activities, addActivity, removeActivity, toggleActivityStatus,
        reports, addReport, markReportAsSeen,
        socketRef

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
