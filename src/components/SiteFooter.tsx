import Link from "next/link";
import { SWIPEED_URL } from "@/lib/links";

export default function SiteFooter() {
  return (
    <footer className="bg-band text-white">
      <div className="mx-auto grid max-w-6xl gap-8 px-5 py-12 sm:grid-cols-2 md:grid-cols-4">
        <div className="md:col-span-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo-reversed.svg" alt="The Equal Lens" className="h-9 w-auto" />
          <p className="mt-3 max-w-xs text-sm text-violet-100">
            Building awareness through play, one interaction at a time.
          </p>
          <p className="mt-2 font-hand text-violet-200">Unlearn. Relearn. Grow.</p>
        </div>

        <div>
          <h3 className="font-display text-sm font-semibold">Explore</h3>
          <ul className="mt-3 space-y-2 text-sm text-violet-100">
            <li><Link href="/programs" className="hover:text-white">Programs</Link></li>
            <li><Link href="/blog" className="hover:text-white">Blogs</Link></li>
            <li><Link href="/about" className="hover:text-white">About</Link></li>
            <li><Link href="/join" className="hover:text-white">Join us</Link></li>
            <li><Link href="/donate" className="hover:text-white">Donate</Link></li>
            <li>
              <a href={SWIPEED_URL} target="_blank" rel="noreferrer" className="hover:text-white">
                Play SwipeEd
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="font-display text-sm font-semibold">Connect</h3>
          <ul className="mt-3 space-y-2 text-sm text-violet-100">
            <li>
              <a href="mailto:support@theequallens.com" className="hover:text-white">
                support@theequallens.com
              </a>
            </li>
            <li>
              <a
                href="https://www.instagram.com/theequallensorg/"
                target="_blank"
                rel="noreferrer"
                className="hover:text-white"
              >
                Instagram
              </a>
            </li>
            <li>
              <a
                href="https://www.linkedin.com/company/the-equal-lens/"
                target="_blank"
                rel="noreferrer"
                className="hover:text-white"
              >
                LinkedIn
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/15 py-4 text-center text-xs text-violet-200">
        © 2026 The Equal Lens. All rights reserved.
      </div>
    </footer>
  );
}
