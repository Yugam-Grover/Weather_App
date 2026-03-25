import { z } from "zod";

const geoLocationSchema = z.object({
  name: z.string(),
  local_names: z.record(z.string(), z.string()).optional(),
  lat: z.number(),
  lon: z.number(),
  country: z.string(),
  state: z.string().optional(),
});

// The geocoding API returns an array of results
export const geoDataSchema = z.array(geoLocationSchema);

export type GeoLocation = z.infer<typeof geoLocationSchema>;
export type GeoData = z.infer<typeof geoDataSchema>;
