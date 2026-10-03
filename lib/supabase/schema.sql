-- IdeaVerse 2.0 Database Schema for Supabase PostgreSQL
-- Run this script in your Supabase SQL Editor

CREATE TABLE IF NOT EXISTS public.ideaverse_leads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    public_reference TEXT UNIQUE NOT NULL,
    startup_name TEXT NOT NULL,
    team_lead_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    institution TEXT NOT NULL,
    city TEXT NOT NULL,
    startup_logo_url TEXT,
    website_url TEXT,
    contact_consent BOOLEAN DEFAULT TRUE NOT NULL,
    promotional_consent BOOLEAN DEFAULT FALSE NOT NULL,
    official_form_status TEXT DEFAULT 'not_opened' CHECK (official_form_status IN ('not_opened', 'opened', 'self_reported_complete', 'verified')),
    lead_status TEXT DEFAULT 'new' CHECK (lead_status IN ('new', 'application_started', 'application_self_reported', 'shortlisted', 'confirmed', 'not_selected')),
    official_form_clicked_at TIMESTAMPTZ,
    official_form_self_reported_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Public reference index for fast lookup
CREATE INDEX IF NOT EXISTS idx_ideaverse_leads_ref ON public.ideaverse_leads(public_reference);

-- Enable RLS
ALTER TABLE public.ideaverse_leads ENABLE ROW LEVEL SECURITY;

-- 1. Public Insertion Policy
CREATE POLICY "Public leads insertion" 
ON public.ideaverse_leads FOR INSERT 
TO anon WITH CHECK (true);

-- 2. Public Read Policy (Lookups via public reference)
CREATE POLICY "Public reference lookup" 
ON public.ideaverse_leads FOR SELECT 
TO anon USING (true);

-- 3. Public Update Policy (Self-reporting via public reference)
CREATE POLICY "Public status update" 
ON public.ideaverse_leads FOR UPDATE 
TO anon USING (true);

-- Create Storage Bucket for Startup Logos
INSERT INTO storage.buckets (id, name, public) 
VALUES ('startup-logos', 'startup-logos', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Public logo upload" 
ON storage.objects FOR INSERT 
TO anon WITH CHECK (bucket_id = 'startup-logos');

CREATE POLICY "Public logo read" 
ON storage.objects FOR SELECT 
TO anon USING (bucket_id = 'startup-logos');
