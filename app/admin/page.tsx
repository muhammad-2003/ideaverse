'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  Lock,
  Search,
  Download,
  RefreshCw,
  Trash2,
  Eye,
  Building2,
  User,
  Mail,
  Phone,
  MapPin,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Users,
  Award,
  Sparkles,
  LogOut,
  MessageSquare,
  ShieldCheck,
  Globe,
  Plus,
  Save,
  Upload,
  Image as ImageIcon,
  HelpCircle,
  Trophy,
  Flame,
  Camera,
  Mic,
  Star,
  Layers,
  Table,
  Check,
  Crop,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { Card } from '@/components/ui/Card';
import { IdeaVerseLead } from '@/types/lead';
import { getAllLeads, deleteLead, getGlobalFormClickCount } from '@/lib/supabase/service';
import { SiteContent, PreviousEditionHighlight, PrizeBlock, FeaturedStartup, FAQItem } from '@/types/content';
import { defaultSiteContent } from '@/lib/content/defaultContent';
import { AdminLiveChat } from '@/components/admin/AdminLiveChat';
import { ImageCropperModal, AspectRatioOption } from '@/components/ui/ImageCropperModal';

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passcode, setPasscode] = useState('');
  const [passcodeError, setPasscodeError] = useState(false);

  // Tabs: 'leads' | 'chat' | 'highlights' | 'prizes' | 'startups' | 'faqs'
  const [activeTab, setActiveTab] = useState<'leads' | 'chat' | 'highlights' | 'prizes' | 'startups' | 'faqs'>('leads');
  const [chatUnreadCount, setChatUnreadCount] = useState(0);

  // Leads State
  const [leads, setLeads] = useState<IdeaVerseLead[]>([]);
  const [serverClickCount, setServerClickCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [cityFilter, setCityFilter] = useState<string>('all');
  const [selectedLead, setSelectedLead] = useState<IdeaVerseLead | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [deleteConfirmRef, setDeleteConfirmRef] = useState<string | null>(null);

  // CMS Content State
  const [content, setContent] = useState<SiteContent>(defaultSiteContent);
  const [isContentLoading, setIsContentLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);

  // Image Cropper State
  const [cropperOpen, setCropperOpen] = useState(false);
  const [cropperImageSrc, setCropperImageSrc] = useState<string | null>(null);
  const [cropperFileName, setCropperFileName] = useState('photo.jpg');
  const [cropperDefaultRatio, setCropperDefaultRatio] = useState<AspectRatioOption>('16:9');
  const [cropperTitle, setCropperTitle] = useState('Crop Photo');
  const [cropperCallback, setCropperCallback] = useState<((croppedUrl: string) => void) | null>(null);

  const openCropperForFile = (
    file: File,
    aspectRatio: AspectRatioOption = '16:9',
    title = 'Crop Photo',
    onComplete: (url: string) => void
  ) => {
    const objectUrl = URL.createObjectURL(file);
    setCropperImageSrc(objectUrl);
    setCropperFileName(file.name);
    setCropperDefaultRatio(aspectRatio);
    setCropperTitle(title);
    setCropperCallback(() => onComplete);
    setCropperOpen(true);
  };

  const openCropperForUrl = (
    url: string,
    aspectRatio: AspectRatioOption = '16:9',
    title = 'Crop & Re-frame Photo',
    onComplete: (url: string) => void
  ) => {
    setCropperImageSrc(url);
    setCropperFileName('image.jpg');
    setCropperDefaultRatio(aspectRatio);
    setCropperTitle(title);
    setCropperCallback(() => onComplete);
    setCropperOpen(true);
  };

  const handleCropperComplete = async (croppedFile: File) => {
    const uploadedUrl = await handleUploadImage(croppedFile);
    if (uploadedUrl && cropperCallback) {
      cropperCallback(uploadedUrl);
    }
  };

  // Check existing session
  useEffect(() => {
    const authed = sessionStorage.getItem('ideaverse_admin_authed');
    if (authed === 'true') {
      setIsAuthenticated(true);
      fetchLeads();
      fetchContent();
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode.trim() === 'ideaverse2026' || passcode.trim() === 'admin123') {
      sessionStorage.setItem('ideaverse_admin_authed', 'true');
      setIsAuthenticated(true);
      setPasscodeError(false);
      fetchLeads();
      fetchContent();
    } else {
      setPasscodeError(true);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('ideaverse_admin_authed');
    setIsAuthenticated(false);
    setPasscode('');
  };

  const fetchLeads = async () => {
    setIsLoading(true);
    try {
      const data = await getAllLeads();
      setLeads(data);

      const clickRes = await fetch('/api/track-click');
      if (clickRes.ok) {
        const clickData = await clickRes.json();
        setServerClickCount(clickData.totalClicks || 0);
      }
    } catch (err) {
      console.error('Failed to load applications:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchContent = async () => {
    setIsContentLoading(true);
    // First load from localStorage if available
    try {
      const local = localStorage.getItem('ideaverse_site_content');
      if (local) {
        const parsed = JSON.parse(local);
        if (parsed) {
          setContent((prev) => ({ ...prev, ...parsed }));
        }
      }
    } catch (e) {}

    try {
      const res = await fetch('/api/content');
      if (res.ok) {
        const data = await res.json();
        if (data.content) {
          setContent(data.content);
          try {
            localStorage.setItem('ideaverse_site_content', JSON.stringify(data.content));
          } catch (e) {}
        }
      }
    } catch (err) {
      console.error('Failed to load site content from API, using cached:', err);
    } finally {
      setIsContentLoading(false);
    }
  };

  const saveContentSection = async (updatedData: Partial<SiteContent>, successMessage: string) => {
    setIsSaving(true);
    const merged: SiteContent = { ...content, ...updatedData };
    setContent(merged);

    // 1. Immediately persist to localStorage & fire real-time update event
    try {
      localStorage.setItem('ideaverse_site_content', JSON.stringify(merged));
      window.dispatchEvent(new CustomEvent('ideaverse_content_updated', { detail: merged }));
    } catch (e) {
      console.warn('LocalStorage save warning:', e);
    }

    // 2. Persist to API
    try {
      const res = await fetch('/api/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData),
      });
      if (res.ok) {
        const json = await res.json();
        if (json.content) {
          setContent(json.content);
          try {
            localStorage.setItem('ideaverse_site_content', JSON.stringify(json.content));
            window.dispatchEvent(new CustomEvent('ideaverse_content_updated', { detail: json.content }));
          } catch (e) {}
        }
      }
      setSaveSuccessMsg(successMessage);
      setTimeout(() => setSaveSuccessMsg(null), 3500);
    } catch (err) {
      console.warn('API save warning (local cache saved successfully):', err);
      setSaveSuccessMsg('Changes saved locally and live on this browser!');
      setTimeout(() => setSaveSuccessMsg(null), 3500);
    } finally {
      setIsSaving(false);
    }
  };

  // Image upload helper with reliable Data URL fallback
  const handleUploadImage = async (file: File): Promise<string | null> => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      if (res.ok) {
        const data = await res.json();
        if (data.url) return data.url;
      }
    } catch (e) {
      console.warn('Server upload request failed, falling back to Data URL:', e);
    }

    // High reliability client-side Data URL fallback
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        resolve(reader.result as string);
      };
      reader.onerror = () => {
        resolve(null);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleDelete = async (ref: string) => {
    // 1. Optimistic UI update
    setLeads((prev) => prev.filter((l) => l.public_reference !== ref));
    setDeleteConfirmRef(null);
    if (selectedLead?.public_reference === ref) {
      setIsDetailOpen(false);
      setSelectedLead(null);
    }
    setSaveSuccessMsg(`Application ${ref} deleted successfully.`);
    setTimeout(() => setSaveSuccessMsg(null), 3500);

    // 2. Perform backend delete
    try {
      await deleteLead(ref);
    } catch (e) {
      console.error('Delete lead error:', e);
    }
    fetchLeads();
  };

  const handleExportCSV = () => {
    if (leads.length === 0) return;

    const headers = [
      'Reference Code',
      'Startup Name',
      'Team Lead Name',
      'Email',
      'Phone / WhatsApp',
      'Institution',
      'City',
      'Website / Link',
      'Applied on Official Link',
      'Official Link Clicked',
      'Lead Status',
      'Official Form Status',
      'Contact Consent',
      'Promotional Consent',
      'Created At',
    ];

    const rows = leads.map((l) => [
      l.public_reference,
      `"${l.startup_name.replace(/"/g, '""')}"`,
      `"${l.team_lead_name.replace(/"/g, '""')}"`,
      `"${l.email}"`,
      `"${l.phone}"`,
      `"${l.institution.replace(/"/g, '""')}"`,
      `"${l.city.replace(/"/g, '""')}"`,
      `"${(l.website_url || '').replace(/"/g, '""')}"`,
      `"${l.applied_on_official_link || 'No'}"`,
      l.official_link_clicked ? 'Yes' : 'No',
      l.lead_status,
      l.official_form_status,
      l.contact_consent ? 'Yes' : 'No',
      l.promotional_consent ? 'Yes' : 'No',
      l.created_at ? new Date(l.created_at).toLocaleString() : '',
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute(
      'download',
      `ideaverse_20_applications_${new Date().toISOString().split('T')[0]}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Leads Filtering
  const filteredLeads = leads.filter((lead) => {
    const matchesSearch =
      lead.startup_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.team_lead_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.institution.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.public_reference.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === 'all' || lead.lead_status === statusFilter;

    const matchesCity =
      cityFilter === 'all' ||
      (cityFilter === 'karachi' && lead.city.toLowerCase().includes('karachi')) ||
      (cityFilter === 'regional' && !lead.city.toLowerCase().includes('karachi'));

    return matchesSearch && matchesStatus && matchesCity;
  });

  // KPI Metrics
  const totalLeads = leads.length;
  const leadFormClicks = leads.filter(
    (l) => l.official_link_clicked || l.official_form_status === 'opened' || l.applied_on_official_link === 'Yes'
  ).length;
  const totalGoogleFormClicks = Math.max(leadFormClicks, serverClickCount, getGlobalFormClickCount());
  const appliedYesCount = leads.filter(
    (l) => l.applied_on_official_link === 'Yes' || l.lead_status === 'application_self_reported'
  ).length;
  const iqraCount = leads.filter((l) =>
    l.institution.toLowerCase().includes('iqra')
  ).length;
  const regionalCount = leads.filter(
    (l) => !l.city.toLowerCase().includes('karachi')
  ).length;
  const promoConsentCount = leads.filter((l) => l.promotional_consent).length;

  // Render Login Gate
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-3xl border border-slate-200 p-8 shadow-2xl space-y-6 text-center">
          <div className="w-16 h-16 rounded-2xl bg-brand-navy/10 border border-brand-navy/20 flex items-center justify-center mx-auto text-brand-navy">
            <Lock className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <Badge variant="navy" size="sm">
              Organizer Portal
            </Badge>
            <h1 className="text-2xl font-black font-display text-brand-navy">
              IdeaVerse 2.0 Admin
            </h1>
            <p className="text-xs text-slate-600 font-medium">
              Enter organizer passcode to access applicant records and website content editor.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4 text-left">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Passcode
              </label>
              <input
                type="password"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                placeholder="Enter passcode (e.g. ideaverse2026)"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-brand-navy focus:bg-white transition-colors"
                autoFocus
              />
              {passcodeError && (
                <p className="text-xs text-red-500 font-medium mt-1">
                  Invalid passcode. Please try again.
                </p>
              )}
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full py-3 text-xs uppercase tracking-widest font-extrabold"
            >
              Access Dashboard
            </Button>
          </form>

          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400 font-medium">
            <span>Iqra University</span>
            <span>Spectrum 2.0</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-slate-50 text-left ${activeTab === 'chat' ? 'pb-2 sm:pb-24' : 'pb-24'}`}>
      {/* Top Navbar */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-3 sm:py-4 flex flex-wrap items-center justify-between gap-2.5 sm:gap-4">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <Link href="/" target="_blank" title="Open Public Website">
              <img
                src="/images/ideaverse_20_logo.png"
                alt="IdeaVerse 2.0"
                className="h-8 sm:h-9 w-auto object-contain hover:opacity-85 transition-opacity"
              />
            </Link>
            <span className="h-6 w-px bg-slate-200 hidden sm:inline-block" />
            <Badge variant="navy" size="sm" className="hidden sm:inline-flex">
              Organizer Admin Panel & CMS
            </Badge>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              href="/"
              target="_blank"
              className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:text-brand-navy hover:bg-slate-50 transition-colors"
            >
              <span>View Public Site</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>

            <Button
              onClick={() => {
                fetchLeads();
                fetchContent();
              }}
              variant="secondary"
              size="sm"
              icon={RefreshCw}
              className={`text-xs px-2.5 sm:px-3 ${isLoading || isContentLoading ? 'animate-spin' : ''}`}
            >
              <span className="hidden xs:inline">Refresh</span>
            </Button>

            {activeTab === 'leads' && (
              <Button
                onClick={handleExportCSV}
                variant="primary"
                size="sm"
                icon={Download}
                className="text-xs uppercase tracking-wider px-2.5 sm:px-3"
                disabled={leads.length === 0}
              >
                <span className="hidden xs:inline">Export </span>CSV
              </Button>
            )}

            <button
              onClick={handleLogout}
              className="p-1.5 sm:p-2 text-slate-500 hover:text-red-600 hover:bg-slate-100 rounded-xl transition-colors"
              title="Logout"
            >
              <LogOut className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
        </div>

        {/* Global Navigation Tabs */}
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 flex items-center gap-1.5 sm:gap-2 overflow-x-auto no-scrollbar border-t border-slate-100 py-2">
          <button
            onClick={() => setActiveTab('leads')}
            className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-[11px] sm:text-xs font-extrabold uppercase tracking-wider transition-colors flex items-center gap-1.5 sm:gap-2 shrink-0 whitespace-nowrap ${
              activeTab === 'leads'
                ? 'bg-brand-navy text-white shadow-sm'
                : 'text-slate-600 hover:text-brand-navy hover:bg-slate-100'
            }`}
          >
            <Table className="w-3.5 h-3.5" />
            <span>Applications ({leads.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('chat')}
            className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-[11px] sm:text-xs font-extrabold uppercase tracking-wider transition-colors flex items-center gap-1.5 sm:gap-2 shrink-0 whitespace-nowrap relative ${
              activeTab === 'chat'
                ? 'bg-brand-navy text-white shadow-sm'
                : 'text-slate-600 hover:text-brand-navy hover:bg-slate-100'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Live Queries</span>
            {chatUnreadCount > 0 && (
              <span className="px-1.5 py-0.5 rounded-full bg-rose-600 text-white text-[10px] font-black animate-pulse">
                {chatUnreadCount} New
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('highlights')}
            className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-[11px] sm:text-xs font-extrabold uppercase tracking-wider transition-colors flex items-center gap-1.5 sm:gap-2 shrink-0 whitespace-nowrap ${
              activeTab === 'highlights'
                ? 'bg-brand-navy text-white shadow-sm'
                : 'text-slate-600 hover:text-brand-navy hover:bg-slate-100'
            }`}
          >
            <Camera className="w-3.5 h-3.5" />
            <span>Photos &amp; Highlights</span>
          </button>

          <button
            onClick={() => setActiveTab('prizes')}
            className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-[11px] sm:text-xs font-extrabold uppercase tracking-wider transition-colors flex items-center gap-1.5 sm:gap-2 shrink-0 whitespace-nowrap ${
              activeTab === 'prizes'
                ? 'bg-brand-navy text-white shadow-sm'
                : 'text-slate-600 hover:text-brand-navy hover:bg-slate-100'
            }`}
          >
            <Trophy className="w-3.5 h-3.5" />
            <span>Prizes &amp; Sponsors</span>
          </button>

          <button
            onClick={() => setActiveTab('startups')}
            className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-[11px] sm:text-xs font-extrabold uppercase tracking-wider transition-colors flex items-center gap-1.5 sm:gap-2 shrink-0 whitespace-nowrap ${
              activeTab === 'startups'
                ? 'bg-brand-navy text-white shadow-sm'
                : 'text-slate-600 hover:text-brand-navy hover:bg-slate-100'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Startups Wall</span>
          </button>

          <button
            onClick={() => setActiveTab('faqs')}
            className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-[11px] sm:text-xs font-extrabold uppercase tracking-wider transition-colors flex items-center gap-1.5 sm:gap-2 shrink-0 whitespace-nowrap ${
              activeTab === 'faqs'
                ? 'bg-brand-navy text-white shadow-sm'
                : 'text-slate-600 hover:text-brand-navy hover:bg-slate-100'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>FAQs ({content.faqs.length})</span>
          </button>
        </div>
      </header>

      {/* Toast Save Confirmation */}
      {saveSuccessMsg && (
        <div className="fixed top-20 right-4 sm:right-8 z-50 p-4 rounded-2xl bg-emerald-600 text-white font-bold text-xs sm:text-sm shadow-2xl flex items-center gap-3 animate-bounce">
          <CheckCircle2 className="w-5 h-5" />
          <span>{saveSuccessMsg}</span>
        </div>
      )}

      {/* Main Content Area */}
      <main className={`max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 ${activeTab === 'chat' ? 'pt-2 sm:pt-6 space-y-3 sm:space-y-6' : 'pt-4 sm:pt-8 space-y-6 sm:space-y-8'}`}>
        {/* ========================================================================= */}
        {/* TAB 1: APPLICATIONS & LEADS                                               */}
        {/* ========================================================================= */}
        {activeTab === 'leads' && (
          <div className="space-y-6 sm:space-y-8">
            {/* KPI Metrics Dashboard Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-2.5 sm:gap-4">
              <div className="p-3.5 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-1 sm:space-y-2">
                <div className="text-[10px] sm:text-[11px] font-mono font-bold text-slate-400 uppercase tracking-widest truncate">
                  Total Applicants
                </div>
                <div className="text-2xl sm:text-3xl font-black font-display text-brand-navy">
                  {totalLeads}
                </div>
                <div className="text-[10px] sm:text-xs text-slate-500 font-medium truncate">
                  Registered profiles
                </div>
              </div>

              <div className="p-3.5 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-1 sm:space-y-2 border-l-4 border-l-brand-orange">
                <div className="text-[10px] sm:text-[11px] font-mono font-bold text-brand-orange uppercase tracking-widest truncate">
                  Google Form Clicks
                </div>
                <div className="text-2xl sm:text-3xl font-black font-display text-brand-orange">
                  {totalGoogleFormClicks}
                </div>
                <div className="text-[10px] sm:text-xs text-slate-500 font-medium truncate">
                  Form link opened
                </div>
              </div>

              <div className="p-3.5 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-1 sm:space-y-2 border-l-4 border-l-emerald-500">
                <div className="text-[10px] sm:text-[11px] font-mono font-bold text-emerald-600 uppercase tracking-widest truncate">
                  Applied (Yes)
                </div>
                <div className="text-2xl sm:text-3xl font-black font-display text-emerald-600">
                  {appliedYesCount}
                </div>
                <div className="text-[10px] sm:text-xs text-slate-500 font-medium truncate">
                  Answered Yes to form
                </div>
              </div>

              <div className="p-3.5 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-1 sm:space-y-2 border-l-4 border-l-brand-blue">
                <div className="text-[10px] sm:text-[11px] font-mono font-bold text-brand-blue uppercase tracking-widest truncate">
                  Iqra University
                </div>
                <div className="text-2xl sm:text-3xl font-black font-display text-brand-blue">
                  {iqraCount}
                </div>
                <div className="text-[10px] sm:text-xs text-slate-500 font-medium truncate">
                  Internal startups
                </div>
              </div>

              <div className="p-3.5 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-1 sm:space-y-2 border-l-4 border-l-brand-purple">
                <div className="text-[10px] sm:text-[11px] font-mono font-bold text-brand-purple uppercase tracking-widest truncate">
                  Sindh Regional
                </div>
                <div className="text-2xl sm:text-3xl font-black font-display text-brand-purple">
                  {regionalCount}
                </div>
                <div className="text-[10px] sm:text-xs text-slate-500 font-medium truncate">
                  Outside Karachi
                </div>
              </div>

              <div className="p-3.5 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-1 sm:space-y-2 border-l-4 border-l-cyan-500">
                <div className="text-[10px] sm:text-[11px] font-mono font-bold text-cyan-600 uppercase tracking-widest truncate">
                  Media Consent
                </div>
                <div className="text-2xl sm:text-3xl font-black font-display text-cyan-600">
                  {promoConsentCount}
                </div>
                <div className="text-[10px] sm:text-xs text-slate-500 font-medium truncate">
                  Showcase consent
                </div>
              </div>
            </div>

            {/* Toolbar: Search & Filters */}
            <div className="p-3.5 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center justify-between gap-3 sm:gap-4">
              <div className="relative flex-1 min-w-[200px]">
                <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by startup, lead, email, institution, or ref..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-brand-navy focus:bg-white transition-colors"
                />
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
                  <button
                    onClick={() => setStatusFilter('all')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors whitespace-nowrap ${
                      statusFilter === 'all'
                        ? 'bg-brand-navy text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    All ({leads.length})
                  </button>
                  <button
                    onClick={() => setStatusFilter('application_started')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors whitespace-nowrap ${
                      statusFilter === 'application_started'
                        ? 'bg-amber-500 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    Started
                  </button>
                  <button
                    onClick={() => setStatusFilter('application_self_reported')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors whitespace-nowrap ${
                      statusFilter === 'application_self_reported'
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    Self-Reported
                  </button>
                </div>

                <select
                  value={cityFilter}
                  onChange={(e) => setCityFilter(e.target.value)}
                  className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-700 font-bold focus:outline-none focus:border-brand-navy"
                >
                  <option value="all">All Cities</option>
                  <option value="karachi">Karachi Only</option>
                  <option value="regional">Regional Sindh (Non-Karachi)</option>
                </select>
              </div>
            </div>

            {/* Desktop Applications Data Table (md and up) */}
            <div className="hidden md:block bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-mono font-bold text-slate-500 uppercase tracking-wider">
                      <th className="py-3.5 px-4">Ref Code</th>
                      <th className="py-3.5 px-4">Startup</th>
                      <th className="py-3.5 px-4">Team Lead</th>
                      <th className="py-3.5 px-4">Contact</th>
                      <th className="py-3.5 px-4">Institution & City</th>
                      <th className="py-3.5 px-4">Google Form Link</th>
                      <th className="py-3.5 px-4">Applied?</th>
                      <th className="py-3.5 px-4 text-center">Consent</th>
                      <th className="py-3.5 px-4 text-right">Actions</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-100 text-xs">
                    {isLoading ? (
                      <tr>
                        <td colSpan={9} className="py-12 text-center text-slate-500 font-medium">
                          Loading applicant data...
                        </td>
                      </tr>
                    ) : filteredLeads.length === 0 ? (
                      <tr>
                        <td colSpan={9} className="py-12 text-center text-slate-500 font-medium">
                          No matching applications found.
                        </td>
                      </tr>
                    ) : (
                      filteredLeads.map((lead) => {
                        const isOpened =
                          lead.official_form_status === 'opened' || lead.official_link_clicked;
                        const hasApplied = lead.applied_on_official_link === 'Yes';
                        const cleanPhone = lead.phone.replace(/[^0-9]/g, '');
                        const waLink = cleanPhone ? `https://wa.me/${cleanPhone}` : null;

                        return (
                          <tr key={lead.public_reference} className="hover:bg-slate-50/80 transition-colors">
                            <td className="py-3.5 px-4 font-mono text-[11px] font-bold text-brand-navy">
                              {lead.public_reference}
                            </td>

                            <td className="py-3.5 px-4">
                              <div className="flex items-center gap-3">
                                {lead.startup_logo_url ? (
                                  <img
                                    src={lead.startup_logo_url}
                                    alt={lead.startup_name}
                                    className="w-8 h-8 rounded-lg object-contain bg-slate-100 p-0.5 border border-slate-200"
                                  />
                                ) : (
                                  <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center font-bold text-brand-navy">
                                    {lead.startup_name.charAt(0)}
                                  </div>
                                )}
                                <div>
                                  <div className="font-bold text-slate-900">{lead.startup_name}</div>
                                  {lead.website_url && (
                                    <a
                                      href={lead.website_url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-[10px] text-brand-blue hover:underline flex items-center gap-1"
                                    >
                                      <span>Website</span>
                                      <ExternalLink className="w-2.5 h-2.5" />
                                    </a>
                                  )}
                                </div>
                              </div>
                            </td>

                            <td className="py-3.5 px-4 font-medium text-slate-800">
                              {lead.team_lead_name}
                            </td>

                            <td className="py-3.5 px-4 space-y-1">
                              <div className="text-slate-600 font-mono text-[11px]">{lead.email}</div>
                              <div className="flex items-center gap-2">
                                <span className="font-mono text-[11px] text-slate-500">{lead.phone}</span>
                                {waLink && (
                                  <a
                                    href={waLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 text-[10px] font-bold hover:bg-emerald-100"
                                  >
                                    <MessageSquare className="w-3 h-3" />
                                    WA
                                  </a>
                                )}
                              </div>
                            </td>

                            <td className="py-3.5 px-4">
                              <div className="font-semibold text-slate-800">{lead.institution}</div>
                              <div className="text-[11px] text-slate-500">{lead.city}</div>
                            </td>

                            <td className="py-3.5 px-4">
                              {isOpened ? (
                                <Badge variant="emerald" size="sm">
                                  Clicked Link
                                </Badge>
                              ) : (
                                <Badge variant="slate" size="sm">
                                  Not Clicked
                                </Badge>
                              )}
                            </td>

                            <td className="py-3.5 px-4">
                              {hasApplied ? (
                                <Badge variant="emerald" size="sm">
                                  Yes
                                </Badge>
                              ) : (
                                <Badge variant="amber" size="sm">
                                  No
                                </Badge>
                              )}
                            </td>

                            <td className="py-3.5 px-4 text-center">
                              <div className="inline-flex items-center gap-1.5">
                                <span
                                  title={lead.contact_consent ? 'WhatsApp Contact Consent Granted' : 'No Contact Consent'}
                                  className={`w-2 h-2 rounded-full ${lead.contact_consent ? 'bg-emerald-500' : 'bg-slate-300'}`}
                                />
                                <span
                                  title={lead.promotional_consent ? 'Promotional Showcase Consent Granted' : 'No Showcase Consent'}
                                  className={`w-2 h-2 rounded-full ${lead.promotional_consent ? 'bg-brand-orange' : 'bg-slate-300'}`}
                                />
                              </div>
                            </td>

                            <td className="py-3.5 px-4 text-right space-x-2">
                              <button
                                onClick={() => {
                                  setSelectedLead(lead);
                                  setIsDetailOpen(true);
                                	}}
                                className="p-1.5 rounded-lg text-slate-600 hover:text-brand-navy hover:bg-slate-100 transition-colors"
                                title="View Details"
                              >
                                <Eye className="w-4 h-4" />
                              </button>

                              <button
                                onClick={() => setDeleteConfirmRef(lead.public_reference)}
                                className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                                title="Delete Application"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Mobile Cards List View (below md breakpoint) */}
            <div className="md:hidden space-y-3">
              {isLoading ? (
                <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 text-slate-500 font-medium text-xs">
                  Loading applicant data...
                </div>
              ) : filteredLeads.length === 0 ? (
                <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 text-slate-500 font-medium text-xs">
                  No matching applications found.
                </div>
              ) : (
                filteredLeads.map((lead) => {
                  const isOpened = lead.official_form_status === 'opened' || lead.official_link_clicked;
                  const hasApplied = lead.applied_on_official_link === 'Yes';
                  const cleanPhone = lead.phone.replace(/[^0-9]/g, '');
                  const waLink = cleanPhone ? `https://wa.me/${cleanPhone}` : null;

                  return (
                    <div
                      key={lead.public_reference}
                      className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3"
                    >
                      {/* Top Bar: Ref & Actions */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-black text-brand-navy bg-brand-navy/10 px-2 py-0.5 rounded-lg">
                            {lead.public_reference}
                          </span>
                          <Badge
                            variant={lead.lead_status === 'application_self_reported' ? 'emerald' : 'amber'}
                            size="sm"
                          >
                            {lead.lead_status === 'application_self_reported' ? 'Self-Reported' : 'Started'}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => {
                              setSelectedLead(lead);
                              setIsDetailOpen(true);
                            }}
                            className="p-1.5 rounded-lg text-slate-600 hover:text-brand-navy hover:bg-slate-100 transition-colors"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setDeleteConfirmRef(lead.public_reference)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Startup info */}
                      <div className="flex items-center gap-3">
                        {lead.startup_logo_url ? (
                          <img
                            src={lead.startup_logo_url}
                            alt={lead.startup_name}
                            className="w-10 h-10 rounded-xl object-contain bg-slate-50 p-1 border border-slate-200 shrink-0"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-xl bg-brand-navy/10 border border-brand-navy/20 flex items-center justify-center font-black text-brand-navy shrink-0">
                            {lead.startup_name.charAt(0)}
                          </div>
                        )}
                        <div className="min-w-0 flex-1">
                          <div className="font-extrabold text-slate-900 text-sm truncate">
                            {lead.startup_name}
                          </div>
                          <div className="text-xs text-slate-500 truncate">
                            {lead.institution} • {lead.city}
                          </div>
                        </div>
                      </div>

                      {/* Lead Contact Info */}
                      <div className="pt-2 border-t border-slate-100 grid grid-cols-1 xs:grid-cols-2 gap-2 text-xs">
                        <div>
                          <span className="text-[10px] uppercase font-bold text-slate-400 block">Lead</span>
                          <span className="font-bold text-slate-800">{lead.team_lead_name}</span>
                        </div>
                        <div>
                          <span className="text-[10px] uppercase font-bold text-slate-400 block">Contact</span>
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-slate-700">{lead.phone}</span>
                            {waLink && (
                              <a
                                href={waLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 text-[10px] font-bold"
                              >
                                WA
                              </a>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Status Badges */}
                      <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs">
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] text-slate-500">Google Form:</span>
                          <Badge variant={isOpened ? 'emerald' : 'slate'} size="sm">
                            {isOpened ? 'Clicked' : 'Not Clicked'}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] text-slate-500">Applied:</span>
                          <Badge variant={hasApplied ? 'emerald' : 'amber'} size="sm">
                            {hasApplied ? 'Yes' : 'No'}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: LIVE CHAT QUERY DESK                                               */}
        {/* ========================================================================= */}
        {activeTab === 'chat' && (
          <AdminLiveChat onUnreadChange={setChatUnreadCount} />
        )}

        {/* ========================================================================= */}
        {/* TAB 2: "THIS WAS IDEAVERSE" HIGHLIGHTS & PHOTOS CMS                       */}
        {/* ========================================================================= */}
        {activeTab === 'highlights' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 p-4 sm:p-6 rounded-2xl bg-white border border-slate-200 shadow-sm">
              <div>
                <h2 className="text-lg sm:text-xl font-black font-display text-brand-navy">
                  &quot;This Was IdeaVerse&quot; Photos &amp; Highlights
                </h2>
                <p className="text-xs text-slate-500 mt-0.5 sm:mt-1">
                  Replace pictures, update titles, or add new narrative cards for the public showcase section.
                </p>
              </div>

              <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                <Button
                  onClick={() => {
                    const newHighlight: PreviousEditionHighlight = {
                      id: `highlight-${Date.now()}`,
                      title: 'New Story Highlight',
                      subtitle: 'Add a compelling description of what happened at IdeaVerse.',
                      icon: 'Sparkles',
                      gradient: 'from-brand-blue to-brand-purple',
                      bgImage: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=800&auto=format&fit=crop',
                    };
                    setContent({
                      ...content,
                      previousEdition: [...content.previousEdition, newHighlight],
                    });
                  }}
                  variant="secondary"
                  size="sm"
                  icon={Plus}
                  className="text-xs uppercase tracking-wider"
                >
                  Add Card
                </Button>

                <Button
                  onClick={() =>
                    saveContentSection(
                      { previousEdition: content.previousEdition },
                      'Highlights & Pictures saved successfully! Live on website.'
                    )
                  }
                  variant="primary"
                  size="sm"
                  icon={Save}
                  className="text-xs uppercase tracking-wider"
                  isLoading={isSaving}
                >
                  Save Changes
                </Button>
              </div>
            </div>

            {/* Highlights Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {content.previousEdition.map((item, idx) => (
                <Card key={item.id || idx} className="p-6 bg-white border-slate-200 shadow-md space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-widest">
                      Card #{idx + 1}
                    </span>
                    <button
                      onClick={() => {
                        const filtered = content.previousEdition.filter((_, i) => i !== idx);
                        setContent({ ...content, previousEdition: filtered });
                      }}
                      className="text-slate-400 hover:text-red-600 transition-colors p-1"
                      title="Delete card"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Image Preview & Upload */}
                  <div className="space-y-2">
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700">
                      Picture &amp; Image Preview
                    </label>
                    <div className="relative h-44 rounded-xl overflow-hidden border border-slate-200 bg-slate-900 group">
                      <img
                        src={item.bgImage}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                      <div className="absolute inset-0 bg-slate-900/40 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <label className="cursor-pointer px-3.5 py-2 rounded-xl bg-white text-slate-900 font-bold text-xs shadow-lg hover:bg-slate-100 flex items-center gap-1.5 transition">
                          <Upload className="w-4 h-4 text-brand-orange" />
                          <span>Change Photo</span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                openCropperForFile(
                                  file,
                                  '16:9',
                                  `Crop "${item.title || 'Highlight'}" Photo`,
                                  (uploadedUrl) => {
                                    const updated = [...content.previousEdition];
                                    updated[idx] = { ...updated[idx], bgImage: uploadedUrl };
                                    setContent({ ...content, previousEdition: updated });
                                  }
                                );
                              }
                              e.target.value = '';
                            }}
                          />
                        </label>

                        {item.bgImage && (
                          <button
                            type="button"
                            onClick={() => {
                              openCropperForUrl(
                                item.bgImage,
                                '16:9',
                                `Crop & Re-frame "${item.title || 'Highlight'}"`,
                                (uploadedUrl) => {
                                  const updated = [...content.previousEdition];
                                  updated[idx] = { ...updated[idx], bgImage: uploadedUrl };
                                  setContent({ ...content, previousEdition: updated });
                                }
                              );
                            }}
                            className="px-3.5 py-2 rounded-xl bg-slate-900/90 hover:bg-slate-900 text-white font-bold text-xs shadow-lg backdrop-blur-md flex items-center gap-1.5 transition border border-white/20"
                            title="Crop and frame this photo"
                          >
                            <Crop className="w-4 h-4 text-brand-orange" />
                            <span>Crop / Adjust</span>
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pt-1">
                      <input
                        type="text"
                        value={item.bgImage}
                        onChange={(e) => {
                          const updated = [...content.previousEdition];
                          updated[idx] = { ...updated[idx], bgImage: e.target.value };
                          setContent({ ...content, previousEdition: updated });
                        }}
                        placeholder="Image URL or upload above"
                        className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono text-slate-700 focus:bg-white"
                      />
                      {item.bgImage && (
                        <button
                          type="button"
                          onClick={() => {
                            openCropperForUrl(
                              item.bgImage,
                              '16:9',
                              `Crop & Frame "${item.title || 'Highlight'}"`,
                              (uploadedUrl) => {
                                const updated = [...content.previousEdition];
                                updated[idx] = { ...updated[idx], bgImage: uploadedUrl };
                                setContent({ ...content, previousEdition: updated });
                              }
                            );
                          }}
                          className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-brand-orange/10 hover:text-brand-orange hover:border-brand-orange/40 border border-slate-200 text-xs font-bold text-slate-700 transition flex items-center gap-1 shrink-0"
                          title="Open Cropper for this image"
                        >
                          <Crop className="w-3.5 h-3.5" />
                          <span>Crop</span>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Title & Subtitle */}
                  <div className="space-y-3">
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                        Highlight Title
                      </label>
                      <input
                        type="text"
                        value={item.title}
                        onChange={(e) => {
                          const updated = [...content.previousEdition];
                          updated[idx] = { ...updated[idx], title: e.target.value };
                          setContent({ ...content, previousEdition: updated });
                        }}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm font-bold text-slate-900 focus:bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                        Subtitle / Description
                      </label>
                      <textarea
                        rows={2}
                        value={item.subtitle}
                        onChange={(e) => {
                          const updated = [...content.previousEdition];
                          updated[idx] = { ...updated[idx], subtitle: e.target.value };
                          setContent({ ...content, previousEdition: updated });
                        }}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:bg-white leading-relaxed"
                      />
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 3: PRIZE POOL & SPONSORS CMS                                          */}
        {/* ========================================================================= */}
        {activeTab === 'prizes' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 p-4 sm:p-6 rounded-2xl bg-white border border-slate-200 shadow-sm">
              <div>
                <h2 className="text-lg sm:text-xl font-black font-display text-brand-navy">
                  Prize Pool, Sponsor Notes &amp; Award Blocks
                </h2>
                <p className="text-xs text-slate-500 mt-0.5 sm:mt-1">
                  Once sponsors are secured, update the official prize pool note and customize the prize amount blocks.
                </p>
              </div>

              <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                <Button
                  onClick={() => {
                    const newBlock: PrizeBlock = {
                      id: `prize-${Date.now()}`,
                      title: 'Special Track Award',
                      amount: 'PKR 50,000 + Sponsor Shield',
                      description: 'Awarded for distinctive industry innovation or partner challenge solution.',
                      badge: 'Special Award',
                      perks: ['Official Partner Trophy', 'Dedicated Showcase Slot'],
                    };
                    setContent({
                      ...content,
                      prizePool: {
                        ...content.prizePool,
                        blocks: [...content.prizePool.blocks, newBlock],
                      },
                    });
                  }}
                  variant="secondary"
                  size="sm"
                  icon={Plus}
                  className="text-xs uppercase tracking-wider"
                >
                  Add Prize Block
                </Button>

                <Button
                  onClick={() =>
                    saveContentSection(
                      { prizePool: content.prizePool },
                      'Prize Pool & Sponsor details updated successfully!'
                    )
                  }
                  variant="primary"
                  size="sm"
                  icon={Save}
                  className="text-xs uppercase tracking-wider"
                  isLoading={isSaving}
                >
                  Save Prize Pool
                </Button>
              </div>
            </div>

            {/* General Status & Note Config */}
            <Card className="p-6 bg-white border-slate-200 shadow-md space-y-5">
              <div className="text-xs font-mono font-bold text-brand-navy uppercase tracking-widest border-b border-slate-100 pb-2">
                Section Headline &amp; Sponsor Announcement Note
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Announcement Status
                  </label>
                  <select
                    value={content.prizePool.status}
                    onChange={(e) => {
                      const status = e.target.value as 'tba' | 'announced';
                      setContent({
                        ...content,
                        prizePool: {
                          ...content.prizePool,
                          status,
                          statusBadge:
                            status === 'tba'
                              ? 'Sponsorship in Progress'
                              : 'Official Prize Pool Announced',
                        },
                      });
                    }}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-900"
                  >
                    <option value="tba">Sponsorship in Progress (TBA)</option>
                    <option value="announced">Official Prize Pool Announced</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Status Badge Text
                  </label>
                  <input
                    type="text"
                    value={content.prizePool.statusBadge}
                    onChange={(e) =>
                      setContent({
                        ...content,
                        prizePool: { ...content.prizePool, statusBadge: e.target.value },
                      })
                    }
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Prize Pool Note (Displayed under headline on the website)
                </label>
                <textarea
                  rows={3}
                  value={content.prizePool.note}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      prizePool: { ...content.prizePool, note: e.target.value },
                    })
                  }
                  placeholder="e.g. Final cash rewards, official trophies, and startup perks will be announced once corporate sponsorship packages are finalized..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-900 font-medium leading-relaxed"
                />
              </div>
            </Card>

            {/* Individual Prize Blocks */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {content.prizePool.blocks.map((block, idx) => (
                <Card key={block.id || idx} className="p-6 bg-white border-slate-200 shadow-md space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <span className="text-xs font-mono font-bold text-brand-orange uppercase tracking-widest">
                      Prize Block #{idx + 1}
                    </span>
                    <button
                      onClick={() => {
                        const filtered = content.prizePool.blocks.filter((_, i) => i !== idx);
                        setContent({
                          ...content,
                          prizePool: { ...content.prizePool, blocks: filtered },
                        });
                      }}
                      className="text-slate-400 hover:text-red-600 transition-colors p-1"
                      title="Delete block"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                        Title / Category
                      </label>
                      <input
                        type="text"
                        value={block.title}
                        onChange={(e) => {
                          const updated = [...content.prizePool.blocks];
                          updated[idx] = { ...updated[idx], title: e.target.value };
                          setContent({
                            ...content,
                            prizePool: { ...content.prizePool, blocks: updated },
                          });
                        }}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-900"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                        Badge (e.g. 1st Prize)
                      </label>
                      <input
                        type="text"
                        value={block.badge || ''}
                        onChange={(e) => {
                          const updated = [...content.prizePool.blocks];
                          updated[idx] = { ...updated[idx], badge: e.target.value };
                          setContent({
                            ...content,
                            prizePool: { ...content.prizePool, blocks: updated },
                          });
                        }}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono text-slate-700"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                      Award / Cash Value Text
                    </label>
                    <input
                      type="text"
                      value={block.amount}
                      onChange={(e) => {
                        const updated = [...content.prizePool.blocks];
                        updated[idx] = { ...updated[idx], amount: e.target.value };
                        setContent({
                          ...content,
                          prizePool: { ...content.prizePool, blocks: updated },
                        });
                      }}
                      placeholder="e.g. Cash Reward + Official Trophy"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm font-black text-brand-navy"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                      Description
                    </label>
                    <textarea
                      rows={2}
                      value={block.description}
                      onChange={(e) => {
                        const updated = [...content.prizePool.blocks];
                        updated[idx] = { ...updated[idx], description: e.target.value };
                        setContent({
                          ...content,
                          prizePool: { ...content.prizePool, blocks: updated },
                        });
                      }}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                      Key Perks (Comma-separated)
                    </label>
                    <input
                      type="text"
                      value={(block.perks || []).join(', ')}
                      onChange={(e) => {
                        const updated = [...content.prizePool.blocks];
                        const perks = e.target.value
                          .split(',')
                          .map((p) => p.trim())
                          .filter(Boolean);
                        updated[idx] = { ...updated[idx], perks };
                        setContent({
                          ...content,
                          prizePool: { ...content.prizePool, blocks: updated },
                        });
                      }}
                      placeholder="Trophy, Mentorship Hours, Showcase Stall"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-700 font-medium"
                    />
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 4: NEXT WAVE STARTUPS WALL CMS                                        */}
        {/* ========================================================================= */}
        {activeTab === 'startups' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 p-4 sm:p-6 rounded-2xl bg-white border border-slate-200 shadow-sm">
              <div>
                <h2 className="text-lg sm:text-xl font-black font-display text-brand-navy">
                  &quot;The Next Wave Is Already Building&quot; Showcase Wall
                </h2>
                <p className="text-xs text-slate-500 mt-0.5 sm:mt-1">
                  Add, edit, or upload logos for startups displayed in the infinite marquee wall on the public homepage.
                </p>
              </div>

              <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                <Button
                  onClick={() => {
                    const newStartup: FeaturedStartup = {
                      id: `startup-${Date.now()}`,
                      name: 'InnovateAI',
                      tag: 'AI • Prototype',
                      logoUrl: '',
                    };
                    const updated = [...content.featuredStartups, newStartup];
                    setContent({
                      ...content,
                      featuredStartups: updated,
                    });
                    saveContentSection(
                      { featuredStartups: updated },
                      'New startup added to showcase wall!'
                    );
                  }}
                  variant="secondary"
                  size="sm"
                  icon={Plus}
                  className="text-xs uppercase tracking-wider"
                >
                  Add Startup
                </Button>

                <Button
                  onClick={() =>
                    saveContentSection(
                      { featuredStartups: content.featuredStartups },
                      'Startups showcase wall updated successfully!'
                    )
                  }
                  variant="primary"
                  size="sm"
                  icon={Save}
                  className="text-xs uppercase tracking-wider"
                  isLoading={isSaving}
                >
                  Save Startups
                </Button>
              </div>
            </div>

            {/* Startups Grid */}
            <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
              {content.featuredStartups.map((st, idx) => (
                <Card key={st.id || idx} className="p-4 bg-white border-slate-200 shadow-md space-y-3 relative group">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold text-slate-400">
                      #{idx + 1}
                    </span>
                    <button
                      onClick={() => {
                        const filtered = content.featuredStartups.filter((_, i) => i !== idx);
                        setContent({ ...content, featuredStartups: filtered });
                        saveContentSection(
                          { featuredStartups: filtered },
                          `"${st.name || 'Startup'}" deleted from showcase wall!`
                        );
                      }}
                      className="text-slate-400 hover:text-red-600 transition-colors p-1"
                      title="Remove startup"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Logo Preview & Upload */}
                  <div className="flex items-center gap-3">
                    <div className="relative w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center overflow-hidden flex-shrink-0">
                      {st.logoUrl ? (
                        <img src={st.logoUrl} alt={st.name} className="w-full h-full object-contain p-1" />
                      ) : (
                        <span className="font-black text-sm text-brand-navy">{st.name.charAt(0)}</span>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <label className="cursor-pointer text-[11px] font-bold text-brand-blue hover:underline flex items-center gap-1">
                        <Upload className="w-3 h-3" />
                        <span>{st.logoUrl ? 'Change Logo' : 'Upload Logo'}</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              openCropperForFile(
                                file,
                                '1:1',
                                `Crop ${st.name || 'Startup'} Logo`,
                                (uploadedUrl) => {
                                  const updated = [...content.featuredStartups];
                                  updated[idx] = { ...updated[idx], logoUrl: uploadedUrl };
                                  setContent({ ...content, featuredStartups: updated });
                                  saveContentSection(
                                    { featuredStartups: updated },
                                    `Logo updated for "${st.name || 'Startup'}"!`
                                  );
                                }
                              );
                            }
                            e.target.value = '';
                          }}
                        />
                      </label>

                      {st.logoUrl && (
                        <button
                          type="button"
                          onClick={() => {
                            openCropperForUrl(
                              st.logoUrl!,
                              '1:1',
                              `Crop ${st.name || 'Startup'} Logo`,
                              (uploadedUrl) => {
                                const updated = [...content.featuredStartups];
                                updated[idx] = { ...updated[idx], logoUrl: uploadedUrl };
                                setContent({ ...content, featuredStartups: updated });
                                saveContentSection(
                                  { featuredStartups: updated },
                                  `Logo cropped for "${st.name || 'Startup'}"!`
                                );
                              }
                            );
                          }}
                          className="text-[10px] font-bold text-slate-500 hover:text-brand-orange flex items-center gap-1 px-2 py-1 rounded-lg border border-slate-200 hover:border-brand-orange/40 bg-white transition"
                          title="Crop and center logo"
                        >
                          <Crop className="w-3 h-3" />
                          <span>Crop</span>
                        </button>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                      Startup Name
                    </label>
                    <input
                      type="text"
                      value={st.name}
                      onChange={(e) => {
                        const updated = [...content.featuredStartups];
                        updated[idx] = { ...updated[idx], name: e.target.value };
                        setContent({ ...content, featuredStartups: updated });
                      }}
                      onBlur={() => {
                        saveContentSection(
                          { featuredStartups: content.featuredStartups },
                          'Startup name updated!'
                        );
                      }}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-bold text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                      Category &amp; Stage Tag
                    </label>
                    <input
                      type="text"
                      value={st.tag}
                      onChange={(e) => {
                        const updated = [...content.featuredStartups];
                        updated[idx] = { ...updated[idx], tag: e.target.value };
                        setContent({ ...content, featuredStartups: updated });
                      }}
                      onBlur={() => {
                        saveContentSection(
                          { featuredStartups: content.featuredStartups },
                          'Startup category tag updated!'
                        );
                      }}
                      placeholder="e.g. Fintech • MVP"
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-mono text-slate-600"
                    />
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 5: FAQs CMS                                                           */}
        {/* ========================================================================= */}
        {activeTab === 'faqs' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 p-4 sm:p-6 rounded-2xl bg-white border border-slate-200 shadow-sm">
              <div>
                <h2 className="text-lg sm:text-xl font-black font-display text-brand-navy">
                  Frequently Asked Questions (FAQ) Manager
                </h2>
                <p className="text-xs text-slate-500 mt-0.5 sm:mt-1">
                  Add new questions and answers, or edit existing ones. Changes immediately update on the public FAQ accordion.
                </p>
              </div>

              <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                <Button
                  onClick={() => {
                    const newFaq: FAQItem = {
                      id: `faq-${Date.now()}`,
                      question: 'New Frequently Asked Question?',
                      answer: 'Enter the clear and concise answer here.',
                    };
                    setContent({
                      ...content,
                      faqs: [...content.faqs, newFaq],
                    });
                  }}
                  variant="secondary"
                  size="sm"
                  icon={Plus}
                  className="text-xs uppercase tracking-wider"
                >
                  Add FAQ
                </Button>

                <Button
                  onClick={() =>
                    saveContentSection(
                      { faqs: content.faqs },
                      'Frequently Asked Questions saved successfully!'
                    )
                  }
                  variant="primary"
                  size="sm"
                  icon={Save}
                  className="text-xs uppercase tracking-wider"
                  isLoading={isSaving}
                >
                  Save FAQs
                </Button>
              </div>
            </div>

            {/* FAQs List */}
            <div className="space-y-4">
              {content.faqs.map((faq, idx) => (
                <Card key={faq.id || idx} className="p-5 bg-white border-slate-200 shadow-sm space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <span className="text-xs font-mono font-bold text-brand-blue uppercase tracking-widest">
                      FAQ #{idx + 1}
                    </span>
                    <button
                      onClick={() => {
                        const filtered = content.faqs.filter((_, i) => i !== idx);
                        setContent({ ...content, faqs: filtered });
                      }}
                      className="text-slate-400 hover:text-red-600 transition-colors p-1"
                      title="Delete question"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                      Question
                    </label>
                    <input
                      type="text"
                      value={faq.question}
                      onChange={(e) => {
                        const updated = [...content.faqs];
                        updated[idx] = { ...updated[idx], question: e.target.value };
                        setContent({ ...content, faqs: updated });
                      }}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm font-bold text-slate-900 focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                      Answer
                    </label>
                    <textarea
                      rows={3}
                      value={faq.answer}
                      onChange={(e) => {
                        const updated = [...content.faqs];
                        updated[idx] = { ...updated[idx], answer: e.target.value };
                        setContent({ ...content, faqs: updated });
                      }}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-800 leading-relaxed focus:bg-white"
                    />
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Application Detail Modal */}
      {selectedLead && (
        <Modal
          isOpen={isDetailOpen}
          onClose={() => setIsDetailOpen(false)}
          title={`Application Details — ${selectedLead.startup_name}`}
          subtitle={`Reference: ${selectedLead.public_reference}`}
          maxWidth="2xl"
        >
          <div className="space-y-6 text-left">
            <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200">
              {selectedLead.startup_logo_url ? (
                <img
                  src={selectedLead.startup_logo_url}
                  alt={selectedLead.startup_name}
                  className="w-16 h-16 rounded-xl object-contain bg-white p-1 border border-slate-200 shadow-sm"
                />
              ) : (
                <div className="w-16 h-16 rounded-xl bg-brand-navy text-white font-black text-2xl flex items-center justify-center">
                  {selectedLead.startup_name.charAt(0)}
                </div>
              )}
              <div>
                <h3 className="text-xl font-black font-display text-brand-navy">
                  {selectedLead.startup_name}
                </h3>
                <p className="text-xs text-slate-500 font-mono">
                  Submitted: {selectedLead.created_at ? new Date(selectedLead.created_at).toLocaleString() : 'N/A'}
                </p>
                <div className="mt-1">
                  <Badge variant={selectedLead.lead_status === 'application_self_reported' ? 'emerald' : 'blue'} size="sm">
                    {selectedLead.lead_status}
                  </Badge>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-xl bg-white border border-slate-200 space-y-1">
                <div className="font-mono text-[10px] text-slate-400 uppercase font-bold">Team Lead Name</div>
                <div className="font-bold text-slate-900 text-sm">{selectedLead.team_lead_name}</div>
              </div>

              <div className="p-4 rounded-xl bg-white border border-slate-200 space-y-1">
                <div className="font-mono text-[10px] text-slate-400 uppercase font-bold">Email Address</div>
                <div className="font-bold text-slate-900">{selectedLead.email}</div>
              </div>

              <div className="p-4 rounded-xl bg-white border border-slate-200 space-y-1">
                <div className="font-mono text-[10px] text-slate-400 uppercase font-bold">Phone / WhatsApp</div>
                <div className="font-bold text-slate-900 flex items-center gap-2">
                  <span>{selectedLead.phone}</span>
                  {selectedLead.phone.replace(/[^0-9]/g, '') && (
                    <a
                      href={`https://wa.me/${selectedLead.phone.replace(/[^0-9]/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-emerald-600 font-bold hover:underline inline-flex items-center gap-1 text-[10px]"
                    >
                      <MessageSquare className="w-3 h-3" /> Chat on WhatsApp
                    </a>
                  )}
                </div>
              </div>

              <div className="p-4 rounded-xl bg-white border border-slate-200 space-y-1">
                <div className="font-mono text-[10px] text-slate-400 uppercase font-bold">Institution & City</div>
                <div className="font-bold text-slate-900">{selectedLead.institution} ({selectedLead.city})</div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
              <div className="font-bold text-slate-800">Consent Flags</div>
              <div className="flex items-center gap-2 text-slate-700">
                <CheckCircle2 className={`w-4 h-4 ${selectedLead.contact_consent ? 'text-emerald-600' : 'text-slate-300'}`} />
                <span>WhatsApp / Direct Contact Consent: <strong>{selectedLead.contact_consent ? 'Granted' : 'Denied'}</strong></span>
              </div>
              <div className="flex items-center gap-2 text-slate-700">
                <CheckCircle2 className={`w-4 h-4 ${selectedLead.promotional_consent ? 'text-brand-orange' : 'text-slate-300'}`} />
                <span>Promotional Wall & Media Consent: <strong>{selectedLead.promotional_consent ? 'Granted' : 'Denied'}</strong></span>
              </div>
            </div>

            <div className="pt-3 flex flex-wrap justify-between items-center gap-3 border-t border-slate-100">
              <Link
                href={`/application/${selectedLead.public_reference}`}
                target="_blank"
                className="text-xs font-bold text-brand-blue hover:underline inline-flex items-center gap-1.5"
              >
                <span>View Applicant Status & Poster Card</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>

              <button
                type="button"
                onClick={() => setDeleteConfirmRef(selectedLead.public_reference)}
                className="px-3 py-1.5 rounded-xl text-xs font-bold bg-rose-50 text-rose-600 hover:bg-rose-100 border border-rose-200 transition-colors inline-flex items-center gap-1.5"
                title="Delete this application"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete Application</span>
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmRef && (
        <Modal
          isOpen={!!deleteConfirmRef}
          onClose={() => setDeleteConfirmRef(null)}
          title="Confirm Deletion"
          subtitle={`Are you sure you want to delete application ${deleteConfirmRef}?`}
          maxWidth="md"
          zIndex="z-[100]"
        >
          <div className="space-y-4 text-left">
            <p className="text-xs text-slate-600">
              This action will permanently remove this lead from the database. This cannot be undone.
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <Button onClick={() => setDeleteConfirmRef(null)} variant="secondary" size="sm">
                Cancel
              </Button>
              <Button
                onClick={() => handleDelete(deleteConfirmRef)}
                variant="primary"
                size="sm"
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                Delete Permanently
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Universal Image Cropper Modal */}
      <ImageCropperModal
        isOpen={cropperOpen}
        onClose={() => {
          setCropperOpen(false);
          setCropperImageSrc(null);
          setCropperCallback(null);
        }}
        imageSrc={cropperImageSrc}
        fileName={cropperFileName}
        defaultAspectRatio={cropperDefaultRatio}
        title={cropperTitle}
        onCropComplete={handleCropperComplete}
      />
    </div>
  );
}
