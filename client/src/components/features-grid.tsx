import { Sprout, Beef, Camera, Mic, ShoppingBag, BookOpen } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const features = [
  {
    icon: Sprout,
    title: "Crop Management",
    description: "Get personalized advice on planting, irrigation, fertilization, and harvesting for optimal yields.",
    tags: ["Pest Control", "Weather", "Soil Health"],
    color: "primary"
  },
  {
    icon: Beef,
    title: "Livestock Advisory",
    description: "Expert guidance for cattle, buffalo, goats - covering health, breeding, nutrition, and disease prevention.",
    tags: ["Health", "Breeding", "Nutrition"],
    color: "accent"
  },
  {
    icon: Camera,
    title: "Image Analysis",
    description: "Upload photos for instant AI-powered disease detection and health assessment of crops and livestock.",
    tags: ["Disease ID", "AI Vision", "Real-time"],
    color: "primary"
  },
  {
    icon: Mic,
    title: "Voice Input",
    description: "Hands-free interaction with voice-to-text in multiple languages for easy field use.",
    tags: ["20+ Languages", "Hands-free"],
    color: "accent"
  },
  {
    icon: ShoppingBag,
    title: "Market Intelligence",
    description: "Real-time market prices, demand forecasts, and selling strategies to maximize profits.",
    tags: ["Prices", "Trends", "Forecast"],
    color: "primary"
  },
  {
    icon: BookOpen,
    title: "Knowledge Base",
    description: "Access 4000+ comprehensive topics covering agriculture, livestock, and sustainable practices.",
    tags: ["4000+ Topics", "Expert Tips"],
    color: "accent"
  }
];

export default function FeaturesGrid() {
  return (
    <section id="features" className="py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">Comprehensive Agricultural Solutions</h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            From crop management to livestock care, access expert AI guidance in your language
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            const bgColor = feature.color === "primary" ? "bg-primary/10" : "bg-accent/10";
            const textColor = feature.color === "primary" ? "text-primary" : "text-accent";
            const badgeBgColor = feature.color === "primary" ? "bg-primary/10" : "bg-accent/10";
            const badgeTextColor = feature.color === "primary" ? "text-primary" : "text-accent";
            const badgeHoverBg = feature.color === "primary" ? "hover:bg-primary/15" : "hover:bg-accent/15";
            
            return (
              <div 
                key={index}
                className="bg-card rounded-[10px] p-8 shadow-sm feature-card border border-border/50"
                data-testid={`feature-card-${index}`}
              >
                <div className={`w-14 h-14 ${bgColor} rounded-[10px] flex items-center justify-center mb-5`}>
                  <Icon className={textColor} size={24} strokeWidth={1.75} />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3">{feature.title}</h3>
                <p className="text-muted-foreground mb-5 leading-relaxed">
                  {feature.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  {feature.tags.map((tag, tagIndex) => (
                    <Badge 
                      key={tagIndex} 
                      variant="secondary" 
                      className={`${badgeBgColor} ${badgeTextColor} ${badgeHoverBg} border-0`}
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
