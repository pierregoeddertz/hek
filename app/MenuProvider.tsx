'use client';

import { useState } from 'react';
import Header from '@/components/semantic/Header';
import SidePanel from '@/components/ui/SidePanel';
import Navigation from '@/components/ui/Navigation';
import styles from './MenuProvider.module.css';

interface MenuProviderProps {
  children: React.ReactNode;
}

export default function MenuProvider({ children }: MenuProviderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleMenuClick = () => {
    setIsMenuOpen(true);
  };

  const handleMenuClose = () => {
    setIsMenuOpen(false);
  };

  return (
    <>
      <Header onMenuClick={handleMenuClick} />
      
      {/* SEO-friendly hidden navigation - always in HTML */}
      <nav className={styles.seoNavigation} aria-label="Hauptnavigation für Suchmaschinen">
        <ul className={styles.seoNavList}>
          <li><a href="/">Home</a></li>
          <li><a href="/news">News</a></li>
          <li>
            <span>Produkte</span>
            <ul>
              <li><a href="/aeroleaf">Aeroleaf</a></li>
              <li><a href="/smartflower">Smartflower</a></li>
            </ul>
          </li>
          <li><a href="/kontakt">Kontakt</a></li>
        </ul>
      </nav>
      
      {children}
      
      {/* SidePanel with Navigation for UX */}
      <SidePanel
        isOpen={isMenuOpen}
        onClose={handleMenuClose}
        title="Navigation"
        position="right"
        width="300px"
      >
        <Navigation onNavigate={handleMenuClose} />
      </SidePanel>
    </>
  );
} 