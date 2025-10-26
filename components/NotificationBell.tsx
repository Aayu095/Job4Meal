'use client';

import { Bell } from 'lucide-react';
import { useState } from 'react';

interface NotificationBellProps {
  count?: number;
  animated?: boolean;
}

export default function NotificationBell({ count = 0, animated = true }: NotificationBellProps) {
  const [isRinging, setIsRinging] = useState(false);

  const handleClick = () => {
    if (animated) {
      setIsRinging(true);
      setTimeout(() => setIsRinging(false), 500);
    }
  };

  return (
    <button
      onClick={handleClick}
      className="relative p-2 hover:bg-neutral-100 rounded-full transition-colors"
      aria-label="Notifications"
    >
      <Bell
        className={`w-6 h-6 text-neutral-700 ${
          isRinging ? 'animate-bell-ring' : ''
        }`}
      />
      {count > 0 && (
        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
          {count > 9 ? '9+' : count}
        </span>
      )}
      
      <style jsx>{`
        @keyframes bell-ring {
          0%, 100% { transform: rotate(0deg); }
          10%, 30%, 50%, 70%, 90% { transform: rotate(-10deg); }
          20%, 40%, 60%, 80% { transform: rotate(10deg); }
        }
        
        .animate-bell-ring {
          animation: bell-ring 0.5s ease-in-out;
        }
      `}</style>
    </button>
  );
}
