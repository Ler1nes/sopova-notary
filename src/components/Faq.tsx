import { site } from '../data/site';
import { ArrowUpRight } from './Icons';

export function Faq() {
  return (
    <section className="section faq" id="faq">
      <div className="container faq__grid">
        <div className="faq__left">
          <p className="kicker" data-reveal>
            Вопросы
          </p>
          <h2 className="h2" data-split>
            Коротко о <em>главном</em>.
          </h2>
          <p className="lead" data-reveal>
            Ответы на то, о чём спрашивают до визита. Если вопроса нет в списке — позвоните,
            разберёмся по телефону.
          </p>
          <a className="btn btn--ghost" href="#contact" data-reveal>
            Задать свой вопрос
            <ArrowUpRight />
          </a>
        </div>

        <div className="faq__list">
          {site.faq.map((item) => (
            <details className="faq__item" key={item.q} data-reveal>
              <summary>
                {item.q}
                <span className="faq__icon" aria-hidden="true" />
              </summary>
              <div className="faq__body">
                <div>
                  <p>{item.a}</p>
                </div>
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
