/**
 * Legacy: old /assets/ icon mapping — kept for backward compatibility.
 * Updated to point to newillustration folder SVGs for the matching categories.
 */
export const categoryIconMap: { [key: string]: string } = {
    "babysitting": "/newillustration/Group 1000004166.svg",
    "nanny": "/newillustration/Group 1000004170.svg",
    "home n baby care": "/newillustration/Group 1000004170.svg",
    "cooking": "/newillustration/Property 1=personal-chef.svg",
    "cook": "/newillustration/Property 1=personal-chef.svg",
    "personal chef": "/newillustration/Property 1=personal-chef.svg",
    "catering": "/newillustration/Property 1=personal-chef.svg",
    "caterer": "/newillustration/Property 1=personal-chef.svg",
    "cleaning": "/newillustration/Group (1).svg",
    "house cleaner": "/newillustration/Group (1).svg",
    "house cleaners": "/newillustration/Group (1).svg",
    "tutoring": "/newillustration/image 507.svg",
    "teacher": "/newillustration/image 507.svg",
    "tutor": "/newillustration/image 507.svg",
    "movers": "/newillustration/flat.svg",
    "movers/packers": "/newillustration/flat.svg",
    "mover": "/newillustration/flat.svg",
    "bakers": "/newillustration/Group 1000004165.svg",
    "cake baker": "/newillustration/Group 1000004165.svg",
    "cake bakers": "/newillustration/Group 1000004165.svg",
    "servers": "/newillustration/Group 1000004170.svg",
    "server": "/newillustration/Group 1000004170.svg",
    "tiffin": "/newillustration/Group.svg",
    "tiffin-services": "/newillustration/Group.svg",
    "tiffin services": "/newillustration/Group.svg",
    "airport taxi": "/assets/airport-taxi.png",
    "astrology": "/assets/astrology.png",
    "beautician": "/assets/beautician.png",
    "entertainer": "/assets/entertainer.png",
    "heena artist": "/assets/heena-artist.png",
    "landscaping": "/assets/landscaping.png",
    "live counter": "/assets/live_counter.png",
    "party": "/assets/party.png",
    "photo": "/assets/photo.png",
    "priests": "/assets/priests.png",
    "store jobs": "/assets/store-jobs.png",
    "yoga": "/assets/yoga.png",
    "mother's helper": "/newillustration/Group 1000004166.svg",
    "professionals": "/newillustration/Group 1000004170.svg",
    "daycare": "/assets/daycare-center.png",
    "daycare center": "/assets/daycare-center.png",
};

/**
 * Gets the optimized icon path for a given category name.
 * Falls back to the provided default icon if no mapping is found.
 */
export const getOptimizedIcon = (category: string, defaultIcon: string = "/newillustration/Group 1000004170.svg"): string => {
    if (!category) return defaultIcon;
    const normalized = category.toLowerCase().trim();
    return categoryIconMap[normalized] || defaultIcon;
};
