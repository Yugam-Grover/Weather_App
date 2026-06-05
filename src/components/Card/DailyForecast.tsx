import { useSuspenseQuery } from "@tanstack/react-query";
import Card from "./Card";
import {
  openWeatherMapResponseSchema,
  type OpenWeatherMapResponse,
} from "../../schemas/WeatherSchema";
import WeatherIcon from "../WeatherIcon";
import { fetcher } from "@/api";

const DailyForecast = ({ coords }: BaseWeatherProps) => {
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
      delay={200}
      title="Daily Forecast"
      className="bg-white/60 dark:bg-white/5 backdrop-blur-md border border-slate-200 dark:border-white/10 shadow-xl"
      childrenClassName="flex flex-col gap-3 2xl:gap-1.5 2xl:justify-between ">
      {WeatherData.daily.map((data) => (
        <div key={data.dt} className="flex justify-between">
          <p className="w-9">
            {new Date(data.dt * 1000).toLocaleDateString(undefined, {
              weekday: "short",
            })}
          </p>
          <WeatherIcon src={data.weather[0].icon} />
          <p>{Math.round(data.temp.day)}°C</p>
          <p className="text-gray-500">{Math.round(data.temp.min)}°C</p>
          <p className="text-gray-500">{Math.round(data.temp.max)}°C</p>
        </div>
      ))}
    </Card>
  );
};

export default DailyForecast;
