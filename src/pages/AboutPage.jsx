import { useTranslation } from 'react-i18next';
import { motion, useReducedMotion } from 'framer-motion';
import ScrollReveal from '../components/ScrollReveal';
import CtaBanner from '../components/CtaBanner';
import { EASE } from '../lib/motion';

// Writes its own shell instead of ui/Section, for the same reason WorkList and
// NotFound do: Section always draws a top border, and this page is the first
// thing under the sticky header, where that border would sit directly against
// the header's own and read as one 2px rule. An <h1> replaces SectionHeader's
// <h2> for the same reason — on this page the story *is* the page.
//
// The opening block used to be two paragraphs and a small boxed photo, all
// the same visual weight, one under the other — read as a stub, not a page
// anyone designed on purpose. No new copy here: `aboutBody` is short and
// direct ("you work directly with us"), so it becomes the page's opening
// statement instead of sitting at the same size as everything else.
// `aboutExtra` (the longer "how we work" paragraph) stays normal body text
// below it, unchanged.
export default function AboutPage() {
  const { t } = useTranslation();
  const reduce = useReducedMotion();

  return (
    <>
    <section
      style={{ padding: 'clamp(40px, 7vw, 88px) clamp(20px, 5vw, 48px) clamp(64px, 10vw, 120px)' }}
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
            <span style={{
              width: 7,
              height: 7,
              background: 'var(--accent, #0E7A69)',
              display: 'inline-block',
            }} />
            {t('aboutEyebrow')}
          </p>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <h1 style={{
            fontSize: 'clamp(34px, 7vw, 62px)',
            fontWeight: 600,
            letterSpacing: '-0.03em',
            lineHeight: 1.03,
            margin: '16px 0 0',
            maxWidth: '16ch',
          }}>
            {t('aboutTitle')}
          </h1>
        </ScrollReveal>

        {/* The opening moment: statement and photo side by side, not stacked.
            Both settle in together rather than fading up one after another —
            this is the page's one deliberate beat, not five scattered ones. */}
        <div style={{
          marginTop: 'clamp(32px, 5vw, 56px)',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: 'clamp(40px, 6vw, 72px)',
          // 'start', not 'center': the photo (a 4:5 crop) and the pull-quote
          // (five short lines) are never close to the same height, and at a
          // wide viewport the photo's column grows tall fast — centering the
          // two against each other opened a large dead gap above the text
          // that got worse the wider the screen, not better.
          alignItems: 'start',
        }}>
          <div style={{ display: 'flex', gap: 20, alignItems: 'stretch' }}>
            {/* Grows in like the Services dividers draw in — same motion
                vocabulary as the rest of the site, not a new trick per page. */}
            <motion.span
              aria-hidden="true"
              initial={{ scaleY: reduce ? 1 : 0 }}
              whileInView={{ scaleY: 1 }}
              viewport={{ once: true, margin: '-10% 0px' }}
              transition={{ duration: reduce ? 0 : 0.6, ease: EASE }}
              style={{
                width: 3,
                flex: 'none',
                background: 'var(--accent, #0E7A69)',
                transformOrigin: 'top',
              }}
            />
            <motion.p
              initial={{ opacity: 0, y: reduce ? 0 : 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-10% 0px' }}
              transition={{ duration: reduce ? 0 : 0.6, ease: EASE, delay: reduce ? 0 : 0.1 }}
              style={{
                margin: 0,
                fontSize: 'clamp(24px, 3vw, 34px)',
                fontWeight: 600,
                lineHeight: 1.35,
                letterSpacing: '-0.01em',
                color: 'var(--fg, #15120f)',
                maxWidth: '30ch',
              }}
            >
              {t('aboutBody')}
            </motion.p>
          </div>

          {/* Taller crop than the old 4:3 box, and no maxWidth cap — it fills
              its column instead of sitting small and boxed-in. Same
              scale-settle entrance as every ServiceCard photo, for the same
              reason: one motion language across the site, not a different
              one per page. Hover scale kept from the previous version. */}
          <motion.div
            initial={{ opacity: 0, scale: reduce ? 1 : 1.06 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: '-10% 0px' }}
            transition={{ duration: reduce ? 0 : 0.7, ease: EASE }}
            whileHover={{ scale: 1.02 }}
            style={{
              // Capped so a wide monitor doesn't blow this column up past a
              // sensible size — it grows with the column up to this point,
              // then stops. 4:3, not the taller 4:5 this started as: at 4:5
              // the photo's own height pushed its bottom half below the
              // fold, so opening the page meant scrolling just to finish
              // looking at a picture before reaching any more text. 4:3
              // matches what Services/Work already use elsewhere, and keeps
              // the whole opening block short enough to take in at once.
              maxWidth: 520,
              aspectRatio: '4/3',
              border: '1px solid var(--line, rgba(21,18,15,0.13))',
              borderRadius: 3,
              overflow: 'hidden',
            }}
          >
            <img
              src="/whoWeAre.jpg"
              alt="CUVATEX team workspace"
              loading="lazy"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </motion.div>
        </div>

        <ScrollReveal delay={0.1}>
          <p style={{
            margin: 'clamp(40px, 6vw, 56px) 0 0',
            maxWidth: '58ch',
            color: 'var(--muted, #6c665e)',
            fontSize: 'clamp(16px, 1.8vw, 19px)',
            lineHeight: 1.7,
          }}>
            {t('aboutExtra')}
          </p>
        </ScrollReveal>

        {/* aboutPageNote is a deliberately honest placeholder, not a claim —
            a divider and a smaller size keep it reading as secondary, not as
            a headline promise. */}
        <ScrollReveal delay={0.16}>
          <p style={{
            marginTop: 'clamp(32px, 5vw, 48px)',
            paddingTop: 'clamp(20px, 3vw, 28px)',
            borderTop: '1px solid var(--line, rgba(21,18,15,0.13))',
            maxWidth: '52ch',
            color: 'var(--muted, #6c665e)',
            fontSize: 13,
            lineHeight: 1.6,
          }}>
            {t('aboutPageNote')}
          </p>
        </ScrollReveal>
      </div>
    </section>

    {/* A visitor who came to read about the team is already interested — the
        page should not end without a way to reach out. */}
    <CtaBanner />
    </>
  );
}
