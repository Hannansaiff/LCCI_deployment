"use server";

import { z } from "zod";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { randomBytes } from "crypto";

const schema = z.object({
  serviceId: z.string().min(1),
  name: z.string().min(2).max(200),
  email: z.string().email(),
  phone: z.string().min(7).max(40),
  message: z.string().min(5).max(5000),
});

function safeName(name: string) {
  return name.replace(/[^a-zA-Z0-9._-]/g, "_");
}

export async function submitServiceRequest(formData: FormData) {
  const raw = {
    serviceId: String(formData.get("serviceId") ?? ""),
    name: String(formData.get("name") ?? ""),
    email: String(formData.get("email") ?? ""),
    phone: String(formData.get("phone") ?? ""),
    message: String(formData.get("message") ?? ""),
  };

  const parsed = schema.safeParse(raw);
  if (!parsed.success) {
    return { ok: false as const, error: "Invalid input." };
  }

  const file = formData.get("attachment") as File | null;
  let attachmentPath: string | null = null;

  if (file && file.size > 0) {
    if (file.size > 4 * 1024 * 1024) {
      return { ok: false as const, error: "Attachment too large (max 4MB)." };
    }
    const allowed = ["application/pdf", "image/jpeg", "image/png", "image/webp"];
    if (!allowed.includes(file.type)) {
      return { ok: false as const, error: "Invalid file type." };
    }
    const buf = Buffer.from(await file.arrayBuffer());
    const dir = path.join(process.cwd(), "public", "uploads", "service-requests");
    await mkdir(dir, { recursive: true });
    const fname = `${randomBytes(16).toString("hex")}_${safeName(file.name)}`;
    const full = path.join(dir, fname);
    await writeFile(full, buf);
    attachmentPath = `/uploads/service-requests/${fname}`;
  }

  await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/api/service-requests`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      serviceId: parsed.data.serviceId,
      name: parsed.data.name,
      email: parsed.data.email,
      phone: parsed.data.phone,
      message: parsed.data.message,
      attachmentPath: attachmentPath ?? undefined,
    }),
  });

  return { ok: true as const };
}
