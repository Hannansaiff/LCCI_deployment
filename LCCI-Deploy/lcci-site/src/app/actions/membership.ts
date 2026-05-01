"use server";

import { z } from "zod";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { randomBytes } from "crypto";

const schema = z.object({
  businessName: z.string().min(2).max(300),
  ownerName: z.string().min(2).max(200),
  address: z.string().min(5).max(2000),
  businessType: z.string().min(2).max(200),
  registrationNo: z.string().min(1).max(200),
  contactNo: z.string().min(7).max(40),
  email: z.string().email(),
});

function safeName(name: string) {
  return name.replace(/[^a-zA-Z0-9._-]/g, "_");
}

async function verifyRecaptcha(token: string | null) {
  const secret = process.env.RECAPTCHA_SECRET_KEY;
  if (!secret) return true;
  if (!token) return false;
  const res = await fetch("https://www.google.com/recaptcha/api/siteverify", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ secret, response: token }),
  });
  const data = (await res.json()) as { success: boolean };
  return data.success === true;
}

export async function submitMembershipApplication(formData: FormData) {
  const recaptchaToken = String(formData.get("g-recaptcha-response") ?? "");
  const okCaptcha = await verifyRecaptcha(recaptchaToken || null);
  if (!okCaptcha) {
    return { ok: false as const, error: "reCAPTCHA verification failed." };
  }

  const raw = {
    businessName: String(formData.get("businessName") ?? ""),
    ownerName: String(formData.get("ownerName") ?? ""),
    address: String(formData.get("address") ?? ""),
    businessType: String(formData.get("businessType") ?? ""),
    registrationNo: String(formData.get("registrationNo") ?? ""),
    contactNo: String(formData.get("contactNo") ?? ""),
    email: String(formData.get("email") ?? ""),
  };

  const parsed = schema.safeParse(raw);
  if (!parsed.success) {
    return { ok: false as const, error: "Please check all required fields." };
  }

  async function saveFile(file: File | null, subdir: string) {
    if (!file || file.size === 0) return null as string | null;
    if (file.size > 5 * 1024 * 1024) {
      throw new Error("FILE_TOO_LARGE");
    }
    const allowed = ["application/pdf", "image/jpeg", "image/png", "image/webp"];
    if (!allowed.includes(file.type)) {
      throw new Error("BAD_TYPE");
    }
    const buf = Buffer.from(await file.arrayBuffer());
    const dir = path.join(process.cwd(), "public", "uploads", subdir);
    await mkdir(dir, { recursive: true });
    const fname = `${randomBytes(16).toString("hex")}_${safeName(file.name)}`;
    await writeFile(path.join(dir, fname), buf);
    return `/uploads/${subdir}/${fname}`;
  }

  let cnicPath: string | null = null;
  let businessDocsPath: string | null = null;

  try {
    cnicPath = await saveFile(formData.get("cnic") as File, "membership/cnic");
    businessDocsPath = await saveFile(formData.get("businessDocs") as File, "membership/docs");
  } catch (e) {
    const msg = e instanceof Error ? e.message : "";
    if (msg === "FILE_TOO_LARGE") return { ok: false as const, error: "A file exceeds 5MB." };
    if (msg === "BAD_TYPE") return { ok: false as const, error: "Invalid file type." };
    return { ok: false as const, error: "File upload failed." };
  }

  await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/api/memberships`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      ...parsed.data,
      cnicPath: cnicPath ?? undefined,
      businessDocsPath: businessDocsPath ?? undefined,
    }),
  });

  return { ok: true as const };
}
