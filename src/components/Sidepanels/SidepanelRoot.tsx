"use client";

import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';
import { SidepanelProvider } from './SidepanelProvider';
import { getPanelForPath } from '@/utils/sidepanels';

export default function SidepanelRoot({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  const panelKey = pathname.replace(/^\//, '');
  const panelInfo = getPanelForPath(panelKey);

  const initialState = panelInfo
    ? { isOpen: true, side: panelInfo.side, content: panelInfo.content }
    : { isOpen: false, side: 'left' as const, content: null };

  return <SidepanelProvider initialState={initialState}>{children}</SidepanelProvider>;
} 