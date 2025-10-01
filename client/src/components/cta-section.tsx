import { Link } from "wouter";
import { MessageCircle, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function CTASection() {
  return (
    <section className="py-20 bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-4xl font-bold text-foreground mb-4">
          Ready to Transform Your Agricultural Business?
        </h2>
        <p className="text-lg text-muted-foreground mb-8">
          Join thousands of farmers and agribusinesses already using AI-powered advisory
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/chat">
            <Button size="lg" className="elevation-2 ripple" data-testid="button-start-chat">
              <MessageCircle className="mr-2" size={20} />
              Start Free Chat
            </Button>
          </Link>
          <Button size="lg" variant="outline" className="ripple" data-testid="button-schedule-demo">
            <Calendar className="mr-2" size={20} />
            Schedule Demo
          </Button>
        </div>

        <p className="text-sm text-muted-foreground mt-6">
          ✓ Free for farmers ✓ 6-8 week enterprise deployment ✓ 95% success rate
        </p>
      </div>
    </section>
  );
}
