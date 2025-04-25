(function () {
  const COOKIE_NAME = 'retarglow_id';
  const COOKIE_EXPIRY_DAYS = 365;

  function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
  }

  function setCookie(name, value, days) {
    const expires = new Date(Date.now() + days * 864e5).toUTCString();
    document.cookie = `${name}=${value}; expires=${expires}; path=/; SameSite=Lax`;
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

  // Build query parameters
  const page_url = encodeURIComponent(window.location.href);
  const referrer = encodeURIComponent(document.referrer || '');
  const user_agent = encodeURIComponent(navigator.userAgent);

  const pixelUrl = `https://retarglow.com/.netlify/functions/track?id=${userId}&event=visit&page_url=${page_url}&referrer=${referrer}&user_agent=${user_agent}`;

  // Fire tracking pixel
  try {
    const img = new Image();
    img.src = pixelUrl;

    // Optional: Check if the image is loaded successfully
    img.onload = function () {
      console.log('Pixel tracking request sent successfully');
    };

    // Handle error if the pixel fails to load
    img.onerror = function (err) {
      console.error('Pixel tracking failed:', err);
    };
  } catch (err) {
    console.error('Error sending tracking pixel:', err);
  }
})();
