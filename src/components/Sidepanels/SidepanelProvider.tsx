"use client";

import React, { createContext, useContext, useCallback, useState, useEffect } from "react";
import type { ReactNode } from "react";
import Sidepanel from "./Sidepanel";
import type { SidepanelContent, SidepanelState } from "@/types/sidepanels";
import { useRouter } from 'next/navigation';

interface SidepanelContextValue {
  open: (contentKey: string, content: SidepanelContent, side?: "left" | "right") => void;
  close: () => void;
  isOpen: boolean;
}

const SidepanelContext = createContext<SidepanelContextValue | undefined>(undefined);

export const useSidepanel = () => {
  const ctx = useContext(SidepanelContext);
  if (!ctx) {
    throw new Error("useSidepanel must be used within a SidepanelProvider");
  }
  return ctx;
};

interface ProviderProps {
  children: ReactNode;
}

export const SidepanelProvider = ({ children }: ProviderProps) => {
  const router = useRouter();

  const [state, setState] = useState<SidepanelState>({ isOpen: false, side: "left", content: null });

  const open = useCallback((contentKey: string, content: SidepanelContent, side: "left" | "right" = "left") => {
    setState({ isOpen: true, side, content });

    // choose pretty path
    const path = contentKey === 'menu' ? '/menu' : `/${contentKey}`;
    router.push(path, { scroll: false });
  }, [router]);

  const close = useCallback(() => {
    setState((prev) => ({ ...prev, isOpen: false }));

    if (typeof window !== 'undefined') {
      const path = window.location.pathname;
      if (path.startsWith('/news/')) {
        router.push('/news', { scroll: false });
      } else {
        router.push('/', { scroll: false });
      }
    }
  }, [router]);

  const contextValue: SidepanelContextValue = {
    open,
    close,
    isOpen: state.isOpen,
  };

  // open panel on initial load or when URL changes
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const panelKey = window.location.pathname.replace(/^\//, '');
    if (!panelKey) return;

    const mapping: Record<string, SidepanelContent> = {
      menu: {
        title: 'Menü',
        content: `<nav id="site-menu"><ul style="list-style:none; padding:0; margin:0; display:flex; flex-direction:column; gap:0.5rem;"><li><a href="/">Home</a></li><li><a href="/news">News</a></li></ul></nav>`
      },
      heizung: { title: 'Heizung', content: '<p>Informationen zur Heiztechnik...</p>' },
      elektrik: { title: 'Elektrik', content: '<p>Informationen zur Elektrotechnik...</p>' },
      klima: { title: 'Klima', content: '<p>Informationen zur Klimatechnik...</p>' },
    };

    if (mapping[panelKey]) {
      setState({ isOpen: true, side: panelKey === 'menu' ? 'left' : 'right', content: mapping[panelKey] });
      return;
    }

    if (panelKey.startsWith('news/')) {
      const slug = panelKey.split('/')[1] ?? '';
      const title = decodeURIComponent(slug || 'Artikel');
      setState({ isOpen: true, side: 'right', content: { title, content: `<p>${title}</p>` } });
      return;
    }
    // Other paths not handled
  }, []);

  return (
    <SidepanelContext.Provider value={contextValue}>
      {children}
      <Sidepanel isOpen={state.isOpen} side={state.side} content={state.content} onClose={close} />
    </SidepanelContext.Provider>
  );
}; 