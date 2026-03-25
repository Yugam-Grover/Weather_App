import DailyForecast from "./components/Card/DailyForecast";
import HourlyForecast from "./components/Card/HourlyForecast";
import CurrentWeather from "./components/Card/CurrentWeather";
import AdditionalInfo from "./components/Card/AdditionalInfo";
import Map from "./components/Map";
import { useState, type Dispatch, type SetStateAction } from "react";
import LocationDropdown from "./components/dropdowns/LocationDropdown";
import { useQuery } from "@tanstack/react-query";
import { fetcher } from "./api";
import { geoDataSchema } from "./schemas/GeoDataSchema";

// type props={
//   location: string,
//   setLocation: Dispatch<SetStateAction<string>>
// }
function App() {
  let [coordinates, setCoords] = useState<Coords>({
    lat: 55,
    lon: -0.125,
  });
  const [location, setLocation] = useState("");

  const onMapClick = (newCoords: Coords) => {
    setCoords(newCoords);
    setLocation("Custom");
  };
  const { data: geoCodeData } = useQuery({
    queryKey: ["geocode", location],
    queryFn: () =>
      fetcher(
        "geo/1.0/direct",
        {
          q: location,
          limit: 1,
        },
        geoDataSchema,
      ),
    enabled: location !== "Custom" && !!location,
  });

  const coords =
    location === "Custom"
      ? coordinates
      : { lat: geoCodeData?.[0].lat ?? 0, lon: geoCodeData?.[0].lon ?? 0 };

  return (
    <div className=" flex flex-col gap-4">
      <LocationDropdown location={location} setLocation={setLocation} />
      <Map coords={coords} onMapClick={onMapClick} />
      <CurrentWeather coords={coords} />
      <HourlyForecast coords={coords} />
      <DailyForecast coords={coords} />
      <AdditionalInfo coords={coords} />
    </div>
  );
}

export default App;
