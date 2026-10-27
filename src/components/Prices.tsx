import { useRef, useState } from 'react';
import { site } from '../data/site';
import { ArrowUpRight } from './Icons';

export function Prices() {
  const [active, setActive] = useState<string>(site.prices.categories[0].id);
  const tabsRef = useRef<Array<HTMLButtonElement | null>>([]);

  const category =
    site.prices.categories.find((item) => item.id === active) ?? site.prices.categories[0];

  const onKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>, index: number) => {
    if (event.key !== 'ArrowRight' && event.key !== 'ArrowLeft') return;
    event.preventDefault();
    const total = site.prices.categories.length;
    const next = event.key === 'ArrowRight' ? (index + 1) % total : (index - 1 + total) % total;
    setActive(site.prices.categories[next].id);
    tabsRef.current[next]?.focus();
  };

  return (
    <section className="section prices" id="prices">
      <div className="container">
        <div className="section-head">
          <div className="section-head__main">
            <p className="kicker" data-reveal>
              Стоимость
            </p>
            <h2 className="h2" data-split>
              Цены, которые <em>можно посчитать заранее</em>.
            </h2>
          </div>
          <div className="section-head__aside">
            <p className="lead" data-reveal>
              Ориентиры по нотариальному тарифу и услугам правового и технического характера.
              Итоговую сумму фиксируем до начала работы.
            </p>
          </div>
        </div>

        <div className="prices__tabs" role="tablist" aria-label="Категории услуг">
          {site.prices.categories.map((item, index) => (
            <button
              type="button"
              key={item.id}
              role="tab"
              id={`tab-${item.id}`}
              aria-selected={active === item.id}
              aria-controls={`panel-${item.id}`}
              tabIndex={active === item.id ? 0 : -1}
              className={`tab${active === item.id ? ' is-active' : ''}`}
              onClick={() => setActive(item.id)}
              onKeyDown={(event) => onKeyDown(event, index)}
              ref={(el) => {
                tabsRef.current[index] = el;
              }}
            >
              {item.title}
            </button>
          ))}
        </div>

        <div className="prices__panel">
          <div
            className="price-list"
            role="tabpanel"
            id={`panel-${category.id}`}
            aria-labelledby={`tab-${category.id}`}
            key={category.id}
          >
            {category.rows.map((row) => (
              <div className="price-row" key={row.title}>
                <div>
                  <div className="price-row__title">{row.title}</div>
                  {row.detail ? <div className="price-row__detail">{row.detail}</div> : null}
                </div>
                <div className="price-row__value">{row.price}</div>
              </div>
            ))}
          </div>

          <aside className="prices__aside" data-reveal>
            <h3 className="prices__aside-title">Как формируется сумма</h3>
            <p>{site.prices.note}</p>
            <p>
              Позвоните — назовём вилку по вашему случаю и список документов. Консультация по
              телефону бесплатная.
            </p>
            <a className="btn btn--primary btn--wide" href="#contact">
              Уточнить стоимость
            </a>
            <a className="link-arrow" href={site.contacts.phoneHref}>
              {site.contacts.phone} <ArrowUpRight />
            </a>
          </aside>
        </div>
      </div>
    </section>
  );
}
