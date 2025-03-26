import { useState } from "react";

const useTextToSpeech = () => {
  const [isAudioLoading, setIsAudioLoading] = useState(false);

  const generateTTS = async (text) => {
    setIsAudioLoading(true);
  
    try {
      const response = await fetch("/api/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) {
        throw new Error("TTS request failed");
      }

      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      audio.play();
    } catch (error) {
      console.error("Error generating TTS:", error);
    }

    setIsAudioLoading(false);
  };

  return { generateTTS, isAudioLoading };
};

export default useTextToSpeech;
