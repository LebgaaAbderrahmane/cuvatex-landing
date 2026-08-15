import { useRef, useEffect, useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams, Link } from 'react-router';
import {
  motion,
  useScroll,
  useTransform,
  useInView,
  useReducedMotion,
  animate,
} from 'framer-motion';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import ScrollReveal from '../components/ScrollReveal';
import NotFound from './NotFound';
import { findProject, nextProject, heroImage, shotImage } from '../data/projects';
import { EASE } from '../lib/motion';
import useMediaQuery from '../hooks/useMediaQuery';

// Below this the sub-bar keeps only the back link. Two competing labels in a
// 375px-wide bar leaves neither of them readable.
const NARROW = '(max-width: 560px)';

// Module scope: `motion.create` inside the component hands React a new component
// type on every render, which remounts the link.
const MotionLink = motion.create(Link);

// Was an overlay (role="dialog", scroll lock, focus trap, shared-element hero).
// It is a page now, so all of that is gone: the browser's own back button and
// ScrollManager do the jobs the modal had to do by hand.
export default function Project() {
  const { slug } = useParams();
  const project = findProject(slug);

  if (!project) return <NotFound />;

  // Keyed so moving to the next project remounts the body. Without it React
  // reuses this instance across the param change and the metric counters keep
  // the previous project's finished state instead of counting up again.
  return <ProjectBody key={slug} slug={slug} project={project} />;
}

function ProjectBody({ slug, project }) {
  const { t, i18n } = useTranslation();
  const reduce = useReducedMotion();
  const rtl = i18n.dir() === 'rtl';
  const narrow = useMediaQuery(NARROW);

  const next = nextProject(slug);
  const raw = t(`projects.${slug}`, { returnObjects: true });
  const d = raw && typeof raw === 'object' ? raw : {};
  const results = Array.isArray(d.results) ? d.results : [];
  const metrics = Array.isArray(d.metrics) ? d.metrics : [];
  const hasBody = Boolean(d.overview || d.challenge || d.solution);
  const shots = project.shots;

  const fade = { duration: reduce ? 0 : 0.35, ease: EASE };
  const pad = 'clamp(20px, 5vw, 64px)';

  return (
    <motion.article initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={fade}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        {/* Deliberately NOT sticky. It was, together with the already-sticky
            header — two frozen bars cost ~140px of a ~840px phone screen, one
            pixel in six, for the whole length of a long read. On a phone people
            leave a page by swiping back, not by hunting a control, so that was a
            bad trade. The exit is repeated at the foot of the article instead,
            which is where a reader who finished actually is. */}
        <div style={{ padding: `clamp(14px, 2vw, 22px) ${pad} 0` }}>
          <BackLink t={t} rtl={rtl} reduce={reduce} />
        </div>

        <div style={{ padding: `clamp(24px, 4vw, 48px) ${pad} 0` }}>
          <div style={{
            position: 'relative',
            // Shorter on a phone. At 62vh the hero plus the header fill the whole
            // screen, so the summary — the line that says what the project
            // actually was — starts below the fold.
            height: narrow ? 'min(46vh, 380px)' : 'min(62vh, 560px)',
            borderRadius: 4,
            overflow: 'hidden',
            border: '1px solid var(--line, rgba(21,18,15,0.13))',
            background: 'var(--surface, #fff)',
          }}>
            <motion.img
              src={heroImage(slug)}
              alt={`${d.title} — ${t('imgLabel')}`}
              initial={{ scale: reduce ? 1 : 1.06 }}
              animate={{ scale: 1 }}
              transition={{ duration: reduce ? 0 : 0.9, ease: EASE }}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
            {/* Two stacked passes of the same token rather than one. A single
                --scrim tops out at 0.55, which is not enough to hold white text
                over a pale sky — several of the project images are exactly that.
                The short second pass darkens only the strip the title sits in and
                leaves the rest of the photo alone. Still the token, so both themes
                follow it. */}
            <div style={{
              position: 'absolute',
              inset: 0,
              background: [
                'linear-gradient(to top, var(--scrim, rgba(21,18,15,0.55)), transparent 65%)',
                'linear-gradient(to top, var(--scrim, rgba(21,18,15,0.55)), transparent 28%)',
              ].join(', '),
              pointerEvents: 'none',
            }} />
            <motion.div
              initial={{ opacity: 0, y: reduce ? 0 : 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: reduce ? 0 : 0.5, delay: reduce ? 0 : 0.2, ease: EASE }}
              style={{
                position: 'absolute',
                insetInline: 0,
                insetBlockEnd: 0,
                padding: 'clamp(18px, 3vw, 34px)',
              }}
            >
              <span style={{
                display: 'inline-block',
                fontSize: 11,
                fontWeight: 600,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: 'var(--accent-fg, #fff)',
                background: 'var(--accent, #0E7A69)',
                padding: '5px 12px',
                borderRadius: 999,
              }}>
                {t(`tags.${project.tagKey}`)}
              </span>
              <h1 style={{
                margin: '14px 0 0',
                fontSize: 'clamp(30px, 6vw, 62px)',
                fontWeight: 600,
                letterSpacing: '-0.03em',
                lineHeight: 1.02,
                // Sits on a photo behind a dark scrim, not on a themed surface,
                // so it stays white in both themes rather than following --fg.
                color: '#fff',
              }}>
                {d.title}
              </h1>
            </motion.div>
          </div>
        </div>

        <div style={{ padding: `clamp(28px, 4vw, 44px) ${pad} 0` }}>
          <ScrollReveal>
            <p style={{
              margin: 0,
              maxWidth: 720,
              fontSize: 'clamp(17px, 2.2vw, 22px)',
              lineHeight: 1.5,
              color: 'var(--fg, #15120f)',
            }}>
              {d.summary}
            </p>
          </ScrollReveal>

          <ScrollReveal delay={0.08}>
            <dl style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 'clamp(24px, 5vw, 64px)',
              margin: 'clamp(24px, 3vw, 34px) 0 0',
              paddingTop: 'clamp(20px, 3vw, 28px)',
              borderTop: '1px solid var(--line, rgba(21,18,15,0.13))',
            }}>
              <Meta label={t('caseStudy.year')} value={d.year} />
              <Meta label={t('caseStudy.role')} value={d.role} />
              <Meta label={t('caseStudy.duration')} value={d.duration} />
            </dl>
          </ScrollReveal>
        </div>

        {/* Every block below renders only when its data exists. Five of eight
            projects are still one-liners, and a page of empty headings reads
            worse than a short page. */}
        {metrics.length > 0 && (
          <div style={{ padding: `clamp(36px, 5vw, 60px) ${pad} 0` }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))',
              gap: 'clamp(16px, 2vw, 24px)',
            }}>
              {metrics.map((m, i) => (
                <Metric key={`${m.label}-${i}`} value={m.value} label={m.label} reduce={reduce} />
              ))}
            </div>
          </div>
        )}

        {hasBody ? (
          <div style={{ padding: `clamp(40px, 6vw, 88px) ${pad} 0` }}>
            <Block title={t('caseStudy.overview')} body={d.overview} />
            <Block title={t('caseStudy.challenge')} body={d.challenge} />
            <Block title={t('caseStudy.solution')} body={d.solution} />

            {results.length > 0 && (
              <Block title={t('caseStudy.results')}>
                <ul style={{ listStyle: 'none', display: 'grid', gap: 14 }}>
                  {results.map((r, i) => (
                    <li key={i} style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                      <span style={{
                        width: 6,
                        height: 6,
                        marginTop: 9,
                        borderRadius: 999,
                        background: 'var(--accent, #0E7A69)',
                        flex: 'none',
                      }} />
                      <span style={{ fontSize: 'clamp(15px, 1.8vw, 17px)', lineHeight: 1.65 }}>{r}</span>
                    </li>
                  ))}
                </ul>
              </Block>
            )}
          </div>
        ) : (
          <div style={{ padding: `clamp(40px, 6vw, 72px) ${pad} 0` }}>
            <ScrollReveal>
              <p style={{
                margin: 0,
                maxWidth: 620,
                padding: 'clamp(20px, 3vw, 28px)',
                border: '1px solid var(--line, rgba(21,18,15,0.13))',
                borderRadius: 3,
                background: 'var(--surface, #fff)',
                color: 'var(--muted, #6c665e)',
                fontSize: 16,
                lineHeight: 1.6,
              }}>
                {t('caseStudy.soon')}
              </p>
            </ScrollReveal>
          </div>
        )}

        {shots > 0 && (
          <div style={{ padding: `clamp(40px, 6vw, 88px) ${pad} 0` }}>
            <ScrollReveal>
              <p style={{
                margin: '0 0 clamp(18px, 2vw, 26px)',
                fontSize: 13,
                letterSpacing: '0.16em',
                textTransform: 'uppercase',
                color: 'var(--muted, #6c665e)',
                fontWeight: 600,
              }}>
                {t('caseStudy.gallery')}
              </p>
            </ScrollReveal>
            <div style={{ display: 'grid', gap: 'clamp(16px, 2vw, 24px)' }}>
              {Array.from({ length: shots }, (_, i) => (
                <Shot
                  key={i}
                  src={shotImage(slug, i + 1)}
                  alt={`${d.title} — ${t('imgLabel')}`}
                  reduce={reduce}
                />
              ))}
            </div>
          </div>
        )}

        <div style={{ padding: `clamp(48px, 7vw, 96px) ${pad} clamp(48px, 7vw, 96px)` }}>
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 24,
            paddingTop: 'clamp(28px, 4vw, 40px)',
            borderTop: '1px solid var(--line, rgba(21,18,15,0.13))',
          }}>
            {/* Was a close() plus a 400ms setTimeout waiting for the overlay to
                unmount before scrolling. ScrollManager handles the hash now, and
                it respects prefers-reduced-motion — AUDIT.md item 41. */}
            <Link
              to="/#contact"
              className="focus-ring"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                background: 'var(--accent, #0E7A69)',
                border: '1px solid var(--accent, #0E7A69)',
                color: 'var(--accent-fg, #fff)',
                textDecoration: 'none',
                fontWeight: 600,
                fontSize: 14,
                letterSpacing: '0.04em',
                padding: '14px 26px',
                borderRadius: 2,
              }}
            >
              {t('caseStudy.cta')}
            </Link>

            {next && (
              <Link
                to={`/work/${next.slug}`}
                className="focus-ring"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  textDecoration: 'none',
                  color: 'inherit',
                  textAlign: rtl ? 'right' : 'left',
                }}
              >
                <span>
                  <span style={{
                    display: 'block',
                    fontSize: 12,
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    color: 'var(--muted, #6c665e)',
                    fontWeight: 600,
                  }}>
                    {t('caseStudy.next')}
                  </span>
                  <span style={{ display: 'block', marginTop: 6, fontSize: 20, fontWeight: 600, letterSpacing: '-0.01em' }}>
                    {t(`projects.${next.slug}.title`)}
                  </span>
                </span>
                <span style={{
                  width: 44,
                  height: 44,
                  flex: 'none',
                  borderRadius: 999,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: 'var(--accent, #0E7A69)',
                  color: 'var(--accent-fg, #fff)',
                }}>
                  <ArrowRight size={18} style={{ transform: rtl ? 'scaleX(-1)' : 'none' }} />
                </span>
              </Link>
            )}
          </div>

          {/* The second exit, and the one that matters: a reader who reached here
              has finished. The first copy is at the top, where they have not.

              `quiet` because of what it sits next to. This corner already has a
              filled CTA and an accent disc for the next case study; a third
              accent shape gave all three the same weight and the eye had nowhere
              to land first. Order of loudness here is deliberate: start a project,
              then read the next one, then leave. */}
          <div style={{
            marginTop: 'clamp(28px, 4vw, 40px)',
            paddingTop: 'clamp(24px, 3vw, 32px)',
            borderTop: '1px solid var(--line, rgba(21,18,15,0.13))',
          }}>
            <BackLink t={t} rtl={rtl} reduce={reduce} quiet />
          </div>
        </div>
      </div>
    </motion.article>
  );
}

/**
 * "All projects", at the head and the foot of every case study.
 *
 * Two weights, because the two positions are not the same job.
 *
 * Default (top of the page): an accent disc, which deliberately rhymes with the
 * "next case study" disc — the article opens with ← and closes with →. Nothing
 * competes with it up there.
 *
 * `quiet` (foot of the page): no disc, muted text. Down there it shares a corner
 * with a filled CTA and the next-case-study disc, and a third accent shape flattened
 * the hierarchy — three controls shouting equally, so the eye picked none.
 *
 * Either way the arrow slides toward the start of the line on hover and focus, so
 * in Arabic it slides right. On touch, where neither event fires, the resting
 * shape has to carry it alone.
 */
function BackLink({ t, rtl, reduce, quiet = false }) {
  const nudge = {
    rest: { x: 0 },
    hover: { x: reduce ? 0 : (rtl ? 3 : -3) },
  };
  const move = { duration: reduce ? 0 : 0.25, ease: EASE };
  const restColor = quiet ? 'var(--muted, #6c665e)' : 'var(--fg, #15120f)';

  return (
    // The colour lives on the link, not on the label: the arrow is the label's
    // sibling, so it would not inherit it, and `a { color: var(--accent) }` in
    // index.css would then paint the "quiet" arrow full accent green.
    <MotionLink
      to="/work"
      className="focus-ring"
      initial="rest"
      animate="rest"
      whileHover="hover"
      whileFocus="hover"
      whileTap={{ scale: quiet ? 1 : 0.96 }}
      variants={{
        rest: { color: restColor },
        hover: { color: 'var(--accent, #0E7A69)' },
      }}
      transition={{ duration: reduce ? 0 : 0.2, ease: EASE }}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: quiet ? 8 : 12,
        // Without the disc there is only a 14px label, so the tap target has to
        // be held open by hand.
        minHeight: 44,
        textDecoration: 'none',
        // Base value for the first frame, before the variant lands.
        color: restColor,
        whiteSpace: 'nowrap',
      }}
    >
      {quiet ? (
        <motion.span variants={nudge} transition={move} style={{ display: 'flex' }}>
          <ArrowLeft size={16} style={{ transform: rtl ? 'scaleX(-1)' : 'none' }} />
        </motion.span>
      ) : (
        <motion.span
          variants={{ rest: { scale: 1 }, hover: { scale: reduce ? 1 : 1.09 } }}
          transition={move}
          style={{
            width: 40,
            height: 40,
            flex: 'none',
            borderRadius: 999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'var(--accent, #0E7A69)',
            color: 'var(--accent-fg, #fff)',
          }}
        >
          <motion.span variants={nudge} transition={move} style={{ display: 'flex' }}>
            <ArrowLeft size={18} style={{ transform: rtl ? 'scaleX(-1)' : 'none' }} />
          </motion.span>
        </motion.span>
      )}

      {/* Inherits the link's colour — see the note above. */}
      <span style={{ fontSize: 14, fontWeight: 600, letterSpacing: '-0.01em' }}>
        {t('caseStudy.back')}
      </span>
    </MotionLink>
  );
}

function Meta({ label, value }) {
  if (!value) return null;
  return (
    <div>
      <dt style={{
        fontSize: 11,
        letterSpacing: '0.14em',
        textTransform: 'uppercase',
        color: 'var(--muted, #6c665e)',
        fontWeight: 600,
      }}>
        {label}
      </dt>
      <dd style={{ margin: '8px 0 0', fontSize: 16, fontWeight: 600 }}>{value}</dd>
    </div>
  );
}

function Block({ title, body, children }) {
  if (!body && !children) return null;
  return (
    <ScrollReveal>
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: 'clamp(16px, 3vw, 48px)',
        marginBottom: 'clamp(36px, 5vw, 64px)',
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
          {title}
        </h2>
        <div style={{ flex: '1 1 420px', minWidth: 0 }}>
          {body ? (
            <p style={{ margin: 0, fontSize: 'clamp(16px, 2vw, 19px)', lineHeight: 1.7, maxWidth: 640 }}>{body}</p>
          ) : children}
        </div>
      </div>
    </ScrollReveal>
  );
}

// Splits values like "-64%", "2,4x" or "4 yrs" into prefix / number / suffix so the
// number can count up while the surrounding characters and the locale's decimal
// separator stay intact. Returns null when there is no number to animate.
function parseMetric(value) {
  const m = String(value).match(/^(\D*)(\d+(?:[.,]\d+)?)(.*)$/);
  if (!m) return null;
  const digits = m[2];
  const separator = digits.includes(',') ? ',' : '.';
  const split = digits.split(/[.,]/);
  return {
    prefix: m[1],
    suffix: m[3],
    target: Number(digits.replace(',', '.')),
    separator,
    decimals: split.length > 1 ? split[1].length : 0,
  };
}

function Metric({ value, label, reduce }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-10% 0px' });
  // Parsed once per value — a fresh object every render would restart the animation
  // on each setN, which never settles.
  const parsed = useMemo(() => parseMetric(value), [value]);
  const [n, setN] = useState(() => (parsed && !reduce ? 0 : parsed ? parsed.target : 0));

  useEffect(() => {
    if (!parsed || reduce || !inView) return undefined;
    const controls = animate(0, parsed.target, {
      duration: 1.1,
      ease: EASE,
      onUpdate: setN,
    });
    return () => controls.stop();
  }, [inView, reduce, parsed]);

  const shown = parsed
    ? `${parsed.prefix}${n.toFixed(parsed.decimals).replace('.', parsed.separator)}${parsed.suffix}`
    : value;

  return (
    <div
      ref={ref}
      style={{
        padding: 'clamp(18px, 2.5vw, 26px)',
        border: '1px solid var(--line, rgba(21,18,15,0.13))',
        borderRadius: 3,
        background: 'var(--surface, #fff)',
      }}
    >
      {/* Values like "-64%" have no strong directional character, so in Arabic they
          would render as "64%-". Ones that carry Arabic words keep automatic direction. */}
      <p dir={/[֐-ࣿ]/.test(String(value)) ? 'auto' : 'ltr'} style={{
        margin: 0,
        unicodeBidi: 'isolate',
        fontSize: 'clamp(28px, 4vw, 44px)',
        fontWeight: 600,
        letterSpacing: '-0.03em',
        lineHeight: 1,
        color: 'var(--accent, #0E7A69)',
        fontVariantNumeric: 'tabular-nums',
      }}>
        {shown}
      </p>
      <p style={{ margin: '12px 0 0', fontSize: 14, color: 'var(--muted, #6c665e)', lineHeight: 1.45 }}>
        {label}
      </p>
    </div>
  );
}

function Shot({ src, alt, reduce }) {
  const ref = useRef(null);
  // No `container` — the window is the scroller now.
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });
  const y = useTransform(scrollYProgress, [0, 1], reduce ? ['0%', '0%'] : ['-7%', '7%']);

  return (
    <div
      ref={ref}
      style={{
        height: 'min(56vh, 460px)',
        overflow: 'hidden',
        borderRadius: 3,
        border: '1px solid var(--line, rgba(21,18,15,0.13))',
        background: 'var(--surface, #fff)',
      }}
    >
      <motion.img
        src={src}
        alt={alt}
        loading="lazy"
        style={{ width: '100%', height: '114%', objectFit: 'cover', y }}
      />
    </div>
  );
}
