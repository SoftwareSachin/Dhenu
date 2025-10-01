import { Link } from "wouter";
import { Menu, Sprout } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export default function Header() {
  return (
    <header className="glass border-b border-border/50 sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center space-x-3 cursor-pointer group">
            <div className="w-10 h-10 bg-primary rounded-[10px] flex items-center justify-center transition-transform duration-200 group-hover:scale-105">
              <Sprout className="text-primary-foreground" size={24} strokeWidth={1.75} />
            </div>
            <div>
              <h1 className="text-lg font-bold text-foreground">PashuAI</h1>
              <p className="text-xs text-muted-foreground">AI Agriculture Advisory</p>
            </div>
          </Link>
          
          <div className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors duration-200">Features</a>
            <a href="#solutions" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors duration-200">Solutions</a>
            <a href="#models" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors duration-200">AI Models</a>
            <Link href="/chat">
              <Button data-testid="button-get-started">
                Get Started
              </Button>
            </Link>
          </div>

          <Sheet>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon" data-testid="button-menu">
                <Menu strokeWidth={1.75} />
              </Button>
            </SheetTrigger>
            <SheetContent>
              <div className="flex flex-col space-y-4 mt-8">
                <a href="#features" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors duration-200">Features</a>
                <a href="#solutions" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors duration-200">Solutions</a>
                <a href="#models" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors duration-200">AI Models</a>
                <Link href="/chat">
                  <Button className="w-full" data-testid="button-mobile-get-started">
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
