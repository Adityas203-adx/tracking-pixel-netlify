// netlify/functions/loadscript.js

exports.handler = async (event) => {
  // Extract query parameters (id and meta) from the URL
  const { id = 'anonymous', meta } = event.queryStringParameters || {};

  // If 'meta' is present, encode it for URL compatibility
  const metaParam = meta ? `&meta=${encodeURIComponent(meta)}` : '';

  // Fetch dynamic page details
  const pageUrl = event.headers['x-forwarded-host'] + event.path;  // Full URL of the page where the pixel is loaded
  const referrer = event.headers['referer'] || ''; // Referrer URL (if any)
  const userAgent = event.headers['user-agent'];  // User agent string

  // Generate the JS code to load the pixel and send tracking data
  const js = `
    (function() {
      var img = new Image();
      img.src = 'https://retarglow.com/.netlify/functions/track?id=${id}${metaParam}&event=visit&page_url=${encodeURIComponent(pageUrl)}&referrer=${encodeURIComponent(referrer)}&user_agent=${encodeURIComponent(userAgent)}';
    })();
  `;

  // Return the JS script with a 200 OK response
  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/javascript',
      'Cache-Control': 'public, max-age=3600'
    },
    body: js
  };
};
