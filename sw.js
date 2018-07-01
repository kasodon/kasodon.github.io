self.addEventListener('install', function(e) {
 e.waitUntil(
   caches.open('tools').then(function(cache) {
     return cache.addAll([
        '/',
        '/index.html',
        '/idb.js',
        '/idbi.js',
        '/tools/css/currency.css'
     ]);
   })
 );
});

self.addEventListener('fetch', function(event) {

console.log(event.request.url);

event.respondWith(

caches.match(event.request).then(function(response) {

return response || fetch(event.request);

})

);

});