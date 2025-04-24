const SUPABASE_URL = 'https://nandqoilqwsepborxkrz.supabase.co';
const SUPABASE_API_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5hbmRxb2lscXdzZXBib3J4a3J6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUzNTkwODAsImV4cCI6MjA2MDkzNTA4MH0.FU7khFN_ESgFTFETWcyTytqcaCQFQzDB6LB5CzVQiOg';

exports.handler = async function (event, context) {
  const params = event.queryStringParameters;
  const { id, event: eventName } = params;

  if (!id || !eventName) {
    return {
      statusCode: 400,
      body: 'Missing id or event',
    };
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
        user_id: id,
        event: eventName,
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
      statusCode: 204, // No Content (success with no body)
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: `Server error: ${error.message}`,
    };
  }
};
