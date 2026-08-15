import { useTranslation } from 'react-i18next';

export default function Footer() {
  const { t } = useTranslation();

  return (
    <footer style={{
      borderTop: '1px solid var(--line, rgba(21,18,15,0.13))',
      // 22px, not 32px: the mail link below grew to a 44px tap target, so the
      // row is ~24px taller and the footer keeps roughly its old total height.
      padding: '22px clamp(20px, 5vw, 48px)',
    }}>
      <div style={{
        maxWidth: 1160,
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 16,
        flexWrap: 'wrap',
        fontSize: 14,
        color: 'var(--muted, #6c665e)',
      }}>
        <span>{t('footer')}</span>
        <a
          href={`mailto:${t('email')}`}
          className="focus-ring"
          style={{
            color: 'var(--muted, #6c665e)',
            textDecoration: 'none',
            transition: 'color 0.2s',
            display: 'inline-flex',
            alignItems: 'center',
            minHeight: 44,
          }}
          onMouseEnter={e => e.target.style.color = 'var(--fg, #15120f)'}
          onMouseLeave={e => e.target.style.color = 'var(--muted, #6c665e)'}
        >
          {t('email')}
        </a>
      </div>
    </footer>
  );
}
