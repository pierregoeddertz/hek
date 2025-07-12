'use client';

import Link from 'next/link';
import { useState } from 'react';
import styles from './Navigation.module.css';

interface NavigationProps {
  onNavigate?: () => void;
}

export default function Navigation({ onNavigate }: NavigationProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleNavigate = () => {
    if (onNavigate) {
      onNavigate();
    }
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <nav className={styles.navigation} role="navigation" aria-label="Hauptnavigation">
      <ul className={styles.navList} role="menu">
        <li role="none">
          <Link 
            href="/" 
            onClick={handleNavigate}
            role="menuitem"
            className={styles.navLink}
          >
            Home
          </Link>
        </li>
        <li role="none">
          <Link 
            href="/news" 
            onClick={handleNavigate}
            role="menuitem"
            className={styles.navLink}
          >
            News
          </Link>
        </li>
        <li role="none" className={styles.dropdownContainer}>
          <button 
            className={styles.dropdownButton}
            onClick={toggleDropdown}
            aria-expanded={isDropdownOpen}
            aria-haspopup="true"
            role="menuitem"
          >
            Produkte
            <span className={styles.dropdownArrow} aria-hidden="true">
              {isDropdownOpen ? '▲' : '▼'}
            </span>
          </button>
          <ul 
            className={`${styles.dropdownMenu} ${isDropdownOpen ? styles.dropdownOpen : ''}`}
            role="menu"
            aria-label="Produkt Untermenü"
          >
            <li role="none">
              <Link 
                href="/aeroleaf" 
                onClick={handleNavigate}
                role="menuitem"
                className={styles.dropdownLink}
              >
                Aeroleaf
              </Link>
            </li>
            <li role="none">
              <Link 
                href="/smartflower" 
                onClick={handleNavigate}
                role="menuitem"
                className={styles.dropdownLink}
              >
                Smartflower
              </Link>
            </li>
          </ul>
        </li>
        <li role="none">
          <Link 
            href="/kontakt" 
            onClick={handleNavigate}
            role="menuitem"
            className={styles.navLink}
          >
            Kontakt
          </Link>
        </li>
      </ul>
    </nav>
  );
} 