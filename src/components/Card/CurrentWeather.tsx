import React from "react";
import Card from "./Card";
import {
  type OpenWeatherMapResponse,
  openWeatherMapResponseSchema,
} from "../../schemas/WeatherSchema";
import { useSuspenseQuery } from "@tanstack/react-query";
import WeatherIcon from "../WeatherIcon";

const CurrentWeather = ({ coords }: BaseWeatherProps) => {
  // const { data } = useQuery({
  //   queryKey: [1],
  //   queryFn: () =>
  //     fetcher("data/3.0/onecall", {
  //       lat: coords.lat,
  //       lon: coords.lon,
  //       exclude: "minutely,alerts",
  //       units: "imperial",
  //     }),
  // });
  const fetchDummyData = async (): Promise<OpenWeatherMapResponse> => {
    const response = await fetch("/api/Weather");
    const data = await response.json();
    return openWeatherMapResponseSchema.parse(data);
  };

  const { data: WeatherData } = useSuspenseQuery({
    queryKey: ["Weather"],
    queryFn: () => fetchDummyData(),
  });

  return (
    <Card
      delay={0}
      title="Current Weather"
      childrenClassName="flex flex-col items-center gap-7">
      <div className="flex flex-col items-center">
        <h2 className="text-6xl font-semibold">
          {Math.round(WeatherData.current.temp)}°C
        </h2>
        <WeatherIcon className="size-20 -mt-2" />
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
          <p>{WeatherData.current.wind_speed}mph</p>
        </div>
      </div>
    </Card>
  );
};

export default CurrentWeather;
