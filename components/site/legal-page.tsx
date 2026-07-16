import type { ReactNode } from "react";
import Link from "next/link";
import { FileText, Mail, Phone } from "lucide-react";
import { Navbar } from "@/components/site/navbar";
import { Footer } from "@/components/site/footer";

export function LegalPage({
  eyebrow,
  title,
  summary,
  updated,
  children,
}: {
  eyebrow: string;
  title: string;
  summary: string;
  updated: string;
  children: ReactNode;
}) {
  return (
    <>
      <section className="relative bg-[#000a54] px-6 pb-24 pt-0 text-white">
        <Navbar />
        <div className="mx-auto mt-16 max-w-3xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-amber-400/30 bg-amber-400/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-amber-300">
            <FileText className="h-4 w-4" /> {eyebrow}
          </span>
          <h1 className="mt-5 font-serif text-4xl font-bold sm:text-5xl">{title}</h1>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-white/75 sm:text-lg">{summary}</p>
          <p className="mt-5 text-sm font-medium text-amber-300">Last updated: {updated}</p>
        </div>
      </section>

      <main className="bg-cream px-5 py-12 sm:px-6 sm:py-16">
        <article className="mx-auto max-w-3xl rounded-[1.75rem] border border-teal/15 bg-white p-6 shadow-soft sm:p-10">
          <div className="legal-content space-y-9 text-base leading-7 text-slate-700">{children}</div>

          <aside className="mt-12 rounded-2xl border border-teal/20 bg-teal/5 p-5">
            <h2 className="font-serif text-xl font-bold text-ink">Questions about these terms?</h2>
            <p className="mt-2 text-sm leading-6 text-muted">Contact Smile Center GH and we will be happy to help.</p>
            <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <a href="mailto:smilecentergh2@gmail.com" className="inline-flex min-h-11 items-center gap-2 font-semibold text-teal-darker hover:underline">
                <Mail className="h-4 w-4" /> smilecentergh2@gmail.com
              </a>
              <a href="tel:+233245127775" className="inline-flex min-h-11 items-center gap-2 font-semibold text-teal-darker hover:underline">
                <Phone className="h-4 w-4" /> +233 24 512 7775
              </a>
            </div>
          </aside>

          <div className="mt-8 flex flex-wrap gap-4 text-sm font-semibold">
            <Link href="/privacy" className="text-teal-darker hover:underline">Privacy Policy</Link>
            <Link href="/terms" className="text-teal-darker hover:underline">Terms &amp; Conditions</Link>
            <Link href="/contact" className="text-teal-darker hover:underline">Contact Us</Link>
          </div>
        </article>
      </main>
      <Footer />
    </>
  );
}

export function LegalSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section>
      <h2 className="font-serif text-2xl font-bold text-ink">{title}</h2>
      <div className="mt-3 space-y-3">{children}</div>
    </section>
  );
}
