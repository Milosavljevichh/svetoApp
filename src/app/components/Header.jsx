import Link from 'next/link';
import LanguageContextProvider from './LanguageProvider';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import '../i18n/i18n'; // Import the i18n setup
import PageSwitchingArrows from './PageSwitchingArrows';
import HelpPrompt from './HelpPrompt';

const Header = ({selectedLanguage, changeLanguage}) => {
  
  const { t, i18n } = useTranslation();
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [isOpenDrawer, setIsOpenDrawer] = useState(false);
  const [isHelpPopupOpen, setIsHelpPopupOpen] = useState(false);
  
  useEffect(() => {
    const checkScreenSize = () => {
      const width = window.innerWidth;
      setIsMobile(width <= 768);
      setIsTablet(width > 768 && width <= 1024); // Tablet range
    };

    checkScreenSize(); // Check on mount
    window.addEventListener("resize", checkScreenSize); // Listen for resize

    return () => window.removeEventListener("resize", checkScreenSize); // Cleanup
  }, []);

  useEffect(()=>{
    if (isMobile || isTablet) setIsHelpPopupOpen(true)
  }, [isMobile, isTablet])

  useEffect(() => {
    i18n.changeLanguage(selectedLanguage);
  }, [selectedLanguage]);

  return (
    <header className="bg-[#2c1810] text-white p-4 z-20 relative">
      {isHelpPopupOpen && <HelpPrompt setShowPopup={setIsHelpPopupOpen} />}
      {
        !isMobile && !isTablet ? (
          <>
            <nav className="flex items-center justify-between px-5">
              <ul className='flex'>
                <li  className="text-2xl font-crimson-text">
                  <Link href="/" className="hover:text-[#8b4513]">
                    {t('header.home')}
                  </Link>
                </li>
                <li  className="text-2xl font-crimson-text">
                  <Link href="/DonatePage" className="hover:text-[#8b4513] m-4">
                    {t('header.donate')}
                  </Link>
                </li>
              </ul>
              <div className='flex items-center gap-6'>
                <button
                  onClick={()=>setIsHelpPopupOpen(true)}
                  className="hover:text-[#8b4513] transition-colors flex justify-center items-center"
                >
                  <i className="fa-solid fa-circle-info text-2xl"></i>
                </button>
                <LanguageContextProvider selectedLanguage={selectedLanguage} changeLanguage={changeLanguage}  />
              </div>
            </nav>
            <PageSwitchingArrows />
          </>
        ) : (
          <div className='flex gap-4'>
          <button
          onClick={() => setIsOpenDrawer(true)}
          className="hover:text-[#8b4513] transition-colors flex justify-center items-center"
          >
            <i className="fa-solid fa-bars text-2xl"></i>
          </button>
          <button
            onClick={()=>setIsHelpPopupOpen(true)}
            className="hover:text-[#8b4513] transition-colors flex justify-center items-center"
          >
            <i className="fa-solid fa-circle-info text-2xl"></i>
          </button>
          {
            isOpenDrawer && (
              <nav className={`fixed top-0 left-0 w-screen h-screen bg-[#2c1810] text-white p-4 pt-[35%] z-20 flex flex-col gap-[24px] ${isMobile ? "items-start" : "items-center"} justify-start`}>
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
          </div>
        )
      }
    </header>
  );
};

export default Header;
