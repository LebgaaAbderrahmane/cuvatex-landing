import ScrollReveal from '../ScrollReveal';

// Shared shell for /terms and /privacy. Own <section>, not ui/Section — same
// reason as NotFound/WorkList: Section's top border would double against the
// sticky header's.
export default function LegalPage({ eyebrow, title, updated, notice, sections }) {
  const list = Array.isArray(sections) ? sections : [];

  return (
    <section style={{ padding: 'clamp(40px, 7vw, 88px) clamp(20px, 5vw, 48px) clamp(64px, 10vw, 120px)' }}>
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
            {eyebrow}
          </p>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <h1 style={{
            fontSize: 'clamp(34px, 7vw, 62px)',
            fontWeight: 600,
            letterSpacing: '-0.03em',
            lineHeight: 1.03,
            margin: '16px 0 0',
            maxWidth: '20ch',
          }}>
            {title}
          </h1>
        </ScrollReveal>

        <ScrollReveal delay={0.16}>
          <p style={{
            margin: 'clamp(14px, 2vw, 18px) 0 0',
            fontSize: 14,
            color: 'var(--muted, #6c665e)',
          }}>
            {updated}
          </p>
        </ScrollReveal>

        {/* Same treatment as Project.jsx's caseStudy.soon callout. */}
        <ScrollReveal delay={0.22}>
          <p style={{
            margin: 'clamp(24px, 3.5vw, 36px) 0 0',
            maxWidth: 720,
            padding: 'clamp(20px, 3vw, 28px)',
            border: '1px solid var(--line, rgba(21,18,15,0.13))',
            borderRadius: 3,
            background: 'var(--surface, #fff)',
            color: 'var(--muted, #6c665e)',
            fontSize: 16,
            lineHeight: 1.6,
          }}>
            {notice}
          </p>
        </ScrollReveal>

        <div style={{ marginTop: 'clamp(40px, 6vw, 68px)' }}>
          {list.map((s, i) => (
            <LegalSection key={s.heading || i} heading={s.heading} body={s.body} first={i === 0} />
          ))}
        </div>
      </div>
    </section>
  );
}

// One {heading, body} row — same layout as Project.jsx's Block.
// `first` skips the top divider so it doesn't double against the notice callout above it.
function LegalSection({ heading, body, first }) {
  return (
    <ScrollReveal>
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: 'clamp(16px, 3vw, 48px)',
        marginTop: first ? 0 : 'clamp(28px, 4vw, 40px)',
        paddingTop: first ? 0 : 'clamp(28px, 4vw, 40px)',
        borderTop: first ? 'none' : '1px solid var(--line, rgba(21,18,15,0.13))',
      }}>
        <h2 style={{
          flex: '0 0 200px',
          margin: 0,
          fontSize: 13,
          letterSpacing: '0.16em',
          textTransform: 'uppercase',
          color: 'var(--muted, #6c665e)',
          fontWeight: 600,
        }}>
          {heading}
        </h2>
        <p style={{
          flex: '1 1 420px',
          minWidth: 0,
          margin: 0,
          maxWidth: 640,
          fontSize: 'clamp(15px, 1.8vw, 17px)',
          lineHeight: 1.7,
        }}>
          {body}
        </p>
      </div>
    </ScrollReveal>
  );
}
