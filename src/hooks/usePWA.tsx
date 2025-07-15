
import { useState, useEffect } from 'react';

interface PWAHook {
  isInstalled: boolean;
  isInstallable: boolean;
  installPrompt: (() => Promise<void>) | null;
  isOffline: boolean;
}

export const usePWA = (): PWAHook => {
  const [isInstalled, setIsInstalled] = useState(false);
  const [isInstallable, setIsInstallable] = useState(false);
  const [installPrompt, setInstallPrompt] = useState<(() => Promise<void>) | null>(null);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  useEffect(() => {
    // Check if app is installed
    const checkInstalled = () => {
      const standalone = window.matchMedia('(display-mode: standalone)').matches;
      const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && (window as any).navigator.standalone;
      setIsInstalled(standalone || iOS);
    };

    checkInstalled();

    // Listen for install prompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setIsInstallable(true);
      
      const promptInstall = async () => {
        const event = e as any;
        if (event.prompt) {
          event.prompt();
          const { outcome } = await event.userChoice;
          if (outcome === 'accepted') {
            setIsInstalled(true);
            setIsInstallable(false);
          }
        }
      };
      
      setInstallPrompt(() => promptInstall);
    };

    // Listen for app installed event
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setIsInstallable(false);
    };

    // Listen for online/offline events
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return {
    isInstalled,
    isInstallable,
    installPrompt,
    isOffline
  };
};
