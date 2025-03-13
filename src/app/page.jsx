"use client";
import './globals.css';
import React from "react";
import { useState, useEffect } from "react";
import Header from "./components/Header";
import { useHandleStreamResponse } from "../utilities/runtime-helpers";
import DonationPage from "./DonatePage/page";
import '@fortawesome/fontawesome-free/css/all.css';
import PaymentForm from './components/PaymentForm';
import LanguageContextProvider from './components/LanguageProvider';

function MainPage({
  initialContent = "Welcome to your daily spiritual guide. Let me begin with a prayer for you."
}) {

  const [isMobile, setIsMobile] = useState(false);
      const [selectedLanguage, setSelectedLanguage] = useState("en");

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth <= 768); // Adjust breakpoint as needed
    };

    checkScreenSize(); // Check on mount
    window.addEventListener("resize", checkScreenSize); // Listen for resize

    return () => window.removeEventListener("resize", checkScreenSize); // Cleanup
  }, []);

  const icons = {
    cross: "fa fa-cross",
    book: "fa fa-book-bible",
    prayer: "fa fa-praying-hands",
  };

  const [userContent, setUserContent] = useState("");
  const [textAreaContent, setTextAreaContent] = useState("");
  const [promptContent, setPromptContent] = useState(initialContent);
  const [isLoading, setIsLoading] = useState(false);
  const [icon, setIcon] = useState("cross");
  const [error, setError] = useState("");
  const [streamingMessage, setStreamingMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const handleStreamResponse = useHandleStreamResponse({
    onChunk: (message) => {
      const processedMessage = message.replace(/\*\*/g, " ** ");
      setStreamingMessage(processedMessage);
    },
    onFinish: (message) => {
      const processedMessage = message.replace(/\*\*/g, " ** ");
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: processedMessage },
      ]);
      setPromptContent(processedMessage);
      setStreamingMessage("");
    },
  });

  const [previousContent, setPreviousContent] = useState([initialContent]);
  const [dailyPrayer, setDailyPrayer] = useState("");
  const [hasGeneratedDailyPrayer, setHasGeneratedDailyPrayer] = useState(false);


  const generateDailyPrayer = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/integrations/chat-gpt/conversationgpt4", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [
            {
              role: "system",
              content: `You are a spiritual assistant dedicated to providing Orthodox Christian prayers and teachings. Generate a unique, meaningful, and concise daily prayer that aligns with Orthodox Christian values and traditions. The prayer should be different each time, focusing on themes of gratitude, faith, repentance, and divine guidance.`,
            },
            {
              role: "user",
              content: "Generate today's Orthodox prayer",
            },
          ],
          stream: true,
        }),
      });
  
      if (!response.ok) throw new Error("Failed to generate daily prayer");
      await handleStreamResponse(response);
      setHasGeneratedDailyPrayer(true);
    } catch (err) {
      setError("Failed to generate daily prayer. Please try again.");
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  }; 

  useEffect(() => {
    if (!hasGeneratedDailyPrayer) {
      generateDailyPrayer();
    }
  }, []);

  const generatePrompt = (language) => {
    const prompts = {
      en: `English`,
      sr: `Serbian`,
      ru: `Russian`,
      el: `Generate a unique Orthodox Christian prayer, Bible verse, or spiritual reflection in Greek that is different from these previous ones: "${previousContent.join(
        '" "'
      )}". Keep the response concise and meaningful, focusing on Orthodox Christian teachings. Do not repeat any previous content.`,
      bg: `Generate a unique Orthodox Christian prayer, Bible verse, or spiritual reflection in Bulgarian that is different from these previous ones: "${previousContent.join(
        '" "'
      )}". Keep the response concise and meaningful, focusing on Orthodox Christian teachings. Do not repeat any previous content.`,
    };
    return (userContent  +". Keep the response concise and meaningful, focusing on Orthodox Christian teachings. Please respond in" + prompts[language]);
  };


  const refreshContent = async () => {
    setIsLoading(true);
    setError("");
    const randomIcon = Object.keys(icons)[Math.floor(Math.random() * 3)];
    setIcon(randomIcon);

    try {
      const response = await fetch("/integrations/chat-gpt/conversationgpt4", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [
            {
              role: "system",
              content: `You are an Orthodox Christian assistant. Provide detailed answers or prayers based on user-selected topics. Each response should align with Orthodox teachings and:
                          - For icon questions: Explain their spiritual significance, proper veneration, and historical context
                          - For healing prayers: Provide traditional Orthodox prayers for healing, including references to saints known for healing
                          - For fasting questions: Explain Orthodox fasting traditions, spiritual benefits, and practical guidance
                          Always maintain a reverent tone and include relevant scripture or patristic quotes.`,
            },
            {
              role: "user",
              content: generatePrompt(selectedLanguage),
            },
          ],
          stream: true,
        }),
      });

      if (!response.ok) throw new Error("Failed to generate response");
      await handleStreamResponse(response);

      const newContent = error || streamingMessage || promptContent;
      setPreviousContent((prev) => {
        const updated = [...prev, newContent];
        return updated.slice(-5);
      });
    } catch (err) {
      setError("Failed to generate response. Please try again.");
      console.log(err)
    } finally {
      setIsLoading(false);
    }
  };

  const handleDonationClick = () => {
    setShowDonationPopup(true);
  };

  const [showCopySuccess, setShowCopySuccess] = useState(false);

  const handleShare = async (platform) => {
    const shareText = error || streamingMessage || promptContent;
    const shareUrl = window.location.href;

    switch (platform) {
      case "facebook":
        window.open(
          `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
            shareUrl
          )}&quote=${encodeURIComponent(shareText)}`,
          "_blank"
        );
        break;
      case "twitter":
        window.open(
          `https://twitter.com/intent/tweet?text=${encodeURIComponent(
            shareText
          )}&url=${encodeURIComponent(shareUrl)}`,
          "_blank"
        );
        break;
      case "whatsapp":
        window.open(
          `https://wa.me/?text=${encodeURIComponent(
            `${shareText} ${shareUrl}`
          )}`,
          "_blank"
        );
        break;
      case "email":
        window.open(
          `mailto:?subject=Orthodox Prayer&body=${encodeURIComponent(
            `${shareText}\n\n${shareUrl}`
          )}`,
          "_blank"
        );
        break;
      case "copy":
        try {
          await navigator.clipboard.writeText(`${shareText}\n\n${shareUrl}`);
          setShowCopySuccess(true);
          setTimeout(() => setShowCopySuccess(false), 2000);
        } catch (err) {
          console.error("Failed to copy:", err);
        }
        break;
    }
  };

  const [showDonationPopup, setShowDonationPopup] = useState(false);

  function handleShowDonation(bool){
    setShowDonationPopup(bool)
  }


  const suggestedQuestions = [
    {
      text: "What is the meaning of fasting in Orthodox tradition?",
      icon: "fa fa-utensils",
    },
    {
      text: "How can I start a prayer routine?",
      icon: "fa fa-pray",
    },
    {
      text: "What is the role of icons in Orthodox Christianity?",
      icon: "fa fa-image",
    },
    {
      text: "Who are the most significant saints in the Orthodox Church?",
      icon: "fa fa-church",
    },
    {
      text: "Can you explain the importance of the Holy Trinity?",
      icon: "fa fa-cross",
    },
    {
      text: "Can you give me a prayer for students?",
      icon: "fa fa-book",
    },
  ];

  function changeLanguage(lang){
    setSelectedLanguage(lang)
  }

  useEffect(()=>{
    if (userContent) {
      refreshContent()
    }
  }, [userContent])

  const [audioUrl, setAudioUrl] = useState(null);
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
  
  return (
    <>
    <LanguageContextProvider selectedLanguage={selectedLanguage} changeLanguage={changeLanguage}>
    <Header />
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <div className="max-w-4xl w-full text-center space-y-8">
          <div className="space-y-4">
            <h1 className="text-4xl md:text-6xl font-crimson-text text-[#8b4513]">
              Orthodox Christianity
            </h1>

            <p className="text-xl md:text-2xl font-crimson-text text-[#5c4030] leading-relaxed px-4">
              Welcome to the platform dedicated to spreading and preserving
              Orthodox Christianity. Read, listen, and connect with the Word of
              God in Serbian, Russian, Greek, Bulgarian, and English. Explore
              biblical prayers, teachings, and sacred texts in Cyrillic and
              Latin script.
            </p>
          </div>

          <div className="relative p-8 border-4 border-[#8b4513] rounded-lg bg-[#f8f5f0]">
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-[#8b4513]"></div>
              <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-[#8b4513]"></div>
              <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-[#8b4513]"></div>
              <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-[#8b4513]"></div>
            </div>

            <div className="mb-8 text-center">
              <h2 className="text-2xl font-crimson-text text-[#2c1810] mb-4">
                Today's Prayer
              </h2>
              <div
                className={`transition-opacity duration-500 ${
                  isLoading ? "opacity-50" : "opacity-100"
                }`}
              >
                <i className="fa fa-pray text-2xl text-[#8b4513] mb-4"></i>
              </div>
            </div>

            <div
              className={`flex items-center justify-center space-x-4 transition-opacity duration-500 mb-8 ${
                isLoading ? "opacity-50" : "opacity-100"
              }`}
            >
              <i className={`${icons[icon]} text-2xl text-[#8b4513]`}></i>
              <p className="text-xl font-crimson-text text-[#2c1810] select-text cursor-text">
                {(error || streamingMessage || promptContent)
                  .split(" ")
                  .map((word, index) => (
                    <span
                      key={index}
                      className="inline-block px-1 hover:bg-[#8b4513]/10 rounded transition-colors cursor-pointer"
                      onClick={async () => {
                        try {
                          await navigator.clipboard.writeText(word);
                          const tooltip = document.createElement("div");
                          tooltip.textContent = "Copied!";
                          tooltip.className =
                            "absolute bg-[#2c1810] text-white px-2 py-1 rounded text-sm";
                          const rect = event.target.getBoundingClientRect();
                          tooltip.style.left = `${rect.left}px`;
                          tooltip.style.top = `${rect.top - 25}px`;
                          document.body.appendChild(tooltip);
                          setTimeout(() => tooltip.remove(), 1000);
                        } catch (err) {
                          console.error("Failed to copy:", err);
                        }
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.transform = "scale(1.1)";
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.transform = "scale(1)";
                      }}
                    >
                      {word}{" "}
                    </span>
                  ))}
              </p>
            </div>

            <div className="flex justify-center space-x-4 mb-8">  
              <button
                onClick={() => {
                  setUserContent(
                    "What is the significance of icons in Orthodox Christianity?"
                  );
                  setTextAreaContent("")
                }}
                className="flex items-center space-x-2 text-[#8b4513] hover:text-[#6b3410] transition-colors font-crimson-text text-lg"
              >
                <i className="fa fa-image"></i>
                <span>About Icons</span>
              </button>

              <button
                onClick={() => {
                  setUserContent("Provide a prayer for healing.");
                  setTextAreaContent("")
                }}
                className="flex items-center space-x-2 text-[#8b4513] hover:text-[#6b3410] transition-colors font-crimson-text text-lg"
              >
                <i className="fa fa-pray"></i>
                <span>Healing Prayer</span>
              </button>

              <button
                onClick={() => {
                  setUserContent(
                    "Explain the importance of fasting in the Orthodox tradition."
                  );
                  setTextAreaContent("")
                }}
                className="flex items-center space-x-2 text-[#8b4513] hover:text-[#6b3410] transition-colors font-crimson-text text-lg"
              >
                <i className="fa fa-book-reader"></i>
                <span>About Fasting</span>
              </button>
              <button
                onClick={() => {generateTTS(promptContent)}}
                disabled={isLoading}
                className="bg-[#8b4513] text-white p-2 rounded-lg transform transition hover:scale-105 flex items-center justify-center"
                aria-label="Submit question"
              >
                {!isAudioLoading && !isLoading ? <>Text to speech <i className="ml-2 fa-solid fa-volume-high"></i></> : "Loading..."}
              </button>
              {audioUrl && (
                <audio controls autoPlay>
                  <source src={audioUrl} type="audio/mpeg" />
                  Your browser does not support the audio element.
                </audio>
              )}
            </div>

            <div className="flex flex-col space-y-4 w-full max-w-2xl mx-auto">
              <div className="relative">
                <textarea
                  placeholder="Pray with me or ask about Orthodox Christianity..."
                  onChange={(e) => setTextAreaContent(e.target.value)}
                  value={textAreaContent}
                  className="w-full p-4 pr-12 rounded-lg border-2 border-[#8b4513] bg-white font-crimson-text text-[#2c1810] min-h-[100px] resize-none transition-all focus:border-[#6b3410] focus:ring-2 focus:ring-[#8b4513] focus:ring-opacity-50"
                />
                <button
                  onClick={() => {
                    setUserContent(textAreaContent)
                    setTextAreaContent("")
                  }}
                  disabled={isLoading}
                  className="absolute right-3 bottom-3 bg-[#8b4513] text-white p-2 rounded-lg transform transition hover:scale-105 flex items-center justify-center"
                  aria-label="Submit question"
                >
                  <i className="fa fa-paper-plane"></i>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {suggestedQuestions.map((question, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setUserContent(question.text); // Set the content to the question text
                      setTextAreaContent("")
                    }}
                    className="text-left p-3 rounded-lg border-2 border-[#8b4513] text-[#8b4513] hover:bg-[#8b4513] hover:text-white transition-colors flex items-center gap-2 font-crimson-text"
                  >
                    <i className={question.icon}></i>
                    <span>{question.text}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-[#8b4513] border-opacity-20">
              <p className="text-sm font-crimson-text text-[#5c4030] mb-3">
                Share this prayer
              </p>
              <div className="flex justify-center items-center space-x-6">
                <button
                  onClick={() => handleShare("facebook")}
                  className="text-[#8b4513] hover:text-[#2c1810] transition-colors"
                  aria-label="Share on Facebook"
                >
                  <i className="fab fa-facebook text-lg"></i>
                </button>
                <button
                  onClick={() => handleShare("whatsapp")}
                  className="text-[#8b4513] hover:text-[#2c1810] transition-colors"
                  aria-label="Share on WhatsApp"
                >
                  <i className="fab fa-whatsapp text-lg"></i>
                </button>
                <button
                  onClick={() => handleShare("twitter")}
                  className="text-[#8b4513] hover:text-[#2c1810] transition-colors"
                  aria-label="Share on Twitter"
                >
                  <i className="fab fa-twitter text-lg"></i>
                </button>
                <button
                  onClick={() => handleShare("email")}
                  className="text-[#8b4513] hover:text-[#2c1810] transition-colors"
                  aria-label="Share via Email"
                >
                  <i className="fa fa-envelope text-lg"></i>
                </button>
                <button
                  onClick={() => handleShare("copy")}
                  className="text-[#8b4513] hover:text-[#2c1810] transition-colors relative"
                  aria-label="Copy to clipboard"
                >
                  <i className="fa fa-copy text-lg"></i>
                  {showCopySuccess && (
                    <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 text-xs text-[#2c1810] bg-white px-2 py-1 rounded shadow-sm">
                      Copied!
                    </span>
                  )}
                </button>
              </div>
            </div>

            <div className="mt-8 text-center flex flex-col items-center gap-3">
              <button
                onClick={handleDonationClick}
                className="bg-[#8b4513] text-white px-8 py-3 rounded-lg transform transition hover:scale-105 flex items-center justify-center gap-2 mx-auto"
              >
                <i className="fa fa-heart"></i>
                Support Our Mission
              </button>
              <a
                href="/donate"
                className="text-[#8b4513] hover:text-[#2c1810] transition-colors font-crimson-text text-lg underline decoration-1 underline-offset-4"
              >
                Find out More
              </a>
            </div>

            <div className="mt-12 flex justify-center space-x-8">
              <i className="fa fa-cross text-4xl text-[#8b4513]"></i>
              <i className="fa fa-church text-4xl text-[#8b4513]"></i>
              <i className="fa fa-book-bible text-4xl text-[#8b4513]"></i>
            </div>
          </div>
        </div>
      </div>

      {showDonationPopup && (
        <>
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={() => setShowDonationPopup(false)}
          />
          <PaymentForm setShowDonationPopup={handleShowDonation} />
        </>
      )}
      {isMobile && <DonationPage />}
    </LanguageContextProvider>
    </>
  );
}

function StoryComponent() {
  return (
    <LanguageContextProvider>
      <MainPage initialContent="Blessed are the pure in heart, for they shall see God. - Matthew 5:8" />
    </LanguageContextProvider>
  );
}

export default MainPage;