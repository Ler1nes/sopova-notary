import { useState } from 'react';
import type { FormEvent } from 'react';
import { site } from '../data/site';
import { ArrowRight, Check, Phone, Chat, Send } from './Icons';

interface ContactFormProps {
  onPrivacy: () => void;
}

type Status = 'idle' | 'sending' | 'success';

interface FormValues {
  name: string;
  phone: string;
  service: string;
  message: string;
}

const emptyValues: FormValues = { name: '', phone: '', service: '', message: '' };

function formatPhone(raw: string) {
  let digits = raw.replace(/\D/g, '').slice(0, 11);
  if (!digits) return '';
  if (digits[0] === '8') digits = `7${digits.slice(1)}`;
  if (digits[0] !== '7') digits = `7${digits}`;
  const rest = digits.slice(1);
  let out = '+7';
  if (rest.length) out += ` (${rest.slice(0, 3)}`;
  if (rest.length >= 3) out += ')';
  if (rest.length > 3) out += ` ${rest.slice(3, 6)}`;
  if (rest.length > 6) out += `-${rest.slice(6, 8)}`;
  if (rest.length > 8) out += `-${rest.slice(8, 10)}`;
  return out;
}

export function ContactForm({ onPrivacy }: ContactFormProps) {
  const [values, setValues] = useState<FormValues>(emptyValues);
  const [consent, setConsent] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<Status>('idle');

  const update = (field: keyof FormValues, value: string) => {
    setValues((prev) => ({ ...prev, [field]: field === 'phone' ? formatPhone(value) : value }));
    setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const validate = () => {
    const next: Record<string, string> = {};
    if (values.name.trim().length < 2) next.name = 'Укажите имя';
    const digits = values.phone.replace(/\D/g, '');
    if (digits.length !== 11) next.phone = 'Телефон в формате +7 (___) ___-__-__';
    if (!consent) next.consent = 'Нужно согласие на обработку данных';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!validate()) return;

    setStatus('sending');

    const payload = {
      name: values.name.trim(),
      phone: values.phone,
      service: values.service || 'Консультация',
      message: values.message.trim(),
      source: 'site',
      createdAt: new Date().toISOString(),
    };

    const endpoint = import.meta.env.VITE_LEAD_ENDPOINT as string | undefined;

    try {
      if (endpoint) {
        await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      } else {
        const text = [
          'Заявка с сайта нотариальной конторы',
          `Имя: ${payload.name}`,
          `Телефон: ${payload.phone}`,
          `Вопрос: ${payload.service}`,
          payload.message ? `Комментарий: ${payload.message}` : '',
        ]
          .filter(Boolean)
          .join('\n');
        window.open(`${site.contacts.whatsapp}?text=${encodeURIComponent(text)}`, '_blank', 'noopener');
      }
      setStatus('success');
    } catch (error) {
      console.warn('Не удалось отправить заявку:', error);
      setStatus('idle');
      setErrors({ form: 'Не удалось отправить. Позвоните по телефону.' });
    }
  };

  return (
    <section className="contact" id="contact">
      <div className="container contact__grid">
        <div className="contact__left">
          <p className="kicker" data-reveal>
            Запись
          </p>
          <h2 className="h2" data-split>
            Запишитесь <em>на приём</em>.
          </h2>
          <p className="lead" data-reveal>
            {site.form.lead}
          </p>

          <a className="contact__phone" href={site.contacts.phoneHref} data-reveal>
            {site.contacts.phone}
          </a>

          <div className="contact__links" data-reveal>
            <a
              className="btn btn--ghost btn--sm"
              href={site.contacts.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Chat /> WhatsApp
            </a>
            <a
              className="btn btn--ghost btn--sm"
              href={site.contacts.telegram}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Send /> Telegram
            </a>
            <a className="btn btn--ghost btn--sm" href={site.contacts.phoneHref}>
              <Phone /> Позвонить
            </a>
          </div>

          <dl className="contact__hours" data-reveal>
            {site.contacts.hours.map((row) => (
              <div key={row.days}>
                <dt>{row.days}</dt>
                <dd>
                  {row.time}
                  {row.note ? <small>{row.note}</small> : null}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="form" data-reveal>
          {status === 'success' ? (
            <div className="form__success" role="status">
              <span className="form__success-icon">
                <Check />
              </span>
              <h3>Заявка сформирована</h3>
              <p>
                Мы открыли WhatsApp с текстом обращения — отправьте сообщение, и оно попадёт в
                контору. Если окно не открылось, позвоните: {site.contacts.phone}.
              </p>
              <div className="contacts__actions">
                <a
                  className="btn btn--primary btn--sm"
                  href={site.contacts.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Открыть WhatsApp
                </a>
                <button
                  type="button"
                  className="btn btn--ghost btn--sm"
                  onClick={() => {
                    setValues(emptyValues);
                    setConsent(false);
                    setStatus('idle');
                  }}
                >
                  Новая заявка
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={onSubmit} noValidate>
              <div className="form__title">Оставьте телефон</div>
              <p className="form__hint">Перезвоним в рабочие часы и скажем, какие документы взять.</p>

              <div className="form__fields">
                <div className={`field${errors.name ? ' is-invalid' : ''}`}>
                  <label className="field__label" htmlFor="lead-name">
                    Имя
                  </label>
                  <input
                    id="lead-name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    placeholder="Как к вам обращаться"
                    value={values.name}
                    onChange={(event) => update('name', event.target.value)}
                    aria-invalid={Boolean(errors.name)}
                    aria-describedby={errors.name ? 'lead-name-error' : undefined}
                  />
                  {errors.name ? (
                    <span className="field__error" id="lead-name-error">
                      {errors.name}
                    </span>
                  ) : null}
                </div>

                <div className={`field${errors.phone ? ' is-invalid' : ''}`}>
                  <label className="field__label" htmlFor="lead-phone">
                    Телефон
                  </label>
                  <input
                    id="lead-phone"
                    name="phone"
                    type="tel"
                    inputMode="tel"
                    autoComplete="tel"
                    placeholder="+7 (___) ___-__-__"
                    value={values.phone}
                    onChange={(event) => update('phone', event.target.value)}
                    aria-invalid={Boolean(errors.phone)}
                    aria-describedby={errors.phone ? 'lead-phone-error' : undefined}
                  />
                  {errors.phone ? (
                    <span className="field__error" id="lead-phone-error">
                      {errors.phone}
                    </span>
                  ) : null}
                </div>

                <div className="field form__full">
                  <label className="field__label" htmlFor="lead-service">
                    Вопрос
                  </label>
                  <select
                    id="lead-service"
                    name="service"
                    value={values.service}
                    onChange={(event) => update('service', event.target.value)}
                  >
                    <option value="">Не знаю — нужна консультация</option>
                    {site.services.map((service) => (
                      <option value={service.title} key={service.id}>
                        {service.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="field form__full">
                  <label className="field__label" htmlFor="lead-message">
                    Комментарий
                  </label>
                  <textarea
                    id="lead-message"
                    name="message"
                    placeholder="Коротко: что нужно оформить, есть ли сроки"
                    value={values.message}
                    onChange={(event) => update('message', event.target.value)}
                  />
                </div>

                <div className={`check-row form__full${errors.consent ? ' is-invalid' : ''}`}>
                  <label className="check">
                    <input
                      type="checkbox"
                      checked={consent}
                      onChange={(event) => {
                        setConsent(event.target.checked);
                        setErrors((prev) => ({ ...prev, consent: '' }));
                      }}
                      aria-invalid={Boolean(errors.consent)}
                    />
                    <span>Согласен на обработку персональных данных</span>
                  </label>
                  <button type="button" className="check-link" onClick={onPrivacy}>
                    Политика конфиденциальности
                  </button>
                </div>

                <div className="form__submit">
                  <button
                    className="btn btn--primary btn--wide"
                    type="submit"
                    disabled={status === 'sending'}
                  >
                    {status === 'sending' ? 'Отправляем…' : site.form.submit}
                    {status !== 'sending' ? <ArrowRight className="btn__icon" /> : null}
                  </button>
                  {errors.consent ? <span className="field__error">{errors.consent}</span> : null}
                  {errors.form ? <span className="field__error">{errors.form}</span> : null}
                  <span className="form__status">{site.form.note}</span>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
