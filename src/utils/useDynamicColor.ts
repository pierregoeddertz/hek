import { useEffect } from "react";

export function useDynamicColor(ref: React.RefObject<HTMLElement | null>, enabled: boolean = true) {
  useEffect(() => {
    if (!enabled || !ref.current) return;

    const el = ref.current;

    // mark as dynamic so CSS maps variables automatically
    el.setAttribute("data-dynamic", "true");

    function getBgBrightness(): number {
      try {
        const rect = el.getBoundingClientRect();
        const x = rect.left + rect.width / 2;
        const y = rect.top + rect.height / 2;

        const stack = document.elementsFromPoint(x, y) as HTMLElement[];
        let target: HTMLElement | null = null;
        for (const candidate of stack) {
          if (candidate === el || el.contains(candidate)) continue;
          if (candidate.getAttribute('data-ignore-dynamic') === 'true') continue;
          const bg = window.getComputedStyle(candidate).backgroundColor;
          if (bg && bg !== "rgba(0, 0, 0, 0)" && bg !== "transparent") {
            target = candidate;
            break;
          }
        }
        
        if (!target) {
          const bodyBg = window.getComputedStyle(document.body).backgroundColor;
          const match = bodyBg.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*[\d.]+)?\)/);
          if (!match || !match[1] || !match[2] || !match[3]) return 1;
          const r = Number(match[1]);
          const g = Number(match[2]);
          const b = Number(match[3]);
          return (0.299 * r + 0.587 * g + 0.114 * b) / 255;
        }
        
        const bg = window.getComputedStyle(target).backgroundColor;
        const match = bg.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*[\d.]+)?\)/);
        if (!match || !match[1] || !match[2] || !match[3]) return 1;
        const r = Number(match[1]);
        const g = Number(match[2]);
        const b = Number(match[3]);
        return (0.299 * r + 0.587 * g + 0.114 * b) / 255;
      } catch (error) {
        console.warn('Error in getBgBrightness:', error);
        return 1; // Default to light background
      }
    }

    function update() {
      try {
        const lum = getBgBrightness();
        const isDark = lum < 0.5;

        // rely purely on attribute; CSS will handle variable mapping
        if (isDark) {
          el.setAttribute("data-on-dark", "true");
        } else {
          el.removeAttribute("data-on-dark");
        }
      } catch (error) {
        console.warn('Error in update:', error);
      }
    }

    let ticking = false;
    function scheduleUpdate() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        update();
        ticking = false;
      });
    }

    update();

    const observer = new IntersectionObserver(scheduleUpdate, {
      root: null,
      threshold: [0, 0.25, 0.5, 0.75, 1],
    });
    observer.observe(el);

    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate);

    const intervalId = setInterval(scheduleUpdate, 1000);

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);
      clearInterval(intervalId);
    };
  }, [ref, enabled]);
} 