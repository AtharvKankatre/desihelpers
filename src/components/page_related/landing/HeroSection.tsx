import React, { useState, useRef, useEffect, memo } from "react";
import { useRouter } from "next/router";
import styles from "@/styles/HeroSection.module.css";
import { Routes } from "@/services/routes/Routes";
import { useAuth } from "@/services/authorization/AuthContext";
import { toast } from "react-toastify";
import ApiService from "@/services/data/crud/crud";
import { APIDetails } from "@/services/data/constants/ApiDetails";
import { IJobs } from "@/models/Jobs";
import { getOptimizedIcon } from "@/utils/iconMapping";

// Fallback Job card data matching the design
const fallbackJobCards = [
  {
    id: 1,
    title: "Nanny",
    description: "Nanny for 3-month-old baby",
    location: "Bothell, Washington",
    date: "Mon 25, 2025",
    rate: "$25-$35 / hr",
    image: "/assets/icons/categories/nanny.svg",
    urgent: true,
  },
  {
    id: 2,
    title: "Movers/Packers",
    description: "To shift our home furnitures",
    location: "Bothell, Washington",
    date: "Mon 25, 2025",
    rate: "-",
    image: "/assets/icons/categories/movers.svg",
    urgent: true,
  },
  {
    id: 3,
    title: "Mother's Helper",
    description: "House helper services",
    location: "Oakland, California",
    date: "Sep 12, 2025",
    rate: "-",
    image: "/assets/icons/categories/mothers_helper.svg",
    urgent: true,
  },
  {
    id: 4,
    title: "Tiffin",
    description: "Looking for Maharashtrian food",
    location: "Oakland, California",
    date: "Oct 1, 2025",
    rate: "-",
    image: "/assets/icons/categories/tiffin.svg",
    urgent: true,
  },
  {
    id: 5,
    title: "House Cleaners",
    description: "Office cleaning in Kirkland WA",
    location: "Issaquah, Washington",
    date: "Sep 12, 2025",
    rate: "$15-$25 / hr",
    image: "/assets/icons/categories/cleaner.svg",
    urgent: true,
  },
  {
    id: 6,
    title: "Cake Bakers",
    description: "Cake Bakers Services",
    location: "Adair County, Kentucky",
    date: "Sep 19, 2025",
    rate: "$25-$35 / hr",
    image: "/assets/icons/categories/baker.svg",
    urgent: true,
  },
  {
    id: 7,
    title: "Servers",
    description: "need servers to serve in party",
    location: "Morrisville, Pennsylvania",
    date: "Jul 1, 2025",
    rate: "$15-$25 / hr",
    image: "/assets/icons/categories/server.svg",
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


import Image from "next/image";

const _HeroSection: React.FC = () => {
  const router = useRouter();
  const { isActive, isProfileBuild } = useAuth();
  const [activeTab, setActiveTab] = useState<"findJob" | "hireSomeone">("findJob");
  const carouselRef = useRef<HTMLDivElement>(null);
  const [jobs, setJobs] = useState<any[]>(fallbackJobCards);

  // Drag-to-scroll state
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);
  const velocity = useRef(0);
  const lastX = useRef(0);
  const lastTime = useRef(0);
  const animFrameId = useRef<number>(0);
  const hasDragged = useRef(false);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await ApiService.crud(APIDetails.getJobs, "");
        if (response[0] && response[1] && response[1].length > 0) {
          const apiJobs = response[1].map((job: IJobs) => ({
            id: job._id || job.id,
            title: job.jobType?.name || job.subCategory || "Job Opportunity",
            description: job.aboutRequirement || "Looking for help",
            location: `${job.city || ""}, ${job.state || ""}`.trim() || "Location not specified",
            date: job.createdAt ? new Date(job.createdAt).toLocaleDateString() : "Recently",
            rate: job.payRange || "-",
            image: getOptimizedIcon(job.jobType?.name || job.subCategory || ""),
            urgent: job.urgent || false,
          }));
          setJobs(apiJobs);
        }
      } catch (error) {
        console.error("Error fetching jobs for hero section:", error);
      }
    };
    fetchJobs();
  }, []);

  // — Drag handlers (mouse + touch) with momentum —

  const handlePointerDown = (clientX: number) => {
    if (!carouselRef.current) return;
    isDragging.current = true;
    hasDragged.current = false;
    startX.current = clientX;
    scrollLeft.current = carouselRef.current.scrollLeft;
    lastX.current = clientX;
    lastTime.current = Date.now();
    velocity.current = 0;
    cancelAnimationFrame(animFrameId.current);
    carouselRef.current.style.cursor = "grabbing";
    carouselRef.current.style.scrollBehavior = "auto";
  };

  const handlePointerMove = (clientX: number) => {
    if (!isDragging.current || !carouselRef.current) return;
    const dx = clientX - startX.current;
    if (Math.abs(dx) > 3) hasDragged.current = true;
    carouselRef.current.scrollLeft = scrollLeft.current - dx;

    // Track velocity for momentum
    const now = Date.now();
    const dt = now - lastTime.current;
    if (dt > 0) {
      velocity.current = (clientX - lastX.current) / dt;
    }
    lastX.current = clientX;
    lastTime.current = now;
  };

  const handlePointerUp = () => {
    if (!isDragging.current || !carouselRef.current) return;
    isDragging.current = false;
    carouselRef.current.style.cursor = "grab";

    // Apply momentum glide
    const el = carouselRef.current;
    let v = velocity.current * 15; // amplify for smooth glide

    const glide = () => {
      if (Math.abs(v) < 0.5) return;
      el.scrollLeft -= v;
      v *= 0.95; // friction
      animFrameId.current = requestAnimationFrame(glide);
    };
    glide();
  };

  // Mouse events
  const onMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    handlePointerDown(e.clientX);
  };
  const onMouseMove = (e: React.MouseEvent) => handlePointerMove(e.clientX);
  const onMouseUp = () => handlePointerUp();
  const onMouseLeave = () => { if (isDragging.current) handlePointerUp(); };

  // Touch events
  const onTouchStart = (e: React.TouchEvent) => handlePointerDown(e.touches[0].clientX);
  const onTouchMove = (e: React.TouchEvent) => handlePointerMove(e.touches[0].clientX);
  const onTouchEnd = () => handlePointerUp();

  const handleCardClick = (jobTitle: string) => {
    // Prevent click if user was dragging
    if (hasDragged.current) return;

    if (!isActive) {
      toast.warn("Please login to view job details", { toastId: 'login-warning' });
      router.push("/Login");
    } else if (!isProfileBuild) {
      toast.warn("Please build your profile first.", { toastId: 'profile-incomplete' });
    } else {
      router.push(Routes.mapSearch);
    }
  };

  const handleRegister = () => {
    router.push(Routes.register);
  };

  const handleExploreJobs = () => {
    router.push(Routes.mapSearch);
  };

  return (
    <div className={styles.heroContainer}>
      {/* Background Text Images - Left and Right */}
      <div className={styles.backgroundTextImages}>
        <div className={styles.leftTextImage}>
          <Image
            src="/newassets/LeftText.png"
            alt=""
            width={400}
            height={600}
            priority
            aria-hidden="true"
            style={{ objectFit: 'contain' }}
          />
        </div>
        <div className={styles.rightTextImage}>
          <Image
            src="/newassets/RightText.png"
            alt=""
            width={400}
            height={600}
            priority
            aria-hidden="true"
            style={{ objectFit: 'contain' }}
          />
        </div>
      </div>

      {/* Toggle Buttons with Horizontal Lines */}
      <div className={styles.toggleWrapper}>
        <div className={styles.toggleLine}></div>
        <div className={styles.toggleContainer}>
          <button
            className={`${styles.toggleButton} ${activeTab === "findJob" ? styles.findJobActive : ""}`}
            onClick={() => router.push(Routes.viewAllJobs)}
          >
            Find Job
          </button>
          <button
            className={`${styles.toggleButton} ${activeTab === "hireSomeone" ? styles.hireSomeoneActive : ""}`}
            onClick={() => router.push(Routes.viewAllSeekers)}
          >
            Hire Someone
          </button>
        </div>
        <div className={styles.toggleLine}></div>
      </div>

      {/* Desktop Version - Headline & Subtitle */}
      <div className={styles.desktopOnly}>
        <h1 className={styles.headline}>
          Discover Opportunities That Match Your Skills
        </h1>
        <p className={styles.subtitle}>
          Join a growing network where your skills meet real demand, and start earning by helping others in your community.
        </p>
      </div>

      {/* Mobile Version - Headline & Subtitle */}
      <div className={styles.mobileOnly}>
        <h1 className={styles.headline}>
          Find Trusted Help for Desi Need
        </h1>
        <p className={styles.subtitle}>
          NRI's trusted platform for Jobs, Clients and Connections ! सब कुछ यही मिलेगा
        </p>
      </div>

      {/* Drag-to-Scroll Job Cards Carousel */}
      <div className={styles.jobCardsWrapper}>
        <div
          ref={carouselRef}
          className={styles.jobCardsContainer}
          onMouseDown={onMouseDown}
          onMouseMove={onMouseMove}
          onMouseUp={onMouseUp}
          onMouseLeave={onMouseLeave}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          {jobs.length > 0 && jobs.map((job, index) => (
            <div
              key={`${job.id}-${index}`}
              className={styles.jobCard}
              onClick={() => handleCardClick(job.title)}
            >
              {job.urgent && <span className={styles.urgentBadge}>URGENT</span>}

              <div className={styles.cardImage}>
                <Image
                  src={job.image}
                  alt={job.title}
                  width={90}
                  height={90}
                  style={{ objectFit: 'contain' }}
                  unoptimized={true}
                  draggable={false}
                />
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

      {/* Desktop Version - Additional CTA Links */}
      <div className={styles.desktopOnly}>
        <div className={styles.exploreLinkWrapper} onClick={handleExploreJobs}>
          <span className={styles.exploreAvailableLink}>Explore available jobs now</span>
        </div>
        {!isActive && (
          <div className={styles.registerCtaWrapper}>
            <button className={styles.registerButton} onClick={handleRegister}>
              Register Now
            </button>
          </div>
        )}
      </div>

      {/* Mobile Version - Locate Helper & Post A Job */}
      <div className={styles.mobileOnly} style={{ width: '100%' }}>
        <div className={styles.locateHelperWrapper} onClick={() => router.push(Routes.viewAllSeekers)}>
          <svg viewBox="0 0 24 24" className={styles.locateIcon}>
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5 0-1.38 1.12-2.5 2.5-2.5 1.38 0 2.5 1.12 2.5 2.5 0 1.38-1.12 2.5-2.5 2.5z" />
          </svg>
          <span className={styles.locateHelperLink}>Locate a helper near you?</span>
        </div>

        {!isActive && (
          <div className={styles.postJobCtaWrapper}>
            <button className={styles.postJobButton} onClick={() => router.push('/Login?mode=signup')}>
              Post A Job
            </button>
          </div>
        )}
      </div>

    </div>
  );
};

export const HeroSection = memo(_HeroSection);
export default HeroSection;
