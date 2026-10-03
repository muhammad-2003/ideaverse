import { createClient } from '@supabase/supabase-js';
import { IdeaVerseLead, OfficialFormStatus } from '@/types/lead';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

const isConfigured =
  supabaseUrl.length > 0 &&
  !supabaseUrl.includes('placeholder') &&
  supabaseAnonKey.length > 0 &&
  !supabaseAnonKey.includes('placeholder');

export const supabase = isConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Memory fallback store for local testing
const memoryLeads = new Map<string, IdeaVerseLead>();

// Client-side LocalStorage Persistence Helper
function getLocalLeads(): IdeaVerseLead[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem('ideaverse_local_leads');
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('LocalStorage read error:', e);
  }
  return [];
}

function saveLocalLeads(leads: IdeaVerseLead[]) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem('ideaverse_local_leads', JSON.stringify(leads));
  } catch (e) {
    console.error('LocalStorage write error:', e);
  }
}

export function generatePublicReference(): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let rand = '';
  for (let i = 0; i < 8; i++) {
    rand += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `iv_ref_${rand}`;
}

// Global raw click counter
let globalRawClickCount = 0;

export function recordGlobalFormClick(): number {
  globalRawClickCount += 1;
  return globalRawClickCount;
}

export function getGlobalFormClickCount(): number {
  return globalRawClickCount;
}

export async function createLead(
  input: Omit<IdeaVerseLead, 'public_reference' | 'official_form_status' | 'lead_status'>
): Promise<IdeaVerseLead> {
  const public_reference = generatePublicReference();
  const now = new Date().toISOString();

  const isClicked = Boolean(
    input.official_link_clicked || input.applied_on_official_link === 'Yes'
  );

  const newLead: IdeaVerseLead = {
    ...input,
    public_reference,
    official_link_clicked: isClicked,
    official_form_status: isClicked ? 'opened' : 'not_opened',
    official_form_clicked_at: isClicked ? now : null,
    lead_status: input.applied_on_official_link === 'Yes' ? 'application_self_reported' : 'application_started',
    created_at: now,
    updated_at: now,
  };

  // 1. Save locally in Memory & LocalStorage
  memoryLeads.set(public_reference, newLead);
  const localList = getLocalLeads();
  saveLocalLeads([newLead, ...localList.filter((l) => l.public_reference !== public_reference)]);

  // 2. Persist to Server API Endpoint (/api/leads)
  try {
    const res = await fetch('/api/leads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newLead),
    });

    if (res.ok) {
      const data = await res.json();
      if (data.lead) {
        memoryLeads.set(data.lead.public_reference, data.lead);
        return data.lead;
      }
    }
  } catch (err) {
    console.warn('API leads POST error, using local fallback:', err);
  }

  // 3. Fallback to Supabase if direct client call possible
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('ideaverse_leads')
        .insert([newLead])
        .select()
        .single();

      if (!error && data) {
        return data as IdeaVerseLead;
      }
    } catch (e) {
      console.warn('Supabase direct insert warning:', e);
    }
  }

  return newLead;
}

export async function getLeadByReference(ref: string): Promise<IdeaVerseLead | null> {
  // 1. Check local memory or localStorage first for instant response
  const memLead = memoryLeads.get(ref);
  if (memLead) return memLead;

  const localLeads = getLocalLeads();
  const localMatch = localLeads.find((l) => l.public_reference === ref);
  if (localMatch) {
    memoryLeads.set(ref, localMatch);
  }

  // 2. Query Server API
  try {
    const res = await fetch(`/api/leads?ref=${encodeURIComponent(ref)}`);
    if (res.ok) {
      const json = await res.json();
      if (json.lead) {
        memoryLeads.set(ref, json.lead);
        return json.lead;
      }
    }
  } catch (e) {
    console.warn('API get lead error:', e);
  }

  // 3. Direct Supabase Query
  if (supabase) {
    try {
      const { data } = await supabase
        .from('ideaverse_leads')
        .select('*')
        .eq('public_reference', ref)
        .single();

      if (data) return data as IdeaVerseLead;
    } catch (e) {}
  }

  return localMatch || null;
}

export async function updateOfficialFormStatus(
  ref: string,
  status: OfficialFormStatus
): Promise<IdeaVerseLead | null> {
  const existing = await getLeadByReference(ref);
  if (!existing) return null;

  const now = new Date().toISOString();
  const updated: IdeaVerseLead = {
    ...existing,
    official_form_status: status,
    updated_at: now,
  };

  if (status === 'opened') {
    updated.official_form_clicked_at = now;
  } else if (status === 'self_reported_complete') {
    updated.official_form_self_reported_at = now;
    updated.lead_status = 'application_self_reported';
  }

  memoryLeads.set(ref, updated);
  const localLeads = getLocalLeads();
  saveLocalLeads(localLeads.map((l) => (l.public_reference === ref ? updated : l)));

  try {
    await fetch('/api/leads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updated),
    });
  } catch (e) {}

  return updated;
}

export async function getAllLeads(): Promise<IdeaVerseLead[]> {
  let combinedLeads: IdeaVerseLead[] = [];

  // 1. Fetch from Server API with cache-busting
  try {
    const res = await fetch(`/api/leads?_t=${Date.now()}`, { cache: 'no-store' });
    if (res.ok) {
      const json = await res.json();
      if (Array.isArray(json.leads)) {
        combinedLeads = json.leads;
      }
    }
  } catch (e) {
    console.warn('API getAllLeads error:', e);
  }

  // 2. Merge with client LocalStorage & Memory
  const localList = getLocalLeads();
  const leadMap = new Map<string, IdeaVerseLead>();

  // Add server leads
  combinedLeads.forEach((l) => leadMap.set(l.public_reference, l));

  // Add local storage leads if missing on server
  localList.forEach((l) => {
    if (!leadMap.has(l.public_reference)) {
      leadMap.set(l.public_reference, l);
    }
  });

  // Add memory leads if missing
  memoryLeads.forEach((l, ref) => {
    if (!leadMap.has(ref)) {
      leadMap.set(ref, l);
    }
  });

  // Filter out any explicitly deleted lead refs
  try {
    if (typeof window !== 'undefined') {
      const rawDeleted = localStorage.getItem('ideaverse_deleted_lead_refs');
      if (rawDeleted) {
        const deletedArr: string[] = JSON.parse(rawDeleted);
        deletedArr.forEach((r) => leadMap.delete(r));
      }
    }
  } catch (e) {}

  const finalLeads = Array.from(leadMap.values());
  finalLeads.sort(
    (a, b) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime()
  );

  return finalLeads;
}

export async function deleteLead(ref: string): Promise<boolean> {
  memoryLeads.delete(ref);
  const localLeads = getLocalLeads();
  saveLocalLeads(localLeads.filter((l) => l.public_reference !== ref));

  try {
    if (typeof window !== 'undefined') {
      const rawDeleted = localStorage.getItem('ideaverse_deleted_lead_refs') || '[]';
      const deletedArr: string[] = JSON.parse(rawDeleted);
      if (!deletedArr.includes(ref)) {
        deletedArr.push(ref);
        localStorage.setItem('ideaverse_deleted_lead_refs', JSON.stringify(deletedArr));
      }
    }
  } catch (e) {}

  try {
    const res = await fetch(`/api/leads?ref=${encodeURIComponent(ref)}`, {
      method: 'DELETE',
    });
    if (res.ok) return true;
  } catch (e) {}

  return true;
}
