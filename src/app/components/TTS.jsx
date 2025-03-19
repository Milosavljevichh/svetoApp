import '@fortawesome/fontawesome-free/css/all.css';
import { useState, useEffect } from 'react';

const TextToSpeech = ({ text, isAudioLoading, isLoading, selectedLanguage }) => {

    const [promptLang, setPromptLang] = useState(selectedLanguage)
    const [isSpeaking, setIsSpeaking] = useState(false);  // State to track if speaking is in progress

    useEffect(()=>{
        setPromptLang(selectedLanguage)
    }, [text])

    const handleSpeak = () => {

        if (text && !isSpeaking) {
            // Check if the SpeechSynthesis API is available
            if ('speechSynthesis' in window) {
                const utterance = new SpeechSynthesisUtterance(text);


                // Set some options
                utterance.pitch = 1; // Range is 0-2
                utterance.rate = 1;  // Range is 0.1-10 (default is 1)
                utterance.volume = 1; // Range is 0-1 (default is 1)

                setIsSpeaking(true);

                // When speaking finishes, update isSpeaking state
                utterance.onend = () => {
                    setIsSpeaking(false);
                };

                // Speak the text
                window.speechSynthesis.speak(utterance);
            } else {
                alert("Sorry, your browser does not support speech synthesis.");
            }
        }
    };


    const handleStop = () => {
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel();
            setIsSpeaking(false);
        }
    };

    return (
        <div className='flex gap-2 justify-center w-full mb-6'>
            <button
                onClick={() => handleSpeak()}
                disabled={isLoading || promptLang !== "en"}
                className={`bg-[#8b4513] text-white p-2 rounded-lg transform transition hover:scale-105 flex items-center justify-center 
                ${isLoading || promptLang !== "en" ? "bg-gray-400 cursor-not-allowed" : "hover:bg-[#7a3e1e]"}`}
                aria-label="Submit question"
            >
                {!isAudioLoading && !isLoading ? <>{ promptLang === "en" ? "Text to speech" : "Only in english"} <i className="ml-2 fa-solid fa-volume-high"></i></> : "Loading..."}
            </button>
            <button
                onClick={handleStop}
                disabled={!isSpeaking}
                className="bg-[#8b4513] text-white p-2 rounded-lg transform transition hover:scale-105 flex items-center justify-center"
            >
                <i className="fa-solid fa-volume-xmark"></i>
            </button>
        </div>
    );
};

export default TextToSpeech;
