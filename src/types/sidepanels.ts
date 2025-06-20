import type { ReactNode } from 'react';

export interface SidepanelContent {
  title: string;
  content: string | ReactNode; // raw HTML string or React node
}

export interface SidepanelState {
  isOpen: boolean;
  side: 'left' | 'right';
  content: SidepanelContent | null;
} 