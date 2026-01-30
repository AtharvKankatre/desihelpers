import React from "react";
import styles from "@/styles/FooterSection.module.css";
// Using react-icons since @fortawesome/free-brands-svg-icons is not installed
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaYoutube, FaTwitter } from "react-icons/fa";

export const FooterSection: React.FC = () => {
    return (
        <footer className={styles.footer}>
            <div className={styles.container}>
                {/* Brand Column */}
                <div className={styles.brandColumn}>
                    <img src="/DesiHelpersLogo.svg" alt="Desi Helpers" className={styles.logoImage} />
                    <div className={styles.socialIcons}>
                        <a href="#" className={styles.iconLink}><FaFacebookF /></a>
                        <a href="#" className={styles.iconLink}><FaInstagram /></a>
                        <a href="#" className={styles.iconLink}><FaTwitter /></a>
                        <a href="#" className={styles.iconLink}><FaLinkedinIn /></a>
                        <a href="#" className={styles.iconLink}><FaYoutube /></a>
                    </div>
                </div>

                {/* Services Column - 2 Column Grid on Mobile */}
                <div className={styles.linkColumn}>
                    <h4 className={styles.columnTitle}>SERVICES</h4>
                    <ul className={`${styles.linkList} ${styles.servicesGrid}`}>
                        <li className={styles.linkItem}><a href="#" className={styles.link}>Home & Baby care</a></li>
                        <li className={styles.linkItem}><a href="#" className={styles.link}>Event Help</a></li>
                        <li className={styles.linkItem}><a href="#" className={styles.link}>Baking</a></li>
                        <li className={styles.linkItem}><a href="#" className={styles.link}>Tutoring</a></li>
                        <li className={styles.linkItem}><a href="#" className={styles.link}>Catering</a></li>
                        <li className={styles.linkItem}><a href="#" className={styles.link}>Professionals</a></li>
                    </ul>
                </div>

                {/* PAGES and QUICK LINKS - Side by Side on Mobile Only */}
                <div className={styles.linksRow}>
                    {/* Pages Column */}
                    <div className={styles.linkColumn}>
                        <h4 className={styles.columnTitle}>PAGES</h4>
                        <ul className={styles.linkList}>
                            <li className={styles.linkItem}><a href="#" className={styles.link}>About Us</a></li>
                            <li className={styles.linkItem}><a href="#" className={styles.link}>Resources</a></li>
                        </ul>
                    </div>

                    {/* Quick Links Column */}
                    <div className={styles.linkColumn}>
                        <h4 className={styles.columnTitle}>QUICK LINKS</h4>
                        <ul className={styles.linkList}>
                            <li className={styles.linkItem}><a href="#" className={styles.link}>Privacy Policy</a></li>
                            <li className={styles.linkItem}><a href="#" className={styles.link}>Contact Us</a></li>
                        </ul>
                    </div>
                </div>
            </div>

            <div className={styles.bottomBar}>
                © 2025 Desi Helpers. All rights reserved.
            </div>
        </footer>
    );
};
