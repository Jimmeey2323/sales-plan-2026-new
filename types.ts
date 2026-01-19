export interface FinancialTarget {
  location: string;
  category: string;
  targetUnits: number;
  estTicketSize: string;
  revenueTarget: string;
  logic: string;
}

export interface PackageDetail {
  name: string;
  hostId: number;
  price: number;
  validity: number;
  validityUnit: string;
  noOfSessions: number;
  freezeAttempts: number;
  freezeDuration: number;
  tax: number;
  priceAfterTax: number;
  discount?: number;
  location: string;
  studio: string;
}

export interface Offer {
  id?: string; // Optional for initial data, required for state
  title: string;
  type: 'New' | 'Hero' | 'Retention' | 'Flash' | 'Event' | 'Student' | 'Corporate' | 'Lapsed' | 'Frequency Builder' | 'Hero Long-Term' | 'Event-Led Conversion' | 'Gamified Lead Capture' | 'Retention + Annual Push' | 'Ultra-VIP' | 'High-Touch Program' | 'Hero Commitment' | 'Daily Flash Sale' | 'Premium Retention' | 'Referral Program' | 'Flash Sale Event' | 'Accountability Challenge' | 'Interactive Gamification' | 'Value-Add Bonus';
  description: string;
  pricing: string;
  priceMumbai?: number;
  priceBengaluru?: number;
  discountPercent?: number;
  finalPriceMumbai?: number;
  finalPriceBengaluru?: number;
  savings?: string;
  whyItWorks: string;
  targetUnits?: number | string;
  targetUnitsMumbai?: number | string;
  targetUnitsBengaluru?: number | string;
  cancelled?: boolean;
  promoteOnAds?: boolean; // Toggle for Meta/Google ads promotion
  marketingCollateral?: string; // Email, WhatsApp, in-studio promotions
  operationalSupport?: string; // Freebies, challenges, events
  // Detailed package information
  packages?: PackageDetail[]; // Detailed package breakdowns
  validityPeriod?: string; // e.g., "30 days", "90 days"
  validitySessions?: number; // Number of sessions if applicable
  freezeAttempts?: number; // Number of freeze attempts allowed
  freezeDuration?: number; // Total freeze duration in days
  revenueForecast?: {
    mumbai?: string;
    bengaluru?: string;
    total?: string;
  };
  // New collateral selection fields
  collateralChannels?: {
    whatsapp?: boolean;
    email?: boolean;
    inStudio?: boolean;
    website?: boolean;
    socialMedia?: boolean;
    metaAds?: boolean;
  };
  collateralTypes?: {
    tentCards?: boolean;
    imageCreative?: boolean;
    videoCreative?: boolean;
    easelStandee?: boolean;
    emailTemplate?: boolean;
    landingPage?: boolean;
    socialPosts?: boolean;
    storyTemplate?: boolean;
  };
}

export interface OperationalTask {
  week: string;
  focus: string;
  details: string;
}

export interface ExecutionWeek {
  week: string;
  focus: string;
  offers: string[]; // List of offer IDs to be promoted this week
  salesActivities: string[];
  marketingCollateral?: string;
  operationalSupport?: string;
}

export interface MarketingCollateral {
  id?: string;
  offer: string;
  collateralNeeded: string;
  type: string;
  medium: string;
  messaging: string;
  dueDate: string;
  notes?: string;
  ctaLinks?: string;
}

export interface CRMTimeline {
  id?: string;
  offer: string;
  content: string;
  sendDate?: string;
  adsStartDate?: string;
  adsEndDate?: string;
}

export interface Note {
  id: string;
  monthId: string;
  content: string;
  userName: string;
  createdAt: string; // ISO timestamp
}

export interface MonthData {
  id: string;
  name: string;
  theme: string;
  summary: string;
  revenueTargetTotal: string;
  financialTargets: FinancialTarget[];
  offers: Offer[];
  operations: OperationalTask[];
  executionPlan?: ExecutionWeek[]; // Sales-focused execution plan
  engagement?: { name: string; type: string; description: string }[];
  marketingCollateral?: MarketingCollateral[];
  crmTimeline?: CRMTimeline[];
  notes?: Note[];
  customSections?: { [key: string]: any[] }; // Support for custom sections
}
