import Link from "next/link";
import { Button } from "@/components/ui/primitives";

const links = [
  { href: "/services", label: "Services" },
  { href: "/branches", label: "Branches" },
  { href: "/#membership", label: "Membership" },
];

export function Navbar() {
  return (
    <header className="sticky top-0 z-40 border-b border-teal-darker/10 bg-cream/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-teal-darker text-gold">
            <ToothMark />
          </span>
          <span className="font-serif text-lg font-bold tracking-tight text-teal-darker">
            Smile Center GH
          </span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-sm font-medium text-ink/70 transition-colors hover:text-teal-darker"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <Button href="/book" size="sm">
          Book Appointment
        </Button>
      </div>
    </header>
  );
}

function ToothMark() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C8 2 5 4.5 5 8c0 2 .5 3 1 5.5.5 2.5.5 6 1.8 7.8.6.8 1.5 1 2 .2.7-1.1.7-3.5 1.2-4.5.3-.7 1.6-.7 2 0 .5 1 .5 3.4 1.2 4.5.5.8 1.4.6 2-.2C17.5 19.5 17.5 16 18 13.5c.5-2.5 1-3.5 1-5.5 0-3.5-3-6-7-6z" />
    </svg>
  );
}
