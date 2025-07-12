'use client';

import { useEffect, useRef } from 'react';
import styles from './SidePanel.module.css';

interface SidePanelProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  position?: 'left' | 'right';
  width?: string;
}

export default function SidePanel({
  isOpen,
  onClose,
  title = 'Navigation',
  children,
  position = 'right',
  width = '300px'
}: SidePanelProps) {
  const panelRef = useRef<HTMLDivElement>(null);

  // Close panel when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      // Prevent body scroll when panel is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  // Handle escape key to close panel
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div 
          className={styles.overlay}
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Side Panel */}
      <aside 
        ref={panelRef}
        className={`${styles.panel} ${isOpen ? styles.panelOpen : ''} ${styles[`panel${position.charAt(0).toUpperCase() + position.slice(1)}`]}`}
        style={{ width }}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        aria-hidden={!isOpen}
      >
        <div className={styles.panelHeader}>
          <h2 className={styles.panelTitle}>{title}</h2>
          <button 
            className={styles.closeButton}
            onClick={onClose}
            aria-label="Schließen"
          >
            <span aria-hidden="true">×</span>
          </button>
        </div>

        <div className={styles.panelContent}>
          {children}
        </div>
      </aside>
    </>
  );
} 