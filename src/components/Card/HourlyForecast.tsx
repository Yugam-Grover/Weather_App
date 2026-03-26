import { useSuspenseQuery } from "@tanstack/react-query";
import {
  openWeatherMapResponseSchema,
  type OpenWeatherMapResponse,
} from "../../schemas/WeatherSchema";
import Card from "./Card";
import WeatherIcon from "../WeatherIcon";

const HourlyForecast = ({ coords }: BaseWeatherProps) => {
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
      delay={100}
      title="Hourly Forecast (48 hours)"
      childrenClassName="flex gap-8 overflow-x-scroll pb-3">
      {WeatherData?.hourly.map((hour) => (
        <div key={hour.dt} className="flex flex-col gap-4 items-center p-2">
          <p className="whitespace-nowrap">
            {new Date(hour.dt * 1000)
              .toLocaleTimeString(undefined, {
                hour: "numeric",
                hour12: true,
              })
              .toLowerCase()}
          </p>
          <WeatherIcon />
          <p /*className="text-[18px]"*/>{Math.round(hour.temp)}°C</p>
          {/* <span className="relative -top-1 text-sm">°C</span> */}
        </div>
      ))}
    </Card>
  );
};

export default HourlyForecast;
