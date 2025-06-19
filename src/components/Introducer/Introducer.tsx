'use client';

import styles from "./Introducer.module.css";
import { ReactNode } from "react";
import Button from "@/components/Button/Button";
import { useState, useRef, useEffect } from "react";

export type IntroducerProps = {
  index?: string;
  label?: string;
  title: string;
  subtitle?: string;
  ctaLabel?: string;
  ctaHref?: string;
  children?: ReactNode;
};

export default function Introducer({ index, label, title, subtitle, ctaLabel: _ctaLabel, ctaHref: _ctaHref = "#", children }: IntroducerProps) {
  // Manage accordion open state
  const [open, setOpen] = useState(false);
  const accRef = useRef<HTMLDivElement>(null);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    const el = accRef.current;
    if (!el) return;
    // ensure correct height on initial render according to open state
    el.style.maxHeight = open ? `${el.scrollHeight}px` : "0px";
  }, [children]);

  const toggleOpen = () => {
    const el = accRef.current;
    if (!el) {
      setOpen((p) => !p);
      return;
    }

    const isOpening = !open;

    // Ensure proper animation by resetting then setting target height in next frame
    if (isOpening) {
      // opening
      el.style.maxHeight = "0px";
      requestAnimationFrame(() => {
        el.style.maxHeight = `${el.scrollHeight}px`;
      });
    } else {
      // closing
      el.style.maxHeight = `${el.scrollHeight}px`;
      requestAnimationFrame(() => {
        el.style.maxHeight = "0px";
      });
    }

    setOpen(isOpening);
  };

  return (
    <section className={styles.root}>
      <header className={styles.header}>
        {(index || label) && (
          <div className={styles.meta}>
            {index && <span className={styles.index}>{index}</span>}
            {index && label && <span className={styles.metaSep} aria-hidden="true" />}
            {label && <span className={styles.label}>{label}</span>}
          </div>
        )}

        <h2 className={styles.title}>{title}</h2>
        {subtitle && <h2 className={styles.subtitle}>{subtitle}</h2>}
      </header>

      {/* Accordion content for SEO (always in DOM) */}
      {children && (
        <div ref={accRef} className={styles.accordion} aria-hidden={!open}>
          <div className={styles.accInner}>{children}</div>
        </div>
      )}

      {/* Action row */}
      <nav className={styles.actions} aria-label="primary actions">
        {/* Special Button: hasArm up left with label switch */}
        <Button
          hasArm
          direction="up"
          side="left"
          onClick={toggleOpen}
          frontLabel={"Mehr erfahren"}
          backLabel={"Zurück"}
          showBack={open}
        />
      </nav>
    </section>
  );
} 