import { io, Socket } from 'socket.io-client';
import { useChatStore } from '@/stores/ChatStore';
import CookieService from '@/services/authorization/CookieService';

class ChatService {
  private socket: Socket | null = null;
  private typingTimeout: NodeJS.Timeout | null = null;

  /**
   * Initialize and connect the Socket.IO client
   */
  public connect() {
    const token = CookieService.accessToken();
    if (!token) {
      console.warn('[ChatService] Cannot connect: No auth token found.');
      return;
    }

    // If socket already exists and is connected, skip
    if (this.socket?.connected) {
      return;
    }

    // If socket exists but is disconnected, destroy it first so we get a clean reconnect
    if (this.socket) {
      this.socket.removeAllListeners();
      this.socket.disconnect();
      this.socket = null;
    }

    const {
      setConnectionStatus,
      addMessage,
      replaceOptimisticMessage,
      updateConversationPreview,
      setUnreadTotal,
      addTypingUser,
      removeTypingUser,
      markConversationAsReadLocally,
      setUserOnline,
      setUserOffline,
      setBulkOnlineStatus,
    } = useChatStore.getState();

    setConnectionStatus(true, false);

    // Normalize an ObjectId (object or string) to a plain string
    const toStr = (val: any): string =>
      val && typeof val === 'object' && val.toString ? val.toString() : String(val ?? '');

    // Construct the backend WebSocket URL
    const rawUrl = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001')
      .replace(/\/api\/?$/, '')
      .replace(/\/+$/, '');

    // Extract the origin (protocol + host) and any path prefix
    // e.g. "https://projects.inpinitesolutions.com/desi-helpers-backend"
    //   -> origin: "https://projects.inpinitesolutions.com"
    //   -> pathPrefix: "/desi-helpers-backend"
    let origin = rawUrl;
    let socketPath = '/socket.io';
    try {
      const parsed = new URL(rawUrl);
      origin = parsed.origin; // e.g. "https://projects.inpinitesolutions.com"
      const prefix = parsed.pathname.replace(/\/+$/, ''); // e.g. "/desi-helpers-backend"
      if (prefix && prefix !== '/') {
        socketPath = `${prefix}/socket.io`;
      }
    } catch (e) {
      // fallback: use rawUrl as-is
    }

    console.log('[ChatService] Connecting to WebSocket at:', origin, 'path:', socketPath, 'namespace: /chat');

    this.socket = io(`${origin}/chat`, {
      auth: { token },
      path: socketPath,
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 15,
      reconnectionDelay: 1000,
    });

    // Connection Events
    this.socket.on('connect', () => {
      console.log('[ChatService] Connected to chat server');
      setConnectionStatus(false, true);
    });

    this.socket.on('disconnect', (reason) => {
      console.log('[ChatService] Disconnected:', reason);
      setConnectionStatus(false, false);
    });

    this.socket.on('connect_error', (error) => {
      console.error('[ChatService] Connection error:', error.message);
      setConnectionStatus(false, false);
    });

    // Chat Events — normalize all IDs from Mongoose ObjectId to string
    this.socket.on('newMessage', (data: { message: any; conversationId: string }) => {
      const convId = toStr(data.conversationId);
      const msg = { ...data.message, _id: toStr(data.message._id), conversationId: convId };
      addMessage(convId, msg);
      updateConversationPreview(convId, msg.content, msg.createdAt);
    });

    this.socket.on('messageSent', (message: any) => {
      const convId = toStr(message.conversationId);
      const msg = { ...message, _id: toStr(message._id), conversationId: convId };
      // Replace the optimistic (temp) message with the server-confirmed one.
      // Find any optimistic message in this conversation and swap it out.
      const { messages } = useChatStore.getState();
      const convMessages = messages[convId] || [];
      const optimistic = convMessages.find((m) => m._id.startsWith('optimistic_'));
      if (optimistic) {
        replaceOptimisticMessage(convId, optimistic._id, msg);
      } else {
        // No optimistic found — safe fallback (e.g. sent from another tab)
        addMessage(convId, msg);
      }
      updateConversationPreview(convId, msg.content, msg.createdAt);
    });

    this.socket.on('unreadCount', (data: { unreadCount: number }) => {
      setUnreadTotal(data.unreadCount);
    });

    this.socket.on('userTyping', (data: { conversationId: string; userId: string }) => {
      addTypingUser(data.conversationId, data.userId);
      
      // Auto-remove typing indicator after 3 seconds
      if (this.typingTimeout) clearTimeout(this.typingTimeout);
      this.typingTimeout = setTimeout(() => {
        removeTypingUser(data.conversationId, data.userId);
      }, 3000);
    });

    this.socket.on('messagesRead', (data: { conversationId: string; readBy: string }) => {
      markConversationAsReadLocally(data.conversationId);
    });

    // Online/Offline Status Events
    this.socket.on('userOnline', (data: { userId: string }) => {
      setUserOnline(data.userId);
    });

    this.socket.on('userOffline', (data: { userId: string }) => {
      setUserOffline(data.userId);
    });

    this.socket.on('onlineStatusResult', (statuses: { [userId: string]: boolean }) => {
      setBulkOnlineStatus(statuses);
    });
  }

  /**
   * Disconnect the Socket.IO client
   */
  public disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
    useChatStore.getState().setConnectionStatus(false, false);
  }

  /**
   * Send a message to a conversation
   */
  public sendMessage(conversationId: string, content: string) {
    if (!this.socket?.connected) {
      console.error('[ChatService] Cannot send message: socket not connected');
      return;
    }
    this.socket.emit('sendMessage', { conversationId, content });
  }

  /**
   * Send a typing indicator
   */
  public emitTyping(conversationId: string) {
    if (!this.socket?.connected) return;
    this.socket.emit('typing', { conversationId });
  }

  /**
   * Mark messages as read
   */
  public markAsRead(conversationId: string) {
    if (!this.socket?.connected) return;
    this.socket.emit('markAsRead', { conversationId });
    useChatStore.getState().decreaseUnreadCount(conversationId);
  }

  /**
   * Request online status for a list of user IDs
   */
  public requestOnlineStatus(userIds: string[]) {
    if (!this.socket?.connected) return;
    this.socket.emit('getOnlineStatus', { userIds });
  }

  /**
   * Check if the socket is currently connected
   */
  public get connected(): boolean {
    return this.socket?.connected || false;
  }
}

// Export a singleton instance
export const chatService = new ChatService();
