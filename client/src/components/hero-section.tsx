import { Link } from "wouter";
import { MessageCircle, PlayCircle, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function HeroSection() {
  return (
    <section className="relative min-h-[650px] flex items-center overflow-hidden bg-noise">
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1625246333195-78d9c38ad449?ixlib=rb-4.0.3&auto=format&fit=crop&w=2400&q=80" 
          alt="Modern agricultural landscape with green fields and technology" 
          className="w-full h-full object-cover brightness-75" 
        />
        <div className="hero-gradient absolute inset-0"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="max-w-3xl">
          <div className="inline-flex items-center space-x-2 px-4 py-2 bg-white/15 backdrop-blur-md rounded-full mb-8 border border-white/20">
            <CheckCircle className="text-white" size={18} strokeWidth={1.75} />
            <span className="text-white text-sm font-medium">Trusted by 100K+ Farmers</span>
          </div>

          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-[1.1]">
            AI-Powered Agricultural Intelligence
          </h1>
          <p className="text-xl md:text-2xl text-white/90 mb-10 leading-relaxed font-light">
            Empowering farmers with multilingual AI advisory for crop management, livestock care, disease detection, and real-time market insights. Available in 20+ Indian languages.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mb-16">
            <Link href="/chat">
              <Button 
                size="lg" 
                className="bg-white text-primary hover:bg-white/95"
                data-testid="button-launch-copilot"
              >
                <MessageCircle size={20} strokeWidth={1.75} />
                Launch Copilot
              </Button>
            </Link>
            <Button 
              size="lg" 
              variant="outline" 
              className="bg-white/10 backdrop-blur-md text-white border-white/30 hover:bg-white/20"
              data-testid="button-watch-demo"
            >
              <PlayCircle size={20} strokeWidth={1.75} />
              Watch Demo
            </Button>
          </div>

          <div className="grid grid-cols-3 gap-8">
            <div className="text-white">
              <div className="text-4xl font-bold mb-1" data-testid="stat-topics">4000+</div>
              <div className="text-sm text-white/70 font-medium">Topics Covered</div>
            </div>
            <div className="text-white">
              <div className="text-4xl font-bold mb-1" data-testid="stat-accuracy">95%</div>
              <div className="text-sm text-white/70 font-medium">Accuracy Rate</div>
            </div>
            <div className="text-white">
              <div className="text-4xl font-bold mb-1" data-testid="stat-languages">20+</div>
              <div className="text-sm text-white/70 font-medium">Languages</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
