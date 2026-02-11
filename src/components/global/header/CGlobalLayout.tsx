import { FunctionComponent } from "react";
import { CHeader } from "@/components/global/header/CHeader";
import { FooterSection } from "@/components/page_related/landing/FooterSection";
import styles from "@/styles/Common.module.css";
import GuildLinesAccordian from "@/components/page_related/landing/GuideLinesAccordion";
import { useRouter } from "next/router";

type Props = {
  children: any;
};

export const CGlobalLayout: FunctionComponent<Props> = ({ children }) => {
  const router = useRouter();

  // Hide global header on profile page (it has its own integrated header)
  const hideGlobalHeader = router.pathname === "/profile";

  return (
    <>
      {!hideGlobalHeader && (
        <header
          className={`container-fluid bg-body ${styles.headerMain}`}
          style={{ position: "relative", zIndex: 10000 }}
        >
          <CHeader />
        </header>
      )}
      <div className={hideGlobalHeader ? "" : styles.body}>
        <div>{children}</div>
      </div>
      {!hideGlobalHeader && <FooterSection />}
    </>
  );
};
