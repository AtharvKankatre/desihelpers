import React from 'react';
import styles from '@/styles/Common.module.css';

interface CardProps {
  cardHeader: string;
  cardTitle: React.ReactNode;
  cardText: string;
  cardColor: string; // Color for the border of the card
  titleColor: string; // Color for the title text
  Icons:React.ReactNode;
}

const InfoCard: React.FC<CardProps> = ({ cardHeader, cardTitle, cardText, cardColor, titleColor,Icons }) => {
  return (
<div
  className={`card mb-3 ms-4 ${styles.card}`}
  style={{ borderColor: cardColor, background: cardColor }}
>
<div className={`${styles.h5CSS} text-start`}>{cardHeader}</div>
  <div className="card-body d-flex justify-content-between ">
  <div className="me-2">
      <h5 className={`card-title text-${titleColor} fw-bold ${styles.pLabelsmall}`}>
        {cardTitle}
      </h5>
      <p className={`card-text ${styles.pLabelsmall} mb-0`}>{cardText}</p>
    </div>
    <span className="fs-2 ms-3">{Icons}</span>
  </div>
</div>

  );
};

export default InfoCard;

