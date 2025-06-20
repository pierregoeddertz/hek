"use client";
import Sidepanel from '@/components/Sidepanels/Sidepanel';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { getSidepanelTransitionDuration } from '@/utils/sidepanels';

export default function KlimaSidepanel() {
  const router = useRouter();
  const [open, setOpen] = useState(true);

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
      content={{ title: 'Klima', content: '<p>Informationen zur Klimatechnik...</p>' }}
      onClose={() => setOpen(false)}
    />
  );
} 