import React, { useState, useCallback, useEffect } from 'react';
import { Search } from 'lucide-react';
import { MapboxResult } from '@/types/company';
import { useDebounce } from '@/hooks/useDebounce';
import { cn } from '@/lib/utils'; // Assuming you're using shadcn's utility function

const MAPBOX_API_KEY = import.meta.env.VITE_MAPBOX_API_KEY;

interface LocationSearchProps {
  onSelectLocation?: (location: MapboxResult) => void;
  placeholder?: string;
  debounceMs?: number;
  className?: string;
}

const LocationSearch: React.FC<LocationSearchProps> = ({  
  onSelectLocation = () => {},
  placeholder = "Search locations...",
  debounceMs = 300,
  className,
}) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<MapboxResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState<string | null>(null);
  
  const debouncedQuery = useDebounce(query, debounceMs);

  const fetchSuggestions = useCallback(async (searchText: string) => {
    if (!searchText || searchText === selectedPlace) {
      setSuggestions([]);
      return;
    }

    setIsLoading(true);
    try {
      const endpoint = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
        searchText
      )}.json?access_token=${MAPBOX_API_KEY}&types=place&country=IN`;

      const response = await fetch(endpoint);
      const data = await response.json();

      setSuggestions(
        data.features.map((feature: any) => ({
          id: feature.id,
          place_name: feature.place_name,
          coordinates: feature.center,
        }))
      );
    } catch (error) {
      console.error('Error fetching suggestions:', error);
      setSuggestions([]);
    } finally {
      setIsLoading(false);
    }
  }, [selectedPlace]);

  useEffect(() => {
    if (query !== selectedPlace) {
      fetchSuggestions(debouncedQuery);
    }
  }, [debouncedQuery, fetchSuggestions, query, selectedPlace]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setQuery(newValue);

    if (newValue !== selectedPlace) {
      setSelectedPlace(null);
    }
  };

  const handleSelectLocation = (suggestion: MapboxResult) => {
    setQuery(suggestion.place_name);
    setSelectedPlace(suggestion.place_name);
    setSuggestions([]);
    onSelectLocation(suggestion);
  };

  const handleInputFocus = () => {
    if (query === selectedPlace) {
      setSelectedPlace(null);
    }
  };

  return (
    <div className="relative w-full">
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
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

      {suggestions.length > 0 && !selectedPlace && (
        <ul className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg max-h-60 overflow-auto">
          {suggestions.map((suggestion) => (
            <li
              key={suggestion.id}
              onClick={() => handleSelectLocation(suggestion)}
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
            >
              {suggestion.place_name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default LocationSearch;