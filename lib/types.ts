export type Category = "creative" | "alist" | "partner";

export const DISCIPLINES = [
  "Music",
  "Film & TV",
  "Fashion",
  "Visual Art",
  "Photography",
  "Writing & Poetry",
  "Performance & Dance",
  "Culinary Arts",
  "Design & Architecture",
  "Other",
] as const;

export const COLLAB_TYPES = [
  "Live performance",
  "Panel / speaking",
  "Mentorship",
  "Brand partnership",
  "Judging / curation",
  "Other",
] as const;

/** The creative areas a partner can choose to back. */
export const PARTNER_FOCUS_AREAS = [
  "Music",
  "Visual Art & Sculpture",
  "Film & TV",
  "Fashion & Textiles",
  "Performance & Dance",
  "Photography",
  "Literature & Poetry",
  "Heritage & Cultural Tours",
  "Festivals & Live Events",
  "Creative Education & Training",
  "Across the whole creative industry",
] as const;

/** How a partner wants to support — not only money. */
export const PARTNER_SUPPORT_TYPES = [
  "Funding / sponsorship",
  "Equipment & materials",
  "Venue or studio space",
  "Media & marketing support",
  "Distribution & retail",
  "Mentorship & training",
  "Travel & logistics",
  "Technology & platforms",
  "Other",
] as const;

export const PARTNER_ORG_TYPES = [
  "Company / brand",
  "Foundation / NGO",
  "Government / agency",
  "Individual philanthropist",
  "Investor / fund",
  "Media organisation",
  "Educational institution",
  "Other",
] as const;

export interface BaseRegistration {
  category: Category;
  fullName: string;
  email: string;
  phone: string;
  city: string;
  country: string;
  discipline: string;
  portfolioLink: string;
  instagram: string;
  bio: string;
}

export interface CreativeRegistration extends BaseRegistration {
  category: "creative";
  yearsActive: string;
  following: string;
  goal: string;
}

export interface AListRegistration extends BaseRegistration {
  category: "alist";
  stageName: string;
  managementContact: string;
  achievements: string;
  ambassadorInterest: "yes" | "no" | "maybe";
  collabType: string;
}

/**
 * Partners aren't creatives — they're organisations and individuals backing
 * specific creative projects, so they get their own shape (and their own tab
 * in the Google Sheet).
 */
export interface PartnerRegistration {
  category: "partner";
  organisation: string;
  orgType: string;
  fullName: string; // contact person
  role: string;
  email: string;
  phone: string;
  city: string;
  country: string;
  website: string;
  focusAreas: string[];
  supportTypes: string[];
  budgetRange: string;
  projectInterest: string;
  message: string;
}

export type Registration =
  | CreativeRegistration
  | AListRegistration
  | PartnerRegistration;
