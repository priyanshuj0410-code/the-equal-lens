import type { Metadata } from "next";
import { Poppins, Nunito_Sans, Baloo_2 } from "next/font/google";
import "./globals.css";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import SiteCanvas from "@/components/SiteCanvas";
import WelcomeModal from "@/components/WelcomeModal";
import LensyPopup from "@/components/LensyPopup";
import { getMyths } from "@/lib/knowledge";
import { getAudience, hasAudienceChoice } from "@/lib/audience";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const nunito = Nunito_Sans({
  variable: "--font-nunito",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

const baloo = Baloo_2({
  variable: "--font-baloo",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "The Equal Lens - Unlearn. Relearn. Grow.",
  description:
    "Helping children unlearn bias and relearn empathy through play.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const audience = await getAudience();
  const chosen = await hasAudienceChoice();
  return (
    <html
      lang="en"
      data-audience={audience}
      className={`${poppins.variable} ${nunito.variable} ${baloo.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-paper text-ink">
        <SiteHeader audience={audience} />
        <main className="flex-1">{children}</main>
        <SiteCanvas seedMyths={getMyths()} audience={audience} />
        <SiteFooter />
        {!chosen && <WelcomeModal />}
        {chosen && audience === "kid" && <LensyPopup />}
      </body>
    </html>
  );
}
