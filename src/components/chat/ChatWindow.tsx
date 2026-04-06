import React, { useEffect, useRef, useState, useCallback } from 'react';
import styles from '@/styles/Chat.module.css';
import { IoSendSharp, IoArrowBack, IoRefreshOutline, IoTrashOutline, IoWarningOutline } from 'react-icons/io5';
import { Conversation, Message, useChatStore } from '@/stores/ChatStore';
import { MessageBubble } from './MessageBubble';
import { chatService } from '@/services/chat/chatService';
import ApiService from '@/services/data/crud/crud';
import { APIDetails } from '@/services/data/constants/ApiDetails';
import { getWorkPhotoUrls } from '@/utils/s3Helper';

interface Props {
  conversation: Conversation | null;
  currentUserId: string;
  onBack: () => void;
}

export const ChatWindow: React.FC<Props> = ({ conversation, currentUserId, onBack }) => {
  const [inputValue, setInputValue] = useState('');
  const [profilePhotoUrl, setProfilePhotoUrl] = useState<string | null>(null);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Zustand store
  const messages = useChatStore((state) =>
    conversation ? state.messages[conversation._id] || [] : []
  );
  const typingUsers = useChatStore((state) =>
    conversation ? state.typingUsers[conversation._id] || [] : []
  );
  const setMessages = useChatStore((state) => state.setMessages);
  const isConnected = useChatStore((state) => state.isConnected);
  const isConnecting = useChatStore((state) => state.isConnecting);
  const onlineUsers = useChatStore((state) => state.onlineUsers);

  // Participant info
  const otherParticipantId = conversation?.participants.find((p) => p !== currentUserId);
  const participantDetails = conversation?.otherParticipant;
  const isTyping = !!(otherParticipantId && typingUsers.includes(otherParticipantId));
  const isOtherUserOnline = otherParticipantId ? onlineUsers.has(otherParticipantId) : false;
  const dummyImage = '/assets/icons/form_icons/icon_dummy_user.svg';
  const displayName = participantDetails?.displayName || 'Desi Helper User';

  // Request online status when conversation opens
  useEffect(() => {
    if (otherParticipantId && isConnected) {
      chatService.requestOnlineStatus([otherParticipantId]);
    }
  }, [otherParticipantId, isConnected]);

  // Fetch profile photo from S3
  useEffect(() => {
    const fetchPhoto = async () => {
      if (participantDetails?.profilePhoto) {
        const bucketName = process.env.NEXT_PUBLIC_AWS_S3_BUCKET;
        if (bucketName) {
          const urls = await getWorkPhotoUrls(bucketName, [participantDetails.profilePhoto]);
          if (urls.length > 0) setProfilePhotoUrl(urls[0]);
        }
      } else {
        setProfilePhotoUrl(null);
      }
    };
    fetchPhoto();
  }, [participantDetails]);

  // Auto-scroll to bottom safely without triggering document-level scroll
  const scrollToBottom = useCallback(() => {
    const list = document.getElementById('messageList');
    if (list) {
      list.scrollTo({ top: list.scrollHeight, behavior: 'smooth' });
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping, scrollToBottom]);

  // Fetch historic messages when conversation changes
  useEffect(() => {
    if (!conversation) return;

    const fetchMessages = async () => {
      setIsLoadingMessages(true);
      const res = await ApiService.crud(APIDetails.getMessages, conversation._id);
      setIsLoadingMessages(false);

      if (res[0] && res[1]?.messages) {
        // Normalize all IDs to strings
        const normalized = res[1].messages.map((m: any) => ({
          ...m,
          _id: String(m._id),
          conversationId: String(m.conversationId),
        }));
        setMessages(conversation._id, normalized);
      }
    };

    fetchMessages();

    // Mark as read when opened
    if ((conversation.unreadCount || 0) > 0) {
      chatService.markAsRead(conversation._id);
    }
  }, [conversation?._id, setMessages]);

  // ============================================================
  //  SEND — optimistic UI: show message immediately, server confirms
  // ============================================================
  const handleSend = (e?: React.FormEvent) => {
    e?.preventDefault();
    const text = inputValue.trim();
    if (!text || !conversation) return;

    if (!isConnected) {
      chatService.connect();
      return;
    }

    const optimisticMsg: Message = {
      _id: `optimistic_${Date.now()}`,
      conversationId: conversation._id,
      senderId: currentUserId,
      content: text,
      isRead: false,
      createdAt: new Date().toISOString(),
    };
    useChatStore.getState().addMessage(conversation._id, optimisticMsg);
    useChatStore.getState().updateConversationPreview(conversation._id, text, optimisticMsg.createdAt);

    chatService.sendMessage(conversation._id, text);
    setInputValue('');
    // Reset textarea height
    if (inputRef.current) {
      inputRef.current.style.height = 'auto';
    }
    inputRef.current?.focus();
  };

  // Send on Enter (Shift+Enter for newline)
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Throttled typing indicator + textarea auto-resize
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(e.target.value);
    // Auto-resize textarea
    e.target.style.height = 'auto';
    e.target.style.height = `${Math.min(e.target.scrollHeight, 120)}px`;
    if (conversation && isConnected) {
      if (!typingTimeoutRef.current) {
        chatService.emitTyping(conversation._id);
      }
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = setTimeout(() => {
        typingTimeoutRef.current = null;
      }, 2000);
    }
  };

  // ─────────────────────────────────────────────
  //  EMPTY STATE — no conversation selected
  // ─────────────────────────────────────────────
  if (!conversation) {
    return (
      <div className={styles.emptyState}>
        <div className={styles.emptyStateInner}>
          <div className={styles.emptyStateIcon}>💬</div>
          <h3 className={styles.emptyStateTitle}>Your Messages</h3>
          <p className={styles.emptyStateText}>
            Select a conversation from the left to start chatting, or find a service provider to message.
          </p>
        </div>
      </div>
    );
  }

  const statusText = !isConnected
    ? isConnecting ? 'Connecting...' : 'Disconnected'
    : isTyping
    ? `${displayName.split(' ')[0]} is typing...`
    : isOtherUserOnline
    ? 'Online'
    : 'Offline';

  return (
    <div className={styles.chatArea}>
      {/* ── Header ── */}
      <div className={styles.chatHeader}>
        <div className={styles.chatHeaderLeft}>
          <button className={styles.backButton} onClick={onBack} aria-label="Go back">
            <IoArrowBack size={20} />
          </button>
          <div className={styles.avatarContainer}>
            <img
              src={profilePhotoUrl || dummyImage}
              alt={displayName}
              className={styles.chatHeaderAvatar}
              onError={(e) => { (e.target as HTMLImageElement).src = dummyImage; }}
            />
            {isOtherUserOnline && <span className={styles.onlineBadge} />}
          </div>
          <div className={styles.chatHeaderInfo}>
            <h3>{displayName}</h3>
            <p className={`${styles.statusText} ${isTyping ? styles.typingStatus : isOtherUserOnline ? styles.onlineStatus : ''}`}>
              {statusText}
            </p>
          </div>
        </div>

        {/* Right side actions */}
        <div className={styles.chatHeaderActions}>
          {/* Reconnect button shown when disconnected */}
          {!isConnected && !isConnecting && (
            <button
              className={styles.reconnectBtn}
              onClick={() => chatService.connect()}
              title="Reconnect"
            >
              <IoRefreshOutline size={18} />
              Reconnect
            </button>
          )}

          {/* Delete conversation button */}
          <button
            className={styles.headerActionBtn}
            title="Delete conversation"
            aria-label="Delete conversation"
            onClick={() => setShowDeleteConfirm(true)}
          >
            <IoTrashOutline size={18} />
          </button>
        </div>
      </div>

      {/* ── Delete Confirmation Modal ── */}
      {showDeleteConfirm && (
        <div className={styles.deleteModalOverlay} onClick={() => setShowDeleteConfirm(false)}>
          <div className={styles.deleteModal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.deleteModalIcon}>
              <IoWarningOutline size={32} />
            </div>
            <h3 className={styles.deleteModalTitle}>Delete Conversation</h3>
            <p className={styles.deleteModalText}>
              Are you sure you want to delete the entire conversation with <strong>{displayName}</strong>? This action cannot be undone.
            </p>
            <div className={styles.deleteModalActions}>
              <button
                className={styles.deleteModalCancel}
                onClick={() => setShowDeleteConfirm(false)}
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button
                className={styles.deleteModalConfirm}
                disabled={isDeleting}
                onClick={async () => {
                  if (!conversation) return;
                  setIsDeleting(true);
                  try {
                    const result = await ApiService.crud(APIDetails.deleteConversation, conversation._id);
                    if (result[0]) {
                      useChatStore.getState().removeConversation(conversation._id);
                      setShowDeleteConfirm(false);
                      onBack();
                    } else {
                      alert('Failed to delete conversation. Please try again.');
                    }
                  } catch (err) {
                    console.error('Failed to delete conversation:', err);
                    alert('Failed to delete conversation. Please try again.');
                  } finally {
                    setIsDeleting(false);
                  }
                }}
              >
                {isDeleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Messages ── */}
      <div className={styles.messageList} id="messageList">
        {isLoadingMessages && messages.length === 0 ? (
          <div className={styles.messagesLoading}>
            <div className={styles.loadingSpinner} />
            <span>Loading messages...</span>
          </div>
        ) : messages.length === 0 ? (
          <div className={styles.noMessages}>
            <div className={styles.noMessagesIcon}>👋</div>
            <p>No messages yet!</p>
            <span>Say hello to {displayName.split(' ')[0]}</span>
          </div>
        ) : (
          messages.map((msg) => (
            <MessageBubble
              key={msg._id}
              message={msg}
              currentUserId={currentUserId}
            />
          ))
        )}

        {/* Typing indicator */}
        {isTyping && (
          <div className={styles.typingIndicatorRow}>
            <div className={styles.typingBubble}>
              <span className={styles.typingDots}>
                <span /><span /><span />
              </span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* ── Input ── */}
      <div className={styles.chatInputContainer}>
        {!isConnected && (
          <div className={styles.disconnectedBar}>
            {isConnecting ? (
              <>
                <div className={styles.connectingSpinner} />
                Connecting to chat...
              </>
            ) : (
              <>
                ⚠️ Disconnected —{' '}
                <button onClick={() => chatService.connect()} className={styles.reconnectInline}>
                  tap to reconnect
                </button>
              </>
            )}
          </div>
        )}
        <form className={styles.inputWrapper} onSubmit={handleSend}>
          <textarea
            ref={inputRef}
            id="chatMessageInput"
            className={styles.messageInput}
            placeholder={isConnected ? `Message ${displayName.split(' ')[0]}...` : 'Reconnecting...'}
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            autoComplete="off"
            rows={1}
          />
          <button
            type="submit"
            id="chatSendButton"
            className={`${styles.sendButton} ${inputValue.trim() ? styles.sendButtonActive : ''}`}
            disabled={!inputValue.trim()}
            aria-label="Send message"
          >
            <IoSendSharp size={20} />
          </button>
        </form>
      </div>
    </div>
  );
};
