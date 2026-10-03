'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  MessageSquare,
  Search,
  RefreshCw,
  Trash2,
  CheckCircle2,
  Clock,
  Mail,
  Phone,
  User,
  Send,
  Sparkles,
  Bot,
  ExternalLink,
  RotateCcw,
  ArrowLeft,
  ChevronRight,
  Check,
  AlertCircle,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { ChatThread, ChatMessage, ChatStatus } from '@/types/chat';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

interface AdminLiveChatProps {
  onUnreadChange?: (unreadCount: number) => void;
}

const CANNED_RESPONSES = [
  {
    label: '🎓 Eligibility',
    text: 'IdeaVerse 2.0 is open to all university students (undergraduate & graduate) as well as recent graduates (within 1 year). Cross-university teams are fully allowed and encouraged!',
  },
  {
    label: '🌐 Virtual Pitching',
    text: 'Yes! Regional and outstation startups from outside Karachi can participate virtually via Zoom / Google Meet. Physical presence is not mandatory for outstation teams.',
  },
  {
    label: '👥 Team Size',
    text: 'Teams can have between 1 to 4 members. You must designate one Team Lead for all official communications and pitching slots.',
  },
  {
    label: '💰 Prizes & Incubation',
    text: 'IdeaVerse 2.0 features PKR 500,000+ in total prize pool, trophies across multiple categories, and direct incubation fast-track opportunities with top ecosystem partners.',
  },
  {
    label: '📋 Official Form',
    text: 'Please ensure your team lead has also filled out the official Spectrum 2.0 registration form to confirm your official entry pass and booth slot.',
  },
];

function playAdminNotificationSound() {
  try {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(440, ctx.currentTime); // A4
    osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.12); // A5

    gain.gain.setValueAtTime(0.12, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.3);
  } catch (e) {
    // Audio context restriction safe
  }
}

function formatRelativeTime(dateStr: string): string {
  try {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'Just now';
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days}d ago`;
    return new Date(dateStr).toLocaleDateString([], { month: 'short', day: 'numeric' });
  } catch (e) {
    return '';
  }
}

export function AdminLiveChat({ onUnreadChange }: AdminLiveChatProps) {
  const [threads, setThreads] = useState<ChatThread[]>([]);
  const [selectedThreadId, setSelectedThreadId] = useState<string | null>(null);
  const [mobileView, setMobileView] = useState<'list' | 'chat'>('list');
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'open' | 'resolved' | 'unread'>('all');
  const [replyText, setReplyText] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const prevTotalMessagesRef = useRef<number>(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Lock mobile body scroll when in full-screen chat mode
  useEffect(() => {
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
      if (mobileView === 'chat') {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = '';
      }
    }
    return () => {
      if (typeof window !== 'undefined') {
        document.body.style.overflow = '';
      }
    };
  }, [mobileView]);

  // Initial fetch and auto-polling every 4 seconds
  useEffect(() => {
    fetchThreads(true);

    const interval = setInterval(() => {
      fetchThreads(false);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const selectedThread = threads.find((t) => t.id === selectedThreadId) || null;

  // Auto-scroll messages to bottom when selected thread or messages change
  useEffect(() => {
    if (selectedThread?.messages) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [selectedThread?.messages?.length, selectedThreadId, mobileView]);

  // Mark thread as read when selected
  useEffect(() => {
    if (selectedThreadId && selectedThread && selectedThread.unreadAdminCount > 0) {
      markThreadAsRead(selectedThreadId);
    }
  }, [selectedThreadId, selectedThread?.unreadAdminCount]);

  const fetchThreads = async (isInitial = false) => {
    if (isInitial) setIsLoading(true);
    else setIsRefreshing(true);

    try {
      const res = await fetch('/api/chat');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.threads)) {
          const list: ChatThread[] = data.threads;
          setThreads(list);

          // Calculate total unread for admin
          const totalUnread = list.reduce((sum, t) => sum + (t.unreadAdminCount || 0), 0);
          if (onUnreadChange) {
            onUnreadChange(totalUnread);
          }

          // Check if new incoming user message arrived
          const totalMessages = list.reduce((sum, t) => sum + t.messages.length, 0);
          if (prevTotalMessagesRef.current > 0 && totalMessages > prevTotalMessagesRef.current) {
            if (soundEnabled) {
              playAdminNotificationSound();
            }
          }
          prevTotalMessagesRef.current = totalMessages;

          // Auto-select first thread on desktop if none selected
          if (!selectedThreadId && list.length > 0) {
            setSelectedThreadId(list[0].id);
          }
        }
      }
    } catch (err) {
      console.error('Failed to load chat threads:', err);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  const markThreadAsRead = async (threadId: string) => {
    try {
      await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'mark_read',
          threadId,
          reader: 'admin',
        }),
      });

      setThreads((prev) =>
        prev.map((t) => (t.id === threadId ? { ...t, unreadAdminCount: 0 } : t))
      );
    } catch (e) {
      console.error('Mark read error:', e);
    }
  };

  const handleSendReply = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!replyText.trim() || !selectedThreadId || isSending) return;

    const message = replyText.trim();
    setReplyText('');
    setIsSending(true);

    // Optimistic UI update
    const optimisticMsg: ChatMessage = {
      id: `opt_${Date.now()}`,
      threadId: selectedThreadId,
      sender: 'admin',
      senderName: 'IdeaVerse Organizing Team',
      message,
      timestamp: new Date().toISOString(),
    };

    setThreads((prev) =>
      prev.map((t) => {
        if (t.id === selectedThreadId) {
          return {
            ...t,
            messages: [...t.messages, optimisticMsg],
            lastMessage: message,
            updatedAt: new Date().toISOString(),
          };
        }
        return t;
      })
    );

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'send',
          threadId: selectedThreadId,
          sender: 'admin',
          senderName: 'IdeaVerse Organizing Team',
          message,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.thread) {
          setThreads((prev) =>
            prev.map((t) => (t.id === selectedThreadId ? data.thread : t))
          );
        }
      }
    } catch (err) {
      console.error('Send reply error:', err);
    } finally {
      setIsSending(false);
    }
  };

  const handleToggleStatus = async (threadId: string, currentStatus: ChatStatus) => {
    const newStatus: ChatStatus = currentStatus === 'open' ? 'resolved' : 'open';
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'status',
          threadId,
          status: newStatus,
        }),
      });

      if (res.ok) {
        setThreads((prev) =>
          prev.map((t) => (t.id === threadId ? { ...t, status: newStatus } : t))
        );
      }
    } catch (err) {
      console.error('Toggle status error:', err);
    }
  };

  const handleDeleteThread = async (threadId: string) => {
    // Optimistic state update
    const updated = threads.filter((t) => t.id !== threadId);
    setThreads(updated);
    setDeleteConfirmId(null);
    if (selectedThreadId === threadId) {
      setSelectedThreadId(updated[0]?.id || null);
      setMobileView('list');
    }

    try {
      await fetch(`/api/chat?threadId=${encodeURIComponent(threadId)}`, {
        method: 'DELETE',
      });
    } catch (err) {
      console.error('Delete thread error:', err);
    }
  };

  // Filter threads
  const filteredThreads = threads.filter((t) => {
    const matchesSearch =
      t.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.userEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (t.userPhone && t.userPhone.toLowerCase().includes(searchQuery.toLowerCase())) ||
      t.messages.some((m) => m.message.toLowerCase().includes(searchQuery.toLowerCase()));

    if (!matchesSearch) return false;

    if (statusFilter === 'open') return t.status === 'open';
    if (statusFilter === 'resolved') return t.status === 'resolved';
    if (statusFilter === 'unread') return t.unreadAdminCount > 0;
    return true;
  });

  // KPI Metrics
  const totalInquiries = threads.length;
  const openInquiries = threads.filter((t) => t.status === 'open').length;
  const unreadInquiries = threads.filter((t) => t.unreadAdminCount > 0).length;
  const resolvedInquiries = threads.filter((t) => t.status === 'resolved').length;

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Top KPI Cards - Desktop only */}
      <div className="hidden md:grid md:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
            Total Queries
          </div>
          <div className="text-2xl font-black text-brand-navy mt-1 font-display">
            {totalInquiries}
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5 truncate">All time visitor queries</div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs">
          <div className="text-[11px] font-bold uppercase tracking-wider text-amber-600">
            Active / Open
          </div>
          <div className="text-2xl font-black text-amber-600 mt-1 font-display">
            {openInquiries}
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5 truncate">Awaiting organizer review</div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs">
          <div className="text-[11px] font-bold uppercase tracking-wider text-rose-600 flex items-center justify-between">
            <span>Needs Reply</span>
            {unreadInquiries > 0 && (
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping ml-1" />
            )}
          </div>
          <div className="text-2xl font-black text-rose-600 mt-1 font-display">
            {unreadInquiries}
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5 truncate">Unread messages</div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs">
          <div className="text-[11px] font-bold uppercase tracking-wider text-emerald-600">
            Resolved
          </div>
          <div className="text-2xl font-black text-emerald-600 mt-1 font-display">
            {resolvedInquiries}
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5 truncate">Completed inquiries</div>
        </div>
      </div>

      {/* Main Console Box */}
      <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col min-h-[500px] h-[calc(100dvh-130px)] md:h-[720px] lg:h-[760px]">
        {/* Desk Toolbar */}
        <div className="p-3 sm:p-4 border-b border-slate-200 bg-slate-50/80 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-2.5 sm:gap-3 shrink-0">
          {/* Search bar + Action buttons in one compact row on mobile */}
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search name, email, query..."
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-brand-navy/20 focus:border-brand-navy text-slate-800"
              />
            </div>

            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              title={soundEnabled ? 'Mute sound alerts' : 'Unmute sound alerts'}
              className={`p-2 rounded-xl border text-xs font-bold transition flex items-center justify-center shrink-0 ${
                soundEnabled
                  ? 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                  : 'bg-slate-100 border-slate-300 text-slate-400'
              }`}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4 text-brand-navy" /> : <VolumeX className="w-4 h-4" />}
            </button>

            <button
              onClick={() => fetchThreads(false)}
              disabled={isRefreshing}
              title="Refresh inquiries"
              className="p-2 sm:px-3 sm:py-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 text-xs font-bold transition flex items-center gap-1.5 shrink-0"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-brand-orange' : ''}`} />
              <span className="hidden sm:inline">Refresh</span>
            </button>
          </div>

          {/* Filter pills */}
          <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-xl p-0.5 overflow-x-auto no-scrollbar shrink-0">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition whitespace-nowrap ${
                statusFilter === 'all'
                  ? 'bg-brand-navy text-white shadow-xs'
                  : 'text-slate-600 hover:text-brand-navy'
              }`}
            >
              All ({totalInquiries})
            </button>
            <button
              onClick={() => setStatusFilter('open')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition whitespace-nowrap ${
                statusFilter === 'open'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-amber-600'
              }`}
            >
              Open ({openInquiries})
            </button>
            <button
              onClick={() => setStatusFilter('unread')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition whitespace-nowrap ${
                statusFilter === 'unread'
                  ? 'bg-rose-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-rose-600'
              }`}
            >
              Needs Reply ({unreadInquiries})
            </button>
            <button
              onClick={() => setStatusFilter('resolved')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition whitespace-nowrap ${
                statusFilter === 'resolved'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-emerald-600'
              }`}
            >
              Resolved ({resolvedInquiries})
            </button>
          </div>
        </div>

        {/* 2-Column Responsive Layout */}
        <div className="flex-1 flex overflow-hidden relative">
          {/* LEFT COLUMN: Thread List */}
          <div className="w-full md:w-80 lg:w-96 md:border-r border-slate-200 flex flex-col bg-white shrink-0 overflow-hidden">
            <div className="p-3 border-b border-slate-100 bg-slate-50/70 flex items-center justify-between text-xs text-slate-500 font-semibold shrink-0">
              <span className="text-xs font-bold text-slate-700">{filteredThreads.length} Inquiries</span>
              <span className="text-[11px] text-emerald-600 flex items-center gap-1 font-medium">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Live Sync (4s)
              </span>
            </div>

            <div className="flex-1 overflow-y-auto divide-y divide-slate-100 overscroll-contain">
              {filteredThreads.length === 0 ? (
                <div className="p-8 text-center text-slate-400 space-y-2">
                  <MessageSquare className="w-8 h-8 mx-auto text-slate-300" />
                  <p className="text-xs font-medium">No inquiries found</p>
                </div>
              ) : (
                filteredThreads.map((thread) => {
                  const isSelected = thread.id === selectedThreadId;
                  const initials = thread.userName
                    .split(' ')
                    .map((n) => n[0])
                    .join('')
                    .toUpperCase()
                    .slice(0, 2);

                  return (
                    <div
                      key={thread.id}
                      onClick={() => {
                        setSelectedThreadId(thread.id);
                        setMobileView('chat');
                        if (thread.unreadAdminCount > 0) {
                          markThreadAsRead(thread.id);
                        }
                      }}
                      className={`p-3.5 sm:p-4 cursor-pointer transition-all relative flex items-center justify-between gap-3 border-b border-slate-100 ${
                        isSelected
                          ? 'bg-brand-navy/5 md:border-l-4 md:border-brand-orange'
                          : 'hover:bg-slate-50 bg-white active:bg-slate-100'
                      }`}
                    >
                      {/* Avatar */}
                      <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-brand-navy to-brand-navyDark text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-sm border border-brand-navy/10">
                        {initials || <User className="w-4 h-4" />}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1">
                          <h4 className="text-sm font-bold text-slate-900 truncate">
                            {thread.userName}
                          </h4>
                          <span className="text-[10px] text-slate-400 whitespace-nowrap font-medium">
                            {formatRelativeTime(thread.updatedAt)}
                          </span>
                        </div>

                        <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 mt-0.5">
                          <span className="text-[11px] text-slate-500 truncate">
                            {thread.userEmail}
                          </span>
                          {thread.userPhone && (
                            <a
                              href={`tel:${thread.userPhone}`}
                              onClick={(e) => e.stopPropagation()}
                              className="text-[11px] text-brand-navy font-bold hover:underline inline-flex items-center gap-1"
                              title="Call user"
                            >
                              <Phone className="w-2.5 h-2.5 text-brand-orange shrink-0" />
                              <span>{thread.userPhone}</span>
                            </a>
                          )}
                        </div>

                        <p className="text-xs text-slate-700 truncate mt-1 font-medium">
                          {thread.lastMessage || 'No messages yet'}
                        </p>

                        <div className="flex items-center gap-1.5 mt-2">
                          <span
                            className={`text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full border ${
                              thread.status === 'open'
                                ? 'bg-amber-50 text-amber-700 border-amber-200'
                                : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            }`}
                          >
                            {thread.status}
                          </span>

                          {thread.unreadAdminCount > 0 && (
                            <span className="text-[9px] font-extrabold px-2 py-0.5 rounded-full bg-rose-600 text-white animate-pulse">
                              {thread.unreadAdminCount} New
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Delete Action + Mobile Chevron */}
                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setDeleteConfirmId(thread.id);
                          }}
                          className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition border border-transparent hover:border-rose-200 active:scale-95"
                          title="Delete Inquiry"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                        <div className="md:hidden text-slate-300">
                          <ChevronRight className="w-5 h-5 text-slate-400" />
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* RIGHT COLUMN: Active Conversation (Dedicated Full-Screen on Phone, Right Panel on Desktop) */}
          <div
            className={`w-full flex-col bg-white overflow-hidden ${
              mobileView === 'chat'
                ? 'fixed inset-0 z-50 flex h-[100dvh] w-screen bg-slate-50'
                : 'hidden md:flex md:flex-1 md:bg-white'
            }`}
          >
            {selectedThread ? (
              <>
                {/* Thread Header */}
                <div className="p-3 sm:p-4 border-b border-slate-200 flex items-center justify-between gap-2 sm:gap-4 bg-white shrink-0 shadow-xs">
                  <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
                    {/* Mobile Back Button */}
                    <button
                      onClick={() => setMobileView('list')}
                      className="md:hidden px-3 py-2 -ml-1 text-slate-800 hover:text-brand-navy hover:bg-slate-100 rounded-xl transition flex items-center gap-1.5 font-bold text-xs shrink-0 bg-slate-100 border border-slate-200 shadow-2xs active:scale-95"
                      aria-label="Back to inquiries list"
                      title="Back to inquiries list"
                    >
                      <ArrowLeft className="w-4 h-4 text-brand-orange" />
                      <span className="text-xs font-black">Inquiries</span>
                    </button>

                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-brand-orange/10 text-brand-orange border border-brand-orange/20 flex items-center justify-center font-bold text-xs sm:text-sm shrink-0">
                      <User className="w-4 h-4 sm:w-5 sm:h-5" />
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5 sm:gap-2">
                        <h3 className="text-xs sm:text-sm font-bold text-brand-navy truncate">
                          {selectedThread.userName}
                        </h3>
                        <Badge
                          variant={selectedThread.status === 'open' ? 'amber' : 'emerald'}
                          size="sm"
                          className="scale-85 sm:scale-100 origin-left"
                        >
                          {selectedThread.status === 'open' ? 'Open' : 'Resolved'}
                        </Badge>
                      </div>
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[10px] sm:text-xs text-slate-500 mt-0.5">
                        <a
                          href={`mailto:${selectedThread.userEmail}`}
                          className="hover:text-brand-navy hover:underline flex items-center gap-1 truncate"
                        >
                          <Mail className="w-3 h-3 shrink-0" />
                          <span className="truncate">{selectedThread.userEmail}</span>
                        </a>

                        {selectedThread.userPhone && (
                          <div className="flex items-center gap-1.5">
                            <a
                              href={`tel:${selectedThread.userPhone}`}
                              className="text-brand-navy font-bold hover:underline flex items-center gap-1"
                            >
                              <Phone className="w-3 h-3 text-brand-orange shrink-0" />
                              <span>{selectedThread.userPhone}</span>
                            </a>
                            {selectedThread.userPhone.replace(/[^0-9]/g, '') && (
                              <a
                                href={`https://wa.me/${selectedThread.userPhone.replace(/[^0-9]/g, '')}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 text-[10px] font-bold hover:bg-emerald-100 border border-emerald-200"
                              >
                                <MessageSquare className="w-2.5 h-2.5" />
                                <span>WA</span>
                              </a>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                    <button
                      onClick={() => handleToggleStatus(selectedThread.id, selectedThread.status)}
                      className={`px-3 py-2 rounded-xl text-xs font-bold border transition flex items-center gap-1.5 active:scale-95 shadow-2xs ${
                        selectedThread.status === 'open'
                          ? 'bg-emerald-50 border-emerald-300 text-emerald-700 hover:bg-emerald-100'
                          : 'bg-amber-50 border-amber-300 text-amber-700 hover:bg-amber-100'
                      }`}
                    >
                      <CheckCircle2 className="w-4 h-4 shrink-0" />
                      <span className="hidden xs:inline">
                        {selectedThread.status === 'open' ? 'Mark Resolved' : 'Reopen Query'}
                      </span>
                      <span className="xs:hidden">
                        {selectedThread.status === 'open' ? 'Resolve' : 'Reopen'}
                      </span>
                    </button>

                    <button
                      onClick={() => setDeleteConfirmId(selectedThread.id)}
                      className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition border border-transparent hover:border-rose-200 active:scale-95"
                      title="Delete Conversation"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Messages Feed */}
                <div className="flex-1 p-4 sm:p-5 overflow-y-auto space-y-3.5 sm:space-y-4 bg-slate-100/60 overscroll-contain">
                  {selectedThread.messages.map((msg) => {
                    const isAdmin = msg.sender === 'admin';
                    return (
                      <div
                        key={msg.id}
                        className={`flex flex-col ${isAdmin ? 'items-end' : 'items-start'}`}
                      >
                        <div className="flex items-center gap-1.5 mb-1 text-[10px] text-slate-400 font-medium px-1">
                          <span className="font-bold text-slate-600">
                            {isAdmin ? 'IdeaVerse Desk' : selectedThread.userName}
                          </span>
                          <span>•</span>
                          <span>
                            {new Date(msg.timestamp).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                        </div>
                        <div
                          className={`max-w-[85%] sm:max-w-[78%] rounded-2xl px-4 py-2.5 sm:py-3 text-sm leading-relaxed shadow-xs break-words ${
                            isAdmin
                              ? 'bg-brand-navy text-white rounded-tr-xs font-medium border border-brand-navyDark'
                              : 'bg-white text-slate-800 rounded-tl-xs border border-slate-200/80 shadow-xs'
                          }`}
                        >
                          {msg.message}
                        </div>
                      </div>
                    );
                  })}
                  <div ref={messagesEndRef} />
                </div>

                {/* Canned Quick Responses Bar */}
                <div className="px-3 sm:px-4 py-2 border-t border-slate-200 bg-white flex items-center gap-1.5 overflow-x-auto no-scrollbar shrink-0 shadow-2xs">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider whitespace-nowrap mr-1">
                    Quick:
                  </span>
                  {CANNED_RESPONSES.map((item, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setReplyText(item.text)}
                      className="whitespace-nowrap text-xs bg-slate-50 hover:bg-brand-orange/10 hover:border-brand-orange/40 text-slate-700 px-3 py-1.5 rounded-xl border border-slate-200 font-medium transition active:scale-95 shadow-2xs shrink-0"
                    >
                      {item.label}
                    </button>
                  ))}
                </div>

                {/* Reply Composer Box */}
                <form
                  onSubmit={handleSendReply}
                  className="p-2.5 sm:p-4 border-t border-slate-200 bg-white flex flex-col gap-2 shrink-0 pb-safe"
                >
                  <div className="flex items-center gap-2">
                    <textarea
                      rows={1}
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      onKeyDown={(e) => {
                        if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
                          e.preventDefault();
                          handleSendReply();
                        }
                      }}
                      placeholder={`Reply to ${selectedThread.userName}...`}
                      className="flex-1 px-4 py-3 text-base sm:text-sm rounded-2xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-navy/30 focus:border-brand-navy text-slate-800 resize-none max-h-28 shadow-inner"
                    />
                    <button
                      type="submit"
                      disabled={!replyText.trim() || isSending}
                      className="w-11 h-11 sm:w-auto sm:px-5 sm:py-3 rounded-full sm:rounded-xl bg-gradient-to-r from-brand-navy to-brand-navyDark text-white text-xs font-bold hover:shadow-lg transition active:scale-95 disabled:opacity-40 flex items-center justify-center gap-2 shrink-0 shadow-md"
                    >
                      {isSending ? (
                        <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <>
                          <span className="hidden sm:inline">Send Reply</span>
                          <Send className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center p-6 text-center text-slate-400">
                <MessageSquare className="w-10 h-10 sm:w-12 sm:h-12 text-slate-300 mb-2 sm:mb-3" />
                <h4 className="text-xs sm:text-sm font-bold text-slate-700">No Conversation Selected</h4>
                <p className="text-[11px] sm:text-xs text-slate-400 max-w-sm mt-1">
                  Choose an inquiry from the left panel to review questions and dispatch live answers.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full border border-slate-200 shadow-2xl space-y-4">
            <div className="w-10 h-10 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center border border-rose-200">
              <AlertCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Delete Conversation</h3>
              <p className="text-xs text-slate-500 mt-1">
                Are you sure you want to delete this chat thread? This conversation and message history will be permanently deleted.
              </p>
            </div>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteThread(deleteConfirmId)}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-rose-600 text-white hover:bg-rose-700 transition"
              >
                Delete Permanently
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
