import Card from "./Card";
import {
  ArrowUp,
  CircleGauge,
  Cloudy,
  SunMedium,
  Sunrise,
  Sunset,
  Wind,
} from "lucide-react";
import {
  openWeatherMapResponseSchema,
  type OpenWeatherMapResponse,
} from "../../schemas/WeatherSchema";
import { useSuspenseQuery } from "@tanstack/react-query";
import { fetcher } from "@/api";

const AdditionalInfo = ({ coords }: BaseWeatherProps) => {
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
  const rows = [
    {
      label: "Cloudiness",
      value: "clouds",
      Icon: Cloudy,
    },
    {
      label: "UV Index",
      value: "uvi",
      Icon: SunMedium,
    },
    {
      label: "Wind Direction",
      value: "wind_deg",
      Icon: Wind,
    },
    {
      label: "Pressure",
      value: "pressure",
      Icon: CircleGauge,
    },
    {
      label: "Sunrise",
      value: "sunrise",
      Icon: Sunrise,
    },
    {
      label: "Sunset",
      value: "sunset",
      Icon: Sunset,
    },
  ] as const;

  type CurrentWeatherKeys = keyof OpenWeatherMapResponse["current"];

  const FormatNumber = ({
    value,
    number,
  }: {
    value: CurrentWeatherKeys;
    number: number | undefined;
  }) => {
    if (number === undefined) return null;
    if (value === "clouds") return `${number}%`;
    if (value === "pressure") return `${number} hPa`;
    if (value === "sunrise" || value === "sunset")
      return new Date(number * 1000).toLocaleTimeString(undefined, {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });
    if (value === "wind_deg")
      return <ArrowUp style={{ transform: `rotate(${number}deg)` }} />;
    return number;
  };

  return (
    <Card
      delay={300}
      title="Additional Weather Info"
      className="bg-white/60 dark:bg-white/5 backdrop-blur-md border border-slate-200 dark:border-white/10 shadow-xl"
      childrenClassName="grid grid-cols-1 md:grid-cols-2 gap-5 !flex-none">
      {rows.map(({ label, value, Icon }) => (
        <div key={value} className="flex justify-between">
          <div className="flex gap-6">
            <span className="text-gray-500">{label}</span>
            <Icon />
          </div>
          <span>
            <FormatNumber value={value} number={WeatherData.current[value]} />
          </span>
        </div>
      ))}
    </Card>
  );
};

export default AdditionalInfo;
