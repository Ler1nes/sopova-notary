import { useEffect, useRef, useState } from 'react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import gsap from 'gsap';
import type { ScalesScene } from '../three/ScalesScene';
import { site } from '../data/site';

interface PrinciplesProps {
  reducedMotion: boolean;
}

export function Principles({ reducedMotion }: PrinciplesProps) {
  const [active, setActive] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);
  const canvasHostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const host = canvasHostRef.current;
    if (!section || !host) return;
    if (window.matchMedia('(max-width: 1024px)').matches) return;

    let scene: ScalesScene | null = null;
    let trigger: ScrollTrigger | null = null;
    let viewObserver: IntersectionObserver | null = null;
    let preloader: IntersectionObserver | null = null;
    let cancelled = false;
    let loading = false;
    let progress = 0;

    // шаги переключаются сразу — 3D подключается отдельно
    trigger = ScrollTrigger.create({
      trigger: section,
      start: 'top top',
      end: 'bottom bottom',
      scrub: true,
      onUpdate: (self) => {
        progress = self.progress;
        scene?.setProgress(progress);
        const next = progress < 0.3 ? 0 : progress < 0.64 ? 1 : 2;
        setActive((current) => (current === next ? current : next));
      },
    });

    const loadScene = async () => {
      if (loading || cancelled) return;
      loading = true;

      const canvas = document.createElement('canvas');
      canvas.setAttribute('aria-hidden', 'true');
      host.appendChild(canvas);

      try {
        const { ScalesScene } = await import('../three/ScalesScene');
        if (cancelled) {
          canvas.remove();
          return;
        }

        scene = new ScalesScene(canvas, { variant: 'principles', reducedMotion });
        scene.setProgress(progress);
        scene.stop();
        gsap.to(host, { opacity: 0.92, duration: 0.8, ease: 'power2.out' });

        viewObserver = new IntersectionObserver(
          ([entry]) => {
            if (!scene) return;
            if (entry.isIntersecting) scene.start();
            else scene.stop();
          },
          { threshold: 0 },
        );
        viewObserver.observe(section);
      } catch (error) {
        console.warn('3D-сцена недоступна:', error);
        canvas.remove();
      }
    };

    // создаём сцену только когда секция близко к вьюпорту
    preloader = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        preloader?.disconnect();
        preloader = null;
        void loadScene();
      },
      { rootMargin: '0px 0px 120% 0px' },
    );
    preloader.observe(section);

    // если пользователь задержался на первом экране — готовим сцену заранее,
    // чтобы не ловить подлаг в момент прокрутки к секции
    const idleTimer = window.setTimeout(() => {
      if (!cancelled && !loading) void loadScene();
    }, 4000);

    return () => {
      cancelled = true;
      window.clearTimeout(idleTimer);
      preloader?.disconnect();
      viewObserver?.disconnect();
      trigger?.kill();
      scene?.dispose();
      host.replaceChildren();
    };
  }, [reducedMotion]);

  return (
    <section
      className={`principles${reducedMotion ? ' is-static' : ''}`}
      id="principles"
      ref={sectionRef}
      aria-labelledby="principles-title"
    >
      <div className="principles__sticky">
        <div className="principles__canvas" ref={canvasHostRef} aria-hidden="true" />
        <div className="principles__shade" aria-hidden="true" />

        <div className="principles__inner container">
          <div className="principles__head">
            <p className="kicker" data-reveal>
              Метод
            </p>
            <h2 className="h2" id="principles-title" data-split>
              Три проверки <em>до подписи</em>.
            </h2>
            <div className="principles__dots" aria-hidden="true">
              {site.principles.map((step, index) => (
                <span key={step.num} className={active === index ? 'is-active' : undefined} />
              ))}
            </div>
          </div>

          <div className="principles__body">
            <div className="principles__steps">
              {site.principles.map((step, index) => (
                <article
                  className={`principles__step${active === index ? ' is-active' : ''}`}
                  key={step.num}
                >
                  <span className="principles__step-num">{step.num} / 03</span>
                  <h3 className="principles__step-title">{step.title}</h3>
                  <p className="principles__step-text">{step.text}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
