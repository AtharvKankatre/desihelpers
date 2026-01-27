import { FunctionComponent } from "react";
import styles from "@/styles/Common.module.css";

type Props = {
  title: string;
  label: string;
  isColumn?: boolean;
  isHref?: boolean;
  className?: string;
};

export const CTitlePlusLabel: FunctionComponent<Props> = ({ ...Props }) => {
  if (Props.isColumn == true) {
    return (
      <div className={Props.className}>
        <span
          className={`h6 ${styles.titlePlusLabelForTitle}`}
        >{`${Props.title} : `}</span>
        <span className={`h6 ${styles.titlePlusLabelForLabel}`}>
          {Props.label}
        </span>
      </div>
    );
  }

  return (
    <div>
      <span
        className={`h6 ${styles.titlePlusLabelForTitle}`}
      >{`${Props.title} : `}</span>

      {Props.isHref == true ? (
        <a
          className={`h6 ${styles.titlePlusLabelForLabel} ${styles.hrefLabel}`}
          href={Props.label}
        >
          {Props.label}
        </a>
      ) : (
        <span className={`h6 ${styles.titlePlusLabelForLabel} `}>
          {Props.label}
        </span>
      )}
    </div>
  );
};
