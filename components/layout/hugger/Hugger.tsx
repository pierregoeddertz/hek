import React from 'react';
import styles from './Hugger.module.css';

interface HuggerProps {
  children: React.ReactNode;
  className?: string;
  vluMax?: boolean;
  style?: React.CSSProperties;
}

const Hugger = React.forwardRef<HTMLDivElement, HuggerProps>(
  ({ children, className, vluMax = false, style }, ref) => {
    const classes = [styles.hugger, className].filter(Boolean).join(' ');

    const combinedStyle: React.CSSProperties = { ...style };
    if (vluMax) combinedStyle.maxWidth = 'var(--vlu_max)';

    return (
      <div ref={ref} className={classes} style={combinedStyle}>
        {children}
      </div>
    );
  },
);

Hugger.displayName = 'Hugger';

export default Hugger;
