import SiteNavbar from "../components/landing/Navbar";
import Hero from "../components/landing/Hero";
import Categories from "../components/landing/Categories";
import HowItWorks from "../components/landing/HowItWorks";
import Featured from "../components/landing/Featured";
import WhySwap from "../components/landing/WhySwap";
import CallToAction from "../components/landing/CallToAction";
import Footer from "../components/landing/Footer";
import "./landing.css";

export default function Landing() {
  return (
    <div className="tb-landing">
      <SiteNavbar />
      <main>
        <Hero />
        <Categories />
        <HowItWorks />
        <Featured />
        <WhySwap />
        <CallToAction />
      </main>
      <Footer />
    </div>
  );
}