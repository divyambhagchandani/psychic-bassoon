import type { Chapter } from "@/types/content";

const chapterModules: Record<string, () => Promise<{ default: Chapter }>> = {
  "chapter-1": () => import("@/content/chapters/chapter-1.json") as Promise<{ default: Chapter }>,
  "chapter-2": () => import("@/content/chapters/chapter-2.json") as Promise<{ default: Chapter }>,
  "chapter-3": () => import("@/content/chapters/chapter-3.json") as Promise<{ default: Chapter }>,
  "chapter-4": () => import("@/content/chapters/chapter-4.json") as Promise<{ default: Chapter }>,
  "chapter-5": () => import("@/content/chapters/chapter-5.json") as Promise<{ default: Chapter }>,
  "chapter-6": () => import("@/content/chapters/chapter-6.json") as Promise<{ default: Chapter }>,
  "chapter-7": () => import("@/content/chapters/chapter-7.json") as Promise<{ default: Chapter }>,
  "chapter-8": () => import("@/content/chapters/chapter-8.json") as Promise<{ default: Chapter }>,
  "chapter-9": () => import("@/content/chapters/chapter-9.json") as Promise<{ default: Chapter }>,
  "chapter-10": () => import("@/content/chapters/chapter-10.json") as Promise<{ default: Chapter }>,
};

export async function loadChapter(chapterId: string): Promise<Chapter | null> {
  const loader = chapterModules[chapterId];
  if (!loader) return null;
  const mod = await loader();
  return mod.default;
}
