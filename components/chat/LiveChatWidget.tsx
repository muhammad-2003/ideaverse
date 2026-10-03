'use client';

import React, { useState, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import {
  MessageSquare,
  X,
  Send,
  User,
  Mail,
  Phone,
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
  const [userPhone, setUserPhone] = useState('');
  const [thread, setThread] = useState<ChatThread | null>(null);

  // Form inputs
  const [inputName, setInputName] = useState('');
  const [inputEmail, setInputEmail] = useState('');
  const [inputPhone, setInputPhone] = useState('');
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
          if (parsed.userPhone) {
            setUserPhone(parsed.userPhone);
            setInputPhone(parsed.userPhone);
          }
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
    if (!inputPhone.trim()) {
      setStartError('Please enter your phone / WhatsApp number.');
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
          userPhone: inputPhone.trim(),
          initialMessage: initialQuestion.trim() || undefined,
        }),
      });

      const data = await res.json();
      if (data.success && data.thread) {
        const newThread: ChatThread = data.thread;
        setThreadId(newThread.id);
        setUserName(newThread.userName);
        setUserEmail(newThread.userEmail);
        setUserPhone(newThread.userPhone || inputPhone.trim());
        setThread(newThread);
        prevMessagesCountRef.current = newThread.messages.length;

        localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify({
            threadId: newThread.id,
            userName: newThread.userName,
            userEmail: newThread.userEmail,
            userPhone: newThread.userPhone || inputPhone.trim(),
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
      setInputPhone(userPhone || '');
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
    <>
      {/* Floating Toggle Button (Hidden when mobile chat is open) */}
      <div className={`fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 ${isOpen ? 'hidden sm:flex' : 'flex'}`}>
        <button
          onClick={() => {
            if (isOpen) {
              setIsOpen(false);
            } else {
              handleOpenWidget();
            }
          }}
          className="group relative flex items-center gap-2.5 px-4 py-3 sm:px-5 sm:py-3.5 rounded-full bg-gradient-to-r from-brand-navy via-brand-navyDark to-brand-orange text-white shadow-2xl hover:shadow-brand-orange/40 hover:scale-105 active:scale-95 transition-all duration-200 border border-white/20"
          aria-label="Toggle Live Chat"
        >
          <div className="relative w-5 h-5 flex items-center justify-center shrink-0">
            <img src="/images/ideaverse_20_logo.png" alt="IdeaVerse" className="w-full h-full object-contain" />
            {unreadBadge > 0 && (
              <span className="absolute -top-2 -right-2 w-5 h-5 bg-rose-500 text-white text-[10px] font-black rounded-full flex items-center justify-center border-2 border-white animate-pulse">
                {unreadBadge}
              </span>
            )}
          </div>
          <span className="text-xs sm:text-sm font-extrabold tracking-wide font-display">
            {isOpen ? 'Close Live Desk' : 'Live Query Desk'}
          </span>
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 group-hover:scale-125 transition shadow-xs" />
        </button>
      </div>

      {/* Responsive Chat Window (Full Screen on Mobile, Floating Drawer on Tablet/Desktop) */}
      {isOpen && (
        <div className="fixed inset-0 sm:inset-auto sm:bottom-6 sm:right-6 sm:w-[410px] sm:h-[600px] z-50 flex flex-col bg-white sm:rounded-3xl sm:border sm:border-slate-200 sm:shadow-2xl overflow-hidden animate-in fade-in sm:zoom-in-95 duration-200">
          {/* Header Bar */}
          <div className="bg-gradient-to-r from-brand-navy via-brand-navyDark to-[#0F3657] text-white px-4 py-3.5 sm:px-5 sm:py-4 flex items-center justify-between shadow-md relative shrink-0">
            <div className="flex items-center gap-3 min-w-0">
              {/* Back / Close button for mobile */}
              <button
                onClick={() => setIsOpen(false)}
                className="sm:hidden p-2 -ml-1 text-slate-200 hover:text-white hover:bg-white/10 rounded-xl transition"
                aria-label="Back to page"
              >
                <ChevronDown className="w-5 h-5" />
              </button>

              <div className="relative shrink-0">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center p-1.5 overflow-hidden">
                  <img src="/images/ideaverse_20_logo.png" alt="IdeaVerse 2.0" className="w-full h-full object-contain" />
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-brand-navy rounded-full" />
              </div>

              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <h3 className="font-bold text-sm sm:text-base tracking-tight text-white font-display truncate">
                    IdeaVerse 2.0 Live Desk
                  </h3>
                  <span className="text-[9px] uppercase tracking-wider font-extrabold bg-brand-orange/30 text-brand-orangeLight px-1.5 py-0.5 rounded-full border border-brand-orange/40 shrink-0">
                    Live
                  </span>
                </div>
                <p className="text-[11px] text-slate-300 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block animate-ping" />
                  Organizing Team Online • Fast Response
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1 shrink-0">
              {threadId && (
                <button
                  onClick={handleResetChat}
                  title="Start New Chat"
                  className="p-2 text-slate-300 hover:text-white hover:bg-white/10 rounded-xl transition"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              )}
              <button
                onClick={() => setIsOpen(false)}
                className="hidden sm:flex p-2 text-slate-300 hover:text-white hover:bg-white/10 rounded-xl transition"
                aria-label="Close live chat"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Content Area */}
          {!threadId ? (
            /* STEP 1: Name & Email Onboarding Form */
            <div className="flex-1 p-5 sm:p-6 overflow-y-auto bg-slate-50/50 flex flex-col justify-between">
              <div>
                <div className="text-center py-2 sm:py-3">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-brand-navy/10 text-brand-navy flex items-center justify-center mx-auto mb-2.5 border border-brand-navy/15 shadow-sm">
                    <Sparkles className="w-6 h-6 sm:w-7 sm:h-7 text-brand-orange" />
                  </div>
                  <h4 className="font-bold text-brand-navy text-base sm:text-lg font-display">
                    Welcome to IdeaVerse 2.0
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-[300px] mx-auto leading-relaxed">
                    Have questions about pitching formats, university eligibility, registration, or prizes? Ask us directly!
                  </p>
                </div>

                <form onSubmit={handleStartChat} className="space-y-3.5 mt-3 sm:mt-4 max-w-sm mx-auto">
                  {startError && (
                    <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
                      {startError}
                    </div>
                  )}

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                      Your Full Name <span className="text-brand-orange">*</span>
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                      <input
                        type="text"
                        required
                        value={inputName}
                        onChange={(e) => setInputName(e.target.value)}
                        placeholder="e.g. Sarah Khan"
                        className="w-full pl-10 pr-3 py-2.5 text-base sm:text-sm rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-brand-orange/40 focus:border-brand-orange text-slate-800"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                      Email Address <span className="text-brand-orange">*</span>
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                      <input
                        type="email"
                        required
                        value={inputEmail}
                        onChange={(e) => setInputEmail(e.target.value)}
                        placeholder="e.g. sarah@university.edu.pk"
                        className="w-full pl-10 pr-3 py-2.5 text-base sm:text-sm rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-brand-orange/40 focus:border-brand-orange text-slate-800"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                      Phone / WhatsApp Number <span className="text-brand-orange">*</span>
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                      <input
                        type="tel"
                        required
                        value={inputPhone}
                        onChange={(e) => setInputPhone(e.target.value)}
                        placeholder="e.g. 0300 1234567"
                        className="w-full pl-10 pr-3 py-2.5 text-base sm:text-sm rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-brand-orange/40 focus:border-brand-orange text-slate-800"
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
                      placeholder="e.g. How does virtual pitching work for outstation teams?"
                      className="w-full p-3 text-base sm:text-sm rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-brand-orange/40 focus:border-brand-orange text-slate-800 resize-none"
                    />
                  </div>

                  {/* Quick Starter Suggestions */}
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                      Frequently Asked:
                    </span>
                    <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
                      {QUICK_QUESTIONS.map((q) => (
                        <button
                          key={q}
                          type="button"
                          onClick={() => handleQuickQuestionClick(q)}
                          className="whitespace-nowrap text-xs bg-white hover:bg-brand-orange/10 hover:border-brand-orange/40 text-slate-700 px-3 py-1.5 rounded-xl border border-slate-200 transition text-left font-medium active:scale-95 shrink-0"
                        >
                          {q}
                        </button>
                      ))}
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isStarting}
                    className="w-full mt-3 py-3 sm:py-3.5 px-5 rounded-2xl bg-gradient-to-r from-brand-orange to-brand-orangeLight text-white font-bold text-xs sm:text-sm shadow-lg shadow-brand-orange/25 hover:shadow-brand-orange/40 transition active:scale-[0.99] disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {isStarting ? (
                      <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <span>Start Live Conversation</span>
                        <Send className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>
              </div>

              <div className="text-center pt-3 text-[11px] text-slate-400">
                Responses are handled live by the Spectrum 2.0 / IdeaVerse admin desk.
              </div>
            </div>
          ) : (
            /* STEP 2: Live Chat Messaging Stream */
            <div className="flex-1 flex flex-col justify-between bg-slate-50/80 overflow-hidden">
              {/* Thread Status Bar */}
              {thread?.status === 'resolved' && (
                <div className="bg-emerald-50 border-b border-emerald-200 px-4 py-2 text-center text-xs text-emerald-800 font-semibold flex items-center justify-center gap-1.5 shrink-0">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                  <span>Query marked resolved by organizing team. Type anytime to reopen!</span>
                </div>
              )}

              {/* Messages Area */}
              <div className="flex-1 p-4 sm:p-5 overflow-y-auto space-y-3.5 sm:space-y-4">
                {thread?.messages.map((msg) => {
                  const isAdmin = msg.sender === 'admin';
                  return (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${isAdmin ? 'items-start' : 'items-end'}`}
                    >
                      <div className="flex items-center gap-1.5 mb-1 text-[10px] text-slate-400 font-medium px-1">
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
                        className={`max-w-[85%] sm:max-w-[80%] rounded-2xl px-4 py-2.5 sm:py-3 text-xs sm:text-sm leading-relaxed shadow-sm break-words ${
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

              {/* Quick suggestion pills if conversation is fresh */}
              {thread && thread.messages.length <= 3 && (
                <div className="px-3 py-2 bg-white/90 border-t border-slate-200 overflow-x-auto flex gap-1.5 no-scrollbar shrink-0">
                  {QUICK_QUESTIONS.slice(0, 3).map((q) => (
                    <button
                      key={q}
                      type="button"
                      onClick={() => handleQuickQuestionClick(q)}
                      className="whitespace-nowrap text-[11px] bg-slate-100 hover:bg-brand-orange/10 hover:text-brand-orange px-3 py-1.5 rounded-lg text-slate-700 font-medium transition active:scale-95"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              )}

              {/* Input Bar with Comfortable Mobile Spacing */}
              <form
                onSubmit={handleSendMessage}
                className="p-3 sm:p-4 bg-white border-t border-slate-200 flex items-center gap-2.5 shrink-0 safe-bottom"
              >
                <input
                  type="text"
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  placeholder="Type your question..."
                  className="flex-1 px-4 py-2.5 sm:py-3 text-base sm:text-sm rounded-full border border-slate-300 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-orange/40 focus:border-brand-orange text-slate-800"
                />
                <button
                  type="submit"
                  disabled={!messageText.trim() || isSending}
                  className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-brand-orange hover:bg-brand-orangeLight text-white disabled:opacity-40 transition shadow-md active:scale-95 flex items-center justify-center shrink-0"
                  aria-label="Send message"
                >
                  <Send className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              </form>
            </div>
          )}
        </div>
      )}
    </>
  );
}
