const fetch = require('node-fetch');
const { v4: uuidv4 } = require('uuid');

const SUPABASE_URL = 'https://nandqoilqwsepborxkrz.supabase.co';
const SUPABASE_API_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5hbmRxb2lscXdzZXBib3J4a3J6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUzNTkwODAsImV4cCI6MjA2MDkzNTA4MH0.FU7khFN_ESgFTFETWcyTytqcaCQFQzDB6LB5CzVQiOg';
const TABLE_NAME = 'events';

const GA4_MEASUREMENT_ID = 'G-L2EXMRLXBT';
const GA4_API_SECRET = 'p7mHsi_yTd-nz20MDvrk3Q';

exports.handler = async (event) => {
  const { queryStringParameters: params = {}, headers = {} } = event;

  // Parse cookies into object
  const cookies = Object.fromEntries(
    (headers.cookie || '').split('; ').filter(Boolean).map(c => c.split('='))
  );

  // User ID logic
  let user_id = cookies.retarglow_id || params.id || `anon_${uuidv4()}`;
  const isNewUser = !cookies.retarglow_id;
  const setCookieHeader = isNewUser
    ? [`retarglow_id=${user_id}; Path=/; HttpOnly; Max-Age=31536000; SameSite=Lax`]
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
    user_agent,
  };

  try {
    // Store event in Supabase
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

    // Send event to Google Analytics 4
    await sendToGA4({ user_id, event: eventName, page_url });

    return {
      statusCode: 200,
      headers: isNewUser ? { 'Set-Cookie': setCookieHeader[0] } : {},
      body: '✅ Pixel tracked successfully',
    };
  } catch (err) {
    console.error('❌ Error tracking event:', err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Tracking failed' }),
    };
  }
};

// Send GA4 event
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
