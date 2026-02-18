import { FunctionComponent } from "react";
import styles from "@/styles/Forms.module.css";
import Image from "next/image";

type Props = {
  label: string;
  img: string;
  alt: string;
  className?: string;
  onClick: any;
  color?: string;
  fgColor?: string;
  readonly: boolean;
};

export const CIconTextButton: FunctionComponent<Props> = ({ ...Props }) => {
  return (
    <button
      className={`${styles.iconTextButton} ${Props.className}`}
      disabled={Props.readonly}
      style={{
        backgroundColor: Props.color,
        color: Props.fgColor ?? "#FBFBFB",
      }}
    >
      <div className="d-flex flex-row align-items-self-start">
        <Image src={Props.img} alt={Props.alt} height={24} width={24} />
        <div className="h6 ps-2">{Props.label}</div>
      </div>
    </button>
  );
};
