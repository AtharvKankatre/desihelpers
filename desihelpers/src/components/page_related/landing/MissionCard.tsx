import { CLabel } from "@/components/reusable/labels/CLabel";
import { FunctionComponent } from "react";
import styles from "@/styles/Landing.module.css";

type Props = {
  title: string;
  content: string;
  icon: string;
  className?: string | undefined;
};

export const MissionCards: FunctionComponent<Props> = ({
  title,
  content,
  icon,
  className,
}) => {
  return (
    <div className={className}>
      {" "}
      <div className="col p-2 m-2">
        <img src={icon} alt={title} />
        <CLabel className={styles.titleLargeCenterAlign} label={title} />
        <CLabel className={styles.bodyCenterAlign} label={content} />
      </div>
    </div>
  );
};
