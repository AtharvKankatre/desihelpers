import { create } from 'zustand';

export interface Message {
  _id: string;
  conversationId: string;
  senderId: string;
  content: string;
  isRead: boolean;
  createdAt: string;
}

export interface Conversation {
  _id: string;
  participants: string[];
  lastMessage: string;
  lastMessageAt: string;
  unreadCount?: number;
  otherParticipant?: any; // Populated later with user details
}

interface ChatState {
  conversations: Conversation[];
  activeConversationId: string | null;
  messages: { [conversationId: string]: Message[] }; // Map of conversation ID to messages array
  unreadTotal: number;
  isConnecting: boolean;
  isConnected: boolean;
  typingUsers: { [conversationId: string]: string[] }; // Map of conversation ID to array of typing user IDs
  onlineUsers: Set<string>; // Set of currently online userIds

  // Actions
  setConversations: (conversations: Conversation[]) => void;
  updateConversationPreview: (conversationId: string, content: string, date: string) => void;
  setActiveConversation: (id: string | null) => void;
  setMessages: (conversationId: string, messages: Message[]) => void;
  addMessage: (conversationId: string, message: Message) => void;
  setUnreadTotal: (count: number) => void;
  decreaseUnreadCount: (conversationId: string) => void;
  setConnectionStatus: (isConnecting: boolean, isConnected: boolean) => void;
  addTypingUser: (conversationId: string, userId: string) => void;
  removeTypingUser: (conversationId: string, userId: string) => void;
  markConversationAsReadLocally: (conversationId: string) => void;
  replaceOptimisticMessage: (conversationId: string, tempId: string, realMessage: Message) => void;
  setUserOnline: (userId: string) => void;
  setUserOffline: (userId: string) => void;
  setBulkOnlineStatus: (statuses: { [userId: string]: boolean }) => void;
}

export const useChatStore = create<ChatState>((set, get) => ({
  conversations: [],
  activeConversationId: null,
  messages: {},
  unreadTotal: 0,
  isConnecting: false,
  isConnected: false,
  typingUsers: {},
  onlineUsers: new Set<string>(),

  setConversations: (conversations) => set({ conversations }),

  updateConversationPreview: (conversationId, content, date) => set((state) => {
    const updatedConversations = state.conversations.map(conv => {
      if (conv._id === conversationId) {
        return {
          ...conv,
          lastMessage: content.length > 50 ? content.substring(0, 50) + '...' : content,
          lastMessageAt: date,
        };
      }
      return conv;
    });
    // Re-sort so newest is top
    updatedConversations.sort((a, b) => new Date(b.lastMessageAt).getTime() - new Date(a.lastMessageAt).getTime());
    return { conversations: updatedConversations };
  }),

  setActiveConversation: (id) => set({ activeConversationId: id }),

  setMessages: (conversationId, newMessages) => set((state) => ({
    messages: {
      ...state.messages,
      [conversationId]: newMessages,
    }
  })),

  addMessage: (conversationId, message) => set((state) => {
    const existingMessages = state.messages[conversationId] || [];
    // Only add if it doesn't already exist (avoid duplicates from socket + API)
    if (existingMessages.some(m => m._id === message._id)) {
      return state;
    }
    return {
      messages: {
        ...state.messages,
        [conversationId]: [...existingMessages, message],
      }
    };
  }),

  setUnreadTotal: (count) => set({ unreadTotal: count }),

  decreaseUnreadCount: (conversationId) => set((state) => {
    let unreadDelta = 0;
    const updatedConversations = state.conversations.map(conv => {
      if (conv._id === conversationId && (conv.unreadCount || 0) > 0) {
        unreadDelta = conv.unreadCount || 0;
        return { ...conv, unreadCount: 0 };
      }
      return conv;
    });
    
    return { 
      conversations: updatedConversations,
      unreadTotal: Math.max(0, state.unreadTotal - unreadDelta) 
    };
  }),

  setConnectionStatus: (isConnecting, isConnected) => set({ isConnecting, isConnected }),

  addTypingUser: (conversationId, userId) => set((state) => {
    const currentTyping = state.typingUsers[conversationId] || [];
    if (currentTyping.includes(userId)) return state;
    
    return {
      typingUsers: {
        ...state.typingUsers,
        [conversationId]: [...currentTyping, userId],
      }
    };
  }),

  removeTypingUser: (conversationId, userId) => set((state) => {
    const currentTyping = state.typingUsers[conversationId] || [];
    return {
      typingUsers: {
        ...state.typingUsers,
        [conversationId]: currentTyping.filter(id => id !== userId),
      }
    };
  }),

  markConversationAsReadLocally: (conversationId) => set((state) => {
    const currentMessages = state.messages[conversationId] || [];
    const updatedMessages = currentMessages.map(m => ({ ...m, isRead: true }));
    return {
      messages: {
        ...state.messages,
        [conversationId]: updatedMessages
      }
    };
  }),

  replaceOptimisticMessage: (conversationId, tempId, realMessage) => set((state) => {
    const existingMessages = state.messages[conversationId] || [];
    // If the real message already exists, just remove the optimistic one
    const realAlreadyExists = existingMessages.some(m => m._id === realMessage._id);
    const updatedMessages = realAlreadyExists
      ? existingMessages.filter(m => m._id !== tempId)
      : existingMessages.map(m => m._id === tempId ? realMessage : m);
    return {
      messages: {
        ...state.messages,
        [conversationId]: updatedMessages,
      },
    };
  }),

  setUserOnline: (userId) => set((state) => {
    const newSet = new Set(state.onlineUsers);
    newSet.add(userId);
    return { onlineUsers: newSet };
  }),

  setUserOffline: (userId) => set((state) => {
    const newSet = new Set(state.onlineUsers);
    newSet.delete(userId);
    return { onlineUsers: newSet };
  }),

  setBulkOnlineStatus: (statuses) => set((state) => {
    const newSet = new Set(state.onlineUsers);
    for (const [userId, isOnline] of Object.entries(statuses)) {
      if (isOnline) {
        newSet.add(userId);
      } else {
        newSet.delete(userId);
      }
    }
    return { onlineUsers: newSet };
  }),
}));
