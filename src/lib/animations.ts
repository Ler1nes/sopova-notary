import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { formatStat } from './format';

gsap.registerPlugin(ScrollTrigger, SplitText);

/**
 * Общая хореография страницы: появление hero, split-заголовки,
 * reveal-блоки, счётчики, параллакс и индикатор прокрутки.
 */
export function initAnimations(): () => void {
  const root = document.documentElement;
  const splits: SplitText[] = [];
  root.classList.add('js-anim');

  const ctx = gsap.context(() => {
    const hero = gsap.timeline({ defaults: { ease: 'power4.out' } });
    hero
      .from('[data-hero-line]', { yPercent: 118, duration: 1.2, stagger: 0.1 })
      .from(
        '[data-hero-fade]',
        { y: 26, autoAlpha: 0, duration: 0.95, stagger: 0.08 },
        0.35,
      );

    gsap.utils.toArray<HTMLElement>('[data-split]').forEach((el) => {
      const split = SplitText.create(el, {
        type: 'lines',
        mask: 'lines',
        linesClass: 'split-line',
        autoSplit: true,
        onSplit: (self) => {
          el.classList.add('is-split');
          return gsap.from(self.lines, {
            yPercent: 118,
            duration: 1.1,
            stagger: 0.08,
            ease: 'power4.out',
            scrollTrigger: { trigger: el, start: 'top 92%', once: true },
          });
        },
      });
      splits.push(split);
    });

    gsap.utils.toArray<HTMLElement>('[data-reveal]').forEach((el) => {
      gsap.from(el, {
        y: 30,
        autoAlpha: 0,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 94%', once: true },
      });
    });

    gsap.utils.toArray<HTMLElement>('[data-reveal-group]').forEach((group) => {
      gsap.from(Array.from(group.children), {
        y: 28,
        autoAlpha: 0,
        duration: 0.9,
        stagger: 0.08,
        ease: 'power3.out',
        scrollTrigger: { trigger: group, start: 'top 93%', once: true },
      });
    });

    gsap.utils.toArray<HTMLElement>('[data-count]').forEach((el) => {
      const target = Number.parseFloat(el.dataset.value ?? '0');
      const decimals = Number.parseInt(el.dataset.decimals ?? '0', 10) || 0;
      const state = { value: 0 };
      el.textContent = formatStat(0, decimals);

      ScrollTrigger.create({
        trigger: el,
        start: 'top 96%',
        once: true,
        onEnter: () => {
          gsap.to(state, {
            value: target,
            duration: 1.9,
            ease: 'power2.out',
            onUpdate: () => {
              el.textContent = formatStat(state.value, decimals);
            },
          });
        },
      });
    });

    gsap.utils.toArray<HTMLElement>('[data-parallax]').forEach((el) => {
      const distance = Number.parseFloat(el.dataset.parallax ?? '20');
      gsap.fromTo(
        el,
        { y: -distance },
        {
          y: distance,
          ease: 'none',
          scrollTrigger: {
            trigger: '#top',
            start: 'top top',
            end: 'bottom top',
            scrub: true,
          },
        },
      );
    });

    gsap.to('.scroll-progress', {
      scaleX: 1,
      ease: 'none',
      scrollTrigger: { start: 0, end: 'max', scrub: 0.3 },
    });
  });

  ScrollTrigger.refresh();

  return () => {
    ctx.revert();
    splits.forEach((split) => split.revert());
    root.classList.remove('js-anim');
  };
}
