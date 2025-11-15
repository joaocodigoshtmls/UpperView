import type { DefaultHome } from "@prisma/client";

export function getDefaultHomePath(defaultHome: DefaultHome | null | undefined): string {
  switch (defaultHome) {
    case "TRANSACTIONS":
      return "/transactions";
    case "SETTINGS":
      return "/settings";
    case "DASHBOARD":
    default:
      return "/dashboard";
  }
}
