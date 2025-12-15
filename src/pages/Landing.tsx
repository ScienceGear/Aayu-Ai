import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Bot,
  Heart,
  Shield,
  Users,
  Pill,
  Activity,
  Phone,
  TreePine,
  Sun,
  Moon,
  ChevronRight,
  Star,
  Clock,
  Brain,
  Languages,
  Accessibility,
} from 'lucide-react';
import { useApp } from '@/contexts/AppContext';

const features = [
  {
    icon: Bot,
    title: 'AI Health Assistant',
    description: 'Baymax-inspired AI companion that understands your health needs and speaks your language',
  },
  {
    icon: Pill,
    title: 'Smart Medicine Management',
    description: 'Never miss a dose with intelligent reminders and prescription scanning',
  },
  {
    icon: Activity,
    title: 'Health Monitoring',
    description: 'Track vitals, mood, and daily activities with easy-to-use interfaces',
  },
  {
    icon: Phone,
    title: 'Emergency SOS',
    description: 'One-tap emergency alerts to caregivers and family members',
  },
  {
    icon: TreePine,
    title: 'Virtual Garden',
    description: 'Relaxing therapeutic space for meditation and mindfulness',
  },
  {
    icon: Users,
    title: 'Caregiver Connect',
    description: 'Seamless communication with caregivers through video calls and chat',
  },
];

const roles = [
  {
    title: 'For Elders',
    icon: Heart,
    color: 'primary',
    description: 'Your personal health companion that speaks your language',
    features: ['AI Assistant', 'Medicine Reminders', 'Virtual Garden', 'Emergency SOS'],
  },
  {
    title: 'For Caregivers',
    icon: Shield,
    color: 'secondary',
    description: 'Monitor and support your assigned elders with ease',
    features: ['Elder Dashboard', 'Health Reports', 'Video Calls', 'Alert System'],
  },
  {
    title: 'For Organizations',
    icon: Users,
    color: 'accent',
    description: 'Manage caregivers and ensure quality care at scale',
    features: ['Admin Dashboard', 'Caregiver Approval', 'Analytics', 'SOS Monitoring'],
  },
];

const stats = [
  { value: '10+', label: 'Indian Languages' },
  { value: '24/7', label: 'AI Assistance' },
  { value: '1-Tap', label: 'Emergency SOS' },
  { value: '100%', label: 'Accessible Design' },
];

export default function Landing() {
  const { settings, updateSettings } = useApp();

  const toggleTheme = () => {
    updateSettings({ theme: settings.theme === 'light' ? 'dark' : 'light' });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center">
              <Bot className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold">Aayu AI</span>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-muted-foreground hover:text-foreground transition-colors">
              Features
            </a>
            <a href="#roles" className="text-muted-foreground hover:text-foreground transition-colors">
              For You
            </a>
            <a href="#accessibility" className="text-muted-foreground hover:text-foreground transition-colors">
              Accessibility
            </a>
          </nav>

          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={toggleTheme}>
              {settings.theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            </Button>
            <Link to="/login">
              <Button variant="outline">Login</Button>
            </Link>
            <Link to="/signup">
              <Button variant="hero">Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 lg:py-32">
        <div className="absolute inset-0 bg-gradient-hero" />
        <div className="container mx-auto px-4 relative">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-6 animate-fade-in">
              <Star className="w-4 h-4" />
              <span className="text-sm font-medium">Trusted Elder Care Platform</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fade-in stagger-1">
              Your Personal{' '}
              <span className="text-primary">AI Health Companion</span>
            </h1>
            
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto animate-fade-in stagger-2">
              Bridging the gap between elders and caregivers with intelligent health monitoring, 
              multilingual AI assistance, and compassionate care coordination.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in stagger-3">
              <Link to="/signup">
                <Button variant="hero" size="xl">
                  Start Your Journey
                  <ChevronRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Link to="/login">
                <Button variant="hero-secondary" size="xl">
                  I Already Have an Account
                </Button>
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16 animate-fade-in stagger-4">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-3xl font-bold text-primary">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/10 rounded-full blur-3xl" />
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Everything You Need for Elder Care
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Comprehensive features designed with love and care for our elders
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <Card
                key={index}
                variant="interactive"
                className={`animate-fade-in stagger-${index + 1}`}
              >
                <CardContent className="p-6">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                    <feature.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Roles Section */}
      <section id="roles" className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Designed for Everyone
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Whether you're an elder, caregiver, or organization - we have you covered
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {roles.map((role, index) => (
              <Card
                key={index}
                variant="elevated"
                className="animate-fade-in overflow-hidden"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className={`h-2 ${
                  role.color === 'primary' ? 'bg-primary' :
                  role.color === 'secondary' ? 'bg-secondary' : 'bg-accent'
                }`} />
                <CardContent className="p-6">
                  <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-4 ${
                    role.color === 'primary' ? 'bg-primary/10 text-primary' :
                    role.color === 'secondary' ? 'bg-secondary/10 text-secondary' : 'bg-accent/10 text-accent'
                  }`}>
                    <role.icon className="w-7 h-7" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{role.title}</h3>
                  <p className="text-muted-foreground mb-4">{role.description}</p>
                  <ul className="space-y-2">
                    {role.features.map((feature, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm">
                        <ChevronRight className={`w-4 h-4 ${
                          role.color === 'primary' ? 'text-primary' :
                          role.color === 'secondary' ? 'text-secondary' : 'text-accent'
                        }`} />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Accessibility Section */}
      <section id="accessibility" className="py-20 bg-gradient-hero">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Built for <span className="text-primary">Accessibility</span>
              </h2>
              <p className="text-muted-foreground mb-8">
                Every feature is designed with our elders in mind - large text options, 
                high contrast modes, voice control, and support for all major Indian languages.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <Languages className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold">10+ Indian Languages</h4>
                    <p className="text-sm text-muted-foreground">
                      Hindi, Tamil, Telugu, Bengali, Marathi, Gujarati, and more
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center shrink-0">
                    <Accessibility className="w-5 h-5 text-secondary" />
                  </div>
                  <div>
                    <h4 className="font-semibold">Elder-Friendly Interface</h4>
                    <p className="text-sm text-muted-foreground">
                      Large touch targets, adjustable text sizes, and high contrast options
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center shrink-0">
                    <Brain className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <h4 className="font-semibold">Voice-First AI</h4>
                    <p className="text-sm text-muted-foreground">
                      Speak naturally in your language - no typing required
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative">
              <Card variant="elevated" className="p-8">
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-gradient-primary flex items-center justify-center">
                      <Bot className="w-8 h-8 text-primary-foreground" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-lg">नमस्ते! मैं आयु हूँ</h4>
                      <p className="text-muted-foreground">Hello! I am Aayu</p>
                    </div>
                  </div>
                  
                  <div className="bg-muted rounded-xl p-4">
                    <p className="text-sm">
                      "आप आज कैसा महसूस कर रहे हैं? क्या मैं आपकी दवाई याद दिला दूं?"
                    </p>
                    <p className="text-xs text-muted-foreground mt-2">
                      "How are you feeling today? Should I remind you about your medicine?"
                    </p>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">बहुत अच्छा 😊</Button>
                    <Button size="sm" variant="outline">ठीक हूँ 😐</Button>
                    <Button size="sm" variant="outline">थका हुआ 😴</Button>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <Card variant="gradient" className="p-8 md:p-12 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Transform Elder Care?
            </h2>
            <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
              Join thousands of families who trust Aayu AI for their loved ones' health and wellbeing.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/signup">
                <Button variant="hero" size="xl">
                  Create Free Account
                  <ChevronRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-border">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center">
                <Bot className="w-4 h-4 text-primary-foreground" />
              </div>
              <span className="font-semibold">Aayu AI</span>
            </div>
            
            <p className="text-sm text-muted-foreground">
              © 2024 Aayu AI. Made with ❤️ for our elders in India.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
