"use client";

import { logout } from "@/app/auth/actions";

export function LogoutButton() {
  return (
    <button
      onClick={() => logout()}
      className="text-slate-600 hover:text-red-600 dark:text-slate-300 dark:hover:text-red-400 transition-colors text-sm font-medium"
    >
      Sair
    </button>
  );
}
