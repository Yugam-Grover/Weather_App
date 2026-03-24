import React from "react";
import Card from "./Card";
import {
  ArrowUp,
  CircleGauge,
  Cloudy,
  SunMedium,
  Sunrise,
  Sunset,
  Wind,
  WindArrowDown,
} from "lucide-react";
import {
  openWeatherMapResponseSchema,
  type OpenWeatherMapResponse,
} from "../../schemas/WeatherSchema";
import { useSuspenseQuery } from "@tanstack/react-query";

type Props = {};

const AdditionalInfo = (props: Props) => {
  const fetchDummyData = async (): Promise<OpenWeatherMapResponse> => {
    const response = await fetch("/api/Weather");
    const data = await response.json();
    return openWeatherMapResponseSchema.parse(data);
  };

  const { data: WeatherData } = useSuspenseQuery({
    queryKey: ["Weather"],
    queryFn: () => fetchDummyData(),
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

  const FormatNumber = ({
    value,
    number,
  }: {
    value: string;
    number: number | undefined;
  }) => {
    if (number === undefined) return null;
    if (value === "clouds") return `${WeatherData.current[value]}%`;
    if (value === "pressure") return `${WeatherData.current[value]} hPa`;
    if (value === "sunrise" || value === "sunset")
      return new Date(number * 1000).toLocaleTimeString(undefined, {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });
    if (value === "wind_deg")
      return (
        <ArrowUp
          style={{ transform: `rotate(${WeatherData.current.wind_deg}deg)` }}
        />
      );
    return number;
  };
  return (
    <Card
      title="Additional Weather Info"
      childrenClassName="flex flex-col gap-3">
      {rows.map(({ label, value, Icon }) => (
        <div className="flex justify-between">
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
