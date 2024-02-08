import { StyledMainWeatherData } from "./styles/MainWeatherData.styled"
import axios, { AxiosResponse } from "axios"
import { useEffect, useState, ChangeEvent, FormEvent } from "react"
import useGeolocation, { Coordinates } from "../hooks/useGeolocation"
//import getIcon from "../getIcon"
interface WeatherData {
  name: string;
  main: {
    temp: number;
    feels_like: number;
    humidity: number;
  };
  weather: {
    description: string;
    icon: string;
  }[];
  wind: {
    speed: number;
  };
}

interface MainWeatherDataProps {
  city: string;
  setCity: (city: string) => void;
}

const MainWeatherData =  ({ city, setCity }:MainWeatherDataProps) => {
  const location: { coordinates?: Coordinates }  = useGeolocation();
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  //const [weatherIcon, setWeatherIcon] = useState<string>("")
  
  const fetchData = async () => {
    try {
      const response: AxiosResponse<WeatherData> = await axios.get(
       city
        ? `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&lang=hu&appid=955163c3dd7ea09295465a4fff838911`
        : `https://api.openweathermap.org/data/2.5/weather?lat=${location.coordinates?.lat}&lon=${location.coordinates?.long}&units=metric&lang=hu&appid=955163c3dd7ea09295465a4fff838911`
      );
      setWeatherData(response.data);
      //setWeatherIcon (getIcon(weatherData?.weather?.[0]?.icon))
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [location, city]);

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setCity(event.target.value);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    fetchData();
  };

 const iconUrl = `./images/icons/${weatherData?.weather?.[0]?.icon}.svg`                  
  // const iconUrlPromise = import(`../images/icons/02d.svg`); 
  // iconUrlPromise.then(iconUrl => {
  //   return <div></div>
  // })                 

  return (
    <StyledMainWeatherData>
    <div>
      {weatherData 
      ? (
        <>
          <img src={iconUrl} alt="mainWeatherImg" className="actual-weather-img" />
          <h1 className="location">{weatherData.name}</h1>
          <h3> {Math.round(weatherData.main.temp)}°C</h3>
          <p>Leírás: {weatherData.weather[0].description} </p>
          <p>Hőérzet: {weatherData.main.feels_like}°C</p>
          <p>Páratartalom: {weatherData.main.humidity}</p>
          <p>Szél: {Math.round(weatherData.wind.speed)} m/s</p>
        </>
      ) 
      : (
        <p>Adatok betöltés alatt...</p>
      )}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Írd be a város nevét..."
          value={city}
          onChange={handleInputChange}
        />
        <button type="submit">🔍 KERESÉS</button>
      </form>
    </div>
    </StyledMainWeatherData>
  );
};

export default MainWeatherData;