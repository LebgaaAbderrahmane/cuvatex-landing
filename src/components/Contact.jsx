import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import ScrollReveal from './ScrollReveal';

const WEB3FORMS_KEY = import.meta.env.VITE_WEB3FORMS_KEY;

export default function Contact() {
  const { t } = useTranslation();
  // status: 'idle' | 'sending' | 'sent' | 'error'
  const [status, setStatus] = useState('idle');
  const sent = status === 'sent';

  async function onSubmit(e) {
    e.preventDefault();
    setStatus('sending');

    const formData = new FormData(e.target);
    formData.append('access_key', WEB3FORMS_KEY);
    formData.append('subject', 'New message from cuvatex.com');

    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        setStatus('sent');
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  }

  return (
    <section
      id="contact"
      style={{
        scrollMarginTop: 80,
        padding: 'clamp(64px, 10vw, 124px) clamp(20px, 5vw, 48px)',
        background: 'var(--surface, #fff)',
        borderTop: '1px solid var(--line, rgba(21,18,15,0.13))',
      }}
    >
      <div style={{
        maxWidth: 1160,
        margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: 'clamp(40px, 6vw, 80px)',
        alignItems: 'start',
      }}>
        <div>
          <ScrollReveal>
            <p style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              margin: 0,
              fontSize: 13,
              letterSpacing: '0.16em',
              textTransform: 'uppercase',
              color: 'var(--muted, #6c665e)',
              fontWeight: 600,
            }}>
              <span style={{ width: 7, height: 7, background: 'var(--accent, #0E7A69)', display: 'inline-block' }} />
              {t('nav.contact')}
            </p>
          </ScrollReveal>

          <ScrollReveal delay={0.1}>
            <h2 style={{
              fontSize: 'clamp(30px, 5vw, 52px)',
              fontWeight: 600,
              letterSpacing: '-0.02em',
              lineHeight: 1.05,
              margin: '16px 0 0',
              maxWidth: '14ch',
            }}>
              {t('contactTitle')}
            </h2>
          </ScrollReveal>

          <ScrollReveal delay={0.15}>
            <p style={{
              margin: '22px 0 0',
              color: 'var(--muted, #6c665e)',
              fontSize: 'clamp(16px, 1.8vw, 19px)',
              lineHeight: 1.6,
              maxWidth: '44ch',
            }}>
              {t('contactIntro')}
            </p>
          </ScrollReveal>

          <ScrollReveal delay={0.2}>
            <p style={{ margin: '26px 0 0', fontSize: 16, color: 'var(--muted, #6c665e)' }}>
              {t('emailDirect')}{' '}
              <a
                href={`mailto:${t('email')}`}
                style={{ color: 'var(--accent, #0E7A69)', fontWeight: 600, textDecoration: 'none' }}
              >
                {t('email')}
              </a>
            </p>
          </ScrollReveal>

          <ScrollReveal delay={0.25}>
            <p style={{ margin: '12px 0 0', fontSize: 16, color: 'var(--muted, #6c665e)' }}>
              {t('whatsappDirect')}{' '}
              <a
                href="https://wa.me/PHONE_NUMBER_PLACEHOLDER"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: 'var(--accent, #0E7A69)', fontWeight: 600, textDecoration: 'none' }}
              >
                {t('whatsappLink')}
              </a>
            </p>
          </ScrollReveal>
        </div>

        <ScrollReveal delay={0.2}>
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
                <label style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 8,
                  fontSize: 13,
                  fontWeight: 600,
                  letterSpacing: '0.04em',
                  textTransform: 'uppercase',
                  color: 'var(--muted, #6c665e)',
                }}>
                  {t('nameLabel')}
                  <input
                    type="text"
                    name="name"
                    required
                    style={{
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
                    }}
                    onFocus={e => e.target.style.borderColor = 'var(--accent, #0E7A69)'}
                    onBlur={e => e.target.style.borderColor = 'var(--line, rgba(21,18,15,0.13))'}
                  />
                </label>

                <label style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 8,
                  fontSize: 13,
                  fontWeight: 600,
                  letterSpacing: '0.04em',
                  textTransform: 'uppercase',
                  color: 'var(--muted, #6c665e)',
                }}>
                  {t('emailLabel')}
                  <input
                    type="email"
                    name="email"
                    required
                    style={{
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
                    }}
                    onFocus={e => e.target.style.borderColor = 'var(--accent, #0E7A69)'}
                    onBlur={e => e.target.style.borderColor = 'var(--line, rgba(21,18,15,0.13))'}
                  />
                </label>

                <label style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 8,
                  fontSize: 13,
                  fontWeight: 600,
                  letterSpacing: '0.04em',
                  textTransform: 'uppercase',
                  color: 'var(--muted, #6c665e)',
                }}>
                  {t('msgLabel')}
                  <textarea
                    name="message"
                    rows={4}
                    required
                    style={{
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
                      lineHeight: 1.5,
                      fontFamily: 'inherit',
                    }}
                    onFocus={e => e.target.style.borderColor = 'var(--accent, #0E7A69)'}
                    onBlur={e => e.target.style.borderColor = 'var(--line, rgba(21,18,15,0.13))'}
                  />
                </label>

                <motion.button
                  type="submit"
                  disabled={status === 'sending'}
                  whileHover={status === 'sending' ? {} : { opacity: 0.92 }}
                  whileTap={status === 'sending' ? {} : { scale: 0.98 }}
                  style={{
                    alignSelf: 'flex-start',
                    background: 'var(--accent, #0E7A69)',
                    color: 'var(--accent-fg, #fff)',
                    border: 'none',
                    fontWeight: 600,
                    fontSize: 16,
                    padding: '14px 28px',
                    borderRadius: 2,
                    cursor: status === 'sending' ? 'default' : 'pointer',
                    opacity: status === 'sending' ? 0.7 : 1,
                    fontFamily: 'inherit',
                  }}
                >
                  {status === 'sending' ? t('sending') : t('send')}
                </motion.button>

                {status === 'error' && (
                  <p
                    role="alert"
                    style={{ margin: 0, fontSize: 14, color: 'var(--accent, #0E7A69)' }}
                  >
                    {t('error')}
                  </p>
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
        </ScrollReveal>
      </div>
    </section>
  );
}
