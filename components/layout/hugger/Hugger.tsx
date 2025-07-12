import React from 'react';
import styles from './Hugger.module.css';

interface HuggerProps {
  children: React.ReactNode;
  className?: string;
  vluMax?: boolean;
  padding?: boolean; // new boolean prop for left/right padding
  style?: React.CSSProperties;
  section?: boolean;
  article?: boolean;
  main?: boolean;
  aside?: boolean;
}

const Hugger = React.forwardRef<HTMLElement, HuggerProps>(
  ({ children, className, vluMax = false, padding = false, style, section, article, main, aside }, ref) => {
    const classes = [
      styles.hugger, 
      padding ? styles.padding : '',
      className
    ].filter(Boolean).join(' ');

    const combinedStyle: React.CSSProperties = { ...style };
    if (vluMax) combinedStyle.maxWidth = 'var(--vlu_max)';

    const commonProps = {
      className: classes,
      style: combinedStyle,
      ref: ref as any, // Type assertion to avoid TypeScript issues
    };

    if (section) {
      return <section {...commonProps}>{children}</section>;
    }

    if (article) {
      return <article {...commonProps}>{children}</article>;
    }

    if (main) {
      return <main {...commonProps}>{children}</main>;
    }

    if (aside) {
      return <aside {...commonProps}>{children}</aside>;
    }

    return <div {...commonProps}>{children}</div>;
  },
);

Hugger.displayName = 'Hugger';

export default Hugger;
