import ScrollReveal from '../ScrollReveal';

// Eyebrow + heading pair shared by several sections. Returns a fragment (not
// a wrapper element) so the call site's own layout stays unchanged. The body
// paragraph after it stays at the call site — styling varies too much per
// section to share.

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

// Hero has its own pulsing version and doesn't use this component.
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
  titleMaxWidth, // e.g. '18ch'; null lets the heading run to container width
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
