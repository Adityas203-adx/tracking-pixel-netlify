// netlify/functions/loadscript.js

exports.handler = async (event) => {
  // Extract query parameters (id and meta) from the URL
  const { id = 'anonymous', meta } = event.queryStringParameters || {};

  // If 'meta' is present, encode it for URL compatibility
  const metaParam = meta ? `&meta=${encodeURIComponent(meta)}` : '';

  // Generate the JS code to load the pixel and send tracking data
  const js = `
    (function() {
      var img = new Image();
      img.src = 'https://retarglow.com/.netlify/functions/track?id=${id}${metaParam}&event=visit';
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
