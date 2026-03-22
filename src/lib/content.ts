import type { Chapter } from "@/types/content";

const chapterModules: Record<string, () => Promise<{ default: Chapter }>> = {
  "chapter-1": () => import("@/content/chapters/chapter-1.json") as Promise<{ default: Chapter }>,
};

export async function loadChapter(chapterId: string): Promise<Chapter | null> {
  const loader = chapterModules[chapterId];
  if (!loader) return null;
  const mod = await loader();
  return mod.default;
}
