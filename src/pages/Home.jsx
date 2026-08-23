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

// The one long sales page. Order is the argument: who we are (proof, right
// after the hero) → what we do → how we work → proof of work → who we are →
// price → objections → the ask. Contact lives at /contact now, so this
// closing CtaBanner is the homepage's only "talk to us" moment.
export default function Home() {
  return (
    <>
      <Hero />
      <Clients />
      <Services />
      <Process />
      <Work />
      <Testimonials />
      <About />
      <Team />
      <Pricing />
      <Faq />
      <CtaBanner />
    </>
  );
}
