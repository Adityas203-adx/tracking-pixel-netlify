const fetch = require('node-fetch');
const { v4: uuidv4 } = require('uuid');

// Your Supabase project URL
const SUPABASE_URL = 'https://nandqoilqwsepborxkrz.supabase.co'; // Replace with your Supabase URL
const SUPABASE_API_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5hbmRxb2lscXdzZXBib3J4a3J6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUzNTkwODAsImV4cCI6MjA2MDkzNTA4MH0.FU7khFN_ESgFTFETWcyTytqcaCQFQzDB6LB5CzVQiOg'; // Replace with your Supabase API Key
const TABLE_NAME = 'events';

const GA4_MEASUREMENT_ID = 'G-L2EXMRLXBT'; // Replace with your GA4 Measurement ID
const GA4_API_SECRET = 'p7mHsi_yTd-nz20MDvrk3Q'; // Replace with your GA4 API Secret

exports.handler = async (event) => {
  const params = event.queryStringParameters;
  const headers = event.headers;

  // Parse cookies from headers
  const cookieHeader = headers.cookie || '';
  const cookies = Object.fromEntries(cookieHeader.split('; ').map(c => c.split('=')));
  let user_id = cookies.retarglow_id || params.id || 'anon_' + uuidv4();

  // Prepare Set-Cookie header if new user_id was generated
  const setCookieHeader = !cookies.retarglow_id
    ? [`retarglow_id=${user_id}; Path=/; HttpOnly; Max-Age=31536000`]
    : [];

  const eventName = params.event || 'visit';
  const page_url = params.page_url || headers.referer || '';
  const referrer = headers.referer || '';
  const user_agent = headers['user-agent'] || '';
  const ip_address =
    headers['x-forwarded-for']?.split(',')[0] ||
    headers['client-ip'] ||
    'unknown';

  const custom_metadata = {
    timestamp: new Date().toISOString(),
    lang: headers['accept-language'] || '',
  };

  try {
    // Store in Supabase
    await fetch(`${SUPABASE_URL}/rest/v1/${TABLE_NAME}`, {
      method: 'POST',
      headers: {
        apikey: SUPABASE_API_KEY,
        Authorization: `Bearer ${SUPABASE_API_KEY}`,
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
    await sendToGA4({ user_id, event: eventName, page_url });

    return {
      statusCode: 200,
      headers: setCookieHeader.length > 0 ? { 'Set-Cookie': setCookieHeader[0] } : {},
      body: 'Pixel tracked with session',
    };
  } catch (err) {
    console.error('❌ Tracking failed:', err.message);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Tracking failed' }),
    };
  }
};

// Send to GA4
async function sendToGA4({ user_id, event, page_url }) {
  const payload = {
    client_id: user_id,
    events: [
      {
        name: event,
        params: {
          page_location: page_url,
        },
      },
    ],
  };

  await fetch(
    `https://www.google-analytics.com/mp/collect?measurement_id=${GA4_MEASUREMENT_ID}&api_secret=${GA4_API_SECRET}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    }
  );
}
