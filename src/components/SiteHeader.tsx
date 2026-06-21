"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { Segmented, navLinkClass } from "@equal-lens/brand";
import { SWIPEED_URL } from "@/lib/links";

// Home isn't a tab — the logo + wordmark link home. Games is hidden for now.
const links = [
  { href: "/programs", label: "Programs" },
  { href: "/blog", label: "Blogs" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
  { href: "/join", label: "Join us" },
];

const AUDIENCE_OPTIONS: { value: "kid" | "adult"; label: string }[] = [
  { value: "kid", label: "Kids" },
  { value: "adult", label: "Adult" },
];

function AudienceToggle({
  value,
  onChange,
}: {
  value: "kid" | "adult";
  onChange: (a: "kid" | "adult") => void;
}) {
  return <Segmented options={AUDIENCE_OPTIONS} value={value} onChange={onChange} />;
}

export default function SiteHeader({ audience }: { audience: "kid" | "adult" }) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  function setAudience(a: "kid" | "adult") {
    document.cookie = `audience=${a};path=/;max-age=31536000`;
    router.refresh();
    setOpen(false);
  }

  return (
    <header className="sticky top-0 z-40 border-b border-mist bg-paper/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3">
        <Link
          href="/"
          className="flex items-center gap-2"
          onClick={() => setOpen(false)}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={audience === "adult" ? "/logo-reversed.svg" : "/logo-primary.svg"}
            alt=""
            className="h-8 w-auto"
          />
          <span className="font-display text-lg font-semibold text-brand">
            The Equal Lens
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={navLinkClass(isActive(l.href))}
            >
              {l.label}
            </Link>
          ))}
          <span className="ml-3">
            <AudienceToggle value={audience} onChange={setAudience} />
          </span>
          <a
            href={SWIPEED_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn--primary btn--sm ml-3"
            style={{ boxShadow: "none" }}
          >
            Play SwipeEd
          </a>
        </nav>

        <button
          onClick={() => setOpen(!open)}
          className="rounded-lg p-2 text-brand md:hidden"
          aria-label="Toggle menu"
          aria-expanded={open}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            {open ? (
              <>
                <line x1="6" y1="6" x2="18" y2="18" />
                <line x1="6" y1="18" x2="18" y2="6" />
              </>
            ) : (
              <>
                <line x1="4" y1="7" x2="20" y2="7" />
                <line x1="4" y1="12" x2="20" y2="12" />
                <line x1="4" y1="17" x2="20" y2="17" />
              </>
            )}
          </svg>
        </button>
      </div>

      {open && (
        <nav className="border-t border-mist bg-paper px-5 py-3 md:hidden">
          <div className="mb-3">
            <AudienceToggle value={audience} onChange={setAudience} />
          </div>
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className={`block rounded-lg px-3 py-2 text-sm font-medium ${
                isActive(l.href) ? "bg-violet-100 text-violet-800" : "text-ink/80"
              }`}
            >
              {l.label}
            </Link>
          ))}
          <a
            href={SWIPEED_URL}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setOpen(false)}
            className="btn btn--primary mt-3 w-full justify-center"
            style={{ boxShadow: "none" }}
          >
            Play SwipeEd
          </a>
        </nav>
      )}
    </header>
  );
}
