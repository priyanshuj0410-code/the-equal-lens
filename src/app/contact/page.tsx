import type { Metadata } from "next";
import ContactForm from "@/components/ContactForm";

export const metadata: Metadata = {
  title: "Contact — The Equal Lens",
  description:
    "Questions, or want to bring The Equal Lens to your school or community? Get in touch.",
};

export default function ContactPage() {
  return (
    <div>
      <section className="bg-violet-600 text-white">
        <div className="mx-auto max-w-4xl px-5 py-20 text-center">
          <p className="font-display text-xs uppercase tracking-widest text-violet-200">
            Contact
          </p>
          <h1 className="mt-3 font-display text-4xl font-semibold sm:text-5xl">
            Get in touch
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-violet-100">
            Want to bring The Equal Lens to your school or community? We&rsquo;d
            love to hear from you.
          </p>
        </div>
      </section>

      <section className="mx-auto grid max-w-4xl gap-10 px-5 py-16 md:grid-cols-2">
        <div>
          <h2 className="font-display text-xl font-semibold">
            Contact information
          </h2>
          <p className="mt-4 text-sm font-medium text-ink/60">Email</p>
          <a
            href="mailto:support@theequallens.com"
            className="text-violet-600 hover:underline"
          >
            support@theequallens.com
          </a>
          <p className="mt-8 font-hand text-2xl text-violet-600">
            Unlearn. Relearn. Grow.
          </p>
        </div>
        <div>
          <h2 className="font-display text-xl font-semibold">Send a message</h2>
          <div className="mt-4">
            <ContactForm />
          </div>
        </div>
      </section>
    </div>
  );
}
