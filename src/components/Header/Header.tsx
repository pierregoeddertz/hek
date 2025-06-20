'use client';

import { useSidepanel } from '@/components/Sidepanels';
import type { SidepanelContent } from '@/types/sidepanels';
import styles from "./Header.module.css";
import Button from "../Button/Button";
import Divider from "../Decorative/Divider";

export default function Header() {
  const { open, close, isOpen } = useSidepanel();

  const handleMenuClick = () => {
    if (isOpen) {
      close();
      return;
    }

    const menuContent: SidepanelContent = {
      title: 'Menü',
      content: `
        <nav id="site-menu">
          <ul style="list-style:none; padding:0; margin:0; display:flex; flex-direction:column; gap:0.5rem;">
            <li><a href="/">Home</a></li>
            <li><a href="/news">News</a></li>
          </ul>
        </nav>
      `
    };

    open('menu', menuContent, 'left');
  };

  return (
    <header className={styles.root}>
      <div className="padding_3_4 flow_tb_2_5">
        <Divider />
        <div className="flow_rl_space">
          {/* Linke Seite */}
          <div className="flow_rl_2_5">
            <Button
              dynamic
              aria-label="Menü öffnen"
              aria-controls="site-menu"
              aria-expanded={isOpen}
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
    </header>
  );
} 