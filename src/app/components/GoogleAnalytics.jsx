"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import ReactGA from "react-ga4";

const GA_TRACKING_ID = "G-767RS5X2MQ";

const GoogleAnalytics = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    ReactGA.initialize(GA_TRACKING_ID);
  }, []);

  useEffect(() => {
    if (pathname) {
      ReactGA.send({ hitType: "pageview", page: pathname + searchParams.toString() });
    }
  }, [pathname, searchParams]);

  return null;
};

export default GoogleAnalytics;
