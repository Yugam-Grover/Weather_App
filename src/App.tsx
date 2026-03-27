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
import SidePanel from "./components/SidePanel";
import { Menu } from "lucide-react";
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
  const [sidePanelOpen, setSidePanelOpen] = useState(false);

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
    <>
      <div className=" flex flex-col gap-4 p-6 w-full lg:w-[calc(100vw-var(--sidebar-width))]">
        <div className="flex gap-8">
          <div className="flex gap-2">
            <h2 className="p-1.5">Location:</h2>
            <LocationDropdown location={location} setLocation={setLocation} />
          </div>
          <div className="flex gap-2">
            <h2 className="p-1.5">Map Type:</h2>
            <MapTypeDropdown MapType={mapType} setMapType={setMapType} />
          </div>

          <button
            className="hover:cursor-pointer lg:hidden"
            onClick={() => setSidePanelOpen(true)}>
            <Menu className="size-5 " />
          </button>
        </div>
        <div className="relative z-0">
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
      <SidePanel
        coords={coords}
        sidePanelOpen={sidePanelOpen}
        setSidePanelOpen={setSidePanelOpen}
      />
    </>
  );
}

export default App;
