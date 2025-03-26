import useShare from '../hooks/useShare';
import { useEffect, useState } from 'react';

function ShareButtons({streamingMessage, promptContent, error}){

    const [isClient, setIsClient] = useState(false);
    const shareText = error || streamingMessage || promptContent;
    const shareUrl = isClient ? window.location.href : "";
    const {handleShare, showCopySuccess} = useShare(shareText, shareUrl)

    useEffect(() => {
        setIsClient(true); // This runs only on the client side
    }, []);

    return(
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
    )
}

export default ShareButtons;