import React from 'react';
import styles from '@/styles/Chat.module.css';
import { Message } from '@/stores/ChatStore';
import { IoCheckmark, IoCheckmarkDone } from 'react-icons/io5';

interface Props {
  message: Message;
  currentUserId: string;
}

export const MessageBubble: React.FC<Props> = ({ message, currentUserId }) => {
  const isSentByMe = message.senderId === currentUserId;

  const formattedTime = new Date(message.createdAt).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div
      className={`${styles.messageWrapper} ${
        isSentByMe ? styles.sent : styles.received
      }`}
    >
      <div
        className={`${styles.messageBubble} ${
          isSentByMe ? styles.sent : styles.received
        }`}
      >
        <span className={styles.messageText}>{message.content}</span>
        <div className={styles.messageMeta}>
          <span className={styles.messageTime}>{formattedTime}</span>
          {isSentByMe && (
            <span className={`${styles.readReceipt} ${message.isRead ? styles.read : ''}`}>
              {message.isRead ? <IoCheckmarkDone size={14} /> : <IoCheckmark size={14} />}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
