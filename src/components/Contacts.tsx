import { useState } from 'react';
import { site } from '../data/site';
import { ArrowUpRight, Phone, Chat, Clock, MapPin } from './Icons';

export function Contacts() {
  const { contacts } = site;
  const [mapLoaded, setMapLoaded] = useState(false);

  return (
    <section className="contacts" id="contacts">
      <div className="container">
        <div className="section-head">
          <div className="section-head__main">
            <p className="kicker" data-reveal>
              Контакты
            </p>
            <h2 className="h2" data-split>
              Приходите <em>по записи</em>.
            </h2>
          </div>
          <div className="section-head__aside">
            <p className="lead" data-reveal>
              Контора в центре Апшеронска, первый этаж, отдельный вход. Приём по записи — так вы
              не ждёте в очереди, а документы проверяют заранее.
            </p>
          </div>
        </div>

        <div className="contacts__grid" data-reveal>
          <div className="contacts__info">
            <div>
              <p className="contacts__label">Адрес</p>
              <p className="contacts__address">
                {contacts.addressShort}
                <span>
                  {contacts.postalCode}, г. Апшеронск, Краснодарский край
                </span>
              </p>
            </div>

            <dl className="contacts__rows">
              <div className="contact-row">
                <dt>
                  <Phone width={14} height={14} /> Телефон
                </dt>
                <dd>
                  <a href={contacts.phoneHref}>{contacts.phone}</a>
                </dd>
              </div>
              <div className="contact-row">
                <dt>
                  <Chat width={14} height={14} /> Мессенджеры
                </dt>
                <dd>
                  <a href={contacts.whatsapp} target="_blank" rel="noopener noreferrer">
                    WhatsApp
                  </a>
                  <span aria-hidden="true"> · </span>
                  <a href={contacts.telegram} target="_blank" rel="noopener noreferrer">
                    Telegram
                  </a>
                </dd>
              </div>
              <div className="contact-row">
                <dt>
                  <Clock width={14} height={14} /> Приём
                </dt>
                <dd>Вт — Пт, 09:00 — 17:00</dd>
              </div>
              <div className="contact-row">
                <dt>Обед</dt>
                <dd>12:00 — 13:00</dd>
              </div>
              <div className="contact-row">
                <dt>Суббота</dt>
                <dd>10:00 — 15:00</dd>
              </div>
              <div className="contact-row">
                <dt>Воскресенье, понедельник</dt>
                <dd>выходной</dd>
              </div>
              <div className="contact-row">
                <dt>
                  <MapPin width={14} height={14} /> Вход
                </dt>
                <dd>со стороны ул. Профсоюзной, 1 этаж</dd>
              </div>
              <div className="contact-row">
                <dt>Лицензия</dt>
                <dd>№ 638 от 29.10.2014</dd>
              </div>
            </dl>

            <div className="contacts__actions">
              <a
                className="btn btn--primary"
                href={contacts.routeLink}
                target="_blank"
                rel="noopener noreferrer"
              >
                Построить маршрут
                <ArrowUpRight />
              </a>
              <a
                className="btn btn--ghost"
                href={contacts.mapLink}
                target="_blank"
                rel="noopener noreferrer"
              >
                Открыть в Яндекс Картах
              </a>
              <a
                className="btn btn--ghost"
                href={contacts.telegram}
                target="_blank"
                rel="noopener noreferrer"
              >
                Telegram
              </a>
            </div>
          </div>

          <div className="contacts__map">
            <iframe
              src={contacts.mapEmbed}
              title="Нотариальная контора на карте — Апшеронск, Профсоюзная 43"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
              onLoad={() => setMapLoaded(true)}
            />
            <div className={`map__loader${mapLoaded ? ' is-hidden' : ''}`}>
              <span className="map__loader-label">Яндекс Карты</span>
              <a href={contacts.mapLink} target="_blank" rel="noopener noreferrer">
                Открыть карту в новой вкладке
              </a>
            </div>
            <div className="map__badge">
              <i />
              Апшеронск · Профсоюзная, 43
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
