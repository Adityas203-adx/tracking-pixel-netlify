const SUPABASE_URL = 'https://nandqoilqwsepborxkrz.supabase.co';
const SUPABASE_API_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5hbmRxb2lscXdzZXBib3J4a3J6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUzNTkwODAsImV4cCI6MjA2MDkzNTA4MH0.FU7khFN_ESgFTFETWcyTytqcaCQFQzDB6LB5CzVQiOg'; // your full anon key

exports.handler = async function (event, context) {
  const params = event.queryStringParameters;
  const headers = event.headers;

  const user_id = params.id;
  const eventName = params.event;
  const page_url = params.url || '';
  const custom_metadata = params.meta ? JSON.parse(decodeURIComponent(params.meta)) : null;

  if (!user_id || !eventName) {
    return {
      statusCode: 400,
      body: 'Missing id or event',
    };
  }

  const referrer = headers.referer || headers.referrer || '';
  const user_agent = headers['user-agent'] || '';
  const ip_address = headers['x-forwarded-for']?.split(',')[0] || '';

  // Get location info based on IP
  let country = '';
  let region = '';
  let city = '';

  try {
    const geoRes = await fetch(`https://ipapi.co/${ip_address}/json/`);
    const geoData = await geoRes.json();
    country = geoData.country_name || '';
    region = geoData.region || '';
    city = geoData.city || '';
  } catch (e) {
    console.warn('Geolocation failed:', e.message);
  }

  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/events`, {
      method: 'POST',
      headers: {
        'apikey': SUPABASE_API_KEY,
        'Authorization': `Bearer ${SUPABASE_API_KEY}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=minimal',
      },
      body: JSON.stringify({
        user_id,
        event: eventName,
        page_url,
        referrer,
        user_agent,
        ip_address,
        country,
        region,
        city,
        custom_metadata,
        timestamp: new Date().toISOString(),
      }),
    });

    if (!res.ok) {
      return {
        statusCode: res.status,
        body: `Supabase insert failed: ${await res.text()}`,
      };
    }

    return {
      statusCode: 204,
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: `Server error: ${error.message}`,
    };
  }
};
