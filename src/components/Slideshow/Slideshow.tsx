'use client';

import { useState, useEffect } from 'react';
import styles from './Slideshow.module.css';

interface SlideContent {
  id: string;
  image: string;
  title?: string;
  subtitle?: string;
}

const staticSlides: SlideContent[] = [
  {
    id: '1',
    image: 'https://picsum.photos/seed/slide1/1200/800',
    title: 'Willkommen',
    subtitle: 'Entdecken Sie unsere Welt',
  },
  {
    id: '2',
    image: 'https://picsum.photos/seed/slide2/1200/800',
    title: 'Innovation',
    subtitle: 'Gemeinsam in die Zukunft',
  },
  {
    id: '3',
    image: 'https://picsum.photos/seed/slide3/1200/800',
    title: 'Technologie',
    subtitle: 'Modernste Lösungen',
  },
];

export default function Slideshow() {
  const [slides, setSlides] = useState<SlideContent[]>(staticSlides);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  // slideshow logic: fade-in (scale 1.1→1, opacity 0→1), hold 5s, hard cut
  useEffect(() => {
    // Show current slide (fade-in) for 0.4s, hold 5s, then move to next

    // Start with new slide hidden
    setIsVisible(false);

    // Fade in after one frame
    const fadeInTimeout = setTimeout(() => setIsVisible(true), 50);

    // After 5s visible, prepare next slide
    const holdDuration = 5000; // ms fully visible
    const totalDuration = holdDuration + 400; // include fade-in time

    const nextTimeout = setTimeout(() => {
      // hide current immediately (no fade-out needed for hard cut)
      setIsVisible(false);

      // switch slide after it has been hidden to avoid flicker
      setTimeout(() => {
        setCurrentSlide((p) => (p + 1) % slides.length);
      }, 10); // small delay so class update flushed
    }, totalDuration);

    return () => {
      clearTimeout(fadeInTimeout);
      clearTimeout(nextTimeout);
    };
  }, [currentSlide, slides.length]);

  if (slides.length === 0) return null;
  const data = slides[currentSlide];

  return (
    <div className={styles.slideshow}>
      <div
        className={`${styles.slide} ${isVisible ? styles.visible : styles.hidden}`}
        style={{ backgroundImage: `url(${data.image})` }}
      >
        <div className={styles.overlay}>
          <div className={styles.content}>
            {data.subtitle && <p className={styles.subtitle}>{data.subtitle}</p>}
            {data.title && <h1 className={styles.title}>{data.title}</h1>}
          </div>
        </div>
      </div>
    </div>
  );
} 