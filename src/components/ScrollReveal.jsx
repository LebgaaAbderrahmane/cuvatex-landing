import { motion } from 'framer-motion';

const variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

// `root` scopes the IntersectionObserver to a scrolling element instead of the
// viewport — needed inside the case-study overlay, which scrolls itself.
// Every other call site omits it and keeps the default viewport behaviour.
export default function ScrollReveal({ children, delay = 0, className, style, root }) {
  return (
    <motion.div
      className={className}
      style={style}
      variants={variants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-8% 0px', root }}
      transition={{ duration: 0.7, ease: [0.2, 0.6, 0.2, 1], delay }}
    >
      {children}
    </motion.div>
  );
}
