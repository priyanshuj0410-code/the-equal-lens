import { getMyths } from "@/lib/knowledge";

export default function Home() {
  const myths = getMyths();
  const teaser = myths[0];

  return (
    <main className="flex-1 flex items-center justify-center bg-violet-600 px-6 py-16 text-white">
      <div className="w-full max-w-2xl text-center">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/logo-reversed.svg"
          alt="The Equal Lens"
          className="mx-auto h-20 w-auto"
        />

        <h1 className="mt-8 font-display text-4xl font-semibold sm:text-5xl">
          The Equal Lens
        </h1>
        <p className="mt-2 font-hand text-xl text-violet-200">
          Unlearn. Relearn. Grow.
        </p>

        <p className="mx-auto mt-6 max-w-lg text-violet-100">
          A new, playful Equal Lens is being built — a canvas you can draw on,
          where you erase the myths and scribble in the truth.
        </p>

        {teaser && (
          <div className="mx-auto mt-10 max-w-lg rounded-3xl bg-white/10 p-6 text-left ring-1 ring-white/15">
            <div className="font-display text-xs uppercase tracking-widest text-violet-200">
              Preview · unlearn → relearn
            </div>
            <p className="mt-3 text-lg text-violet-200 line-through decoration-grow decoration-2">
              {teaser.myth}
            </p>
            <p className="mt-2 font-display text-xl font-semibold text-white">
              {teaser.truth}
            </p>
            <p className="mt-3 text-sm text-violet-100">{teaser.explanation}</p>
          </div>
        )}

        <p className="mt-8 font-display text-xs uppercase tracking-widest text-violet-200">
          {myths.length} myths loaded from the knowledge base · redesign in
          progress
        </p>
      </div>
    </main>
  );
}
