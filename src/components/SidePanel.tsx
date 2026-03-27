import { fetcher } from "@/api";
import { AirPollutionSchema } from "@/schemas/AirPollutionSchema";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Suspense, type Dispatch, type SetStateAction } from "react";
import Card from "./Card/Card";
import { Slider } from "./ui/slider";
import clsx from "clsx";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
import { Info, ChevronRight } from "lucide-react";
import SidePanelSkeleton from "./skeletons/SidePanelSkeleton";

type Props = {
  coords: Coords;
  sidePanelOpen: boolean;
  setSidePanelOpen: Dispatch<SetStateAction<boolean>>;
};
const SidePanel = ({ coords, sidePanelOpen, setSidePanelOpen }: Props) => {
  return (
    <div
      className={clsx(
        "fixed top-0 right-0 w-(--sidebar-width) h-screen px-4 py-4 bg-[#303030] shadow-md overflow-y-scroll transition-transform duration-300 lg:translate-x-0!",
        sidePanelOpen ? "translate-x-0" : "translate-x-full",
      )}>
      <button
        className="hover:cursor-pointer lg:hidden"
        onClick={() => setSidePanelOpen(false)}>
        <ChevronRight className="size-5" />
      </button>
      <Suspense fallback={<SidePanelSkeleton />}>
        <AirPollution coords={coords} />
      </Suspense>
    </div>
  );
};

export default SidePanel;

function AirPollution({ coords }: BaseWeatherProps) {
  const { data: AirPollutionData } = useSuspenseQuery({
    queryKey: ["pollution", coords],
    queryFn: () =>
      fetcher(
        "data/2.5/air_pollution",
        {
          lat: coords.lat,
          lon: coords.lon,
        },
        AirPollutionSchema,
      ),
    // queryFn: async () => {
    //   await new Promise((resolve) => setTimeout(resolve, 3000));
    //   return fetcher(
    //     "data/2.5/air_pollution",
    //     {
    //       lat: coords.lat,
    //       lon: coords.lon,
    //     },
    //     AirPollutionSchema,
    //   );
  });

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-sm font-semibold">Air Pollution</h1>
      <h2 className="text-4xl font-semibold">
        {AirPollutionData.list[0].main.aqi}
      </h2>
      <div className="flex gap-2">
        <h3 className="text-sm font-semibold">AQI</h3>
        <Tooltip>
          <TooltipTrigger className="p-1 -m-1 cursor-help pointer-events-auto">
            <Info className="size-4" />
          </TooltipTrigger>
          <TooltipContent className="">
            <p className="w-xs">
              Air Quality Index. Possible values: 1, 2, 3, 4, 5. Where 1 = Good,
              2 = Fair, 3 = Moderate, 4 = Poor, 5 = Very Poor.
            </p>
          </TooltipContent>
        </Tooltip>
      </div>
      {Object.entries(AirPollutionData.list[0].components).map(
        ([Key, value]) => {
          const pollutant =
            POLLUTION_RANGES[Key as keyof typeof POLLUTION_RANGES];
          const maxPollutantValue = Math.max(pollutant["very poor"].min, value);
          const currentLevel = (() => {
            for (const [level, range] of Object.entries(pollutant)) {
              if (
                range.min <= value &&
                (range.max === null || value <= range.max)
              )
                return level;
            }
            return "very poor";
          })();

          const qualityColor = (() => {
            switch (currentLevel) {
              case "good":
                return {
                  bg: "bg-emerald-500/20",
                  text: "text-emerald-500",
                  border: "border-emerald-500/30",
                };
              case "fair":
                return {
                  bg: "bg-yellow-400/20",
                  text: "text-yellow-400",
                  border: "border-yellow-400/30",
                };
              case "moderate":
                return {
                  bg: "bg-orange-400/20",
                  text: "text-orange-400",
                  border: "border-orange-400/30",
                };
              case "poor":
                return {
                  bg: "bg-red-400/20",
                  text: "text-red-400",
                  border: "border-red-400/30",
                };
              case "very poor":
                return {
                  bg: "bg-purple-500/20",
                  text: "text-purple-500",
                  border: "border-purple-500/30",
                };
            }
          })();
          return (
            <Card
              key={Key}
              childrenClassName="flex flex-col gap-3"
              className="gap-0! hover:scale-105 transition-transform duration-300">
              <div className="flex justify-between">
                <div className="flex gap-2">
                  <span className="text-sm font-bold capitalize">{Key}</span>
                  <Tooltip>
                    <TooltipTrigger className="p-1 -m-1 cursor-help pointer-events-auto">
                      <Info className="size-4" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>
                        Concentration of {POLLUTANT_NAMES[Key as PollutantKey]}
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </div>
                <span className="text-sm font-semibold">{value}</span>
              </div>
              <Slider
                min={0}
                max={maxPollutantValue}
                value={[value]}
                disabled
              />
              <div className="flex justify-between text-xs">
                <p>{0}</p>
                <p>{maxPollutantValue}</p>
              </div>
              <div className="flex justify-between">
                {Object.keys(pollutant).map((quality) => (
                  <span
                    key={quality}
                    className={clsx(
                      "text-xs rounded-md p-1 px-2 font-medium capitalize",
                      quality === currentLevel
                        ? `${qualityColor?.bg} ${qualityColor?.text} ${qualityColor?.border}`
                        : "bg-slate-500/20 text-slate-500 border-slate-500/30",
                    )}>
                    {quality}
                  </span>
                ))}
              </div>
            </Card>
          );
        },
      )}
    </div>
  );
}

type QualitativeLevel = "good" | "fair" | "moderate" | "poor" | "very poor";

type PollutantKey =
  | "co"
  | "no"
  | "no2"
  | "o3"
  | "so2"
  | "pm2_5"
  | "pm10"
  | "nh3";

interface Range {
  min: number;
  max: number | null;
}

// This creates a type where every pollutant must have every qualitative level defined
type AirQualityMap = Record<PollutantKey, Record<QualitativeLevel, Range>>;

const POLLUTION_RANGES: AirQualityMap = {
  so2: {
    good: { min: 0, max: 20 },
    fair: { min: 20, max: 80 },
    moderate: { min: 80, max: 250 },
    poor: { min: 250, max: 350 },
    "very poor": { min: 350, max: null }, // Capped at 500 for slider UI
  },
  no2: {
    good: { min: 0, max: 40 },
    fair: { min: 40, max: 70 },
    moderate: { min: 70, max: 150 },
    poor: { min: 150, max: 200 },
    "very poor": { min: 200, max: null },
  },
  pm10: {
    good: { min: 0, max: 20 },
    fair: { min: 20, max: 50 },
    moderate: { min: 50, max: 100 },
    poor: { min: 100, max: 200 },
    "very poor": { min: 200, max: null },
  },
  pm2_5: {
    good: { min: 0, max: 10 },
    fair: { min: 10, max: 25 },
    moderate: { min: 25, max: 50 },
    poor: { min: 50, max: 75 },
    "very poor": { min: 75, max: null },
  },
  o3: {
    good: { min: 0, max: 60 },
    fair: { min: 60, max: 100 },
    moderate: { min: 100, max: 140 },
    poor: { min: 140, max: 180 },
    "very poor": { min: 180, max: null },
  },
  co: {
    good: { min: 0, max: 4400 },
    fair: { min: 4400, max: 9400 },
    moderate: { min: 9400, max: 12400 },
    poor: { min: 12400, max: 15400 },
    "very poor": { min: 15400, max: null },
  },
  nh3: {
    good: { min: 0, max: 40 },
    fair: { min: 40, max: 80 },
    moderate: { min: 80, max: 120 },
    poor: { min: 120, max: 160 },
    "very poor": { min: 160, max: null },
  },
  no: {
    good: { min: 0, max: 20 },
    fair: { min: 20, max: 40 },
    moderate: { min: 40, max: 60 },
    poor: { min: 60, max: 80 },
    "very poor": { min: 80, max: null },
  },
};

export const POLLUTANT_NAMES: Record<PollutantKey, string> = {
  co: "Carbon Monoxide",
  no: "Nitrogen Monoxide",
  no2: "Nitrogen Dioxide",
  o3: "Ozone",
  so2: "Sulphur Dioxide",
  pm2_5: "Fine Particulate Matter (PM2.5)",
  pm10: "Coarse Particulate Matter (PM10)",
  nh3: "Ammonia",
};
