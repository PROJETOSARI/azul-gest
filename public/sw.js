
const CACHE_NAME = 'azul-gest-v1';
const urlsToCache = [
  '/',
  '/static/js/bundle.js',
  '/static/css/main.css',
  '/dashboard',
  '/lovable-uploads/0090d326-30f0-4ea6-aeb6-85cbaaf4245d.png'
];

// Install event
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Cache opened');
        return cache.addAll(urlsToCache);
      })
  );
});

// Fetch event
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Return cached version or fetch from network
        if (response) {
          return response;
        }
        return fetch(event.request);
      }
    )
  );
});

// Activate event
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Push notification event
self.addEventListener('push', (event) => {
  const options = {
    body: event.data ? event.data.text() : 'Nova notificação do Azul Gest',
    icon: '/lovable-uploads/0090d326-30f0-4ea6-aeb6-85cbaaf4245d.png',
    badge: '/lovable-uploads/0090d326-30f0-4ea6-aeb6-85cbaaf4245d.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: 'Abrir App',
        icon: '/lovable-uploads/0090d326-30f0-4ea6-aeb6-85cbaaf4245d.png'
      },
      {
        action: 'close',
        title: 'Fechar',
        icon: '/lovable-uploads/0090d326-30f0-4ea6-aeb6-85cbaaf4245d.png'
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification('Azul Gest', options)
  );
});

// Notification click event
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});
