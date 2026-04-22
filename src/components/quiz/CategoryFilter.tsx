"use client";

const CATEGORIES = [
  { key: null, label: "Alle" },
  { key: "Demokratie", label: "Demokratie" },
  { key: "Geschichte", label: "Geschichte" },
  { key: "Gesellschaft", label: "Gesellschaft" },
  { key: "Berlin", label: "Berlin" },
] as const;

interface CategoryFilterProps {
  selected: string | null;
  onChange: (category: string | null) => void;
}

export default function CategoryFilter({
  selected,
  onChange,
}: CategoryFilterProps) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
      {CATEGORIES.map((cat) => {
        const isActive = selected === cat.key;
        return (
          <button
            key={cat.key ?? "all"}
            onClick={() => onChange(cat.key)}
            className={`shrink-0 px-4 py-2 rounded-full text-sm font-headline font-bold transition-all ${
              isActive
                ? "bg-primary text-white"
                : "bg-surface-high text-on-surface/70 hover:bg-surface-high/80"
            }`}
          >
            {cat.label}
          </button>
        );
      })}
    </div>
  );
}
