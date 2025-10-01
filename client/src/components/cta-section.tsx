import { Link } from "wouter";
import { MessageCircle, Calendar, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function CTASection() {
  return (
    <section className="py-24 bg-muted/30">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-5">
          Ready to Transform Your Agricultural Practice?
        </h2>
        <p className="text-lg md:text-xl text-muted-foreground mb-10">
          Start using AI-powered agricultural advisory today
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/chat">
            <Button size="lg" data-testid="button-start-chat">
              <MessageCircle size={20} strokeWidth={1.75} />
              Start Chat
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
