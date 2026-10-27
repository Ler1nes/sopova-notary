import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type { ScalesScene } from '../three/ScalesScene';
import { site } from '../data/site';
import { formatStat } from '../lib/format';
import { ArrowRight } from './Icons';

interface HeroProps {
  reducedMotion: boolean;
}

export function Hero({ reducedMotion }: HeroProps) {
  return (
    <section className="hero" id="top">
      <div className="hero__glow" aria-hidden="true" data-parallax="-26" />
      <div className="hero__lines" aria-hidden="true" data-parallax="34" />
      <HeroVisual reducedMotion={reducedMotion} />

      <div className="hero__inner container">
        <div className="hero__content">
          <p className="kicker" data-hero-fade>
            {site.hero.eyebrow}
          </p>

          <h1 className="hero__title display">
            <span className="line-mask">
              <span className="line-inner" data-hero-line>
                {site.hero.titleLead}
              </span>
            </span>
            <span className="line-mask">
              <span className="line-inner" data-hero-line>
                <em>{site.hero.titleAccent}</em>
              </span>
            </span>
          </h1>

          <p className="hero__lead" data-hero-fade>
            {site.hero.lead}
          </p>

          <div className="hero__actions" data-hero-fade>
            <a className="btn btn--primary" href="#contact">
              {site.hero.primaryCta}
              <ArrowRight className="btn__icon" />
            </a>
            <a className="btn btn--ghost" href="#prices">
              {site.hero.secondaryCta}
            </a>
          </div>

          <div className="hero__meta" data-hero-fade>
            <span>Вт — Пт 09:00 — 17:00</span>
            <span>Сб 10:00 — 15:00</span>
            <span>Выезд на дом</span>
          </div>
        </div>
      </div>

      <div className="hero__scroll" aria-hidden="true">
        Листайте
      </div>

      <div className="hero__stats">
        <div className="hero__stats-inner container">
          {site.hero.stats.map((stat) => (
            <div className="stat" key={stat.label}>
              <div className="stat__value">
                <b data-count data-value={stat.value}>
                  {formatStat(stat.value)}
                </b>
                <span>{stat.suffix}</span>
              </div>
              <div className="stat__label">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function HeroVisual({ reducedMotion }: { reducedMotion: boolean }) {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    // на слабых устройствах и при экономии трафика 3D не грузим вовсе
    const nav = navigator as Navigator & {
      connection?: { saveData?: boolean };
      deviceMemory?: number;
    };
    const capable =
      reducedMotion ||
      (!nav.connection?.saveData &&
        (nav.deviceMemory ?? 8) > 2 &&
        (navigator.hardwareConcurrency ?? 8) > 2);

    if (!capable) {
      host.style.display = 'none';
      return;
    }

    const canvas = document.createElement('canvas');
    canvas.setAttribute('aria-hidden', 'true');
    host.appendChild(canvas);

    let scene: ScalesScene | null = null;
    let trigger: ScrollTrigger | null = null;
    let observer: IntersectionObserver | null = null;
    let cancelled = false;
    let started = false;

    // 3D стартует после выхода из лоадера, чтобы не тормозить первый экран
    const startScene = () => {
      if (started || cancelled) return;
      started = true;

      import('../three/ScalesScene')
        .then(({ ScalesScene }) => {
          if (cancelled) return;

          scene = new ScalesScene(canvas, { variant: 'hero', reducedMotion });
          const targetOpacity =
            Number.parseFloat(getComputedStyle(host).getPropertyValue('--canvas-opacity')) || 1;
          gsap.fromTo(
            host,
            { opacity: 0 },
            { opacity: targetOpacity, duration: 1.4, ease: 'power2.out' },
          );

          trigger = ScrollTrigger.create({
            trigger: '#top',
            start: 'top top',
            end: 'bottom top',
            scrub: true,
            onUpdate: (self) => scene?.setProgress(self.progress),
          });

          observer = new IntersectionObserver(
            ([entry]) => {
              if (entry.isIntersecting) scene?.start();
              else scene?.stop();
            },
            { threshold: 0 },
          );
          observer.observe(host);
        })
        .catch((error) => {
          console.warn('3D-сцена недоступна:', error);
          host.style.display = 'none';
        });
    };

    const schedule = () => {
      window.setTimeout(startScene, 120);
    };

    window.addEventListener('app:loaded', schedule, { once: true });
    if (document.documentElement.classList.contains('is-loaded')) schedule();
    const fallback = window.setTimeout(startScene, 6000);

    return () => {
      cancelled = true;
      window.clearTimeout(fallback);
      window.removeEventListener('app:loaded', schedule);
      trigger?.kill();
      observer?.disconnect();
      scene?.dispose();
      canvas.remove();
    };
  }, [reducedMotion]);

  return <div className="hero__canvas" ref={hostRef} />;
}
