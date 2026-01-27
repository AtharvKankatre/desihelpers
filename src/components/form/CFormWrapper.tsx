import styles from "@/styles/Forms.module.css";
import { FunctionComponent } from "react";

type Props = {
  children: any;
  title: string;
  onSubmit: any;
  className?: string;
  formBGClassName?: string;
};

export const CFormWrapper: FunctionComponent<Props> = ({
  children,
  title,
  onSubmit,
  className = "col-md-10",
  formBGClassName,
}) => {
  return (
    <div className={`row ${formBGClassName ?? styles.formMainBody}`}>
      <div className={className}>
        <div className="h1 text-center">{title}</div>
        <div className={styles.formBody}>
          <form onSubmit={onSubmit} className="row">
            {children}
          </form>
        </div>
      </div>
    </div>
  );
};
