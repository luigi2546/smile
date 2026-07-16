"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/primitives";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";

const links = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/membership", label: "Membership" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const router = useRouter();

  const warmRoute = (href: string) => {
    router.prefetch(href);
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!mobileMenuOpen) return;

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMobileMenuOpen(false);
    };

    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [mobileMenuOpen]);

  return (
    <header className="sticky top-4 z-40 text-left">
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
          <Link
            href="/"
            prefetch
            onMouseEnter={() => warmRoute("/")}
            onFocus={() => warmRoute("/")}
            className="flex items-center gap-3"
          >
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
          <nav className="hidden items-center gap-7 lg:flex">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                prefetch
                onMouseEnter={() => warmRoute(l.href)}
                onFocus={() => warmRoute(l.href)}
                className="text-sm font-semibold text-ink transition hover:text-[#000a54]"
              >
                {l.label}
              </Link>
            ))}
          </nav>

          {/* CTA */}
          <div className="hidden lg:block">
            <Button
              href="/book"
              size="sm"
              variant="secondary"
              onMouseEnter={() => warmRoute("/book")}
              onFocus={() => warmRoute("/book")}
            >
              Book Appointment
            </Button>
          </div>

          <button
            type="button"
            aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-navigation"
            onClick={() => setMobileMenuOpen((open) => !open)}
            className="inline-flex h-12 w-12 shrink-0 cursor-pointer items-center justify-center rounded-2xl border border-[#000a54]/15 bg-[#000a54] text-white shadow-sm transition hover:bg-[#001477] focus-ring lg:hidden"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {mobileMenuOpen && (
          <nav
            id="mobile-navigation"
            aria-label="Mobile navigation"
            className="mt-2 rounded-[1.75rem] border border-surface-strong bg-white p-3 shadow-2xl shadow-black/15 lg:hidden"
          >
            <div className="grid gap-1">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  prefetch
                  onClick={() => setMobileMenuOpen(false)}
                  onMouseEnter={() => warmRoute(link.href)}
                  onFocus={() => warmRoute(link.href)}
                  className="flex min-h-12 items-center rounded-2xl px-4 text-base font-semibold text-ink transition hover:bg-[#000a54]/5 hover:text-[#000a54] focus-ring"
                >
                  {link.label}
                </Link>
              ))}
              <Button
                href="/book"
                variant="secondary"
                className="mt-2 min-h-12 w-full"
                onClick={() => setMobileMenuOpen(false)}
                onMouseEnter={() => warmRoute("/book")}
                onFocus={() => warmRoute("/book")}
              >
                Book Appointment
              </Button>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
