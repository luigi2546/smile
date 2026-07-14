import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Smile Center GH — Leading Cosmetic & Preventive Dental Care in Accra",
  description:
    "Book teeth whitening, cleaning, and smile makeovers at Smile Center GH. 4 branches across Accra.",
  icons: {
    icon: [{ url: "/logo.svg", type: "image/svg+xml" }],
    shortcut: "/logo.svg",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
