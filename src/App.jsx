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
import NotFound from './pages/NotFound';

// The shell every route shares. The page content itself lives in src/pages.
export default function App() {
  const { t, i18n } = useTranslation();

  // `resolvedLanguage` is always one of the supported codes; `language` can still
  // carry a region suffix (`ar-DZ`), which would fail the `=== 'ar'` check.
  useEffect(() => {
    const lang = i18n.resolvedLanguage || 'en';
    document.documentElement.setAttribute('lang', lang);
    document.documentElement.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');
  }, [i18n.resolvedLanguage]);

  return (
    <BrowserRouter>
      {/* `#top` is a link target for the logo and BackToTop, and the min-height
          keeps the footer at the bottom of a short page such as 404. */}
      <div id="top" style={{ minHeight: '100vh' }}>
        <ScrollManager />
        {/* First tab stop on the page: lets keyboard users jump the seven nav
            links instead of tabbing through them on every section. Hidden
            off-screen until focused — see `.skip-link` in index.css. A bare
            `#main` and not `/#main`: every route renders a <main>, and the
            absolute form would navigate a subpage visitor back to the homepage. */}
        <a href="#main" className="skip-link">{t('skipToContent')}</a>
        <Header />
        {/* tabIndex={-1} makes the <main> a valid focus target for the skip link
            and for ScrollManager, which moves focus here on every navigation;
            without it the browser moves the scroll position but not the focus. */}
        <main id="main" tabIndex={-1}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/work" element={<WorkList />} />
            <Route path="/work/:slug" element={<Project />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
        <BackToTop />
      </div>
    </BrowserRouter>
  );
}
