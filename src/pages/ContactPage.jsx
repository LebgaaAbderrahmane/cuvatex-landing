import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import ScrollReveal from '../components/ScrollReveal';
import ContactForm from '../components/ContactForm';
import { track } from '../analytics';
import { WHATSAPP_URL } from '../lib/contact';

const WEB3FORMS_KEY = import.meta.env.VITE_WEB3FORMS_KEY;

// Writes its own shell instead of using ui/Section, for the same reason
// WorkList and NotFound do: Section always draws a top border, and this page
// is the first thing under the sticky header — its own border would sit
// directly against the header's own and read as one 2px rule. There is an
// <h1> here rather than SectionHeader's <h2>, because on this page the form
// *is* the page.
export default function ContactPage() {
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
    // No `background` override here (the old homepage section had one, to
    // separate it from the section above it): this page has no section above
    // it, so there is nothing to separate from.
    <section
      id="contact"
      style={{ padding: 'clamp(40px, 7vw, 88px) clamp(20px, 5vw, 48px) clamp(64px, 10vw, 120px)' }}
    >
      <div style={{
        maxWidth: 1160,
        margin: '0 auto',
        display: 'grid',
        // `min(300px, 100%)` rather than a bare 300px: at a 320px viewport this
        // container is narrower than 300px after the padding above, and a bare
        // 300px minimum would force the page to scroll sideways instead of
        // collapsing cleanly to one column.
        gridTemplateColumns: 'repeat(auto-fit, minmax(min(300px, 100%), 1fr))',
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
              <span style={{
                width: 7,
                height: 7,
                background: 'var(--accent, #0E7A69)',
                display: 'inline-block',
              }} />
              {t('nav.contact')}
            </p>
          </ScrollReveal>

          <ScrollReveal delay={0.1}>
            <h1 style={{
              fontSize: 'clamp(34px, 7vw, 62px)',
              fontWeight: 600,
              letterSpacing: '-0.03em',
              lineHeight: 1.03,
              margin: '16px 0 0',
              maxWidth: '14ch',
            }}>
              {t('contactTitle')}
            </h1>
          </ScrollReveal>

          <ScrollReveal delay={0.18}>
            <p style={{
              margin: 'clamp(18px, 2.5vw, 24px) 0 0',
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
          <ScrollReveal delay={0.24}>
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

          <ScrollReveal delay={0.28}>
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
      </div>
    </section>
  );
}
