"use client";

import Image from 'next/image';
import { useState, useCallback, useEffect, useRef } from 'react';
import styles from './StickyWordGallery.module.css';
import Introducer from '../Introducer/Introducer';

// Wort-/Bild-Daten
const wordsData = [
  { word: 'Innovation', imageSrc: 'https://picsum.photos/seed/inno/1920/1080' },
  { word: 'Zukunft', imageSrc: 'https://picsum.photos/seed/zukunft/1920/1080' },
  { word: 'Technologie', imageSrc: 'https://picsum.photos/seed/tech/1920/1080' },
  { word: 'Fortschritt', imageSrc: 'https://picsum.photos/seed/fort/1920/1080' },
  { word: 'Vision', imageSrc: 'https://picsum.photos/seed/vision/1920/1080' },
  { word: 'Entdeckung', imageSrc: 'https://picsum.photos/seed/ent/1920/1080' },
  { word: 'Kreativität', imageSrc: 'https://picsum.photos/seed/kre/1920/1080' },
  { word: 'Wirkung', imageSrc: 'https://picsum.photos/seed/wirk/1920/1080' },
  { word: 'Wachstum', imageSrc: 'https://picsum.photos/seed/wach/1920/1080' },
  { word: 'Exzellenz', imageSrc: 'https://picsum.photos/seed/exz/1920/1080' },
];

export default function StickyWordGallery() {
  const [activeWord, setActiveWord] = useState(wordsData[0].word);
  const [currentImageSrc, setCurrentImageSrc] = useState(wordsData[0].imageSrc);

  const wordRefs = useRef<Array<HTMLLIElement | null>>([]);

  const handleScroll = useCallback(() => {
    if (typeof window === 'undefined') return;

    const viewportCenter = window.innerHeight / 2;
    let closest: string | null = null;
    let minDistance = Number.POSITIVE_INFINITY;

    wordRefs.current.forEach((el) => {
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const wordCenter = rect.top + rect.height / 2;
      const distance = Math.abs(wordCenter - viewportCenter);
      if (distance < minDistance) {
        minDistance = distance;
        closest = el.dataset.word ?? null;
      }
    });

    if (closest && closest !== activeWord) {
      setActiveWord(closest);
      const newImage = wordsData.find((w) => w.word === closest)?.imageSrc;
      if (newImage) setCurrentImageSrc(newImage);
    }
  }, [activeWord]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  return (
    <section className={styles.wrapper}>
      {/* Fixed Background */}
      <Image
        src={currentImageSrc}
        alt="Hintergrund"
        fill
        priority
        className={styles.bgImage}
        sizes="100vw"
      />

      {/* Scrollable Content */}
      <div className={styles.contentWrapper}>
        <div className={styles.introBlock}>
          <Introducer
            index="00"
            label="Galerie"
            title="Entdecken Sie die Zukunft"
            ctaLabel="Mehr erfahren"
            ctaHref="#services"
          />
        </div>

        <ul className={styles.wordList}>
          {wordsData.map((item, idx) => (
            <li
              key={item.word}
              ref={(el) => {
                wordRefs.current[idx] = el;
              }}
              data-word={item.word}
              className={item.word === activeWord ? styles.wordActive : undefined}
            >
              {item.word}
            </li>
          ))}
        </ul>

        <div className={styles.bottomSpacer}>Scrollen Sie weiter…</div>
      </div>
    </section>
  );
} 