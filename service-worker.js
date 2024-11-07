// Give the service worker access to Firebase Messaging.
// Note that you can only use Firebase Messaging here. Other Firebase libraries
// are not available in the service worker.
importScripts("https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js");
importScripts(
  "https://www.gstatic.com/firebasejs/8.10.1/firebase-messaging.js"
);

const cacheName = 'cv-cache-v1';
const cacheAssets = [
    '/',
    '/index.html',
    '/style.css',
    '/script.js',
    '/manifest.json'
];

// Install event
self.addEventListener('install', e => {
    e.waitUntil(
        caches.open(cacheName)
            .then(cache => {
                console.log('Caching files');
                cache.addAll(cacheAssets);
            })
            .then(() => self.skipWaiting())
    );
});

// Activate event
self.addEventListener('activate', e => {
    e.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cache => {
                    if (cache !== cacheName) {
                        console.log('Clearing old cache');
                        return caches.delete(cache);
                    }
                })
            );
        })
    );
});

// Fetch event
self.addEventListener('fetch', e => {
    e.respondWith(
        fetch(e.request).catch(() => caches.match(e.request))
    );
});


// Initialize the Firebase app in the service worker by passing in
// your app's Firebase config object.
// https://firebase.google.com/docs/web/setup#config-object
firebase.initializeApp({
    apiKey: "AIzaSyBw8JOxP60nS2IiecizejPHsysl162ls18",
    authDomain: "cvrizka-d2cac.firebaseapp.com",
    projectId: "cvrizka-d2cac",
    storageBucket: "cvrizka-d2cac.firebasestorage.app",
    messagingSenderId: "950329874155",
    appId: "1:950329874155:web:e83dcecc5d149b1e0e10ae",
    measurementId: "G-1CSN1LQTR5"
  });
  
  // Retrieve an instance of Firebase Messaging so that it can handle background
  // messages.
  const messaging = firebase.messaging();
  
  messaging.onBackgroundMessage((payload) => {
    console.log(
      "[firebase-messaging-sw.js] Received background message ",
      payload
    );
    // Customize notification here
    const notificationTitle = "Website Portofolio";
    const notificationOptions = {
      body: "Website Cv Rizka Yuniarti telah di aktifkan",
      icon: "/foto/jaemin.jpg",
    };
  
    self.registration.showNotification(notificationTitle, notificationOptions);
  });
