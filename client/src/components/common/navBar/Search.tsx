import React, { useState, useRef, useEffect } from "react";
import { Search } from "lucide-react";
import { ProfileApi } from "@/api/Profile.api";
import { useNavigate } from "react-router-dom";

interface SearchSuggestion {
  id: string;
  text: string;
  type?: string;
  subtext?: string;
  icon?: React.ReactNode;
  avatar?: string
}

const useDebounce = (value: string, delay: number) => {
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

const SearchWithSuggestions = () => {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const [urls, setUrls] = useState<Record<string, string>>({});
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const debouncedQuery = useDebounce(query, 300);

  const generateUrl = async (keys: string[]) => {
     if(!Array.isArray(keys)) {
        return null
     }
      const response = await ProfileApi.getFiles(keys);
      console.log("response", response);
     if(Array.isArray(response)) {
      const map: Record<string, string> = {}; 
      for(let i = 0; i < response.length; i++) {
          map[keys[i]] = response[i];
      }
      setUrls(map);
     }
  }

  const formatUserResults = (users: any[]): SearchSuggestion[] => {
    if (!users || users.length === 0) return [];
    const keys = [] as string[];
     const results =  users.map((user) => {

      if (user.profileImageKey) {
        keys.push(user.profileImageKey);
      }

      return {
        id: user._id,
        text: user.username,
        type: user.jobRole || "User",
        subtext: user.email,
        avatar: user.profileImageKey,
      };
    });
    generateUrl(keys)
    return results;
  };

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (debouncedQuery.length < 2) {
        setSuggestions([]);
        return;
      }

      setIsLoading(true);
      try {
        const results = await ProfileApi.searchUser(debouncedQuery);
        const formattedResults = formatUserResults(results);
        setSuggestions(formattedResults);
        setShowAll(false);
      } catch (error) {
        console.error("Error fetching search results:", error);
        setSuggestions([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSuggestions();
  }, [debouncedQuery]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setShowAll(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const displaySuggestions = showAll ? suggestions : suggestions.slice(0, 5);

  const handleSeeAllClick = () => {
    setShowAll(true);
  };

  return (
    <div className="relative w-full max-w-xl" ref={dropdownRef}>
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-orange-500"
          placeholder="Search users..."
        />
        <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
        {isLoading && (
          <div className="absolute right-3 top-2.5">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-orange-500"></div>
          </div>
        )}
      </div>

      {isOpen && (suggestions.length > 0 || isLoading) && (
        <div
          className={`absolute w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-auto ${
            showAll && suggestions.length > 5 ? "max-h-80 overflow-y-auto" : ""
          }`}
        >
          {isLoading &&
          debouncedQuery.length >= 2 &&
          suggestions.length === 0 ? (
            <div className="px-4 py-3 text-sm text-gray-500">
              Loading results...
            </div>
          ) : suggestions.length === 0 && debouncedQuery.length >= 2 ? (
            <div className="px-4 py-3 text-sm text-gray-500">
              No results found
            </div>
          ) : (
            <>
              <div
                className={
                  showAll && suggestions.length > 5 ? "overflow-y-auto" : ""
                }
              >
                {displaySuggestions.map((suggestion) => (
                  <div
                    key={suggestion.id}
                    className="flex items-center px-4 py-3 hover:bg-gray-50 cursor-pointer"
                    onClick={() => {
                      setQuery(suggestion.text);
                      setIsOpen(false);
                      setShowAll(false);
                      console.log("_id", suggestion.id);
                      navigate(`/profile/veiw/${suggestion.id}`);
                    }}
                  >
                    <div className="flex-shrink-0 w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                      {suggestion.icon || (
                        <Search className="w-4 h-4 text-gray-500" />
                      )}
                    </div>
                    <div className="ml-3 flex-grow">
                      <div className="text-sm font-medium text-gray-900">
                        {suggestion.text}
                      </div>
                      {suggestion.subtext && (
                        <div className="text-xs text-gray-500">
                          {suggestion.type && (
                            <span className="mr-1">{suggestion.type} • </span>
                          )}
                          {suggestion.subtext}
                        </div>
                      )}
                    </div>
                    <div>
                       <div className="w-8 h-8 rounded-full">
                       {
                        suggestion.avatar && (
                           <img src={urls[suggestion.avatar]} className="object-cover rounded-full"/>
                        )
                      }
                       </div>
                    </div>
                  </div>
                ))}
              </div>
              {suggestions.length > 5 && !showAll && (
                <div
                  className="px-4 py-2 text-sm text-orange-600 hover:bg-gray-50 cursor-pointer border-t"
                  onClick={handleSeeAllClick}
                >
                  See all {suggestions.length} results
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchWithSuggestions;
