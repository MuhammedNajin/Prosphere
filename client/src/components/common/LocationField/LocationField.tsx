import React, { useState, useCallback, useEffect } from 'react';
import { Search } from 'lucide-react';
import { MapboxResult } from '@/types/company';
import { useDebounce } from '@/hooks/useDebounce';
import { cn } from '@/lib/utils';

const MAPBOX_API_KEY = import.meta.env.VITE_MAPBOX_API_KEY;

// Enhanced interface for detailed location data
interface DetailedLocationResult extends MapboxResult {
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  pincode?: string;
  district?: string;
  region?: string;
  fullAddress?: string;
  properties?: any;
}

interface LocationSearchProps {
  onSelectLocation?: (location: DetailedLocationResult) => void;
  placeholder?: string;
  debounceMs?: number;
  className?: string;
  initialValue?: string; 
}

const LocationSearch: React.FC<LocationSearchProps> = ({  
  onSelectLocation = () => {},
  placeholder = "Search locations...",
  debounceMs = 300,
  className,
  initialValue = '',
}) => {
  const [query, setQuery] = useState(initialValue);
  const [suggestions, setSuggestions] = useState<DetailedLocationResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState<string | null>(initialValue || null);
  const [showSuggestions, setShowSuggestions] = useState(false);
  
  const debouncedQuery = useDebounce(query, debounceMs);

  useEffect(() => {
    if (!MAPBOX_API_KEY) {
      console.error('MAPBOX_API_KEY is not defined. Please check your .env file.');
    }
  }, []);

  // Helper function to extract address components
  const extractAddressComponents = (feature: any): DetailedLocationResult => {
    const context = feature.context || [];
    const properties = feature.properties || {};
    
    // Initialize result object
    const result: DetailedLocationResult = {
      id: feature.id,
      place_name: feature.place_name,
      coordinates: feature.center,
      properties: properties
    };

    // Extract components from context array
    context.forEach((item: any) => {
      const types = item.id.split('.')[0];
      
      switch (types) {
        case 'postcode':
          result.pincode = item.text;
          break;
        case 'district':
          result.district = item.text;
          break;
        case 'place':
          result.city = item.text;
          break;
        case 'region':
          result.state = item.text;
          result.region = item.text;
          break;
        case 'country':
          result.country = item.text;
          break;
      }
    });

    // Extract address from feature text (usually the specific address)
    result.address = feature.text;

    // Create a structured full address
    const addressParts = [
      result.address,
      result.city,
      result.district,
      result.state,
      result.pincode,
      result.country
    ].filter(Boolean);
    
    result.fullAddress = addressParts.join(', ');

    return result;
  };

  const fetchSuggestions = useCallback(async (searchText: string) => {
    if (!searchText || searchText === selectedPlace || !MAPBOX_API_KEY) {
      setSuggestions([]);
      return;
    }

    setIsLoading(true);
    try {
      // Enhanced API call with more place types for better results
      const endpoint = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
        searchText
      )}.json?access_token=${MAPBOX_API_KEY}&types=place,postcode,district,locality,neighborhood,address&country=IN&limit=8`;

      const response = await fetch(endpoint);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      console.log('Mapbox API Response:', data); // Debug log

      if (data.features) {
        const enhancedResults = data.features.map((feature: any) => 
          extractAddressComponents(feature)
        );
        
        setSuggestions(enhancedResults);
        console.log('Enhanced Results:', enhancedResults); // Debug log
      } else {
        setSuggestions([]);
      }
    } catch (error) {
      console.error('Error fetching suggestions:', error);
      setSuggestions([]);
    } finally {
      setIsLoading(false);
    }
  }, [selectedPlace]);

  useEffect(() => {
    if (query !== selectedPlace && query.length > 2) {
      fetchSuggestions(debouncedQuery);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [debouncedQuery, fetchSuggestions, query, selectedPlace]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setQuery(newValue);
    setShowSuggestions(true);

    if (newValue !== selectedPlace) {
      setSelectedPlace(null);
    }
  };

  const handleSelectLocation = (suggestion: DetailedLocationResult) => {
    setQuery(suggestion.place_name);
    setSelectedPlace(suggestion.place_name);
    setSuggestions([]);
    setShowSuggestions(false);
    
    // Log the complete data being passed
    console.log('Selected Location Data:', {
      placeName: suggestion.place_name,
      coordinates: suggestion.coordinates,
      address: suggestion.address,
      city: suggestion.city,
      state: suggestion.state,
      pincode: suggestion.pincode,
      district: suggestion.district,
      country: suggestion.country,
      fullAddress: suggestion.fullAddress
    });
    
    onSelectLocation(suggestion);
  };

  const handleInputFocus = () => {
    if (query.length > 2) {
      setShowSuggestions(true);
      if (suggestions.length === 0) {
        fetchSuggestions(query);
      }
    }
  };

  const handleInputBlur = () => {
    setTimeout(() => {
      setShowSuggestions(false);
    }, 200);
  };

  return (
    <div className="relative w-full">
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
          placeholder={placeholder}
          className={cn(
            "w-full flex items-center justify-between p-2 px-4 py-2 pr-10 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500",
            className
          )}
        />
        <div className="absolute right-3 top-2.5 text-gray-400">
          {isLoading ? (
            <div className="animate-spin h-5 w-5 border-2 border-blue-500 rounded-full border-t-transparent" />
          ) : (
            <Search size={20} />
          )}
        </div>
      </div>

      {suggestions.length > 0 && showSuggestions && (
        <ul className="absolute z-50 w-full mt-1 bg-white border rounded-md shadow-lg max-h-60 overflow-auto">
          {suggestions.map((suggestion) => (
            <li
              key={suggestion.id}
              onMouseDown={() => handleSelectLocation(suggestion)}
              className="px-4 py-3 hover:bg-gray-100 cursor-pointer border-b last:border-b-0"
            >
              <div className="flex flex-col">
                <span className="font-medium text-gray-900">
                  {suggestion.place_name}
                </span>
                {suggestion.pincode && (
                  <span className="text-xs text-blue-600 mt-1">
                    PIN: {suggestion.pincode}
                  </span>
                )}
                {suggestion.fullAddress && suggestion.fullAddress !== suggestion.place_name && (
                  <span className="text-xs text-gray-500 mt-1 truncate">
                    {suggestion.fullAddress}
                  </span>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* Show message if no API key */}
      {!MAPBOX_API_KEY && query.length > 2 && (
        <div className="absolute z-50 w-full mt-1 bg-red-50 border border-red-200 rounded-md p-2 text-red-600 text-sm">
          Mapbox API key not configured
        </div>
      )}
      
      {/* Show no results message */}
      {query.length > 2 && suggestions.length === 0 && !isLoading && showSuggestions && MAPBOX_API_KEY && (
        <div className="absolute z-50 w-full mt-1 bg-gray-50 border rounded-md p-2 text-gray-600 text-sm">
          No locations found for "{query}"
        </div>
      )}
    </div>
  );
};

export default LocationSearch;