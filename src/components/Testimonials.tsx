import type { Testimonial } from "@/lib/knowledge";

function initials(name: string) {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");
}

export default function Testimonials({
  items,
  eyebrow,
  heading,
  max,
  className = "",
}: {
  items: Testimonial[];
  eyebrow: string;
  heading: string;
  max?: number;
  className?: string;
}) {
  const shown = max ? items.slice(0, max) : items;
  if (shown.length === 0) return null;

  return (
    <section className={`mx-auto max-w-5xl px-5 py-16 ${className}`}>
      <div className="text-center">
        <p className="eyebrow">{eyebrow}</p>
        <h2 className="mt-2 font-hand text-4xl font-extrabold text-ink">{heading}</h2>
      </div>
      <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {shown.map((t, i) => (
          <figure
            key={t.id}
            style={{ transform: `rotate(${i % 2 ? 1 : -1}deg)` }}
            className="card hover-pop flex flex-col"
          >
            <span aria-hidden="true" className="font-hand text-5xl leading-none text-brand/30">
              &ldquo;
            </span>
            <blockquote className="-mt-2 flex-1 font-hand text-lg font-bold leading-snug text-ink">
              {t.quote}
            </blockquote>
            <figcaption className="mt-5 flex items-center gap-3">
              {t.photo ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={t.photo}
                  alt=""
                  className="h-10 w-10 rounded-full border-2 border-ink object-cover"
                />
              ) : (
                <span className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-ink bg-violet-100 font-hand text-sm font-extrabold text-brand">
                  {initials(t.name)}
                </span>
              )}
              <span>
                <span className="block font-hand text-sm font-bold text-ink">{t.name}</span>
                {t.role && <span className="block text-xs text-brandsoft">{t.role}</span>}
              </span>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
