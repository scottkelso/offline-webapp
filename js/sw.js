this.addEventListener('install', function (event) {
    var staticCache = new Cache();

    event.waitUntil(Promise.all([
        caches.add('static-v1', staticCache),
        staticCache.add(
            '/css/fonts.css',
            '/css/materialize.css',
            '/css/style.css',
            '/background1.jpg',
            '/background2.jpg',
            '/background3.jpg',
            '/js/jquery-2.1.1.min.js',
            '/js/materialize.js',
            '/js/init.js'
        )
    ]));
});

this.addEventListener('fetch', function (event) {
    event.respondWith(
        caches.match(event.request).catch(function () {
            return event.default();
        }).catch(function () {
            return caches.match('/fallback.html');
        })
    );
});


// A DIFFERENT IMPLEMENTATION:
// https://github.com/jakearchibald/simple-serviceworker-tutorial/blob/gh-pages/sw.js

// // The fetch event happens for the page request with the
// // ServiceWorker's scope, and any request made within that
// // page
// self.addEventListener('fetch', function(event) {
//     // Calling event.respondWith means we're in charge
//     // of providing the response. We pass in a promise
//     // that resolves with a response object
//     event.respondWith(
//         // First we look for something in the caches that
//         // matches the request
//         caches.match(event.request).then(function(response) {
//             // If we get something, we return it, otherwise
//             // it's null, and we'll pass the request to
//             // fetch, which will use the network.
//             return response || fetch(event.request);
//         })
//     );
// });