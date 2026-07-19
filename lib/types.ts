export type Category = "creative" | "alist";

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

export type Registration = CreativeRegistration | AListRegistration;
