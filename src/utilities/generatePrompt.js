const generatePrompt = (userContent, language) => {
    const prompts = {
      en: { lg: "English", script: "Latin" },
      sr: { lg: "Serbian", script: "Latin (not Cyrillic)" },
      srCy: { lg: "Serbian", script: "Cyrillic" },
      ru: { lg: "Russian", script: "Latin (not Cyrillic)" },
      el: { lg: "Greek", script: "Latin (not Cyrillic)" },
      bg: { lg: "Bulgarian", script: "Latin (not Cyrillic)" },
    };
  
    return `${userContent}. Keep the response concise and meaningful, focusing on Orthodox Christian teachings. 
    Do not include introductions or explanations—start directly with the response. Please respond in ${prompts[language].lg} using ${prompts[language].script} script.`;
  };
  
  export default generatePrompt;
  