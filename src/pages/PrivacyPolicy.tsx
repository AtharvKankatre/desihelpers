import React from "react";
import Head from "next/head";
import Link from "next/link";
import { Container } from "@mui/material"; // Optional, keeping for structure if needed
import styles from "@/styles/PrivacyPolicy.module.css";
import { Routes } from "@/services/routes/Routes";

const PrivacyPolicy = () => {
  return (
    <>
      <Head>
        <title>Privacy Policy - Desi Helpers</title>
      </Head>

      {/* Hero Section */}
      <section className={styles.heroSection}>
        <div className={styles.container}>
          <span className={styles.breadcrumb}>
            Home &gt; Privacy Policy
          </span>
          <h1 className={styles.heroTitle}>Privacy Policy</h1>
          <p className={styles.lastUpdated}>
            Last Updated : 10 October 2024
          </p>
        </div>
      </section>

      {/* Content Section */}
      <section className={styles.contentSection}>
        <div className={styles.container}>
          <div className={styles.policyContent}>
            <p className={styles.introText}>
              Welcome to DesiHelpers.com owned by Desi Wayz Inc. At Desi Wayz, we value your privacy and are committed to protecting any personal information you share with us. This Privacy Policy outlines the types of information we collect, how we use and protect it, and your rights regarding your information.
            </p>

            <span className={styles.sectionHeading}>1. Information We Collect</span>
            <p className={styles.paragraph}>
              We collect information to improve our services and provide you with a better user experience. This may include:
            </p>
            <p className={styles.paragraph}>
              <span className={styles.subHeading}>Personal Information:</span> When you contact us, subscribe to our updates, or use our services, we may collect personal details like your name, provided address, email address, phone/whatsapp number, and company information.
            </p>
            <p className={styles.paragraph}>
              <span className={styles.subHeading}>Usage Information:</span> We automatically collect information related to your interactions with our website, including your IP address, browser type, pages visited, and time spent on our website.
            </p>
            <p className={styles.paragraph}>
              <span className={styles.subHeading}>Cookies and Tracking Technologies:</span> Our website uses cookies and similar technologies to enhance user experience, understand user interactions, and analyze traffic patterns. You can adjust your browser settings to reject cookies, but some features of our website may not function properly.
            </p>

            <span className={styles.sectionHeading}>2. How We Use Your Information</span>
            <p className={styles.paragraph}>
              The information we collect is used to:
            </p>
            <ul className={styles.paragraph}>
              <li>Provide, operate, and maintain our website.</li>
              <li>Improve, personalize, and expand our services.</li>
              <li>Communicate with you, including responding to inquiries and providing updates.</li>
              <li>Send promotional content, newsletters, or marketing information, if you have opted in to receive such communications.</li>
              <li>Monitor and analyze usage trends and activities in connection with our website.</li>
            </ul>

            <span className={styles.sectionHeading}>3. Sharing Your Information</span>
            <p className={styles.paragraph}>
              We do not sell or trade your personal information to third parties. However, we may share information in the following circumstances:
            </p>
            <p className={styles.paragraph}>
              <span className={styles.subHeading}>Service Providers:</span> We may share your information with trusted third-party vendors who assist us in operating our website and conducting our business, provided they comply with strict data privacy and security practices.
            </p>
            <p className={styles.paragraph}>
              <span className={styles.subHeading}>Legal Requirements:</span> We may disclose your information when required to comply with applicable laws or respond to valid legal requests.
            </p>

            <span className={styles.sectionHeading}>4. Data Security</span>
            <p className={styles.paragraph}>
              We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no data transmission over the internet can be guaranteed as completely secure, and we cannot ensure the absolute security of any information shared with us.
            </p>

            <span className={styles.sectionHeading}>5. Retention of Information</span>
            <p className={styles.paragraph}>
              We retain personal information for as long as necessary to fulfill the purposes for which it was collected, comply with legal obligations, and resolve disputes.
            </p>

            <span className={styles.sectionHeading}>6. Your Rights</span>
            <p className={styles.paragraph}>
              Depending on your location, you may have the following rights regarding your personal information:
            </p>
            <p className={styles.paragraph}>
              <span className={styles.subHeading}>Access:</span> Request access to the personal information we hold about you.
            </p>
            <p className={styles.paragraph}>
              <span className={styles.subHeading}>Correction:</span> Request correction of any inaccurate or incomplete information.
            </p>
            <p className={styles.paragraph}>
              <span className={styles.subHeading}>Deletion:</span> Request deletion of your personal information, subject to certain conditions.
            </p>
            <p className={styles.paragraph}>
              <span className={styles.subHeading}>Opt-out:</span> Opt out of marketing communications at any time by clicking the "unsubscribe" link in emails or contacting us directly.
            </p>

            <span className={styles.sectionHeading}>7. Third-Party Links</span>
            <p className={styles.paragraph}>
              Our website may contain links to third-party websites. This Privacy Policy does not apply to those websites, and we are not responsible for the privacy practices of third parties. We encourage you to review the privacy policies of each site you visit.
            </p>

            <span className={styles.sectionHeading}>8. Children's Privacy</span>
            <p className={styles.paragraph}>
              Our services are not directed towards individuals under the age of 18, and we do not knowingly collect personal information from children. If you believe a child has provided us with personal information, please contact us to have it removed.
            </p>

            <span className={styles.sectionHeading}>9. Changes to This Privacy Policy</span>
            <p className={styles.paragraph}>
              We may update this Privacy Policy from time to time to reflect changes in our practices or legal requirements. We will notify you of any significant changes by posting the new Privacy Policy on this page with an updated "Last Updated" date.
            </p>

            <span className={styles.sectionHeading}>10. Contact Us</span>
            <p className={styles.paragraph}>
              If you have questions or concerns about this Privacy Policy, please write to us using the members <strong>"Contact Us"</strong> form.
            </p>
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

export default PrivacyPolicy;
