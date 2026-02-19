import React, { memo } from "react";
import Image from "next/image";
import style from "@/styles/Common.module.css";

const SignupLeftPanel = () => {
    return (
        <div className={style.signupLeftPanel}>
            {/* Hero Section with Images */}
            <div className={style.signupHeroSection}>
                {/* Background Arrow - increased size */}
                <Image
                    src="/newassets/arrow.png"
                    alt=""
                    width={700}
                    height={950}
                    className={style.signupBackgroundArrow}
                    loading="lazy"
                />

                {/* Small green decorative arrow top left */}
                <span className={style.signupDecorGreen}>✦</span>

                {/* Small red X decoration */}
                <span className={style.signupDecorX}>✕</span>

                {/* Center design - combined handshake, dollar, arrows */}
                <Image
                    src="/newassets/centerdesign.png"
                    alt="Handshake"
                    width={320}
                    height={320}
                    className={style.signupCenterDesign}
                    loading="lazy"
                />
            </div>

            {/* Tagline */}
            <h2 className={style.signupTagline}>
                Connecting <span className={style.signupHighlightOrange}>Seekers</span> And{" "}
                <span className={style.signupHighlightOrange}>Providers</span> In ONE Trusted DESI
                Community Platform.
            </h2>

            {/* Description */}
            <p className={style.signupDescription}>
                A trusted space where families and friends can easily find help, share
                services, and support each other—just like asking a neighbors back home,
                but online this time.
            </p>

            {/* Stats */}
            <div className={style.signupStats}>
                <div className={style.signupStatItem}>
                    <span className={style.signupStatNumber}>200+</span>
                    <span className={style.signupStatLabel}>Daily Visitors</span>
                </div>
                <div className={style.signupStatDivider}></div>
                <div className={style.signupStatItem}>
                    <span className={style.signupStatNumber}>1200+</span>
                    <span className={style.signupStatLabel}>Number of members</span>
                </div>
            </div>
        </div>
    );
};

export default memo(SignupLeftPanel);
