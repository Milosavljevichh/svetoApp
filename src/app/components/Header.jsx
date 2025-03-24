import Link from 'next/link';
import LanguageContextProvider from './LanguageProvider';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import '../i18n/i18n'; // Import the i18n setup

const Header = ({selectedLanguage, changeLanguage}) => {
  
  const { t, i18n } = useTranslation();
  const [isMobile, setIsMobile] = useState(false);
  const [isOpenDrawer, setIsOpenDrawer] = useState(false);
  
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkScreenSize(); // Check on mount
    window.addEventListener("resize", checkScreenSize); // Listen for resize

    return () => window.removeEventListener("resize", checkScreenSize); // Cleanup
  }, []);

  useEffect(() => {
    i18n.changeLanguage(selectedLanguage);
  }, [selectedLanguage]);

  return (
    <header className="bg-[#2c1810] text-white p-4 z-20 relative">
      {
        !isMobile ? (
          <>
            <nav className="flex items-center px-5">
              <div className="text-2xl font-crimson-text">
                <Link href="/" className="hover:text-[#8b4513]">
                  {t('header.home')}
                </Link>
              </div>
              <div className="text-2xl font-crimson-text">
                <Link href="/DonatePage" className="hover:text-[#8b4513] m-4">
                  {t('header.donate')}
                </Link>
              </div>
            </nav>
            <LanguageContextProvider selectedLanguage={selectedLanguage} changeLanguage={changeLanguage}  />
          </>
        ) : (
          <>
          <button
          onClick={() => setIsOpenDrawer(true)}
          className="hover:text-[#2c1810] transition-colors flex justify-center items-center"
          >
            <i class="fa-solid fa-bars text-xl"></i>
          </button>
          {
            isOpenDrawer && (
              <nav className='fixed top-0 left-0 w-screen h-screen bg-[#2c1810] text-white p-4 pt-[35%] z-20 flex flex-col gap-[24px] items-start justify-start'>
                <button
                  onClick={() => setIsOpenDrawer(false)}
                  className="absolute top-4 left-4 hover:text-[#2c1810] transition-colors"
                >
                  <i className="fa fa-times text-xl"></i>
                </button>
                <div className="text-2xl font-crimson-text">
                  <Link href="/" onClick={() => setIsOpenDrawer(false)} className="hover:text-[#8b4513] border-b-2 pb-1">
                    {t('header.home')}
                  </Link>
                </div>
                <div className="text-2xl font-crimson-text">
                  <Link href="#donate" onClick={() => setIsOpenDrawer(false)} className="hover:text-[#8b4513] border-b-2 pb-1">
                    {t('header.donate')}
                  </Link>
                </div>
                <LanguageContextProvider selectedLanguage={selectedLanguage} changeLanguage={changeLanguage}  />
              </nav>
            )
          }
          </>
        )
      }
    </header>
  );
};

export default Header;
