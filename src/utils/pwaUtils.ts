
// PWA utility functions
export const registerServiceWorker = async (): Promise<void> => {
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js');
      console.log('Service Worker registrado com sucesso:', registration);
      
      // Check for updates
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;
        if (newWorker) {
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              // New content available, notify user
              console.log('Nova versão disponível');
            }
          });
        }
      });
    } catch (error) {
      console.error('Erro ao registrar Service Worker:', error);
    }
  }
};

export const requestNotificationPermission = async (): Promise<NotificationPermission> => {
  if ('Notification' in window) {
    const permission = await Notification.requestPermission();
    return permission;
  }
  return 'denied';
};

export const sendNotification = (title: string, options?: NotificationOptions): void => {
  if ('Notification' in window && Notification.permission === 'granted') {
    new Notification(title, {
      icon: '/lovable-uploads/0090d326-30f0-4ea6-aeb6-85cbaaf4245d.png',
      badge: '/lovable-uploads/0090d326-30f0-4ea6-aeb6-85cbaaf4245d.png',
      ...options
    });
  }
};

export const isRunningStandalone = (): boolean => {
  return window.matchMedia('(display-mode: standalone)').matches ||
         (window.navigator as any).standalone ||
         document.referrer.includes('android-app://');
};

export const getInstallPromptText = (): string => {
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
  
  if (isIOS) {
    return 'Para instalar este app no seu iPhone/iPad, toque no botão de compartilhar e selecione "Adicionar à Tela de Início".';
  }
  
  return 'Instale este app em seu dispositivo para uma melhor experiência!';
};

export const addToHomeScreen = (): void => {
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
  
  if (isIOS) {
    alert(getInstallPromptText());
  }
};
