import React, { memo } from "react";
import Image from "next/image";
import styles from "@/styles/FooterSection.module.css";
// Using react-icons since @fortawesome/free-brands-svg-icons is not installed
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaYoutube, FaTwitter } from "react-icons/fa";
import Link from "next/link";
import useTranslation from "next-translate/useTranslation";

const _FooterSection: React.FC = () => {
    const { t } = useTranslation('common');
    return (
        <footer className={styles.footer}>
            <div className={styles.container}>
                {/* Brand Column */}
                <div className={styles.brandColumn}>
                    <Image
                        src="/DesiHelpers_without-tag-line.svg"
                        alt="DesiHelpers"
                        width={150}
                        height={40}
                        style={{ height: "40px", width: "auto" }}
                    />
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
                    <h4 className={styles.columnTitle}>{t('footer.services')}</h4>
                    <ul className={`${styles.linkList} ${styles.servicesGrid}`}>
                        <li className={styles.linkItem}><a href="#" className={styles.link}>{t('footer.home_baby')}</a></li>
                        <li className={styles.linkItem}><a href="#" className={styles.link}>{t('footer.event_help')}</a></li>
                        <li className={styles.linkItem}><a href="#" className={styles.link}>{t('footer.baking')}</a></li>
                        <li className={styles.linkItem}><a href="#" className={styles.link}>{t('footer.tutoring')}</a></li>
                        <li className={styles.linkItem}><a href="#" className={styles.link}>{t('footer.catering')}</a></li>
                        <li className={styles.linkItem}><a href="#" className={styles.link}>{t('footer.professionals')}</a></li>
                    </ul>
                </div>

                {/* PAGES and QUICK LINKS - Side by Side on Mobile Only */}
                <div className={styles.linksRow}>
                    {/* Pages Column */}
                    <div className={styles.linkColumn}>
                        <h4 className={styles.columnTitle}>{t('footer.pages')}</h4>
                        <ul className={styles.linkList}>
                            <li className={styles.linkItem}><Link href="/about" className={styles.link}>{t('footer.about_us')}</Link></li>
                            <li className={styles.linkItem}><Link href="/resources" className={styles.link}>{t('footer.resources')}</Link></li>
                        </ul>
                    </div>

                    {/* Quick Links Column */}
                    <div className={styles.linkColumn}>
                        <h4 className={styles.columnTitle}>{t('footer.quick_links')}</h4>
                        <ul className={styles.linkList}>
                            <li className={styles.linkItem}><Link href="/PrivacyPolicy" className={styles.link}>{t('footer.privacy_policy')}</Link></li>
                            <li className={styles.linkItem}><Link href="/ContactUs" className={styles.link}>{t('footer.contact_us')}</Link></li>
                        </ul>
                    </div>
                </div>
            </div>

            <div className={styles.bottomBar}>
                {t('footer.copyright')}
            </div>
        </footer>
    );
};
export const FooterSection = memo(_FooterSection);
