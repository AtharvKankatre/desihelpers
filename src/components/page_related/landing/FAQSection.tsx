import React, { useState } from "react";
import { useRouter } from "next/router";
import styles from "@/styles/FAQSection.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import useTranslation from "next-translate/useTranslation";

const faqData = [
    {
        id: 1,
        question: "1. What is DesiHelpers.com?",
        answer: "DesiHelpers.com is a community platform that connects Indian families in the U.S. with trusted helpers and service providers—like nannies, caterers, bakers, and tutors—who understand their cultural needs. It makes finding and offering services easy, reliable, and feel like family, all in one place."
    },
    {
        id: 2,
        question: "2. How does the platform help Job Posters?",
        answer: "Job posters can easily list their requirements and connect with verified service providers in their local area who match their specific cultural and service needs."
    },
    {
        id: 3,
        question: "3. How does DesiHelpers.com help job seekers?",
        answer: "Job seekers can create profiles showcasing their skills and connect directly with families looking for their specific services, helping them find meaningful work."
    },
    {
        id: 4,
        question: "4. Is the platform free to use?",
        answer: "Yes, joining the community and browsing listings is completely free for everyone."
    },
    {
        id: 5,
        question: "5. Does the platform collect any sensitive information?",
        answer: "No, we prioritize user privacy. We do not collect sensitive personal data beyond what is necessary for connecting trusted members."
    }
];

export const FAQSection: React.FC = () => {
    const router = useRouter();
    const { t } = useTranslation('common');
    const [activeIndex, setActiveIndex] = useState<number | null>(0);

    const faqData = [
        { id: 1, question: t('faq.q1'), answer: t('faq.a1') },
        { id: 2, question: t('faq.q2'), answer: t('faq.a2') },
        { id: 3, question: t('faq.q3'), answer: t('faq.a3') },
        { id: 4, question: t('faq.q4'), answer: t('faq.a4') },
        { id: 5, question: t('faq.q5'), answer: t('faq.a5') },
    ];

    const toggleFAQ = (index: number) => {
        setActiveIndex(activeIndex === index ? null : index);
    };

    return (
        <section className={styles.section}>
            <div className={styles.container}>
                {/* Left Side */}
                <div className={styles.leftColumn}>
                    <h2 className={styles.title}>{t('faq.title')}</h2>
                    <p className={styles.description}>
                        {t('faq.description')}
                    </p>
                    <button className={styles.connectButton} onClick={() => router.push("/Login?mode=signup")}>{t('faq.connect_us')}</button>
                </div>

                {/* Right Side - Accordion */}
                <div className={styles.rightColumn}>
                    {faqData.map((faq, index) => (
                        <div key={faq.id} className={styles.faqItem}>
                            <div
                                className={styles.questionRow}
                                onClick={() => toggleFAQ(index)}
                            >
                                <span className={`${styles.questionText} ${activeIndex === index ? styles.active : ''}`}>
                                    {faq.question}
                                </span>
                                <FontAwesomeIcon
                                    icon={faChevronDown}
                                    className={`${styles.toggleIcon} ${activeIndex === index ? styles.active : ''}`}
                                />
                            </div>
                            {activeIndex === index && (
                                <div className={styles.answer}>
                                    {faq.answer}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};
