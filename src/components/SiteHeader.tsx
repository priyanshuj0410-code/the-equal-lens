"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

const links = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/programs", label: "Programs" },
  { href: "/games", label: "Games" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
];

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

  const Toggle = () => (
    <div className="flex items-center rounded-full border-2 border-mist p-0.5 font-hand text-xs font-bold">
      <button
        onClick={() => setAudience("kid")}
        className={`rounded-full px-2.5 py-1 transition-colors ${
          audience === "kid" ? "bg-violet-600 text-white" : "text-ink/60"
        }`}
      >
        Kids
      </button>
      <button
        onClick={() => setAudience("adult")}
        className={`rounded-full px-2.5 py-1 transition-colors ${
          audience === "adult" ? "bg-violet-600 text-white" : "text-ink/60"
        }`}
      >
        18–35
      </button>
    </div>
  );

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
              className={`rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${
                isActive(l.href)
                  ? "bg-violet-100 text-violet-800"
                  : "text-ink/70 hover:bg-violet-50 hover:text-brand"
              }`}
            >
              {l.label}
            </Link>
          ))}
          <span className="ml-2">
            <Toggle />
          </span>
          <Link
            href="/join"
            className="ml-2 rounded-full bg-violet-600 px-4 py-1.5 text-sm font-medium text-white transition-colors hover:bg-violet-800"
          >
            Join us
          </Link>
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
            <Toggle />
          </div>
          {[...links, { href: "/join", label: "Join us" }].map((l) => (
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
        </nav>
      )}
    </header>
  );
}
