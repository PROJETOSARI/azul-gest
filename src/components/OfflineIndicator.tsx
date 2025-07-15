
import React from 'react';
import { WifiOff, Wifi } from 'lucide-react';
import { usePWA } from '@/hooks/usePWA';

const OfflineIndicator = () => {
  const { isOffline } = usePWA();

  if (!isOffline) return null;

  return (
    <div className="fixed top-4 right-4 z-50 bg-destructive text-destructive-foreground px-3 py-2 rounded-md shadow-lg flex items-center gap-2 animate-slide-in">
      <WifiOff className="h-4 w-4" />
      <span className="text-sm font-medium">Modo Offline</span>
    </div>
  );
};

export default OfflineIndicator;
