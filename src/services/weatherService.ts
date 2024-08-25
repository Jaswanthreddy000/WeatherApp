import axios from 'axios';
import { WeatherData } from '../types/Weather';

const API_KEY = 'b25a6253be0bee6a2c6182f764dd1bda';

export const fetchWeather = async (city: string): Promise<WeatherData> => {
  try {
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
    );
    
    if (response.data.cod !== 200) {
      throw new Error(`City not found`);
    }

    return response.data;
  } catch (error) {
    throw new Error(`City not available in weather API. Please select another city.`);
  }
};
