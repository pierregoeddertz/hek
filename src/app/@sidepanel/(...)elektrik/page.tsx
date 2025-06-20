"use client";
import Sidepanel from '@/components/Sidepanels/Sidepanel';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { getSidepanelTransitionDuration } from '@/utils/sidepanels';

export default function ElektrikSidepanel() {
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
      content={{ title: 'Elektrik', content: '<p>Informationen zur Elektrotechnik...</p>' }}
      onClose={() => setOpen(false)}
    />
  );
} 