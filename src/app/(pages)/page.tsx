import Slideshow from "@/components/Slideshow/Slideshow";
import Introducer from "@/components/Introducer/Introducer";
import ServiceDragger from "@/components/ServiceDragger";
import StickyWordGallery from "@/components/StickyWordGallery";

export default function Home() {
  return (
    <main>
      <Slideshow />

      <section className="content">
        <Introducer
          index="01"
          label="HEK"
          title="Innovation mit Tradition: Ihre Experten für zukunftsweisende Gebäude- & Klimatechnik"
          ctaLabel="Mehr erfahren"
          ctaHref="#more"
        >
          <p>
            Als familiengeführtes Unternehmen mit über 50 Jahren Erfahrung planen, bauen und warten wir
            hochmoderne Heiz-, Klima- und Lüftungssysteme für private wie gewerbliche Immobilien. Unser
            Ansatz verbindet traditionelle Handwerkskunst mit zukunftsweisender Technologie – für ein
            nachhaltiges Raumklima und maximale Energieeffizienz.
          </p>
          <br></br>
          <p>
            Wir begleiten Sie von der ersten Idee über die detailgenaue Planung bis hin zur
            schlüsselfertigen Umsetzung Ihres Projekts. Zertifizierte Qualität, transparente Prozesse
            und ein persönlicher Ansprechpartner gewährleisten dabei höchste Zuverlässigkeit.
          </p>
        </Introducer>
      </section>

      {/* Leistungen Dragger */}
      <section style={{ padding: '4rem 0' }}>
        <ServiceDragger />
      </section>

      {/* Sticky Word Gallery Section */}
      <StickyWordGallery />
    </main>
  );
} 