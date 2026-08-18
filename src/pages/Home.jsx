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

// The one long sales page. Order is the argument: what we do → who we help →
// how we work → proof → who we are → price. Contact lives at /contact now,
// so the mid-page CtaBanner is the homepage's "talk to us" moment.
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
