import { useState } from "react";

const useShare = (shareText, shareUrl) => {
  const [showCopySuccess, setShowCopySuccess] = useState(false);

  const handleShare = async (platform) => {
    switch (platform) {
      case "facebook":
        window.open(
          `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(shareText)}`,
          "_blank"
        );
        break;
      case "twitter":
        window.open(
          `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`,
          "_blank"
        );
        break;
      case "whatsapp":
        window.open(
          `https://wa.me/?text=${encodeURIComponent(`${shareText} ${shareUrl}`)}`,
          "_blank"
        );
        break;
      case "email":
        window.open(
          `mailto:?subject=Orthodox Prayer&body=${encodeURIComponent(`${shareText}\n\n${shareUrl}`)}`,
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
      default:
        console.error("Unsupported share platform:", platform);
    }
  };

  return { handleShare, showCopySuccess };
};

export default useShare;
