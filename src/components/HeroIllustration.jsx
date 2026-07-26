import { motion } from 'framer-motion';

export default function HeroIllustration() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
      style={{ width: '100%', maxWidth: 480, aspectRatio: '1/1' }}
    >
      <svg viewBox="0 0 520 520" style={{ width: '100%', height: '100%' }} fill="none">
        <circle cx="260" cy="260" r="220" fill="var(--accent, #0E7A69)" opacity="0.04" />
        <circle cx="260" cy="260" r="150" fill="var(--accent, #0E7A69)" opacity="0.06" />

        <circle cx="260" cy="40" r="4" fill="var(--accent, #0E7A69)" opacity="0.15" />
        <circle cx="260" cy="480" r="4" fill="var(--accent, #0E7A69)" opacity="0.15" />
        <circle cx="40" cy="260" r="4" fill="var(--accent, #0E7A69)" opacity="0.15" />
        <circle cx="480" cy="260" r="4" fill="var(--accent, #0E7A69)" opacity="0.15" />

        <motion.g
          animate={{ rotate: [0, 6, 0], y: [0, -5, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
        >
          <text x="105" y="135" fill="var(--muted, #6c665e)" fontSize="18" fontFamily="monospace" fontWeight="700" textAnchor="middle">{'</>'}</text>
        </motion.g>

        <motion.g
          animate={{ rotate: [0, -8, 0], x: [0, 3, 0] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        >
          <rect x="398" y="118" width="16" height="3" rx="1.5" fill="var(--accent, #0E7A69)" opacity="0.4" />
          <rect x="406.5" y="109.5" width="3" height="16" rx="1.5" fill="var(--accent, #0E7A69)" opacity="0.4" />
        </motion.g>

        <motion.circle
          cx="110" cy="400" r="6"
          fill="var(--accent, #0E7A69)"
          opacity="0.2"
          animate={{ y: [0, -7, 0] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut', delay: 0.3 }}
        />

        <motion.g
          animate={{ rotate: [0, 12, 0], x: [0, -3, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay: 0.8 }}
        >
          <rect x="397" y="392" width="14" height="14" rx="3" stroke="var(--muted, #6c665e)" strokeWidth="2" opacity="0.3" fill="none" />
        </motion.g>

        <motion.g animate={{ y: [0, -6, 0] }} transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}>
          <rect x="198" y="312" width="50" height="8" rx="3" fill="var(--muted, #6c665e)" opacity="0.3" />
          <rect x="185" y="320" width="76" height="5" rx="2.5" fill="var(--muted, #6c665e)" opacity="0.2" />
          <rect x="125" y="175" width="195" height="135" rx="8" fill="var(--surface, #fff)" stroke="var(--line, rgba(21,18,15,0.13))" strokeWidth="1.5" />

          <motion.g
            animate={{ opacity: [1, 0.35, 1] }}
            transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          >
            <circle cx="138" cy="190" r="3" fill="#ff5f57" />
            <circle cx="150" cy="190" r="3" fill="#febc2e" />
            <circle cx="162" cy="190" r="3" fill="#28c840" />
            <rect x="178" y="186" width="95" height="8" rx="4" fill="var(--muted, #6c665e)" opacity="0.12" />

            <rect x="135" y="208" width="175" height="36" rx="5" fill="var(--accent, #0E7A69)" opacity="0.08" />
            <rect x="145" y="220" width="60" height="12" rx="3" fill="var(--accent, #0E7A69)" opacity="0.2" />

            <rect x="135" y="256" width="53" height="28" rx="4" fill="var(--muted, #6c665e)" opacity="0.06" />
            <rect x="196" y="256" width="53" height="28" rx="4" fill="var(--muted, #6c665e)" opacity="0.06" />
            <rect x="257" y="256" width="53" height="28" rx="4" fill="var(--muted, #6c665e)" opacity="0.06" />

            <rect x="135" y="298" width="175" height="4" rx="2" fill="var(--muted, #6c665e)" opacity="0.12" />
          </motion.g>
        </motion.g>

        <motion.g animate={{ y: [0, 6, 0] }} transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}>
          <rect x="298" y="140" width="80" height="168" rx="18" fill="var(--surface, #fff)" stroke="var(--line, rgba(21,18,15,0.13))" strokeWidth="1.5" />
          <rect x="323" y="148" width="30" height="4" rx="2" fill="var(--line, rgba(21,18,15,0.13))" />

          <motion.g
            animate={{ opacity: [0.35, 1, 0.35] }}
            transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          >
            <rect x="308" y="162" width="60" height="3" rx="1.5" fill="var(--muted, #6c665e)" opacity="0.25" />
            <rect x="308" y="175" width="60" height="6" rx="3" fill="var(--accent, #0E7A69)" opacity="0.2" />

            <rect x="308" y="192" width="60" height="26" rx="4" fill="var(--accent, #0E7A69)" opacity="0.06" />
            <rect x="312" y="200" width="30" height="5" rx="2.5" fill="var(--accent, #0E7A69)" opacity="0.15" />

            <rect x="308" y="226" width="60" height="26" rx="4" fill="var(--accent, #0E7A69)" opacity="0.06" />
            <rect x="312" y="234" width="40" height="5" rx="2.5" fill="var(--accent, #0E7A69)" opacity="0.15" />

            <rect x="308" y="260" width="60" height="26" rx="4" fill="var(--accent, #0E7A69)" opacity="0.06" />
            <rect x="312" y="268" width="25" height="5" rx="2.5" fill="var(--accent, #0E7A69)" opacity="0.15" />

            <rect x="308" y="296" width="60" height="5" rx="2.5" fill="var(--muted, #6c665e)" opacity="0.12" />
            <circle cx="318" cy="298.5" r="2" fill="var(--accent, #0E7A69)" opacity="0.4" />
            <circle cx="338" cy="298.5" r="2" fill="var(--muted, #6c665e)" opacity="0.15" />
            <circle cx="358" cy="298.5" r="2" fill="var(--muted, #6c665e)" opacity="0.15" />
          </motion.g>
        </motion.g>
      </svg>
    </motion.div>
  );
}
