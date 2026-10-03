import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';
import { IdeaVerseLead } from '@/types/lead';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

const isConfigured =
  supabaseUrl.length > 0 &&
  !supabaseUrl.includes('placeholder') &&
  supabaseAnonKey.length > 0 &&
  !supabaseAnonKey.includes('placeholder');

const supabase = isConfigured ? createClient(supabaseUrl, supabaseAnonKey) : null;

// Server-persistent JSON file for lead records
const DATA_FILE_PATH = path.join(process.cwd(), '.leads_data.json');

function readLeadsFile(): IdeaVerseLead[] {
  try {
    if (fs.existsSync(DATA_FILE_PATH)) {
      const content = fs.readFileSync(DATA_FILE_PATH, 'utf-8');
      const parsed = JSON.parse(content);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    }
  } catch (err) {
    console.error('Error reading leads file:', err);
  }
  return [];
}

function writeLeadsFile(leads: IdeaVerseLead[]) {
  try {
    fs.writeFileSync(DATA_FILE_PATH, JSON.stringify(leads, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing leads file:', err);
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const ref = searchParams.get('ref');

  // Try fetching from Supabase if configured
  if (supabase) {
    try {
      if (ref) {
        const { data } = await supabase
          .from('ideaverse_leads')
          .select('*')
          .eq('public_reference', ref)
          .single();

        if (data) {
          return NextResponse.json({ success: true, lead: data });
        }
      } else {
        const { data } = await supabase
          .from('ideaverse_leads')
          .select('*')
          .order('created_at', { ascending: false });

        if (data && data.length > 0) {
          return NextResponse.json({ success: true, leads: data });
        }
      }
    } catch (e) {
      console.warn('Supabase fetch warning, using file storage fallback');
    }
  }

  // File storage fallback
  const leads = readLeadsFile();

  if (ref) {
    const lead = leads.find((l) => l.public_reference === ref) || null;
    return NextResponse.json({ success: true, lead });
  }

  leads.sort(
    (a, b) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime()
  );

  return NextResponse.json(
    { success: true, leads },
    { headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate' } }
  );
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const now = new Date().toISOString();

    const public_reference =
      body.public_reference ||
      `iv_ref_${Math.random().toString(36).substring(2, 10)}`;

    const isClicked = Boolean(
      body.official_link_clicked || body.applied_on_official_link === 'Yes'
    );

    const newLead: IdeaVerseLead = {
      startup_name: body.startup_name || '',
      team_lead_name: body.team_lead_name || '',
      email: body.email || '',
      phone: body.phone || '',
      institution: body.institution || '',
      city: body.city || '',
      startup_logo_url: body.startup_logo_url || null,
      website_url: body.website_url || null,
      applied_on_official_link: body.applied_on_official_link || 'No',
      official_link_clicked: isClicked,
      official_form_status: isClicked ? 'opened' : 'not_opened',
      official_form_clicked_at: isClicked ? now : null,
      lead_status:
        body.applied_on_official_link === 'Yes'
          ? 'application_self_reported'
          : 'application_started',
      contact_consent: Boolean(body.contact_consent),
      promotional_consent: Boolean(body.promotional_consent),
      public_reference,
      created_at: body.created_at || now,
      updated_at: now,
    };

    // 1. Save to persistent JSON file on disk
    const currentLeads = readLeadsFile();
    const existingIndex = currentLeads.findIndex(
      (l) => l.public_reference === public_reference
    );

    if (existingIndex >= 0) {
      currentLeads[existingIndex] = { ...currentLeads[existingIndex], ...newLead };
    } else {
      currentLeads.unshift(newLead);
    }

    writeLeadsFile(currentLeads);

    // 2. Save to Supabase if configured
    if (supabase) {
      try {
        await supabase.from('ideaverse_leads').upsert([newLead]);
      } catch (e) {
        console.warn('Supabase upsert warning:', e);
      }
    }

    return NextResponse.json({ success: true, lead: newLead });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || 'Failed to save lead' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const ref = searchParams.get('ref');

    if (!ref) {
      return NextResponse.json({ success: false, error: 'Missing ref' }, { status: 400 });
    }

    const currentLeads = readLeadsFile();
    const filtered = currentLeads.filter((l) => l.public_reference !== ref);
    writeLeadsFile(filtered);

    if (supabase) {
      try {
        await supabase.from('ideaverse_leads').delete().eq('public_reference', ref);
      } catch (e) {
        console.warn('Supabase delete warning:', e);
      }
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || 'Failed to delete lead' },
      { status: 500 }
    );
  }
}
