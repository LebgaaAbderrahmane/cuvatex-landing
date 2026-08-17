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

// The one long sales page. Order is the argument it makes: what we do → who we
// help → how we work → proof → who we are → price. Contact moved to its own
// `/contact` route, so the mid-page CtaBanner is now the homepage's "talk to
// us" moment. The header nav is pages only now (Header.jsx's `sections`
// array) — none of it links here by hash anymore, so the section `id`s below
// are no longer nav anchor targets. They stay anyway: harmless, and a future
// hash link (or a test selector) can still use them.
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
    </>
  );
}
