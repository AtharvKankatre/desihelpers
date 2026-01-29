import React, { useState, useRef } from "react";
import { useRouter } from "next/router";
import styles from "@/styles/HeroSection.module.css";
import { Routes } from "@/services/routes/Routes";
import { useAuth } from "@/services/authorization/AuthContext";
import Swal from "sweetalert2";

// Job card data matching the design
const jobCards = [
  {
    id: 1,
    title: "Nanny",
    description: "Nanny for 3-month-old baby",
    location: "Bothell, Washington",
    date: "Mon 25, 2025",
    rate: "$25-$35 / hr",
    image: "/assets/illustrations/nanny.png",
    urgent: true,
  },
  {
    id: 2,
    title: "Movers/Packers",
    description: "To shift our home furnitures",
    location: "Bothell, Washington",
    date: "Mon 25, 2025",
    rate: "-",
    image: "/assets/illustrations/movers.png",
    urgent: true,
  },
  {
    id: 3,
    title: "Mother's Helper",
    description: "House helper services",
    location: "Oakland, California",
    date: "Sep 12, 2025",
    rate: "-",
    image: "/assets/illustrations/mothers_helper.png",
    urgent: true,
  },
  {
    id: 4,
    title: "Tiffin",
    description: "Looking for Maharashtrian food",
    location: "Oakland, California",
    date: "Oct 1, 2025",
    rate: "-",
    image: "/assets/illustrations/tiffin.png",
    urgent: true,
  },
  {
    id: 5,
    title: "House Cleaners",
    description: "Office cleaning in Kirkland WA",
    location: "Issaquah, Washington",
    date: "Sep 12, 2025",
    rate: "$15-$25 / hr",
    image: "/assets/illustrations/house_cleaners.png",
    urgent: true,
  },
  {
    id: 6,
    title: "Cake Bakers",
    description: "Cake Bakers Services",
    location: "Adair County, Kentucky",
    date: "Sep 19, 2025",
    rate: "$25-$35 / hr",
    image: "/assets/illustrations/cake_bakers.png",
    urgent: true,
  },
  {
    id: 7,
    title: "Servers",
    description: "need servers to serve in party",
    location: "Morrisville, Pennsylvania",
    date: "Jul 1, 2025",
    rate: "$15-$25 / hr",
    image: "/assets/illustrations/servers.png",
    urgent: true,
  },
];

// Word cloud words for background effect - matching design exactly with multilingual text
const wordCloudItems = [
  // Top row
  { text: "Caterer", top: "5%", left: "3%", size: "22px" },
  { text: "छात्र", top: "3%", left: "18%", size: "18px" },
  { text: "Tutor", top: "8%", left: "32%", size: "20px" },
  { text: "आया", top: "5%", left: "48%", size: "24px" },
  { text: "Helper", top: "8%", left: "65%", size: "18px" },
  { text: "सफाई", top: "3%", left: "82%", size: "20px" },

  // Second row
  { text: "आया", top: "18%", left: "5%", size: "26px" },
  { text: "Cook", top: "20%", left: "22%", size: "16px" },
  { text: "रसोइया", top: "22%", left: "55%", size: "18px" },
  { text: "Server", top: "18%", left: "75%", size: "16px" },

  // Third row
  { text: "Tutor", top: "35%", left: "2%", size: "18px" },
  { text: "शिक्षक", top: "38%", left: "15%", size: "20px" },
  { text: "Mover", top: "40%", left: "85%", size: "16px" },
  { text: "पैकर", top: "35%", left: "92%", size: "18px" },

  // Fourth row (near cards)
  { text: "Cleaner", top: "55%", left: "1%", size: "16px" },
  { text: "नानी", top: "58%", left: "12%", size: "20px" },
  { text: "Helper", top: "55%", left: "88%", size: "18px" },
  { text: "सर्वर", top: "58%", left: "95%", size: "16px" },

  // Bottom row
  { text: "Driver", top: "75%", left: "4%", size: "18px" },
  { text: "Tutor", top: "78%", left: "18%", size: "16px" },
  { text: "बेकर", top: "82%", left: "35%", size: "22px" },
  { text: "Caterer", top: "80%", left: "55%", size: "16px" },
  { text: "पाचक", top: "78%", left: "72%", size: "20px" },
  { text: "Packer", top: "82%", left: "88%", size: "16px" },
];

export const HeroSection: React.FC = () => {
  const router = useRouter();
  const { isActive, isProfileBuild } = useAuth();
  const [activeTab, setActiveTab] = useState<"findJob" | "hireSomeone">("findJob");
  const carouselRef = useRef<HTMLDivElement>(null);

  const handleCardClick = (jobTitle: string) => {
    if (!isActive) {
      Swal.fire({
        title: "Alert",
        text: "Please login to view job details",
        icon: "warning",
        confirmButtonText: "OK",
      }).then((result) => {
        if (result.isConfirmed) {
          router.push("/Login");
        }
      });
    } else if (!isProfileBuild) {
      Swal.fire({
        icon: "warning",
        title: "Profile Incomplete",
        text: "Please build your profile first.",
        confirmButtonText: "OK",
        confirmButtonColor: "#3085d6",
      });
    } else {
      router.push(Routes.mapSearch);
    }
  };

  const handleRegister = () => {
    if (!isActive) {
      router.push("/Login");
    } else {
      router.push(Routes.mapSearch);
    }
  };

  const handleExploreJobs = () => {
    router.push(Routes.mapSearch);
  };

  const scrollCarousel = (direction: "left" | "right") => {
    if (carouselRef.current) {
      const cardWidth = 171; // card width + gap
      const scrollAmount = cardWidth * 2; // Scroll 2 cards at a time

      carouselRef.current.scrollTo({
        left: carouselRef.current.scrollLeft + (direction === "left" ? -scrollAmount : scrollAmount),
        behavior: "smooth",
      });
    }
  };

  // Auto-scroll effect for infinite feel
  React.useEffect(() => {
    const interval = setInterval(() => {
      if (carouselRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;

        // If reached the end, reset to beginning smoothly
        if (scrollLeft + clientWidth >= scrollWidth - 10) {
          carouselRef.current.scrollTo({ left: 0, behavior: "smooth" });
        } else {
          // Auto-scroll one card
          carouselRef.current.scrollTo({
            left: scrollLeft + 171,
            behavior: "smooth",
          });
        }
      }
    }, 4000); // Auto-scroll every 4 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className={styles.heroContainer}>
      {/* Word Cloud Background */}
      <div className={styles.wordCloud}>
        {wordCloudItems.map((word, index) => (
          <span
            key={index}
            style={{
              top: word.top,
              left: word.left,
              fontSize: word.size,
            }}
          >
            {word.text}
          </span>
        ))}
      </div>

      {/* Toggle Buttons with Horizontal Lines */}
      <div className={styles.toggleWrapper}>
        <div className={styles.toggleLine}></div>
        <div className={styles.toggleContainer}>
          <button
            className={`${styles.toggleButton} ${activeTab === "findJob" ? styles.active : ""}`}
            onClick={() => setActiveTab("findJob")}
          >
            Find Job
          </button>
          <button
            className={`${styles.toggleButton} ${activeTab === "hireSomeone" ? styles.active : ""}`}
            onClick={() => setActiveTab("hireSomeone")}
          >
            Hire Someone
          </button>
        </div>
        <div className={styles.toggleLine}></div>
      </div>

      {/* Headline */}
      <h1 className={styles.headline}>
        Discover Opportunities That Match Your Skills
      </h1>

      {/* Subtitle */}
      <p className={styles.subtitle}>
        Join a growing network where your skills meet real demand, and start earning by helping others in your community.
      </p>

      {/* Job Cards Carousel */}
      <div className={styles.jobCardsWrapper}>
        <div className={styles.jobCardsContainer} ref={carouselRef}>
          {jobCards.map((job) => (
            <div
              key={job.id}
              className={styles.jobCard}
              onClick={() => handleCardClick(job.title)}
            >
              {job.urgent && <span className={styles.urgentBadge}>URGENT</span>}

              <div className={styles.cardImage}>
                <img src={job.image} alt={job.title} />
              </div>

              <h3 className={styles.cardTitle}>{job.title}</h3>
              <p className={styles.cardDescription}>{job.description}</p>

              <div className={styles.cardLocation}>
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                </svg>
                {job.location}
              </div>

              <div className={styles.cardFooter}>
                <span className={styles.cardDate}>{job.date}</span>
                <span className={styles.cardRate}>{job.rate}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className={styles.ctaSection}>
        <a className={styles.exploreLink} onClick={handleExploreJobs}>
          Explore available jobs Now
        </a>
        <button className={styles.registerButton} onClick={handleRegister}>
          Register Now
        </button>
      </div>
    </div>
  );
};

export default HeroSection;
