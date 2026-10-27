import { site } from '../data/site';
import { ArrowUp, MapPin } from './Icons';

interface FooterProps {
  onPrivacy: () => void;
}

export function Footer({ onPrivacy }: FooterProps) {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__top">
          <div className="footer__brand">
            <p className="brand__name" style={{ fontSize: '1.4rem' }}>
              {site.brand.notary}
            </p>
            <p className="footer__desc">
              {site.brand.tagline}. Наследство, недвижимость, доверенности и семейные соглашения.
              Приём по записи в Апшеронске.
            </p>
            <p className="footer__desc" style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
              <MapPin width={15} height={15} style={{ marginTop: 3, flex: 'none' }} />
              <span>
                {site.contacts.addressFull}
                <br />
                {site.contacts.postalCode}
              </span>
            </p>
          </div>

          <div className="footer__col">
            <h4>Навигация</h4>
            <ul>
              <li>
                <a href="#about">О конторе</a>
              </li>
              {site.nav.map((item) => (
                <li key={item.href}>
                  <a href={item.href}>{item.label}</a>
                </li>
              ))}
            </ul>
          </div>

          <div className="footer__col">
            <h4>Услуги</h4>
            <ul>
              {site.services.slice(0, 5).map((service) => (
                <li key={service.id}>
                  <a href="#services">{service.title}</a>
                </li>
              ))}
            </ul>
          </div>

          <div className="footer__col">
            <h4>Контакты</h4>
            <ul>
              <li>
                <a className="footer__phone" href={site.contacts.phoneHref}>
                  {site.contacts.phone}
                </a>
              </li>
              <li>
                <a href={site.contacts.whatsapp} target="_blank" rel="noopener noreferrer">
                  WhatsApp
                </a>
              </li>
              <li>
                <a href={site.contacts.telegram} target="_blank" rel="noopener noreferrer">
                  Telegram
                </a>
              </li>
              <li>Вт — Пт, 09:00 — 17:00</li>
              <li>Сб, 10:00 — 15:00</li>
              <li>
                <a href="#contacts">Схема проезда</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="footer__bottom">
          <p>
            © {year} Нотариальная контора Соповой Альвины Вагинаковны. {site.brand.license}.
            Нотариус занимается частной практикой. Информация на сайте не является публичной
            офертой.
          </p>
          <div className="footer__legal">
            <button type="button" onClick={onPrivacy}>
              Политика конфиденциальности
            </button>
            <a href="#top">Наверх</a>
          </div>
          <a className="to-top" href="#top" aria-label="Наверх">
            <ArrowUp />
          </a>
        </div>
      </div>
    </footer>
  );
}
