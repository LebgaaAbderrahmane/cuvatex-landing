import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { track } from '../analytics';
import { WHATSAPP_URL } from '../lib/contact';
import { SERVICE_SLUGS } from '../lib/services';

const labelStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: 8,
  fontSize: 13,
  fontWeight: 600,
  letterSpacing: '0.04em',
  textTransform: 'uppercase',
  color: 'var(--muted, #6c665e)',
};

// textTransform/letterSpacing reset — otherwise inherited from the uppercase label.
const controlStyle = {
  width: '100%',
  background: 'transparent',
  border: '1px solid var(--line, rgba(21,18,15,0.13))',
  color: 'var(--fg, #15120f)',
  padding: '13px 14px',
  borderRadius: 2,
  fontSize: 16,
  fontWeight: 400,
  textTransform: 'none',
  letterSpacing: 0,
  fontFamily: 'inherit',
};

const textareaStyle = { ...controlStyle, lineHeight: 1.5 };

// Inline handlers, not CSS — index.css is a reset + focus-ring rules only.
const onFocus = e => (e.target.style.borderColor = 'var(--accent, #0E7A69)');
const onBlur = e => (e.target.style.borderColor = 'var(--line, rgba(21,18,15,0.13))');

// One labelled control. `as` has no default — adding a field is a decision.
function Field({ label, as, ...controlProps }) {
  const Control = as;
  return (
    <label style={labelStyle}>
      {label}
      <Control
        required
        className="focus-ring"
        style={as === 'textarea' ? textareaStyle : controlStyle}
        onFocus={onFocus}
        onBlur={onBlur}
        {...controlProps}
      />
    </label>
  );
}

// The fields + submit button, swapped for a confirmation panel once sent.
// Submission itself lives in ContactPage.jsx — this only renders `status`.
export default function ContactForm({ status, onSubmit, defaultService }) {
  const { t } = useTranslation();
  const sent = status === 'sent';
  const sending = status === 'sending';
  const servicesList = t('services', { returnObjects: true });
  const services = Array.isArray(servicesList) ? servicesList : [];

  return (
    <AnimatePresence mode="wait">
      {!sent ? (
        <motion.form
          key="form"
          onSubmit={onSubmit}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={{ display: 'flex', flexDirection: 'column', gap: 20 }}
        >
          {/* Honeypot — hidden from users, catches bots */}
          <input
            type="checkbox"
            name="botcheck"
            tabIndex={-1}
            autoComplete="off"
            aria-hidden="true"
            style={{ display: 'none' }}
          />

          <Field as="input" type="text" name="name" label={t('nameLabel')} />
          <Field as="input" type="email" name="email" label={t('emailLabel')} />
          <Field
            as="select"
            name="service"
            label={t('serviceLabel')}
            required={false}
            defaultValue={defaultService || ''}
          >
            <option value="">{t('serviceOptionOther')}</option>
            {SERVICE_SLUGS.map((slug, i) => (
              <option key={slug} value={slug}>{services[i]?.title}</option>
            ))}
          </Field>
          <Field as="textarea" name="message" rows={4} label={t('msgLabel')} />

          <motion.button
            type="submit"
            className="focus-ring"
            disabled={sending}
            whileHover={sending ? {} : { opacity: 0.92 }}
            whileTap={sending ? {} : { scale: 0.98 }}
            style={{
              alignSelf: 'flex-start',
              background: 'var(--accent, #0E7A69)',
              color: 'var(--accent-fg, #fff)',
              border: 'none',
              fontWeight: 600,
              fontSize: 16,
              padding: '14px 28px',
              borderRadius: 2,
              cursor: sending ? 'default' : 'pointer',
              opacity: sending ? 0.7 : 1,
              fontFamily: 'inherit',
            }}
          >
            {sending ? t('sending') : t('send')}
          </motion.button>

          {status === 'error' && (
            <div
              role="alert"
              style={{
                margin: 0,
                fontSize: 14,
                lineHeight: 1.6,
                color: 'var(--danger, #b3261e)',
              }}
            >
              {t('error')}
              {/* Stacked, not side by side — the two 44px tap targets would overlap. */}
              <span style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', marginTop: 4 }}>
                <a
                  href={`mailto:${t('email')}`}
                  className="focus-ring"
                  style={{ color: 'var(--danger, #b3261e)', fontWeight: 600, display: 'inline-flex', alignItems: 'center', minHeight: 44, minWidth: 44 }}
                >
                  {t('email')}
                </a>
                <a
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => track('whatsapp_click')}
                  className="focus-ring"
                  style={{ color: 'var(--danger, #b3261e)', fontWeight: 600, display: 'inline-flex', alignItems: 'center', minHeight: 44, minWidth: 44 }}
                >
                  {t('whatsappLink')}
                </a>
              </span>
            </div>
          )}
        </motion.form>
      ) : (
        <motion.div
          key="sent"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            border: '1px solid var(--line, rgba(21,18,15,0.13))',
            borderRadius: 3,
            padding: '40px 32px',
            display: 'flex',
            flexDirection: 'column',
            gap: 12,
          }}
        >
          <span style={{
            width: 12,
            height: 12,
            background: 'var(--accent, #0E7A69)',
            display: 'inline-block',
          }} />
          <p style={{
            margin: 0,
            fontSize: 20,
            fontWeight: 600,
            letterSpacing: '-0.01em',
            color: 'var(--fg, #15120f)',
          }}>
            {t('sent')}
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
