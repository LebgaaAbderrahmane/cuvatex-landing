import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';

export default function BackToTop() {
  const { t } = useTranslation();
  const [show, setShow] = useState(false);

  useEffect(() => {
    function onScroll() {
      setShow(window.scrollY > 400);
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.a
          href="#top"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.2 }}
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.9 }}
          className="focus-ring"
          aria-label={t('backToTop')}
          style={{
            position: 'fixed',
            bottom: 24,
            insetInlineEnd: 24,
            width: 44,
            height: 44,
            borderRadius: '50%',
            background: 'var(--accent, #0E7A69)',
            color: 'var(--accent-fg, #fff)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            textDecoration: 'none',
            zIndex: 100,
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
            border: 'none',
            cursor: 'pointer',
          }}
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <line x1="9" y1="15" x2="9" y2="3" />
            <polyline points="3 9 9 3 15 9" />
          </svg>
        </motion.a>
      )}
    </AnimatePresence>
  );
}
