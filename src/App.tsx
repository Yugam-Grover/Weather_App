import DailyForecast from "./components/Card/DailyForecast";
import HourlyForecast from "./components/Card/HourlyForecast";
import CurrentWeather from "./components/Card/CurrentWeather";
import AdditionalInfo from "./components/Card/AdditionalInfo";
import Map from "./components/Map";
import { Suspense, useState, type Dispatch, type SetStateAction } from "react";
import LocationDropdown from "./components/dropdowns/LocationDropdown";
import { useQuery } from "@tanstack/react-query";
import { fetcher } from "./api";
import { geoDataSchema } from "./schemas/GeoDataSchema";
import MapTypeDropdown from "./components/dropdowns/MapTypeDropdown";
import MapLegend from "./components/MapLegend";
import AddtionalInfoSkeleton from "./components/skeletons/AddtionalInfoSkeleton";
import CurrentSkeleton from "./components/skeletons/CurrentSkeleton";
import DailySkeleton from "./components/skeletons/DailySkeleton";
import HourlySkeleton from "./components/skeletons/HourlySkeleton";

// type props={
//   location: string,
//   setLocation: Dispatch<SetStateAction<string>>
// }
function App() {
  let [coordinates, setCoords] = useState<Coords>({
    lat: 51.5074,
    lon: -0.1278,
  });
  const [location, setLocation] = useState("london");
  const [mapType, setMapType] = useState("clouds_new");

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
      <div className="flex gap-8">
        <LocationDropdown location={location} setLocation={setLocation} />
        <MapTypeDropdown MapType={mapType} setMapType={setMapType} />
      </div>
      <div className="relative">
        <MapLegend mapType={mapType} />
        <Map coords={coords} onMapClick={onMapClick} mapType={mapType} />
      </div>
      <Suspense fallback={<CurrentSkeleton />}>
        <CurrentWeather coords={coords} />
      </Suspense>

      <Suspense fallback={<HourlySkeleton />}>
        <HourlyForecast coords={coords} />
      </Suspense>

      <Suspense fallback={<DailySkeleton />}>
        <DailyForecast coords={coords} />
      </Suspense>

      <Suspense fallback={<AddtionalInfoSkeleton />}>
        <AdditionalInfo coords={coords} />
      </Suspense>
    </div>
  );
}

export default App;
