import { precacheAndRoute } from "workbox-precaching";
import { registerRoute } from "workbox-routing";
import { CacheFirst, StaleWhileRevalidate } from "workbox-strategies";
import { ExpirationPlugin } from "workbox-expiration";

precacheAndRoute(self.__WB_MANIFEST);

registerRoute(
  ({ request, url }) =>
    request.destination === "document" ||
    url.pathname.endsWith(".geojson") ||
    url.pathname.endsWith(".json"),
  new StaleWhileRevalidate({
    cacheName: "datos-app",
  })
);

registerRoute(
  ({ url }) =>
    url.hostname.includes("cartocdn.org"),
  new CacheFirst({
    cacheName: "map-tiles",
    plugins: [
      new ExpirationPlugin({
        maxEntries: 500,
        maxAgeSeconds: 7 * 24 * 60 * 60,
      }),
    ],
  })
);