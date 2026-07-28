import { useRef, useEffect, useId, useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
  useInView,
  useReducedMotion,
  animate,
} from 'framer-motion';
import { X, ArrowRight } from 'lucide-react';
import ScrollReveal from './ScrollReveal';
import { findProject, nextProject, heroImage, shotImage } from '../data/projects';

const EASE = [0.2, 0.6, 0.2, 1];
const FOCUSABLE = 'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])';

export default function CaseStudy({ slug, onOpen, onClose }) {
  return (
    <AnimatePresence>
      {slug ? <CasePanel key="case-study" slug={slug} onOpen={onOpen} onClose={onClose} /> : null}
    </AnimatePresence>
  );
}

function CasePanel({ slug, onOpen, onClose }) {
  const { t, i18n } = useTranslation();
  const reduce = useReducedMotion();
  const rtl = i18n.dir() === 'rtl';
  const titleId = useId();
  const scrollRef = useRef(null);
  const closeRef = useRef(null);
  // Read at cleanup time so focus returns to whichever card is showing when we leave.
  const currentSlug = useRef(slug);
  currentSlug.current = slug;

  const project = findProject(slug);
  const next = nextProject(slug);
  const raw = t(`projects.${slug}`, { returnObjects: true });
  const d = raw && typeof raw === 'object' ? raw : {};
  const results = Array.isArray(d.results) ? d.results : [];
  const metrics = Array.isArray(d.metrics) ? d.metrics : [];
  const hasBody = Boolean(d.overview || d.challenge || d.solution);
  const shots = project ? project.shots : 0;

  const { scrollYProgress } = useScroll({ container: scrollRef });

  // The page behind is locked while the overlay is up. `overflow-y` lives on `html`
  // (see index.css), so locking `body` would do nothing. Locking can also clamp the
  // scroll position, and closing via history.back() restores it — so the exact offset
  // is saved here and re-applied after the unlock, with smooth scrolling suppressed.
  useEffect(() => {
    const root = document.documentElement;
    const y = window.scrollY;
    const prevOverflow = root.style.overflow;
    const prevPadding = root.style.paddingRight;
    // Measure the width the scrollbar gives back rather than deriving it from
    // window.innerWidth: the page already overflows horizontally at narrow widths, and
    // on mobile innerWidth is the visual viewport, so that subtraction invents a gap.
    const widthBefore = root.clientWidth;
    root.style.overflow = 'hidden';
    const reclaimed = root.clientWidth - widthBefore;
    if (reclaimed > 0) root.style.paddingRight = `${reclaimed}px`;
    return () => {
      root.style.overflow = prevOverflow;
      root.style.paddingRight = prevPadding;
      const prevBehavior = root.style.scrollBehavior;
      root.style.scrollBehavior = 'auto';
      window.scrollTo(0, y);
      root.style.scrollBehavior = prevBehavior;
    };
  }, []);

  // Escape closes; Tab cycles inside the dialog instead of reaching the page behind.
  useEffect(() => {
    function onKey(e) {
      if (e.key === 'Escape') {
        e.stopPropagation();
        onClose();
        return;
      }
      if (e.key !== 'Tab') return;
      const panel = scrollRef.current;
      if (!panel) return;
      const items = Array.from(panel.querySelectorAll(FOCUSABLE)).filter((el) => el.offsetParent !== null);
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  // Move focus in on open, hand it back to the card that opened us on close.
  useEffect(() => {
    closeRef.current?.focus();
    return () => {
      const card = document.querySelector(`[data-case-card="${currentSlug.current}"]`);
      card?.focus({ preventScroll: true });
    };
  }, []);

  // Jumping to the next case study resets the reading position.
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 0, behavior: 'auto' });
  }, [slug]);

  if (!project) return null;

  const fade = { duration: reduce ? 0 : 0.35, ease: EASE };
  const pad = 'clamp(20px, 5vw, 64px)';

  return (
    <motion.div
      ref={scrollRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={fade}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 200,
        overflowY: 'auto',
        overflowX: 'hidden',
        background: 'var(--scrim, rgba(21,18,15,0.55))',
        // Clicks in the gutter beside the sheet close the overlay, lightbox style.
        cursor: 'auto',
      }}
    >
      <div
        style={{
          maxWidth: 1100,
          minHeight: '100%',
          margin: '0 auto',
          background: 'var(--bg, #f6f5f2)',
          color: 'var(--fg, #15120f)',
        }}
      >
        <div style={{
          position: 'sticky',
          top: 0,
          zIndex: 5,
          background: 'var(--bg-header, rgba(246,245,242,0.82))',
          backdropFilter: 'blur(10px)',
          borderBottom: '1px solid var(--line, rgba(21,18,15,0.13))',
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 16,
            padding: `12px ${pad}`,
          }}>
            <button
              ref={closeRef}
              type="button"
              className="focus-ring"
              onClick={onClose}
              aria-label={t('caseStudy.close')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                font: 'inherit',
                background: 'transparent',
                border: '1px solid var(--line, rgba(21,18,15,0.13))',
                color: 'var(--fg, #15120f)',
                borderRadius: 2,
                padding: '8px 14px',
                fontSize: 13,
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              <X size={16} />
              {t('caseStudy.close')}
            </button>
            <span style={{
              fontSize: 13,
              fontWeight: 600,
              color: 'var(--muted, #6c665e)',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}>
              {d.title}
            </span>
          </div>
          <motion.div
            style={{
              height: 2,
              background: 'var(--accent, #0E7A69)',
              scaleX: scrollYProgress,
              transformOrigin: rtl ? 'right' : 'left',
            }}
          />
        </div>

        {/* Keying on the slug remounts the body when moving to the next case study,
            which is also what hands the shared hero image over to the new project. */}
        <motion.div key={slug} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={fade}>
          <div style={{ padding: `clamp(24px, 4vw, 48px) ${pad} 0` }}>
            <div style={{
              position: 'relative',
              height: 'min(62vh, 560px)',
              borderRadius: 4,
              overflow: 'hidden',
              border: '1px solid var(--line, rgba(21,18,15,0.13))',
              background: 'var(--surface, #fff)',
            }}>
              <motion.img
                layoutId={`case-img-${slug}`}
                src={heroImage(slug)}
                alt={`${d.title} — ${t('imgLabel')}`}
                transition={{ duration: reduce ? 0 : 0.55, ease: EASE }}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <div style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(to top, var(--scrim, rgba(21,18,15,0.55)), transparent 65%)',
                pointerEvents: 'none',
              }} />
              <motion.div
                initial={{ opacity: 0, y: reduce ? 0 : 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: reduce ? 0 : 0.5, delay: reduce ? 0 : 0.25, ease: EASE }}
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
                <h1 id={titleId} style={{
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
            <ScrollReveal root={scrollRef}>
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

            <ScrollReveal root={scrollRef} delay={0.08}>
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

          {metrics.length > 0 && (
            <div style={{ padding: `clamp(36px, 5vw, 60px) ${pad} 0` }}>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                gap: 'clamp(16px, 2vw, 24px)',
              }}>
                {metrics.map((m, i) => (
                  <Metric
                    key={`${m.label}-${i}`}
                    value={m.value}
                    label={m.label}
                    root={scrollRef}
                    reduce={reduce}
                  />
                ))}
              </div>
            </div>
          )}

          {hasBody ? (
            <div style={{ padding: `clamp(40px, 6vw, 88px) ${pad} 0` }}>
              <Block root={scrollRef} title={t('caseStudy.overview')} body={d.overview} />
              <Block root={scrollRef} title={t('caseStudy.challenge')} body={d.challenge} />
              <Block root={scrollRef} title={t('caseStudy.solution')} body={d.solution} />

              {results.length > 0 && (
                <Block root={scrollRef} title={t('caseStudy.results')}>
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
              <ScrollReveal root={scrollRef}>
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
              <ScrollReveal root={scrollRef}>
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
                    container={scrollRef}
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
              gap: 20,
              paddingTop: 'clamp(28px, 4vw, 40px)',
              borderTop: '1px solid var(--line, rgba(21,18,15,0.13))',
            }}>
              <button
                type="button"
                className="focus-ring"
                onClick={() => {
                  onClose();
                  // Closing goes through history, so wait for the overlay to unmount
                  // and the scroll lock to lift before scrolling the page underneath.
                  setTimeout(() => {
                    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
                  }, 400);
                }}
                style={{
                  font: 'inherit',
                  background: 'var(--accent, #0E7A69)',
                  border: '1px solid var(--accent, #0E7A69)',
                  color: 'var(--accent-fg, #fff)',
                  fontWeight: 600,
                  fontSize: 14,
                  letterSpacing: '0.04em',
                  padding: '13px 26px',
                  borderRadius: 2,
                  cursor: 'pointer',
                }}
              >
                {t('caseStudy.cta')}
              </button>

              {next && (
                <button
                  type="button"
                  className="focus-ring"
                  onClick={() => onOpen(next.slug)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    background: 'transparent',
                    border: 'none',
                    padding: 0,
                    font: 'inherit',
                    color: 'inherit',
                    cursor: 'pointer',
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
                    width: 40,
                    height: 40,
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
                </button>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
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

function Block({ root, title, body, children }) {
  if (!body && !children) return null;
  return (
    <ScrollReveal root={root}>
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

function Metric({ value, label, root, reduce }) {
  const ref = useRef(null);
  const inView = useInView(ref, { root, once: true, margin: '-10% 0px' });
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

function Shot({ src, alt, container, reduce }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    container,
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
