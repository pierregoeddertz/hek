'use client';

import { useRef, useState, useEffect } from 'react';
import styles from './Dragger.module.css';

export type DraggerProps = {
  children?: React.ReactNode;
  className?: string;
};

export default function Dragger({ children, className = '' }: DraggerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [translate, setTranslate] = useState(0);
  // store limits in ref to avoid causing re-renders
  const limitsRef = useRef({ min: 0, max: 0 });

  const clamp = (val: number) => {
    const { min, max } = limitsRef.current;
    return Math.min(max, Math.max(min, val));
  };

  const dragState = useRef({ startX: 0, startTranslate: 0, dragging: false });
  const prevUserSelect = useRef<string | null>(null);
  // collect recent move samples to compute velocity at pointer up
  const moveSamples = useRef<{ x: number; t: number }[]>([]);
  const momentumRaf = useRef<number | null>(null);

  // Helper to stop running momentum animation
  const stopMomentum = () => {
    if (momentumRaf.current !== null) {
      cancelAnimationFrame(momentumRaf.current);
      momentumRaf.current = null;
    }
  };

  const onPointerDown = (e: React.PointerEvent) => {
    // Abort any running momentum so the next drag starts immediately
    stopMomentum();

    e.preventDefault();
    dragState.current = {
      startX: e.clientX,
      startTranslate: translate,
      dragging: true,
    };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    // disable text selection globally
    prevUserSelect.current = document.body.style.userSelect;
    document.body.style.userSelect = 'none';
    document.body.classList.add('noHighlight');
    // reset samples
    moveSamples.current = [{ x: e.clientX, t: performance.now() }];
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragState.current.dragging) return;
    const dx = e.clientX - dragState.current.startX;
    setTranslate(clamp(dragState.current.startTranslate + dx));

    // keep samples for velocity calculation (last 100 ms)
    const now = performance.now();
    const samples = moveSamples.current;
    samples.push({ x: e.clientX, t: now });
    // keep only last 100ms of data
    while (samples.length && now - samples[0].t > 100) {
      samples.shift();
    }
  };

  const endPointer = (e: React.PointerEvent) => {
    dragState.current.dragging = false;
    (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    document.body.classList.remove('noHighlight');
    restoreSelection();

    // compute velocity from samples (px/sec)
    const samples = moveSamples.current;
    let v = 0;
    if (samples.length >= 2) {
      const first = samples[0];
      const last = samples[samples.length - 1];
      const dt = last.t - first.t;
      if (dt > 0) v = ((last.x - first.x) / dt) * 1000;
    }

    // cap velocity to avoid crazy values
    v = Math.max(Math.min(v, 4000), -4000);

    const friction = 0.92; // closer to 1 → longer glide
    let lastTs = performance.now();

    const step = (now: number) => {
      const dt = now - lastTs; // ms
      lastTs = now;

      // exponential decay adjusted for variable frame time
      const frameFriction = Math.pow(friction, dt / 16.67);
      v *= frameFriction;

      if (Math.abs(v) < 5) return; // stop when very slow

      setTranslate((prev) => {
        const next = clamp(prev + (v * dt) / 1000);
        if (next === limitsRef.current.min || next === limitsRef.current.max) {
          v = 0;
        }
        return next;
      });

      if (v !== 0) momentumRaf.current = requestAnimationFrame(step);
    };

    stopMomentum();
    momentumRaf.current = requestAnimationFrame(step);
  };

  // Wheel / trackpad handler
  const onWheel = (e: React.WheelEvent) => {
    if (Math.abs(e.deltaX) < Math.abs(e.deltaY)) return; // ignore mostly vertical scroll
    e.preventDefault();
    setTranslate((prev) => clamp(prev - e.deltaX));
  };

  // Update limits on resize/content change
  useEffect(() => {
    const updateLimits = () => {
      const containerWidth = containerRef.current?.clientWidth ?? 0;
      const trackWidth = trackRef.current?.scrollWidth ?? 0;
      const max = 0;
      const min = Math.min(0, containerWidth - trackWidth);
      limitsRef.current = { min, max };
      // ensure translate fits within new bounds
      setTranslate((t) => clamp(t));
    };

    updateLimits();
    const ro = new ResizeObserver(updateLimits);
    if (containerRef.current) ro.observe(containerRef.current);
    if (trackRef.current) ro.observe(trackRef.current);
    window.addEventListener('resize', updateLimits);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', updateLimits);
    };
  }, []);

  const restoreSelection = () => {
    if (prevUserSelect.current !== null) {
      document.body.style.userSelect = prevUserSelect.current;
      prevUserSelect.current = null;
    }
  };

  return (
    <div
      ref={containerRef}
      className={`${styles.container} ${className}`.trim()}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endPointer}
      onPointerCancel={endPointer}
      onWheel={onWheel}
    >
      <div ref={trackRef} className={styles.track} style={{ transform: `translateX(${translate}px)` }}>
        {children}
      </div>
    </div>
  );
} 