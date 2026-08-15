import Hero from '../components/Hero';
import Services from '../components/Services';
import Clients from '../components/Clients';
import Process from '../components/Process';
import Work from '../components/Work';
import Testimonials from '../components/Testimonials';
import CtaBanner from '../components/CtaBanner';
import About from '../components/About';
import Team from '../components/Team';
import Faq from '../components/Faq';
import Pricing from '../components/Pricing';
import Contact from '../components/Contact';

// The one long sales page. Order is the argument it makes: what we do → who we
// help → how we work → proof → who we are → price → talk to us. Every `id` here
// is an anchor target for the header nav, so renaming one means renaming it in
// Header.jsx's `sections` array too.
export default function Home() {
  return (
    <>
      <Hero />
      <Services />
      <Clients />
      <Process />
      <Work />
      <Testimonials />
      <CtaBanner />
      <About />
      <Team />
      <Faq />
      <Pricing />
      <Contact />
    </>
  );
}
