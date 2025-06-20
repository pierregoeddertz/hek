"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Sidepanel from './Sidepanel';
import { getSidepanelTransitionDuration } from '@/utils/sidepanels';

export default function MenuPanel() {
  const router = useRouter();
  const [open, setOpen] = useState(true);
  const targetRef = React.useRef<string | null>(null);

  useEffect(() => {
    if (!open) {
      const timer = setTimeout(() => {
        if (targetRef.current) {
          router.replace(targetRef.current);
        } else {
          router.back();
        }
      }, getSidepanelTransitionDuration());
      return () => clearTimeout(timer);
    }
  }, [open, router]);

  const handleNav = (path: string) => {
    setOpen(false);
    targetRef.current = path;
  };

  const menuContent = (
    <nav id="site-menu">
      <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <li>
          <button style={{ background: 'none', border: 'none', cursor: 'pointer' }} onClick={() => handleNav('/')}>Home</button>
        </li>
        <li>
          <button style={{ background: 'none', border: 'none', cursor: 'pointer' }} onClick={() => handleNav('/news')}>News</button>
        </li>
      </ul>
    </nav>
  );

  return (
    <Sidepanel
      isOpen={open}
      side="left"
      content={{ title: 'Menü', content: menuContent }}
      onClose={() => setOpen(false)}
    />
  );
} 