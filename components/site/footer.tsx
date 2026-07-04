import Link from "next/link";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-teal-darker/10 bg-teal-darker">
      <div className="mx-auto max-w-6xl px-6 py-14">
        <div className="grid gap-10 md:grid-cols-3">
          <div>
            <p className="font-serif text-lg font-bold text-white">Smile Center GH</p>
            <p className="mt-2 max-w-xs text-sm text-teal-light/80 text-white/70">
              Leading provider of cosmetic and preventive dental care, with 4 branches
              across Accra.
            </p>
          </div>
          <div>
            <p className="text-sm font-semibold text-gold">Quick Links</p>
            <ul className="mt-3 space-y-2 text-sm text-white/70">
              <li><Link href="/services" className="hover:text-white">Services</Link></li>
              <li><Link href="/branches" className="hover:text-white">Branches</Link></li>
              <li><Link href="/book" className="hover:text-white">Book Appointment</Link></li>
            </ul>
          </div>
          <div>
            <p className="text-sm font-semibold text-gold">Contact</p>
            <ul className="mt-3 space-y-2 text-sm text-white/70">
              <li>smilecentergh@hotmail.com</li>
              <li>smilecentergh.com</li>
              <li>+233 24 000 0000</li>
            </ul>
          </div>
        </div>
        <div className="mt-10 border-t border-white/10 pt-6 text-xs text-white/50">
          © {new Date().getFullYear()} Smile Center GH. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
