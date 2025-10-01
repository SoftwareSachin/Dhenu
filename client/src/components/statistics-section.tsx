export default function StatisticsSection() {
  const stats = [
    { value: "100K+", label: "Active Farmers" },
    { value: "1.5M+", label: "Conversations" },
    { value: "4000+", label: "Topics Covered" },
    { value: "95%", label: "Accuracy Rate" }
  ];

  return (
    <section className="py-24 bg-primary text-primary-foreground">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Trusted by Agricultural Community</h2>
          <p className="text-lg md:text-xl text-primary-foreground/90 font-light">Empowering farmers with AI-driven insights</p>
        </div>

        <div className="grid md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div 
              key={index}
              className="text-center p-8 bg-white/10 backdrop-blur-md rounded-[10px] border border-white/10 transition-all duration-200 hover:bg-white/15"
              data-testid={`stat-card-${index}`}
            >
              <div className="text-5xl md:text-6xl font-bold mb-2">{stat.value}</div>
              <div className="text-base text-primary-foreground/80 font-medium">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
