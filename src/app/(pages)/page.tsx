import Slideshow from "@/components/Slideshow/Slideshow";
import Introducer from "@/components/Introducer/Introducer";
import Dragger from "@/components/Dragger/Dragger";
import Button from "@/components/Button/Button";

export default function Home() {
  return (
    <main>
      <Slideshow />

      <section style={{ maxWidth: '1150px', margin: '0 auto', padding: '0 var(--v_4)' }}>
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

      {/* Dragger showcase (moved) */}
      <section style={{ padding: '4rem 0' }}>
        <h2 style={{ marginBottom: 'var(--v_2)' }}>Draggable Showcase</h2>
        <Dragger>
          {["vercel.svg", "globe.svg", "window.svg", "next.svg", "file.svg", "vercel.svg"].map((src, i) => (
            <img key={i} src={`/${src}`} alt={src} style={{ width: 200, height: 120, objectFit: 'contain' }} />
          ))}
        </Dragger>
      </section>

      <section style={{ minHeight: '120vh', padding: '4rem', background: '#f5f5f5' }}>
        <h2>Beispiellayout</h2>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed non risus. Suspendisse lectus
          tortor, dignissim sit amet, adipiscing nec, ultricies sed, dolor. Cras elementum ultrices
          diam. Maecenas ligula massa, varius a, semper congue, euismod non, mi.
        </p>
      </section>

      <section style={{ minHeight: '120vh', padding: '4rem', background: '#ddd' }}>
        <h2>Weiterer Inhalt</h2>
        <p>
          Proin porttitor, orci nec nonummy molestie, enim est eleifend mi, non fermentum diam nisl
          sit amet erat. Duis semper. Duis arcu massa, scelerisque vitae, consequat in, pretium a,
          enim. Pellentesque congue.
        </p>
      </section>
    </main>
  );
} 