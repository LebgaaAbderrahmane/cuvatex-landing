import { useRef, useState, useLayoutEffect, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const serviceImages = [
  'https://picsum.photos/seed/services-web/800/600',
  'https://picsum.photos/seed/services-mvp/800/600',
  'https://picsum.photos/seed/services-mobile/800/600',
  'https://picsum.photos/seed/services-design/800/600',
  'https://picsum.photos/seed/services-backend/800/600',
  'https://picsum.photos/seed/services-custom/800/600',
];

const nums = ['01', '02', '03', '04', '05', '06'];

export default function Services() {
  const { t } = useTranslation();
  const services = t('services', { returnObjects: true });
  const n = Array.isArray(services) ? services.length : 0;
  const titleRef = useRef(null);
  const sectionRef = useRef(null);
  const containerRef = useRef(null);
  const [titleH, setTitleH] = useState(0);
  const [ty, setTy] = useState(0);

  useLayoutEffect(() => {
    if (titleRef.current) setTitleH(titleRef.current.getBoundingClientRect().height);
    const handleResize = () => {
      if (titleRef.current) setTitleH(titleRef.current.getBoundingClientRect().height);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (!containerRef.current || n === 0) return;
    let rafId;
    const handleScroll = () => {
      rafId = requestAnimationFrame(() => {
        const container = containerRef.current;
        if (!container) return;
        const cr = container.getBoundingClientRect();
        const cardSpace = window.innerHeight - 56 - titleH;
        const lastCardStickyTop = 56 + titleH - (n - 1) * cardSpace;
        const translateRange = 56 + titleH;
        let progress = 0;
        if (cr.top <= lastCardStickyTop) {
          progress = Math.min((lastCardStickyTop - cr.top) / translateRange, 1);
        }
        setTy(progress * (56 + titleH));
      });
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [n, titleH]);

  return (
    <section
      id="services"
      ref={sectionRef}
      style={{
        scrollMarginTop: 80,
        minHeight: '100dvh',
        borderTop: '1px solid var(--line, rgba(21,18,15,0.13))',
        background: 'var(--bg)',
      }}
    >
      <div
        ref={titleRef}
        style={{
          position: 'sticky',
          top: 56,
          zIndex: 49,
          background: 'var(--bg)',
          transform: `translateY(-${ty}px)`,
        }}
      >
        <div style={{
          maxWidth: 1160,
          margin: '0 auto',
          padding: 'clamp(24px, 4vw, 56px) clamp(20px, 5vw, 48px)',
        }}>
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
            {t('nav.services')}
          </p>
          <h2 style={{
            fontSize: 'clamp(30px, 5vw, 52px)',
            fontWeight: 600,
            letterSpacing: '-0.02em',
            lineHeight: 1.05,
            margin: '8px 0 0',
            maxWidth: '20ch',
          }}>
            {t('servicesTitle')}
          </h2>
        </div>
      </div>

      <div ref={containerRef} style={{ height: `calc(${n} * (100dvh - 56px - ${titleH}px) + ${56 + titleH}px)`, position: 'relative', zIndex: 1 }}>
        {n > 0 && services.map((s, i) => {
          const isEven = i % 2 === 0;
          return (
            <div
              key={s.title}
              style={{
                position: 'sticky',
                top: `calc(56px + ${titleH}px)`,
                height: `calc(100dvh - 56px - ${titleH}px)`,
                zIndex: i,
                background: i % 2 === 0 ? 'var(--bg)' : 'var(--surface)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                paddingLeft: 'clamp(20px, 5vw, 48px)',
                paddingRight: 'clamp(20px, 5vw, 48px)',
                borderTop: i === 0 ? 'none' : '1px solid var(--line, rgba(21,18,15,0.13))',
              }}
            >
              <div style={{
                maxWidth: 1160,
                margin: '0 auto',
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: 'clamp(32px, 5vw, 72px)',
                flexDirection: isEven ? 'row' : 'row-reverse',
                flexWrap: 'wrap',
              }}>
                <div style={{
                  flex: '1 1 400px',
                  borderRadius: 8,
                  overflow: 'hidden',
                  boxShadow: '0 4px 24px rgba(0,0,0,0.04)',
                }}>
                  <img
                    src={serviceImages[i] || serviceImages[0]}
                    alt={s.title}
                    loading={i < 2 ? 'eager' : 'lazy'}
                    style={{
                      width: '100%',
                      height: 'auto',
                      display: 'block',
                      borderRadius: 8,
                    }}
                  />
                </div>

                <div style={{
                  flex: '1 1 380px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 12,
                }}>
                  <span style={{
                    fontSize: 13,
                    fontWeight: 700,
                    letterSpacing: '0.08em',
                    color: 'var(--accent, #0E7A69)',
                  }}>
                    {nums[i]}
                  </span>
                  <h3 style={{
                    margin: 0,
                    fontSize: 'clamp(22px, 2.8vw, 30px)',
                    fontWeight: 600,
                    letterSpacing: '-0.02em',
                    lineHeight: 1.1,
                  }}>
                    {s.title}
                  </h3>
                  <p style={{
                    margin: 0,
                    color: 'var(--muted, #6c665e)',
                    fontSize: 'clamp(16px, 1.6vw, 18px)',
                    lineHeight: 1.6,
                    maxWidth: '44ch',
                  }}>
                    {s.desc}
                  </p>

                  {s.badge && (
                    <div style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 6,
                      marginTop: 4,
                      padding: '5px 14px',
                      borderRadius: 20,
                      background: 'color-mix(in srgb, var(--accent, #0E7A69) 10%, transparent)',
                      color: 'var(--accent, #0E7A69)',
                      fontSize: 13,
                      fontWeight: 600,
                      letterSpacing: '0.02em',
                      alignSelf: 'flex-start',
                    }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      {s.badge}
                    </div>
                  )}

                  {s.tags && s.tags.length > 0 && (
                    <div style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: 6,
                      marginTop: 4,
                    }}>
                      {s.tags.map(tag => (
                        <span key={tag} style={{
                          padding: '3px 10px',
                          borderRadius: 12,
                          fontSize: 11,
                          fontWeight: 500,
                          color: 'var(--muted, #6c665e)',
                          background: 'color-mix(in srgb, var(--muted) 8%, transparent)',
                          letterSpacing: '0.02em',
                        }}>
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {s.features && s.features.length > 0 && (
                    <ul style={{
                      margin: '8px 0 0',
                      padding: 0,
                      listStyle: 'none',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 6,
                    }}>
                      {s.features.map(f => (
                        <li key={f} style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 8,
                          fontSize: 14,
                          color: 'var(--fg, #15120f)',
                          lineHeight: 1.4,
                        }}>
                          <span style={{
                            width: 4,
                            height: 4,
                            borderRadius: '50%',
                            background: 'var(--accent, #0E7A69)',
                            flex: 'none',
                          }} />
                          {f}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
