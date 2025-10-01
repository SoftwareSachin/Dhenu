import Header from "@/components/header";
import Footer from "@/components/footer";
import HeroSection from "@/components/hero-section";
import FeaturesGrid from "@/components/features-grid";
import ChatInterface from "@/components/chat-interface";
import AIModelsSection from "@/components/ai-models-section";
import UseCasesSection from "@/components/use-cases-section";
import StatisticsSection from "@/components/statistics-section";
import CTASection from "@/components/cta-section";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <HeroSection />
        <FeaturesGrid />
        <ChatInterface />
        <AIModelsSection />
        <UseCasesSection />
        <StatisticsSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}
