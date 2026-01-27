import DesiHelpersIcon from "@/components/static/DesiHelpersIcon";
import styles from "@/styles/Footer.module.css";
import Link from "next/link";
import { Routes } from "@/services/routes/Routes";
import Image from "next/image";

export const CFooter = () => {
  const services = [
    { name: "Home & Baby care", href: Routes.landing },
    { name: "Baking", href: Routes.landing },
    { name: "Catering", href: Routes.landing },
    { name: "Event Help", href: Routes.landing },
    { name: "Tutoring", href: Routes.landing },
    { name: "Professionals", href: Routes.landing },
  ];

  const pages = [
    { name: "About Us", href: Routes.aboutUs || "/about" },
    { name: "Resources", href: Routes.resources || "/resources" },
  ];

  const otherLinks = [
    { name: "Privacy Policy", href: Routes.privacyPolicy },
    { name: "Contact Us", href: Routes.contactUs },
  ];

  const socialLinks = [
    {
      name: "Instagram",
      href: "https://www.instagram.com/desihelpers/profilecard/?igsh=bzc4OHl3ZmJuaWJl",
      icon: "/assets/icons/icon_instagram.svg",
    },
    {
      name: "Facebook",
      href: "https://facebook.com/people/Desi-Helpers/61571408365670/",
      icon: "/assets/icons/icon_facebook_logo.svg",
    },
    {
      name: "Twitter",
      href: "https://x.com/@desihelpers",
      icon: "/assets/icons/icon_twitter.svg",
    },
  ];

  return (
    <footer id="globalFooter" className={styles.footerMain}>
      <div className={styles.footerContainer}>
        <div className={styles.footerContent}>
          {/* Logo and Social Icons Column */}
          <div className={styles.footerBrandCol}>
            <DesiHelpersIcon />
            <div className={styles.socialIcons}>
              {socialLinks.map((social, index) => (
                <Link
                  key={index}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.socialLink}
                  title={social.name}
                >
                  <Image
                    src={social.icon}
                    alt={social.name}
                    width={28}
                    height={28}
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = "none";
                    }}
                  />
                </Link>
              ))}
            </div>
          </div>

          {/* Services Column */}
          <div className={styles.footerCol}>
            <h4 className={styles.footerColTitle}>SERVICES</h4>
            <ul className={styles.footerColList}>
              {services.map((service, index) => (
                <li key={index}>
                  <Link href={service.href}>{service.name}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Pages Column */}
          <div className={styles.footerCol}>
            <h4 className={styles.footerColTitle}>PAGES</h4>
            <ul className={styles.footerColList}>
              {pages.map((page, index) => (
                <li key={index}>
                  <Link href={page.href}>{page.name}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Other Links Column */}
          <div className={styles.footerCol}>
            <h4 className={styles.footerColTitle}>Other lInks</h4>
            <ul className={styles.footerColList}>
              {otherLinks.map((link, index) => (
                <li key={index}>
                  <Link href={link.href}>{link.name}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Divider and Copyright */}
        <div className={styles.footerDivider}></div>
        <div className={styles.footerCopyright}>
          © 2025 Desi Helpers. All rights reserved.
        </div>
      </div>
    </footer>
  );
};
