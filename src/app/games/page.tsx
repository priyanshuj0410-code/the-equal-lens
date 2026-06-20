import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Games — The Equal Lens",
  description: "Learn about fairness and challenge stereotypes through play.",
};

const games = [
  {
    name: "Sort It Out!",
    blurb:
      "Some statements feel normal — but are they fair? Drag each card into the right box and find out.",
  },
  {
    name: "What Would You Do?",
    blurb:
      "Real situations kids face every day. Make your choice: challenge it, or let it slide.",
  },
];

export default function GamesPage() {
  return (
    <div>
      <section className="bg-violet-600 text-white">
        <div className="mx-auto max-w-4xl px-5 py-20 text-center">
          <p className="font-display text-xs uppercase tracking-widest text-violet-200">
            Games
          </p>
          <h1 className="mt-3 font-display text-4xl font-semibold sm:text-5xl">
            Learn fairness through play
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-violet-100">
            We&rsquo;re rebuilding our games for the new canvas — where you erase
            myths and scribble the truth. Here&rsquo;s a peek at what&rsquo;s
            coming.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-5 py-16">
        <div className="grid gap-6 sm:grid-cols-2">
          {games.map((g) => (
            <div
              key={g.name}
              className="rounded-3xl border border-mist bg-white p-8"
            >
              <span className="rounded-full bg-mist px-3 py-1 text-xs font-medium text-violet-800">
                Coming soon
              </span>
              <h2 className="mt-4 font-display text-xl font-semibold">
                {g.name}
              </h2>
              <p className="mt-2 text-ink/70">{g.blurb}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
