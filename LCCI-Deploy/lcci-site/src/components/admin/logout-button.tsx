"use client";

import { signOut } from "next-auth/react";

export function AdminLogoutButton() {
  return (
    <button
      type="button"
      onClick={() => signOut({ callbackUrl: "/admin/login" })}
      className="w-full rounded-lg border border-white/20 px-3 py-2 text-left text-sm hover:bg-white/10"
    >
      Sign out
    </button>
  );
}
