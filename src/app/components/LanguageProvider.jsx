
import React from "react";
import { useState, useEffect } from "react";
import { detectLanguageFromIP } from '@/utilities/getLanguageFromIP';

function LanguageContextProvider({ children, selectedLanguage, changeLanguage }) {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
    const languages = {
      en: { name: "English", flag: "🇬🇧" },
      sr: { name: "Serbian", flag: "🇷🇸" },
      ru: { name: "Russian", flag: "🇷🇺" },
      el: { name: "Greek", flag: "🇬🇷" },
      bg: { name: "Bulgarian", flag: "🇧🇬" },
    };
  
    useEffect(() => {
      const getLanguage = async () => {
        const lang = await detectLanguageFromIP();
        changeLanguage(lang);
      };
  
      getLanguage();
    }, []);
  
    return (
      <div className="relative min-h-screen"> 
        <div className="fixed inset-0 z-0">
          <img
            src="https://ucarecdn.com/2378599d-07bd-4033-851d-f94d7cb32508/-/format/auto/"
            alt="Orthodox background with religious imagery"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-[#f8f5f0] bg-opacity-90"></div>
        </div>
        <div className="absolute top-4 right-4 z-20">
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="bg-[#8b4513] text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-[#6b3410] transition-colors"
            >
              <span>{languages[selectedLanguage].flag}</span>
              <span>{languages[selectedLanguage].name}</span>
              <i
                className={`fa fa-chevron-${
                  isDropdownOpen ? "up" : "down"
                } ml-2`}
              ></i>
            </button>
  
            {isDropdownOpen && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setIsDropdownOpen(false)}
                />
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl z-20 border-2 border-[#8b4513] overflow-hidden">
                  {Object.entries(languages).map(([code, { name, flag }]) => (
                    <button
                      key={code}
                      onClick={() => {
                        changeLanguage(code);
                        setIsDropdownOpen(false);
                      }}
                      className={`w-full px-4 py-3 text-left flex items-center gap-2 hover:bg-[#8b4513] hover:text-white transition-colors ${
                        selectedLanguage === code
                          ? "bg-[#8b4513] text-white"
                          : "text-[#2c1810]"
                      }`}
                    >
                      <span>{flag}</span>
                      <span className="font-crimson-text">{name}</span>
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
        <div className="relative z-10">{children}
        </div>
      </div>
    );
  }

  export default LanguageContextProvider;