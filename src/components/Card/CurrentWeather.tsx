import Card from "./Card";
import {
  type OpenWeatherMapResponse,
  openWeatherMapResponseSchema,
} from "../../schemas/WeatherSchema";
import { useSuspenseQuery } from "@tanstack/react-query";
import WeatherIcon from "../WeatherIcon";
import { fetcher } from "@/api";

const CurrentWeather = ({ coords }: BaseWeatherProps) => {
  const { data: WeatherData } = useSuspenseQuery({
    queryKey: ["realData", coords.lat, coords.lon],
    queryFn: () =>
      fetcher<OpenWeatherMapResponse>(
        "data/3.0/onecall",
        {
          lat: coords.lat,
          lon: coords.lon,
          exclude: "minutely,alerts",
          units: "metric",
        },
        openWeatherMapResponseSchema,
      ),
  });

  return (
    <Card
      delay={0}
      title="Current Weather"
      className="bg-white/60 dark:bg-white/5 backdrop-blur-md border border-slate-200 dark:border-white/10 shadow-xl"
      childrenClassName="flex flex-col items-center gap-7 2xl:justify-between md:pb-7 md:mt-7">
      <div className="flex flex-col items-center">
        <h2 className="text-6xl font-semibold">
          {Math.round(WeatherData.current.temp)}°C
        </h2>
        <WeatherIcon
          src={WeatherData.current.weather[0].icon}
          className="size-20 -mt-2"
        />
        <p className="capitalize text-xl -mt-2">
          {WeatherData.current.weather[0].description}
        </p>
      </div>
      <div className="flex flex-col items-center">
        <p className="text-gray-500">Local Time:</p>
        <h3 className="text-2xl font-semibold">
          {new Intl.DateTimeFormat("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
            timeZone: WeatherData.timezone,
          }).format(new Date(WeatherData.current.dt * 1000))}
        </h3>
      </div>
      <div className="flex justify-between w-full">
        <div className="flex flex-col items-center gap-2">
          <p className="text-gray-500">Feels like</p>
          <p>{WeatherData.current.feels_like}°C</p>
        </div>
        <div className="flex flex-col items-center gap-2">
          <p className="text-gray-500">Humidity</p>
          <p>{WeatherData.current.humidity}%</p>
        </div>
        <div className="flex flex-col items-center gap-2">
          <p className="text-gray-500">Wind Speed</p>
          <p>{WeatherData.current.wind_speed} m/s</p>
        </div>
      </div>
    </Card>
  );
};

export default CurrentWeather;
