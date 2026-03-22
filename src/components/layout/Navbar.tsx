"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useStreakStore } from "@/stores/streakStore";
import { useSRStore } from "@/stores/srStore";

const navItems = [
  { href: "/", label: "Startseite", labelEn: "Home" },
  { href: "/story", label: "Geschichte", labelEn: "Story" },
  { href: "/practice", label: "Üben", labelEn: "Practice" },
  { href: "/tutor", label: "Tutor", labelEn: "Tutor" },
];

export default function Navbar() {
  const pathname = usePathname();
  const currentStreak = useStreakStore((s) => s.currentStreak);
  const totalXp = useStreakStore((s) => s.totalXp);
  const dueCount = useSRStore((s) => s.getDueCards().length);

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-sm">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
        <Link href="/" className="text-lg font-bold text-primary">
          Berlin Leben
        </Link>

        <div className="flex items-center gap-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-muted hover:text-foreground"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </div>

        <div className="flex items-center gap-3 text-sm">
          {dueCount > 0 && (
            <Link
              href="/practice"
              className="rounded-full bg-warning/10 px-2.5 py-0.5 text-warning"
            >
              {dueCount} fällig
            </Link>
          )}
          <span className="text-muted" title="Streak">
            🔥 {currentStreak}
          </span>
          <span className="text-accent" title="XP">
            ⚡ {totalXp}
          </span>
        </div>
      </div>
    </nav>
  );
}
