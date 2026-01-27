import { CDividerLine } from "@/components/global/footer/footer_components/CDividerLine";
import { CLabel } from "@/components/reusable/labels/CLabel";
import styles from "@/styles/Landing.module.css";
import { MissionCards } from "./MissionCard";
import style from "@/styles/Common.module.css"
import { CParagraph } from "@/components/reusable/labels/CParagraph";

export const CMissionStatement = () => {
  return (
    <div className="container">
    <div className="row align-items-center margin-auto text-center">
      <CLabel className={`col-md-12 col-sm-12 fs-1 ${style.pLabel}`} label="mission_title" />
      <CParagraph className={`col-md-12 col-sm-12  ${style.bodyText}`} label="mission_body" />
      <MissionCards
        title="connect_title"
        content="connect_body"
        icon="assets/img_mission_connect.svg"
        className="col-md-4 col-sm-12"
      />
      <MissionCards
        title="care_title"
        content="care_body"
        icon="assets/img_mission_care.svg"
        className="col-md-4 col-sm-12"
      />
      <MissionCards
        title="excel_title"
        content="excel_body"
        icon="assets/img_mission_excel.svg"
        className="col-md-4 col-sm-12"
      />
    </div>
    </div>
    // ----Kept for future use ----
    // <div className={styles.missionMainContainer}>
    //   <div>
    //     <CLabel
    //       className={styles.titleLargeCenterAlign}
    //       label="mission_title"
    //     />
    //     <CLabel className={styles.bodyCenterAlign} label="mission_body" />
    //   </div>

    //   <div className={styles.missionCardsRow}>
    //     <MissionCards
    //       title="connect_title"
    //       content="connect_body"
    //       icon="assets/img_mission_connect.svg"
    //     />
    //     <MissionCards
    //       title="care_title"
    //       content="care_body"
    //       icon="assets/img_mission_care.svg"
    //     />
    //     <MissionCards
    //       title="excel_title"
    //       content="excel_body"
    //       icon="assets/img_mission_excel.svg"
    //     />
    //   </div>
    // </div>
  );
};
