export enum Tab {
  FAQ = 'faq',
  Email = 'email',
  Social = 'social',
  Image = 'image',
  Feedback = 'feedback',
}

export interface FAQ {
  question: string;
  answer: string;
}

export interface MarketingEmail {
  subject: string;
  body: string;
}

export interface SocialMediaPost {
  platform: string;
  copy: string;
  visual: string;
}

export interface FeedbackSummary {
  positiveThemes: string[];
  areasForImprovement: string[];
  actionableSuggestions: string[];
}