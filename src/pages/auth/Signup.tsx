import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp, UserRole } from '@/contexts/AppContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Bot,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Loader2,
  ArrowLeft,
  ArrowRight,
  User,
  Phone,
  Calendar,
  Heart,
  Shield,
  Users,
  Camera,
  Upload,
} from 'lucide-react';

type Step = 'role' | 'basic' | 'details' | 'medical' | 'profile';

const roles = [
  {
    value: 'elder' as UserRole,
    icon: Heart,
    title: 'Elder',
    description: 'I am looking for health assistance and care support',
  },
  {
    value: 'caregiver' as UserRole,
    icon: Shield,
    title: 'Caregiver',
    description: 'I provide care and support to elders',
  },
];

const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

export default function Signup() {
  const navigate = useNavigate();
  const { signup } = useApp();
  const { toast } = useToast();

  const [step, setStep] = useState<Step>('role');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Form data
  const [formData, setFormData] = useState({
    role: null as UserRole,
    name: '',
    email: '',
    password: '',
    phone: '',
    age: '',
    gender: '',
    bloodGroup: '',
    allergies: '',
    conditions: '',
    emergencyName: '',
    emergencyPhone: '',
    emergencyRelation: '',
    profilePic: '',
  });

  const updateForm = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleRoleSelect = (role: UserRole) => {
    setFormData(prev => ({ ...prev, role }));
    setStep('basic');
  };

  const handleNext = () => {
    const steps: Step[] = ['role', 'basic', 'details', 'medical', 'profile'];
    const currentIndex = steps.indexOf(step);

    // Validation
    if (step === 'basic') {
      if (!formData.name || !formData.email || !formData.password) {
        toast({
          title: 'Missing Information',
          description: 'Please fill in all required fields.',
          variant: 'destructive',
        });
        return;
      }
    }

    if (currentIndex < steps.length - 1) {
      // Skip medical step for non-elders
      if (step === 'details' && formData.role !== 'elder') {
        setStep('profile');
      } else {
        setStep(steps[currentIndex + 1]);
      }
    }
  };

  const handleBack = () => {
    const steps: Step[] = ['role', 'basic', 'details', 'medical', 'profile'];
    const currentIndex = steps.indexOf(step);

    if (currentIndex > 0) {
      // Skip medical step for non-elders when going back
      if (step === 'profile' && formData.role !== 'elder') {
        setStep('details');
      } else {
        setStep(steps[currentIndex - 1]);
      }
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const success = await signup({
        name: formData.name,
        email: formData.email,
        role: formData.role,
        phone: formData.phone || undefined,
        age: formData.age ? parseInt(formData.age) : undefined,
        gender: formData.gender ? (formData.gender as any) : undefined,
        bloodGroup: formData.bloodGroup || undefined,
        profilePic: formData.profilePic || undefined,
        emergencyContacts: formData.emergencyName ? [{
          name: formData.emergencyName,
          phone: formData.emergencyPhone,
          relation: formData.emergencyRelation,
        }] : undefined,
      }, formData.password);

      if (success) {
        toast({
          title: 'Account Created!',
          description: 'Welcome to Aayu AI. Your health journey begins now.',
        });

        // Redirect based on role
        if (formData.role === 'caregiver') {
          navigate('/caregiver');
        } else if (formData.role === 'organization') {
          navigate('/organization');
        } else {
          navigate('/elder');
        }
      }
    } catch (error) {
      toast({
        title: 'Registration Failed',
        description: 'Something went wrong. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updateForm('profilePic', reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 'role':
        return (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <h2 className="text-xl font-semibold">Choose Your Role</h2>
              <p className="text-muted-foreground">Select how you'll be using Aayu AI</p>
            </div>

            <div className="grid gap-4">
              {roles.map((role) => (
                <button
                  key={role.value}
                  onClick={() => handleRoleSelect(role.value)}
                  className={`flex items-center gap-4 p-4 rounded-xl border-2 text-left transition-all hover:border-primary hover:bg-primary/5 ${formData.role === role.value ? 'border-primary bg-primary/5' : 'border-border'
                    }`}
                >
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <role.icon className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{role.title}</h3>
                    <p className="text-sm text-muted-foreground">{role.description}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        );

      case 'basic':
        return (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <h2 className="text-xl font-semibold">Basic Information</h2>
              <p className="text-muted-foreground">Tell us about yourself</p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name *</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="name"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={(e) => updateForm('name', e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address *</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="your.email@example.com"
                    value={formData.email}
                    onChange={(e) => updateForm('email', e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password *</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Create a strong password"
                    value={formData.password}
                    onChange={(e) => updateForm('password', e.target.value)}
                    className="pl-10 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
            </div>
          </div>
        );

      case 'details':
        return (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <h2 className="text-xl font-semibold">Personal Details</h2>
              <p className="text-muted-foreground">Help us personalize your experience</p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="phone"
                    placeholder="+91 98765 43210"
                    value={formData.phone}
                    onChange={(e) => updateForm('phone', e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="age">Age</Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      id="age"
                      type="number"
                      placeholder="65"
                      value={formData.age}
                      onChange={(e) => updateForm('age', e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="gender">Gender</Label>
                  <Select value={formData.gender} onValueChange={(v) => updateForm('gender', v)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {formData.role === 'elder' && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="bloodGroup">Blood Group</Label>
                    <Select value={formData.bloodGroup} onValueChange={(v) => updateForm('bloodGroup', v)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select blood group" />
                      </SelectTrigger>
                      <SelectContent>
                        {bloodGroups.map((bg) => (
                          <SelectItem key={bg} value={bg}>{bg}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="pt-4 border-t">
                    <h3 className="font-medium mb-3">Emergency Contact</h3>
                    <div className="space-y-3">
                      <Input
                        placeholder="Contact Name"
                        value={formData.emergencyName}
                        onChange={(e) => updateForm('emergencyName', e.target.value)}
                      />
                      <Input
                        placeholder="Contact Phone"
                        value={formData.emergencyPhone}
                        onChange={(e) => updateForm('emergencyPhone', e.target.value)}
                      />
                      <Input
                        placeholder="Relation (e.g., Son, Daughter)"
                        value={formData.emergencyRelation}
                        onChange={(e) => updateForm('emergencyRelation', e.target.value)}
                      />
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        );

      case 'medical':
        return (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <h2 className="text-xl font-semibold">Medical Information</h2>
              <p className="text-muted-foreground">This helps Aayu AI assist you better</p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="allergies">Known Allergies</Label>
                <Input
                  id="allergies"
                  placeholder="e.g., Penicillin, Peanuts"
                  value={formData.allergies}
                  onChange={(e) => updateForm('allergies', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="conditions">Medical Conditions</Label>
                <Input
                  id="conditions"
                  placeholder="e.g., Diabetes, Hypertension"
                  value={formData.conditions}
                  onChange={(e) => updateForm('conditions', e.target.value)}
                />
              </div>

              <p className="text-sm text-muted-foreground">
                You can add more detailed medical information later from the app.
              </p>
            </div>
          </div>
        );

      case 'profile':
        return (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <h2 className="text-xl font-semibold">Profile Picture</h2>
              <p className="text-muted-foreground">Add a photo to personalize your account</p>
            </div>

            <div className="flex flex-col items-center gap-4">
              <Avatar className="w-32 h-32 border-4 border-primary/20">
                <AvatarImage src={formData.profilePic} />
                <AvatarFallback className="bg-primary/10 text-primary text-3xl">
                  {formData.name?.charAt(0) || 'U'}
                </AvatarFallback>
              </Avatar>

              <label className="cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-muted hover:bg-muted/80 transition-colors">
                  <Camera className="w-5 h-5" />
                  <span>Upload Photo</span>
                </div>
              </label>

              <p className="text-sm text-muted-foreground text-center">
                You can skip this step and add a photo later
              </p>
            </div>
          </div>
        );
    }
  };

  const getProgress = () => {
    const steps: Step[] = ['role', 'basic', 'details', 'medical', 'profile'];
    const totalSteps = formData.role === 'elder' ? 5 : 4;
    const currentIndex = steps.indexOf(step) + 1;
    return (currentIndex / totalSteps) * 100;
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="p-4">
        <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md animate-fade-in">
          {/* Logo */}
          <div className="text-center mb-8">
            <img src="/logo.png" alt="Aayu AI" className="w-16 h-16 rounded-2xl object-cover mx-auto mb-4" />
            <h1 className="text-2xl font-bold">Join Aayu AI</h1>
            <p className="text-muted-foreground">Create your account to get started</p>
          </div>

          {/* Progress Bar */}
          {step !== 'role' && (
            <div className="mb-6">
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-primary transition-all duration-500"
                  style={{ width: `${getProgress()}%` }}
                />
              </div>
            </div>
          )}

          <Card variant="elevated">
            <CardContent className="p-6">
              {renderStep()}

              {/* Navigation Buttons */}
              <div className="flex gap-3 mt-6">
                {step !== 'role' && (
                  <Button
                    variant="outline"
                    onClick={handleBack}
                    className="flex-1"
                    disabled={isLoading}
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back
                  </Button>
                )}

                {step !== 'role' && step !== 'profile' && (
                  <Button
                    variant="hero"
                    onClick={handleNext}
                    className="flex-1"
                  >
                    Continue
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                )}

                {step === 'profile' && (
                  <Button
                    variant="hero"
                    onClick={handleSubmit}
                    className="flex-1"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Creating Account...
                      </>
                    ) : (
                      'Complete Registration'
                    )}
                  </Button>
                )}
              </div>

              {step === 'role' && (
                <div className="mt-6 text-center">
                  <p className="text-muted-foreground">
                    Already have an account?{' '}
                    <Link to="/login" className="text-primary font-medium hover:underline">
                      Sign in
                    </Link>
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
