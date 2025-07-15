
const CACHE_NAME = 'azul-gest-v1';
const urlsToCache = [
  '/',
  '/static/js/bundle.js',
  '/static/css/main.css',
  '/dashboard',
  '/lovable-uploads/548e9647-6dbb-4efd-85de-1f3c66260f57.png',
  '/lovable-uploads/9c4a204d-1c51-4b2f-906b-3c317974f925.png'
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
    icon: '/lovable-uploads/548e9647-6dbb-4efd-85de-1f3c66260f57.png',
    badge: '/lovable-uploads/9c4a204d-1c51-4b2f-906b-3c317974f925.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: 'Abrir App',
        icon: '/lovable-uploads/9c4a204d-1c51-4b2f-906b-3c317974f925.png'
      },
      {
        action: 'close',
        title: 'Fechar',
        icon: '/lovable-uploads/9c4a204d-1c51-4b2f-906b-3c317974f925.png'
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
