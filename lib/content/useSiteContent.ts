'use client';

import { useState, useEffect } from 'react';
import { SiteContent } from '@/types/content';
import { defaultSiteContent } from '@/lib/content/defaultContent';

export function useSiteContent() {
  const [content, setContent] = useState<SiteContent>(defaultSiteContent);
  const [isLoading, setIsLoading] = useState(true);

  const fetchContent = async () => {
    try {
      const res = await fetch('/api/content');
      if (res.ok) {
        const data = await res.json();
        if (data.content) {
          setContent(data.content);
        }
      }
    } catch (e) {
      console.warn('Failed to load dynamic site content, using defaults:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchContent();
  }, []);

  return { content, isLoading, refetch: fetchContent };
}
