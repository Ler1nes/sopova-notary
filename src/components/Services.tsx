import { useState } from 'react';
import { site } from '../data/site';
import { ArrowUpRight } from './Icons';

export function Services() {
  const [open, setOpen] = useState<string | null>(site.services[0].id);

  return (
    <section className="section services" id="services">
      <div className="container">
        <div className="section-head">
          <div className="section-head__main">
            <p className="kicker" data-reveal>
              Услуги
            </p>
            <h2 className="h2" data-split>
              Нотариальные действия — <em>по делу</em>.
            </h2>
          </div>
          <div className="section-head__aside">
            <p className="lead" data-reveal>
              Восемь направлений, с которыми приходят чаще всего. Если вашего случая нет в
              списке — позвоните: сразу скажем, решается ли вопрос у нотариуса.
            </p>
            <a className="link-arrow" href="#prices" data-reveal>
              Полный прайс <ArrowUpRight />
            </a>
          </div>
        </div>

        <div className="services__list">
          {site.services.map((service, index) => {
            const isOpen = open === service.id;
            const panelId = `service-panel-${service.id}`;
            return (
              <div className={`service${isOpen ? ' is-open' : ''}`} key={service.id} data-reveal>
                <button
                  type="button"
                  className="service__head"
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  onClick={() => setOpen(isOpen ? null : service.id)}
                >
                  <span className="service__num">{String(index + 1).padStart(2, '0')}</span>
                  <span className="service__title">{service.title}</span>
                  <span className="service__price">{service.price}</span>
                  <span className="service__toggle" aria-hidden="true" />
                </button>

                <div
                  className="service__body"
                  id={panelId}
                  role="region"
                  aria-label={service.title}
                  inert={!isOpen}
                >
                  <div>
                    <div className="service__inner">
                      <p className="service__desc">{service.desc}</p>
                      <div className="service__tags">
                        {service.tags.map((tag) => (
                          <span className="tag" key={tag}>
                            {tag}
                          </span>
                        ))}
                      </div>
                      <div className="service__links">
                        <a className="link-arrow" href="#contact">
                          Записаться на приём <ArrowUpRight />
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
