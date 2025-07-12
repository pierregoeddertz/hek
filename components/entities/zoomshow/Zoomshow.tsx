'use client';

import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import styles from './Zoomshow.module.css';
import { NewsService } from '@/lib/services/news';

export interface SlideContent {
  id: string;
  image: string;
  title?: string;
  subtitle?: string;
  index?: string;
  label?: string;
}

export type ZoomshowProps = {
  slides?: SlideContent[];
  useDatabase?: boolean; // Flag to enable/disable database fetching
};

export default function Zoomshow({ slides: slidesProp, useDatabase = true }: ZoomshowProps = {}) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  // React Query for optimized data fetching with caching
  const { data: newsArticles, isLoading, error } = useQuery({
    queryKey: ['slideshow-content'],
    queryFn: async () => {
      const articles = await NewsService.getSlideshowContent();
      return articles.map((article: any, index: number) => ({
        id: article.id,
        image: article.image_url || '',
        title: article.title,
        subtitle: article.subtitle,
        index: String(index + 1).padStart(2, '0'),
        label: article.title,
      }));
    },
    enabled: useDatabase,
    staleTime: 5 * 60 * 1000, // 5 minutes - data stays fresh
    gcTime: 10 * 60 * 1000, // 10 minutes - cache duration
    refetchOnWindowFocus: false, // Don't refetch when window gains focus
    retry: 2, // Retry failed requests 2 times
  });

  const slides = useDatabase ? (newsArticles || []) : (slidesProp || []);

  // Show slides immediately when data is available
  useEffect(() => {
    if (slides.length > 0) {
      setIsVisible(true);
    }
  }, [slides.length]);

  // Preload all slide images once on mount so that transitions are seamless
  useEffect(() => {
    const images: HTMLImageElement[] = [];
    slides.forEach((s) => {
      if (s.image) {
        const img = new Image();
        img.src = s.image;
        images.push(img);
      }
    });

    // No cleanup required for preloaded images, but clear references to allow GC
    return () => {
      images.splice(0, images.length);
    };
  }, [slides]);

  // slideshow logic: fade-in (scale 1.1→1, opacity 0→1), hold 5s, immediate next
  useEffect(() => {
    if (slides.length <= 1) {
      // For single slide, just show it with animation
      setIsVisible(false);
      setTimeout(() => setIsVisible(true), 50);
      return;
    }

    if (isLoading) return; // Don't start rotation while loading

    // Show current slide (fade-in) for 750ms, hold 5s, then move to next

    // Start with new slide hidden
    setIsVisible(false);

    // Fade in after one frame
    const fadeInTimeout = setTimeout(() => setIsVisible(true), 50);

    // After 5s visible, prepare next slide
    const holdDuration = 5000; // ms fully visible
    const totalDuration = holdDuration + 750; // include fade-in time

    const nextTimeout = setTimeout(() => {
      // hide current immediately (no fade-out needed for hard cut)
      setIsVisible(false);

      // switch slide immediately without delay
      setCurrentSlide((p) => (p + 1) % slides.length);
    }, totalDuration);

    return () => {
      clearTimeout(fadeInTimeout);
      clearTimeout(nextTimeout);
    };
  }, [currentSlide, slides.length, isLoading]);

  // Don't render anything if no slides or still loading
  if (slides.length === 0 || isLoading) return null;
  
  const data = slides[currentSlide];

  return (
    <div className={styles.slideshow}>
      <div
        className={`${styles.slide} ${isVisible ? styles.visible : styles.hidden}`}
        style={{ backgroundImage: `url(${data.image})` }}
      />
    </div>
  );
} 