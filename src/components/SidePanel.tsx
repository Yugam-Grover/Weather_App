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
import {
  AQI_INDEX_VALUES,
  POLLUTANT_NAMES,
  processAirPollutionData,
  type PollutantKey,
  type QualitativeLevel,
} from "@/lib/utils";
import { ErrorBoundary } from "react-error-boundary";

type Props = {
  coords: Coords;
  sidePanelOpen: boolean;
  setSidePanelOpen: Dispatch<SetStateAction<boolean>>;
};
const SidePanel = ({ coords, sidePanelOpen, setSidePanelOpen }: Props) => {
  return (
    <div
      className={clsx(
        "fixed top-0 right-0 w-(--sidebar-width) h-screen px-2 py-4 bg-sidebar shadow-md overflow-y-scroll transition-transform duration-300 lg:translate-x-0! z-1001 dark:bg-sidebar backdrop-blur-xl border-l border-slate-200 dark:border-transparent",
        sidePanelOpen ? "translate-x-0" : "translate-x-full",
      )}>
      <button
        className="hover:cursor-pointer lg:hidden"
        onClick={() => setSidePanelOpen(false)}>
        <ChevronRight className="size-5" />
      </button>

      <ErrorBoundary
        fallback={
          <Card className="flex items-center justify-center text-red-500/80 bg-white/60 dark:bg-white/5 border border-slate-200 dark:border-white/10">
            <p className="font-medium">Failed to load data.</p>
          </Card>
        }>
        <Suspense fallback={<SidePanelSkeleton />}>
          <AirPollution coords={coords} />
        </Suspense>
      </ErrorBoundary>
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
  });
  const aqiData = processAirPollutionData(AirPollutionData);

  const currentLevel = (() => {
    for (const [level, range] of Object.entries(AQI_INDEX_VALUES)) {
      if (
        range.min <= aqiData.mainAQI &&
        (range.max === null || aqiData.mainAQI <= range.max)
      )
        return level;
    }
    return {
      level: "hazardous",
    };
  })();

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <h1 className="text-sm font-semibold text-gray-600 dark:text-gray-300">
          Air Pollution
        </h1>
        <Tooltip>
          <TooltipTrigger className="cursor-help">
            <Info className="size-4 text-gray-400 dark:hover:text-white transition-colors" />
          </TooltipTrigger>
          <TooltipContent>
            <p className="w-xs">
              US EPA Air Quality Index. Values range from 0 to 500. Where 0-50 =
              Good, 51-100 = Moderate, 101-150 = Unhealthy for Sensitive Groups,
              151-200 = Unhealthy, 201-300 = Very Unhealthy, 301-500 =
              Hazardous.
            </p>
          </TooltipContent>
        </Tooltip>
      </div>

      <div className="flex items-center gap-4 py-2">
        <div
          className={clsx(
            "flex flex-col items-center justify-center min-w-18 h-16 rounded-xl border",
            NEON_COLORS[currentLevel as QualitativeLevel].bg,
            NEON_COLORS[currentLevel as QualitativeLevel].border,
          )}>
          <span
            className={clsx(
              "text-3xl font-bold leading-none",
              NEON_COLORS[currentLevel as QualitativeLevel].text,
            )}>
            {aqiData.mainAQI}
          </span>
          <span
            className={clsx(
              "text-[10px] font-bold uppercase tracking-wider mt-1 opacity-80",
              NEON_COLORS[currentLevel as QualitativeLevel].text,
            )}>
            US AQI
          </span>
        </div>

        <div className="flex-1">
          <h3
            className={clsx(
              "text-xl font-bold capitalize leading-tight",
              NEON_COLORS[currentLevel as QualitativeLevel].text,
            )}>
            {currentLevel.toString()}
          </h3>
        </div>
      </div>

      {aqiData.components.map((pollutant) => {
        return (
          <Card
            key={pollutant.key}
            childrenClassName="flex flex-col gap-1"
            className="bg-white/60 dark:bg-white/5 backdrop-blur-md border border-slate-200 dark:border-white/10 shadow-xl hover:bg-white/10 hover:scale-105 transition-all duration-300 rounded-2xl p-4">
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center gap-1">
                <span className="text-xl font-medium uppercase tracking-wide text-foreground/90">
                  {pollutant.key}
                </span>
                <Tooltip>
                  <TooltipTrigger className="p-1 cursor-help pointer-events-auto">
                    <Info className="size-3.5 text-muted-foreground hover:text-foreground/80 transition-colors" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>
                      Concentration of{" "}
                      {POLLUTANT_NAMES[pollutant.key as PollutantKey]}
                    </p>
                  </TooltipContent>
                </Tooltip>
              </div>
              <span className="text-3xl font-semibold text-foreground">
                {pollutant.displayValue}
              </span>
            </div>
            <div className="flex justify-start w-full my-1">
              <span
                className={clsx(
                  "w-full text-center text-xs font-semibold py-1.5 rounded-full capitalize shadow-sm border",
                  NEON_COLORS[pollutant.currentLevel].bg,
                  NEON_COLORS[pollutant.currentLevel].text,
                  NEON_COLORS[pollutant.currentLevel].border,
                )}>
                {pollutant.currentLevel}
              </span>
            </div>
            <Slider
              min={0}
              max={pollutant.maxPollutantValue}
              value={pollutant.displayValue}
              disabled
              className="py-1 cursor-default"
            />
            <div className="flex justify-between text-[11px] text-muted-foreground font-medium mt-1">
              <p>{0}</p>
              <p>{pollutant.maxPollutantValue}</p>
            </div>
          </Card>
        );
      })}
    </div>
  );
}

const NEON_COLORS: Record<
  QualitativeLevel,
  { bg: string; text: string; border: string }
> = {
  good: {
    bg: "bg-emerald-100 dark:bg-emerald-500/10",
    text: "text-emerald-700 dark:text-emerald-400",
    border: "border-emerald-200 dark:border-emerald-500/20",
  },
  moderate: {
    bg: "bg-amber-100 dark:bg-yellow-500/10",
    text: "text-amber-700 dark:text-yellow-400",
    border: "border-amber-300 dark:border-yellow-500/20",
  },
  "unhealthy for sensitive groups": {
    bg: "bg-orange-100 dark:bg-orange-500/10",
    text: "text-orange-700 dark:text-orange-400",
    border: "border-orange-300 dark:border-orange-500/20",
  },
  unhealthy: {
    bg: "bg-red-100 dark:bg-red-500/10",
    text: "text-red-700 dark:text-red-400",
    border: "border-red-200 dark:border-red-500/20",
  },
  "very unhealthy": {
    bg: "bg-purple-100 dark:bg-purple-500/10",
    text: "text-purple-700 dark:text-purple-400",
    border: "border-purple-200 dark:border-purple-500/20",
  },
  hazardous: {
    bg: "bg-rose-100 dark:bg-rose-500/10",
    text: "text-rose-700 dark:text-rose-400",
    border: "border-rose-200 dark:border-rose-500/20",
  },
};
