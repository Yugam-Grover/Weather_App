type Props = {
  mapType: string;
};

const MapLegend = ({ mapType }: Props) => {
  if (mapType === "none") return null;
  const data = WEATHER_LEGENDS[mapType];
  const maxValue = data.stops[data.stops.length - 1].value;
  const stopGradient = data.stops
    .map(
      (stop, index) =>
        `${stop.color} ${(index / (data.stops.length - 1)) * 100}%`,
    )
    .join(", ");

  return (
    <div className="absolute top-4 right-4 w-48 xs:w-95 z-1000 rounded-xl shadow-lg bg-white/70 dark:bg-background/50 backdrop-blur-md p-4 border border-slate-200 dark:border-accent/70 flex flex-col gap-4">
      <h3 className="text-foreground dark:text-[#ffffff] text-md font-semibold">
        {data.title}
      </h3>
      <div
        className={`w-full h-5 rounded-xl border border-accent/70 ${
          mapType === "clouds_new" ? "dark:invert-0 invert" : ""
        }`}
        style={{
          background: `linear-gradient(to right, ${stopGradient})`,
        }}
      />
      <div className="flex justify-between text-foreground dark:text-[#ffffff] text-xs font-medium">
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
  label?: string;
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
      { value: 0.5, color: "rgba(120, 200, 80, 0.4)" },
      { value: 1, color: "rgba(40, 200, 40, 0.6)" },
      { value: 10, color: "rgba(255, 255, 0, 0.9)" },
      { value: 140, color: "rgba(255, 0, 0, 1)" },
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
      { value: 5, color: "rgba(0, 200, 255, 0.4)" },
      { value: 15, color: "rgba(0, 100, 255, 0.7)" },
      { value: 25, color: "rgba(130, 0, 220, 0.8)" },
      { value: 50, color: "rgba(80, 0, 150, 0.9)" },
      { value: 200, color: "rgba(20, 0, 60, 1)" },
    ],
  },
};
