'use client';

import { useRef, useState, useEffect, useCallback } from 'react';
import styles from './Dragger.module.css';
import Director from '@/components/layout/director/Director';
import { debounce } from 'lodash';

export type DraggerProps = {
  children?: React.ReactNode;
  className?: string;
  centerFirst?: boolean;
  style?: React.CSSProperties;
};

export default function Dragger({
  children,
  className = '',
  centerFirst = false,
  style,
}: DraggerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  // --- TRANSLATE STATE ---
  const translateRef = useRef(0);
  const [, forceUpdate] = useState({});

  const rafPending = useRef<number | null>(null);
  const latestTranslate = useRef(0);

  const setTranslate = useCallback((x: number) => {
    translateRef.current = x;
    latestTranslate.current = x;
    if (trackRef.current) {
      trackRef.current.style.transform = `translateX(${x}px)`;
    }
    if (rafPending.current === null) {
      rafPending.current = requestAnimationFrame(() => {
        forceUpdate({});
        rafPending.current = null;
      });
    }
  }, []);

  // --- LIMITS ---
  const limitsRef = useRef({ min: 0, max: 0 });
  const clamp = useCallback((x: number) => {
    const { min, max } = limitsRef.current;
    return Math.min(max, Math.max(min, x));
  }, []);

  // --- DRAGGING ---
  const dragState = useRef<{ startX: number; startT: number; dragging: boolean; hasMoved: boolean }>({
    startX: 0,
    startT: 0,
    dragging: false,
    hasMoved: false,
  });

  const onPointerDown = (e: React.PointerEvent) => {
    e.preventDefault();
    stopMomentum();
    dragState.current = {
      startX: e.clientX,
      startT: translateRef.current,
      dragging: true,
      hasMoved: false,
    };
    e.currentTarget.setPointerCapture(e.pointerId);
    document.body.style.userSelect = 'none';
    document.body.classList.add('draggerTrue');
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragState.current.dragging) return;
    const dx = e.clientX - dragState.current.startX;
    
    // Markiere als bewegt wenn sich die Position um mehr als 5px geändert hat
    if (Math.abs(dx) > 5) {
      dragState.current.hasMoved = true;
    }
    
    setTranslate( clamp(dragState.current.startT + dx) );
  };

  const onPointerUp = (e: React.PointerEvent) => {
    if (!dragState.current.dragging) return;
    
    // Wenn gedraggt wurde, verhindere Klicks auf Children
    if (dragState.current.hasMoved) {
      // Setze ein Flag für den nächsten Click-Event
      document.body.setAttribute('data-dragger-has-moved', 'true');
      
      // Entferne das Flag nach einer kurzen Verzögerung
      setTimeout(() => {
        document.body.removeAttribute('data-dragger-has-moved');
      }, 100);
    }
    
    dragState.current.dragging = false;
    e.currentTarget.releasePointerCapture(e.pointerId);
    document.body.style.userSelect = '';
    document.body.classList.remove('draggerTrue');
    startMomentum();
  };

  // --- MOMENTUM ---
  const moveSamples = useRef<Array<{ x: number; t: number }>>([]);
  const momentumRaf = useRef<number | null>(null);

  const stopMomentum = () => {
    if (momentumRaf.current) {
      cancelAnimationFrame(momentumRaf.current);
      momentumRaf.current = null;
    }
  };

  const startMomentum = () => {
    // compute velocity from samples
    const samples = moveSamples.current;
    let v = 0;
    if (samples.length > 1) {
      const first = samples[0], last = samples[samples.length - 1];
      v = ((last.x - first.x) / (last.t - first.t)) * 1000;
    }
    v = Math.max(-5000, Math.min(5000, v));
    const friction = 0.93;
    let lastTs = performance.now();

    const step = (now: number) => {
      const dt = (now - lastTs) / 1000;
      lastTs = now;
      v *= Math.pow(friction, dt * 60);
      const next = clamp( translateRef.current + v * dt );
      setTranslate(next);
      if (Math.abs(v) > 40) {
        momentumRaf.current = requestAnimationFrame(step);
      } else {
        document.body.classList.remove('draggerTrue');
      }
    };

    if (Math.abs(v) > 10) {
      momentumRaf.current = requestAnimationFrame(step);
    } else {
      document.body.classList.remove('draggerTrue');
    }
  };

  // collect samples on move
  const onPointerMoveSample = (e: React.PointerEvent) => {
    if (!dragState.current.dragging) return;
    const now = performance.now();
    moveSamples.current.push({ x: e.clientX, t: now });
    while (moveSamples.current[0] && now - moveSamples.current[0].t > 100) {
      moveSamples.current.shift();
    }
  };

  // --- WHEEL LOCK WITH DEBOUNCE ---
  // Add class on first horizontal wheel, remove after debounce timeout
  const removeClassDebounced = useRef(
    debounce(() => {
      document.body.classList.remove('draggerTrue');
    }, 450)
  ).current;

  const onWheel = (e: React.WheelEvent) => {
    if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
      e.preventDefault();
      document.body.classList.add('draggerTrue');
      const next = clamp( translateRef.current - e.deltaX );
      setTranslate(next);
      removeClassDebounced();
    }
    // vertical scroll: do nothing special
  };

  // --- CLICK PREVENTION ---
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      // Prüfe ob das geklickte Element im Dragger ist
      const target = e.target as Element;
      const isInDragger = target.closest('[data-dragger="true"]');
      
      // Wenn gerade gedraggt wurde und das Element im Dragger ist, verhindere den Click
      if (isInDragger && document.body.getAttribute('data-dragger-has-moved') === 'true') {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }
    };

    // Event-Listener mit capture: true um vor anderen Handlern zu greifen
    document.addEventListener('click', handleClick, true);
    
    return () => {
      document.removeEventListener('click', handleClick, true);
    };
  }, []);

  // --- UPDATE LIMITS ON RESIZE/CONTENT CHANGE ---
  useEffect(() => {
    const updateLimits = () => {
      const wC = containerRef.current?.clientWidth || 0;
      const wT = trackRef.current?.scrollWidth || 0;
      limitsRef.current = { min: Math.min(0, wC - wT), max: 0 };
      if (centerFirst && trackRef.current) {
        // center first & last child
        const svgs = trackRef.current.querySelectorAll('svg');
        if (svgs[0]) trackRef.current.style.paddingLeft = `calc((100vw - ${svgs[0].getBoundingClientRect().width}px)/2)`;
        if (svgs[svgs.length - 1]) trackRef.current.style.paddingRight = `calc((100vw - ${svgs[svgs.length - 1].getBoundingClientRect().width}px)/2)`;
      }
      setTranslate( clamp(translateRef.current) );
    };

    updateLimits();
    const ro = new ResizeObserver(updateLimits);
    if (containerRef.current) ro.observe(containerRef.current);
    if (trackRef.current) ro.observe(trackRef.current);

    window.addEventListener('resize', updateLimits);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', updateLimits);
      removeClassDebounced.cancel();
      stopMomentum();
    };
  }, [centerFirst, clamp, removeClassDebounced, setTranslate]);

  return (
    <div
      ref={containerRef}
      className={`${styles.root} ${className}`}
      style={style}
      data-dragger="true"
      onPointerDown={onPointerDown}
      onPointerMove={(e) => { onPointerMove(e); onPointerMoveSample(e); }}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      onWheel={onWheel}
    >
      <Director ref={trackRef} gap={undefined} direction="horizontal">
        {children}
      </Director>
    </div>
  );
} 