import Agents from "@/components/Agents";
import CliSection from "@/components/CliSection";
import Faq from "@/components/Faq";
import Features from "@/components/Features";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import Nav from "@/components/Nav";
import Pipeline from "@/components/Pipeline";
import ViewerSection from "@/components/viewer/ViewerSection";

export default function Page() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <ViewerSection />
        <Pipeline />
        <Features />
        <Agents />
        <CliSection />
        <Faq />
      </main>
      <Footer />
    </>
  );
}
