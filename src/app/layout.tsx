import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, Figtree, Geist_Mono, Instrument_Serif } from "next/font/google";
import "./globals.css";

const display = Bricolage_Grotesque({ variable: "--font-display", subsets: ["latin"] });
const body = Figtree({ variable: "--font-body", subsets: ["latin"] });
const mono = Geist_Mono({ variable: "--font-mono", subsets: ["latin"] });
const serif = Instrument_Serif({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: "400",
  style: ["italic", "normal"],
});

export const metadata: Metadata = {
  title: "SAATHYAKI — Find your saathi",
  description:
    "SAATHYAKI connects you with real mentors for any problem — career, studies, money, startups and life. Video call or message, and pay only for the minutes you use. Launching soon.",
  openGraph: {
    title: "SAATHYAKI — Mentorship by the minute",
    description:
      "Video call or message a mentor for any problem. Pay only for the minutes you use. Join the waitlist.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#0e0918",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${body.variable} ${mono.variable} ${serif.variable} antialiased`}
    >
      <body className="min-h-full">
        {children}
        <div className="grain" aria-hidden />
      </body>
    </html>
  );
}
