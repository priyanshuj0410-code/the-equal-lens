import type { Metadata } from "next";
import { getPageContent } from "@/lib/knowledge";
import VoucherClient from "@/components/VoucherClient";
import { Doodle } from "@/components/Doodles";

export const metadata: Metadata = {
  title: "Your voucher - The Equal Lens",
  robots: { index: false, follow: false },
};

type Content = {
  heading: string;
  subheading: string;
  gateLabel: string;
  gateButton: string;
  notFound: string;
  amount: number;
  voucherLabel: string;
  scratchLabel: string;
  revealedTitle: string;
  instructions: string;
};

export default async function VoucherPage() {
  const c = (await getPageContent("voucher")) as Content;
  return (
    <div className="relative overflow-hidden">
      <Doodle name="sparkle" className="anim-wobble absolute left-8 top-16 w-9 text-sun" />
      <Doodle name="star" className="anim-float absolute right-10 top-20 w-7 text-grow" />
      <div className="mx-auto max-w-xl px-5 py-16 text-center">
        <p className="eyebrow">A thank you</p>
        <h1 className="mt-2 font-hand text-3xl font-extrabold text-ink sm:text-4xl">{c.heading}</h1>
        <p className="mx-auto mt-4 max-w-md text-ink/70">{c.subheading}</p>
        <div className="mt-8">
          <VoucherClient content={c} />
        </div>
      </div>
    </div>
  );
}
