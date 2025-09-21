import React from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { Bell, User, Menu } from 'lucide-react';

interface HeaderProps {
  onMenuClick?: () => void;
  title?: string;
}

const Header: React.FC<HeaderProps> = ({ onMenuClick, title = "Meri Awaaz" }) => {
  const { user, isGuest } = useAuth();

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
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 h-4 w-4 bg-destructive text-destructive-foreground text-xs rounded-full flex items-center justify-center">
              3
            </span>
          </Button>
          
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