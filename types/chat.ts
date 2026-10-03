export type ChatStatus = 'open' | 'resolved';

export interface ChatMessage {
  id: string;
  threadId: string;
  sender: 'user' | 'admin';
  senderName: string;
  message: string;
  timestamp: string;
}

export interface ChatThread {
  id: string;
  userName: string;
  userEmail: string;
  userPhone?: string;
  status: ChatStatus;
  unreadAdminCount: number;
  unreadUserCount: number;
  createdAt: string;
  updatedAt: string;
  messages: ChatMessage[];
  lastMessage?: string;
}

export interface StartChatInput {
  userName: string;
  userEmail: string;
  userPhone?: string;
  initialMessage?: string;
}

export interface SendMessageInput {
  threadId: string;
  sender: 'user' | 'admin';
  senderName: string;
  message: string;
}
