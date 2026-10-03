export type OfficialFormStatus = 'not_opened' | 'opened' | 'self_reported_complete' | 'verified';

export type LeadStatus = 'new' | 'application_started' | 'application_self_reported' | 'shortlisted' | 'confirmed' | 'not_selected';

export interface IdeaVerseLead {
  id?: string;
  public_reference: string;
  startup_name: string;
  team_lead_name: string;
  email: string;
  phone: string;
  institution: string;
  city: string;
  startup_logo_url?: string | null;
  website_url?: string | null;
  applied_on_official_link?: string;
  official_link_clicked?: boolean;
  official_link_clicked_at?: string | null;
  contact_consent: boolean;
  promotional_consent: boolean;
  official_form_status: OfficialFormStatus;
  lead_status: LeadStatus;
  official_form_clicked_at?: string | null;
  official_form_self_reported_at?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface LeadFormInput {
  startup_name: string;
  team_lead_name: string;
  email: string;
  phone: string;
  institution: string;
  city: string;
  startup_logo_url?: string;
  website_url?: string;
  contact_consent: boolean;
  promotional_consent: boolean;
}
