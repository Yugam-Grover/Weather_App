import type { AirPollutionData } from "@/schemas/AirPollutionSchema";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatAqiComponents(key: string, value: number): number {
  const pollutantKey = key as PollutantKey;
  const pollutant = POLLUTION_RANGES[pollutantKey];

  if (key === "pm2_5" || key === "pm10") return value;
  if (key === "co") return (value * 24.45) / pollutant.molecularWeight! / 1000;
  else return (value * 24.45) / pollutant.molecularWeight!;
}

export function processAirPollutionData(
  pollutionData: AirPollutionData,
): AqiViewModel {
  const components: ProcessedPollutant[] = Object.entries(
    pollutionData.list[0].components,
  )
    .filter(([Key]) => Key in POLLUTION_RANGES)
    .map(([Key, value]) => {
      const formattedValue = formatAqiComponents(Key, value);
      const pollutant = POLLUTION_RANGES[Key as keyof typeof POLLUTION_RANGES];
      const maxPollutantValue = Math.max(
        pollutant.breakpoints["hazardous"].max,
        formattedValue,
      );
      const currentLevel = (() => {
        for (const [level, pollutantRange] of Object.entries(
          pollutant.breakpoints,
        )) {
          if (
            pollutantRange.min <= formattedValue &&
            (pollutantRange.max === null ||
              formattedValue <= pollutantRange.max)
          ) {
            const AQIRange =
              AQI_INDEX_VALUES[level as keyof typeof AQI_INDEX_VALUES];
            return { AQIRange, pollutantRange, level };
          }
        }
        return {
          AQIRange: AQI_INDEX_VALUES["hazardous"],
          pollutantRange: pollutant.breakpoints["hazardous"],
          level: "hazardous",
        };
      })();
      const { AQIRange, pollutantRange, level } = currentLevel;
      const individualAQI = Math.round(
        ((AQIRange.max - AQIRange.min) /
          (pollutantRange.max - pollutantRange.min)) *
          (formattedValue - pollutantRange.min) +
          AQIRange.min,
      );

      return {
        key: Key,
        displayValue: Number(formattedValue.toFixed(2)),
        currentLevel: level as QualitativeLevel,
        maxPollutantValue: maxPollutantValue,
        individualAQI: individualAQI,
      };
    });
  const mainAQI = Math.max(...components.map((c) => c.individualAQI));

  const PREFERRED_ORDER = ["pm2_5", "pm10", "o3", "no2", "so2", "co"];
  components.sort((a, b) => {
    return PREFERRED_ORDER.indexOf(a.key) - PREFERRED_ORDER.indexOf(b.key);
  });
  return {
    mainAQI,
    components,
  };
}

export interface ProcessedPollutant {
  key: string;
  displayValue: number;
  currentLevel: QualitativeLevel;
  maxPollutantValue: number;
  individualAQI: number;
}

export interface AqiViewModel {
  mainAQI: number;
  components: ProcessedPollutant[];
}
export type QualitativeLevel =
  | "good"
  | "moderate"
  | "unhealthy for sensitive groups"
  | "unhealthy"
  | "very unhealthy"
  | "hazardous";

export type UnitType = "μg/m³" | "ppb" | "ppm";

export type PollutantKey = "co" | "no2" | "o3" | "so2" | "pm2_5" | "pm10";

export interface Range {
  min: number;
  max: number;
}

export interface PollutantConfig {
  unit: UnitType;
  molecularWeight?: number;
  breakpoints: Record<QualitativeLevel, Range>;
}

export type AirQualityMap = Record<PollutantKey, PollutantConfig>;

export const POLLUTION_RANGES: AirQualityMap = {
  pm2_5: {
    unit: "μg/m³",
    breakpoints: {
      good: { min: 0.0, max: 12.0 },
      moderate: { min: 12.1, max: 35.4 },
      "unhealthy for sensitive groups": { min: 35.5, max: 55.4 },
      unhealthy: { min: 55.5, max: 150.4 },
      "very unhealthy": { min: 150.5, max: 250.4 },
      hazardous: { min: 250.5, max: 500.4 },
    },
  },
  pm10: {
    unit: "μg/m³",
    breakpoints: {
      good: { min: 0, max: 54 },
      moderate: { min: 55, max: 154 },
      "unhealthy for sensitive groups": { min: 155, max: 254 },
      unhealthy: { min: 255, max: 354 },
      "very unhealthy": { min: 355, max: 424 },
      hazardous: { min: 425, max: 604 },
    },
  },
  co: {
    unit: "ppm",
    molecularWeight: 28.01,
    breakpoints: {
      good: { min: 0.0, max: 4.4 },
      moderate: { min: 4.5, max: 9.4 },
      "unhealthy for sensitive groups": { min: 9.5, max: 12.4 },
      unhealthy: { min: 12.5, max: 15.4 },
      "very unhealthy": { min: 15.5, max: 30.4 },
      hazardous: { min: 30.5, max: 50.4 },
    },
  },
  so2: {
    unit: "ppb",
    molecularWeight: 64.06,
    breakpoints: {
      good: { min: 0, max: 35 },
      moderate: { min: 36, max: 75 },
      "unhealthy for sensitive groups": { min: 76, max: 185 },
      unhealthy: { min: 186, max: 304 },
      "very unhealthy": { min: 305, max: 604 },
      hazardous: { min: 605, max: 1004 },
    },
  },
  no2: {
    unit: "ppb",
    molecularWeight: 46.01,
    breakpoints: {
      good: { min: 0, max: 53 },
      moderate: { min: 54, max: 100 },
      "unhealthy for sensitive groups": { min: 101, max: 360 },
      unhealthy: { min: 361, max: 649 },
      "very unhealthy": { min: 650, max: 1249 },
      hazardous: { min: 1250, max: 2049 },
    },
  },
  o3: {
    unit: "ppb",
    molecularWeight: 48.0,
    breakpoints: {
      good: { min: 0, max: 54 },
      moderate: { min: 55, max: 70 },
      "unhealthy for sensitive groups": { min: 71, max: 85 },
      unhealthy: { min: 86, max: 105 },
      "very unhealthy": { min: 106, max: 200 },
      hazardous: { min: 201, max: 604 },
    },
  },
};

export const POLLUTANT_NAMES: Record<PollutantKey, string> = {
  co: "Carbon Monoxide",
  no2: "Nitrogen Dioxide",
  o3: "Ozone",
  so2: "Sulphur Dioxide",
  pm2_5: "Fine Particulate Matter (PM2.5)",
  pm10: "Coarse Particulate Matter (PM10)",
};

export const AQI_INDEX_VALUES: Record<QualitativeLevel, Range> = {
  good: { min: 0, max: 50 },
  moderate: { min: 51, max: 100 },
  "unhealthy for sensitive groups": { min: 101, max: 150 },
  unhealthy: { min: 151, max: 200 },
  "very unhealthy": { min: 201, max: 300 },
  hazardous: { min: 301, max: 500 },
};
