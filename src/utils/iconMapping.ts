

/**
 * Legacy: old /assets/ icon mapping — kept for backward compatibility.
 */
export const categoryIconMap: { [key: string]: string } = {
    "babysitting": "/assets/icons/categories/nanny.svg",
    "nanny": "/assets/icons/categories/nanny.svg",
    "home n baby care": "/assets/icons/categories/nanny.svg",
    "cooking": "/assets/icons/categories/chef.svg",
    "cook": "/assets/icons/categories/chef.svg",
    "personal chef": "/assets/icons/categories/chef.svg",
    "catering": "/assets/icons/categories/chef.svg",
    "caterer": "/assets/icons/categories/chef.svg",
    "cleaning": "/assets/icons/categories/cleaner.svg",
    "house cleaner": "/assets/icons/categories/cleaner.svg",
    "house cleaners": "/assets/icons/categories/cleaner.svg",
    "tutoring": "/assets/icons/categories/chef.svg",
    "teacher": "/assets/icons/categories/chef.svg",
    "tutor": "/assets/icons/categories/chef.svg",
    "movers": "/assets/icons/categories/movers.svg",
    "movers/packers": "/assets/icons/categories/movers.svg",
    "mover": "/assets/icons/categories/movers.svg",
    "bakers": "/assets/icons/categories/baker.svg",
    "cake baker": "/assets/icons/categories/baker.svg",
    "cake bakers": "/assets/icons/categories/baker.svg",
    "servers": "/assets/icons/categories/server.svg",
    "server": "/assets/icons/categories/server.svg",
    "tiffin": "/assets/icons/categories/tiffin.svg",
    "tiffin-services": "/assets/icons/categories/tiffin.svg",
    "tiffin services": "/assets/icons/categories/tiffin.svg",
    "airport taxi": "/assets/icons/categories/movers.svg",
    "astrology": "/assets/icons/categories/chef.svg",
    "beautician": "/assets/icons/categories/mothers_helper.svg",
    "entertainer": "/assets/icons/categories/server.svg",
    "heena artist": "/assets/icons/categories/mothers_helper.svg",
    "landscaping": "/assets/icons/categories/cleaner.svg",
    "live counter": "/assets/icons/categories/chef.svg",
    "party": "/assets/icons/categories/server.svg",
    "photo": "/assets/icons/categories/server.svg",
    "priests": "/assets/icons/categories/chef.svg",
    "store jobs": "/assets/icons/categories/server.svg",
    "yoga": "/assets/icons/categories/mothers_helper.svg",
    "mother's helper": "/assets/icons/categories/mothers_helper.svg",
    "professionals": "/assets/icons/categories/server.svg",
};

/**
 * Gets the optimized icon path for a given category name.
 * Falls back to the provided default icon if no mapping is found.
 */
export const getOptimizedIcon = (category: string, defaultIcon: string = "/assets/icons/categories/server.svg"): string => {
    if (!category) return defaultIcon;
    const normalized = category.toLowerCase().trim();
    return categoryIconMap[normalized] || defaultIcon;
};
