import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface CropSuggestion {
  cropName: string;
  cropNameHindi?: string;
  profitPotential: number; // Percentage
  marketDemand: 'High' | 'Medium' | 'Low';
  marketDemandHindi?: string;
  seasonality: string;
  seasonalityHindi?: string;
  investmentRequired: number; // In rupees per acre
}

interface CropSuggestionProps {
  mandiData?: any[];
  latitude?: number;
  longitude?: number;
  language?: 'en' | 'hi';
  onLanguageChange?: () => void;
}

// Mapping of crop names to Hindi
const cropNameToHindi: Record<string, string> = {
  'Rice': 'चावल',
  'Wheat': 'गेहूं',
  'Maize': 'मक्का',
  'Soybean': 'सोयाबीन',
  'Cotton': 'कपास',
  'Sugarcane': 'गन्ना',
  'Potato': 'आलू',
  'Onion': 'प्याज',
  'Tomato': 'टमाटर',
  'Mustard': 'सरसों',
  'Gram': 'चना',
  'Groundnut': 'मूंगफली'
};

// Mapping of market demand to Hindi
const demandToHindi: Record<string, string> = {
  'High': 'उच्च',
  'Medium': 'मध्यम',
  'Low': 'कम'
};

// Mapping of seasons to Hindi
const seasonToHindi: Record<string, string> = {
  'Kharif': 'खरीफ',
  'Rabi': 'रबी',
  'Zaid': 'जायद',
  'Year-round': 'पूरे वर्ष'
};

const CropSuggestion: React.FC<CropSuggestionProps> = ({ latitude, longitude, language: propLanguage = 'en', onLanguageChange }) => {
  const [suggestions, setSuggestions] = useState<CropSuggestion[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [language, setLanguage] = useState<'en' | 'hi'>(propLanguage);
  const [soilType, setSoilType] = useState<string | null>(null);
  const [climate, setClimate] = useState<string | null>(null);

  // Function to get soil type and climate data based on location
  const getLocationData = async () => {
    if (!latitude || !longitude) return;
    
    try {
      // In a real implementation, you would use an API to get soil and climate data
      // For now, we'll use a reverse geocoding API to get the region
      const response = await axios.get(
        `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=74c89b3be64946ac96d777c159278235`
      );
      
      const results = response.data.results;
      if (results && results.length > 0) {
        const addressComponents = results[0].components;
        const state = addressComponents.state;
        
        // Determine soil type and climate based on state
        // This is a simplified approach - in reality, you would use more precise data
        if (state === 'Punjab' || state === 'Haryana' || state === 'Uttar Pradesh') {
          setSoilType('Alluvial');
          setClimate('Sub-tropical');
        } else if (state === 'Maharashtra' || state === 'Gujarat') {
          setSoilType('Black');
          setClimate('Semi-arid');
        } else if (state === 'Tamil Nadu' || state === 'Kerala') {
          setSoilType('Red and Laterite');
          setClimate('Tropical');
        } else if (state === 'Rajasthan') {
          setSoilType('Desert');
          setClimate('Arid');
        } else {
          setSoilType('Mixed');
          setClimate('Varied');
        }
      }
    } catch (err) {
      console.error('Error getting location data:', err);
      setSoilType('Unknown');
      setClimate('Unknown');
    }
  };

  // Function to generate crop suggestions based on market data, location, soil type and climate
  const generateSuggestions = async () => {
    try {
      setLoading(true);
      
      // Wait for soil and climate data
      await getLocationData();
      
      // In a real implementation, this would use actual market data, soil type, and climate
      // to generate personalized suggestions
      
      // For now, we'll create realistic suggestions based on the soil type and climate
      let suggestedCrops: CropSuggestion[] = [];
      
      if (soilType === 'Alluvial') {
        suggestedCrops = [
          {
            cropName: 'Rice',
            cropNameHindi: cropNameToHindi['Rice'],
            profitPotential: 22,
            marketDemand: 'High',
            marketDemandHindi: demandToHindi['High'],
            seasonality: 'Kharif (June-October)',
            seasonalityHindi: `${seasonToHindi['Kharif']} (जून-अक्टूबर)`,
            investmentRequired: 28000
          },
          {
            cropName: 'Wheat',
            cropNameHindi: cropNameToHindi['Wheat'],
            profitPotential: 18,
            marketDemand: 'Medium',
            marketDemandHindi: demandToHindi['Medium'],
            seasonality: 'Rabi (November-April)',
            seasonalityHindi: `${seasonToHindi['Rabi']} (नवंबर-अप्रैल)`,
            investmentRequired: 22000
          },
          {
            cropName: 'Sugarcane',
            cropNameHindi: cropNameToHindi['Sugarcane'],
            profitPotential: 25,
            marketDemand: 'Medium',
            marketDemandHindi: demandToHindi['Medium'],
            seasonality: 'Year-round',
            seasonalityHindi: seasonToHindi['Year-round'],
            investmentRequired: 35000
          }
        ];
      } else if (soilType === 'Black') {
        suggestedCrops = [
          {
            cropName: 'Cotton',
            cropNameHindi: cropNameToHindi['Cotton'],
            profitPotential: 30,
            marketDemand: 'High',
            marketDemandHindi: demandToHindi['High'],
            seasonality: 'Kharif (May-November)',
            seasonalityHindi: `${seasonToHindi['Kharif']} (मई-नवंबर)`,
            investmentRequired: 35000
          },
          {
            cropName: 'Soybean',
            cropNameHindi: cropNameToHindi['Soybean'],
            profitPotential: 25,
            marketDemand: 'High',
            marketDemandHindi: demandToHindi['High'],
            seasonality: 'Kharif (June-October)',
            seasonalityHindi: `${seasonToHindi['Kharif']} (जून-अक्टूबर)`,
            investmentRequired: 25000
          },
          {
            cropName: 'Gram',
            cropNameHindi: cropNameToHindi['Gram'],
            profitPotential: 20,
            marketDemand: 'Medium',
            marketDemandHindi: demandToHindi['Medium'],
            seasonality: 'Rabi (October-March)',
            seasonalityHindi: `${seasonToHindi['Rabi']} (अक्टूबर-मार्च)`,
            investmentRequired: 20000
          }
        ];
      } else if (soilType === 'Red and Laterite') {
        suggestedCrops = [
          {
            cropName: 'Groundnut',
            cropNameHindi: cropNameToHindi['Groundnut'],
            profitPotential: 28,
            marketDemand: 'Medium',
            marketDemandHindi: demandToHindi['Medium'],
            seasonality: 'Kharif (June-September)',
            seasonalityHindi: `${seasonToHindi['Kharif']} (जून-सितंबर)`,
            investmentRequired: 30000
          },
          {
            cropName: 'Rice',
            cropNameHindi: cropNameToHindi['Rice'],
            profitPotential: 20,
            marketDemand: 'High',
            marketDemandHindi: demandToHindi['High'],
            seasonality: 'Kharif (June-October)',
            seasonalityHindi: `${seasonToHindi['Kharif']} (जून-अक्टूबर)`,
            investmentRequired: 28000
          },
          {
            cropName: 'Maize',
            cropNameHindi: cropNameToHindi['Maize'],
            profitPotential: 22,
            marketDemand: 'Medium',
            marketDemandHindi: demandToHindi['Medium'],
            seasonality: 'Kharif (June-September)',
            seasonalityHindi: `${seasonToHindi['Kharif']} (जून-सितंबर)`,
            investmentRequired: 24000
          }
        ];
      } else {
        // Default suggestions if soil type is unknown or desert
        suggestedCrops = [
          {
            cropName: 'Wheat',
            cropNameHindi: cropNameToHindi['Wheat'],
            profitPotential: 18,
            marketDemand: 'Medium',
            marketDemandHindi: demandToHindi['Medium'],
            seasonality: 'Rabi (November-April)',
            seasonalityHindi: `${seasonToHindi['Rabi']} (नवंबर-अप्रैल)`,
            investmentRequired: 22000
          },
          {
            cropName: 'Mustard',
            cropNameHindi: cropNameToHindi['Mustard'],
            profitPotential: 24,
            marketDemand: 'Medium',
            marketDemandHindi: demandToHindi['Medium'],
            seasonality: 'Rabi (October-March)',
            seasonalityHindi: `${seasonToHindi['Rabi']} (अक्टूबर-मार्च)`,
            investmentRequired: 18000
          },
          {
            cropName: 'Maize',
            cropNameHindi: cropNameToHindi['Maize'],
            profitPotential: 20,
            marketDemand: 'Medium',
            marketDemandHindi: demandToHindi['Medium'],
            seasonality: 'Kharif (June-September)',
            seasonalityHindi: `${seasonToHindi['Kharif']} (जून-सितंबर)`,
            investmentRequired: 24000
          }
        ];
      }
      
      setSuggestions(suggestedCrops);
      setError(null);
    } catch (err) {
      setError(language === 'en' ? 
        'Failed to generate crop suggestions.' : 
        'फसल सुझाव उत्पन्न करने में विफल।');
    } finally {
      setLoading(false);
    }
  };

  // Generate suggestions on component mount
  useEffect(() => {
    generateSuggestions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [latitude, longitude]);

  // Function to toggle language
  const toggleLanguage = () => {
    if (onLanguageChange) {
      onLanguageChange();
    } else {
      setLanguage(language === 'en' ? 'hi' : 'en');
    }
  };

  // Update language when prop changes
  useEffect(() => {
    if (propLanguage) {
      setLanguage(propLanguage);
    }
  }, [propLanguage]);

  // Function to get market demand text with appropriate color
  const getMarketDemandClass = (demand: 'High' | 'Medium' | 'Low') => {
    switch (demand) {
      case 'High':
        return 'text-green-600 dark:text-green-400';
      case 'Medium':
        return 'text-yellow-600 dark:text-yellow-400';
      case 'Low':
        return 'text-red-600 dark:text-red-400';
      default:
        return '';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">
          {language === 'en' ? 'Recommended Crops to Sell' : 'बेचने के लिए अनुशंसित फसलें'}
        </h2>
      </div>

      {/* Location-based info */}
      {soilType && climate && (
        <div className="mb-4 p-3 bg-green-50 rounded-md">
          <p className="text-sm text-gray-700">
            {language === 'en' 
              ? `Recommendations based on your location: ${soilType} soil type, ${climate} climate`
              : `आपके स्थान के आधार पर अनुशंसाएँ: ${soilType} मिट्टी प्रकार, ${climate} जलवायु`
            }
          </p>
        </div>
      )}
      
      {/* Loading state */}
      {loading && (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">
            {language === 'en' 
              ? 'Analyzing market data for recommendations...'
              : 'अनुशंसाओं के लिए बाजार डेटा का विश्लेषण किया जा रहा है...'
            }
          </p>
        </div>
      )}

      {/* Error message */}
      {error && !loading && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <p>{error}</p>
        </div>
      )}

      {/* Crop suggestions */}
      {suggestions.length > 0 && !loading && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {suggestions.map((crop, index) => (
            <div 
              key={index} 
              className="bg-green-50 rounded-lg p-6 border-l-4 border-green-500"
            >
              <h3 className="text-xl font-semibold mb-3">
                {language === 'en' ? crop.cropName : crop.cropNameHindi || crop.cropName}
              </h3>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">
                    {language === 'en' ? 'Profit Potential:' : 'लाभ क्षमता:'}
                  </span>
                  <span className="font-medium text-green-600">{crop.profitPotential}%</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">
                    {language === 'en' ? 'Market Demand:' : 'बाजार मांग:'}
                  </span>
                  <span className={`font-medium ${getMarketDemandClass(crop.marketDemand)}`}>
                    {language === 'en' ? crop.marketDemand : crop.marketDemandHindi}
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">
                    {language === 'en' ? 'Season:' : 'मौसम:'}
                  </span>
                  <span className="font-medium">
                    {language === 'en' ? crop.seasonality : crop.seasonalityHindi}
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">
                    {language === 'en' ? 'Investment:' : 'निवेश:'}
                  </span>
                  <span className="font-medium">₹{crop.investmentRequired.toLocaleString()}/acre</span>
                </div>
              </div>
              
              <button className="w-full mt-4 bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded transition">
                {language === 'en' ? 'View Details' : 'विवरण देखें'}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CropSuggestion;