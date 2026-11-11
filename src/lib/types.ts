// Translatable field
export interface T {
  en: string;
  sw: string;
}

// Image field
export interface ImageField {
  url: string;
  alt: T;
  width: number;
  height: number;
  sizes?: {
    sm?: string;
    md?: string;
    lg?: string;
  };
}

// SEO field
export interface SEO {
  meta_title?: T;
  meta_description?: T;
  share_image?: ImageField;
}

// Common fields
export interface BaseDocument {
  _id: string;
  created_at: string;
  updated_at: string;
  created_by?: string;
  updated_by?: string;
}

export interface PublishableDocument extends BaseDocument {
  status: 'draft' | 'published';
  sort: number;
  seo?: SEO;
  slug: string;
  slug_sw: string;
}

// Settings
export interface SocialLinks {
  facebook?: string;
  instagram?: string;
  x?: string;
  linkedin?: string;
  youtube?: string;
  tiktok?: string;
}

export interface HomeSection {
  key: string;
  enabled: boolean;
  sort: number;
}

export interface CTA {
  title: T;
  text: T;
  button_label: T;
  button_url: string;
}

export interface SiteSettings {
  company_name: string;
  slogan: T;
  logo?: ImageField;
  logo_dark?: ImageField;
  favicon?: ImageField;
  phones: string[];
  emails: string[];
  whatsapp_number?: string;
  working_hours: T;
  address: T;
  social: SocialLinks;
  footer_text: T;
  default_seo?: SEO;
  google_analytics_id?: string;
  notify_emails: string[];
  home_sections: HomeSection[];
  cta?: CTA;
}

// Hero Slides
export interface HeroSlide extends BaseDocument {
  image: ImageField;
  headline: T;
  text: T;
  button1_label?: T;
  button1_url?: string;
  button2_label?: T;
  button2_url?: string;
  sort: number;
  is_active: boolean;
}

// Stats
export interface Stat extends BaseDocument {
  label: T;
  number: number;
  suffix: string;
  icon?: string;
  sort: number;
}

// Features (Why Choose Us)
export interface Feature extends BaseDocument {
  title: T;
  text: T;
  icon?: string;
  sort: number;
}

// Work Steps (How We Work)
export interface WorkStep extends BaseDocument {
  title: T;
  text: T;
  icon?: string;
  sort: number;
}

// Pages
export interface PageValue {
  title?: T;
  intro?: T;
  body?: T;
  banner?: ImageField;
  seo?: SEO;
  // About page extras
  vision?: T;
  mission?: T;
  values?: Array<{ title: T; text: T; icon?: string }>;
  hse_statement?: T;
  story_image?: ImageField;
  profile_pdf?: string;
}

// Team Members
export interface TeamMember extends BaseDocument {
  name: string;
  position: T;
  bio: T;
  photo?: ImageField;
  sort: number;
  is_active: boolean;
}

// Certifications
export interface Certification extends BaseDocument {
  name: T;
  issuer: string;
  number?: string;
  logo?: ImageField;
  pdf?: string;
  sort: number;
}

// Service Categories
export interface ServiceCategory extends BaseDocument {
  name: T;
  slug: string;
  icon?: string;
  colour?: string;
  sort: number;
}

// Services
export interface Service extends PublishableDocument {
  category_id?: string;
  category?: ServiceCategory;
  title: T;
  icon?: string;
  cover?: ImageField;
  summary: T;
  body?: T;
  included?: T[];
  gallery?: ImageField[];
  faqs?: Array<{ q: T; a: T }>;
  is_featured: boolean;
}

// Projects
export interface Project extends PublishableDocument {
  category_id?: string;
  category?: ServiceCategory;
  title: T;
  client_name?: string;
  location?: string;
  region?: string;
  start_date?: string;
  end_date?: string;
  value_tzs?: number;
  hide_value: boolean;
  project_status: 'ongoing' | 'completed';
  summary: T;
  scope?: T;
  outcome?: T;
  cover?: ImageField;
  gallery?: ImageField[];
  before_after?: Array<{
    before: ImageField;
    after: ImageField;
    caption?: T;
  }>;
  video_url?: string;
  is_featured: boolean;
  related_service_ids?: string[];
}

// Training Programmes
export interface TrainingProgramme extends PublishableDocument {
  title: T;
  cover?: ImageField;
  summary: T;
  audience?: T;
  requirements?: T;
  outline?: T;
  duration: T;
  mode: 'classroom' | 'field' | 'online' | 'blended';
  fee_tzs: number;
  certificate?: T;
  venue?: T;
  is_open: boolean;
  next_intake?: TrainingIntake;
  intakes?: TrainingIntake[];
}

// Training Intakes
export interface TrainingIntake extends BaseDocument {
  programme_id: string;
  start_date: string;
  end_date: string;
  venue: T;
  seats: number;
  status: 'open' | 'closed' | 'full';
}

// Training Steps
export interface TrainingStep extends BaseDocument {
  number: number;
  title: T;
  text: T;
  icon?: string;
}

// Clients
export interface Client extends BaseDocument {
  name: string;
  logo?: ImageField;
  type: 'government' | 'private' | 'ngo';
  url?: string;
  is_featured: boolean;
  sort: number;
}

// Testimonials
export interface Testimonial extends BaseDocument {
  name: string;
  position: T;
  organisation?: string;
  photo?: ImageField;
  quote: T;
  rating: number;
  sort: number;
  is_active: boolean;
}

// Posts
export interface Post extends PublishableDocument {
  category: 'news' | 'announcement' | 'event' | 'tender';
  title: T;
  cover?: ImageField;
  excerpt: T;
  body: T;
  published_at?: string;
  is_featured: boolean;
}

// Gallery
export interface GalleryItem {
  type: 'photo' | 'video';
  image?: ImageField;
  video_url?: string;
  caption?: T;
}

export interface GalleryAlbum extends PublishableDocument {
  title: T;
  category: 'projects' | 'training' | 'events' | 'team';
  cover?: ImageField;
  items?: GalleryItem[];
}

// FAQs
export interface FAQ extends BaseDocument {
  category: 'general' | 'electricity' | 'water' | 'training';
  question: T;
  answer: T;
  sort: number;
  is_active: boolean;
}

// Offices
export interface Office extends BaseDocument {
  name: T;
  address: T;
  phone?: string;
  email?: string;
  hours?: T;
  lat?: number;
  lng?: number;
  is_head_office: boolean;
  sort: number;
}

// Downloads
export interface Download extends BaseDocument {
  title: T;
  file: string;
  category?: string;
  sort: number;
}

// Inbox types
export interface ServiceRequest extends BaseDocument {
  name: string;
  phone: string;
  email?: string;
  organisation?: string;
  service_id?: string;
  region?: string;
  district?: string;
  address?: string;
  description: string;
  contact_method: 'phone' | 'whatsapp' | 'email';
  photo?: string;
  status: 'new' | 'contacted' | 'quoted' | 'won' | 'lost';
  notes: Array<{ text: string; by: string; at: string }>;
  consent: boolean;
  ip?: string;
}

export interface TrainingApplication extends BaseDocument {
  name: string;
  phone: string;
  email?: string;
  gender?: string;
  region?: string;
  education_level?: string;
  programme_id?: string;
  intake_id?: string;
  cv?: string;
  status: 'new' | 'shortlisted' | 'accepted' | 'rejected';
  notes: Array<{ text: string; by: string; at: string }>;
  consent: boolean;
  ip?: string;
}

export interface ContactMessage extends BaseDocument {
  name: string;
  phone?: string;
  email: string;
  subject?: string;
  message: string;
  status: 'new' | 'read' | 'replied';
  consent: boolean;
  ip?: string;
}

// Users
export type UserRole = 'super_admin' | 'editor' | 'writer' | 'inbox_officer';

export interface User extends BaseDocument {
  name: string;
  email: string;
  role: UserRole;
  is_active: boolean;
  failed_logins?: number;
  locked_until?: string;
  last_login?: string;
}

// Activity Log
export interface ActivityLog extends BaseDocument {
  user_id: string;
  user_name: string;
  action: 'create' | 'update' | 'delete' | 'publish' | 'unpublish' | 'login';
  collection: string;
  item_id?: string;
  item_label?: string;
  at: string;
}

// API list response
export interface ListResponse<T> {
  items: T[];
  total: number;
  page: number;
  pages: number;
}

// Home page response
export interface HomeData {
  hero_slides?: HeroSlide[];
  stats?: Stat[];
  about?: PageValue;
  service_categories?: ServiceCategory[];
  featured_services?: Service[];
  features?: Feature[];
  work_steps?: WorkStep[];
  featured_projects?: Project[];
  training_highlight?: TrainingProgramme;
  clients?: Client[];
  testimonials?: Testimonial[];
  latest_posts?: Post[];
  cta?: CTA;
  settings?: SiteSettings;
}

// Dashboard response
export interface DashboardData {
  counts: {
    service_requests: number;
    training_applications: number;
    contact_messages: number;
  };
  latest_service_requests: ServiceRequest[];
  latest_training_applications: TrainingApplication[];
  latest_messages: ContactMessage[];
}
