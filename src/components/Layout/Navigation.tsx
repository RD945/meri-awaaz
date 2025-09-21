import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Home, Upload, FileText, Map } from 'lucide-react';

const Navigation: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { icon: Home, label: 'Home', path: '/dashboard' },
    { icon: Upload, label: 'Upload', path: '/upload' },
    { icon: FileText, label: 'My Issues', path: '/my-issues' },
    { icon: Map, label: 'Map', path: '/map' },
  ];

  // tweak these values:
  const leftInset = 10;    // px - space from container left
  const rightInset = 10;   // px - space from container right
  const bottomOffset = 8; // px - how far from viewport bottom
  const verticalPadding = 6; // px - reduces the bar height

  const activeIndex = navItems.findIndex(item => item.path === location.pathname);

  return (
    <nav
      className="fixed inset-x-0 z-[100] flex justify-center pointer-events-auto"
      style={{
        bottom: `${bottomOffset}px`,
        WebkitTapHighlightColor: 'transparent',
      }}
    >
      <div className="container mx-auto px-4">
        <div
          className="bg-card border shadow-card rounded-2xl inline-flex items-center relative overflow-hidden"
          style={{
            width: `calc(100% - ${leftInset + rightInset}px)`,
            marginLeft: `${leftInset}px`,
            marginRight: `${rightInset}px`,
            paddingTop: `${verticalPadding}px`,
            paddingBottom: `${verticalPadding}px`,
            paddingLeft: '8px',
            paddingRight: '8px',
            justifyContent: 'center',
          }}
        >
          {/* Sliding background indicator */}
          <div
            className="absolute bg-primary rounded-lg transition-all duration-300 ease-in-out"
            style={{
              width: `calc((100% - 16px) / ${navItems.length} - 4px)`, // Accounts for container padding and gaps
              height: `calc(100% - ${verticalPadding * 2 + 8}px)`, 
              top: `${verticalPadding + 4}px`,
              left: `calc(8px + ${activeIndex} * ((100% - 16px) / ${navItems.length}) + 2px)`,
              zIndex: 1,
            }}
          />
          
          <div className="flex w-full relative z-10 gap-1">
            {navItems.map((item, index) => {
              const isActive = location.pathname === item.path;
              const Icon = item.icon;
              
              return (
                <Button
                  key={item.path}
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate(item.path)}
                  className={`flex flex-col items-center space-y-1 h-auto py-2 px-1 transition-all duration-200
                              ${isActive ? 'text-primary-foreground' : 'text-muted-foreground hover:text-foreground'}
                              focus:outline-none focus:ring-0 focus-visible:ring-0 
                              active:!bg-transparent focus:!bg-transparent hover:!bg-transparent
                              !outline-none !ring-0 flex-1 bg-transparent justify-center`}
                  style={{
                    outline: 'none',
                    boxShadow: 'none',
                    backgroundColor: 'transparent !important',
                  }}
                  onMouseDown={(e) => e.preventDefault()}
                >
                  <Icon
                    className={`h-5 w-5 ${isActive ? 'scale-110' : ''} transition-all duration-200`}
                  />
                  <span className="text-xs font-medium truncate">{item.label}</span>
                </Button>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;