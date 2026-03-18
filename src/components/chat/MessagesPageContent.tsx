import React, { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/router';
import styles from '@/styles/Chat.module.css';
import { useAuth } from '@/services/authorization/AuthContext';
import { chatService } from '@/services/chat/chatService';
import { useChatStore } from '@/stores/ChatStore';
import { ConversationList } from '@/components/chat/ConversationList';
import { ChatWindow } from '@/components/chat/ChatWindow';
import ApiService from '@/services/data/crud/crud';
import { APIDetails } from '@/services/data/constants/ApiDetails';
import Cookies from 'js-cookie';
import { cookieParams } from '@/constants/ECookieParams';

/**
 * Safely decode a JWT payload using browser-native atob().
 */
function decodeJwtPayload(token: string): any | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    let base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    const pad = base64.length % 4;
    if (pad) base64 += '='.repeat(4 - pad);
    const decoded = atob(base64);
    return JSON.parse(decoded);
  } catch {
    return null;
  }
}

const MessagesPageContent: React.FC = () => {
  const { isActive } = useAuth();
  const router = useRouter();
  const { userId } = router.query;

  const conversations = useChatStore((state) => state.conversations);
  const activeConversationId = useChatStore((state) => state.activeConversationId);
  const setActiveConversation = useChatStore((state) => state.setActiveConversation);
  const setConversations = useChatStore((state) => state.setConversations);
  const isConnected = useChatStore((state) => state.isConnected);
  
  const [currentUserId, setCurrentUserId] = useState<string>('');
  const [showMobileChat, setShowMobileChat] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [hasFetchedConversations, setHasFetchedConversations] = useState(false);

  // Safely detect mobile
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // 1. Initialize Authentication + ensure socket is connected
  useEffect(() => {
    if (!isActive) {
      router.push('/Login');
      return;
    }
    // Ensure the socket is connected when this page mounts
    // (the global _app.tsx connect may have fired before auth was ready)
    chatService.connect();
  }, [isActive, router]);

  // 2. Extract currentUserId from JWT access token in cookies
  useEffect(() => {
    const token = Cookies.get(cookieParams.accessToken);
    if (token) {
      const payload = decodeJwtPayload(token);
      if (payload?.id) {
        setCurrentUserId(payload.id);
      }
    }
    setIsInitializing(false);
  }, []);

  // 3. Fetch conversations when socket connects
  const fetchConversations = useCallback(async () => {
    const res = await ApiService.crud(APIDetails.getConversations, '');
    if (res[0]) {
      setConversations(res[1]);
    }
    setHasFetchedConversations(true);
  }, [setConversations]);

  // 3. Fetch conversations via REST as soon as userId is known (socket is a bonus for real-time, not required for initial load)
  useEffect(() => {
    if (currentUserId) {
      fetchConversations();
    }
  }, [currentUserId, fetchConversations]);

  // 4. Handle Auto-Open / Create Conversation via URL param ?userId=...
  useEffect(() => {
    // Requires: valid target userId, currentUserId set from JWT
    // Does NOT require isConnected — we fallback to REST API
    if (!userId || typeof userId !== 'string' || !currentUserId) return;
    if (!hasFetchedConversations) return;

    const getOrCreate = async () => {
      // Check existing conversations first
      const existing = conversations.find(c =>
        c.participants.some(p => String(p) === String(userId))
      );
      if (existing) {
        setActiveConversation(String(existing._id));
        if (isMobile) setShowMobileChat(true);
        router.replace('/Messages', undefined, { shallow: true });
      } else {
        const res = await ApiService.crud(APIDetails.getOrCreateConversation, { participantId: userId });
        if (res[0]) {
          await fetchConversations();
          setActiveConversation(String(res[1]._id));
          if (isMobile) setShowMobileChat(true);
          router.replace('/Messages', undefined, { shallow: true });
        }
      }
    };

    const timer = setTimeout(getOrCreate, 150);
    return () => clearTimeout(timer);
  }, [userId, currentUserId, hasFetchedConversations, conversations, router, isMobile, setActiveConversation, fetchConversations]);

  const activeConversation = conversations.find((c) => String(c._id) === String(activeConversationId)) || null;

  if (isInitializing) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '70vh' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (!isActive) {
    return (
      <div className="container mt-5 text-center">
        <h3>Please log in to view your messages.</h3>
      </div>
    );
  }

  if (!currentUserId) {
    return (
      <div className="container mt-5 text-center">
        <h3>User session not found. Please log in again.</h3>
      </div>
    );
  }

  return (
    <div className={`container-fluid p-0 ${styles.chatLayoutContainer}`}>
      <ConversationList 
        currentUserId={currentUserId} 
        onSelectConversation={() => setShowMobileChat(true)}
        className={showMobileChat ? styles.hideOnMobile : ''}
      />
      {(!showMobileChat && isMobile) ? null : (
        <ChatWindow
          conversation={activeConversation}
          currentUserId={currentUserId}
          onBack={() => setShowMobileChat(false)}
        />
      )}
    </div>
  );
};

export default MessagesPageContent;
