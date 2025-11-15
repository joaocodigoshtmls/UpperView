"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { signOut } from "next-auth/react";

interface UserMenuProps {
  user: {
    name?: string | null;
    email?: string | null;
  };
}

export default function UserMenu({ user }: UserMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/" });
  };

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 text-slate-600 hover:text-blue-600 transition-colors"
      >
        <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-medium">
          {user.name?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase() || "U"}
        </div>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-slate-200 py-2 z-50">
          <div className="px-4 py-2 border-b border-slate-200">
            <p className="font-medium text-slate-800 truncate">{user.name || "Usuário"}</p>
            <p className="text-sm text-slate-500 truncate">{user.email}</p>
          </div>
          <Link
            href="/perfil"
            className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
            onClick={() => setIsOpen(false)}
          >
            Meu Perfil
          </Link>
          <button
            onClick={handleSignOut}
            className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-slate-50 transition-colors"
          >
            Sair
          </button>
        </div>
      )}
    </div>
  );
}
