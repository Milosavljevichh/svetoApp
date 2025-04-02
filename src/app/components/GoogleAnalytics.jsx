"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import ReactGA from "react-ga4";

const GA_TRACKING_ID = process.env.GA_TRACKING_ID;

const GoogleAnalytics = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Initialize GA only once on the client side
  useEffect(() => {
    if (typeof window !== "undefined") { // Ensure this runs only on the client
      ReactGA.initialize(GA_TRACKING_ID);
    }
  }, []); // Empty dependency array ensures it runs only once

  // Track page view changes
  useEffect(() => {
    if (pathname) {
      const page = pathname + (searchParams ? `?${searchParams.toString()}` : "");
      ReactGA.send({ hitType: "pageview", page });
    }
  }, [pathname, searchParams]); // Track when pathname or search params change

  return null;
};

export default GoogleAnalytics;
