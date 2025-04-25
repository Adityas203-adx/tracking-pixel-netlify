(function () {
  const COOKIE_NAME = 'retarglow_id';
  const COOKIE_EXPIRY_DAYS = 365;

  function getCookie(name) {
    // Check if running in a browser environment
    if (typeof document !== 'undefined') {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop().split(';').shift();
    }
    return null; // Return null if not in a browser
  }

  function setCookie(name, value, days) {
    // Check if running in a browser environment
    if (typeof document !== 'undefined') {
      const expires = new Date(Date.now() + days * 864e5).toUTCString();
      document.cookie = `${name}=${value}; expires=${expires}; path=/; SameSite=Lax`;
    }
  }

  function generateId() {
    return 'anon_' + Math.random().toString(36).substring(2, 12);
  }

  // Set or get persistent user ID
  let userId = getCookie(COOKIE_NAME);
  if (!userId) {
    userId = generateId();
    setCookie(COOKIE_NAME, userId, COOKIE_EXPIRY_DAYS);
  }

  // Build query parameters for the tracking pixel URL
  const page_url = encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '');
  const referrer = encodeURIComponent(typeof document !== 'undefined' ? document.referrer || '' : '');
  const user_agent = encodeURIComponent(typeof navigator !== 'undefined' ? navigator.userAgent : '');

  // Send tracking data to your Netlify function (no need for Supabase or GA4 keys here)
  const pixelUrl = `https://retarglow.com/.netlify/functions/track?id=${userId}&event=visit&page_url=${page_url}&referrer=${referrer}&user_agent=${user_agent}`;

  // Fire tracking pixel (sending data to the Netlify function)
  try {
    if (typeof window !== 'undefined') {
      const img = new Image();
      img.src = pixelUrl;
    }
  } catch (err) {
    console.error('Pixel tracking failed:', err);
  }
})();
