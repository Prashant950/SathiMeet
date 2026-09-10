import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";

import AboutHero from "./components/about/AboutHero";
import RealitySection from "./components/about/RealitySection";
import AboutStats from "./components/about/AboutStats";
import WhatWeDo from "./components/about/WhatWeDo";
import Mission from "./components/about/Mission";
import Vision from "./components/about/Vision";
import CoreValues from "./components/about/CoreValues";
import WhyChooseSathiMeet from "./components/about/WhyChooseSathiMeet";

const About = () => {
  return (
    <>
      <Header />

      <AboutHero />
      <RealitySection />
      <AboutStats />
      <WhatWeDo />
      <Mission />
      <Vision />
      <CoreValues />
      <WhyChooseSathiMeet />

      <Footer />
    </>
  );
};

export default About;