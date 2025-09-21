import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { Bell, User, Menu, X } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface HeaderProps {
  onMenuClick?: () => void;
  title?: string;
}

const Header: React.FC<HeaderProps> = ({ onMenuClick, title = "Meri Awaaz" }) => {
  const { user, isGuest } = useAuth();
  const [notifications, setNotifications] = useState([
    { id: 1, title: 'Issue Updated', message: 'Your pothole report has been reviewed', time: '2 min ago' },
    { id: 2, title: 'New Response', message: 'Authority responded to your water issue', time: '1 hour ago' },
    { id: 3, title: 'Issue Resolved', message: 'Streetlight issue has been fixed', time: '3 hours ago' },
  ]);

  const removeNotification = (id: number) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-card shadow-card transition-smooth">
      <div className="container flex h-16 items-center justify-between px-4">
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
              <div className="max-h-80 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="p-4 text-center text-muted-foreground">
                    No new notifications
                  </div>
                ) : (
                  notifications.map((notification) => (
                    <div key={notification.id} className="group relative flex items-start p-4 border-b border-white/30 last:border-b-0 hover:bg-black/10 transition-colors">
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
            <Button variant="ghost" size="icon">
              <User className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;