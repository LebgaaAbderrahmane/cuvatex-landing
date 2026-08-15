import ScrollReveal from '../ScrollReveal';

// The eyebrow-and-heading pair that opens seven sections: a small uppercase
// label preceded by an accent square, then the section title, each revealing on
// its own delay.
//
// Returns a fragment rather than a wrapper element, so the call site's own
// layout (About and Contact put this in a grid column, Work in a flex row) is
// unchanged.
//
// The body copy that follows deliberately stays at the call site. It looks
// shared but is not: the colour is `--fg` in About and Pricing and `--muted` in
// Team and Contact, the top margin runs 18 / 22 / 24px, the size caps at 19 or
// 20px, and the measure at 44 / 48 / 58ch. About has two of them, Faq and
// Testimonials have none. Pulling that in would need six props to express four
// paragraphs — the duplication is cheaper than the abstraction.

const eyebrowStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: 10,
  margin: 0,
  fontSize: 13,
  letterSpacing: '0.16em',
  textTransform: 'uppercase',
  color: 'var(--muted, #6c665e)',
  fontWeight: 600,
};

const dotStyle = {
  width: 7,
  height: 7,
  background: 'var(--accent, #0E7A69)',
  display: 'inline-block',
};

// Hero's version of this pulses its opacity, so Hero keeps its own `motion.span`
// and does not use this component.
const titleStyle = {
  fontSize: 'clamp(30px, 5vw, 52px)',
  fontWeight: 600,
  letterSpacing: '-0.02em',
  lineHeight: 1.05,
  margin: '16px 0 0',
};

export default function SectionHeader({
  eyebrow,
  title,
  // The measure the heading wraps at, e.g. '18ch'. Explicitly `null` on Team
  // and Work, which let the heading run to the container width.
  titleMaxWidth,
}) {
  return (
    <>
      <ScrollReveal>
        <p style={eyebrowStyle}>
          <span style={dotStyle} />
          {eyebrow}
        </p>
      </ScrollReveal>

      <ScrollReveal delay={0.1}>
        <h2 style={titleMaxWidth ? { ...titleStyle, maxWidth: titleMaxWidth } : titleStyle}>
          {title}
        </h2>
      </ScrollReveal>
    </>
  );
}
