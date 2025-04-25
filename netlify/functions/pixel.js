(function () {
  const COOKIE_NAME = 'retarglow_id';
  const COOKIE_EXPIRY_DAYS = 365;

  // Get cookie value by name
  function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
  }

  // Set a cookie value
  function setCookie(name, value, days) {
    const expires = new Date(Date.now() + days * 864e5).toUTCString();
    document.cookie = `${name}=${value}; expires=${expires}; path=/; SameSite=Lax`;
  }

  // Generate a random user ID
  function generateId() {
    return 'anon_' + Math.random().toString(36).substring(2, 12);
  }

  // Retrieve or create user ID from cookie
  let userId = getCookie(COOKIE_NAME);
  if (!userId) {
    userId = generateId();
    setCookie(COOKIE_NAME, userId, COOKIE_EXPIRY_DAYS);
  }

  // Collect page information for tracking
  const page_url = encodeURIComponent(window.location.href);
  const referrer = encodeURIComponent(document.referrer || '');
  const user_agent = encodeURIComponent(navigator.userAgent);

  // Create the tracking pixel URL
  const pixelUrl = `https://retarglow.com/.netlify/functions/track?id=${userId}&event=visit&page_url=${page_url}&referrer=${referrer}&user_agent=${user_agent}`;

  // Fire tracking pixel by sending an image request
  try {
    const img = new Image();
    img.src = pixelUrl;
  } catch (err) {
    console.error('Pixel tracking failed:', err);
  }
})();
