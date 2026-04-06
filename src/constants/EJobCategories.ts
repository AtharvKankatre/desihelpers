export const LocalJobCategories = {
  homeBabyCare: "Home/Baby Care",
  catering: "Catering",
  eventHelp: "Event Help",
  tutoring: "Tutoring",
  hourlyJob: "Hourly Jobs",
};

export const returnSubCategories = (key: string) => {
  const map: Record<string, Array<string>> = {
    homeBabyCare: ["Nanny", "Mother's Help"],
    catering: [
      "Personal Chef",
      "Tiffin",
      "Caterers",
      "Speciality Items",
      "Live Counters",
    ],
    eventHelp: [
      "Astrologer",
      "Decoration",
      "Entertainers",
      "Henna Artist",
      "Photographers",
      "Pujari",
      "Servers",
      "Event Planners",
    ],
    tutoring: ["Maths/Science", "Certificate Exams", "Music", "Other"],
    hourlyJob: ["Gas Station Jobs", "Store Jobs", "Other jobs"],
  };

  return map[key] ?? ["1", "2"];
};

export const STATIC_JOB_CATEGORIES = [
  {
    name: "Baking",
    id: "baking",
    subCategories: [
      "Cake Bakers",
      "Speciality Deserts",
    ],
  },
  {
    name: "Event Help",
    id: "event-help",
    subCategories: [
      "Astrologers",
      "Decorators",
      "Entertainers",
      "Henna Artists",
      "Photographers",
      "Priests",
      "Servers",
      "Event Planners",
      "Music DJs",
      "Beauticians",
    ],
  },
  {
    name: "Catering",
    id: "catering",
    subCategories: [
      "Personal Chef",
      "Tiffin",
      "Caterers",
      "Speciality Items",
      "Live Counters",
    ],
  },
  {
    name: "Tutoring",
    id: "tutoring",
    subCategories: [
      "Maths/Science",
      "Certificate Exams",
      "Music",
      "Others",
      "Yoga",
      "Dance",
    ],
  },
  {
    name: "Home & Baby Care",
    id: "home-baby-care",
    subCategories: [
      "Nanny",
      "Mother's Helper",
      "Carpet Cleaners",
      "House Cleaners",
      "Pack/Move Services",
      "Landscaping Services",
      "Day Care Center",
    ],
  },
  {
    name: "Professionals",
    id: "professionals",
    subCategories: [
      "Gas Station Jobs",
      "Store Jobs",
      "Other Jobs",
      "Airport pick/drop",
      "CPA/TAX",
      "Legal",
      "Notary",
    ],
  },
];
