// loadscript.js
exports.handler = async (event, context) => {
  const queryParams = event.queryStringParameters;
  
  // Extract values from query string or default to empty
  const id = queryParams.id || 'unknown';
  const meta = queryParams.meta || '{}'; // Default to empty JSON string
  const eventType = queryParams.event || 'visit';
  
  // Extract dynamic browser information
  const page_url = queryParams.page_url || event.headers.referer || 'unknown';
  const referrer = event.headers.referer || 'unknown';
  const user_agent = event.headers['user-agent'] || 'unknown';
  const ip_address = event.headers['x-forwarded-for'] || 'unknown';

  // Log the collected data (for debugging purposes)
  console.log('Tracking Event:', {
    id,
    meta,
    eventType,
    page_url,
    referrer,
    user_agent,
    ip_address,
  });

  // Supabase URL and API Key
  const supabaseUrl = 'https://nandqoilqwsepborxkrz.supabase.co';
  const supabaseApiKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5hbmRxb2lscXdzZXBib3J4a3J6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUzNTkwODAsImV4cCI6MjA2MDkzNTA4MH0.FU7khFN_ESgFTFETWcyTytqcaCQFQzDB6LB5CzVQiOg';
  const tableName = 'events';

  // Prepare the payload for Supabase
  const payload = {
    id,
    event: eventType,
    page_url,
    referrer,
    user_agent,
    ip_address,
    meta: JSON.parse(meta),
  };

  try {
    // Make request to Supabase
    const res = await fetch(`${supabaseUrl}/rest/v1/${tableName}`, {
      method: 'POST',
      headers: {
        'apikey': supabaseApiKey,
        'Authorization': `Bearer ${supabaseApiKey}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation',
      },
      body: JSON.stringify(payload),
    });

    // Check response status
    if (!res.ok) {
      throw new Error(`Error inserting data to Supabase: ${res.statusText}`);
    }
    
    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Event tracked successfully' }),
    };
  } catch (error) {
    console.error('Error tracking event:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to track event' }),
    };
  }
};
