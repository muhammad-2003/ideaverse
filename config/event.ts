export interface EventConfig {
  name: string;
  tagline: string;
  edition: string;
  parentEvent: string;
  organizer: string;
  university: string;
  eventPeriod: string;
  exactDate: string | null;
  dateConfirmed: boolean;
  venue: string | null;
  venueConfirmed: boolean;
  applicationsOpen: boolean;
  googleFormUrl: string;
  instagramUrl: string;
  linkedinUrl?: string;
  contactEmail: string;
  prizeMoneyConfirmed: boolean;
  prizePoolText: string | null;
  maxTeamSize: number;
  eligibleStages: {
    id: string;
    title: string;
    description: string;
    recommended: boolean;
  }[];
  timelineSteps: {
    step: string;
    title: string;
    description: string;
  }[];
  faqs: {
    question: string;
    answer: string;
  }[];
}

export const eventConfig: EventConfig = {
  name: "IdeaVerse 2.0",
  tagline: "Where Ideas Become Ventures",
  edition: "2.0",
  parentEvent: "Spectrum 2.0",
  organizer: "IU Entrepreneurship Society",
  university: "Iqra University",

  applicationsOpen: true,

  eventPeriod: "Second Week of November 2026",
  exactDate: null,
  dateConfirmed: false,

  venue: "Iqra University Main Campus",
  venueConfirmed: false,

  googleFormUrl: "https://docs.google.com/forms/d/e/1FAIpQLSc-placeholder-ideaverse-2026/viewform",
  instagramUrl: "https://www.instagram.com/entrepreneurshipsociety.iu/",
  linkedinUrl: "",
  contactEmail: "entrepreneurship.society@iqra.edu.pk",

  prizeMoneyConfirmed: false,
  prizePoolText: null,

  maxTeamSize: 4,

  eligibleStages: [
    {
      id: "prototype",
      title: "Prototype",
      description: "Working proof-of-concept demonstrating core functionality.",
      recommended: true,
    },
    {
      id: "mvp",
      title: "MVP / Product Ready",
      description: "Minimum viable product ready for testing or early users.",
      recommended: true,
    },
    {
      id: "traction",
      title: "Early Traction",
      description: "Initial user base, active beta testers, or early metric feedback.",
      recommended: false,
    },
    {
      id: "revenue",
      title: "Revenue-Generating / Early Growth",
      description: "Active paying customers or early commercial monetization.",
      recommended: false,
    },
  ],

  timelineSteps: [
    {
      step: "01",
      title: "APPLY",
      description: "Submit basic startup details on our platform, then complete the official application form.",
    },
    {
      step: "02",
      title: "GET SHORTLISTED",
      description: "Applications undergo rigorous screening by the evaluation committee.",
    },
    {
      step: "03",
      title: "PITCH",
      description: "Shortlisted founders pitch live (Physical for Karachi & IU / Virtual for other Sindh cities).",
    },
    {
      step: "04",
      title: "GET EVALUATED",
      description: "Judges assess market size, innovation, business model, and execution capability.",
    },
    {
      step: "05",
      title: "SHOWCASE",
      description: "Top selected ventures advance to the exclusive Startup Showcase Marquee during Spectrum 2.0.",
    },
    {
      step: "06",
      title: "GET RECOGNIZED",
      description: "Winning startups receive official trophies, university endorsement, and ecosystem visibility.",
    },
  ],

  faqs: [
    {
      question: "Who can apply for IdeaVerse 2.0?",
      answer: "Student founders and emerging startups from Iqra University, Karachi, and cities across Sindh are eligible to apply.",
    },
    {
      question: "Can startups outside Iqra University participate?",
      answer: "Yes! IdeaVerse 2.0 welcomes eligible startups from any recognized institute or city in Sindh.",
    },
    {
      question: "Can teams outside Karachi participate?",
      answer: "Yes. Non-Karachi teams in Sindh participate via Virtual Pitching rounds. If selected, they may be invited to the physical Showcase Marquee.",
    },
    {
      question: "What is the maximum team size?",
      answer: "A team can consist of a maximum of 4 members including the Team Lead.",
    },
    {
      question: "What startup stage is required?",
      answer: "Startups must at minimum have a Prototype or MVP/Product Ready stage. Pure napkin/idea-stage concepts without a working prototype are not eligible.",
    },
    {
      question: "Does submitting an application mean I have been selected?",
      answer: "No. Submitting an application enters your startup into the screening phase. Shortlisted teams will be officially notified before pitching rounds.",
    },
    {
      question: "Will there be prize money?",
      answer: "Prize details and awards will be officially announced once final sponsorship packages are confirmed.",
    },
    {
      question: "When will shortlisted startups be contacted?",
      answer: "Dates for screening announcements will be shared with applicants via email and WhatsApp after applications close.",
    },
  ],
};
