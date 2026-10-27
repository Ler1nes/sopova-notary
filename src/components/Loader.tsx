import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { site } from '../data/site';
import { Scales } from './Icons';

interface LoaderProps {
  ready: boolean;
  onExited: () => void;
  reducedMotion: boolean;
}

export function Loader({ ready, onExited, reducedMotion }: LoaderProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLElement>(null);
  const countRef = useRef<HTMLSpanElement>(null);
  const exitedRef = useRef(false);

  useEffect(() => {
    const bar = barRef.current;
    const count = countRef.current;
    if (!bar || !count) return;

    // повторный заход в рамках сессии — без заставки
    let seen = false;
    try {
      seen = sessionStorage.getItem('site:visited') === '1';
    } catch {
      seen = false;
    }

    if (seen || reducedMotion) {
      gsap.set(rootRef.current, { display: 'none' });
      onExited();
      return;
    }

    const state = { value: 0 };
    gsap.to(bar, { scaleX: 0.75, duration: 0.9, ease: 'power2.out' });
    gsap.to(state, {
      value: 75,
      duration: 0.9,
      ease: 'power2.out',
      onUpdate: () => {
        count.textContent = String(Math.round(state.value)).padStart(2, '0');
      },
    });

    return () => {
      gsap.killTweensOf([bar, state]);
    };
  }, [reducedMotion, onExited]);

  useEffect(() => {
    if (!ready || exitedRef.current) return;
    exitedRef.current = true;

    if (reducedMotion) {
      gsap.set(rootRef.current, { display: 'none' });
      onExited();
      return;
    }

    const tl = gsap.timeline({
      defaults: { ease: 'power4.inOut' },
      onComplete: () => {
        try {
          sessionStorage.setItem('site:visited', '1');
        } catch {
          /* приватный режим */
        }
        onExited();
      },
    });

    tl.to(barRef.current, { scaleX: 1, duration: 0.35, ease: 'power2.inOut' }, 0)
      .to(countRef.current, { opacity: 0, duration: 0.2 }, 0.15)
      .to(rootRef.current, { yPercent: -100, duration: 0.8 }, 0.3)
      .set(rootRef.current, { display: 'none' });
  }, [ready, reducedMotion, onExited]);

  return (
    <div className="loader" ref={rootRef} aria-hidden="true">
      <div className="loader__brand">
        <Scales />
        <span>{site.brand.notary} · нотариальная контора</span>
      </div>
      <div className="loader__bottom">
        <span>Апшеронск</span>
        <div className="loader__bar">
          <i ref={barRef as React.RefObject<HTMLElement>} />
        </div>
        <span ref={countRef}>00</span>
      </div>
    </div>
  );
}
