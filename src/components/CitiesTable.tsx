import React, { useState, useEffect, useCallback } from 'react';
import { fetchCities } from '../services/cityService';
import { City } from '../types/Weather';
import { Link } from 'react-router-dom';
import AutoSuggest from "react-autosuggest";
import bgimage from "./images/websitebg.jpg";

const CitiesTable: React.FC = () => {
  const [cities, setCities] = useState<City[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [suggestions, setSuggestions] = useState<City[]>([]);
  const [filteredCities, setFilteredCities] = useState<City[]>([]);
  const [page, setPage] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [selectedCountry, setSelectedCountry] = useState<string>('');
  const [selectedTimezone, setSelectedTimezone] = useState<string>('');
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: string } | null>(null);

  useEffect(() => {
    const loadCities = async () => {
      if (loading) return;
      setLoading(true);
      try {
        const citiesData = await fetchCities(page);
        if (citiesData.length === 0) {
          setHasMore(false);
        } else {
          setCities(prevCities => [...prevCities, ...citiesData]);
        }
      } catch (error) {
        console.error('Failed to fetch cities:', error);
      }
      setLoading(false);
    };
    loadCities();
  }, [page]);

  useEffect(() => {
    let filtered = cities.filter(city =>
      city.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (selectedCountry === '' || city.country === selectedCountry) &&
      (selectedTimezone === '' || city.timezone === selectedTimezone)
    );

    if (sortConfig !== null) {
      filtered = filtered.sort((a, b) => {
        const aValue = a[sortConfig.key as keyof City]?.toString().toLowerCase() || '';
        const bValue = b[sortConfig.key as keyof City]?.toString().toLowerCase() || '';
        if (aValue < bValue) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }

    // Remove duplicates after sorting
    filtered = Array.from(new Map(filtered.map(city => [city.name.toLowerCase(), city])).values());

    setFilteredCities(filtered);
  }, [cities, searchTerm, selectedCountry, selectedTimezone, sortConfig]);

  const handleScroll = useCallback(() => {
    if (window.innerHeight + document.documentElement.scrollTop === document.documentElement.offsetHeight) {
      if (hasMore && !loading) {
        setPage(prevPage => prevPage + 1);
      }
    }
  }, [hasMore, loading]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  const getSuggestions = async (value: string) => {
    const inputValue = value.trim().toLowerCase();
    if (inputValue.length === 0) {
      return [];
    }

    const filtered = await fetchCities(1);
    const uniqueCities = Array.from(new Map(filtered.map(city => [city.name.toLowerCase(), city])).values());
    return uniqueCities.filter(
      city => city.name.toLowerCase().startsWith(inputValue)
    );
  };

  const onSuggestionsFetchRequested = async ({ value }: { value: string }) => {
    const suggestions = await getSuggestions(value);
    setSuggestions(suggestions);
  };

  const onSuggestionsClearRequested = () => {
    setSuggestions([]);
  };

  const uniqueValues = (array: string[]) => Array.from(new Set(array));

  const countries = uniqueValues(cities.map(city => city.country));
  const timezones = uniqueValues(cities.map(city => city.timezone));

  const requestSort = (key: string) => {
    let direction = 'ascending';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const getSortSymbol = (key: string) => {
    if (!sortConfig) return '⇅';
    return sortConfig.key === key
      ? sortConfig.direction === 'ascending'
        ? '▲'
        : '▼'
      : '⇅';
  };

  return (
    <div 
      className="p-6 min-h-screen bg-cover bg-center"
      style={{ backgroundImage: `url(${bgimage})` }}
    >
      <div className="flex flex-col sm:flex-row sm:justify-between mb-4 space-y-4 sm:space-y-0 sm:space-x-4 relative">
        <div className="relative">
          <AutoSuggest
            suggestions={suggestions}
            onSuggestionsFetchRequested={onSuggestionsFetchRequested}
            onSuggestionsClearRequested={onSuggestionsClearRequested}
            getSuggestionValue={(suggestion) => suggestion.name}
            renderSuggestion={(suggestion) => <div>{suggestion.name}</div>}
            inputProps={{
              placeholder: 'Search cities...',
              value: searchTerm,
              onChange: (_event, { newValue }: { newValue: string }) => {
                setSearchTerm(newValue);
              }
            }}
            theme={{
              input: 'w-full p-2 border rounded shadow focus:outline-none focus:ring focus:border-blue-300',
              suggestionsContainer: 'absolute z-10 bg-white border border-gray-300 rounded shadow mt-1',
              suggestion: 'p-2 hover:bg-blue-200 cursor-pointer',
              suggestionHighlighted: 'bg-blue-100'
            }}
          />
        </div>

        <select
          value={selectedCountry}
          onChange={(e) => setSelectedCountry(e.target.value)}
          className="w-full sm:w-auto p-2 border rounded shadow focus:outline-none focus:ring focus:border-blue-300"
        >
          <option value="">All Countries</option>
          {countries.map(country => (
            <option key={country} value={country}>{country}</option>
          ))}
        </select>

        <select
          value={selectedTimezone}
          onChange={(e) => setSelectedTimezone(e.target.value)}
          className="w-full sm:w-auto p-2 border rounded shadow focus:outline-none focus:ring focus:border-blue-300"
        >
          <option value="">All Timezones</option>
          {timezones.map(timezone => (
            <option key={timezone} value={timezone}>{timezone}</option>
          ))}
        </select>
      </div>

      <table className="min-w-full bg-white bg-opacity-70 border border-gray-200 rounded-lg mt-4">
        <thead>
          <tr>
            <th
              className="py-2 px-4 border-2 border-gray-800 text-left cursor-pointer"
              onClick={() => requestSort('name')}
            >
              City Name {getSortSymbol('name')}
            </th>
            <th
              className="py-2 px-4 border-2 border-gray-800 text-left cursor-pointer"
              onClick={() => requestSort('country')}
            >
              Country {getSortSymbol('country')}
            </th>
            <th
              className="py-2 px-4 border-2 border-gray-800 text-left cursor-pointer"
              onClick={() => requestSort('timezone')}
            >
              Timezone {getSortSymbol('timezone')}
            </th>
          </tr>
        </thead>
        <tbody>
          {filteredCities.map((city, index) => (
            <tr key={index} className="hover:bg-gray-800 hover:text-white">
              <td className="py-2 px-4 border-2 border-gray-600">
                <Link 
                  to={`/weather/${city.name}`} 
                  onClick={(e) => {
                    if (e.ctrlKey || e.metaKey || e.button === 1) {
                      e.preventDefault();
                      window.open(`/weather/${city.name}`, '_blank');
                    }
                  }}
                >
                  {city.name}
                </Link>
              </td>
              <td className="py-2 px-4 border-2 border-gray-600">{city.country}</td>
              <td className="py-2 px-4 border-2 border-gray-600">{city.timezone}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {loading && <div>Loading...</div>}
      {!hasMore && <div>No more cities to load.</div>}
    </div>
  );
};

export default CitiesTable;
