import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Header from './components/Header';
import Hero from './components/Hero';
import Services from './components/Services';
import Clients from './components/Clients';
import Process from './components/Process';
import Work from './components/Work';
import Testimonials from './components/Testimonials';
import CtaBanner from './components/CtaBanner';
import About from './components/About';
import Team from './components/Team';
import Faq from './components/Faq';
import Pricing from './components/Pricing';
import Contact from './components/Contact';
import Footer from './components/Footer';
import BackToTop from './components/BackToTop';
import CaseStudy from './components/CaseStudy';
import useCaseRoute from './hooks/useCaseRoute';

export default function App() {
  const { t, i18n } = useTranslation();
  const { slug: caseSlug, open: openCase, close: closeCase } = useCaseRoute();

  // `resolvedLanguage` is always one of the supported codes; `language` can still
  // carry a region suffix (`ar-DZ`), which would fail the `=== 'ar'` check.
  useEffect(() => {
    const lang = i18n.resolvedLanguage || 'en';
    document.documentElement.setAttribute('lang', lang);
    document.documentElement.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');
  }, [i18n.resolvedLanguage]);

  return (
    <div id="top" style={{ minHeight: '100vh' }}>
      {/* First tab stop on the page: lets keyboard users jump the seven nav
          links instead of tabbing through them on every section. Hidden
          off-screen until focused — see `.skip-link` in index.css. */}
      <a href="#main" className="skip-link">{t('skipToContent')}</a>
      <Header />
      {/* tabIndex={-1} makes the <main> a valid focus target for the skip link;
          without it the browser moves the scroll position but not the focus. */}
      <main id="main" tabIndex={-1}>
        <Hero />
        <Services />
        <Clients />
        <Process />
        <Work openSlug={caseSlug} onOpen={openCase} />
        <Testimonials />
        <CtaBanner />
        <About />
        <Team />
        <Faq />
        <Pricing />
        <Contact />
      </main>
      <Footer />
      <BackToTop />
      <CaseStudy slug={caseSlug} onOpen={openCase} onClose={closeCase} />
    </div>
  );
}
