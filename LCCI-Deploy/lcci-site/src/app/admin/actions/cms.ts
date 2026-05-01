"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import {
  updateHeroAPI,
  upsertActivityAPI,
  deleteActivityAPI,
  upsertEventAPI,
  deleteEventAPI,
  upsertServiceAPI,
  deleteServiceAPI,
  upsertLeadershipAPI,
  deleteLeadershipAPI,
  upsertPartnerAPI,
  deletePartnerAPI,
  updateSiteSettingsAPI,
  updateAboutContentAPI,
  updateMembershipApplicationAPI,
} from "@/lib/api-client";
import { requireAdmin } from "@/lib/require-admin";
import { logActivity } from "@/lib/activity-log";
import { savePublicUpload } from "@/lib/upload-file";
import { slugify } from "@/lib/slug";

async function adminId() {
  const s = await requireAdmin();
  return s.user!.id;
}

export async function updateHero(formData: FormData) {
  const id = await adminId();
  const title = String(formData.get("title") ?? "");
  const subtitle = String(formData.get("subtitle") ?? "");
  const btn1Text = String(formData.get("btn1Text") ?? "");
  const btn2Text = String(formData.get("btn2Text") ?? "");
  const learnMoreHref = String(formData.get("learnMoreHref") ?? "/about");
  const memberHref = String(formData.get("memberHref") ?? "/contact");
  const btn1Enabled = formData.get("btn1Enabled") === "on";
  const btn2Enabled = formData.get("btn2Enabled") === "on";
  const image = formData.get("image") as File | null;

  let imageUrl: string | undefined;
  if (image && image.size > 0) {
    imageUrl = await savePublicUpload(image, "hero");
  }

  await updateHeroAPI({
    title,
    subtitle,
    btn1Text,
    btn2Text,
    learnMoreHref,
    memberHref,
    btn1Enabled,
    btn2Enabled,
    ...(imageUrl ? { imageUrl } : {}),
  });
  await logActivity(id, "update", "HeroSection", "Hero updated");
  revalidatePath("/");
}

export async function upsertActivity(formData: FormData) {
  const id = await adminId();
  const existingId = String(formData.get("id") ?? "");
  const title = String(formData.get("title") ?? "");
  const description = String(formData.get("description") ?? "");
  const dateStr = String(formData.get("date") ?? "");
  const showOnHome = formData.get("showOnHome") === "on";
  const image = formData.get("image") as File | null;

  const date = new Date(dateStr);
  if (Number.isNaN(date.getTime())) {
    return;
  }

  let imageUrl: string | undefined;
  if (image && image.size > 0) {
    imageUrl = await savePublicUpload(image, "activities");
  }

  const slugBase = slugify(title);
  const slug = `${slugBase}-${Date.now().toString(36)}`;

  await upsertActivityAPI({
    id: existingId || undefined,
    title,
    slug,
    description,
    date,
    showOnHome,
    imageUrl: imageUrl ?? "",
  });
  await logActivity(id, existingId ? "update" : "create", "Activity", existingId || slug);
  revalidatePath("/");
  revalidatePath("/events");
}

export async function deleteActivity(activityId: string) {
  const id = await adminId();
  await deleteActivityAPI(activityId);
  await logActivity(id, "delete", "Activity", activityId);
  revalidatePath("/");
}

export async function deleteActivityForm(formData: FormData) {
  const activityId = String(formData.get("id") ?? "");
  if (!activityId) return;
  await deleteActivity(activityId);
}

export async function upsertEvent(formData: FormData) {
  const admin = await adminId();
  const existingId = String(formData.get("id") ?? "");
  const title = String(formData.get("title") ?? "");
  const excerpt = String(formData.get("excerpt") ?? "");
  const description = String(formData.get("description") ?? "");
  const category = String(formData.get("category") ?? "General");
  const dateStr = String(formData.get("date") ?? "");
  const highlighted = formData.get("highlighted") === "on";
  const hidden = formData.get("hidden") === "on";
  const banner = formData.get("banner") as File | null;
  const pdf = formData.get("pdf") as File | null;

  const date = new Date(dateStr);
  if (Number.isNaN(date.getTime())) {
    return;
  }

  let imageUrl: string | undefined;
  if (banner && banner.size > 0) {
    imageUrl = await savePublicUpload(banner, "events");
  }
  let pdfUrl: string | undefined;
  if (pdf && pdf.size > 0) {
    pdfUrl = await savePublicUpload(pdf, "events/pdfs");
  }

  const slug = `${slugify(title)}-${Date.now().toString(36)}`;

  await upsertEventAPI({
    id: existingId || undefined,
    title,
    slug,
    excerpt,
    description,
    category,
    date,
    highlighted,
    hidden,
    imageUrl: imageUrl ?? "",
    pdfUrl: pdfUrl ?? "",
  });
  await logActivity(admin, existingId ? "update" : "create", "Event", existingId || slug);
  revalidatePath("/events");
}

export async function deleteEvent(eventId: string) {
  const admin = await adminId();
  await deleteEventAPI(eventId);
  await logActivity(admin, "delete", "Event", eventId);
  revalidatePath("/events");
}

export async function deleteEventForm(formData: FormData) {
  const eventId = String(formData.get("id") ?? "");
  if (!eventId) return;
  await deleteEvent(eventId);
}

export async function upsertService(formData: FormData) {
  const admin = await adminId();
  const existingId = String(formData.get("id") ?? "");
  const title = String(formData.get("title") ?? "");
  const description = String(formData.get("description") ?? "");
  const icon = String(formData.get("icon") ?? "briefcase");
  const active = formData.get("active") === "on";
  const showOnHome = formData.get("showOnHome") === "on";
  const homeOrder = Number(formData.get("homeOrder") ?? "0");

  const slug = existingId
    ? undefined
    : `${slugify(title)}-${Date.now().toString(36)}`;

  await upsertServiceAPI({
    id: existingId || undefined,
    title,
    slug: slug || undefined,
    description,
    icon,
    active,
    showOnHome,
    homeOrder,
  });
  await logActivity(admin, existingId ? "update" : "create", "Service", existingId || slug!);
  revalidatePath("/services");
  revalidatePath("/");
}

export async function deleteService(serviceId: string) {
  const admin = await adminId();
  await deleteServiceAPI(serviceId);
  await logActivity(admin, "delete", "Service", serviceId);
  revalidatePath("/services");
}

export async function deleteServiceForm(formData: FormData) {
  const serviceId = String(formData.get("id") ?? "");
  if (!serviceId) return;
  await deleteService(serviceId);
}

export async function upsertLeader(formData: FormData) {
  const admin = await adminId();
  const existingId = String(formData.get("id") ?? "");
  const name = String(formData.get("name") ?? "");
  const role = String(formData.get("role") ?? "");
  const bio = String(formData.get("bio") ?? "");
  const sortOrder = Number(formData.get("sortOrder") ?? "0");
  const photo = formData.get("photo") as File | null;

  let photoUrl: string | undefined;
  if (photo && photo.size > 0) {
    photoUrl = await savePublicUpload(photo, "leadership");
  }

  await upsertLeadershipAPI({
    id: existingId || undefined,
    name,
    role,
    bio,
    sortOrder,
    photoUrl,
  });
  await logActivity(admin, existingId ? "update" : "create", "Leadership", existingId || name);
  revalidatePath("/about");
}

export async function deleteLeader(leaderId: string) {
  const admin = await adminId();
  await deleteLeadershipAPI(leaderId);
  await logActivity(admin, "delete", "Leadership", leaderId);
  revalidatePath("/about");
}

export async function deleteLeaderForm(formData: FormData) {
  const leaderId = String(formData.get("id") ?? "");
  if (!leaderId) return;
  await deleteLeader(leaderId);
}

export async function upsertPartner(formData: FormData) {
  const admin = await adminId();
  const existingId = String(formData.get("id") ?? "");
  const name = String(formData.get("name") ?? "");
  const websiteUrl = String(formData.get("websiteUrl") ?? "");
  const sortOrder = Number(formData.get("sortOrder") ?? "0");
  const logo = formData.get("logo") as File | null;

  let logoUrl = "";
  if (logo && logo.size > 0) {
    logoUrl = await savePublicUpload(logo, "partners");
  }

  await upsertPartnerAPI({
    id: existingId || undefined,
    name,
    websiteUrl,
    sortOrder,
    logoUrl: logoUrl || undefined,
  });
  await logActivity(admin, existingId ? "update" : "create", "Partner", existingId || name);
  revalidatePath("/");
}

export async function deletePartner(partnerId: string) {
  const admin = await adminId();
  await deletePartnerAPI(partnerId);
  await logActivity(admin, "delete", "Partner", partnerId);
  revalidatePath("/");
}

export async function deletePartnerForm(formData: FormData) {
  const partnerId = String(formData.get("id") ?? "");
  if (!partnerId) return;
  await deletePartner(partnerId);
}

const settingsSchema = z.object({
  primaryColor: z.string().min(4).max(20),
  secondaryColor: z.string().min(4).max(20),
  accentColor: z.string().min(4).max(20),
  topBarPhone: z.string().min(5).max(80),
  topBarEmail: z.string().email().max(200),
  address: z.string().min(5).max(2000),
  footerText: z.string().min(2).max(500),
  mapEmbedUrl: z.string().max(8000),
  metaTitle: z.string().min(5).max(200),
  metaDescription: z.string().min(10).max(500),
  metaKeywords: z.string().max(500),
});

export async function updateSiteSettings(formData: FormData) {
  const admin = await adminId();
  const raw = {
    primaryColor: String(formData.get("primaryColor") ?? ""),
    secondaryColor: String(formData.get("secondaryColor") ?? ""),
    accentColor: String(formData.get("accentColor") ?? ""),
    topBarPhone: String(formData.get("topBarPhone") ?? ""),
    topBarEmail: String(formData.get("topBarEmail") ?? ""),
    address: String(formData.get("address") ?? ""),
    footerText: String(formData.get("footerText") ?? ""),
    mapEmbedUrl: String(formData.get("mapEmbedUrl") ?? ""),
    metaTitle: String(formData.get("metaTitle") ?? ""),
    metaDescription: String(formData.get("metaDescription") ?? ""),
    metaKeywords: String(formData.get("metaKeywords") ?? ""),
  };
  const parsed = settingsSchema.safeParse(raw);
  if (!parsed.success) {
    return;
  }

  const logo = formData.get("logo") as File | null;
  let logoUrl: string | undefined;
  if (logo && logo.size > 0) {
    logoUrl = await savePublicUpload(logo, "branding");
  }

  await updateSiteSettingsAPI({
    ...parsed.data,
    logoUrl,
  });
  await logActivity(admin, "update", "SiteSettings", "settings");
  revalidatePath("/");
}

export async function updateAboutContent(formData: FormData) {
  const admin = await adminId();
  const mission = String(formData.get("mission") ?? "");
  const vision = String(formData.get("vision") ?? "");
  const history = String(formData.get("history") ?? "");

  await updateAboutContentAPI({ mission, vision, history });
  await logActivity(admin, "update", "AboutContent", "about");
  revalidatePath("/about");
}

export async function setMembershipStatus(
  id: string,
  status: "pending" | "approved" | "rejected",
  remarks: string
) {
  const admin = await adminId();
  await updateMembershipApplicationAPI(id, { status, remarks });
  await logActivity(admin, "membership", status, id);
  revalidatePath("/admin/memberships");
}

export async function setMembershipStatusForm(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  const status = String(formData.get("status") ?? "") as "approved" | "rejected";
  const remarks = String(formData.get("remarks") ?? "");
  if (!id || (status !== "approved" && status !== "rejected")) {
    return;
  }
  await setMembershipStatus(id, status, remarks);
}
