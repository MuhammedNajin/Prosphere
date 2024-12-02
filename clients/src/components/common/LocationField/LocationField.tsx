import React, { useState, useCallback, useEffect } from 'react';
import { Search } from 'lucide-react';
import { MapboxResult } from '@/types/company';

// Custom debounce hook
const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
};

const LocationSearch = ({  
  onSelectLocation = (location: MapboxResult) => {},
  placeholder = "Search locations...",
  debounceMs = 300 
}) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  
  const debouncedQuery = useDebounce(query, debounceMs);

  const fetchSuggestions = useCallback(async (searchText) => {
    if (!searchText) {
      setSuggestions([]);
      return;
    }

    setIsLoading(true);
    try {
      const endpoint = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
        searchText
      )}.json?access_token=${"pk.eyJ1IjoiaXJmYW4zNzQiLCJhIjoiY2xwZmlqNzVyMWRuMDJpbmszdGszazMwaCJ9.7wdXsKdpOXmDR9l_ISdIqA"}&types=place&country=IN`;

      const response = await fetch(endpoint);
      const data = await response.json();

      setSuggestions(
        data.features.map(feature => ({
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
  }, []);

  // Effect to trigger API call when debounced query changes
  useEffect(() => {
    fetchSuggestions(debouncedQuery);
  }, [debouncedQuery, fetchSuggestions]);

  const handleInputChange = (e) => {
    setQuery(e.target.value);
  };

  const handleSelectLocation = (suggestion) => {
    setQuery(suggestion.place_name);
    setSuggestions([]);
    console.log("seggestios", suggestion)
    onSelectLocation(suggestion);
  };

  return (
    <div className="relative w-full ">
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={handleInputChange}
          placeholder={placeholder}
          className="w-full flex items-center justify-between p-2 px-4 py-2 pr-10 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <div className="absolute right-3 top-2.5 text-gray-400">
          {isLoading ? (
            <div className="animate-spin h-5 w-5 border-2 border-blue-500 rounded-full border-t-transparent" />
          ) : (
            <Search size={20} />
          )}
        </div>
      </div>

      {suggestions.length > 0 && (
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