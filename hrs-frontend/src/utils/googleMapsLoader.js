/**
 * Utility to load the Google Maps JavaScript API dynamically.
 */
let isLoaded = false;
let loadingPromise = null;

export const loadGoogleMaps = (apiKey) => {
  if (isLoaded) return Promise.resolve();
  if (loadingPromise) return loadingPromise;

  loadingPromise = new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey || ''}&libraries=places`;
    script.async = true;
    script.defer = true;
    script.onload = () => {
      isLoaded = true;
      resolve();
    };
    script.onerror = (err) => {
      loadingPromise = null;
      reject(err);
    };
    document.head.appendChild(script);
  });

  return loadingPromise;
};
