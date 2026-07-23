import { useTranslation } from 'react-i18next';

export default function Footer() {
  const { t } = useTranslation();

  return (
    <footer style={{
      borderTop: '1px solid var(--line, rgba(21,18,15,0.13))',
      padding: '32px clamp(20px, 5vw, 48px)',
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
          style={{
            color: 'var(--muted, #6c665e)',
            textDecoration: 'none',
            transition: 'color 0.2s',
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
