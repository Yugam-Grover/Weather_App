import { useSuspenseQuery } from "@tanstack/react-query";
import {
  openWeatherMapResponseSchema,
  type OpenWeatherMapResponse,
} from "../../schemas/WeatherSchema";
import Card from "./Card";
import WeatherIcon from "../WeatherIcon";
import { fetcher } from "@/api";

const HourlyForecast = ({ coords }: BaseWeatherProps) => {
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
      delay={100}
      title="Hourly Forecast (48 hours)"
      className="bg-white/60 dark:bg-white/5 backdrop-blur-md border border-slate-200 dark:border-white/10 shadow-xl"
      childrenClassName="flex gap-8 justify-start w-full overflow-x-scroll pb-3">
      {WeatherData.hourly.map((hour) => (
        <div
          key={hour.dt}
          className="flex flex-col gap-4 items-center p-2 2xl:justify-between shrink-0">
          <p className="2xl:scale-110 whitespace-nowrap">
            {new Date(hour.dt * 1000)
              .toLocaleTimeString(undefined, {
                hour: "numeric",
                hour12: true,
              })
              .toLowerCase()}
          </p>
          <WeatherIcon src={hour.weather[0].icon} className="2xl:size-11" />
          <p className="2xl:scale-110">{Math.round(hour.temp)}°C</p>
        </div>
      ))}
    </Card>
  );
};

export default HourlyForecast;
