import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Header from './components/Header';
import Hero from './components/Hero';
import Services from './components/Services';
import Process from './components/Process';
import Work from './components/Work';
import About from './components/About';
import Team from './components/Team';
import Contact from './components/Contact';
import Footer from './components/Footer';
import BackToTop from './components/BackToTop';

export default function App() {
  const { i18n } = useTranslation();

  useEffect(() => {
    const lang = i18n.language || 'en';
    document.documentElement.setAttribute('lang', lang);
    document.documentElement.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');
  }, [i18n.language]);

  return (
    <div id="top" style={{ minHeight: '100vh' }}>
      <Header />
      <main>
        <Hero />
        <Services />
        <Process />
        <Work />
        <About />
        <Team />
        <Contact />
      </main>
      <Footer />
      <BackToTop />
    </div>
  );
}
