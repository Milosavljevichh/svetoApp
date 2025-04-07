import { useTranslation } from 'react-i18next';
import '../i18n/i18n'; // Import the i18n setup

export default function CommunityPrompt({ setShowPopup }) {
  const { t, i18n } = useTranslation();
    return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50"
        onClick={() => setShowPopup(false)}
      >
        <div
          className="bg-[#f8f5f0] rounded-lg shadow-xl max-w-md w-full p-6 relative max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()} 
        >
          <button
            onClick={() => setShowPopup(false)}
            className="absolute top-4 right-4 text-[#8b4513] hover:text-[#2c1810] transition-colors"
          >
            <i className="fa fa-times text-xl"></i>
          </button>
  
          <h2 className="text-2xl font-crimson-text text-[#2c1810] mb-6 text-center">
          {t('donationPage.underDev.title')}
          </h2>
  
          <p className="text-center">
            {t('donationPage.underDev.content')}
          </p>
        </div>
      </div>
    );
  }
  