import { Link } from "wouter";
import { Menu, Sprout } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export default function Header() {
  return (
    <header className="bg-card border-b border-border sticky top-0 z-50 elevation-2">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center space-x-3 cursor-pointer">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <Sprout className="text-primary-foreground" size={24} />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">Farmer Copilot</h1>
              <p className="text-xs text-muted-foreground">AI Agriculture & Livestock Advisory</p>
            </div>
          </Link>
          
          <div className="hidden md:flex items-center space-x-6">
            <a href="#features" className="text-sm font-medium text-foreground hover:text-primary transition-colors">Features</a>
            <a href="#solutions" className="text-sm font-medium text-foreground hover:text-primary transition-colors">Solutions</a>
            <a href="#models" className="text-sm font-medium text-foreground hover:text-primary transition-colors">AI Models</a>
            <Link href="/chat">
              <Button className="ripple" data-testid="button-get-started">
                Get Started
              </Button>
            </Link>
          </div>

          <Sheet>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon" data-testid="button-menu">
                <Menu />
              </Button>
            </SheetTrigger>
            <SheetContent>
              <div className="flex flex-col space-y-4 mt-8">
                <a href="#features" className="text-sm font-medium text-foreground hover:text-primary transition-colors">Features</a>
                <a href="#solutions" className="text-sm font-medium text-foreground hover:text-primary transition-colors">Solutions</a>
                <a href="#models" className="text-sm font-medium text-foreground hover:text-primary transition-colors">AI Models</a>
                <Link href="/chat">
                  <Button className="w-full ripple" data-testid="button-mobile-get-started">
                    Get Started
                  </Button>
                </Link>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  );
}
