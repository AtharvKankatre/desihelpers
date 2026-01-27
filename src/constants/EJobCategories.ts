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
