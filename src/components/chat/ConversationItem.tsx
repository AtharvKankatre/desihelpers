import React, { useEffect, useState } from 'react';
import styles from '@/styles/Chat.module.css';
import { Conversation, useChatStore } from '@/stores/ChatStore';
import { getWorkPhotoUrls } from '@/utils/s3Helper';

interface Props {
  conversation: Conversation;
  isActive: boolean;
  onClick: () => void;
  currentUserId: string;
}

export const ConversationItem: React.FC<Props> = ({
  conversation,
  isActive,
  onClick,
  currentUserId,
}) => {
  const [profilePhotoUrl, setProfilePhotoUrl] = useState<string | null>(null);
  const onlineUsers = useChatStore((state) => state.onlineUsers);

  // We need to display the OTHER participant's details
  const otherParticipantId = conversation.participants.find(p => p !== currentUserId);
  const participantDetails = conversation.otherParticipant;
  const isOnline = otherParticipantId ? onlineUsers.has(otherParticipantId) : false;

  const dummyImage = '/assets/icons/form_icons/icon_dummy_user.svg';

  useEffect(() => {
    // If we have profile data but no cached S3 URL, fetch it
    const fetchPhoto = async () => {
      if (participantDetails?.profilePhoto) {
        const bucketName = process.env.NEXT_PUBLIC_AWS_S3_BUCKET;
        if (bucketName) {
            const urls = await getWorkPhotoUrls(bucketName, [participantDetails.profilePhoto]);
            if (urls.length > 0) setProfilePhotoUrl(urls[0]);
        }
      }
    };
    fetchPhoto();
  }, [participantDetails]);

  // Format date correctly (Today: HH:MM, Yesterday: 'Yesterday', Older: MM/DD)
  const formatTime = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };

  return (
    <div
      className={`${styles.conversationItem} ${isActive ? styles.active : ''}`}
      onClick={onClick}
    >
      <div className={styles.avatarContainer}>
        <img
          src={profilePhotoUrl || dummyImage}
          alt="Avatar"
          className={styles.avatar}
        />
        {isOnline && <span className={styles.onlineBadge}></span>}
      </div>

      <div className={styles.conversationDetails}>
        <div className={styles.conversationHeader}>
          <h4 className={styles.displayName}>
            {participantDetails?.displayName || 'Desi Helper User'}
          </h4>
          <span 
            className={`${styles.time} ${
              conversation.unreadCount && conversation.unreadCount > 0 ? styles.unreadTime : ''
            }`}
          >
            {formatTime(conversation.lastMessageAt)}
          </span>
        </div>

        <div className={styles.previewContainer}>
          <p
            className={`${styles.conversationPreview} ${
              conversation.unreadCount && conversation.unreadCount > 0
                ? styles.unread
                : ''
            }`}
          >
            {conversation.lastMessage || 'New conversation'}
          </p>

          {conversation.unreadCount && conversation.unreadCount > 0 && (
            <span className={styles.unreadBadge}>{conversation.unreadCount}</span>
          )}
        </div>
      </div>
    </div>
  );
};
