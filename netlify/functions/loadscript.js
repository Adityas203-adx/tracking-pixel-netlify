exports.handler = async function (event, context) {
  const { id } = event.queryStringParameters;

  // Basic validation
  if (!id) {
    return {
      statusCode: 400,
      body: 'Missing ID in query parameters',
    };
  }

  // JavaScript that installs the tracking pixel
  const script = `
    (function() {
      var img = new Image();
      img.src = 'https://retarget.netlify.app/.netlify/functions/track?id=${id}&event=visit';
    })();
  `;

  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/javascript',
      'Cache-Control': 'no-store',
    },
    body: script,
  };
};
