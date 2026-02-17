import LandingNavbar from "../../components/layout/LandingNavbar";
import Hero from "../../components/home/Hero";
import Features from "../../components/home/Features";
import CTA from "../../components/home/CTA";
import Footer from "../../components/layout/Footer";

function Home() {
  return (

    <div className="min-h-screen bg-primary text-textPrimary font-sans pt-20">
      
      {/* Navbar */}
      <LandingNavbar />

      {/* Main Content */}
      <main className="flex flex-col">

        {/* Hero */}
        <section className="animate-fadeIn">
          <Hero />
        </section>

        {/* Features */}
        <section className="animate-fadeIn">
          <Features />
        </section>

        {/* Call To Action */}
        <section className="animate-fadeIn">
          <CTA />
        </section>

      </main>

      {/* Footer */}
      <Footer />

    </div>
  );
}

export default Home;
