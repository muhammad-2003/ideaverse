import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { defaultSiteContent } from '@/lib/content/defaultContent';
import { SiteContent } from '@/types/content';

const CONTENT_FILE_PATH = path.join(process.cwd(), '.site_content.json');

let memoryContent: SiteContent | null = null;

function readSiteContent(): SiteContent {
  if (memoryContent) {
    return memoryContent;
  }

  try {
    if (fs.existsSync(CONTENT_FILE_PATH)) {
      const data = fs.readFileSync(CONTENT_FILE_PATH, 'utf-8');
      const parsed = JSON.parse(data);
      const merged = {
        ...defaultSiteContent,
        ...parsed,
        previousEdition: Array.isArray(parsed.previousEdition)
          ? parsed.previousEdition
          : defaultSiteContent.previousEdition,
        prizePool: parsed.prizePool
          ? { ...defaultSiteContent.prizePool, ...parsed.prizePool }
          : defaultSiteContent.prizePool,
        featuredStartups: Array.isArray(parsed.featuredStartups)
          ? parsed.featuredStartups
          : defaultSiteContent.featuredStartups,
        faqs: Array.isArray(parsed.faqs) ? parsed.faqs : defaultSiteContent.faqs,
      };
      memoryContent = merged;
      return merged;
    }
  } catch (err) {
    console.error('Error reading site content file:', err);
  }

  // Initialize file if not found and writable
  try {
    fs.writeFileSync(
      CONTENT_FILE_PATH,
      JSON.stringify(defaultSiteContent, null, 2),
      'utf-8'
    );
  } catch (err) {
    // Non-fatal if filesystem is read-only
  }

  memoryContent = defaultSiteContent;
  return defaultSiteContent;
}

function saveSiteContent(content: SiteContent) {
  memoryContent = content;
  try {
    fs.writeFileSync(CONTENT_FILE_PATH, JSON.stringify(content, null, 2), 'utf-8');
  } catch (err) {
    console.warn('Filesystem write not permitted (serverless read-only), saved to memory store:', err);
  }
}

export async function GET() {
  const content = readSiteContent();
  return NextResponse.json({
    success: true,
    content,
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const current = readSiteContent();

    const updated: SiteContent = {
      ...current,
      ...body,
      previousEdition: Array.isArray(body.previousEdition)
        ? body.previousEdition
        : current.previousEdition,
      prizePool: body.prizePool ? { ...current.prizePool, ...body.prizePool } : current.prizePool,
      featuredStartups: Array.isArray(body.featuredStartups)
        ? body.featuredStartups
        : current.featuredStartups,
      faqs: Array.isArray(body.faqs) ? body.faqs : current.faqs,
    };

    saveSiteContent(updated);

    return NextResponse.json({
      success: true,
      content: updated,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || 'Failed to update content' },
      { status: 500 }
    );
  }
}
