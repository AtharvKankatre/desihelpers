import React from 'react';
import styles from '@/styles/Chat.module.css';

export const MessagesSkeleton: React.FC = () => {
  return (
    <div className={`container-fluid p-0 ${styles.chatLayoutContainer}`} style={{ background: '#fff' }}>
      {/* Sidebar Skeleton */}
      <div className={styles.sidebar} style={{ borderRight: '1px solid #e0e8f0' }}>
        <div className={styles.sidebarHeader} style={{ background: '#002b5c' }}>
          <div className={styles.skeletonLine} style={{ width: '100px', height: '20px', background: 'rgba(255,255,255,0.2)' }} />
        </div>
        <div className={styles.searchBar}>
          <div className={styles.skeletonLine} style={{ width: '100%', height: '36px', borderRadius: '18px' }} />
        </div>
        <div className={styles.conversationList}>
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className={styles.skeletonItem}>
              <div className={styles.skeletonAvatar} style={{ width: '40px', height: '40px' }} />
              <div className={styles.skeletonLines}>
                <div className={styles.skeletonLine} style={{ width: '40%', marginBottom: '8px' }} />
                <div className={styles.skeletonLine} style={{ width: '70%', height: '10px' }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Chat Skeleton */}
      <div className={styles.chatArea} style={{ background: '#f4f7fb' }}>
        <div className={styles.skeletonHeader} style={{ background: '#002b5c', borderBottom: 'none' }}>
          <div className={styles.skeletonAvatar} style={{ width: '38px', height: '38px', marginRight: '12px', background: 'rgba(255,255,255,0.2)' }} />
          <div className={styles.skeletonLines}>
            <div className={styles.skeletonLine} style={{ width: '120px', background: 'rgba(255,255,255,0.2)' }} />
          </div>
        </div>
        
        <div className={styles.messageList} style={{ padding: '20px 5%' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div className={styles.skeletonBubble} style={{ alignSelf: 'flex-start', width: '30%' }} />
            <div className={styles.skeletonBubble} style={{ alignSelf: 'flex-end', width: '45%' }} />
            <div className={styles.skeletonBubble} style={{ alignSelf: 'flex-start', width: '25%' }} />
            <div className={styles.skeletonBubble} style={{ alignSelf: 'flex-end', width: '35%' }} />
            <div className={styles.skeletonBubble} style={{ alignSelf: 'flex-start', width: '40%' }} />
          </div>
        </div>

        <div className={styles.chatInputContainer}>
          <div className={styles.skeletonLine} style={{ flex: 1, height: '44px', borderRadius: '22px' }} />
          <div className={styles.skeletonAvatar} style={{ width: '44px', height: '44px' }} />
        </div>
      </div>
    </div>
  );
};
