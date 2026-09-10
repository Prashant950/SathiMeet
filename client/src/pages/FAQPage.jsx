import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";

import FAQHero from "./components/faqPage/FAQHero";
import FAQSearch from "./components/faqPage/FAQSearch";
import FAQStats from "./components/faqPage/FAQStats";
import FAQCategory from "./components/faqPage/FAQCategory";
import Disclaimer from "./components/faqPage/Disclaimer";
import FAQCTA from "./components/faqPage/FAQCTA";

const FAQPage = () => {
  return (
    <>
      <Header />

      <FAQHero />

      <FAQSearch />

      <FAQStats />

      <FAQCategory />

      <Disclaimer />

      <FAQCTA />

      <Footer />
    </>
  );
};

export default FAQPage;