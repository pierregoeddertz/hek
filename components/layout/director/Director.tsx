import React from 'react';
import styles from './Director.module.css';

interface DirectorProps {
  children: React.ReactNode;
  gap?: string | number;
  className?: string;
  direction?: 'horizontal' | 'vertical';
  style?: React.CSSProperties;
}

const Director = React.forwardRef<HTMLDivElement, DirectorProps>(
  ({ children, gap = '1rem', className, direction = 'horizontal', style }, ref) => {
    const gapValue = typeof gap === 'number' ? `${gap}px` : gap;
    const classes = [
      styles.director,
      direction === 'vertical' ? styles.vertical : styles.horizontal,
      className,
    ]
      .filter(Boolean)
      .join(' ');
    
    const combinedStyle: React.CSSProperties = { gap: gapValue, ...style };
    
    return (
      <div ref={ref} className={classes} style={combinedStyle}>
        {children}
      </div>
    );
  }
);

export default Director; 