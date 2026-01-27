import { useState, useEffect, useCallback } from "react";

type Breakpoints = {
  mobile: number;
  tablet: number;
  desktop: number;
};

export const useAppMediaQuery = () => {
  const [matches, setMatches] = useState({
    mobile: false,
    tablet: false,
    desktop: false,
    desktopLarge: false,
  });

  const updateMatches = useCallback(() => {
    const mobile = window.matchMedia(`(max-width: ${480}px)`).matches;
    const tablet = window.matchMedia(`(max-width: ${1024}px)`).matches;
    const desktop = window.matchMedia(`(max-width: ${1440}px)`).matches;
    const desktopLarge = window.matchMedia(`(max-width: ${3440}px)`).matches;

    setMatches({ mobile, tablet, desktop, desktopLarge });
  }, []);

  useEffect(() => {
    updateMatches(); // Set initial match state

    // Add event listeners for each media query
    const mobileMedia = window.matchMedia(`(max-width: ${480}px)`);
    const tabletMedia = window.matchMedia(`(max-width: ${1024}px)`);
    const desktopMedia = window.matchMedia(`(max-width: ${1440}px)`);
    const desktopLargeMedia = window.matchMedia(`(max-width: ${3440}px)`);

    mobileMedia.addEventListener("change", updateMatches);
    tabletMedia.addEventListener("change", updateMatches);
    desktopMedia.addEventListener("change", updateMatches);
    desktopLargeMedia.addEventListener("change", updateMatches);

    // Cleanup listeners on unmount
    return () => {
      mobileMedia.removeEventListener("change", updateMatches);
      tabletMedia.removeEventListener("change", updateMatches);
      desktopMedia.removeEventListener("change", updateMatches);
      desktopLargeMedia.removeEventListener("change", updateMatches);
    };
  }, [updateMatches]);

  return matches;
};

// Usage example
