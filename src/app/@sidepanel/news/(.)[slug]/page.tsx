"use client";
import React, { useState, useEffect } from 'react';
import Sidepanel from '@/components/Sidepanels/Sidepanel';
import { useRouter } from 'next/navigation';
import { getSidepanelTransitionDuration } from '@/utils/sidepanels';

export default function NewsArticleSidepanel({ params }: { params: { slug: string } }) {
  const router = useRouter();
  const [open, setOpen] = useState(true);

  const title = decodeURIComponent(params.slug ?? '');

  useEffect(() => {
    if (!open) {
      const timer = setTimeout(() => router.back(), getSidepanelTransitionDuration());
      return () => clearTimeout(timer);
    }
  }, [open, router]);

  return (
    <Sidepanel
      isOpen={open}
      side="right"
      content={{ title, content: <p>{title}</p> }}
      onClose={() => setOpen(false)}
    />
  );
} 