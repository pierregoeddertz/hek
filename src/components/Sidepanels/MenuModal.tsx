"use client";
import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import Sidepanel from './Sidepanel';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function MenuModal({ isOpen, onClose }: Props) {
  // create portal container
  const [el] = React.useState(() => {
    if (typeof document === 'undefined') return null;
    const div = document.createElement('div');
    document.body.appendChild(div);
    return div;
  });

  const router = useRouter();

  useEffect(() => {
    return () => {
      if (el && el.parentNode) el.parentNode.removeChild(el);
    };
  }, [el]);

  if (!el) return null;

  const handleNavigate = (path: string) => {
    router.push(path, { scroll: false });
    onClose();
  };

  const menuContent = (
    <nav id="site-menu">
      <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <li>
          <Link href="/" onClick={() => handleNavigate('/')}>Home</Link>
        </li>
        <li>
          <Link href="/news" onClick={() => handleNavigate('/news')}>News</Link>
        </li>
      </ul>
    </nav>
  );

  return ReactDOM.createPortal(
    <Sidepanel
      isOpen={isOpen}
      side="left"
      content={{ title: 'Menü', content: menuContent }}
      onClose={onClose}
    />,
    el
  );
} 