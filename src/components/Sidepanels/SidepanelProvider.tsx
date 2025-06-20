"use client";

import React, { createContext, useContext, useCallback, useState } from "react";
import type { ReactNode } from "react";
import Sidepanel from "./Sidepanel";
import type { SidepanelContent, SidepanelState } from "@/types/sidepanels";
import { useRouter } from 'next/navigation';

interface SidepanelContextValue {
  open: (
    contentKey: string,
    content: SidepanelContent,
    side?: 'left' | 'right',
    navigatePath?: string
  ) => void;
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

export const SidepanelProvider = ({ children, initialState }: ProviderProps & { initialState?: SidepanelState | null }) => {
  const router = useRouter();

  const [state, setState] = useState<SidepanelState>(
    initialState ?? { isOpen: false, side: 'left', content: null }
  );

  const open = useCallback(
    (
      contentKey: string,
      content: SidepanelContent,
      side: 'left' | 'right' = 'left',
      navigatePath?: string
    ) => {
      setState({ isOpen: true, side, content });

      if (navigatePath) {
        router.push(navigatePath, { scroll: false });
      }
    },
    [router]
  );

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

  return (
    <SidepanelContext.Provider value={contextValue}>
      {children}
      <Sidepanel
        isOpen={state.isOpen}
        side={state.side}
        content={state.content}
        onClose={close}
      />
    </SidepanelContext.Provider>
  );
}; 