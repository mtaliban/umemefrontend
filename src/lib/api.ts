import type {
  SiteSettings,
  HomeData,
  PageValue,
  TeamMember,
  Certification,
  Office,
  Download,
  ServiceCategory,
  Service,
  Project,
  TrainingProgramme,
  TrainingIntake,
  TrainingStep,
  Client,
  Testimonial,
  Post,
  GalleryAlbum,
  FAQ,
  HeroSlide,
  Stat,
  Feature,
  WorkStep,
  ServiceRequest,
  TrainingApplication,
  ContactMessage,
  User,
  ActivityLog,
  ListResponse,
  DashboardData,
} from './types';

type Lang = 'en' | 'sw';

function getBaseUrl(): string {
  if (typeof window === 'undefined') {
    // Server-side: use internal Docker URL
    return process.env.INTERNAL_API_URL ?? 'http://backend:8000';
  }
  // Browser-side: use relative path (Caddy proxies /api to backend)
  return '';
}

async function apiFetch<T>(
  path: string,
  options?: RequestInit,
  _revalidate?: number
): Promise<T> {
  const baseUrl = getBaseUrl();
  const url = `${baseUrl}${path}`;

  const response = await fetch(url, {
    ...options,
    cache: 'no-store',
    headers: {
      'Content-Type': 'application/json',
      ...(options?.headers ?? {}),
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: response.statusText }));
    throw new Error(error.detail ?? `HTTP ${response.status}`);
  }

  return response.json() as Promise<T>;
}

async function apiFetchMultipart<T>(
  path: string,
  formData: FormData,
  method = 'POST'
): Promise<T> {
  const baseUrl = getBaseUrl();
  const url = `${baseUrl}${path}`;

  const response = await fetch(url, {
    method,
    body: formData,
    credentials: 'include',
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: response.statusText }));
    throw new Error(error.detail ?? `HTTP ${response.status}`);
  }

  return response.json() as Promise<T>;
}

// ───────────────────────────────────────────────
// Public endpoints
// ───────────────────────────────────────────────

export async function getSettings(lang: Lang = 'en'): Promise<SiteSettings> {
  return apiFetch<SiteSettings>(`/api/public/settings?lang=${lang}`, {}, 300);
}

export async function getHomeData(lang: Lang = 'en'): Promise<HomeData> {
  return apiFetch<HomeData>(`/api/public/home?lang=${lang}`, {}, 300);
}

export async function getPage(key: string, lang: Lang = 'en'): Promise<PageValue> {
  return apiFetch<PageValue>(`/api/public/pages/${key}?lang=${lang}`, {}, 3600);
}

export async function getTeam(lang: Lang = 'en'): Promise<TeamMember[]> {
  return apiFetch<TeamMember[]>(`/api/public/team?lang=${lang}`, {}, 3600);
}

export async function getCertifications(lang: Lang = 'en'): Promise<Certification[]> {
  return apiFetch<Certification[]>(`/api/public/certifications?lang=${lang}`, {}, 3600);
}

export async function getOffices(lang: Lang = 'en'): Promise<Office[]> {
  return apiFetch<Office[]>(`/api/public/offices?lang=${lang}`, {}, 3600);
}

export async function getDownloads(lang: Lang = 'en'): Promise<Download[]> {
  return apiFetch<Download[]>(`/api/public/downloads?lang=${lang}`, {}, 3600);
}

export async function getServiceCategories(lang: Lang = 'en'): Promise<ServiceCategory[]> {
  return apiFetch<ServiceCategory[]>(`/api/public/service-categories?lang=${lang}`, {}, 3600);
}

export async function getServices(
  lang: Lang = 'en',
  category?: string
): Promise<Service[]> {
  const params = new URLSearchParams({ lang });
  if (category) params.set('category', category);
  return apiFetch<Service[]>(`/api/public/services?${params}`, {}, 3600);
}

export async function getService(slug: string, lang: Lang = 'en'): Promise<Service> {
  return apiFetch<Service>(`/api/public/services/${slug}?lang=${lang}`, {}, 3600);
}

export async function getProjects(
  lang: Lang = 'en',
  params?: { category?: string; status?: string; year?: string; page?: number }
): Promise<ListResponse<Project>> {
  const qs = new URLSearchParams({ lang });
  if (params?.category) qs.set('category', params.category);
  if (params?.status) qs.set('status', params.status);
  if (params?.year) qs.set('year', params.year);
  if (params?.page) qs.set('page', String(params.page));
  qs.set('limit', '9');
  return apiFetch<ListResponse<Project>>(`/api/public/projects?${qs}`, {}, 300);
}

export async function getProject(slug: string, lang: Lang = 'en'): Promise<Project> {
  return apiFetch<Project>(`/api/public/projects/${slug}?lang=${lang}`, {}, 3600);
}

export async function getTrainingProgrammes(lang: Lang = 'en'): Promise<TrainingProgramme[]> {
  return apiFetch<TrainingProgramme[]>(`/api/public/training?lang=${lang}`, {}, 3600);
}

export async function getTrainingProgramme(
  slug: string,
  lang: Lang = 'en'
): Promise<TrainingProgramme> {
  return apiFetch<TrainingProgramme>(`/api/public/training/${slug}?lang=${lang}`, {}, 3600);
}

export async function getTrainingSteps(lang: Lang = 'en'): Promise<TrainingStep[]> {
  return apiFetch<TrainingStep[]>(`/api/public/training-steps?lang=${lang}`, {}, 3600);
}

export async function getIntakes(lang: Lang = 'en'): Promise<TrainingIntake[]> {
  return apiFetch<TrainingIntake[]>(`/api/public/intakes?lang=${lang}`, {}, 3600);
}

export async function getClients(lang: Lang = 'en'): Promise<Client[]> {
  return apiFetch<Client[]>(`/api/public/clients?lang=${lang}`, {}, 3600);
}

export async function getTestimonials(lang: Lang = 'en'): Promise<Testimonial[]> {
  return apiFetch<Testimonial[]>(`/api/public/testimonials?lang=${lang}`, {}, 3600);
}

export async function getPosts(
  lang: Lang = 'en',
  params?: { category?: string; q?: string; page?: number }
): Promise<ListResponse<Post>> {
  const qs = new URLSearchParams({ lang });
  if (params?.category) qs.set('category', params.category);
  if (params?.q) qs.set('q', params.q);
  if (params?.page) qs.set('page', String(params.page));
  qs.set('limit', '9');
  return apiFetch<ListResponse<Post>>(`/api/public/posts?${qs}`, {}, 300);
}

export async function getPost(slug: string, lang: Lang = 'en'): Promise<Post> {
  return apiFetch<Post>(`/api/public/posts/${slug}?lang=${lang}`, {}, 3600);
}

export async function getGalleryAlbums(
  lang: Lang = 'en',
  category?: string
): Promise<GalleryAlbum[]> {
  const qs = new URLSearchParams({ lang });
  if (category) qs.set('category', category);
  return apiFetch<GalleryAlbum[]>(`/api/public/gallery?${qs}`, {}, 3600);
}

export async function getGalleryAlbum(slug: string, lang: Lang = 'en'): Promise<GalleryAlbum> {
  return apiFetch<GalleryAlbum>(`/api/public/gallery/${slug}?lang=${lang}`, {}, 3600);
}

export async function getFAQs(
  lang: Lang = 'en',
  category?: string
): Promise<FAQ[]> {
  const qs = new URLSearchParams({ lang });
  if (category) qs.set('category', category);
  return apiFetch<FAQ[]>(`/api/public/faqs?${qs}`, {}, 3600);
}

export async function getSitemap(): Promise<
  Array<{ slug: string; slug_sw: string; collection: string; updated_at: string }>
> {
  return apiFetch(`/api/public/sitemap`, {}, 3600);
}

// ───────────────────────────────────────────────
// Forms (browser only)
// ───────────────────────────────────────────────

export async function submitServiceRequest(formData: FormData): Promise<{ ok: boolean }> {
  return apiFetchMultipart<{ ok: boolean }>('/api/forms/service-request', formData);
}

export async function submitTrainingApplication(formData: FormData): Promise<{ ok: boolean }> {
  return apiFetchMultipart<{ ok: boolean }>('/api/forms/training-application', formData);
}

export async function submitContactForm(data: {
  name: string;
  phone?: string;
  email: string;
  subject?: string;
  message: string;
  consent: boolean;
  website?: string;
}): Promise<{ ok: boolean }> {
  return apiFetch<{ ok: boolean }>('/api/forms/contact', {
    method: 'POST',
    body: JSON.stringify(data),
    credentials: 'include',
  });
}

// ───────────────────────────────────────────────
// Admin Auth
// ───────────────────────────────────────────────

export async function adminLogin(
  email: string,
  password: string
): Promise<{ ok: boolean }> {
  return apiFetch<{ ok: boolean }>('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
    credentials: 'include',
  });
}

export async function adminLogout(): Promise<void> {
  await apiFetch('/api/auth/logout', { method: 'POST', credentials: 'include' });
}

export async function adminMe(): Promise<User> {
  return apiFetch<User>('/api/auth/me', { credentials: 'include' }, undefined);
}

export async function adminChangePassword(data: {
  current_password: string;
  new_password: string;
}): Promise<{ ok: boolean }> {
  return apiFetch<{ ok: boolean }>('/api/auth/change-password', {
    method: 'POST',
    body: JSON.stringify(data),
    credentials: 'include',
  });
}

// ───────────────────────────────────────────────
// Admin Generic CRUD helpers
// ───────────────────────────────────────────────

export async function adminList<T>(
  collection: string,
  params?: { q?: string; status?: string; page?: number; limit?: number }
): Promise<ListResponse<T>> {
  const qs = new URLSearchParams();
  if (params?.q) qs.set('q', params.q);
  if (params?.status) qs.set('status', params.status);
  if (params?.page) qs.set('page', String(params.page));
  if (params?.limit) qs.set('limit', String(params.limit));
  const query = qs.toString() ? `?${qs}` : '';
  return apiFetch<ListResponse<T>>(`/api/admin/${collection}${query}`, {
    credentials: 'include',
  });
}

export async function adminGet<T>(collection: string, id: string): Promise<T> {
  return apiFetch<T>(`/api/admin/${collection}/${id}`, { credentials: 'include' });
}

export async function adminCreate<T>(collection: string, data: unknown): Promise<T> {
  return apiFetch<T>(`/api/admin/${collection}`, {
    method: 'POST',
    body: JSON.stringify(data),
    credentials: 'include',
  });
}

export async function adminUpdate<T>(
  collection: string,
  id: string,
  data: unknown
): Promise<T> {
  return apiFetch<T>(`/api/admin/${collection}/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
    credentials: 'include',
  });
}

export async function adminDelete(collection: string, id: string): Promise<void> {
  await apiFetch(`/api/admin/${collection}/${id}`, {
    method: 'DELETE',
    credentials: 'include',
  });
}

export async function adminPublish(collection: string, id: string): Promise<void> {
  await apiFetch(`/api/admin/${collection}/${id}/publish`, {
    method: 'POST',
    credentials: 'include',
  });
}

export async function adminUnpublish(collection: string, id: string): Promise<void> {
  await apiFetch(`/api/admin/${collection}/${id}/unpublish`, {
    method: 'POST',
    credentials: 'include',
  });
}

export async function adminReorder(
  collection: string,
  ids: string[]
): Promise<void> {
  await apiFetch(`/api/admin/${collection}/reorder`, {
    method: 'POST',
    body: JSON.stringify(ids),
    credentials: 'include',
  });
}

// Admin Settings
export async function adminGetSettings(): Promise<SiteSettings> {
  return apiFetch<SiteSettings>('/api/admin/settings', { credentials: 'include' });
}

export async function adminUpdateSettings(data: Partial<SiteSettings>): Promise<SiteSettings> {
  return apiFetch<SiteSettings>('/api/admin/settings', {
    method: 'PUT',
    body: JSON.stringify(data),
    credentials: 'include',
  });
}

// Admin Dashboard
export async function adminGetDashboard(): Promise<DashboardData> {
  return apiFetch<DashboardData>('/api/admin/dashboard', { credentials: 'include' });
}

// Admin Uploads
export async function adminUpload(formData: FormData): Promise<{
  url: string;
  alt: { en: string; sw: string };
  width: number;
  height: number;
  sizes?: { sm?: string; md?: string; lg?: string };
}> {
  return apiFetchMultipart('/api/admin/uploads', formData);
}

// Admin Inbox
export async function adminInboxList<T>(
  type: string,
  params?: { status?: string; page?: number }
): Promise<ListResponse<T>> {
  const qs = new URLSearchParams();
  if (params?.status) qs.set('status', params.status);
  if (params?.page) qs.set('page', String(params.page));
  const query = qs.toString() ? `?${qs}` : '';
  return apiFetch<ListResponse<T>>(`/api/admin/inbox/${type}${query}`, {
    credentials: 'include',
  });
}

export async function adminInboxGet<T>(type: string, id: string): Promise<T> {
  return apiFetch<T>(`/api/admin/inbox/${type}/${id}`, { credentials: 'include' });
}

export async function adminInboxUpdate<T>(
  type: string,
  id: string,
  data: { status?: string; note?: string }
): Promise<T> {
  return apiFetch<T>(`/api/admin/inbox/${type}/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
    credentials: 'include',
  });
}

export function adminInboxExportUrl(type: string, params?: { status?: string }): string {
  const qs = new URLSearchParams();
  if (params?.status) qs.set('status', params.status);
  const query = qs.toString() ? `?${qs}` : '';
  return `/api/admin/inbox/${type}/export${query}`;
}

// Admin Users
export async function adminListUsers(
  params?: { page?: number }
): Promise<ListResponse<User>> {
  return adminList<User>('users', params);
}

export async function adminCreateUser(data: {
  name: string;
  email: string;
  role: string;
  password: string;
}): Promise<User> {
  return adminCreate<User>('users', data);
}

export async function adminUpdateUser(
  id: string,
  data: Partial<User & { password?: string }>
): Promise<User> {
  return adminUpdate<User>('users', id, data);
}

export async function adminDeleteUser(id: string): Promise<void> {
  return adminDelete('users', id);
}

// Admin Activity Log
export async function adminGetActivity(
  params?: { page?: number }
): Promise<ListResponse<ActivityLog>> {
  return adminList<ActivityLog>('activity', params);
}

// Preview
export async function adminPreview<T>(collection: string, id: string): Promise<T> {
  return apiFetch<T>(`/api/admin/preview/${collection}/${id}`, {
    credentials: 'include',
  });
}
