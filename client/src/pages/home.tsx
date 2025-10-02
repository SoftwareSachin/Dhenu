import Header from "@/components/header";
import Footer from "@/components/footer";
import HeroSection from "@/components/hero-section";
import FeaturesGrid from "@/components/features-grid";
import ChatInterface from "@/components/chat-interface";
import AIModelsSection from "@/components/ai-models-section";
import UseCasesSection from "@/components/use-cases-section";
import StatisticsSection from "@/components/statistics-section";
import CTASection from "@/components/cta-section";
import WeatherForecast from "@/components/weather-forecast";
import MandiPrices from "@/components/mandi-prices";
import CropSuggestion from "@/components/crop-suggestion";
import { useState, useEffect } from "react";

export default function Home() {
  const [userLocation, setUserLocation] = useState<{lat: number; lng: number} | null>(null);
  const [language, setLanguage] = useState<'en' | 'hi'>('en');

  // Get user location once on component mount
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ lat: latitude, lng: longitude });
        },
        (err) => {
          console.error("Error getting location:", err);
          // Default to a location in India
          setUserLocation({ lat: 28.6139, lng: 77.2090 }); // New Delhi coordinates
        }
      );
    }
  }, []);

  // Function to toggle language
  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'hi' : 'en');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <HeroSection />
        <WeatherForecast />
        
        {/* Language toggle button */}
        <div className="container mx-auto px-4 mb-4 flex justify-end">
          <button
            onClick={toggleLanguage}
            className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M7 2a1 1 0 011 1v1h3a1 1 0 110 2H9.578a18.87 18.87 0 01-1.724 4.78c.29.354.596.696.914 1.026a1 1 0 11-1.44 1.389 16.88 16.88 0 01-.97-1.129 12.28 12.28 0 01-3.11 3.11 1 1 0 01-1.097-1.67 10.28 10.28 0 002.855-2.855 14.25 14.25 0 01-1.125-.968 1 1 0 111.389-1.44c.329.318.67.623 1.022.913a18.89 18.89 0 01-1.276-3.744H3a1 1 0 110-2h3V3a1 1 0 011-1zm6 6a1 1 0 01.894.553l2.991 5.982a.869.869 0 01.02.037l.99 1.98a1 1 0 11-1.79.895L15.383 16h-4.764l-.724 1.447a1 1 0 11-1.788-.894l.99-1.98.019-.038 2.99-5.982A1 1 0 0113 8zm-1.382 6h2.764L13 11.236 11.618 14z" clipRule="evenodd" />
            </svg>
            {language === 'en' ? 'हिंदी में देखें' : 'View in English'}
          </button>
        </div>
        
        <MandiPrices 
          latitude={userLocation?.lat} 
          longitude={userLocation?.lng}
          language={language}
          onLanguageChange={toggleLanguage}
        />
        <CropSuggestion 
          latitude={userLocation?.lat} 
          longitude={userLocation?.lng}
          language={language}
          onLanguageChange={toggleLanguage}
        />
        <FeaturesGrid />
        <ChatInterface />
        <AIModelsSection />
        <UseCasesSection />
        <StatisticsSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}
