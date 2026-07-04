import { Navbar } from "@/components/site/navbar";
import { Footer } from "@/components/site/footer";
import { Button } from "@/components/ui/primitives";
import { CheckCircle2 } from "lucide-react";

export default function BookingSuccessPage({
  searchParams,
}: {
  searchParams: { ref?: string };
}) {
  return (
    <>
      <Navbar />
      <section className="mx-auto max-w-lg px-6 py-24 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-teal-darker/10">
          <CheckCircle2 className="h-8 w-8 text-teal-darker" />
        </div>
        <h1 className="mt-6 font-serif text-3xl font-bold text-ink">Booking Confirmed!</h1>
        <p className="mt-3 text-muted">
          Thank you — we&apos;ve received your appointment request. A confirmation has
          been sent, and our team will reach out if anything needs adjusting.
        </p>
        {searchParams.ref && (
          <p className="mt-4 text-sm text-teal-darker">
            Reference: <span className="font-mono font-semibold">#{searchParams.ref}</span>
          </p>
        )}
        <Button href="/" className="mt-8">
          Back to Home
        </Button>
      </section>
      <Footer />
    </>
  );
}
