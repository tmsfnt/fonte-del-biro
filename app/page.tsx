import Catalogue from "@/components/Catalogue";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import Locations from "@/components/Locations";
import Navbar from "@/components/Navbar";
import { LangProvider } from "@/lib/i18n";

export default function HomePage(): JSX.Element {
  return (
    // NOTA: nessun overflow-x qui — romperebbe lo sticky in Hero/Locations.
    <main className="relative w-full bg-canvas">
      <LangProvider>
        <Navbar />
        <Hero />
        <Locations />
        <Catalogue />
        <Footer />
      </LangProvider>
    </main>
  );
}
