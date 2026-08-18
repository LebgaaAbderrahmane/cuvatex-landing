import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { BrowserRouter, Routes, Route } from 'react-router';
import Header from './components/Header';
import Footer from './components/Footer';
import BackToTop from './components/BackToTop';
import ScrollManager from './components/ScrollManager';
import Home from './pages/Home';
import WorkList from './pages/WorkList';
import Project from './pages/Project';
import ServicesList from './pages/ServicesList';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import Terms from './pages/Terms';
import Privacy from './pages/Privacy';
import NotFound from './pages/NotFound';

// The shell every route shares. The page content itself lives in src/pages.
export default function App() {
  const { t, i18n } = useTranslation();

  // resolvedLanguage is always a supported code; `language` can carry a region suffix.
  useEffect(() => {
    const lang = i18n.resolvedLanguage || 'en';
    document.documentElement.setAttribute('lang', lang);
    document.documentElement.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');
  }, [i18n.resolvedLanguage]);

  return (
    <BrowserRouter>
      {/* #top: link target for the logo and BackToTop. minHeight keeps the
          footer down on a short page like 404. */}
      <div id="top" style={{ minHeight: '100vh' }}>
        <ScrollManager />
        {/* Bare #main, not /#main — every route renders a <main>, and the
            absolute form would bounce a subpage visitor back to the homepage. */}
        <a href="#main" className="skip-link">{t('skipToContent')}</a>
        <Header />
        {/* tabIndex: focus target for the skip link and ScrollManager */}
        <main id="main" tabIndex={-1}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/services" element={<ServicesList />} />
            <Route path="/work" element={<WorkList />} />
            <Route path="/work/:slug" element={<Project />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
        <BackToTop />
      </div>
    </BrowserRouter>
  );
}
