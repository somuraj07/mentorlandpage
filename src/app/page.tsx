import { Intro } from "@/components/Intro";
import { Nav } from "@/components/Nav";
import { Hero } from "@/components/Hero";
import { Bands, Showcase, HowItWorks, Modes } from "@/components/Story";
import { Pricing, Categories, Mentors, FAQ, FinalCTA, Footer } from "@/components/Closing";
import { Providers } from "@/components/Providers";

export default function Home() {
  return (
    <Providers>
      <Intro />
      <Nav />
      <main>
        <Hero />
        <Bands />
        <Showcase />
        <HowItWorks />
        <Modes />
        <Pricing />
        <Categories />
        <Mentors />
        <FAQ />
        <FinalCTA />
      </main>
      <Footer />
    </Providers>
  );
}
