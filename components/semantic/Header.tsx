'use client';

import Link from 'next/link';
import styles from './Header.module.css';

interface HeaderProps {
  onMenuClick: () => void;
}

export default function Header({ onMenuClick }: HeaderProps) {
  return (
    <header className={styles.header} role="banner">
      <nav className={styles.nav} role="navigation" aria-label="Hauptnavigation">
        <div className={styles.navContainer}>
          {/* Logo */}
          <Link href="/" className={styles.logo} aria-label="HEK - Zur Startseite">
            <span className={styles.logoText}>HEK</span>
          </Link>
          
          {/* Menu Button */}
          <button 
            className={styles.menuButton}
            onClick={onMenuClick}
            aria-label="Navigation öffnen"
          >
            Menü
          </button>
        </div>
      </nav>
    </header>
  );
}
