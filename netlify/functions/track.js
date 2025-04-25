export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).end('Method Not Allowed');
  }

  const SUPABASE_URL = 'https://nandqoilqwsepborxkrz.supabase.co';
  const SUPABASE_API_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5hbmRxb2lscXdzZXBib3J4a3J6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUzNTkwODAsImV4cCI6MjA2MDkzNTA4MH0.FU7khFN_ESgFTFETWcyTytqcaCQFQzDB6LB5CzVQiOg';
  const GA4_MEASUREMENT_ID = 'G-L2EXMRLXBT';
  const GA4_API_SECRET = 'p7mHsi_yTd-nz20MDvrk3Q';

  try {
    const raw = req.query.data;
    const eventData = JSON.parse(raw);

    // 1. Send to Supabase
    await fetch(`${SUPABASE_URL}/rest/v1/track_events`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        apikey: SUPABASE_API_KEY,
        Authorization: `Bearer ${SUPABASE_API_KEY}`,
        Prefer: 'return=minimal'
      },
      body: JSON.stringify(eventData)
    });

    // 2. Send to GA4
    await fetch(`https://www.google-analytics.com/mp/collect?measurement_id=${GA4_MEASUREMENT_ID}&api_secret=${GA4_API_SECRET}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        client_id: eventData.client_id,
        events: [
          {
            name: eventData.event,
            params: eventData.params || {}
          }
        ]
      })
    });

    // Return a 1x1 transparent pixel
    const pixel = Buffer.from([
      0x47, 0x49, 0x46, 0x38, 0x39, 0x61,
      0x01, 0x00, 0x01, 0x00, 0x80, 0xff,
      0x00, 0xff, 0xff, 0xff, 0x00, 0x00,
      0x00, 0x2c, 0x00, 0x00, 0x00, 0x00,
      0x01, 0x00, 0x01, 0x00, 0x00, 0x02,
      0x02, 0x4c, 0x01, 0x00, 0x3b
    ]);

    res.setHeader('Content-Type', 'image/gif');
    res.setHeader('Cache-Control', 'no-store');
    res.status(200).end(pixel);
  } catch (err) {
    console.error('Tracking error:', err);
    res.status(400).json({ error: 'Invalid request' });
  }
}
