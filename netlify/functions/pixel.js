exports.handler = async (event, context) => {
  try {
    // Check if the request method is POST
    if (event.httpMethod !== 'POST') {
      return {
        statusCode: 405,
        body: JSON.stringify({ message: 'Method Not Allowed' }),
      };
    }

    // Parse the incoming request body
    const eventData = JSON.parse(event.body);

    // Log the received data
    console.log('Received event data:', eventData);

    // Here you can add your logic to process the event data
    // For example, you might want to send this data to Supabase or GA4

    // Example response
    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Event processed successfully' }),
    };
  } catch (error) {
    console.error('Error processing event:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Internal Server Error' }),
    };
  }
};
