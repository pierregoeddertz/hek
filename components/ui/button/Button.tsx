'use client';

import styles from "./Button.module.css";
import { ButtonHTMLAttributes, useRef, useCallback, useEffect } from "react";

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  className?: string;
  dynamic?: boolean; // enables brightness detection
  hasArm?: boolean; // enables the SVG arm variant
  direction?: "up" | "down"; // only relevant when withArm is true
  side?: "left" | "right"; // only relevant when hasArm is true
  frontLabel?: string; // label shown by default
  backLabel?: string; // label shown when toggled
  showBack?: boolean; // controlled flag to display backLabel
};

export default function Button({
  dynamic = false,
  className = "",
  hasArm = false,
  direction = "up",
  side = "left",
  frontLabel,
  backLabel,
  showBack = false,
  children,
  ...rest
}: ButtonProps) {
  const ref = useRef<HTMLButtonElement>(null);

  const vectorRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);

  const updatePath = useCallback(() => {
    if (!hasArm) return;
    const vectorEl = vectorRef.current;
    const pathEl = pathRef.current;
    if (!vectorEl || !pathEl) return;

    const w = vectorEl.clientWidth;
    const KINK = 21;
    let d: string;

    if (side === "left") {
      d =
        direction === "down"
          ? `M0 ${KINK} L${KINK} 0 L${w - 1} 0`
          : `M0 0 L${KINK} ${KINK} L${w - 1} ${KINK}`;
    } else {
      d =
        direction === "down"
          ? `M0 0 L${w - KINK} 0 L${w - 1} ${KINK}`
          : `M0 ${KINK} L${w - KINK} ${KINK} L${w - 1} 0`;
    }
    pathEl.setAttribute("d", d);
  }, [hasArm, direction, side]);

  useEffect(() => {
    if (!hasArm) return;
    updatePath();
    const vectorEl = vectorRef.current;
    if (!vectorEl) return;
    const ro = new ResizeObserver(updatePath);
    ro.observe(vectorEl);
    return () => ro.disconnect();
  }, [hasArm, updatePath]);

  const combined = `${styles.root} ${className}`.trim();

  const rowClasses = `${styles.row} ${side === "right" ? styles.right : ""}`.trim();

  const labelContent = frontLabel || children || 'Button';

  if (!hasArm) {
    return (
      <button ref={ref} type="button" {...rest} className={combined}>
        {labelContent}
      </button>
    );
  }

  return (
    <div className={rowClasses} data-direction={direction} data-side={side}>
      <div className={styles.vector} ref={vectorRef}>
        <svg xmlns="http://www.w3.org/2000/svg">
          <path ref={pathRef} d="M0 0 L100 0" stroke="currentColor" strokeWidth="1" strokeLinecap="butt" fill="none" />
        </svg>
      </div>
      <div className={styles.btnContainer}>
        <button ref={ref} type="button" {...rest} className={combined}>
          {frontLabel && backLabel ? (
            <div className={styles.textContainer}>
              <div className={`${styles.textInner} ${showBack ? styles.showBack : ""}`.trim()}>
                <span className={styles.textButton}>{frontLabel}</span>
                <span className={styles.textButton}>{backLabel}</span>
              </div>
            </div>
          ) : (
            labelContent
          )}
        </button>
      </div>
    </div>
  );
} 