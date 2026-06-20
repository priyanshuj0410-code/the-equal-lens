import type { Myth } from "@/lib/knowledge";

const SPOTS = [
  "bottom-24 left-4 -rotate-6",
  "top-40 right-6 rotate-3",
  "bottom-8 left-1/3 rotate-2",
  "top-28 right-1/4 -rotate-3",
];

// Scattered struck-through myths + plain facts, painted onto the page canvas.
export default function MythScatter({ myths }: { myths: Myth[] }) {
  const items: { t: string; strike: boolean; cls: string }[] = [];
  myths.slice(0, 2).forEach((m, i) => {
    items.push({ t: m.myth, strike: true, cls: SPOTS[i * 2] });
    items.push({ t: m.truth, strike: false, cls: SPOTS[i * 2 + 1] });
  });
  return (
    <>
      {items.map((s, i) => (
        <span
          key={i}
          aria-hidden="true"
          className={`pointer-events-none absolute hidden max-w-[180px] font-hand text-sm font-bold lg:block ${s.cls} ${
            s.strike
              ? "text-ink/25 line-through decoration-grow decoration-2"
              : "text-violet-500/55"
          }`}
        >
          {s.t}
        </span>
      ))}
    </>
  );
}
