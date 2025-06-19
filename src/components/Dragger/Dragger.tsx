'use client';

import { useRef, useState, useEffect } from 'react';
import styles from './Dragger.module.css';

export type DraggerProps = {
  children?: React.ReactNode;
  className?: string;
  centerFirst?: boolean;
};

export default function Dragger({ children, className = '', centerFirst = false }: DraggerProps) {
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
  // timestamp of last pointer move
  const lastMoveTs = useRef<number>(performance.now());
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

    // direct clamping without overscroll
    const raw = dragState.current.startTranslate + dx;
    setTranslate(clamp(raw));

    // keep samples for velocity calculation (last 100 ms)
    const now = performance.now();
    const samples = moveSamples.current;
    samples.push({ x: e.clientX, t: now });
    lastMoveTs.current = now;
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

    // If pointer has been nearly still (>100ms) before release, suppress momentum
    const stillFor = performance.now() - lastMoveTs.current;
    if (stillFor > 100) {
      v = 0;
    }

    // cap velocity to avoid crazy values
    v = Math.max(Math.min(v, 5000), -5000);

    // iOS-style momentum with exponential decay
    const friction = 0.95; // closer to 1 = longer momentum
    let lastTs = performance.now();

    const step = (now: number) => {
      const dt = (now - lastTs) / 1000; // seconds
      lastTs = now;

      // exponential decay
      v *= Math.pow(friction, dt * 60); // normalize to 60fps

      // clamp within bounds and stop if hitting limits
      const current = translateRef.current;
      const { min, max } = limitsRef.current;
      let next = current + v * dt;

      if (next > max) {
        next = max;
        v = 0;
      } else if (next < min) {
        next = min;
        v = 0;
      }

      setTranslate(next);

      if (v !== 0) momentumRaf.current = requestAnimationFrame(step);
    };

    stopMomentum();
    
    if (Math.abs(v) > 10) {
      momentumRaf.current = requestAnimationFrame(step);
    }
  };

  // Wheel / trackpad handler (clamped, no overscroll)
  const onWheel = (e: React.WheelEvent) => {
    if (Math.abs(e.deltaX) < Math.abs(e.deltaY)) return; // ignore mostly vertical scroll
    e.preventDefault();

    const next = clamp(translateRef.current - e.deltaX);
    setTranslate(next);
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
      if (centerFirst && trackRef.current) {
        const svgs = trackRef.current.querySelectorAll('svg');
        const firstEl = svgs[0] as Element | undefined;
        const lastEl = svgs[svgs.length - 1] as Element | undefined;
        if (firstEl) {
          const w = firstEl.getBoundingClientRect().width;
          trackRef.current.style.paddingLeft = `calc((100vw - ${w}px) / 2)`;
        }
        if (lastEl) {
          const w = lastEl.getBoundingClientRect().width;
          trackRef.current.style.paddingRight = `calc((100vw - ${w}px) / 2)`;
        }
      }
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