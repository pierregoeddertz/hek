export function sanitizeContent(html: string): string {
  // TODO: Replace with robust sanitizer such as DOMPurify if required.
  // Basic fallback just returns original string.
  return html;
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