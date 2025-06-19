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
  // React state only used for occasional re-render when limits change
  const [, _force] = useState({});
  // keep latest value in ref for direct access without re-render
  const translateRef = useRef(0);

  // throttle React state updates to once per animation frame to avoid jank
  const rafPending = useRef<number | null>(null);
  const latestVal = useRef(0);
  const setTranslate = (val: number) => {
    translateRef.current = val;
    latestVal.current = val;
    // apply transform immediately for buttery smoothness
    if (trackRef.current) {
      trackRef.current.style.transform = `translateX(${val}px)`;
    }
    if (rafPending.current === null) {
      rafPending.current = requestAnimationFrame(() => {
        _force({});
        rafPending.current = null;
      });
    }
  };

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
      startTranslate: translateRef.current,
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

    // allow elastic overscroll (30% of overflow)
    const raw = dragState.current.startTranslate + dx;
    const { min, max } = limitsRef.current;
    let next = raw;
    if (raw > max) {
      next = max + (raw - max) * 0.3;
    } else if (raw < min) {
      next = min + (raw - min) * 0.3;
    }

    setTranslate(next);

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
    v = Math.max(Math.min(v, 5000), -5000);

    // constant deceleration for more native feel
    const decel = 3500; // px per sec² – höher => stoppt schneller
    const sign = Math.sign(v) || 1;
    let lastTs = performance.now();

    const step = (now: number) => {
      const dt = (now - lastTs) / 1000; // seconds
      lastTs = now;

      v -= sign * decel * dt;

      // stop when velocity reversed or nearly zero
      if (sign * v <= 10) return;

      // elastic overscroll during momentum
      const rawNext = translateRef.current + v * dt;
      const { min, max } = limitsRef.current;
      let next = rawNext;
      if (rawNext > max) {
        next = max + (rawNext - max) * 0.3;
      } else if (rawNext < min) {
        next = min + (rawNext - min) * 0.3;
      }
      if (next === limitsRef.current.min || next === limitsRef.current.max) {
        v = 0;
      }
      setTranslate(next);

      if (v !== 0) momentumRaf.current = requestAnimationFrame(step);
    };

    // after momentum stops, snap back if overstretched
    const maybeSnapBack = () => {
      const { min, max } = limitsRef.current;
      const current = translateRef.current;
      if (current >= min && current <= max) return; // inside bounds

      const start = current;
      const end = clamp(current);
      const duration = 300;
      const startTs = performance.now();

      const animate = (now: number) => {
        const progress = Math.min(1, (now - startTs) / duration);
        const ease = 1 - Math.pow(1 - progress, 3); // cubic ease-out
        setTranslate(start + (end - start) * ease);
        if (progress < 1) requestAnimationFrame(animate);
      };
      requestAnimationFrame(animate);
    };

    stopMomentum();
    momentumRaf.current = requestAnimationFrame(step);
    // ensure snap back when animation ends
    setTimeout(maybeSnapBack, 400);
  };

  // Wheel / trackpad handler
  const onWheel = (e: React.WheelEvent) => {
    if (Math.abs(e.deltaX) < Math.abs(e.deltaY)) return; // ignore mostly vertical scroll
    e.preventDefault();
    setTranslate(clamp(translateRef.current - e.deltaX));
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
      setTranslate(clamp(translateRef.current));
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
      <div ref={trackRef} className={styles.track}>
        {children}
      </div>
    </div>
  );
} 