import Link from "next/link";
import Image from "next/image";

export function Footer() {
  return (
    <footer className="mt-24 bg-[#000a54] text-white">
      <div className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-3">

          {/* Brand column */}
          <div className="space-y-5">
            <div className="flex items-center gap-3">
              <div className="relative h-14 w-14 overflow-hidden rounded-2xl shadow-lg shadow-black/30 border border-white/10">
                <Image
                  src="/logo.svg"
                  alt="Smile Center GH logo"
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <p className="font-serif text-xl font-bold text-white leading-tight">
                  Smile Center <span className="text-amber-400">GH.</span>
                </p>
                <p className="text-[10px] uppercase tracking-widest text-white/50 mt-0.5">
                  Dental care in Accra
                </p>
              </div>
            </div>
            <p className="max-w-xs text-sm leading-relaxed text-white/60">
              Accra&apos;s leading provider of laser teeth whitening, cosmetic and preventive dental care. Combining world-class expertise with modern convenience.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <p className="text-xs font-bold uppercase tracking-widest text-amber-400">Quick Links</p>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/services" className="text-white/70 transition hover:text-white hover:underline">
                  Services
                </Link>
              </li>
              <li>
                <Link href="/branches" className="text-white/70 transition hover:text-white hover:underline">
                  Our Location
                </Link>
              </li>
              <li>
                <Link href="/membership" className="text-white/70 transition hover:text-white hover:underline">
                  Membership (Smile Club)
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-white/70 transition hover:text-white hover:underline">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-white/70 transition hover:text-white hover:underline">
                  Contact &amp; Support
                </Link>
              </li>
              <li>
                <Link href="/book" className="text-white/70 transition hover:text-white hover:underline font-medium">
                  Book Appointment
                </Link>
              </li>
              <li>
                <Link href="/admin/login" className="text-white/40 transition hover:text-white hover:underline text-xs">
                  Admin Sign In
                </Link>
              </li>
            </ul>
          </div>

          {/* Get In Touch */}
          <div className="space-y-4">
            <p className="text-xs font-bold uppercase tracking-widest text-amber-400">Get In Touch</p>
            <ul className="space-y-3 text-sm">
              <li className="flex flex-col">
                <span className="text-xs uppercase tracking-wide text-white/50 mb-0.5">Email</span>
                <a
                  href="mailto:smilecentergh2@gmail.com"
                  className="text-white/80 hover:text-white transition hover:underline"
                >
                  smilecentergh2@gmail.com
                </a>
              </li>
              <li className="flex flex-col">
                <span className="text-xs uppercase tracking-wide text-white/50 mb-0.5">Website</span>
                <a
                  href="https://smilecentergh.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/80 hover:text-white transition hover:underline"
                >
                  smilecentergh.com
                </a>
              </li>
              <li className="flex flex-col">
                <span className="text-xs uppercase tracking-wide text-white/50 mb-0.5">Phone / WhatsApp</span>
                <a
                  href="tel:+233245127775"
                  className="text-white/80 hover:text-white transition hover:underline"
                >
                  +233 24 512 7775
                </a>
              </li>
              <li className="flex flex-col">
                <span className="text-xs uppercase tracking-wide text-white/50 mb-0.5">Hours</span>
                <span className="text-white/80">Mon – Sat · 8:00 AM – 6:00 PM</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 border-t border-white/10 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/70">
          <div className="flex flex-col sm:flex-row items-center gap-2">
            <p className="text-white/90">© {new Date().getFullYear()} Smile Center GH. All rights reserved.</p>
            <span className="hidden sm:inline text-white/40">·</span>
            <p className="text-white/60">
              Powered by{" "}
              <span className="text-white/80 font-semibold tracking-wide">
                Mavros Black™
              </span>
            </p>
          </div>
          <div className="flex gap-4">
            <Link href="/privacy" className="hover:text-white transition">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-white transition">Terms &amp; Conditions</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
