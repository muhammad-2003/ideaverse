'use client';

import { useState, useEffect } from 'react';
import { SiteContent } from '@/types/content';
import { defaultSiteContent } from '@/lib/content/defaultContent';

export function useSiteContent() {
  const [content, setContent] = useState<SiteContent>(defaultSiteContent);
  const [isLoading, setIsLoading] = useState(true);

  // Load from localStorage immediately on client mount
  useEffect(() => {
    try {
      const local = localStorage.getItem('ideaverse_site_content');
      if (local) {
        const parsed = JSON.parse(local);
        if (parsed) {
          setContent((prev) => ({ ...prev, ...parsed }));
        }
      }
    } catch (e) {
      console.warn('LocalStorage content read error:', e);
    }
  }, []);

  const fetchContent = async () => {
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
    } catch (e) {
      console.warn('Failed to load dynamic site content, using defaults/cached:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchContent();

    // Listen for live updates triggered by Admin CMS
    const handleUpdate = (e: Event) => {
      const customEvent = e as CustomEvent<SiteContent>;
      if (customEvent.detail) {
        setContent(customEvent.detail);
      } else {
        fetchContent();
      }
    };

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'ideaverse_site_content' && e.newValue) {
        try {
          setContent(JSON.parse(e.newValue));
        } catch (err) {}
      }
    };

    window.addEventListener('ideaverse_content_updated', handleUpdate);
    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('ideaverse_content_updated', handleUpdate);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  return { content, isLoading, refetch: fetchContent };
}
