"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useProgressStore } from "@/stores/progressStore";
import ChapterFlow from "@/components/story/ChapterFlow";
import type { Chapter } from "@/types/content";

export default function ChapterPage() {
  const params = useParams();
  const router = useRouter();
  const chapterId = params.chapterId as string;
  const isUnlocked = useProgressStore((s) =>
    s.unlockedChapters.includes(chapterId)
  );
  const [chapter, setChapter] = useState<Chapter | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isUnlocked) {
      router.push("/story");
      return;
    }

    import(`@/content/chapters/${chapterId}.json`)
      .then((mod) => {
        setChapter(mod.default as Chapter);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, [chapterId, isUnlocked, router]);

  if (!isUnlocked) return null;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-muted">Kapitel wird geladen...</p>
      </div>
    );
  }

  if (!chapter) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4">
        <p className="text-muted">Kapitel nicht gefunden</p>
        <Link href="/story" className="text-primary hover:underline">
          Zurück zur Übersicht
        </Link>
      </div>
    );
  }

  return <ChapterFlow chapter={chapter} />;
}
