import { useState, useId } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import ScrollReveal from './ScrollReveal';

function FaqItem({ q, a, isOpen, onToggle }) {
  const baseId = useId();
  const btnId = `${baseId}-btn`;
  const panelId = `${baseId}-panel`;

  return (
    <div style={{ borderTop: '1px solid var(--line, rgba(21,18,15,0.13))' }}>
      <h3 style={{ margin: 0 }}>
        <button
          id={btnId}
          type="button"
          onClick={onToggle}
          aria-expanded={isOpen}
          aria-controls={panelId}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 20,
            padding: 'clamp(20px, 3vw, 28px) 0',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            textAlign: 'start',
            fontFamily: 'inherit',
            color: isOpen ? 'var(--accent, #0E7A69)' : 'var(--fg, #15120f)',
            transition: 'color 0.2s',
          }}
        >
          <span style={{
            fontSize: 'clamp(18px, 2.3vw, 23px)',
            fontWeight: 600,
            letterSpacing: '-0.01em',
            lineHeight: 1.3,
          }}>
            {q}
          </span>
          <motion.span
            aria-hidden="true"
            animate={{ rotate: isOpen ? 45 : 0 }}
            transition={{ duration: 0.25, ease: [0.2, 0.6, 0.2, 1] }}
            style={{
              flex: 'none',
              width: 22,
              height: 22,
              position: 'relative',
              color: 'var(--accent, #0E7A69)',
            }}
          >
            <span style={{
              position: 'absolute',
              top: '50%',
              insetInlineStart: 0,
              width: '100%',
              height: 2,
              marginTop: -1,
              background: 'currentColor',
            }} />
            <span style={{
              position: 'absolute',
              insetInlineStart: '50%',
              top: 0,
              height: '100%',
              width: 2,
              marginInlineStart: -1,
              background: 'currentColor',
            }} />
          </motion.span>
        </button>
      </h3>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            id={panelId}
            role="region"
            aria-labelledby={btnId}
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.2, 0.6, 0.2, 1] }}
            style={{ overflow: 'hidden' }}
          >
            <p style={{
              margin: 0,
              paddingBottom: 'clamp(20px, 3vw, 28px)',
              paddingInlineEnd: 42,
              color: 'var(--muted, #6c665e)',
              fontSize: 16,
              lineHeight: 1.6,
              maxWidth: '60ch',
            }}>
              {a}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function Faq() {
  const { t } = useTranslation();
  const items = t('faq', { returnObjects: true });
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <section
      id="faq"
      style={{
        scrollMarginTop: 80,
        padding: 'clamp(64px, 10vw, 120px) clamp(20px, 5vw, 48px)',
        borderTop: '1px solid var(--line, rgba(21,18,15,0.13))',
      }}
    >
      <div style={{ maxWidth: 1160, margin: '0 auto' }}>
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
            {t('nav.faq')}
          </p>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <h2 style={{
            fontSize: 'clamp(30px, 5vw, 52px)',
            fontWeight: 600,
            letterSpacing: '-0.02em',
            lineHeight: 1.05,
            margin: '16px 0 0',
            maxWidth: '18ch',
          }}>
            {t('faqTitle')}
          </h2>
        </ScrollReveal>

        <ScrollReveal delay={0.15}>
          <div style={{ marginTop: 'clamp(36px, 5vw, 60px)' }}>
            {Array.isArray(items) && items.map((item, i) => (
              <FaqItem
                key={i}
                q={item.q}
                a={item.a}
                isOpen={openIndex === i}
                onToggle={() => setOpenIndex(openIndex === i ? null : i)}
              />
            ))}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
