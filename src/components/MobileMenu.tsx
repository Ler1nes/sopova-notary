import { useEffect, useRef } from 'react';
import { site } from '../data/site';
import { Scales, Close } from './Icons';

interface MobileMenuProps {
  open: boolean;
  onClose: () => void;
}

export function MobileMenu({ open, onClose }: MobileMenuProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;

    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    const timer = window.setTimeout(() => closeRef.current?.focus(), 60);

    return () => {
      document.removeEventListener('keydown', onKey);
      window.clearTimeout(timer);
    };
  }, [open, onClose]);

  return (
    <div
      id="mobile-menu"
      className={`menu${open ? ' is-open' : ''}`}
      ref={rootRef}
      role="dialog"
      aria-modal="true"
      aria-label="Меню сайта"
      aria-hidden={!open}
    >
      <div className="menu__top">
        <a className="brand" href="#top" onClick={onClose}>
          <span className="brand__mark">
            <Scales />
          </span>
          <span className="brand__text">
            <span className="brand__name">{site.brand.notary}</span>
            <span className="brand__sub">{site.brand.tagline}</span>
          </span>
        </a>
        <button
          type="button"
          className="menu__close"
          onClick={onClose}
          aria-label="Закрыть меню"
          ref={closeRef}
          tabIndex={open ? 0 : -1}
        >
          <Close />
        </button>
      </div>

      <nav className="menu__nav" aria-label="Мобильная навигация">
        {site.nav.map((item, index) => (
          <a key={item.href} href={item.href} onClick={onClose} tabIndex={open ? 0 : -1}>
            {item.label}
            <span>0{index + 1}</span>
          </a>
        ))}
      </nav>

      <div className="menu__footer">
        <a className="menu__phone" href={site.contacts.phoneHref} tabIndex={open ? 0 : -1}>
          {site.contacts.phone}
        </a>
        <p className="menu__addr">
          {site.contacts.addressFull}
          <br />
          Вт — Пт 09:00 — 17:00, обед 12:00 — 13:00
          <br />
          Сб 10:00 — 15:00, Вс и Пн — выходной
        </p>
        <a
          className="btn btn--primary btn--wide"
          href="#contact"
          onClick={onClose}
          tabIndex={open ? 0 : -1}
        >
          Записаться на приём
        </a>
      </div>
    </div>
  );
}
