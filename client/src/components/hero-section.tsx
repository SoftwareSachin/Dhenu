import { Link } from "wouter";
import { MessageCircle, PlayCircle, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function HeroSection() {
  return (
    <section className="relative min-h-[600px] flex items-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1625246333195-78d9c38ad449?ixlib=rb-4.0.3&auto=format&fit=crop&w=2400&q=80" 
          alt="Modern agricultural landscape with green fields and technology" 
          className="w-full h-full object-cover" 
        />
        <div className="hero-gradient absolute inset-0"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="max-w-3xl">
          <div className="inline-flex items-center space-x-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full mb-6 elevation-2">
            <CheckCircle className="text-white" size={16} />
            <span className="text-white text-sm font-medium">Trusted by 100K+ Farmers</span>
          </div>

          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
            AI-Powered Agricultural Intelligence
          </h1>
          <p className="text-xl text-white/90 mb-8 leading-relaxed">
            Empowering farmers with multilingual AI advisory for crop management, livestock care, disease detection, and real-time market insights. Available in 20+ Indian languages.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/chat">
              <Button 
                size="lg" 
                className="bg-white text-primary hover:bg-white/95 elevation-3 ripple"
                data-testid="button-launch-copilot"
              >
                <MessageCircle className="mr-2" size={20} />
                Launch Copilot
              </Button>
            </Link>
            <Button 
              size="lg" 
              variant="outline" 
              className="bg-white/20 backdrop-blur-sm text-white border-white/30 hover:bg-white/30 ripple"
              data-testid="button-watch-demo"
            >
              <PlayCircle className="mr-2" size={20} />
              Watch Demo
            </Button>
          </div>

          <div className="grid grid-cols-3 gap-6 mt-12">
            <div className="text-white">
              <div className="text-3xl font-bold" data-testid="stat-topics">4000+</div>
              <div className="text-sm text-white/80">Topics Covered</div>
            </div>
            <div className="text-white">
              <div className="text-3xl font-bold" data-testid="stat-accuracy">95%</div>
              <div className="text-sm text-white/80">Accuracy Rate</div>
            </div>
            <div className="text-white">
              <div className="text-3xl font-bold" data-testid="stat-languages">20+</div>
              <div className="text-sm text-white/80">Languages</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
