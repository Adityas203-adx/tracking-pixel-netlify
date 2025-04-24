
exports.handler = async function (event) {
  const id = event.path.split('/').pop();

  const js = `
    (function() {
      var img = new Image();
      img.src = 'https://YOUR-NETLIFY-SITE.netlify.app/.netlify/functions/track?id=${id}';
      document.body.appendChild(img);

      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', 'G-XXXXXXX'); // Replace with your GA4 ID
    })();
  `;

  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/javascript',
    },
    body: js
  };
};
