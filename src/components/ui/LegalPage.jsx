import ScrollReveal from '../ScrollReveal';

// Shared shell for /terms and /privacy. Writes its own <section> rather than
// using ui/Section, for the same reason NotFound and WorkList do: Section
// always draws a top border, and these pages are the first thing under the
// sticky header, where that border would sit directly against the header's
// own borderBottom and read as one 2px rule. There is an <h1> here rather
// than SectionHeader's <h2>, because each of these pages is one flat
// article, not a section inside a longer page.
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

        {/* Same bordered, var(--surface) treatment Project.jsx uses for
            caseStudy.soon — a case study with no written body yet. This page
            has the same kind of gap: the text below exists, but has not been
            reviewed by a lawyer, and a visitor deciding whether to trust it
            needs to see that before the sections below, not after. */}
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

// One {heading, body} row. Same fixed-label-column + flowing-body-column
// shape as Project.jsx's Block, reused here because legal.terms.sections and
// legal.privacy.sections are shaped exactly like a case study's overview /
// challenge / solution blocks — flexWrap alone stacks the columns on a
// narrow phone, the same way Block does, with no separate breakpoint needed.
// `first` skips the top divider so the rule does not double up against the
// notice callout's own border just above it.
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
