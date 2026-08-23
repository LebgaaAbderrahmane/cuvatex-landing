import { Fragment } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';
import ScrollReveal from './ScrollReveal';
import Section from './ui/Section';
import SectionHeader from './ui/SectionHeader';
import useMediaQuery from '../hooks/useMediaQuery';

const MOBILE_QUERY = '(max-width: 767px)'; // must match Header's breakpoint exactly

export default function Pricing() {
  const { t } = useTranslation();
  const isMobile = useMediaQuery(MOBILE_QUERY);
  const steps = t('pricingPayment', { returnObjects: true });
  const payment = Array.isArray(steps) ? steps : [];

  return (
    <Section
      id="pricing"
      paddingBlockMax="120px"
      background={null}
      // Same two-column shape About.jsx already uses: text left, something
      // real on the right — not a stacked single column with the card
      // stranded in it. minmax's floor is 460, not About's 300: this side
      // isn't a photo, it's a card with its own internal 2-up step layout,
      // and a narrower column would squeeze that layout before this one
      // even collapses to one column. auto-fit means it drops to one column
      // on its own well before mobile — no separate mobile handling needed
      // here the way the payment-step layout inside the card still needs it.
      // min(460px, 100%), not a bare 460px — same fix as ContactPage.jsx's
      // grid: a bare floor still forces that width as the single-column
      // track too, and 460 is wider than a phone viewport.
      containerStyle={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(min(460px, 100%), 1fr))',
        gap: 'clamp(40px, 6vw, 80px)',
        alignItems: 'start',
      }}
    >
      <div>
        <SectionHeader
          eyebrow={t('pricingEyebrow')}
          title={t('pricingTitle')}
          titleMaxWidth="16ch"
        />

        <ScrollReveal delay={0.15}>
          <p style={{
            margin: '24px 0 0',
            color: 'var(--fg, #15120f)',
            fontSize: 'clamp(16px, 1.8vw, 20px)',
            lineHeight: 1.6,
            maxWidth: '58ch',
          }}>
            {t('pricingBody')}
          </p>
        </ScrollReveal>
      </div>

      {payment.length > 0 && (
        <ScrollReveal delay={0.22}>
          <div style={{
            background: 'var(--surface, #fff)',
            border: '1px solid var(--line, rgba(21,18,15,0.13))',
            borderRadius: 3,
            padding: 'clamp(24px, 3vw, 32px)',
          }}>
            <p style={{
              margin: 0,
              fontSize: 13,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              fontWeight: 600,
              color: 'var(--muted, #6c665e)',
            }}>
              {t('pricingPaymentTitle')}
            </p>

            {/* Circles at flex:none, connecting line at flex:1 between them —
                same technique both ways, just stacked on mobile and in a row
                on desktop. Each circle stays paired with its own text in one
                flex:none block (not stretched to fill half the row), so the
                text sits directly under its own circle instead of under
                wherever a 50/50 split happens to land. A prior desktop
                attempt split circles and text into two separate rows with
                different width math, which put step 2's text left of its
                own circle. The line fades toward its middle rather than
                running solid, to read as a connector, not a divider. */}
            {isMobile ? (
              <div style={{ marginTop: 18 }}>
                {payment.map((step, i) => (
                  <div key={i} style={{ display: 'flex', gap: 14 }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 'none' }}>
                      <StepMarker n={i + 1} />
                      {i < payment.length - 1 && (
                        <div style={{
                          width: 2,
                          flex: 1,
                          minHeight: 24,
                          margin: '4px 0',
                          background: 'linear-gradient(to bottom, var(--accent, #0E7A69), color-mix(in srgb, var(--accent, #0E7A69) 35%, transparent) 50%, var(--accent, #0E7A69))',
                        }} />
                      )}
                    </div>
                    <div style={{ paddingBottom: i < payment.length - 1 ? 16 : 0 }}>
                      <StepAmount amount={step.amount} when={step.when} />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ marginTop: 18, display: 'flex', alignItems: 'flex-start' }}>
                {payment.map((step, i) => {
                  // The label under each circle is wider than the circle
                  // itself, so a plain left-aligned block leaves the circle
                  // sitting well short of the block's own edge — the line
                  // was reaching that edge, not the circle, leaving a real
                  // gap on step 1's side specifically (step 2's circle
                  // already starts flush at its block's edge). Anchoring
                  // step 1 to its block's trailing edge instead — circle and
                  // text both — puts the circle exactly where the line ends.
                  const isFirst = i === 0;
                  return (
                    <Fragment key={i}>
                      <div style={{ flex: 'none', display: 'flex', flexDirection: 'column', alignItems: isFirst ? 'flex-end' : 'flex-start' }}>
                        <StepMarker n={i + 1} />
                        <div style={{ marginTop: 10, textAlign: isFirst ? 'end' : 'start' }}>
                          <StepAmount amount={step.amount} when={step.when} />
                        </div>
                      </div>
                      {i < payment.length - 1 && (
                        <div style={{ flex: 1, height: 28, display: 'flex', alignItems: 'center' }}>
                          <div style={{
                            width: '100%',
                            height: 2,
                            background: 'linear-gradient(to right, var(--accent, #0E7A69), color-mix(in srgb, var(--accent, #0E7A69) 35%, transparent) 50%, var(--accent, #0E7A69))',
                          }} />
                        </div>
                      )}
                    </Fragment>
                  );
                })}
              </div>
            )}

            <div style={{
              marginTop: 20,
              paddingTop: 20,
              borderTop: '1px solid var(--line, rgba(21,18,15,0.13))',
            }}>
              <p style={{
                margin: 0,
                fontSize: 14,
                lineHeight: 1.6,
                color: 'var(--muted, #6c665e)',
              }}>
                {t('pricingPaymentNote')}
              </p>

              <Link
                to="/terms"
                className="focus-ring"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  marginTop: 12,
                  minHeight: 44,
                  fontSize: 14,
                  fontWeight: 600,
                  color: 'var(--accent, #0E7A69)',
                  textDecoration: 'none',
                }}
              >
                {t('pricingTermsLink')}
              </Link>
            </div>
          </div>
        </ScrollReveal>
      )}
    </Section>
  );
}

function StepMarker({ n }) {
  return (
    <div style={{
      width: 28,
      height: 28,
      flex: 'none',
      borderRadius: '50%',
      background: 'var(--accent, #0E7A69)',
      color: 'var(--accent-fg, #fff)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: 13,
      fontWeight: 700,
    }}>
      {n}
    </div>
  );
}

function StepAmount({ amount, when }) {
  return (
    <>
      {/* ltr + isolate — otherwise RTL bidi flips "50%" to "%50", same fix as Clients' stats. */}
      <span style={{
        display: 'block',
        fontSize: 'clamp(26px, 5vw, 30px)',
        fontWeight: 700,
        letterSpacing: '-0.02em',
        lineHeight: 1,
        color: 'var(--fg, #15120f)',
        direction: 'ltr',
        unicodeBidi: 'isolate',
      }}>
        {amount}
      </span>
      <span style={{ display: 'block', marginTop: 6, fontSize: 14, color: 'var(--muted, #6c665e)' }}>
        {when}
      </span>
    </>
  );
}
