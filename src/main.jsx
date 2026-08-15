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
      {/* `reducedMotion="user"` drops every transform and layout animation in the
          app when the OS asks for reduced motion, without touching opacity — so
          content still fades in and nothing disappears. What it cannot reach is
          handled at the source: the CSS marquee and smooth scrolling in
          index.css, the opacity pulse in Hero, and the carousel in
          HeroShowcase. */}
      <MotionConfig reducedMotion="user">
        <App />
      </MotionConfig>
    </ThemeProvider>
  </StrictMode>
);
