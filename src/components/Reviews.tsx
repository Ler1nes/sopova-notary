import { useCallback, useEffect, useRef } from 'react';
import { site } from '../data/site';
import { ArrowLeft, ArrowRight, Star } from './Icons';

export function Reviews() {
  const trackRef = useRef<HTMLDivElement>(null);
  const prevRef = useRef<HTMLButtonElement>(null);
  const nextRef = useRef<HTMLButtonElement>(null);

  const update = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    const max = track.scrollWidth - track.clientWidth - 2;
    if (prevRef.current) prevRef.current.disabled = track.scrollLeft <= 4;
    if (nextRef.current) nextRef.current.disabled = track.scrollLeft >= max;
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    update();
    track.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => {
      track.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, [update]);

  const scrollByCard = (direction: 1 | -1) => {
    const track = trackRef.current;
    if (!track) return;
    const card = track.querySelector<HTMLElement>('.review');
    const step = card ? card.offsetWidth + 16 : track.clientWidth * 0.8;
    track.scrollBy({ left: step * direction, behavior: 'smooth' });
  };

  return (
    <section className="section reviews" id="reviews">
      <div className="container">
        <div className="section-head">
          <div className="section-head__main">
            <p className="kicker" data-reveal>
              Отзывы
            </p>
            <h2 className="h2" data-split>
              Говорят <em>клиенты</em>.
            </h2>
          </div>
          <div className="section-head__aside">
            <div className="reviews__rating" data-reveal>
              <div className="rating__value">
                {String(site.reviews.rating).replace('.', ',')}
                <span> / 5</span>
              </div>
              <div
                className="rating__stars"
                aria-label={`Оценка ${site.reviews.rating} из 5 на Яндекс Картах`}
              >
                {[0, 1, 2, 3, 4].map((i) => (
                  <Star
                    key={i}
                    className={i < Math.round(site.reviews.rating) ? undefined : 'is-dim'}
                  />
                ))}
              </div>
              <div className="rating__count">
                {site.reviews.count} отзыва · {site.reviews.ratingsCount} оценки на Яндекс Картах
              </div>
            </div>
          </div>
        </div>

        <div className="reviews__bar">
          <span className="reviews__hint">Прокрутите или перетащите</span>
          <div className="reviews__arrows">
            <button
              type="button"
              className="arrow-btn"
              onClick={() => scrollByCard(-1)}
              aria-label="Предыдущие отзывы"
              ref={prevRef}
            >
              <ArrowLeft />
            </button>
            <button
              type="button"
              className="arrow-btn"
              onClick={() => scrollByCard(1)}
              aria-label="Следующие отзывы"
              ref={nextRef}
            >
              <ArrowRight />
            </button>
          </div>
        </div>

        <div className="reviews__track" ref={trackRef} tabIndex={0} aria-label="Отзывы клиентов">
          {site.reviews.items.map((review) => (
            <article className="review" key={`${review.author}-${review.date}`}>
              <div className="review__head" aria-label="Оценка 5 из 5">
                {[0, 1, 2, 3, 4].map((i) => (
                  <Star key={i} />
                ))}
              </div>
              <p className="review__text">«{review.text}»</p>
              <div className="review__footer">
                <span className="review__author">{review.author}</span>
                <span className="review__meta">
                  {review.service} · {review.date}
                </span>
              </div>
            </article>
          ))}
        </div>

        <div className="reviews__footer">
          <p>Оценки и новые отзывы — на карточке организации в Яндекс Картах.</p>
          <a
            className="link-arrow"
            href={site.contacts.orgLink}
            target="_blank"
            rel="noopener noreferrer"
          >
            Смотреть на картах
          </a>
        </div>
      </div>
    </section>
  );
}
