'use client';

import Image from 'next/image';
import styles from './Card.module.css';

export type CardProps = {
  /** Article headline */
  title: string;
  /** Time string e.g. "12:00" */
  time: string;
  /** Date string e.g. "05.05.2025" */
  date: string;
  /** Image URL */
  image: string;
  /** Aspect ratio in the form "w:h" (supported: 1:1, 4:5, 9:16, 16:9) */
  ratio?: '1:1' | '4:5' | '9:16' | '16:9';
  className?: string;
  onClick?: () => void;
};

export default function Card({ title, time, date, image, ratio = '4:5', className = '', onClick }: CardProps) {
  // Map ratio string to CSS aspect-ratio value
  const ratioMap: Record<NonNullable<CardProps['ratio']>, string> = {
    '1:1': '1 / 1',
    '4:5': '4 / 5',
    '9:16': '9 / 16',
    '16:9': '16 / 9',
  } as const;

  const aspect = ratioMap[ratio] ?? '4 / 5';

  const clickable = typeof onClick === 'function';

  return (
    <article
      className={`${styles.root} ${className}`.trim()}
      onClick={onClick}
      role={clickable ? 'button' : undefined}
      tabIndex={clickable ? 0 : undefined}
      style={clickable ? { cursor: 'pointer' } : undefined}
    >
      <header>
        <h3 className={styles.title}>{title}</h3>
        <div className={styles.meta}>
          <time>{time}</time>
          <span aria-hidden="true">|</span>
          <time>{date}</time>
        </div>
      </header>
      <div className={styles.imageWrapper} style={{ aspectRatio: aspect, position: 'relative' }}>
        <Image src={image} alt={title} fill sizes="(max-width: 600px) 90vw, 400px" style={{ objectFit: 'cover' }} />
      </div>
    </article>
  );
} 