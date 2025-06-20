"use client";

import Dragger from "@/components/Dragger/Dragger";
import Button from "@/components/Button/Button";
import { useRouter } from 'next/navigation';

export default function ServiceDragger() {
  const router = useRouter();

  const handleClick = (key: string) => {
    router.push(`/${key}`, { scroll: false });
  };

  return (
    <Dragger centerFirst>
      <div style={{ display: 'flex', margin: '0 auto' }}>
        {/* Heizung */}
        <div style={{ position: 'relative', marginRight: '80px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--v_4)', color: 'var(--b)', textAlign: 'center', paddingTop: 'calc(42px + var(--v_6))' }}>
          <svg width="322" height="381" viewBox="0 0 322 381" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: 'calc(320px - (2 * var(--v_4)))' }}>
            <path d="M0.607178 51.6413V380.625H85.6488V148.646V0.625L0.607178 51.6413Z" fill="currentColor" />
            <path d="M235.823 148.646H85.6488L138.746 222.375H235.823V380.625L321.399 329.276V0.625H235.823V148.646Z" fill="currentColor" />
          </svg>
          <Button hasArm side="right" frontLabel="Heizung" onClick={() => handleClick('heizung')} />
        </div>
        {/* Elektrik */}
        <div style={{ position: 'relative', marginRight: '66px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--v_4)', color: 'var(--b)', textAlign: 'center', paddingBottom: '42px' }}>
          <Button hasArm direction="down" frontLabel="Elektrik" onClick={() => handleClick('elektrik')} />
          <svg width="275" height="381" viewBox="0 0 275 381" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: 'calc(275px - (2 * var(--v_4)))' }}>
            <path d="M254.99 222.375V150.799H85.4408L136.992 222.375H254.99Z" fill="currentColor" />
            <path d="M85.4408 150.799V73.8192H271.143V0.625H53.1059L0.39917 73.8192V380.625H221.658L274.364 307.416H85.4408V150.799Z" fill="currentColor" />
          </svg>
        </div>
        {/* Klima */}
        <div data-first style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--v_4)', color: 'var(--b)', textAlign: 'center', paddingTop: 'calc(42px + var(--v_6))' }}>
          <svg width="333" height="381" viewBox="0 0 333 381" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: 'calc(320px - (2 * var(--v_4)))' }}>
            <path d="M190.4 208.591H89.7402L85.4203 208.62L227.705 380.625H332.714L190.4 208.591Z" fill="currentColor" />
            <path d="M316.576 0.625H213.589L85.4202 120.4V0.625H0.364014V380.625H85.4202L85.4203 208.62L316.576 0.625Z" fill="currentColor" />
          </svg>
          <Button hasArm side="left" frontLabel="Klima" onClick={() => handleClick('klima')} />
        </div>
      </div>
    </Dragger>
  );
} 