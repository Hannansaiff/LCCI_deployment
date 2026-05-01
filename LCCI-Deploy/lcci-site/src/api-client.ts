/**
 * API client — talks to the Python FastAPI backend.
 * Base URL defaults to http://localhost:8000 for local development.
 */

const BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const url = `${BASE}${path}`;
  const res = await fetch(url, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
    // Disable Next.js cache for always-fresh data
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error(`API ${path} failed: ${res.status}`);
  }
  return res.json() as Promise<T>;
}

// ─── Types ────────────────────────────────────────────────────────────────────

export interface HeroSection {
  id: string;
  title: string;
  titleUr: string;
  subtitle: string;
  subtitleUr: string;
  imageUrl: string;
  btn1Text: string;
  btn1TextUr: string;
  btn2Text: string;
  btn2TextUr: string;
  btn1Enabled: boolean;
  btn2Enabled: boolean;
  learnMoreHref: string;
  memberHref: string;
}

export interface SiteSettings {
  id: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  backgroundColor: string;
  logoUrl: string;
  topBarPhone: string;
  topBarEmail: string;
  facebookUrl: string;
  twitterUrl: string;
  linkedinUrl: string;
  youtubeUrl: string;
  footerText: string;
  address: string;
  mapEmbedUrl: string;
  metaTitle: string;
  metaDescription: string;
  metaKeywords: string;
  ogImageUrl: string;
}

export interface Service {
  id: string;
  title: string;
  titleUr: string;
  slug: string;
  description: string;
  descriptionUr: string;
  icon: string;
  active: boolean;
  showOnHome: boolean;
  homeOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface Activity {
  id: string;
  title: string;
  titleUr: string;
  slug: string;
  description: string;
  descriptionUr: string;
  imageUrl: string;
  date: string;
  showOnHome: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface EventGallery {
  id: string;
  eventId: string;
  imageUrl: string;
  sortOrder: number;
}

export interface Event {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  description: string;
  category: string;
  date: string;
  imageUrl: string;
  pdfUrl: string;
  highlighted: boolean;
  hidden: boolean;
  createdAt: string;
  updatedAt: string;
  gallery?: EventGallery[];
}

export interface Leadership {
  id: string;
  name: string;
  role: string;
  photoUrl: string;
  bio: string;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface Partner {
  id: string;
  name: string;
  logoUrl: string;
  websiteUrl: string;
  sortOrder: number;
  createdAt: string;
}

export interface AboutContent {
  id: string;
  mission: string;
  missionUr: string;
  vision: string;
  visionUr: string;
  history: string;
  historyUr: string;
}

export interface MembershipApplication {
  id: string;
  businessName: string;
  ownerName: string;
  address: string;
  businessType: string;
  registrationNo: string;
  contactNo: string;
  email: string;
  cnicPath?: string;
  businessDocsPath?: string;
  status: string;
  remarks: string;
  createdAt: string;
  updatedAt: string;
}

export interface ActivityLog {
  id: string;
  adminId?: string;
  action: string;
  entity: string;
  details: string;
  ip?: string;
  createdAt: string;
}

// ─── Public read functions ────────────────────────────────────────────────────

export async function getHeroSection(): Promise<HeroSection | null> {
  return apiFetch<HeroSection>("/api/content/hero").catch(() => null);
}

export async function getSiteSettings(): Promise<SiteSettings | null> {
  return apiFetch<SiteSettings>("/api/content/settings").catch(() => null);
}

export async function getAboutContent(): Promise<AboutContent | null> {
  return apiFetch<AboutContent>("/api/content/about").catch(() => null);
}

export async function getServices(opts?: {
  showOnHome?: boolean;
  active?: boolean;
}): Promise<Service[]> {
  const params = new URLSearchParams();
  if (opts?.active) params.set("active_only", "true");
  const qs = params.toString() ? `?${params.toString()}` : "";
  const all = await apiFetch<Service[]>(`/api/services/${qs}`).catch(() => []);
  if (opts?.showOnHome) return all.filter((s) => s.showOnHome);
  return all;
}

export async function getServiceBySlug(slug: string): Promise<Service | null> {
  return apiFetch<Service>(`/api/services/slug/${slug}`).catch(() => null);
}

export async function getActivities(opts?: {
  showOnHome?: boolean;
}): Promise<Activity[]> {
  const qs = opts?.showOnHome ? "?home_only=true" : "";
  return apiFetch<Activity[]>(`/api/activities/${qs}`).catch(() => []);
}

export async function getActivityBySlug(slug: string): Promise<Activity | null> {
  return apiFetch<Activity>(`/api/activities/slug/${slug}`).catch(() => null);
}

export async function getEvents(opts?: {
  visibleOnly?: boolean;
}): Promise<Event[]> {
  const qs = opts?.visibleOnly ? "?visible_only=true" : "";
  return apiFetch<Event[]>(`/api/events/${qs}`).catch(() => []);
}

export async function getEventBySlug(slug: string): Promise<Event | null> {
  return apiFetch<Event>(`/api/events/slug/${slug}`).catch(() => null);
}

export async function getLeadership(): Promise<Leadership[]> {
  return apiFetch<Leadership[]>("/api/leadership/").catch(() => []);
}

export async function getPartners(): Promise<Partner[]> {
  return apiFetch<Partner[]>("/api/partners/").catch(() => []);
}

// ─── Admin write functions (called from server actions) ───────────────────────

async function adminFetch<T>(
  path: string,
  method: string,
  body?: unknown,
  token?: string
): Promise<T> {
  const url = `${BASE}${path}`;
  const res = await fetch(url, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
    cache: "no-store",
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`API ${method} ${path} failed ${res.status}: ${text}`);
  }
  return res.json() as Promise<T>;
}

export async function updateHeroAPI(data: Partial<HeroSection>): Promise<HeroSection> {
  return adminFetch<HeroSection>("/api/content/hero", "PATCH", data);
}

export async function upsertActivityAPI(
  data: Partial<Activity> & { id?: string }
): Promise<Activity> {
  if (data.id) {
    const { id, ...rest } = data;
    return adminFetch<Activity>(`/api/activities/${id}`, "PATCH", rest);
  }
  return adminFetch<Activity>("/api/activities/", "POST", data);
}

export async function deleteActivityAPI(id: string): Promise<void> {
  await adminFetch<unknown>(`/api/activities/${id}`, "DELETE");
}

export async function upsertEventAPI(
  data: Partial<Event> & { id?: string }
): Promise<Event> {
  if (data.id) {
    const { id, ...rest } = data;
    return adminFetch<Event>(`/api/events/${id}`, "PATCH", rest);
  }
  return adminFetch<Event>("/api/events/", "POST", data);
}

export async function deleteEventAPI(id: string): Promise<void> {
  await adminFetch<unknown>(`/api/events/${id}`, "DELETE");
}

export async function upsertServiceAPI(
  data: Partial<Service> & { id?: string }
): Promise<Service> {
  if (data.id) {
    const { id, ...rest } = data;
    return adminFetch<Service>(`/api/services/${id}`, "PATCH", rest);
  }
  return adminFetch<Service>("/api/services/", "POST", data);
}

export async function deleteServiceAPI(id: string): Promise<void> {
  await adminFetch<unknown>(`/api/services/${id}`, "DELETE");
}

export async function upsertLeadershipAPI(
  data: Partial<Leadership> & { id?: string }
): Promise<Leadership> {
  if (data.id) {
    const { id, ...rest } = data;
    return adminFetch<Leadership>(`/api/leadership/${id}`, "PATCH", rest);
  }
  return adminFetch<Leadership>("/api/leadership/", "POST", data);
}

export async function deleteLeadershipAPI(id: string): Promise<void> {
  await adminFetch<unknown>(`/api/leadership/${id}`, "DELETE");
}

export async function upsertPartnerAPI(
  data: Partial<Partner> & { id?: string }
): Promise<Partner> {
  if (data.id) {
    const { id, ...rest } = data;
    return adminFetch<Partner>(`/api/partners/${id}`, "PATCH", rest);
  }
  return adminFetch<Partner>("/api/partners/", "POST", data);
}

export async function deletePartnerAPI(id: string): Promise<void> {
  await adminFetch<unknown>(`/api/partners/${id}`, "DELETE");
}

export async function updateSiteSettingsAPI(
  data: Partial<SiteSettings>
): Promise<SiteSettings> {
  return adminFetch<SiteSettings>("/api/content/settings", "PATCH", data);
}

export async function updateAboutContentAPI(
  data: Partial<AboutContent>
): Promise<AboutContent> {
  return adminFetch<AboutContent>("/api/content/about", "PATCH", data);
}

export async function updateMembershipApplicationAPI(
  id: string,
  data: { status: string; remarks: string }
): Promise<MembershipApplication> {
  return adminFetch<MembershipApplication>(
    `/api/memberships/applications/${id}`,
    "PATCH",
    data
  );
}

export async function getMembershipApplications(): Promise<
  MembershipApplication[]
> {
  return apiFetch<MembershipApplication[]>(
    "/api/memberships/applications"
  ).catch(() => []);
}

export async function getActivityLogs(): Promise<ActivityLog[]> {
  return apiFetch<ActivityLog[]>("/api/logs/").catch(() => []);
}
