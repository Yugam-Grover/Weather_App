import qs from "query-string";
import {
  type OpenWeatherMapResponse,
  openWeatherMapResponseSchema,
} from "./schemas/WeatherSchema";

import type { ZodType } from "zod";

const BASE_URL = import.meta.env.VITE_BASE_URL;
const API_KEY = import.meta.env.VITE_API_KEY;

if (!BASE_URL) throw new Error("could not get BASE URL");
if (!API_KEY) throw new Error("could not get API KEY");

export async function fetcher<T>(
  endpoint: string,
  query: QueryParams,
  schema: ZodType<T>,
): Promise<T> {
  const url = qs.stringifyUrl({
    url: `${BASE_URL}/${endpoint}`,
    query: {
      ...query,
      appId: API_KEY,
    },
  });
  console.log(url);
  const response = await fetch(url);
  if (!response.ok) {
    const errorBody = await response.json().catch(() => {});
    throw new Error(
      `Api Error: ${response.status} : ${errorBody.error || response.statusText}`,
    );
  }
  const data = await response.json();

  return schema.parse(data);
}
