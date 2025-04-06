
import React from "react";
import { useState, useEffect } from "react";
import { detectLanguageFromIP } from '../../utilities/getLanguageFromIP';

function LanguageContextProvider({ children, selectedLanguage, changeLanguage }) {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [languages, setLanguages] = useState({
      en: { name: "English", flag: "🇬🇧" },
      sr: { name: "Serbian", flag: "🇷🇸" },
      srCy: { name: "Serbian (Ћирилица)", flag: "🇷🇸" },
      ru: { name: "Russian", flag: "🇷🇺" },
      el: { name: "Greek", flag: "🇬🇷" },
      bg: { name: "Bulgarian", flag: "🇧🇬" },
    })

    function sortLanguages(country){
      let sortedLang;
      switch(country){
        case "sr":
          sortedLang = {
            srCy: { name: "Serbian (Ћирилица)", flag: "🇷🇸" },
            sr: { name: "Serbian", flag: "🇷🇸" },
            el: { name: "Greek", flag: "🇬🇷" },
            ru: { name: "Russian", flag: "🇷🇺" },
            bg: { name: "Bulgarian", flag: "🇧🇬" },
            en: { name: "English", flag: "🇬🇧" },
          };
          break
          case "srCy":
            sortedLang = {
              srCy: { name: "Serbian (Ћирилица)", flag: "🇷🇸" },
              sr: { name: "Serbian", flag: "🇷🇸" },
              el: { name: "Greek", flag: "🇬🇷" },
              ru: { name: "Russian", flag: "🇷🇺" },
              bg: { name: "Bulgarian", flag: "🇧🇬" },
              en: { name: "English", flag: "🇬🇧" },
            };
            break
        case "en":
          sortedLang = {
            en: { name: "English", flag: "🇬🇧" },
            el: { name: "Greek", flag: "🇬🇷" },
            bg: { name: "Bulgarian", flag: "🇧🇬" },
            srCy: { name: "Serbian (Ћирилица)", flag: "🇷🇸" },
            sr: { name: "Serbian", flag: "🇷🇸" },
            ru: { name: "Russian", flag: "🇷🇺" },
          };
          break
        case "el":
          sortedLang = {
            el: { name: "Greek", flag: "🇬🇷" },
            srCy: { name: "Serbian (Ћирилица)", flag: "🇷🇸" },
            sr: { name: "Serbian", flag: "🇷🇸" },
            ru: { name: "Russian", flag: "🇷🇺" },
            en: { name: "English", flag: "🇬🇧" },
            bg: { name: "Bulgarian", flag: "🇧🇬" },
          };
          break
        case "ru":
          sortedLang = {
            ru: { name: "Russian", flag: "🇷🇺" },
            srCy: { name: "Serbian (Ћирилица)", flag: "🇷🇸" },
            sr: { name: "Serbian", flag: "🇷🇸" },
            el: { name: "Greek", flag: "🇬🇷" },
            bg: { name: "Bulgarian", flag: "🇧🇬" },
            en: { name: "English", flag: "🇬🇧" },
          };
          break
          case "bg":
            sortedLang = {
              bg: { name: "Bulgarian", flag: "🇧🇬" },
              en: { name: "English", flag: "🇬🇧" },
              ru: { name: "Russian", flag: "🇷🇺" },
              srCy: { name: "Serbian (Ћирилица)", flag: "🇷🇸" },
              sr: { name: "Serbian", flag: "🇷🇸" },
              el: { name: "Greek", flag: "🇬🇷" },
            };
            break
        default:
          sortedLang = {
            en: { name: "English", flag: "🇬🇧" },
            sr: { name: "Serbian", flag: "🇷🇸" },
            srCy: { name: "Serbian (Ћирилица)", flag: "🇷🇸" },
            ru: { name: "Russian", flag: "🇷🇺" },
            el: { name: "Greek", flag: "🇬🇷" },
            bg: { name: "Bulgarian", flag: "🇧🇬" },
          };
        break
      }
      setLanguages(sortedLang)
    }
    
    useEffect(() => {
      let lang;
      let country;
      lang = localStorage.getItem("userLanguage");
      country = localStorage.getItem("userCountry");
      const getLanguage = async () => {
        if (!lang || !country) {
          lang = await detectLanguageFromIP();
          if (lang === "sr") {
            lang = "srCy";
            localStorage.setItem("userLanguage", "srCy");
          }
          country = lang;
        }
        changeLanguage(lang);
        localStorage.setItem("userLanguage", lang);
        localStorage.setItem("userCountry", country);
      };
  
      getLanguage();
      sortLanguages(country);
    }, []);
    
    return (
      <div className="z-100"> 
        <div>
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
                        localStorage.setItem("userLanguage", code);
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