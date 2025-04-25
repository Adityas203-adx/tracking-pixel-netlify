// Supabase and GA4 Credentials
const SUPABASE_URL = 'https://nandqoilqwsepborxkrz.supabase.co';
const SUPABASE_API_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5hbmRxb2lscXdzZXBib3J4a3J6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUzNTkwODAsImV4cCI6MjA2MDkzNTA4MH0.FU7khFN_ESgFTFETWcyTytqcaCQFQzDB6LB5CzVQiOg';
const GA4_MEASUREMENT_ID = 'G-L2EXMRLXBT';
const GA4_API_SECRET = 'p7mHsi_yTd-nz20MDvrk3Q';

// Function to send tracking data to Supabase
async function sendTrackingData(eventData) {
  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/track_events`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_API_KEY,
        'Authorization': `Bearer ${SUPABASE_API_KEY}`
      },
      body: JSON.stringify(eventData)
    });

    if (response.ok) {
      console.log('Tracking data sent to Supabase successfully!');
    } else {
      console.error('Error sending data to Supabase:', response.statusText);
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

// Function to send event data to GA4
async function sendToGA4(eventData) {
  const payload = {
    client_id: eventData.client_id,
    events: [
      {
        name: eventData.event,
        params: {
          ...eventData.params
        }
      }
    ]
  };

  try {
    const response = await fetch(`https://www.google-analytics.com/mp/collect?measurement_id=${GA4_MEASUREMENT_ID}&api_secret=${GA4_API_SECRET}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (response.ok) {
      console.log('Event sent to GA4 successfully!');
    } else {
      console.error('Error sending data to GA4:', response.statusText);
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

// Example: Track page view
if (typeof window !== 'undefined' && typeof document !== 'undefined') {
  const eventData = {
    client_id: 'YOUR_CLIENT_ID', // Fetch this dynamically
    event: 'page_view',
    params: {
      page_path: window.location.pathname,
      page_title: document.title
    }
  };

  // Send data to both Supabase and GA4
  sendTrackingData(eventData);
  sendToGA4(eventData);
}
