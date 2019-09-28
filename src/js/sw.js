const CACHE_NAME = `BIG_TRIP_APP`;

self.addEventListener(`install`, (evt) => {
  evt.waitUntil(
      caches.open(CACHE_NAME)
        .then((cache) => {
          return cache.addAll([
            `/`,
            `/index.html`,
            `/bundle.js`,
            `/css/style.css`,
            `/img/icons/**/*.{png,jpg,svg}`,
            `/img/photos/**/*.{png,jpg,svg}`,
            `/img/header-bg.png`,
            `/img/header-bg@2x.png`,
            `/img/logo.png`
          ]);
        })
  );
});

self.addEventListener(`fetch`, (evt) => {
  const putToCacheCb = (response) => {
    if (response) {
      return response;
    }

    return fetch(evt.request)
      .then((resp) => {
        caches.open(CACHE_NAME).then((cache) => cache.put(evt.request, resp.clone()));

        return resp.clone();
      });
  };

  evt.respondWith(
      caches.match(evt.request)
        .then(putToCacheCb)
        .catch((err) => {
          throw new Error(err);
        })
  );
});

