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
    color: "secondary"
  },
  {
    icon: Camera,
    title: "Image Analysis",
    description: "Upload photos for instant AI-powered disease detection and health assessment of crops and livestock.",
    tags: ["Disease ID", "AI Vision", "Real-time"],
    color: "accent"
  },
  {
    icon: Mic,
    title: "Voice Input",
    description: "Hands-free interaction with voice-to-text in multiple languages for easy field use.",
    tags: ["20+ Languages", "Hands-free"],
    color: "primary"
  },
  {
    icon: ShoppingBag,
    title: "Market Intelligence",
    description: "Real-time market prices, demand forecasts, and selling strategies to maximize profits.",
    tags: ["Prices", "Trends", "Forecast"],
    color: "secondary"
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
    <section id="features" className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-foreground mb-4">Comprehensive Agricultural Solutions</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            From crop management to livestock care, access expert AI guidance in your language
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div 
                key={index}
                className="bg-card rounded-xl p-6 elevation-2 feature-card border border-border"
                data-testid={`feature-card-${index}`}
              >
                <div className={`w-12 h-12 bg-${feature.color}/10 rounded-lg flex items-center justify-center mb-4`}>
                  <Icon className={`text-${feature.color}`} size={24} />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">{feature.title}</h3>
                <p className="text-muted-foreground mb-4">
                  {feature.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  {feature.tags.map((tag, tagIndex) => (
                    <Badge 
                      key={tagIndex} 
                      variant="secondary" 
                      className={`bg-${feature.color}/10 text-${feature.color} hover:bg-${feature.color}/20`}
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
