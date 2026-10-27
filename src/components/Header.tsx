import { useEffect, useRef, useState } from 'react';
import { site } from '../data/site';
import { Scales } from './Icons';

interface HeaderProps {
  onOpenMenu: () => void;
  menuOpen: boolean;
}

export function Header({ onOpenMenu, menuOpen }: HeaderProps) {
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [active, setActive] = useState('');
  const lastY = useRef(0);

  useEffect(() => {
    lastY.current = window.scrollY;

    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 24);
      if (Math.abs(y - lastY.current) > 8) {
        setHidden(y > lastY.current && y > 480);
        lastY.current = y;
      }
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const ids = ['services', 'prices', 'practice', 'reviews', 'contacts'];
    const sections = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => Boolean(el));
    if (!sections.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(`#${entry.target.id}`);
        });
      },
      { rootMargin: '-45% 0px -50% 0px', threshold: 0 },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  return (
    <header
      className={`header${scrolled ? ' is-scrolled' : ''}${hidden && !menuOpen ? ' is-hidden' : ''}`}
      data-header
    >
      <div className="header__inner">
        <a className="brand" href="#top" aria-label={`${site.brand.full} — на главную`}>
          <span className="brand__mark">
            <Scales />
          </span>
          <span className="brand__text">
            <span className="brand__name">{site.brand.notary}</span>
            <span className="brand__sub">{site.brand.tagline}</span>
          </span>
        </a>

        <nav className="nav" aria-label="Основная навигация">
          {site.nav.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className={active === item.href ? 'is-active' : undefined}
              aria-current={active === item.href ? 'true' : undefined}
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="header__actions">
          <a className="header__phone" href={site.contacts.phoneHref}>
            {site.contacts.phone}
          </a>
          <a className="btn btn--primary btn--sm" href="#contact">
            Записаться
          </a>
          <button
            type="button"
            className="burger"
            onClick={onOpenMenu}
            aria-label="Открыть меню"
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
          >
            <span />
            <span />
          </button>
        </div>
      </div>
    </header>
  );
}
