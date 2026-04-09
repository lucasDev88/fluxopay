import { Benefits } from "@/components/home/benefits";
import Coments from "@/components/home/Coments";
import Footer from "@/components/home/Footer";
import Header from "@/components/home/Header";
import { Hero } from "@/components/home/Hero";
import Plans from "@/components/home/Plans";
import "@/style/App.css";

export default function Home() {
  return (
    <div className="min-h-screen bg-white font-sans text-gray-900 scroll-smooth">
      <Header />

      <main>
        <Hero />
        <div className="scroll-mt-16">
          <Benefits />
        </div>
        <div className="scroll-mt-16">
          <Coments />
        </div>
        <div className="scroll-mt-16">
          <Plans />
        </div>
      </main>

      <Footer />
    </div>
  );
}
