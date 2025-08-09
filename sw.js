'use strict';

importScripts('src/js/sw-utils.js');

const STATIC_CACHE = 'static-v1';
const DYNAMIC_CACHE = 'dynamic-v1';
const IMMUTABLE_CACHE = 'immutable-v1';
const DYNAMIC_CACHE_SIZE = 50;

const APP_SHELL = [
  '/',
  'index.html',
  'src/styles/style.css',
  'src/img/favicon.ico',
  'src/img/avatars/hulk.jpg',
  'src/img/avatars/ironman.jpg',
  'src/img/avatars/spiderman.jpg',
  'src/img/avatars/thor.jpg',
  'src/img/avatars/wolverine.jpg',
  'src/js/app.js',
  'src/js/sw-utils.js',
];

const APP_SHELL_IMMUTABLE = [
  'https://fonts.googleapis.com/css?family=Quicksand:300,400',
  'https://fonts.googleapis.com/css?family=Lato:400,300',
  // 'https://use.fontawesome.com/releases/v5.3.1/css/all.css',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css',
  'src/styles/animate.css',
  'src/js/libs/jquery.js',
];

// const cleanCache = (cacheName, items) => {
//   caches.open(cacheName).then(cache => {
//     return cache.keys().then(keys => {
//       if (keys.length > items) {
//         cache.delete(keys[0]).then(cleanCache(cacheName, items));
//       }
//     });
//   });
// };

self.addEventListener('install', e => {
  const staticCache = caches.open(STATIC_CACHE).then(cache => {
    return cache.addAll(APP_SHELL);
  });

  const immutableCache = caches.open(IMMUTABLE_CACHE).then(cache => {
    return cache.addAll(APP_SHELL_IMMUTABLE);
    // const promise = APP_SHELL_IMMUTABLE.map(async url => {
    //   const response = await fetch(url, { mode: 'no-cors' });
    //   cache.put(url, response);
    // });
    // return Promise.all(promise);
  });

  e.waitUntil(Promise.all([staticCache, immutableCache]));
});

self.addEventListener('activate', e => {
  const response = caches.keys().then(keys => {
    keys.forEach(key => {
      if (key !== STATIC_CACHE && key.includes('static')) {
        return caches.delete(key);
      }
    });
  });
  e.waitUntil(response);
});

self.addEventListener('fetch', e => {
  const cachesRes = caches.match(e.request).then(response => {
    if (response) return response;
    else
      return fetch(e.request).then(newRes => {
        return updateDynamicCache(DYNAMIC_CACHE, e.request, newRes);
      });
  });

  e.respondWith(cachesRes);
});
