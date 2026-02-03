import React, { useState, useRef } from "react";
import { useRouter } from "next/router";
import styles from "@/styles/HeroSection.module.css";
import { Routes } from "@/services/routes/Routes";
import { useAuth } from "@/services/authorization/AuthContext";
import Swal from "sweetalert2";

import JobServices from "@/services/jobs/JobService";
import { IJobs } from "@/models/Jobs";

// Helper Interface for Hero Card
interface IHeroCard {
  id: string | number;
  title: string;
  description: string;
  location: string;
  date: string;
  rate: string;
  image: string;
  urgent: boolean;
}

// Fallback Job card data
const fallbackJobCards: IHeroCard[] = [
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

// Word cloud words... (kept nicely)
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

  const [jobs, setJobs] = useState<IHeroCard[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isPaused, setIsPaused] = useState(false);

  const jobService = new JobServices();

  // Fetch Jobs Logic
  React.useEffect(() => {
    const fetchJobs = async () => {
      setIsLoading(true);
      try {
        const fetchedJobs = await jobService.fetchLandingPageJobs();

        if (fetchedJobs && fetchedJobs.length > 0) {
          const mappedJobs: IHeroCard[] = fetchedJobs.map((job: IJobs) => ({
            id: job._id || Math.random(),
            title: job.jobType?.name || "Job",
            description: job.aboutRequirement || "No description availalbe",
            location: `${job.city || "Unknown"}, ${job.state || ""}`,
            date: job.startDate ? new Date(job.startDate).toLocaleDateString() : (job.createdAt ? new Date(job.createdAt).toLocaleDateString() : "Date N/A"),
            rate: job.payRange ? `$${job.payRange}` : "Rate Negotiable",
            image: "/assets/illustrations/nanny.png", // Fallback image for now
            urgent: job.urgent || false
          }));
          setJobs(mappedJobs);
        } else {
          setJobs(fallbackJobCards);
        }
      } catch (error) {
        console.error("Error fetching hero jobs:", error);
        setJobs(fallbackJobCards);
      } finally {
        setIsLoading(false);
      }
    };

    fetchJobs();
  }, []);

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

  // Determine which cards to show
  const displayCards = jobs.length > 0 ? jobs : [];

  // Duplicate cards for infinite scroll effect (x4)
  // This ensures that when we translate -25% (one set width), the visual state is identical to start
  const infiniteCards = [...displayCards, ...displayCards, ...displayCards, ...displayCards];

  return (
    <div className={styles.heroContainer}>
      {/* Background Text Images - Left and Right */}
      <div className={styles.backgroundTextImages}>
        <img
          src="/newassets/LeftText.png"
          alt=""
          className={styles.leftTextImage}
          aria-hidden="true"
        />
        <img
          src="/newassets/RightText.png"
          alt=""
          className={styles.rightTextImage}
          aria-hidden="true"
        />
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

      {/* Job Cards Carousel - CSS Marquee */}
      <div className={styles.jobCardsWrapper}>
        <div className={styles.marqueeTrack}>
          {infiniteCards.length > 0 ? infiniteCards.map((job, index) => (
            <div
              key={`${job.id}-${index}`}
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
          )) : (
            // Fallback empty state if absolutely no data (should theoretically use fallbackJobCards)
            <div style={{ color: 'white' }}>Loading services...</div>
          )}
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
