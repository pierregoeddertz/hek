import DOMPurify from 'isomorphic-dompurify';
import type { SidepanelContent } from '@/types/sidepanels';

export function sanitizeContent(html: string): string {
  return DOMPurify.sanitize(html);
}

/**
 * Map a URL pathname (without leading slash) to panel configuration.
 * Returns null if the path does not represent a sidepanel.
 */
export function getPanelForPath(pathname: string): { side: 'left' | 'right'; content: SidepanelContent } | null {
  if (!pathname) return null;

  const mapping: Record<string, SidepanelContent> = {
    menu: {
      title: 'Menü',
      content:
        '<nav id="site-menu"><ul style="list-style:none; padding:0; margin:0; display:flex; flex-direction:column; gap:0.5rem;"><li><a href="/">Home</a></li><li><a href="/news">News</a></li></ul></nav>',
    },
    heizung: { title: 'Heizung', content: '<p>Informationen zur Heiztechnik...</p>' },
    elektrik: { title: 'Elektrik', content: '<p>Informationen zur Elektrotechnik...</p>' },
    klima: { title: 'Klima', content: '<p>Informationen zur Klimatechnik...</p>' },
  };

  if (mapping[pathname]) {
    return {
      side: pathname === 'menu' ? 'left' : 'right',
      content: mapping[pathname],
    };
  }

  if (pathname.startsWith('news/')) {
    const slug = pathname.split('/')[1] ?? '';
    const title = decodeURIComponent(slug || 'Artikel');
    return {
      side: 'right',
      content: { title, content: `<p>${title}</p>` },
    };
  }
  return null;
}

export function getSidepanelTransitionDuration(defaultMs: number = 300): number {
  if (typeof window === 'undefined') return defaultMs;
  const root = getComputedStyle(document.documentElement);
  const value = root.getPropertyValue('--sidepanel-transition-duration').trim();
  if (!value) return defaultMs;
  if (value.endsWith('ms')) return parseFloat(value);
  if (value.endsWith('s')) return parseFloat(value) * 1000;
  return defaultMs;
} 