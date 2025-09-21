import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { Bell, User, Menu, X, LogOut, Settings, Award } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';

interface HeaderProps {
  onMenuClick?: () => void;
  title?: string;
}

const Header: React.FC<HeaderProps> = ({ onMenuClick, title = "Meri Awaaz" }) => {
  const navigate = useNavigate();
  const { user, isGuest, signOut } = useAuth();
  const [notifications, setNotifications] = useState<Array<{id: number, title: string, message: string, time: string, issueId?: string}>>([]);

  const removeNotification = (id: number) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  };

  const handleNotificationClick = (notification: {id: number, title: string, message: string, time: string, issueId?: string}) => {
    // Navigate to relevant page based on notification type
    if (notification.issueId) {
      navigate('/my-issues');
    } else {
      navigate('/dashboard');
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-card shadow-card transition-smooth">
      <div className="px-3 sm:px-4 h-16 flex items-center justify-between max-w-sm sm:max-w-lg lg:max-w-4xl mx-auto w-full">
          <div className="flex items-center space-x-3">
          {onMenuClick && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onMenuClick}
              className="md:hidden"
            >
              <Menu className="h-5 w-5" />
            </Button>
          )}
          <div className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">🇮🇳</span>
            </div>
            <div>
              <h1 className="text-lg font-bold text-gradient">{title}</h1>
              <p className="text-xs text-muted-foreground hidden sm:block">
                Government of India
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                {notifications.length > 0 && (
                  <span className="absolute -top-1 -right-1 h-4 w-4 bg-destructive text-destructive-foreground text-xs rounded-full flex items-center justify-center">
                    {notifications.length}
                  </span>
                )}
              </Button>
            </DropdownMenuTrigger>
            {/* --- CLEANED UP THIS SECTION --- */}
            <DropdownMenuContent 
              className="w-80 p-0 bg-white/80 border border-white/30 shadow-2xl" 
              align="end"
              style={{
                backdropFilter: 'blur(20px) saturate(180%)',
                WebkitBackdropFilter: 'blur(20px) saturate(180%)',
              }}
            >
              <div className="p-4 border-b border-white/30">
                <h3 className="font-semibold">Notifications</h3>
              </div>
              <div className="h-[70vh] overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-muted-foreground">
                    <Bell className="h-12 w-12 mb-3 opacity-30" />
                    <p className="text-sm">No new notifications</p>
                    <p className="text-xs mt-1">You're all caught up!</p>
                  </div>
                ) : (
                  notifications.map((notification) => (
                    <div 
                      key={notification.id} 
                      className="group relative flex items-start p-4 border-b border-white/30 last:border-b-0 hover:bg-black/10 transition-colors cursor-pointer"
                      onClick={() => handleNotificationClick(notification)}
                    >
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm">{notification.title}</h4>
                        <p className="text-xs text-muted-foreground mt-1">{notification.message}</p>
                        <p className="text-xs text-muted-foreground mt-2">{notification.time}</p>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removeNotification(notification.id);
                        }}
                        className="absolute top-3 right-3 h-6 w-6 rounded-full flex items-center justify-center bg-transparent text-muted-foreground hover:bg-destructive hover:text-destructive-foreground opacity-0 group-hover:opacity-100 transition-all"
                        aria-label="Remove notification"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <div className="flex items-center space-x-2">
            {user && (
              <div className="hidden sm:block text-right">
                <p className="text-sm font-medium">{user.name}</p>
                <p className="text-xs text-muted-foreground">{user.points} points</p>
              </div>
            )}
            {isGuest && (
              <div className="hidden sm:block text-right">
                <p className="text-sm font-medium">Guest User</p>
                <p className="text-xs text-muted-foreground">Limited access</p>
              </div>
            )}
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <User className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent 
                className="w-48 bg-white/80 border border-white/30 shadow-2xl" 
                align="end"
                style={{
                  backdropFilter: 'blur(20px) saturate(180%)',
                  WebkitBackdropFilter: 'blur(20px) saturate(180%)',
                }}
              >
                {user && (
                  <>
                    <div className="px-3 py-2 border-b border-white/30">
                      <p className="font-medium text-sm">{user.name}</p>
                      <p className="text-xs text-muted-foreground">{user.points} points</p>
                    </div>
                    <DropdownMenuItem onClick={() => navigate('/profile')} className="cursor-pointer">
                      <User className="mr-2 h-4 w-4" />
                      Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate('/awards')} className="cursor-pointer">
                      <Award className="mr-2 h-4 w-4" />
                      Awards
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate('/settings')} className="cursor-pointer">
                      <Settings className="mr-2 h-4 w-4" />
                      Settings
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={signOut} className="cursor-pointer text-red-600">
                      <LogOut className="mr-2 h-4 w-4" />
                      Sign Out
                    </DropdownMenuItem>
                  </>
                )}
                {isGuest && (
                  <>
                    <div className="px-3 py-2 border-b border-white/30">
                      <p className="font-medium text-sm">Guest User</p>
                      <p className="text-xs text-muted-foreground">Limited access</p>
                    </div>
                    <DropdownMenuItem onClick={() => navigate('/signin')} className="cursor-pointer">
                      <User className="mr-2 h-4 w-4" />
                      Sign In
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate('/profile')} className="cursor-pointer">
                      <Settings className="mr-2 h-4 w-4" />
                      View Profile
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;