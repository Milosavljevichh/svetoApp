import Link from 'next/link';
import LanguageContextProvider from './LanguageProvider';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import '../i18n/i18n'; // Import the i18n setup

const Header = ({selectedLanguage, changeLanguage}) => {
  
  const { t, i18n } = useTranslation();

  useEffect(() => {
    i18n.changeLanguage(selectedLanguage);
  }, [selectedLanguage]);

  return (
    <header className="bg-[#2c1810] text-white p-4 z-10 relative">
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
    </header>
  );
};

export default Header;
