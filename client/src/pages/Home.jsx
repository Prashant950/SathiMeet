import Header from "../components/layout/Header";
import DatingHero from "../components/dating/DatingHero";
import FeaturedMatches from "../components/dating/FeaturedMatches";
import DateVibes from "../components/dating/DateVibes";
import HowDatingWorks from "../components/dating/HowDatingWorks";
import DatingSafety from "../components/dating/DatingSafety";
import WhyChooseUs from "../components/whyChooseUs/WhyChooseUs";
import SupportAcrossIndia from "../components/support/SupportAcrossIndia";
// import Testimonials from "../components/testimonials/Testimonials";
import EarningsSection from "../components/earnings/EarningsSection";
import Pricing from "../components/pricing/Pricing";
import FAQ from "../components/faq/FAQ";
import CTASection from "../components/cta/CTASection";
import Footer from "../components/layout/Footer";

const Home = () => {
  return (
    <div className="min-h-screen bg-white selection:bg-rose-500 selection:text-white">
      <Header />
      <main>
        <DatingHero />
        <FeaturedMatches />
        <DateVibes />
        <HowDatingWorks />
        <DatingSafety />
        <WhyChooseUs />
        <SupportAcrossIndia />
        {/* <Testimonials /> */}
        <EarningsSection />
        <Pricing />
        <FAQ />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
};

export default Home;