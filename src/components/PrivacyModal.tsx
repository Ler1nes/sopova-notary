import { useEffect, useRef } from 'react';
import { site } from '../data/site';
import { Close } from './Icons';

interface PrivacyModalProps {
  open: boolean;
  onClose: () => void;
}

export function PrivacyModal({ open, onClose }: PrivacyModalProps) {
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    const timer = window.setTimeout(() => closeRef.current?.focus(), 80);
    return () => {
      document.removeEventListener('keydown', onKey);
      window.clearTimeout(timer);
    };
  }, [open, onClose]);

  return (
    <div
      className={`modal${open ? ' is-open' : ''}`}
      role="dialog"
      aria-modal="true"
      aria-label="Политика конфиденциальности"
      aria-hidden={!open}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="modal__panel">
        <button
          type="button"
          className="modal__close"
          onClick={onClose}
          aria-label="Закрыть"
          ref={closeRef}
        >
          <Close />
        </button>

        <h2>Политика обработки персональных данных</h2>

        <p>
          Оператор — нотариальная контора Соповой А.В. (г. Апшеронск, ул. Профсоюзная, 43).
          Политика описывает, какие данные собирает сайт и как они используются.
        </p>

        <p>
          <strong>Какие данные собираются.</strong> При отправке формы — имя, номер телефона,
          выбранная услуга и комментарий. Автоматически — обезличенные технические данные:
          тип устройства, браузер, источник перехода.
        </p>

        <p>
          <strong>Зачем.</strong> Только чтобы связаться с вами, уточнить вопрос и записать на
          приём. Данные не используются для рассылок без отдельного согласия.
        </p>

        <p>
          <strong>Кому передаются.</strong> Третьим лицам не передаются, кроме случаев,
          предусмотренных законом. Сведения, ставшие известными при совершении нотариального
          действия, охраняются нотариальной тайной.
        </p>

        <p>
          <strong>Сколько хранятся.</strong> До достижения цели обработки или до отзыва согласия.
          Отозвать согласие можно по телефону {site.contacts.phone}.
        </p>

        <p>
          <strong>Cookies.</strong> Сайт использует технические cookies для корректной работы
          интерфейса и встроенной карты. Отключить их можно в настройках браузера.
        </p>

        <p>
          <strong>Ваши права.</strong> Вы вправе запросить сведения об обработке, потребовать
          уточнения или удаления данных, отозвать согласие.
        </p>

        <p className="muted" style={{ marginTop: 24, fontSize: '0.78rem' }}>
          Демонстрационный шаблон документа. Перед публикацией заменить на утверждённый текст
          оператора.
        </p>
      </div>
    </div>
  );
}
