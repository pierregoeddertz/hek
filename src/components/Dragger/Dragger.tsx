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
  const velocityRef = useRef({ lastX: 0, lastTime: 0, v: 0 });
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
    velocityRef.current = { lastX: e.clientX, lastTime: performance.now(), v: 0 };
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragState.current.dragging) return;
    const now = performance.now();
    const dx = e.clientX - dragState.current.startX;
    setTranslate(clamp(dragState.current.startTranslate + dx));

    // compute velocity
    const vx = (e.clientX - velocityRef.current.lastX) / (now - velocityRef.current.lastTime);
    velocityRef.current = { lastX: e.clientX, lastTime: now, v: vx };
  };

  const endPointer = (e: React.PointerEvent) => {
    dragState.current.dragging = false;
    (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    document.body.classList.remove('noHighlight');
    restoreSelection();

    // start momentum animation
    let v = velocityRef.current.v * 1000; // px per sec
    const friction = 0.92; // lower value => quicker slowdown, feels snappier
    const step = () => {
      if (Math.abs(v) < 15) return; // stop if very slow

      setTranslate((prev) => {
        const next = clamp(prev + v * (1 / 60));
        // reverse velocity if hit bounds
        if (next === limitsRef.current.min || next === limitsRef.current.max) {
          v = 0;
        } else {
          v *= friction;
        }
        return next;
      });

      momentumRaf.current = requestAnimationFrame(step);
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