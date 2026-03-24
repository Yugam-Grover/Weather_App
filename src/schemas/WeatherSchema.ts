import { z } from "zod";

const weatherConditionSchema = z.object({
  id: z.number(),
  main: z.string(),
  description: z.string(),
  icon: z.string(),
});

const currentWeatherSchema = z.object({
  dt: z.number(),
  sunrise: z.number().optional(),
  sunset: z.number().optional(),
  temp: z.number(),
  feels_like: z.number(),
  pressure: z.number(),
  humidity: z.number(),
  dew_point: z.number(),
  clouds: z.number(),
  uvi: z.number().catch(0),
  visibility: z.number(),
  wind_speed: z.number(),
  wind_gust: z.number().optional(),
  wind_deg: z.number(),
  rain: z
    .object({
      "1h": z.number().optional(),
    })
    .optional(),
  snow: z
    .object({
      "1h": z.number().optional(),
    })
    .optional(),
  weather: z.array(weatherConditionSchema),
});

const hourlyWeatherSchema = z.object({
  dt: z.number(),
  temp: z.number(),
  feels_like: z.number(),
  pressure: z.number(),
  humidity: z.number(),
  dew_point: z.number(),
  uvi: z.number().catch(0),
  clouds: z.number(),
  visibility: z.number().optional(),
  wind_speed: z.number(),
  wind_gust: z.number().optional(),
  wind_deg: z.number(),
  pop: z.number(),
  rain: z
    .object({
      "1h": z.number().optional(),
    })
    .optional(),
  snow: z
    .object({
      "1h": z.number().optional(),
    })
    .optional(),
  weather: z.array(weatherConditionSchema),
});

const dailyWeatherSchema = z.object({
  dt: z.number(),
  sunrise: z.number().optional(),
  sunset: z.number().optional(),
  moonrise: z.number(),
  moonset: z.number(),
  moon_phase: z.number(),
  summary: z.string().optional(),
  temp: z.object({
    morn: z.number(),
    day: z.number(),
    eve: z.number(),
    night: z.number(),
    min: z.number(),
    max: z.number(),
  }),
  feels_like: z.object({
    morn: z.number(),
    day: z.number(),
    eve: z.number(),
    night: z.number(),
  }),
  pressure: z.number(),
  humidity: z.number(),
  dew_point: z.number(),
  wind_speed: z.number(),
  wind_gust: z.number().optional(),
  wind_deg: z.number(),
  clouds: z.number(),
  uvi: z.number().catch(0),
  pop: z.number(),
  rain: z.number().optional(),
  snow: z.number().optional(),
  weather: z.array(weatherConditionSchema),
});

export const openWeatherMapResponseSchema = z.object({
  lat: z.number(),
  lon: z.number(),
  timezone: z.string(),
  timezone_offset: z.number(),
  current: currentWeatherSchema,
  hourly: z.array(hourlyWeatherSchema),
  daily: z.array(dailyWeatherSchema),
});

// export const openWeatherMapArraySchema = z.array(openWeatherMapResponseSchema);

export type OpenWeatherMapResponse = z.infer<
  typeof openWeatherMapResponseSchema
>;
