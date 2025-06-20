'use client';

import { useSelectedLayoutSegments } from 'next/navigation';
import { useRef } from 'react';
import { useDynamicColor } from '@/utils/useDynamicColor';
import styles from "./Header.module.css";
import Button from "../Button/Button";
import Divider from "../Decorative/Divider";
import MenuModal from '@/components/Sidepanels/MenuModal';
import React from 'react';

export default function Header() {
  const segments = useSelectedLayoutSegments('sidepanel');
  const isSidepanelOpen = segments.length > 0;

  const [menuOpen, setMenuOpen] = React.useState(false);

  const headerRef = useRef<HTMLElement>(null);
  // Apply dynamic color only when kein Sidepanel offen
  useDynamicColor(headerRef, !isSidepanelOpen);

  const handleMenuClick = () => {
    if (menuOpen) {
      setMenuOpen(false);
      return;
    }
    setMenuOpen(true);
  };

  return (
    <header className={styles.root} ref={headerRef}>
      <div className="padding_3_4 flow_tb_2_5">
        <Divider />
        <div className="flow_rl_space">
          {/* Linke Seite */}
          <div className="flow_rl_2_5">
            <Button
              dynamic
              aria-label="Menü öffnen"
              aria-controls="site-menu"
              aria-expanded={isSidepanelOpen}
              onClick={handleMenuClick}
            >
              Menü
            </Button>
          </div>

          {/* Rechte Seite */}
          <div className="flow_rl_2_5">
            <Button dynamic aria-label="Kontaktformular öffnen">Kontakt</Button>
          </div>
        </div>
      </div>
      <MenuModal isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
    </header>
  );
} 