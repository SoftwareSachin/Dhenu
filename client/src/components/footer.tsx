import { Sprout } from "lucide-react";
import { SiX, SiLinkedin, SiGithub } from "react-icons/si";

export default function Footer() {
  return (
    <footer className="bg-card border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-9 h-9 bg-primary rounded-[10px] flex items-center justify-center">
                <Sprout className="text-primary-foreground" size={20} strokeWidth={1.75} />
              </div>
              <span className="font-bold text-foreground text-lg">PashuAI</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              AI-powered agricultural and livestock advisory platform for farmers worldwide.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-foreground mb-4">Platform</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-foreground transition-colors duration-200">PashuAI</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors duration-200">AgriCopilot</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors duration-200">Dhenu Models</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors duration-200">API Access</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-foreground mb-4">Resources</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-foreground transition-colors duration-200">Documentation</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors duration-200">Blog</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors duration-200">Case Studies</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors duration-200">Research Papers</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-foreground mb-4">Company</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-foreground transition-colors duration-200">About Us</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors duration-200">Contact</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors duration-200">Careers</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors duration-200">Privacy Policy</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-muted-foreground">
            © 2025 PashuAI by KissanAI. All rights reserved.
          </p>
          <div className="flex items-center space-x-5 mt-4 md:mt-0">
            <a href="#" className="text-muted-foreground hover:text-foreground transition-colors duration-200" aria-label="X (Twitter)">
              <SiX size={20} />
            </a>
            <a href="#" className="text-muted-foreground hover:text-foreground transition-colors duration-200" aria-label="LinkedIn">
              <SiLinkedin size={20} />
            </a>
            <a href="#" className="text-muted-foreground hover:text-foreground transition-colors duration-200" aria-label="GitHub">
              <SiGithub size={20} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
