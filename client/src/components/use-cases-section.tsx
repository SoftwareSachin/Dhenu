import { Badge } from "@/components/ui/badge";

const useCases = [
  {
    title: "For Farmers",
    description: "Get personalized guidance in your language with voice support, image analysis, and offline mode for remote areas",
    image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
    alt: "Agricultural field with diverse crops",
    tags: ["Voice Support", "Offline Mode", "Free Access"],
    tagColor: "primary"
  },
  {
    title: "For Enterprises",
    description: "Deploy AI-powered features across sales, support, and operations with SAP/Salesforce integrations",
    image: "https://images.unsplash.com/photo-1605000797499-95a51c5269ae?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
    alt: "Modern agribusiness facility",
    tags: ["Sales Copilot", "API Access", "Custom Models"],
    tagColor: "secondary"
  },
  {
    title: "For Livestock",
    description: "Specialized advisory for cattle, buffalo, goats covering health monitoring, breeding, and disease management",
    image: "https://images.unsplash.com/photo-1560493676-04071c5f467b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
    alt: "Veterinarian examining cattle",
    tags: ["Health Tracking", "Disease Alert", "Nutrition Plans"],
    tagColor: "accent"
  },
  {
    title: "For Government",
    description: "Support extension services and farmer education programs with AI-powered knowledge dissemination",
    image: "https://images.unsplash.com/photo-1574943320219-553eb213f72d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
    alt: "Agricultural extension services",
    tags: ["Extension Services", "Policy Support", "Mass Reach"],
    tagColor: "primary"
  }
];

export default function UseCasesSection() {
  return (
    <section className="py-20 bg-card">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-foreground mb-4">
            Transforming Agriculture Across Use Cases
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            From farmers to enterprises, our AI platform serves diverse agricultural needs
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {useCases.map((useCase, index) => (
            <div key={index} className="flex items-start space-x-4" data-testid={`use-case-${index}`}>
              <div className="flex-shrink-0">
                <img 
                  src={useCase.image} 
                  alt={useCase.alt}
                  className="w-full h-48 object-cover rounded-lg elevation-2" 
                />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-foreground mb-2">{useCase.title}</h3>
                <p className="text-muted-foreground mb-3">
                  {useCase.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  {useCase.tags.map((tag, tagIndex) => (
                    <Badge 
                      key={tagIndex} 
                      variant="secondary"
                      className={`bg-${useCase.tagColor}/10 text-${useCase.tagColor}`}
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
