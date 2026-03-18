import React, { useState } from 'react';
import styles from '@/styles/Chat.module.css';
import { ConversationItem } from './ConversationItem';
import { useChatStore } from '@/stores/ChatStore';
import { useRouter } from 'next/router';
import { IoArrowBack } from 'react-icons/io5';

interface Props {
  currentUserId: string;
  onSelectConversation: () => void;
  className?: string;
}

export const ConversationList: React.FC<Props> = ({ currentUserId, onSelectConversation, className = '' }) => {
  const conversations = useChatStore((state) => state.conversations);
  const activeConversationId = useChatStore((state) => state.activeConversationId);
  const setActiveConversation = useChatStore((state) => state.setActiveConversation);
  const isConnected = useChatStore((state) => state.isConnected);
  const isConnecting = useChatStore((state) => state.isConnecting);
  const router = useRouter();

  const [searchQuery, setSearchQuery] = useState('');

  const handleSelect = (id: string) => {
    setActiveConversation(id);
    onSelectConversation();
  };

  const filteredConversations = conversations.filter((conv) => {
    // Hide totally empty conversations that aren't the currently active one
    if (!conv.lastMessage && conv._id !== activeConversationId) {
      return false;
    }
    
    if (!searchQuery) return true;
    const name = conv.otherParticipant?.displayName?.toLowerCase() || '';
    return name.includes(searchQuery.toLowerCase());
  });

  const isLoading = isConnecting && conversations.length === 0;

  return (
    <div className={`${styles.sidebar} ${className}`}>
      <div className={styles.sidebarHeader}>
        <button className={styles.backButtonList} onClick={() => router.push('/')} aria-label="Go back">
          <IoArrowBack />
        </button>
        <h2>Messages</h2>
      </div>

      {/* Connection Status Banner */}
      {!isConnected && (
        <div className={styles.connectionBanner}>
          <span className={styles.connectionDot} />
          {isConnecting ? 'Connecting to chat...' : 'Reconnecting to chat...'}
        </div>
      )}

      {/* Search Bar */}
      <div className={styles.searchBar}>
        <input
          type="text"
          className={styles.searchInput}
          placeholder="Search or start new chat"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className={styles.conversationList}>
        {isLoading ? (
          <div className={styles.listLoading}>
            {[1, 2, 3, 4].map(i => (
              <div key={i} className={styles.skeletonItem}>
                <div className={styles.skeletonAvatar} />
                <div className={styles.skeletonLines}>
                  <div className={styles.skeletonLine} style={{ width: '60%' }} />
                  <div className={styles.skeletonLine} style={{ width: '80%', height: '10px', marginTop: '6px' }} />
                </div>
              </div>
            ))}
          </div>
        ) : conversations.length === 0 ? (
          <div className={styles.emptyConversations}>
            <div className={styles.emptyConvIcon}>💬</div>
            <p className={styles.emptyConvTitle}>No conversations yet</p>
            <p className={styles.emptyConvSubtitle}>Start chatting by visiting a service provider or job poster profile.</p>
            <button
              className={styles.findPeopleBtn}
              onClick={() => router.push('/seekers/ViewAllSeekers')}
            >
              Find Service Providers
            </button>
          </div>
        ) : filteredConversations.length === 0 ? (
          <div className={styles.emptyConversations}>
            <div className={styles.emptyConvIcon}>🔍</div>
            <p className={styles.emptyConvTitle}>No results</p>
            <p className={styles.emptyConvSubtitle}>No chats found for &quot;{searchQuery}&quot;.</p>
          </div>
        ) : (
          filteredConversations.map((conv) => (
            <ConversationItem
              key={conv._id}
              conversation={conv}
              isActive={conv._id === activeConversationId}
              onClick={() => handleSelect(conv._id)}
              currentUserId={currentUserId}
            />
          ))
        )}
      </div>
    </div>
  );
};
