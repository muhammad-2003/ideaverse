export type PosterStage = 'applicant' | 'confirmed';

export type PosterFormat = 'feed' | 'story'; // 1080x1350 vs 1080x1920

export interface PosterData {
  publicReference: string;
  startupName: string;
  teamLeadName: string;
  institution: string;
  city: string;
  logoUrl?: string | null;
  stage: PosterStage;
  headline: string; // e.g., "WE'VE APPLIED TO IDEAVERSE 2.0" or "WE'RE PITCHING AT IDEAVERSE 2.0"
  eventEdition: string;
  parentEvent: string;
  organizer: string;
  university: string;
  eventPeriod: string;
}

export interface PosterTemplateProps {
  data: PosterData;
  format?: PosterFormat;
  className?: string;
}
