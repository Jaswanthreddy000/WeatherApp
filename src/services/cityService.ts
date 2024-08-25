import axios from 'axios';
import { City } from '../types/Weather';

// Define a type for the API record fields
interface GeonameRecord {
  fields: {
    name: string;
    cou_name_en: string;
    timezone: string;
  };
}

// Define a type for the API response
interface ApiResponse {
  records: GeonameRecord[];
}

export const fetchCities = async (page: number = 1): Promise<City[]> => {
  const pageSize = 10000; // Adjust as needed
  const offset = (page - 1) * pageSize;

  try {
    const response = await axios.get<ApiResponse>(
      `https://public.opendatasoft.com/api/records/1.0/search/?dataset=geonames-all-cities-with-a-population-1000&q=&rows=${pageSize}&start=${offset}`
    );

    const cities = response.data.records.map((record: GeonameRecord) => ({
      name: record.fields.name,
      country: record.fields.cou_name_en,
      timezone: record.fields.timezone,
    }));

    // Sort the cities by name in ascending order
    cities.sort((a: City, b: City) => b.name.localeCompare(a.name));

    return cities;
  } catch (error) {
    console.error('Failed to fetch cities:', error);
    return [];
  }
};
