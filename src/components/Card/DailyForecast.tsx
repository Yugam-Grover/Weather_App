import { useSuspenseQuery } from "@tanstack/react-query";
import Card from "./Card";
import {
  openWeatherMapResponseSchema,
  type OpenWeatherMapResponse,
} from "../../schemas/WeatherSchema";
import WeatherIcon from "../WeatherIcon";
WeatherIcon;

const DailyForecast = ({ coords }: BaseWeatherProps) => {
  // const { data } = useQuery({
  //   queryKey: [1],
  //   queryFn: () =>
  //     fetcher("onecall", {
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
    <Card title="Daily Forecast" childrenClassName="flex flex-col gap-2">
      {WeatherData?.daily.map((data) => (
        <div key={data.dt} className="flex justify-between">
          <p className="w-9">
            {new Date(data.dt * 1000).toLocaleDateString(undefined, {
              weekday: "short",
            })}
          </p>
          <WeatherIcon />
          <p>{Math.round(data.temp.day)}°C</p>
          <p className="text-gray-500">{Math.round(data.temp.min)}°C</p>
          <p className="text-gray-500">{Math.round(data.temp.max)}°C</p>
        </div>
      ))}
    </Card>
  );
};

export default DailyForecast;
