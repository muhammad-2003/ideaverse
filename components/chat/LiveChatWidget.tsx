'use client';

import React, { useState, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import {
  MessageSquare,
  X,
  Send,
  User,
  Mail,
  Sparkles,
  HelpCircle,
  RotateCcw,
  Bot,
  ExternalLink,
  ChevronDown,
} from 'lucide-react';
import { ChatThread, ChatMessage } from '@/types/chat';

const STORAGE_KEY = 'ideaverse_live_chat_session';

const QUICK_QUESTIONS = [
  'Who is eligible to participate?',
  'Can outstation startups pitch virtually?',
  'Is there any registration fee?',
  'What is the maximum team size?',
];

function playNotificationSound() {
  try {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
    osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.15); // A5

    gain.gain.setValueAtTime(0.08, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.25);
  } catch (e) {
    // Audio autoplay might be restricted before user interaction
  }
}

export function LiveChatWidget() {
  const pathname = usePathname();

  // Hide chat widget completely inside admin portal
  if (pathname?.startsWith('/admin')) {
    return null;
  }

  const [isOpen, setIsOpen] = useState(false);

  // Session state
  const [threadId, setThreadId] = useState<string | null>(null);
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [thread, setThread] = useState<ChatThread | null>(null);

  // Form inputs
  const [inputName, setInputName] = useState('');
  const [inputEmail, setInputEmail] = useState('');
  const [initialQuestion, setInitialQuestion] = useState('');
  const [isStarting, setIsStarting] = useState(false);
  const [startError, setStartError] = useState('');

  // Conversation input
  const [messageText, setMessageText] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [unreadBadge, setUnreadBadge] = useState(0);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const prevMessagesCountRef = useRef<number>(0);

  // Restore stored session on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.threadId && parsed.userName && parsed.userEmail) {
          setThreadId(parsed.threadId);
          setUserName(parsed.userName);
          setUserEmail(parsed.userEmail);
          fetchThread(parsed.threadId, true);
        }
      }
    } catch (e) {
      console.warn('Failed to load stored chat session:', e);
    }
  }, []);

  // Poll for thread updates every 3.5 seconds when active
  useEffect(() => {
    if (!threadId) return;

    const interval = setInterval(() => {
      fetchThread(threadId, isOpen);
    }, 3500);

    return () => clearInterval(interval);
  }, [threadId, isOpen]);

  // Scroll to bottom on new messages
  useEffect(() => {
    if (isOpen && thread?.messages) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [thread?.messages, isOpen]);

  const fetchThread = async (id: string, isViewing: boolean) => {
    try {
      const url = `/api/chat?threadId=${encodeURIComponent(id)}${isViewing ? '&reader=user' : ''}`;
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        if (data.thread) {
          const currentThread: ChatThread = data.thread;

          // Check if new admin message arrived
          const prevCount = prevMessagesCountRef.current;
          const newCount = currentThread.messages.length;

          if (prevCount > 0 && newCount > prevCount) {
            const lastMsg = currentThread.messages[currentThread.messages.length - 1];
            if (lastMsg && lastMsg.sender === 'admin') {
              playNotificationSound();
              if (!isOpen) {
                setUnreadBadge((prev) => prev + 1);
              }
            }
          }

          prevMessagesCountRef.current = newCount;
          setThread(currentThread);

          if (isViewing) {
            setUnreadBadge(0);
          }
        }
      }
    } catch (e) {
      console.error('Chat poll error:', e);
    }
  };

  const handleOpenWidget = () => {
    setIsOpen(true);
    setUnreadBadge(0);
    if (threadId) {
      fetchThread(threadId, true);
    }
  };

  const handleStartChat = async (e: React.FormEvent) => {
    e.preventDefault();
    setStartError('');

    if (!inputName.trim()) {
      setStartError('Please enter your full name.');
      return;
    }
    if (!inputEmail.trim() || !inputEmail.includes('@') || !inputEmail.includes('.')) {
      setStartError('Please enter a valid email address.');
      return;
    }

    setIsStarting(true);
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'start',
          userName: inputName.trim(),
          userEmail: inputEmail.trim(),
          initialMessage: initialQuestion.trim() || undefined,
        }),
      });

      const data = await res.json();
      if (data.success && data.thread) {
        const newThread: ChatThread = data.thread;
        setThreadId(newThread.id);
        setUserName(newThread.userName);
        setUserEmail(newThread.userEmail);
        setThread(newThread);
        prevMessagesCountRef.current = newThread.messages.length;

        localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify({
            threadId: newThread.id,
            userName: newThread.userName,
            userEmail: newThread.userEmail,
          })
        );
      } else {
        setStartError(data.error || 'Could not start chat. Please try again.');
      }
    } catch (err: any) {
      setStartError(err.message || 'Network error. Please try again.');
    } finally {
      setIsStarting(false);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim() || !threadId || isSending) return;

    const text = messageText.trim();
    setMessageText('');
    setIsSending(true);

    // Optimistic UI update
    const optimisticMsg: ChatMessage = {
      id: `opt_${Date.now()}`,
      threadId,
      sender: 'user',
      senderName: userName || 'You',
      message: text,
      timestamp: new Date().toISOString(),
    };

    if (thread) {
      setThread({
        ...thread,
        messages: [...thread.messages, optimisticMsg],
        lastMessage: text,
      });
    }

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'send',
          threadId,
          sender: 'user',
          senderName: userName,
          message: text,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.thread) {
          setThread(data.thread);
          prevMessagesCountRef.current = data.thread.messages.length;
        }
      }
    } catch (e) {
      console.error('Send message error:', e);
    } finally {
      setIsSending(false);
    }
  };

  const handleResetChat = () => {
    if (confirm('Start a brand new conversation? Your previous inquiry history will be cleared on this browser.')) {
      localStorage.removeItem(STORAGE_KEY);
      setThreadId(null);
      setThread(null);
      setInputName(userName || '');
      setInputEmail(userEmail || '');
      setInitialQuestion('');
    }
  };

  const handleQuickQuestionClick = (q: string) => {
    if (!threadId) {
      setInitialQuestion(q);
    } else {
      setMessageText(q);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* Chat Window */}
      {isOpen && (
        <div className="w-[360px] sm:w-[400px] h-[550px] max-h-[85vh] bg-white rounded-3xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden mb-3 animate-in fade-in zoom-in-95 duration-200">
          {/* Header */}
          <div className="bg-gradient-to-r from-brand-navy via-brand-navyDark to-[#0F3657] text-white p-4 flex items-center justify-between shadow-md relative shrink-0">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-brand-orange font-black">
                  <Bot className="w-5 h-5 text-brand-orange" />
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-brand-navy rounded-full" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-bold text-sm tracking-tight text-white font-display">
                    IdeaVerse 2.0 Live Desk
                  </h3>
                  <span className="text-[9px] uppercase tracking-wider font-extrabold bg-brand-orange/30 text-brand-orangeLight px-1.5 py-0.5 rounded-full border border-brand-orange/40">
                    Live
                  </span>
                </div>
                <p className="text-[11px] text-slate-300 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block animate-ping" />
                  Organizing Team Online
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              {threadId && (
                <button
                  onClick={handleResetChat}
                  title="Start New Chat"
                  className="p-1.5 text-slate-300 hover:text-white hover:bg-white/10 rounded-xl transition"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              )}
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 text-slate-300 hover:text-white hover:bg-white/10 rounded-xl transition"
                aria-label="Close live chat"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Content Area */}
          {!threadId ? (
            /* STEP 1: Name & Email Onboarding Form */
            <div className="flex-1 p-5 overflow-y-auto bg-slate-50/50 flex flex-col justify-between">
              <div>
                <div className="text-center py-2">
                  <div className="w-12 h-12 rounded-2xl bg-brand-navy/10 text-brand-navy flex items-center justify-center mx-auto mb-2 border border-brand-navy/15 shadow-sm">
                    <Sparkles className="w-6 h-6 text-brand-orange" />
                  </div>
                  <h4 className="font-bold text-brand-navy text-base font-display">
                    Welcome to IdeaVerse 2.0
                  </h4>
                  <p className="text-xs text-slate-500 mt-1 max-w-[280px] mx-auto">
                    Ask any queries regarding applications, pitching formats, criteria, or prizes.
                  </p>
                </div>

                <form onSubmit={handleStartChat} className="space-y-3 mt-4">
                  {startError && (
                    <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
                      {startError}
                    </div>
                  )}

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                      Your Full Name <span className="text-brand-orange">*</span>
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <input
                        type="text"
                        required
                        value={inputName}
                        onChange={(e) => setInputName(e.target.value)}
                        placeholder="e.g. Sarah Khan"
                        className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-brand-orange/40 focus:border-brand-orange text-slate-800"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                      Email Address <span className="text-brand-orange">*</span>
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <input
                        type="email"
                        required
                        value={inputEmail}
                        onChange={(e) => setInputEmail(e.target.value)}
                        placeholder="e.g. sarah@university.edu.pk"
                        className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-brand-orange/40 focus:border-brand-orange text-slate-800"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                      Your Question (Optional)
                    </label>
                    <textarea
                      rows={2}
                      value={initialQuestion}
                      onChange={(e) => setInitialQuestion(e.target.value)}
                      placeholder="e.g. What is the deadline to register?"
                      className="w-full p-2.5 text-xs rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-brand-orange/40 focus:border-brand-orange text-slate-800 resize-none"
                    />
                  </div>

                  {/* Quick Starter Suggestions */}
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                      Popular Questions:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {QUICK_QUESTIONS.map((q) => (
                        <button
                          key={q}
                          type="button"
                          onClick={() => handleQuickQuestionClick(q)}
                          className="text-[10px] bg-white hover:bg-brand-orange/10 hover:border-brand-orange/40 text-slate-700 px-2.5 py-1 rounded-lg border border-slate-200 transition text-left font-medium"
                        >
                          {q}
                        </button>
                      ))}
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isStarting}
                    className="w-full mt-2 py-2.5 px-4 rounded-xl bg-gradient-to-r from-brand-orange to-brand-orangeLight text-white font-bold text-xs shadow-lg shadow-brand-orange/20 hover:shadow-brand-orange/40 transition active:scale-[0.99] disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {isStarting ? (
                      <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <span>Start Live Conversation</span>
                        <Send className="w-3.5 h-3.5" />
                      </>
                    )}
                  </button>
                </form>
              </div>

              <div className="text-center pt-2 text-[10px] text-slate-400">
                Responses are handled live by the Spectrum 2.0 / IdeaVerse admin desk.
              </div>
            </div>
          ) : (
            /* STEP 2: Live Chat Messaging Stream */
            <div className="flex-1 flex flex-col justify-between bg-slate-50/70 overflow-hidden">
              {/* Thread Status Bar */}
              {thread?.status === 'resolved' && (
                <div className="bg-emerald-50 border-b border-emerald-200 px-3 py-1.5 text-center text-[11px] text-emerald-800 font-semibold flex items-center justify-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  Query marked resolved by support. Type anytime to reopen!
                </div>
              )}

              {/* Messages Area */}
              <div className="flex-1 p-4 overflow-y-auto space-y-3">
                {thread?.messages.map((msg) => {
                  const isAdmin = msg.sender === 'admin';
                  return (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${isAdmin ? 'items-start' : 'items-end'}`}
                    >
                      <div className="flex items-center gap-1 mb-1 text-[10px] text-slate-400 font-medium">
                        <span>{isAdmin ? 'IdeaVerse Desk' : 'You'}</span>
                        <span>•</span>
                        <span>
                          {new Date(msg.timestamp).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>
                      <div
                        className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed shadow-sm break-words ${
                          isAdmin
                            ? 'bg-brand-navy text-white rounded-tl-sm border border-brand-navyDark'
                            : 'bg-gradient-to-r from-brand-orange to-brand-orangeLight text-white rounded-tr-sm font-medium shadow-brand-orange/20'
                        }`}
                      >
                        {msg.message}
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              {/* Quick suggestion pills if conversation is short */}
              {thread && thread.messages.length <= 3 && (
                <div className="px-3 py-1.5 bg-white/80 border-t border-slate-200 overflow-x-auto flex gap-1.5 no-scrollbar">
                  {QUICK_QUESTIONS.slice(0, 3).map((q) => (
                    <button
                      key={q}
                      type="button"
                      onClick={() => handleQuickQuestionClick(q)}
                      className="whitespace-nowrap text-[10px] bg-slate-100 hover:bg-brand-orange/10 hover:text-brand-orange px-2 py-1 rounded-md text-slate-600 transition"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              )}

              {/* Input Bar */}
              <form
                onSubmit={handleSendMessage}
                className="p-3 bg-white border-t border-slate-200 flex items-center gap-2"
              >
                <input
                  type="text"
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  placeholder="Ask a question..."
                  className="flex-1 px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-orange/40 focus:border-brand-orange text-slate-800"
                />
                <button
                  type="submit"
                  disabled={!messageText.trim() || isSending}
                  className="p-2 rounded-xl bg-brand-orange hover:bg-brand-orangeLight text-white disabled:opacity-40 transition shadow-sm active:scale-95 shrink-0"
                  aria-label="Send message"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          )}
        </div>
      )}

      {/* Floating Toggle Button */}
      <button
        onClick={() => {
          if (isOpen) {
            setIsOpen(false);
          } else {
            handleOpenWidget();
          }
        }}
        className="group relative flex items-center gap-2 px-4 py-3 rounded-full bg-gradient-to-r from-brand-navy via-brand-navyDark to-brand-orange text-white shadow-2xl hover:shadow-brand-orange/40 hover:scale-105 active:scale-95 transition-all duration-200 border border-white/20"
        aria-label="Toggle Live Chat"
      >
        <div className="relative">
          <MessageSquare className="w-5 h-5 text-white" />
          {unreadBadge > 0 && (
            <span className="absolute -top-2 -right-2 w-5 h-5 bg-rose-500 text-white text-[10px] font-black rounded-full flex items-center justify-center border-2 border-white animate-pulse">
              {unreadBadge}
            </span>
          )}
        </div>
        <span className="text-xs font-extrabold tracking-wide font-display hidden sm:inline-block">
          {isOpen ? 'Close Chat' : 'Query Desk'}
        </span>
        <span className="w-2 h-2 rounded-full bg-emerald-400 group-hover:scale-125 transition" />
      </button>
    </div>
  );
}
