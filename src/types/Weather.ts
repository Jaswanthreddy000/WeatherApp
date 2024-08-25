export interface WeatherData {
    main: {
      temp: number;
      pressure: number;
      humidity: number;
    };
    weather: {
      description: string;
      main: string;
    }[];
    wind: {
      speed: number;
    };
  }
  
  export interface City {
    name: string;
    country: string;
    timezone: string;
  }
  