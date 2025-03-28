"use client";
import './globals.css';
import React from "react";
import { useState, useEffect, useRef } from "react";
import Header from "./components/Header";
import DonationPage from "./DonatePage/page";
import '@fortawesome/fontawesome-free/css/all.css';
import PaymentForm from './components/PaymentForm';
import LanguageContextProvider from './components/LanguageProvider';
import TextToSpeech from './components/TTS';
import { useTranslation } from 'react-i18next';
import './i18n/i18n';
import useCheckScreenSize from './hooks/useCheckScreenSize';
import useTextToSpeech from './hooks/useTextToSpeech';
import SuggestedQuestions from './components/SuggestedQuestions';
import ShareButtons from './components/ShareButtons';
import useChatGPT from './hooks/useChatGPT';
import generatePrompt from '@/utilities/generatePrompt';

function MainPage({
}) {

  const [selectedLanguage, setSelectedLanguage] = useState("en");
  const { t, i18n } = useTranslation();
  const isMobile = useCheckScreenSize()

  const icons = {
    cross: "fa fa-cross",
    book: "fa fa-book-bible",
    prayer: "fa fa-praying-hands",
  };
    const initialContent = "Welcome to your daily spiritual guide. Let me begin with a prayer for you."

  const [userContent, setUserContent] = useState("");
  const [textAreaContent, setTextAreaContent] = useState("");
  const [icon, setIcon] = useState("cross");
  const [isLanguageLoaded, setIsLanguageLoaded] = useState(false)
  const [previousContent, setPreviousContent] = useState([initialContent]);
  const { generateTTS, isAudioLoading } = useTextToSpeech();
  const [showDonationPopup, setShowDonationPopup] = useState(false);
  const { isLoading, error, messages, fetchChatGPT, generateDailyPrayer, streamingMessage, promptContent } = useChatGPT();
  
  useEffect(() => {
    i18n.changeLanguage(selectedLanguage);
  }, [selectedLanguage]);

  useEffect(() => {
    if (isLanguageLoaded) {
      generateDailyPrayer(generatePrompt("Generate today's Orthodox prayer", selectedLanguage));
    }
  }, [isLanguageLoaded]);

  useEffect(()=>{
    if (userContent) {
      refreshContent(userContent)
    }
  }, [userContent])

  const refreshContent = async (prompt) => {
    if (isLoading) return;
    const randomIcon = Object.keys(icons)[Math.floor(Math.random() * 3)];
    setIcon(randomIcon);

    const newPrompt = generatePrompt(prompt, selectedLanguage);
    await fetchChatGPT(newPrompt, `You are an Orthodox Christian assistant. Provide detailed answers or prayers based on user-selected topics. Each response should align with Orthodox teachings and:
                          - For icon questions: Explain their spiritual significance, proper veneration, and historical context
                          - For healing prayers: Provide traditional Orthodox prayers for healing, including references to saints known for healing
                          - For fasting questions: Explain Orthodox fasting traditions, spiritual benefits, and practical guidance
                          Always maintain a reverent tone and include relevant scripture or patristic quotes.`);
    
    setPreviousContent((prev) => [...prev.slice(-4), newPrompt]);
  };

  const handleDonationClick = () => {
    setShowDonationPopup(true);
  };

  function handleShowDonation(bool){
    setShowDonationPopup(bool)
  }

  function changeLanguage(lang){
    setSelectedLanguage(lang)
    setIsLanguageLoaded(true)
  }

  function generateNewPrayer() {
    const prayerPrompt = "Give me a prayer from the prayer book whos official publisher is the church in the format of [Name of the prayer]: [prayer]. It should differ from" + previousContent
    refreshContent(prayerPrompt)
  }

  function explainConcept(word) {
    const concept = `You mentioned ${word} when you said ${promptContent}. Can you explain to me what ${word} is and inform me more about it?`
    console.log(concept)
    refreshContent(concept)
  }
  
  return (
    <>
      <Header selectedLanguage={selectedLanguage} changeLanguage={changeLanguage} />
      <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-[#f8f5f0]">
        <div className="fixed inset-0 z-0 w-full h-full">
          <img
            src="https://ucarecdn.com/2378599d-07bd-4033-851d-f94d7cb32508/-/format/auto/"
            alt="Orthodox background with religious imagery"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-[#f8f5f0] bg-opacity-90"></div>
        </div>
        <div className="max-w-4xl w-full text-center space-y-8 z-10">
          <div className="space-y-4">
            <h1 className="text-4xl md:text-6xl font-crimson-text text-[#8b4513] mt-4">
              {t('homePage.title')}
            </h1>

            <p className="text-xl md:text-2xl font-crimson-text text-[#5c4030] leading-relaxed px-4">
              {t('homePage.welcome')}
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
                {t('homePage.todaysPrayer')}
              </h2>
              <div
                className={`bg-[#8b4513] w-fit text-white p-2 rounded-lg transform transition hover:scale-105 flex items-center justify-center transition-opacity duration-500 ${
                  isLoading ? "opacity-50" : "opacity-100"
                } mx-auto`}
                onClick={() => { isLoading ? null : generateNewPrayer()}}
              >
                <i className="fa fa-pray text-2xl text-white"></i>
              </div>
            </div>

            <div
              className={`flex items-center justify space-x-4 transition-opacity duration-500 mb-8 ${
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
                        explainConcept(word)
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

            <div className={isMobile ? "flex flex-col justify-center items-center space-x-4 mb-8" : "flex justify-center space-x-4 mb-8"}>  
              <button
                onClick={() => {
                  setUserContent(
                    "What is the significance of icons in Orthodox Christianity?"
                  );
                  setTextAreaContent("")
                }}
                className={isMobile ? "flex items-center space-x-2 text-[#8b4513] hover:text-[#6b3410] transition-colors font-crimson-text text-lg ml-4" : "flex items-center space-x-2 text-[#8b4513] hover:text-[#6b3410] transition-colors font-crimson-text text-lg"}
              >
                <i className="fa fa-image"></i>
                <span>{t('homePage.aboutIcons')}</span>
              </button>

              <button
                onClick={() => {
                  setUserContent("Provide a prayer for healing.");
                  setTextAreaContent("")
                }}
                className="flex items-center space-x-2 text-[#8b4513] hover:text-[#6b3410] transition-colors font-crimson-text text-lg"
              >
                <i className="fa fa-pray"></i>
                <span>{t('homePage.healingPrayer')}</span>
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
                <span>{t('homePage.aboutFasting')}</span>
              </button>
            </div>
            <TextToSpeech selectedLanguage={selectedLanguage} text={promptContent} isAudioLoading={isAudioLoading} isLoading={isLoading} />

            <div className="flex flex-col space-y-4 w-full max-w-2xl mx-auto">
              <div className="relative">
                <textarea
                  placeholder={t('homePage.placeholder')}
                  onChange={(e) => setTextAreaContent(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      setUserContent(textAreaContent)
                      setTextAreaContent("")
                    }
                  }}
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
                <SuggestedQuestions setUserContent={setUserContent} setTextAreaContent={setTextAreaContent} />
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-[#8b4513] border-opacity-20">
              <p className="text-sm font-crimson-text text-[#5c4030] mb-3">
                {t('homePage.share')}
              </p>
              <ShareButtons streamingMessage={streamingMessage} promptContent={promptContent} error={error} />
            </div>

            <div className="mt-8 text-center flex flex-col items-center gap-3">
              <button
                onClick={handleDonationClick}
                className="bg-[#8b4513] text-white px-8 py-3 rounded-lg transform transition hover:scale-105 flex items-center justify-center gap-2 mx-auto"
              >
                <i className="fa fa-heart"></i>
                {t('homePage.support')}
              </button>
              <a
                href="/DonatePage"
                className="text-[#8b4513] hover:text-[#2c1810] transition-colors font-crimson-text text-lg underline decoration-1 underline-offset-4"
              >
                {t('homePage.more')}
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
          <PaymentForm setShowDonationPopup={handleShowDonation} selectedLanguage={selectedLanguage} />
        </>
      )}
      {isMobile && <DonationPage />}
    </>
  );
}

export default MainPage;