import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useApp } from '@/contexts/AppContext';
import { useTranslation } from '@/lib/translations';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Home,
  Bot,
  Pill,
  TreePine,
  FileText,
  AlertTriangle,
  Users,
  Dumbbell,
  Settings,
  LogOut,
  User,
  Menu,
  Sun,
  Moon,
  Phone,
} from 'lucide-react';

export function ElderLayout({ children }: { children: React.ReactNode }) {
  const { user, logout, settings, updateSettings } = useApp();
  const t = useTranslation(settings.language);
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navItems = [
    { icon: Home, label: t.dashboard, path: '/elder' },
    { icon: Bot, label: t.assistant, path: '/elder/assistant' },
    { icon: Pill, label: t.medicines, path: '/elder/medicines' },
    { icon: TreePine, label: t.virtualGarden, path: '/elder/garden' },
    { icon: FileText, label: t.healthReports, path: '/elder/reports' },
    { icon: AlertTriangle, label: t.emergency, path: '/elder/emergency' },
    { icon: Users, label: t.caregivers, path: '/elder/caregivers' },
    { icon: Dumbbell, label: t.exercise, path: '/elder/exercise' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const toggleTheme = () => {
    updateSettings({ theme: settings.theme === 'light' ? 'dark' : 'light' });
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-foreground/20 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:sticky lg:top-0 lg:h-screen inset-y-0 left-0 z-50 w-72 bg-sidebar border-r border-sidebar-border transform transition-transform duration-300 lg:transform-none ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
          }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-sidebar-border">
            <Link to="/elder" className="flex items-center gap-3">
              <img src="/logo.png" alt="Aayu AI" className="w-10 h-10 rounded-xl object-cover" />
              <span className="text-xl font-bold text-sidebar-foreground">{t.appName}</span>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${isActive
                    ? 'bg-sidebar-primary text-sidebar-primary-foreground shadow-md'
                    : 'text-sidebar-foreground hover:bg-sidebar-accent'
                    }`}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* User Profile */}
          <div className="p-4 border-t border-sidebar-border">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-sidebar-accent transition-colors">
                  <Avatar className="w-10 h-10">
                    <AvatarImage src={user?.profilePic} alt={user?.name} />
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {user?.name?.charAt(0) || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 text-left">
                    <p className="font-medium text-sidebar-foreground">{user?.name}</p>
                    <p className="text-sm text-muted-foreground capitalize">{user?.role}</p>
                  </div>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>{t.myAccount}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate('/elder/settings')}>
                  <Settings className="w-4 h-4 mr-2" />
                  {t.settings}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={toggleTheme}>
                  {settings.theme === 'light' ? (
                    <Moon className="w-4 h-4 mr-2" />
                  ) : (
                    <Sun className="w-4 h-4 mr-2" />
                  )}
                  {settings.theme === 'light' ? t.darkMode : t.lightMode}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-danger">
                  <LogOut className="w-4 h-4 mr-2" />
                  {t.logout}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Top Header */}
        <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-md border-b border-border px-4 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-xl hover:bg-muted"
            >
              <Menu className="w-6 h-6" />
            </button>

            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleTheme}
                className="hidden lg:flex"
              >
                {settings.theme === 'light' ? (
                  <Moon className="w-5 h-5" />
                ) : (
                  <Sun className="w-5 h-5" />
                )}
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/elder/caregivers')}
                className="hidden sm:flex"
              >
                <Phone className="w-4 h-4 mr-2" />
                {t.callCaregiver}
              </Button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 lg:p-8">{children}</main>

        {/* SOS Floating Button */}
        <Link
          to="/elder/emergency"
          className="fixed bottom-6 right-6 z-50 shadow-xl"
        >
          <Button variant="sos" size="icon-xl" className="rounded-full w-16 h-16 animate-pulse hover:animate-none">
            <AlertTriangle className="w-8 h-8" />
          </Button>
        </Link>
      </div>
    </div>
  );
}
