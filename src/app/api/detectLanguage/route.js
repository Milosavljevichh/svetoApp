import axios from 'axios';

export async function GET(req) {
  try {
    const token = process.env.IPINFO_TOKEN; // Your IPInfo API token
    if (!token) {
      return new Response(JSON.stringify({ error: "IPInfo token is missing." }), { status: 500 });
    }

    let clientIp;

    // 1. Check if it's running on localhost (development environment)
    if (process.env.NODE_ENV === 'development') {
      // For local development, you can either mock the IP or simulate one
      clientIp = '8.8.8.8'; //Use a public IP like Google's DNS for testing purposes
    } else {
      // 2. Extract the client IP address from headers (for production environment)
      clientIp = req.headers.get('x-forwarded-for') || req.connection.remoteAddress;
    }

    if (!clientIp) {
      return new Response(JSON.stringify({ error: "Client IP not found." }), { status: 400 });
    }

    // 3. Use the IP address in the IPInfo API request
    const API_URL = `https://ipinfo.io/${clientIp}/json?token=${token}`;
    const response = await axios.get(API_URL);

    // 4. Extract country from the IPInfo response
    const countryCode = response.data.country;
    if (!countryCode) {
      return new Response(JSON.stringify({ error: "Country code not found." }), { status: 500 });
    }

    // 5. Map country code to language
    const countryToLanguageMap = {
      'US': 'en',
      'GB': 'en',
      'CA': 'en',
      'RS': 'sr',
      'RU': 'ru',
      'GR': 'el',
      'BG': 'bg',
    };

    const language = countryToLanguageMap[countryCode] || 'en'; // Default to 'en' if country is not mapped.

    // 6. Return language and countryCode to the client
    return new Response(JSON.stringify({ language, countryCode }), { status: 200 });

  } catch (error) {
    console.error("Error detecting language:", error);
    return new Response(JSON.stringify({ error: "Failed to detect language" }), { status: 500 });
  }
}
