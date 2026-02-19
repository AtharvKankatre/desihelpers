import { useRef, useState, useEffect } from "react";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { FaPlay, FaCheckCircle, FaStar, FaQuoteLeft } from "react-icons/fa";
import { Avatar, Box } from "@mui/material"; // Keeping Avatar as it's useful
import styles from "@/styles/About.module.css";
import { Routes } from "@/services/routes/Routes";

const About: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  // Maximum pixels to translate columns during the scroll through the section
  const maxTranslate = 1000;

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;

      const section = sectionRef.current;
      const rect = section.getBoundingClientRect();
      const sectionHeight = section.offsetHeight;
      const windowHeight = window.innerHeight;

      // Calculate scroll progress when section is in view
      const sectionTop = rect.top;
      const sectionBottom = rect.bottom;

      if (sectionTop < windowHeight && sectionBottom > 0) {
        const scrollableDistance = sectionHeight + windowHeight;
        const currentProgress = (windowHeight - sectionTop) / scrollableDistance;
        const clampedProgress = Math.max(0, Math.min(1, currentProgress));
        setScrollProgress(clampedProgress);
      }
    };

    let ticking = false;
    const throttledScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', throttledScroll);
    handleScroll();

    return () => {
      window.removeEventListener('scroll', throttledScroll);
    };
  }, []);

  // Calculate transforms based on scroll progress
  // Column 1 moves down (positive Y), Column 2 moves up (negative Y)
  const column1Transform = scrollProgress * maxTranslate;
  const column2Transform = -scrollProgress * maxTranslate;

  return (
    <>
      <Head>
        <title>About Us - Desi Helpers</title>
      </Head>

      {/* Hero Section */}
      <section className={styles.aboutHero}>
        <div className={styles.container}>
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 1, mb: 3, fontSize: '0.9rem' }}>
            <span style={{ opacity: 0.8 }}>Home</span>
            <span style={{ fontSize: '1.2rem', opacity: 0.8 }}>›</span>
            <span style={{ opacity: 1, fontWeight: 500 }}>About Us</span>
          </Box>
          <h1 className={styles.heroTitle}>
            Connecting Communities, One Helper at a Time
          </h1>
          <p className={styles.heroSubtitle}>
            We make finding trusted household help simple, fast, and free—while building a supportive community where people help people.
          </p>
        </div>
      </section>

      {/* Problem We Are Solving */}
      <section className={styles.contentSection}>
        <div className={styles.container}>
          <div className={styles.contentWrapper}>
            <div className={styles.textContent}>
              <span className={styles.whyLabel}>WHY Desi Helpers</span>
              <h2 className={styles.mainHeading}>
                The <span>Problem We Are Solving</span>
              </h2>
              <p className={styles.bodyText}>
                The way people search for household help—nannies, chefs, tutors, and more—has changed drastically. Most rely on multiple social media groups, messaging apps, or word-of-mouth to post their needs or services.
              </p>
              <p className={styles.bodyText}>
                Our platform provides a one-stop, scalable solution for all helper needs:
              </p>

              <div className={styles.checklist}>
                <div className={styles.checkItem}>
                  <FaCheckCircle className={styles.checkIcon} size={20} style={{ color: '#f07c00' }} />
                  <p className={styles.checkText}>
                    <strong>Posters</strong> can view active profiles nearby and connect instantly—no posting or reposting required.
                  </p>
                </div>
                <div className={styles.checkItem}>
                  <FaCheckCircle className={styles.checkIcon} size={20} style={{ color: '#f07c00' }} />
                  <p className={styles.checkText}>
                    <strong>Seekers</strong> can see verified opportunities in their area—without endless group hopping.
                  </p>
                </div>
              </div>

              <p className={styles.summaryText}>
                This means faster connections, less effort, and a better experience for everyone.
              </p>

              <Link href={Routes.landing}>
                <button className={styles.joinButton}>
                  Join the community
                </button>
              </Link>
            </div>

            <div className={styles.imageWrapper}>
              <img src="/assets/why-us-image-final.png" alt="Desi Helpers - Solving Problems" />
            </div>
          </div>
        </div>
      </section>

      {/* Our Mission Section */}
      <section className={styles.missionSection}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle} style={{ color: '#00479d', fontSize: '2.5rem' }}>Our Mission</h2>
            <p className={styles.sectionSubtitle}>
              Our mission is simple - to create value by assisting you in finding high quality leads for your household needs saving your time and frustration from other platforms and connections.
            </p>
          </div>

          <div className={styles.missionGrid}>
            <div className={styles.missionCard}>
              <img src="/assets/mission-connect-hq.png" alt="Connect" style={{ width: '150px', height: '150px', objectFit: 'contain' }} />
              <p>Connect and engage with potential social contacts on our platform</p>
            </div>
            <div className={styles.missionCard}>
              <img src="/assets/mission-care-hq.png" alt="Care" style={{ width: '150px', height: '150px', objectFit: 'contain' }} />
              <p>Find the nanny or household Care and support your need to elevate your lifestyle</p>
            </div>
            <div className={styles.missionCard}>
              <img src="/assets/mission-excel-hq.png" alt="Excel" style={{ width: '150px', height: '150px', objectFit: 'contain' }} />
              <p>Foster the community culture and Excel together</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section ref={sectionRef} className={styles.testimonialsSection}>
        <div className={styles.testimonialContainer}>
          <div className={styles.testimonialContent}>
            <div className={styles.quoteIcon}>
              <svg width="120" height="100" viewBox="0 0 120 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M0 60C0 48 2 37.3333 6 28C10.6667 18.6667 16.6667 11 24 5C32 -1 40.6667 -3.66667 50 -4V8C42 9.33333 35.3333 12.6667 30 18C24.6667 23.3333 21.6667 30 21 38H50V100H0V60Z" fill="#B8C5D9" />
                <path d="M70 60C70 48 72 37.3333 76 28C80.6667 18.6667 86.6667 11 94 5C102 -1 110.667 -3.66667 120 -4V8C112 9.33333 105.333 12.6667 100 18C94.6667 23.3333 91.6667 30 91 38H120V100H70V60Z" fill="#B8C5D9" />
              </svg>
            </div>
            <h2 className={styles.testimonialHeading}>What Our Members Have To Say</h2>
            <p className={styles.testimonialBody}>
              DesiHelpers.com has saved me so much time in searching for ethnic help. I have deleted all the community Whatsapp groups now.
            </p>
            <button className={styles.joinButton}>Connect Us</button>
          </div>

          <div className={styles.testimonialGrid}>
            {/* Column 1 - Slides Down */}
            <div
              className={styles.testimonialCol}
              style={{
                transform: `translateY(${column1Transform}px)`,
                marginTop: `-${maxTranslate}px`
              }}
            >
              <div className={styles.reviewCard}>
                <div className={styles.stars}>
                  {[...Array(5)].map((_, i) => <FaStar key={i} />)}
                </div>
                <p>"Needed a face painter for my daughter's birthday. Within hours I got connected to someone local who did an amazing job. Highly recommend DesiHelpers."</p>
                <div className={styles.reviewAuthor}>
                  <Avatar src="https://randomuser.me/api/portraits/men/32.jpg" className={styles.authorAvatar} />
                  <div className={styles.authorInfo}>
                    <h4>Ravi Patel</h4>
                    <div className={styles.location}>
                      <svg viewBox="0 0 24 24" fill="currentColor" width="12" height="12">
                        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                      </svg>
                      Fremont, California
                    </div>
                  </div>
                </div>
              </div>

              <div className={styles.reviewCard}>
                <div className={styles.stars}>
                  {[...Array(5)].map((_, i) => <FaStar key={i} />)}
                </div>
                <p>"As a new mom, I really needed a mother's helper for a few hours a day. I found a kind and reliable lady through DesiHelpers who made life so much easier. This site is a lifesaver for families."</p>
                <div className={styles.reviewAuthor}>
                  <Avatar src="https://randomuser.me/api/portraits/women/44.jpg" className={styles.authorAvatar} />
                  <div className={styles.authorInfo}>
                    <h4>Neha Sharma</h4>
                    <div className={styles.location}>
                      <svg viewBox="0 0 24 24" fill="currentColor" width="12" height="12">
                        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                      </svg>
                      Dallas, Texas
                    </div>
                  </div>
                </div>
              </div>

              <div className={styles.reviewCard}>
                <div className={styles.stars}>
                  {[...Array(5)].map((_, i) => <FaStar key={i} />)}
                </div>
                <p>"I recently moved here and was looking for weekend catering gigs. Signed up on DesiHelpers and got my first order for a small party in just a week. Great platform for side income!"</p>
                <div className={styles.reviewAuthor}>
                  <Avatar src="https://randomuser.me/api/portraits/men/46.jpg" className={styles.authorAvatar} />
                  <div className={styles.authorInfo}>
                    <h4>Arjun Reddy</h4>
                    <div className={styles.location}>
                      <svg viewBox="0 0 24 24" fill="currentColor" width="12" height="12">
                        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                      </svg>
                      Seattle, Washington
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Column 2 - Slides Up */}
            <div
              className={styles.testimonialCol}
              style={{
                transform: `translateY(${column2Transform}px)`
              }}
            >
              <div className={styles.reviewCard}>
                <div className={styles.stars}>
                  {[...Array(5)].map((_, i) => <FaStar key={i} />)}
                </div>
                <p>"Finding trustworthy childcare is tough, but DesiHelpers connected us with a responsible babysitter. The peace of mind is priceless. I'll keep using this site for sure."</p>
                <div className={styles.reviewAuthor}>
                  <Avatar src="https://randomuser.me/api/portraits/men/64.jpg" className={styles.authorAvatar} />
                  <div className={styles.authorInfo}>
                    <h4>Deepak Nair</h4>
                    <div className={styles.location}>
                      <svg viewBox="0 0 24 24" fill="currentColor" width="12" height="12">
                        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                      </svg>
                      Boston, Massachusetts
                    </div>
                  </div>
                </div>
              </div>

              <div className={styles.reviewCard}>
                <div className={styles.stars}>
                  {[...Array(5)].map((_, i) => <FaStar key={i} />)}
                </div>
                <p>"I hired a catering team through DesiHelpers for my parents' anniversary. The food was authentic and homely, just like we wanted. All our guests kept asking where we found them!"</p>
                <div className={styles.reviewAuthor}>
                  <Avatar src="https://randomuser.me/api/portraits/women/65.jpg" className={styles.authorAvatar} />
                  <div className={styles.authorInfo}>
                    <h4>Pooja Joshi</h4>
                    <div className={styles.location}>
                      <svg viewBox="0 0 24 24" fill="currentColor" width="12" height="12">
                        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                      </svg>
                      Houston, Texas
                    </div>
                  </div>
                </div>
              </div>

              <div className={styles.reviewCard}>
                <div className={styles.stars}>
                  {[...Array(5)].map((_, i) => <FaStar key={i} />)}
                </div>
                <p>"I'm a baker and listed my services here. Within two weeks, I got three cake orders from families nearby. This platform really helps small business owners like me."</p>
                <div className={styles.reviewAuthor}>
                  <Avatar src="https://randomuser.me/api/portraits/women/68.jpg" className={styles.authorAvatar} />
                  <div className={styles.authorInfo}>
                    <h4>Kiran Malhotra</h4>
                    <div className={styles.location}>
                      <svg viewBox="0 0 24 24" fill="currentColor" width="12" height="12">
                        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                      </svg>
                      San Jose, California
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Ready to Get Started Section */}
      <section className={styles.readySection}>
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundImage: 'url("/assets/img_text_language_cloud.svg")',
          backgroundSize: 'cover',
          opacity: 0.1,
          pointerEvents: 'none',
          zIndex: 0
        }} />
        <div className={styles.readyContent}>
          <div className={styles.readyTextGroup}>
            <h2 className={styles.readyTitle}>Ready to Get Started?</h2>
            <p className={styles.readySubtitle}>
              Join our community today and experience the difference of working with verified, trusted professionals.
            </p>
          </div>
          <button className={styles.joinButton} style={{ padding: '15px 40px', fontSize: '1.1rem' }}>Join the community</button>
        </div>
      </section>
    </>
  );
};

export default About;
