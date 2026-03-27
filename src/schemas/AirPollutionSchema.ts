import { z } from "zod";

export const AirPollutionSchema = z.object({
  coord: z.object({
    lat: z.number(),
    lon: z.number(),
  }),
  list: z.array(
    z.object({
      dt: z.number(), // Unix timestamp
      main: z.object({
        aqi: z.number().min(1).max(5), // 1=Good, 5=Very Poor
      }),
      components: z.object({
        co: z.number(), // Carbon monoxide (μg/m3)
        no: z.number(), // Nitrogen monoxide (μg/m3)
        no2: z.number(), // Nitrogen dioxide (μg/m3)
        o3: z.number(), // Ozone (μg/m3)
        so2: z.number(), // Sulphur dioxide (μg/m3)
        pm2_5: z.number(), // PM2.5 (μg/m3)
        pm10: z.number(), // PM10 (μg/m3)
        nh3: z.number(), // Ammonia (μg/m3)
      }),
    }),
  ),
});

// Infer the TypeScript type from the schema
export type AirPollutionData = z.infer<typeof AirPollutionSchema>;
