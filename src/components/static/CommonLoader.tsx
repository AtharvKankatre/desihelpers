import styles from "@/styles/PageLoader.module.css";

export const CCommonLoader = () => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "20px",
        padding: "24px 16px",
        maxWidth: "800px",
        margin: "0 auto",
        width: "100%",
      }}
    >
      {/* Skeleton row 1 */}
      <div className={styles.skeletonRow}>
        <div className={`${styles.skeletonBone} ${styles.skeletonCircle}`} />
        <div className={styles.skeletonLines}>
          <div className={`${styles.skeletonBone} ${styles.skeletonLine} ${styles.skeletonLineLong}`} />
          <div className={`${styles.skeletonBone} ${styles.skeletonLine} ${styles.skeletonLineMed}`} />
        </div>
      </div>

      {/* Skeleton row 2 */}
      <div className={styles.skeletonRow}>
        <div className={`${styles.skeletonBone} ${styles.skeletonCircle}`} />
        <div className={styles.skeletonLines}>
          <div className={`${styles.skeletonBone} ${styles.skeletonLine} ${styles.skeletonLineMed}`} />
          <div className={`${styles.skeletonBone} ${styles.skeletonLine} ${styles.skeletonLineShort}`} />
        </div>
      </div>

      {/* Skeleton card block */}
      <div className={styles.skeletonCardGrid} style={{ gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))" }}>
        {[0, 1, 2].map((i) => (
          <div className={styles.skeletonCard} key={i}>
            <div className={`${styles.skeletonBone} ${styles.skeletonCardImage}`} style={{ height: "100px" }} />
            <div className={styles.skeletonCardBody}>
              <div className={`${styles.skeletonBone} ${styles.skeletonCardTitle}`} />
              <div className={`${styles.skeletonBone} ${styles.skeletonCardText}`} />
              <div className={`${styles.skeletonBone} ${styles.skeletonCardTextShort}`} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
