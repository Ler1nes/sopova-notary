import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { site } from '../data/site';
import { formatStat } from '../lib/format';

export function Practice() {
  const timelineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timeline = timelineRef.current;
    if (!timeline) return;
    const line = timeline.querySelector('.timeline__progress');
    if (!line) return;

    const tween = gsap.fromTo(
      line,
      { scaleY: 0 },
      {
        scaleY: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: timeline,
          start: 'top 78%',
          end: 'bottom 55%',
          scrub: true,
        },
      },
    );

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, []);

  return (
    <section className="section practice" id="practice">
      <div className="container practice__grid">
        <div className="practice__left">
          <p className="kicker" data-reveal>
            {site.practice.kicker}
          </p>
          <h2 className="h2" data-split>
            Опыт, в котором важен <em>результат</em>.
          </h2>
          <p className="lead" data-reveal>
            {site.practice.lead}
          </p>

          <div className="practice__stats" data-reveal-group>
            {site.practice.stats.map((stat) => (
              <div className="metric" key={stat.label}>
                <div className="metric__value">
                  <b data-count data-value={stat.value}>
                    {formatStat(stat.value)}
                  </b>
                  <span>{stat.suffix}</span>
                </div>
                <div className="metric__label">{stat.label}</div>
              </div>
            ))}
          </div>

          <ul className="credentials" data-reveal-group>
            {site.practice.credentials.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>

        <div className="practice__right" data-reveal>
          <p className="timeline__label">Как проходит визит</p>
          <div className="timeline" ref={timelineRef}>
            <span className="timeline__progress" aria-hidden="true" />
            {site.practice.timeline.map((item) => (
              <div className="timeline__item" key={item.year}>
                <div className="timeline__year">{item.year}</div>
                <div className="timeline__title">{item.title}</div>
                <p className="timeline__text">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
