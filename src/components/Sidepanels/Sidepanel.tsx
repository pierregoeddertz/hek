"use client";

import React, { useEffect, useRef, useState } from "react";
import type { SidepanelContent } from "@/types/sidepanels";
import { sanitizeContent, getSidepanelTransitionDuration } from "@/utils/sidepanels";
import styles from "./Sidepanel.module.css";

interface SidepanelProps {
  isOpen: boolean;
  side: "left" | "right";
  content: SidepanelContent | null;
  onClose: () => void;
  onTransitionEnd?: () => void;
  error?: Error | null;
}

const TRANSITION_DURATION = typeof window !== "undefined" ? getSidepanelTransitionDuration() : 300;

const Sidepanel: React.FC<SidepanelProps> = ({
  isOpen,
  side,
  content,
  onClose,
  onTransitionEnd,
  error = null,
}) => {
  const sidepanelRef = useRef<HTMLDivElement>(null);
  const focusTrapRef = useRef<HTMLDivElement>(null);
  const sideRef = useRef(side);

  useEffect(() => {
    sideRef.current = side;
  }, [side]);

  const [shouldRender, setShouldRender] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  // Handle mount/unmount
  useEffect(() => {
    if (isOpen && content) {
      setShouldRender(true);
      const timer = requestAnimationFrame(() => {
        setTimeout(() => setIsVisible(true), 10);
      });
      return () => cancelAnimationFrame(timer);
    } else if (!isOpen && shouldRender) {
      setIsVisible(false);
    }
  }, [isOpen, content, shouldRender]);

  // Handle transition end and cleanup
  useEffect(() => {
    if (!isOpen && shouldRender) {
      const timer = setTimeout(() => {
        setShouldRender(false);
        onTransitionEnd?.();
      }, TRANSITION_DURATION);
      return () => clearTimeout(timer);
    } else if (isOpen) {
      onTransitionEnd?.();
    }
  }, [isOpen, shouldRender, onTransitionEnd]);

  // Escape key closes
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isOpen) {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      return () => document.removeEventListener("keydown", handleEscape);
    }
  }, [isOpen, onClose]);

  // Focus trap inside panel
  useEffect(() => {
    if (isOpen && focusTrapRef.current) {
      const focusable = focusTrapRef.current.querySelectorAll<HTMLElement>(
        "button, [href], input, select, textarea, [tabindex]:not([tabindex='-1'])"
      );
      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      const trap = (e: KeyboardEvent) => {
        if (e.key === "Tab") {
          if (e.shiftKey) {
            if (document.activeElement === first) {
              last?.focus();
              e.preventDefault();
            }
          } else if (document.activeElement === last) {
            first?.focus();
            e.preventDefault();
          }
        }
      };

      document.addEventListener("keydown", trap);
      first?.focus();
      return () => document.removeEventListener("keydown", trap);
    }
  }, [isOpen]);

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!shouldRender || !content) return null;

  return (
    <>
      <div
        className={`${styles.overlay} ${isVisible ? styles.overlayVisible : ""}`}
        onClick={handleOverlayClick}
        aria-hidden="true"
      />

      <aside
        ref={sidepanelRef}
        className={`${styles.sidepanel} ${styles[side]} ${isVisible ? styles.sidepanelVisible : ""}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="sidepanel-title"
        aria-describedby="sidepanel-content"
      >
        <div ref={focusTrapRef}>
          <div className={styles.sidepanelHeader}>
            <h2 id="sidepanel-title" className={styles.sidepanelTitle}>
              {content.title}
            </h2>
            <button
              className={styles.closeButton}
              onClick={onClose}
              aria-label="Sidepanel schließen"
              type="button"
            >
              ✕
            </button>
          </div>

          {error ? (
            <div className={styles.errorState}>
              <p>Ein Fehler ist aufgetreten: {error.message}</p>
              <button onClick={onClose}>Schließen</button>
            </div>
          ) : (
            <div id="sidepanel-content" className={styles.sidepanelContent}>
              <div dangerouslySetInnerHTML={{ __html: sanitizeContent(content.content) }} />
            </div>
          )}
        </div>
      </aside>
    </>
  );
};

export default Sidepanel; 