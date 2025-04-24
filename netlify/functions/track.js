const fetch = require('node-fetch');

exports.handler = async (event, context) => {
  const params = event.queryStringParameters;
  const user_id = params.id || 'anonymous';
  const eventName = params.event || 'visit';
  const page_url = params.url || '';
  const referrer = event.headers.referer || '';
  const user_agent = event.headers['user-agent'] || '';
  const ip_address =
    event.headers['x-forwarded-for']?.split(',')[0] ||
    event.headers['client-ip'] ||
    'unknown';

  const custom_metadata = {
    timestamp: new Date().toISOString(),
    lang: event.headers['accept-language'] || '',
  };

  // Save to Supabase
  await fetch('https://nandqoilqwsepborxkrz.supabase.co/rest/v1/events', {
    method: 'POST',
    headers: {
      apikey:
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5hbmRxb2lscXdzZXBib3J4a3J6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUzNTkwODAsImV4cCI6MjA2MDkzNTA4MH0.FU7khFN_ESgFTFETWcyTytqcaCQFQzDB6LB5CzVQiOg',
      Authorization:
        'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5hbmRxb2lscXdzZXBib3J4a3J6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUzNTkwODAsImV4cCI6MjA2MDkzNTA4MH0.FU7khFN_ESgFTFETWcyTytqcaCQFQzDB6LB5CzVQiOg',
      'Content-Type': 'application/json',
      Prefer: 'return=minimal',
    },
    body: JSON.stringify({
      user_id,
      event: eventName,
      page_url,
      referrer,
      user_agent,
      ip_address,
      custom_metadata,
    }),
  });

  // Send to GA4
  await sendToGA4({
    user_id,
    event: eventName,
    page_url,
  });

  return {
    statusCode: 200,
    body: 'Pixel tracked',
  };
};

// Send to GA4
const sendToGA4 = async ({ user_id, event, page_url }) => {
  const measurement_id = 'G-L2EXMRLXBT';
  const api_secret = 'p7mHsi_yTd-nz20MDvrk3Q';

  const payload = {
    client_id: user_id || 'anon_' + Math.random().toString(36).substring(2),
    events: [
      {
        name: event,
        params: {
          page_location: page_url,
        },
      },
    ],
  };

  try {
    await fetch(
      `https://www.google-analytics.com/mp/collect?measurement_id=${measurement_id}&api_secret=${api_secret}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      }
    );
    console.log('✅ GA4 event sent');
  } catch (err) {
    console.error('❌ GA4 send failed:', err.message);
  }
};
