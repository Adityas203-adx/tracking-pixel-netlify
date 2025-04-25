(function () {
  function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
  }

  function setCookie(name, value, days = 365) {
    const expires = new Date(Date.now() + days * 864e5).toUTCString();
    document.cookie = `${name}=${value}; expires=${expires}; path=/; SameSite=Lax`;
  }

  function generateId() {
    return 'anon_' + Math.random().toString(36).substring(2, 15);
  }

  // Set or retrieve cookie
  let userId = getCookie('retarglow_id');
  if (!userId) {
    userId = generateId();
    setCookie('retarglow_id', userId);
  }

  // Construct tracking pixel URL
  const page_url = encodeURIComponent(window.location.href);
  const referrer = encodeURIComponent(document.referrer || '');
  const user_agent = encodeURIComponent(navigator.userAgent);
  const pixelUrl = `https://retarglow.com/.netlify/functions/track?id=${userId}&event=visit&page_url=${page_url}&referrer=${referrer}&user_agent=${user_agent}`;

  // Send tracking request
  const img = new Image();
  img.src = pixelUrl;
})();
