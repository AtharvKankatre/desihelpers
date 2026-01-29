import { FunctionComponent } from "react";
import { CHeader } from "@/components/global/header/CHeader";
import { FooterSection } from "@/components/page_related/landing/FooterSection";
import styles from "@/styles/Common.module.css";
import GuildLinesAccordian from "@/components/page_related/landing/GuideLinesAccordion";

type Props = {
  children: any;
};

export const CGlobalLayout: FunctionComponent<Props> = ({ children }) => {
  return (
    <>
      <header
        className={`container-fluid bg-body ${styles.headerMain}`}
        style={{ position: "relative", zIndex: 10000 }}
      >
        <CHeader />
      </header>
      <div className={styles.body}>
        <div>{children}</div>
      </div>
      <FooterSection />
    </>
  );
};
