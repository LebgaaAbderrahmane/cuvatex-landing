import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { MotionConfig } from 'framer-motion';
import { ThemeProvider } from './theme/ThemeContext';
import { loadAnalytics } from './analytics';
import './i18n';
import App from './App';
import './index.css';

loadAnalytics();

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider>
      {/* Handles reduced motion app-wide except opacity, CSS animations, and
          setInterval swaps — those are gated by hand at the source. */}
      <MotionConfig reducedMotion="user">
        <App />
      </MotionConfig>
    </ThemeProvider>
  </StrictMode>
);
