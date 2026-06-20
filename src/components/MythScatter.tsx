import type { Scrap } from "@/lib/pageMyths";

const SPOTS = [
  "bottom-24 left-4 -rotate-6",
  "top-36 right-6 rotate-3",
  "bottom-10 left-1/3 rotate-2",
  "top-24 right-1/4 -rotate-3",
];

// Scattered struck-through myths + plain affirmations, painted on the page canvas.
export default function MythScatter({ items }: { items: Scrap[] }) {
  return (
    <>
      {items.slice(0, SPOTS.length).map((s, i) => (
        <span
          key={i}
          aria-hidden="true"
          data-strike={s.strike ? "1" : undefined}
          className={`tel-scatter pointer-events-none absolute hidden max-w-[170px] font-hand text-sm font-bold transition-opacity lg:block ${SPOTS[i]} ${
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
