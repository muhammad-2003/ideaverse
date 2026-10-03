import fs from 'fs';
import path from 'path';
import { ChatThread, ChatMessage, StartChatInput, SendMessageInput, ChatStatus } from '@/types/chat';

const DATA_FILE_PATH = path.join(process.cwd(), '.chat_threads.json');

const INITIAL_SEEDED_THREADS: ChatThread[] = [
  {
    id: 'chat_seed_1',
    userName: 'Hamza Farooq',
    userEmail: 'hamza.f@iba.edu.pk',
    status: 'open',
    unreadAdminCount: 1,
    unreadUserCount: 0,
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    lastMessage: 'Can team members be from two different universities, or must everyone be from the same institution?',
    messages: [
      {
        id: 'msg_seed_1_1',
        threadId: 'chat_seed_1',
        sender: 'user',
        senderName: 'Hamza Farooq',
        message: 'Hi! We are forming a team for IdeaVerse 2.0. Can team members be from two different universities, or must everyone be from the same institution?',
        timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
      },
      {
        id: 'msg_seed_1_2',
        threadId: 'chat_seed_1',
        sender: 'admin',
        senderName: 'IdeaVerse Organizing Team',
        message: 'Hello Hamza! Yes, cross-university collaborations are allowed and encouraged. As long as your team lead is an enrolled student or recent graduate within 1 year, you are eligible to pitch.',
        timestamp: new Date(Date.now() - 3600000 * 1.5).toISOString(),
      },
      {
        id: 'msg_seed_1_3',
        threadId: 'chat_seed_1',
        sender: 'user',
        senderName: 'Hamza Farooq',
        message: 'Awesome, thanks! And what is the maximum number of members allowed in a pitch team?',
        timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
      },
    ],
  },
  {
    id: 'chat_seed_2',
    userName: 'Ayesha Siddiqui',
    userEmail: 'ayesha.s@fast.nu.edu.pk',
    status: 'resolved',
    unreadAdminCount: 0,
    unreadUserCount: 0,
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 18).toISOString(),
    lastMessage: 'Got it, thank you so much for the clarification!',
    messages: [
      {
        id: 'msg_seed_2_1',
        threadId: 'chat_seed_2',
        sender: 'user',
        senderName: 'Ayesha Siddiqui',
        message: 'Hello! Is the physical pitch round mandatory, or can outstation teams pitch virtually via Zoom/Meet?',
        timestamp: new Date(Date.now() - 3600000 * 24).toISOString(),
      },
      {
        id: 'msg_seed_2_2',
        threadId: 'chat_seed_2',
        sender: 'admin',
        senderName: 'IdeaVerse Organizing Team',
        message: 'Hi Ayesha! We offer hybrid pitching. Outstation startups outside Karachi can participate in virtual screening and virtual pitch slots.',
        timestamp: new Date(Date.now() - 3600000 * 20).toISOString(),
      },
      {
        id: 'msg_seed_2_3',
        threadId: 'chat_seed_2',
        sender: 'user',
        senderName: 'Ayesha Siddiqui',
        message: 'Got it, thank you so much for the clarification!',
        timestamp: new Date(Date.now() - 3600000 * 18).toISOString(),
      },
    ],
  },
];

// In-memory cache fallback to ensure reliability in serverless / read-only filesystem environments
let memoryThreads: ChatThread[] = JSON.parse(JSON.stringify(INITIAL_SEEDED_THREADS));

export function readChatThreads(): ChatThread[] {
  try {
    if (fs.existsSync(DATA_FILE_PATH)) {
      const content = fs.readFileSync(DATA_FILE_PATH, 'utf-8');
      const parsed = JSON.parse(content);
      if (Array.isArray(parsed)) {
        memoryThreads = parsed;
        return parsed;
      }
    } else {
      // Initialize with seed data on first run
      writeChatThreads(INITIAL_SEEDED_THREADS);
      return INITIAL_SEEDED_THREADS;
    }
  } catch (err) {
    console.warn('Filesystem read failed, using memory threads cache:', err);
  }
  return memoryThreads;
}

export function writeChatThreads(threads: ChatThread[]): void {
  memoryThreads = threads;
  try {
    fs.writeFileSync(DATA_FILE_PATH, JSON.stringify(threads, null, 2), 'utf-8');
  } catch (err) {
    console.warn('Filesystem write failed, retained in memory cache:', err);
  }
}

export function getAllThreads(): ChatThread[] {
  const threads = readChatThreads();
  return threads.sort(
    (a, b) => new Date(b.updatedAt || 0).getTime() - new Date(a.updatedAt || 0).getTime()
  );
}

export function getThreadById(threadId: string): ChatThread | null {
  const threads = readChatThreads();
  return threads.find((t) => t.id === threadId) || null;
}

export function createOrGetThread(input: StartChatInput): ChatThread {
  const threads = readChatThreads();
  const normalizedEmail = input.userEmail.trim().toLowerCase();
  const normalizedName = input.userName.trim();
  const normalizedPhone = input.userPhone?.trim() || undefined;

  // Check if an existing open thread exists for this email
  let existing = threads.find(
    (t) => t.userEmail.toLowerCase() === normalizedEmail && t.status === 'open'
  );

  const now = new Date().toISOString();

  if (existing) {
    if (normalizedPhone && !existing.userPhone) {
      existing.userPhone = normalizedPhone;
      writeChatThreads(threads);
    }
    // If an initial message was supplied and not already duplicate
    if (input.initialMessage && input.initialMessage.trim()) {
      const newMsg: ChatMessage = {
        id: `msg_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        threadId: existing.id,
        sender: 'user',
        senderName: normalizedName,
        message: input.initialMessage.trim(),
        timestamp: now,
      };
      existing.messages.push(newMsg);
      existing.lastMessage = newMsg.message;
      existing.updatedAt = now;
      existing.unreadAdminCount += 1;
      writeChatThreads(threads);
    }
    return existing;
  }

  // Create new thread
  const newThreadId = `chat_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const initialMessages: ChatMessage[] = [];

  // System greeting message
  initialMessages.push({
    id: `msg_welcome_${Date.now()}`,
    threadId: newThreadId,
    sender: 'admin',
    senderName: 'IdeaVerse Desk',
    message: `Hello ${normalizedName}! 👋 Welcome to IdeaVerse 2.0 query desk. An organizer has been notified and will reply shortly. Please type your query below!`,
    timestamp: now,
  });

  if (input.initialMessage && input.initialMessage.trim()) {
    initialMessages.push({
      id: `msg_usr_${Date.now()}`,
      threadId: newThreadId,
      sender: 'user',
      senderName: normalizedName,
      message: input.initialMessage.trim(),
      timestamp: now,
    });
  }

  const newThread: ChatThread = {
    id: newThreadId,
    userName: normalizedName,
    userEmail: normalizedEmail,
    userPhone: normalizedPhone,
    status: 'open',
    unreadAdminCount: input.initialMessage ? 1 : 0,
    unreadUserCount: 1, // Welcome message
    createdAt: now,
    updatedAt: now,
    messages: initialMessages,
    lastMessage: input.initialMessage?.trim() || 'Chat started',
  };

  threads.unshift(newThread);
  writeChatThreads(threads);
  return newThread;
}

export function sendMessage(input: SendMessageInput): { thread: ChatThread; message: ChatMessage } {
  const threads = readChatThreads();
  const threadIndex = threads.findIndex((t) => t.id === input.threadId);

  if (threadIndex === -1) {
    throw new Error('Chat thread not found');
  }

  const thread = threads[threadIndex];
  const now = new Date().toISOString();

  const newMsg: ChatMessage = {
    id: `msg_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    threadId: thread.id,
    sender: input.sender,
    senderName: input.senderName,
    message: input.message.trim(),
    timestamp: now,
  };

  thread.messages.push(newMsg);
  thread.lastMessage = newMsg.message;
  thread.updatedAt = now;

  if (input.sender === 'user') {
    thread.unreadAdminCount = (thread.unreadAdminCount || 0) + 1;
    // Reopen thread if user replies
    if (thread.status === 'resolved') {
      thread.status = 'open';
    }
  } else {
    thread.unreadUserCount = (thread.unreadUserCount || 0) + 1;
  }

  // Move thread to top
  threads.splice(threadIndex, 1);
  threads.unshift(thread);

  writeChatThreads(threads);
  return { thread, message: newMsg };
}

export function markThreadRead(threadId: string, reader: 'user' | 'admin'): ChatThread | null {
  const threads = readChatThreads();
  const thread = threads.find((t) => t.id === threadId);
  if (!thread) return null;

  if (reader === 'user') {
    thread.unreadUserCount = 0;
  } else {
    thread.unreadAdminCount = 0;
  }

  writeChatThreads(threads);
  return thread;
}

export function updateThreadStatus(threadId: string, status: ChatStatus): ChatThread | null {
  const threads = readChatThreads();
  const thread = threads.find((t) => t.id === threadId);
  if (!thread) return null;

  thread.status = status;
  thread.updatedAt = new Date().toISOString();
  writeChatThreads(threads);
  return thread;
}

export function deleteThread(threadId: string): boolean {
  const threads = readChatThreads();
  const filtered = threads.filter((t) => t.id !== threadId);
  if (filtered.length === threads.length) return false;

  writeChatThreads(filtered);
  return true;
}
