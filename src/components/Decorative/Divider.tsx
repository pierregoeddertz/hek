'use client';

import styles from "./Divider.module.css";
import { useRef } from "react";
import { useDynamicColor } from "@/utils/useDynamicColor";

export default function Divider() {
  const ref = useRef<HTMLSpanElement>(null);
  useDynamicColor(ref, true);
  return <span ref={ref} className={styles.root} aria-hidden="true" />;
} 