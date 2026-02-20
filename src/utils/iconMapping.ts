// Mapping of service category names to high-quality optimized icons
export const categoryIconMap: { [key: string]: string } = {
    "babysitting": "/assets/daycare-center.png",
    "nanny": "/assets/daycare-center.png",
    "cooking": "/assets/personal-chef.png",
    "cook": "/assets/personal-chef.png",
    "cleaning": "/assets/house_cleaner.png",
    "house cleaner": "/assets/house_cleaner.png",
    "tutoring": "/assets/teacher.png",
    "teacher": "/assets/teacher.png",
    "movers": "/assets/mover-packer.png",
    "movers/packers": "/assets/mover-packer.png",
    "bakers": "/assets/cake-baker.png",
    "cake baker": "/assets/cake-baker.png",
    "servers": "/assets/server.png",
    "server": "/assets/server.png",
    "tiffin": "/assets/tiffin-services.png",
    "tiffin-services": "/assets/tiffin-services.png",
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
    "mother's helper": "/assets/mothers_helper.png",
};

/**
 * Gets the optimized icon path for a given category name.
 * Falls back to the provided default icon if no mapping is found.
 */
export const getOptimizedIcon = (category: string, defaultIcon: string = "/assets/icons/icon_help.svg"): string => {
    if (!category) return defaultIcon;
    const normalized = category.toLowerCase().trim();
    return categoryIconMap[normalized] || defaultIcon;
};
