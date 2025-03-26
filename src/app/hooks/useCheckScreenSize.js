import { useState, useEffect } from "react";

const useCheckScreenSize = (breakpoint = 768) => {
  const [isMobile, setIsMobile] = useState(false); // Set default state to false

  useEffect(() => {
    if (typeof window !== "undefined") { // Ensure window exists (only in browser)
      const checkScreenSize = () => {
        setIsMobile(window.innerWidth <= breakpoint);
      };

      checkScreenSize(); // Check on mount
      window.addEventListener("resize", checkScreenSize);

      return () => window.removeEventListener("resize", checkScreenSize);
    }
  }, [breakpoint]);

  return isMobile;
};

export default useCheckScreenSize;
