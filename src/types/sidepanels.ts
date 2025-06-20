export interface SidepanelContent {
  title: string;
  content: string; // raw HTML string (sanitized before render)
}

export interface SidepanelState {
  isOpen: boolean;
  side: 'left' | 'right';
  content: SidepanelContent | null;
} 