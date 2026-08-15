import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import ScrollReveal from './ScrollReveal';
import Section from './ui/Section';
import SectionHeader from './ui/SectionHeader';
import ContactForm from './ContactForm';
import { track } from '../analytics';
import { WHATSAPP_URL } from '../lib/contact';

const WEB3FORMS_KEY = import.meta.env.VITE_WEB3FORMS_KEY;

export default function Contact() {
  const { t } = useTranslation();
  // status: 'idle' | 'sending' | 'sent' | 'error'
  const [status, setStatus] = useState('idle');

  async function onSubmit(e) {
    e.preventDefault();

    // Vite inlines VITE_WEB3FORMS_KEY at build time. A build with no .env and no
    // --build-arg produces `undefined` here, and every submit would POST
    // access_key="undefined" and be rejected. Fail immediately instead, and say so
    // in the console — otherwise the misconfiguration is invisible to whoever
    // deployed it.
    if (!WEB3FORMS_KEY) {
      console.error(
        '[contact] VITE_WEB3FORMS_KEY is missing from this build. ' +
        'Set it in .env for local builds, or pass --build-arg VITE_WEB3FORMS_KEY=... to docker build.'
      );
      setStatus('error');
      return;
    }

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
        track('contact_form_submit');
      } else {
        console.error('[contact] web3forms rejected the submission:', data);
        setStatus('error');
        track('contact_form_error');
      }
    } catch (err) {
      console.error('[contact] submission failed:', err);
      setStatus('error');
      track('contact_form_error');
    }
  }

  return (
    <Section
      id="contact"
      paddingBlockMax="124px"
      background="var(--surface, #fff)"
      containerStyle={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: 'clamp(40px, 6vw, 80px)',
        alignItems: 'start',
      }}
    >
      <div>
        <SectionHeader
          eyebrow={t('nav.contact')}
          title={t('contactTitle')}
          titleMaxWidth="14ch"
        />

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

        {/* Both links use `padding: '12px 6px'` with a matching negative
            `marginInline`. Vertical padding on an inline element grows the hit
            box without moving the text around it (20px glyph box → 44px); the
            horizontal pair does the same sideways, which the short Arabic
            WhatsApp label needs to clear 44px wide. The negative margin cancels
            the horizontal shift, so the rendered sentence is unchanged. The
            paragraph gap below is 20px, which is exactly the two 12px paddings
            plus the line leading — the hit areas meet without overlapping. */}
        <ScrollReveal delay={0.2}>
          <p style={{ margin: '26px 0 0', fontSize: 16, color: 'var(--muted, #6c665e)' }}>
            {t('emailDirect')}{' '}
            <a
              href={`mailto:${t('email')}`}
              className="focus-ring"
              style={{ color: 'var(--accent, #0E7A69)', fontWeight: 600, textDecoration: 'none', padding: '12px 6px', marginInline: -6 }}
            >
              {t('email')}
            </a>
          </p>
        </ScrollReveal>

        <ScrollReveal delay={0.25}>
          <p style={{ margin: '20px 0 0', fontSize: 16, color: 'var(--muted, #6c665e)' }}>
            {t('whatsappDirect')}{' '}
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => track('whatsapp_click')}
              className="focus-ring"
              style={{ color: 'var(--accent, #0E7A69)', fontWeight: 600, textDecoration: 'none', padding: '12px 6px', marginInline: -6 }}
            >
              {t('whatsappLink')}
            </a>
          </p>
        </ScrollReveal>
      </div>

      <ScrollReveal delay={0.2}>
        <ContactForm status={status} onSubmit={onSubmit} />
      </ScrollReveal>
    </Section>
  );
}

