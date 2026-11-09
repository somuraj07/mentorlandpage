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
  title: "SAATHYAKI — Consoling and problem solving with mentors",
  description:
    "SAATHYAKI is one-on-one consoling and problem solving with real mentors. Talk through your career, studies, money, startup or personal problems on video call or chat, and pay only for the minutes you use. Launching soon.",
  openGraph: {
    title: "SAATHYAKI — Consoling and problem solving, by the minute",
    description:
      "Video call or chat with a mentor about any problem. Get a consoling ear and practical solutions, and pay only for the minutes you use. Join the waitlist.",
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
      </body>
    </html>
  );
}
