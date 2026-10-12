export interface EvaluationCriterion {
  title: string;
  percentage: number;
  description: string;
}

export interface MarqueeFeature {
  number: number;
  title: string;
  description: string;
}

export interface EventConfig {
  name: string;
  subtitle: string;
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
  targetMetrics: {
    eventDays: number;
    startupsTargeted: string;
    maxTeamMembers: number;
    showcaseBooths: string;
  };
  schedule: {
    virtualPitching: {
      date: string;
      day: string;
      title: string;
      targetAudience: string;
      platform: string;
    };
    physicalPitching: {
      date: string;
      day: string;
      title: string;
      targetAudience: string;
      venue: string;
    };
    startupShowcase: {
      date: string;
      day: string;
      title: string;
      targetAudience: string;
      venue: string;
    };
  };
  fees: {
    iu: string;
    external: string;
    note: string;
  };
  targetParticipation: {
    iu: string;
    external: string;
    total: string;
  };
  evaluationCriteria: EvaluationCriterion[];
  marquee: {
    where: string;
    when: string;
    who: string;
    setup: string;
    features: MarqueeFeature[];
  };
  keyNotes: string[];
  leadership: {
    president: string;
    patron: string;
    organizers: string;
  };
  editionComparison: {
    v1: {
      name: string;
      parent: string;
      scope: string;
      reach: string;
      participants: string;
    };
    v2: {
      name: string;
      parent: string;
      scope: string;
      reach: string;
      participants: string;
    };
  };
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
  subtitle: "Startup Pitching & Showcase Competition",
  tagline: "Taking the startup stage from Karachi to all of Sindh",
  edition: "2.0",
  parentEvent: "Spectrum 2.0",
  organizer: "IU Entrepreneurship Society & IU Core",
  university: "Iqra University, Karachi",

  applicationsOpen: true,

  eventPeriod: "10 – 14 November 2026",
  exactDate: "10, 11, 14 November 2026",
  dateConfirmed: true,

  venue: "Iqra University Main Campus, Karachi",
  venueConfirmed: true,

  googleFormUrl: "https://docs.google.com/forms/d/e/1FAIpQLSc-placeholder-ideaverse-2026/viewform",
  instagramUrl: "https://www.instagram.com/entrepreneurshipsociety.iu/",
  linkedinUrl: "",
  contactEmail: "entrepreneurship.society@iqra.edu.pk",

  prizeMoneyConfirmed: false,
  prizePoolText: "Prize money for top finalists planned and subject to sponsorship & final budget",

  maxTeamSize: 4,

  targetMetrics: {
    eventDays: 3,
    startupsTargeted: "30-40",
    maxTeamMembers: 4,
    showcaseBooths: "10-15",
  },

  schedule: {
    virtualPitching: {
      date: "10 NOV",
      day: "TUE",
      title: "Virtual Pitching",
      targetAudience: "Startups from outside Karachi (within Sindh)",
      platform: "Online via Zoom / university-approved platform",
    },
    physicalPitching: {
      date: "11 NOV",
      day: "WED",
      title: "Physical Pitching",
      targetAudience: "Karachi-based and IU startups",
      venue: "In person at IU Main Campus (CEIF Hall targeted, to be confirmed)",
    },
    startupShowcase: {
      date: "14 NOV",
      day: "SAT",
      title: "Startup Showcase",
      targetAudience: "Top 10-15 startups from both virtual and physical rounds",
      venue: "IdeaVerse Marquee, IU Main Campus, Ground Floor",
    },
  },

  fees: {
    iu: "PKR 1,000",
    external: "PKR 2,000",
    note: "Fees are tentative, pending departmental approval. Early-bird and regular payment details are shared with shortlisted applicants.",
  },

  targetParticipation: {
    iu: "10-15 IU startups/teams",
    external: "20-25 external startups/teams (Karachi and other Sindh cities)",
    total: "30-40 startups in total (maximum 4 members per startup/team)",
  },

  evaluationCriteria: [
    {
      title: "Problem & Opportunity",
      percentage: 15,
      description: "Clarity of the pain point, market urgency, depth of user problem understanding, and value opportunity.",
    },
    {
      title: "Solution & Innovation",
      percentage: 15,
      description: "Uniqueness, competitive defensibility, technological ingenuity, and execution approach.",
    },
    {
      title: "Market Potential",
      percentage: 15,
      description: "Addressable market size (TAM/SAM/SOM), target customer segment clarity, and growth potential.",
    },
    {
      title: "Validation / Traction",
      percentage: 15,
      description: "Working prototype, MVP usage data, customer feedback, pilot testing, or early revenue signals.",
    },
    {
      title: "Business Model",
      percentage: 10,
      description: "Monetization clarity, unit economics, revenue streams, and long-term financial viability.",
    },
    {
      title: "Execution & Team",
      percentage: 10,
      description: "Domain capability, founder synergy, resourcefulness, and technical/commercial competence.",
    },
    {
      title: "Pitch & Presentation",
      percentage: 10,
      description: "Storytelling clarity, slide deck professionalism, communication quality, and Q&A handling.",
    },
    {
      title: "Overall Potential",
      percentage: 10,
      description: "Ecosystem scalability, investment attractiveness, and future trajectory beyond IdeaVerse.",
    },
  ],

  marquee: {
    where: "IU Main Campus, Ground Floor (full marquee area)",
    when: "Saturday 14 Nov 2026",
    who: "Top 10–15 startups from the virtual and physical rounds",
    setup: "Startup display spaces, event branding, tables and chairs",
    features: [
      {
        number: 1,
        title: "Entrance Arch",
        description: "Branded entrance archway welcoming guests with IdeaVerse 2.0 and IU Entrepreneurship Society branding.",
      },
      {
        number: 2,
        title: "Booth Backdrop Panels",
        description: "Dedicated branded backdrop panel for each of the top 10–15 exhibiting startups.",
      },
      {
        number: 3,
        title: "Front Exhibition Counters",
        description: "Custom front display counters carrying startup brand identity, products, and marketing material.",
      },
      {
        number: 4,
        title: "Open Visitor Walkway",
        description: "Spacious central walkway for thousands of campus visitors, industry leaders, judges, and potential investors.",
      },
    ],
  },

  keyNotes: [
    "No travel or accommodation support for out-of-Karachi participants; showcase startups arrange their own.",
    "Final venue allocation and marquee layout confirmed before the event.",
    "Registration fees are tentative, pending departmental approval.",
    "One unified judging framework: location decides the pitching format only; every startup competes in one unified category.",
    "Days between 11 and 14 Nov are used to evaluate pitches and select the top 10–15 showcase startups.",
  ],

  leadership: {
    president: "Muhammad Affan Siddiqui",
    patron: "Mr. Umair",
    organizers: "IU Entrepreneurship Society & IU Core under Spectrum 2.0",
  },

  editionComparison: {
    v1: {
      name: "IdeaVerse 1.0",
      parent: "Spectrum 2025",
      scope: "Karachi Only",
      reach: "40+ registrations and 25 startups",
      participants: "Participants from IU, IBA, Bahria, and Sir Syed; industry experts involved",
    },
    v2: {
      name: "IdeaVerse 2.0",
      parent: "Spectrum 2.0",
      scope: "All of Sindh",
      reach: "30–40 startups targeted across Sindh",
      participants: "Virtual pitching for out-of-Karachi teams; physical pitching at Iqra University; Top 10–15 startups in the Marquee Showcase",
    },
  },

  eligibleStages: [
    {
      id: "prototype",
      title: "Prototype",
      description: "Working proof-of-concept demonstrating functional feasibility and core technical architecture.",
      recommended: true,
    },
    {
      id: "mvp",
      title: "MVP / Product Ready",
      description: "Minimum viable product ready for testing, pilot deployment, or initial user onboarding.",
      recommended: true,
    },
    {
      id: "traction",
      title: "Early Traction",
      description: "Active user engagement, beta test feedback, customer retention data, or measurable adoption.",
      recommended: false,
    },
    {
      id: "revenue",
      title: "Revenue / Commercial Growth",
      description: "Early recurring customer contracts, commercial sales, or validated monetization pipelines.",
      recommended: false,
    },
  ],

  timelineSteps: [
    {
      step: "01",
      title: "Apply",
      description: "Initial application through the official portal and verified university Google Form.",
    },
    {
      step: "02",
      title: "Screening",
      description: "Team reviews applications and shortlists eligible startups meeting standard criteria.",
    },
    {
      step: "03",
      title: "Payment",
      description: "Shortlisted teams receive payment instructions (PKR 1,000 IU / PKR 2,000 External).",
    },
    {
      step: "04",
      title: "Confirmed",
      description: "Participation confirmed after payment verification; teams advance to official pitch rounds.",
    },
  ],

  faqs: [
    {
      question: "What is IdeaVerse 2.0 and how does it fit into Spectrum 2.0?",
      answer: "IdeaVerse 2.0 is the flagship startup pitching and showcase competition under Spectrum 2.0, organized by the IU Entrepreneurship Society and IU Core at Iqra University. It gives student-led and emerging startups a stage to pitch, meet entrepreneurs and industry professionals, and exhibit their ventures in a live showcase. This year, it opens up to all of Sindh.",
    },
    {
      question: "What are the key dates and format of the event?",
      answer: "IdeaVerse 2.0 spans three key days: (1) Tuesday 10 Nov: Virtual Pitching for out-of-Karachi teams across Sindh via Zoom; (2) Wednesday 11 Nov: Physical Pitching for Karachi and IU startups in person at IU Main Campus (CEIF Hall targeted); and (3) Saturday 14 Nov: Startup Showcase Marquee on the Ground Floor of IU Main Campus for the top 10-15 finalists.",
    },
    {
      question: "How does the unified judging framework work?",
      answer: "Every startup is evaluated against the same unified 8-criteria framework totaling 100%: Problem & Opportunity (15%), Solution & Innovation (15%), Market Potential (15%), Validation / Traction (15%), Business Model (10%), Execution & Team (10%), Pitch & Presentation (10%), and Overall Potential (10%). Location decides pitching format only, never the category. Startup stage is considered when assessing validation and traction.",
    },
    {
      question: "What are the registration fees?",
      answer: "For Iqra University teams, the registration fee is PKR 1,000 per startup/team. For external participants (Karachi and other cities across Sindh), the registration fee is PKR 2,000 per startup/team. Note: Registration fees are tentative, pending departmental approval. Early-bird and regular payment details are shared with shortlisted applicants.",
    },
    {
      question: "Is travel or accommodation provided for out-of-Karachi participants?",
      answer: "No travel or accommodation support is provided for out-of-Karachi participants. Non-Karachi startups pitch virtually online on 10 Nov. If selected for the top 10-15 physical Startup Showcase Marquee on 14 Nov, startups arrange their own travel and accommodation.",
    },
    {
      question: "What is the team size limit?",
      answer: "A team can consist of a maximum of 4 members per startup/team, including the Team Lead.",
    },
    {
      question: "What is the IdeaVerse Startup Showcase Marquee?",
      answer: "On Saturday 14 Nov, the top 10-15 startups selected from both virtual and physical rounds exhibit their ventures in the IdeaVerse Marquee on the Ground Floor of Iqra University Main Campus. Setup includes dedicated branded backdrop panels, front counters with startup names, and an open walkway for visitors, guests, and industry experts.",
    },
    {
      question: "Will there be prize money and awards?",
      answer: "Prize money for top finalists is planned and subject to sponsorship and final budget. No prize amount is publicly committed until confirmed. In addition, certificates and shields will be awarded to finalists, judges, and speakers.",
    },
    {
      question: "What is the selection and screening process?",
      answer: "Participation follows a 4-step pathway: (1) Apply through the official form; (2) Screening by the committee to shortlist eligible startups; (3) Shortlisted teams receive payment instructions; and (4) Participation is confirmed after payment verification.",
    },
    {
      question: "Can ideation-only concepts without prototypes apply?",
      answer: "Startups must have a demonstrable Prototype or MVP. Pure napkin/idea-stage concepts without a working prototype are not eligible. Startup maturity is factored into validation and traction assessment.",
    },
  ],
};
