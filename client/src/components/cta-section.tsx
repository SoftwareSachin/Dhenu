import { Link } from "wouter";
import { MessageCircle, Calendar, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function CTASection() {
  return (
    <section className="py-24 bg-muted/30">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-5">
          Ready to Transform Your Agricultural Business?
        </h2>
        <p className="text-lg md:text-xl text-muted-foreground mb-10">
          Join thousands of farmers and agribusinesses already using AI-powered advisory
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
          <Link href="/chat">
            <Button size="lg" data-testid="button-start-chat">
              <MessageCircle size={20} strokeWidth={1.75} />
              Start Free Chat
            </Button>
          </Link>
          <Button size="lg" variant="outline" data-testid="button-schedule-demo">
            <Calendar size={20} strokeWidth={1.75} />
            Schedule Demo
          </Button>
        </div>

        <div className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Check className="text-primary" size={16} strokeWidth={2} />
            <span>Free for farmers</span>
          </div>
          <div className="flex items-center gap-2">
            <Check className="text-primary" size={16} strokeWidth={2} />
            <span>6-8 week enterprise deployment</span>
          </div>
          <div className="flex items-center gap-2">
            <Check className="text-primary" size={16} strokeWidth={2} />
            <span>95% success rate</span>
          </div>
        </div>
      </div>
    </section>
  );
}
