import { Brain, Eye, Cloud, Globe, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const models = [
  {
    name: "Dhenu2 India 8B",
    size: "8B",
    description: "Most powerful model for comprehensive advisory applications supporting farmers and agri-businesses",
    features: ["Llama 3.1 Based", "95% Accuracy", "4000+ Topics"],
    status: "PRODUCTION",
    statusColor: "primary"
  },
  {
    name: "Dhenu2 India 3B",
    size: "3B",
    description: "Balanced performance for conversational applications requiring knowledge and responsiveness",
    features: ["Llama 3.2 Based", "Optimized Speed", "Lower Latency"],
    status: "BALANCED",
    statusColor: "secondary"
  },
  {
    name: "Dhenu2 India 1B",
    size: "1B",
    description: "Lightweight model for on-device deployment on smartphones and resource-constrained devices",
    features: ["Llama 3.2 Based", "On-Device Ready", "Offline Support"],
    status: "MOBILE",
    statusColor: "accent"
  }
];

const upcomingModels = [
  {
    icon: Eye,
    name: "Dhenu2 Vision",
    description: "Computer vision for disease detection and analysis",
    status: "Coming Soon"
  },
  {
    icon: Cloud,
    name: "Dhenu2 CRA",
    description: "Climate Resilient Agriculture specialist",
    status: "In Development"
  },
  {
    icon: Globe,
    name: "Dhenu2 US",
    description: "Adapted for US agricultural practices",
    status: "Planned"
  }
];

export default function AIModelsSection() {
  return (
    <section id="models" className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 px-4 py-2 bg-accent/10 rounded-full mb-4">
            <Brain className="text-accent" size={16} />
            <span className="text-accent text-sm font-medium">Dhenu AI Models</span>
          </div>
          <h2 className="text-4xl font-bold text-foreground mb-4">
            World's First Agricultural Language Models
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Built on Llama 3.1/3.2, trained on 1.5M+ real conversations covering 4000+ agricultural topics with 95% accuracy
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {models.map((model, index) => (
            <div key={index} className="bg-card rounded-xl p-6 elevation-2 border border-border" data-testid={`model-card-${index}`}>
              <div className="flex items-center justify-between mb-4">
                <Badge variant="secondary" className={`bg-${model.statusColor}/10 text-${model.statusColor}`}>
                  {model.status}
                </Badge>
                <span className="text-2xl font-bold text-foreground">{model.size}</span>
              </div>
              <h3 className="text-xl font-bold text-foreground mb-2">{model.name}</h3>
              <p className="text-sm text-muted-foreground mb-4">
                {model.description}
              </p>
              <div className="space-y-2 mb-4">
                {model.features.map((feature, fIndex) => (
                  <div key={fIndex} className="flex items-center text-sm">
                    <CheckCircle className={`text-${model.statusColor} mr-2`} size={16} />
                    <span className="text-foreground">{feature}</span>
                  </div>
                ))}
              </div>
              <Button className={`w-full bg-${model.statusColor} text-${model.statusColor}-foreground hover:opacity-90 ripple`}>
                View on HuggingFace
              </Button>
            </div>
          ))}
        </div>

        <div className="bg-card rounded-xl p-8 elevation-2 border border-border">
          <h3 className="text-2xl font-bold text-foreground mb-6 text-center">Upcoming Models</h3>
          <div className="grid md:grid-cols-3 gap-6">
            {upcomingModels.map((model, index) => {
              const Icon = model.icon;
              return (
                <div key={index} className="text-center">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Icon className="text-primary" size={28} />
                  </div>
                  <h4 className="font-semibold text-foreground mb-2">{model.name}</h4>
                  <p className="text-sm text-muted-foreground mb-2">{model.description}</p>
                  <Badge variant="secondary">{model.status}</Badge>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
