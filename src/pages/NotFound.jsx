import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Link } from 'react-router';

const MotionLink = motion.create(Link);

// Reached by the `*` route and by a project page whose slug isn't in data/projects.js.
export default function NotFound() {
  const { t } = useTranslation();

  return (
    <section style={{
      minHeight: 'calc(100dvh - var(--header-h, 73px))', // fills what's left under the header
      display: 'flex',
      alignItems: 'center',
      padding: 'clamp(48px, 10vw, 96px) clamp(20px, 5vw, 48px)',
    }}>
      <div style={{ maxWidth: 1160, margin: '0 auto', width: '100%' }}>
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
          {/* not translated — same in every locale */}
          404
        </p>

        <h1 style={{
          fontSize: 'clamp(34px, 7vw, 62px)',
          fontWeight: 600,
          letterSpacing: '-0.03em',
          lineHeight: 1.03,
          margin: '16px 0 0',
          maxWidth: '15ch',
        }}>
          {t('notFound.title')}
        </h1>

        <p style={{
          margin: 'clamp(18px, 2.5vw, 24px) 0 0',
          maxWidth: '46ch',
          color: 'var(--muted, #6c665e)',
          fontSize: 'clamp(16px, 2vw, 19px)',
          lineHeight: 1.6,
        }}>
          {t('notFound.body')}
        </p>

        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 12,
          marginTop: 'clamp(28px, 4vw, 40px)',
        }}>
          <MotionLink
            to="/"
            className="focus-ring"
            whileTap={{ scale: 0.97 }}
            style={{ ...buttonBase, ...solidButton }}
          >
            {t('notFound.home')}
          </MotionLink>
          <MotionLink
            to="/work"
            className="focus-ring"
            whileHover={{ background: 'var(--accent, #0E7A69)', color: 'var(--accent-fg, #fff)' }}
            whileTap={{ scale: 0.97 }}
            style={{ ...buttonBase, ...outlineButton }}
          >
            {t('notFound.work')}
          </MotionLink>
        </div>
      </div>
    </section>
  );
}

const buttonBase = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '14px 26px',
  borderRadius: 2,
  textDecoration: 'none',
  fontWeight: 600,
  fontSize: 14,
  letterSpacing: '0.04em',
  transition: 'background 0.2s, color 0.2s',
};

const solidButton = {
  background: 'var(--accent, #0E7A69)',
  border: '1px solid var(--accent, #0E7A69)',
  color: 'var(--accent-fg, #fff)',
};

const outlineButton = {
  background: 'transparent',
  border: '1px solid var(--line, rgba(21,18,15,0.13))',
  color: 'var(--fg, #15120f)',
};
