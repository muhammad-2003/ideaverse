import { IdeaVerseLead } from '@/types/lead';
import { PosterData, PosterStage } from '@/types/poster';
import { eventConfig } from '@/config/event';

export function mapLeadToPosterData(lead: IdeaVerseLead): PosterData {
  const isConfirmed = lead.lead_status === 'confirmed';
  const stage: PosterStage = isConfirmed ? 'confirmed' : 'applicant';

  const headline = isConfirmed
    ? `WE'RE PITCHING AT ${eventConfig.name.toUpperCase()}`
    : `WE'VE APPLIED TO ${eventConfig.name.toUpperCase()}`;

  return {
    publicReference: lead.public_reference,
    startupName: lead.startup_name,
    teamLeadName: lead.team_lead_name,
    institution: lead.institution,
    city: lead.city,
    logoUrl: lead.startup_logo_url,
    stage,
    headline,
    eventEdition: eventConfig.edition,
    parentEvent: eventConfig.parentEvent,
    organizer: eventConfig.organizer,
    university: eventConfig.university,
    eventPeriod: eventConfig.eventPeriod,
  };
}
