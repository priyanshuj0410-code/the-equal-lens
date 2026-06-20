import type { Metadata } from "next";
import ContactForm from "@/components/ContactForm";
import { scatterForPath } from "@/lib/pageMyths";
import { Doodle } from "@/components/Doodles";
import MythScatter from "@/components/MythScatter";

export const metadata: Metadata = {
  title: "Contact — The Equal Lens",
  description:
    "Questions, or want to bring The Equal Lens to your school or community? Get in touch.",
};

export default function ContactPage() {
  return (
    <div>
      <section className="relative overflow-hidden">
        <Doodle name="squiggle" className="anim-float absolute left-10 top-16 w-14 text-insight" />
        <Doodle name="sparkle" className="anim-wobble absolute right-14 top-12 w-9 text-grow" />
        <MythScatter items={scatterForPath("/contact")} />
        <div className="relative mx-auto max-w-3xl px-5 py-20 text-center">
          <p className="font-hand text-sm font-bold uppercase tracking-widest text-brandsoft">
            Contact
          </p>
          <h1 className="mt-3 font-hand text-4xl font-extrabold text-ink sm:text-5xl">Get in touch</h1>
          <p className="mx-auto mt-5 max-w-xl text-lg text-ink/70">
            Want to bring The Equal Lens to your school or community? We&rsquo;d
            love to hear from you.
          </p>
        </div>
      </section>

      <section className="mx-auto grid max-w-4xl gap-8 px-5 py-10 md:grid-cols-2">
        <div className="sticker rounded-3xl bg-surface p-8">
          <h2 className="font-hand text-2xl font-bold">Say hello</h2>
          <p className="mt-4 text-sm font-medium text-ink/60">Email</p>
          <a href="mailto:support@theequallens.com" className="text-brand hover:underline">
            support@theequallens.com
          </a>
          <p className="mt-8 font-hand text-2xl font-bold text-brand">
            Unlearn. Relearn. Grow.
          </p>
        </div>
        <div className="sticker rounded-3xl bg-surface p-8">
          <h2 className="font-hand text-2xl font-bold">Send a message</h2>
          <div className="mt-4">
            <ContactForm />
          </div>
        </div>
      </section>
    </div>
  );
}
