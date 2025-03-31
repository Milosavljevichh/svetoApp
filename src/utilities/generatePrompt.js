import getPrompts from "./getLanguageForPrompts";

const generatePrompt = (userContent, language) => {
    const prompts = getPrompts()
  
    return `${userContent}. Keep the response concise and meaningful, focusing on Orthodox Christian teachings. 
    Do not include introductions or explanations—start directly with the response. Please respond in ${prompts[language].lg} using ${prompts[language].script} script.`;
  };
  
  export default generatePrompt;
  