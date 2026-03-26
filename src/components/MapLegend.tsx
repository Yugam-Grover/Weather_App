import React from "react";

type Props = {
  mapType: string;
};

const MapLegend = ({ mapType }: Props) => {
  const data = WEATHER_LEGENDS[mapType];
  const maxValue = data.stops[data.stops.length - 1].value;
  const stopGradient = data.stops
    .map((stop) => `${stop.color} ${(stop.value / maxValue) * 100}%`)
    .join(", ");
  return (
    <div className="absolute top-4 right-4 w-95 z-1000 rounded-xl shadow-lg bg-background/50 p-4 border border-accent/70 flex flex-col gap-4">
      <h3 className="text-md font-semibold">{data.title}</h3>
      <div
        className="w-full h-5 rounded-xl border border-accent/70"
        style={{
          background: `linear-gradient(to right, ${stopGradient})`,
        }}
      />
      <div className="flex justify-between text-xs">
        <span>
          {data.stops[0].value}
          {data.unit}
        </span>
        <span>
          {maxValue}
          {data.unit}
        </span>
      </div>
    </div>
  );
};

export default MapLegend;

interface LegendStop {
  value: number;
  color: string;
  label?: string; // Optional: if you want a specific word like "Freezing"
}

interface WeatherLegend {
  title: string;
  unit: string;
  type: "linear" | "stepped";
  stops: LegendStop[];
}

type WeatherLegendRecord = Record<string, WeatherLegend>;
const WEATHER_LEGENDS: WeatherLegendRecord = {
  temp_new: {
    title: "Temperature",
    unit: "°C",
    type: "linear",
    stops: [
      { value: -65, color: "rgba(130, 22, 146, 1)" },
      { value: -30, color: "rgba(130, 87, 219, 1)" },
      { value: -20, color: "rgba(32, 140, 236, 1)" },
      { value: -10, color: "rgba(32, 196, 232, 1)" },
      { value: 0, color: "rgba(35, 221, 221, 1)" },
      { value: 10, color: "rgba(194, 255, 40, 1)" },
      { value: 20, color: "rgba(255, 240, 40, 1)" },
      { value: 25, color: "rgba(255, 194, 40, 1)" },
      { value: 30, color: "rgba(252, 128, 20, 1)" },
    ],
  },
  precipitation_new: {
    title: "Precipitation",
    unit: "mm",
    type: "stepped",
    stops: [
      { value: 0, color: "rgba(225, 200, 100, 0)" },
      { value: 1, color: "rgba(110, 110, 205, 0.3)" },
      { value: 10, color: "rgba(80, 80, 225, 0.7)" },
      { value: 140, color: "rgba(20, 20, 255, 0.9)" },
    ],
  },
  clouds_new: {
    title: "Cloud Cover",
    unit: "%",
    type: "linear",
    stops: [
      { value: 0, color: "rgba(255, 255, 255, 0.0)" },
      { value: 50, color: "rgba(247, 247, 255, 0.5)" },
      { value: 100, color: "rgba(240, 240, 255, 1)" },
    ],
  },
  pressure_new: {
    title: "Pressure",
    unit: "hPa",
    type: "linear",
    stops: [
      { value: 940, color: "rgba(0, 115, 255, 1)" },
      { value: 1013, color: "rgba(176, 247, 32, 1)" },
      { value: 1080, color: "rgba(198, 0, 0, 1)" },
    ],
  },
  wind_new: {
    title: "Wind Speed",
    unit: "m/s",
    type: "stepped",
    stops: [
      { value: 1, color: "rgba(255, 255, 255, 0)" },
      { value: 15, color: "rgba(179, 100, 188, 0.7)" },
      { value: 50, color: "rgba(116, 76, 172, 0.9)" },
      { value: 200, color: "rgba(13, 17, 38, 1)" },
    ],
  },
};
