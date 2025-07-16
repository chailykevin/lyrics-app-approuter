"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

type Props = {
  children: React.ReactNode;
};

export default function AdminLayout({ children }: Props) {
  const pathname = usePathname();

  const navItems = [
    { href: "/admin/songs", label: "Manajemen Lagu" },
    { href: "/admin/artists", label: "Manajemen Artis" },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* ===== Sidebar ===== */}
      <aside className="w-64 flex-shrink-0 bg-white border-r border-gray-200">
        <div className="p-5">
          <h2 className="text-xl font-bold text-gray-800">Admin Panel</h2>
        </div>
        <nav className="mt-4 px-3">
          <ul className="space-y-2">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`
                    flex items-center space-x-3 p-2 rounded-md text-gray-600 hover:bg-gray-100
                    ${
                      pathname.startsWith(item.href)
                        ? "bg-blue-500 text-white hover:bg-blue-600"
                        : ""
                    }
                  `}
                >
                  {/* Anda bisa menambahkan ikon di sini nanti */}
                  <span>{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      {/* ===== Main Content ===== */}
      <main className="flex flex-col flex-1 w-max p-8">{children}</main>
    </div>
  );
}
