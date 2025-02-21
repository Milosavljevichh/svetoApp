import axios from 'axios';

const token = process.env.NEXT_PUBLIC_IPINFO_TOKEN;
if (!token) {
  console.error("IpInfo token is not defined in your .env.local file.");
}
const API_URL = `https://ipinfo.io/json?token=${token}`;

const countryToLanguageMap = {
  'US': 'en',
  'GB': 'en',
  'CA': 'en',
  
  'RS': 'sr',

  'RU': 'ru',

  'GR': 'el',

  'BG': 'bg',
};

export const detectLanguageFromIP = async () => {
  try {
    
    const response = await axios.get(API_URL);

    const countryCode = response.data.country;
    
    const language = countryToLanguageMap[countryCode] || 'en';
    return language;
  } catch (error) {
    console.error('Error detecting language:', error);
    return 'en';
  }
};
