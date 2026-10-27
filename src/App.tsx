import { useCallback, useEffect, useRef, useState } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Header } from './components/Header';
import { MobileMenu } from './components/MobileMenu';
import { Hero } from './components/Hero';
import { Marquee } from './components/Marquee';
import { About } from './components/About';
import { Services } from './components/Services';
import { Principles } from './components/Principles';
import { Prices } from './components/Prices';
import { Practice } from './components/Practice';
import { Reviews } from './components/Reviews';
import { Faq } from './components/Faq';
import { Contacts } from './components/Contacts';
import { ContactForm } from './components/ContactForm';
import { Footer } from './components/Footer';
import { PrivacyModal } from './components/PrivacyModal';
import { Loader } from './components/Loader';
import { initAnimations } from './lib/animations';

gsap.registerPlugin(ScrollTrigger);

export default function App() {
  const [reducedMotion] = useState(
    () => window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  );
  const [ready, setReady] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [privacyOpen, setPrivacyOpen] = useState(false);

  const lenisRef = useRef<Lenis | null>(null);

  /* ---------- smooth scroll ---------- */
  useEffect(() => {
    if (reducedMotion) return;

    const lenis = new Lenis({
      lerp: 0.1,
      smoothWheel: true,
      touchMultiplier: 1.4,
    });
    lenisRef.current = lenis;
    lenis.on('scroll', ScrollTrigger.update);

    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, [reducedMotion]);

  /* ---------- fonts + loader ---------- */
  useEffect(() => {
    let cancelled = false;
    const fonts = document.fonts?.ready ?? Promise.resolve();
    const timeout = new Promise((resolve) => setTimeout(resolve, 2200));

    Promise.race([fonts, timeout]).then(() => {
      if (cancelled) return;
      window.setTimeout(() => setReady(true), 180);
    });

    return () => {
      cancelled = true;
    };
  }, []);

  const handleExited = useCallback(() => {
    setLoaded(true);
    document.documentElement.classList.add('is-loaded');
    window.dispatchEvent(new Event('app:loaded'));
  }, []);

  /* ---------- scroll lock ---------- */
  useEffect(() => {
    const locked = !loaded || menuOpen || privacyOpen;
    document.body.classList.toggle('is-locked', locked);
    if (locked) lenisRef.current?.stop();
    else lenisRef.current?.start();
  }, [loaded, menuOpen, privacyOpen]);

  /* ---------- animations ---------- */
  useEffect(() => {
    if (!loaded || reducedMotion) return;
    return initAnimations();
  }, [loaded, reducedMotion]);

  /* ---------- anchor navigation ---------- */
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey) return;
      const link = (event.target as HTMLElement | null)?.closest<HTMLAnchorElement>('a[href^="#"]');
      if (!link) return;

      const hash = link.getAttribute('href');
      if (!hash || hash === '#') return;

      const target = document.querySelector<HTMLElement>(hash);
      if (!target) return;

      event.preventDefault();
      if (menuOpen) setMenuOpen(false);

      const lenis = lenisRef.current;
      if (lenis) {
        lenis.start();
        lenis.scrollTo(target, { offset: -64, duration: 1.25 });
      } else {
        target.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth' });
      }
      window.history.replaceState(null, '', hash);
    };

    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, [menuOpen, reducedMotion]);

  return (
    <>
      <a className="skip-link" href="#services">
        Перейти к содержанию
      </a>

      <Loader ready={ready} onExited={handleExited} reducedMotion={reducedMotion} />
      <div className="scroll-progress" aria-hidden="true" />

      <Header onOpenMenu={() => setMenuOpen(true)} menuOpen={menuOpen} />
      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />

      <main id="main">
        <Hero reducedMotion={reducedMotion} />
        <Marquee />
        <About />
        <Services />
        <Principles reducedMotion={reducedMotion} />
        <Prices />
        <Practice />
        <Reviews />
        <Faq />
        <Contacts />
        <ContactForm onPrivacy={() => setPrivacyOpen(true)} />
      </main>

      <Footer onPrivacy={() => setPrivacyOpen(true)} />
      <PrivacyModal open={privacyOpen} onClose={() => setPrivacyOpen(false)} />
    </>
  );
}
