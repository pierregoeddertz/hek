'use client';

import { useState } from 'react';
import Header from '@/components/semantic/Header';
import SidePanel from '@/components/ui/SidePanel';
import Navigation from '@/components/ui/Navigation';

interface MenuProviderProps {
  children: React.ReactNode;
}

export default function MenuProvider({ children }: MenuProviderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleMenuClick = () => {
    setIsMenuOpen(true);
  };

  const handleMenuClose = () => {
    setIsMenuOpen(false);
  };

  return (
    <>
      <Header onMenuClick={handleMenuClick} />
      {children}
      
      {/* SidePanel with Navigation */}
      <SidePanel
        isOpen={isMenuOpen}
        onClose={handleMenuClose}
        title="Navigation"
        position="right"
        width="300px"
      >
        <Navigation onNavigate={handleMenuClose} />
      </SidePanel>
    </>
  );
} 