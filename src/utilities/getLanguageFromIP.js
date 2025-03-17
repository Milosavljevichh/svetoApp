import axios from 'axios';

export const detectLanguageFromIP = async () => {
  try {
    // Corrected to the proper API route path
    const response = await axios.get('/api/detectLanguage');
    return response.data.language;
  } catch (error) {
    console.error('Error detecting language:', error);
    return 'en'; // Default to 'en' if there's an error
  }
};
