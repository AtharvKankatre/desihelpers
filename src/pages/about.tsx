import React from "react";
import Head from "next/head";
import Link from "next/link";
import { FaCheckCircle, FaQuoteLeft, FaStar } from "react-icons/fa";
import { Avatar } from "@mui/material"; // Keeping Avatar as it's useful
import styles from "@/styles/About.module.css";
import commonStyles from "@/styles/Common.module.css";
import { Routes } from "@/services/routes/Routes";

const AboutUs = () => {
  return (
    <>
      <Head>
        <title>About Us - Desi Helpers</title>
      </Head>

      {/* Hero Section */}
      <section className={styles.aboutHero}>
        <div className={styles.container}>
          <span className={styles.breadcrumb}>
            Home &gt; About Us
          </span>
          <h1 className={styles.heroTitle}>
            Connecting Communities, One Helper at a Time
          </h1>
          <p className={styles.heroSubtitle}>
            We make finding trusted household help simple, fast, and free—while building a supportive community where people help people.
          </p>
        </div>
      </section>

      {/* Main Content Section */}
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
                  <FaCheckCircle className={styles.checkIcon} size={20} />
                  <p className={styles.checkText}>
                    <strong>Posters</strong> can view active profiles nearby and connect instantly—no posting or reposting required.
                  </p>
                </div>
                <div className={styles.checkItem}>
                  <FaCheckCircle className={styles.checkIcon} size={20} />
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

            {/* The existing about.tsx has more content below,
                let's keep the Mission and Testimonials sections but styled consistently if needed.
                For now, focusing on matching the screenshot's top part perfectly.
            */}
          </div>
        </div>
      </section>

      {/* Our Mission Section */}
      <section className={styles.missionSection}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Our Mission</h2>
            <p className={styles.sectionSubtitle}>
              Our mission is simple - to create value by assisting you in finding high quality leads for your household needs saving your time and frustration from other platforms and connections.
            </p>
          </div>

          <div className={styles.missionGrid}>
            <div className={styles.missionCard}>
              <img src="/assets/mission-connect-hq.png" alt="Connect" />
              <p>Connect and engage with potential social contacts on our platform</p>
            </div>
            <div className={styles.missionCard}>
              <img src="/assets/mission-care-hq.png" alt="Care" />
              <p>Find the nanny or household Care and support your need to elevate your lifestyle</p>
            </div>
            <div className={styles.missionCard}>
              <img src="/assets/mission-excel-hq.png" alt="Excel" />
              <p>Foster the community culture and Excel together</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className={styles.testimonialsSection}>
        <div className={styles.container}>
          <div className={styles.testimonialWrapper}>
            <div className={styles.testimonialContent}>
              <h2 className={styles.testimonialHeading}>What our members have to say</h2>
              <p className={styles.testimonialBody}>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique.
              </p>
              <button className={styles.joinButton}>Connect Us</button>
            </div>

            <div className={styles.testimonialGrid}>
              {/* Column 1 */}
              <div className={styles.testimonialCol}>
                <div className={styles.reviewCard}>
                  <div className={styles.stars}>
                    {[...Array(5)].map((_, i) => <FaStar key={i} />)}
                  </div>
                  <p>"Needed a face painter for my daughter's birthday. Within hours I got connected to someone local who did an amazing job. Kids were thrilled! Highly recommend DesiHelpers."</p>
                  <div className={styles.reviewAuthor}>
                    <Avatar src="/assets/img_baker1.png" className={styles.authorAvatar} />
                    <div>
                      <h4>Ravi Patel</h4>
                      <span>📍 Fremont, California</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Column 2 - Staggered */}
              <div className={`${styles.testimonialCol} ${styles.staggeredCol}`}>
                <div className={styles.reviewCard}>
                  <div className={styles.stars}>
                    {[...Array(5)].map((_, i) => <FaStar key={i} />)}
                  </div>
                  <p>"Finding trustworthy childcare is tough, but DesiHelpers connected us with a responsible babysitter. The peace of mind is priceless. I'll keep using this site for sure."</p>
                  <div className={styles.reviewAuthor}>
                    <Avatar src="/assets/img_tutoring1.png" className={styles.authorAvatar} />
                    <div>
                      <h4>Deepak Nair</h4>
                      <span>📍 Boston, Massachusetts</span>
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
        <div className={styles.container}>
          <div className={styles.readyContent}>
            <h2 className={styles.readyTitle}>Ready to Get Started?</h2>
            <p className={styles.readySubtitle}>
              Join our community today and experience the difference of working with verified, trusted professionals.
            </p>
            <button className={styles.readyButton}>Join the community</button>
          </div>
        </div>
      </section>
    </>
  );
};

export default AboutUs;
