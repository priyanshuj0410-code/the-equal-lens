import type { Metadata } from "next";
import ContactForm from "@/components/ContactForm";
import { scatterForPath } from "@/lib/pageMyths";
import { getAudience } from "@/lib/audience";
import { getPageContent } from "@/lib/knowledge";
import { Doodle } from "@/components/Doodles";
import MythScatter from "@/components/MythScatter";

export const metadata: Metadata = {
  title: "Contact - The Equal Lens",
  description:
    "Questions, or want to bring The Equal Lens to your school or community? Get in touch.",
};

type Content = {
  hero: {
    eyebrow: string;
    headline: string;
    body: { kid: string; adult: string };
  };
  sayHelloHeading: string;
  emailLabel: string;
  emailAddress: string;
  tagline: string;
  sendMessageHeading: string;
};

export default async function ContactPage() {
  const audience = await getAudience();
  const c = (await getPageContent("contact")) as Content;
  return (
    <div>
      <section className="relative overflow-hidden">
        <Doodle name="squiggle" className="anim-float absolute left-10 top-16 w-14 text-insight" />
        <Doodle name="sparkle" className="anim-wobble absolute right-14 top-12 w-9 text-grow" />
        <MythScatter items={scatterForPath("/contact", audience)} />
        <div className="relative mx-auto max-w-3xl px-5 py-20 text-center">
          <p className="eyebrow">
            {c.hero.eyebrow}
          </p>
          <h1 className="mt-3 font-hand text-4xl font-extrabold text-ink sm:text-5xl">{c.hero.headline}</h1>
          <p className="mx-auto mt-5 max-w-xl text-lg text-ink/70">
            {c.hero.body[audience]}
          </p>
        </div>
      </section>

      <section className="mx-auto grid max-w-4xl gap-8 px-5 py-10 md:grid-cols-2">
        <div className="card">
          <h2 className="font-hand text-2xl font-bold">{c.sayHelloHeading}</h2>
          <p className="mt-4 text-sm font-medium text-ink/60">{c.emailLabel}</p>
          <a href={`mailto:${c.emailAddress}`} className="text-brand hover:underline">
            {c.emailAddress}
          </a>
          <p className="mt-8 font-hand text-2xl font-bold text-brand">
            {c.tagline}
          </p>
        </div>
        <div className="card">
          <h2 className="font-hand text-2xl font-bold">{c.sendMessageHeading}</h2>
          <div className="mt-4">
            <ContactForm />
          </div>
        </div>
      </section>
    </div>
  );
}
