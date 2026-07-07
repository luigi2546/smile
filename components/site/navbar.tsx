"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/primitives";
import { useEffect, useState } from "react";

const links = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/membership", label: "Membership" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="sticky top-4 text-left">
      <div className="mx-auto max-w-6xl px-6">
        <div
          className={[
            "flex items-center justify-between gap-4 rounded-[2rem] border px-5 py-3 backdrop-blur-xl transition-all duration-300",
            scrolled
              ? "border-white/20 bg-white/98 shadow-2xl shadow-black/15"
              : "border-surface-strong bg-white/95 shadow-soft",
          ].join(" ")}
        >
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <div className="relative h-11 w-11 overflow-hidden rounded-2xl shadow-lg shadow-[#000a54]/20">
              <Image
                src="/logo.svg"
                alt="Smile Center GH logo"
                fill
                className="object-cover"
                priority
              />
            </div>
            <div>
              <p className="font-serif text-base font-bold text-ink leading-tight">
                Smile Center <span className="text-[#000a54]">GH.</span>
              </p>
              <p className="text-[10px] uppercase tracking-[0.35em] text-muted leading-none mt-0.5">
                Dental care in Accra
              </p>
            </div>
          </Link>

          {/* Nav links */}
          <nav className="hidden items-center gap-7 md:flex">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="text-sm font-semibold text-ink transition hover:text-[#000a54]"
              >
                {l.label}
              </Link>
            ))}
          </nav>

          {/* CTA */}
          <div className="hidden md:block">
            <Button href="/book" size="sm" variant="secondary">
              Book Appointment
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
