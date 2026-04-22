"use client";

import { useMemo, useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useStreakStore } from "@/stores/streakStore";
import { useSRStore } from "@/stores/srStore";

const navItems = [
  { href: "/", label: "Startseite", icon: "grid_view" },
  { href: "/story", label: "Geschichte", icon: "auto_stories" },
  { href: "/practice", label: "Üben", icon: "fitness_center" },
  { href: "/quiz", label: "Quiz", icon: "quiz" },
  { href: "/tutor", label: "Tutor", icon: "forum" },
];

export default function Navbar() {
  const pathname = usePathname();
  const currentStreak = useStreakStore((s) => s.currentStreak);
  const totalXp = useStreakStore((s) => s.totalXp);
  const cards = useSRStore((s) => s.cards);
  const getDueCards = useSRStore((s) => s.getDueCards);
  const dueCount = useMemo(() => getDueCards().length, [cards, getDueCards]);

  // Defer store-dependent conditional rendering until after hydration
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);

  return (
    <nav className="sticky top-0 z-50 flex items-center justify-between px-8 h-20 bg-[#f7f7f3]/70 backdrop-blur-xl shadow-[0_20px_40px_rgba(27,101,101,0.06)]">
      <Link
        href="/"
        className="text-2xl font-black text-primary tracking-tighter font-headline"
      >
        Berlin Leben
      </Link>

      <div className="flex items-center gap-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`px-4 py-2 font-headline font-bold tracking-tight transition-colors ${
                isActive
                  ? "text-primary border-b-2 border-primary"
                  : "text-on-surface/70 hover:text-primary"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </div>

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 bg-surface-high rounded-full px-4 py-2">
          <span className="material-symbols-outlined text-primary text-sm">
            local_fire_department
          </span>
          <span className="text-xs font-bold font-headline">
            {currentStreak} TAGE
          </span>
        </div>

        {hydrated && dueCount > 0 && (
          <Link
            href="/practice"
            className="flex items-center gap-1 bg-secondary rounded-full px-4 py-2"
          >
            <span className="text-xs font-bold text-on-secondary">
              {dueCount} fällig
            </span>
          </Link>
        )}

        <div className="flex items-center gap-1 bg-primary-container rounded-full px-4 py-2">
          <span className="material-symbols-outlined text-on-primary-container text-sm">
            bolt
          </span>
          <span className="text-xs font-bold text-on-primary-container">
            {totalXp}
          </span>
        </div>
      </div>
    </nav>
  );
}
