import Slideshow from "@/components/Slideshow/Slideshow";
import Introducer from "@/components/Introducer/Introducer";
import Dragger from "@/components/Dragger/Dragger";
import Button from "@/components/Button/Button";

const galleryImages = Array.from({ length: 8 }, (_, i) => `https://picsum.photos/seed/news${i}/400/400`);

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

      {/* Dragger showcase (moved) */}
      <section style={{ padding: '4rem 0' }}>
        <Dragger centerFirst>
          <div style={{ display: 'flex', gap: 'var(--v_8)', margin: '0 auto' }}>
            <div style={{ position: 'relative', display: 'inline-block', color: 'var(--b)', textAlign: 'center' }}>
              <svg width="322" height="381" viewBox="0 0 322 381" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M0.607178 51.6413V380.625H85.6488V148.646V0.625L0.607178 51.6413Z" fill="currentColor"/>
                <path d="M235.823 148.646H85.6488L138.746 222.375H235.823V380.625L321.399 329.276V0.625H235.823V148.646Z" fill="currentColor"/>
              </svg>
              {/* up-left (default) */}
              <Button hasArm frontLabel="Mehr" />
            </div>
            <div style={{ position: 'relative', display: 'inline-block', color: 'var(--b)', textAlign: 'center' }}>
              <svg width="275" height="381" viewBox="0 0 275 381" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M254.99 222.375V150.799H85.4408L136.992 222.375H254.99Z" fill="currentColor"/>
                <path d="M85.4408 150.799V73.8192H271.143V0.625H53.1059L0.39917 73.8192V380.625H221.658L274.364 307.416H85.4408V150.799Z" fill="currentColor"/>
              </svg>
              {/* up-right */}
              <Button hasArm side="right" frontLabel="Mehr" />
            </div>
            <div data-first style={{ position: 'relative', display: 'inline-block', color: 'var(--b)', textAlign: 'center' }}>
              <svg width="333" height="381" viewBox="0 0 333 381" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M190.4 208.591H89.7402L85.4203 208.62L227.705 380.625H332.714L190.4 208.591Z" fill="currentColor"/>
                <path d="M316.576 0.625H213.589L85.4202 120.4V0.625H0.364014V380.625H85.4202L85.4203 208.62L316.576 0.625Z" fill="currentColor"/>
              </svg>
              {/* down-left */}
              <Button hasArm direction="down" frontLabel="Mehr" />
            </div>
          </div>
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