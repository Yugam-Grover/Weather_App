import { lazy } from "react";
import { Suspense, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Menu } from "lucide-react";
import { ErrorBoundary } from "react-error-boundary";

import { fetcher } from "./api";

import DailyForecast from "./components/Card/DailyForecast";
import HourlyForecast from "./components/Card/HourlyForecast";
import CurrentWeather from "./components/Card/CurrentWeather";
import AdditionalInfo from "./components/Card/AdditionalInfo";
import LocationDropdown from "./components/dropdowns/LocationDropdown";
import { geoDataSchema } from "./schemas/GeoDataSchema";
import MapTypeDropdown from "./components/dropdowns/MapTypeDropdown";
import MapLegend from "./components/MapLegend";
import AddtionalInfoSkeleton from "./components/skeletons/AddtionalInfoSkeleton";
import CurrentSkeleton from "./components/skeletons/CurrentSkeleton";
import DailySkeleton from "./components/skeletons/DailySkeleton";
import HourlySkeleton from "./components/skeletons/HourlySkeleton";
import SidePanel from "./components/SidePanel";
import MobileHeader from "./components/MobileHeader";
import DarkLightToggle from "./components/DarkLightToggle";
import Card from "./components/Card/Card";
const Map = lazy(() => import("./components/Map"));

function App() {
  const [coordinates, setCoords] = useState<Coords>({
    lat: 51.5074,
    lon: -0.1278,
  });
  const [location, setLocation] = useState("London");
  const [mapType, setMapType] = useState("none");
  const [sidePanelOpen, setSidePanelOpen] = useState(false);

  const onMapClick = (newCoords: Coords) => {
    setCoords(newCoords);
    setLocation("Custom");
  };
  const { data: geoCodeData, isLoading } = useQuery({
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
      <MobileHeader setSidePanelOpen={setSidePanelOpen} />
      <div className=" flex flex-col gap-4 p-6 w-full lg:w-[calc(100vw-var(--sidebar-width))] 2xl:h-screen 2xl:min-h-300 overflow-x-hidden">
        <div className="flex flex-col gap-3 pb-4 xs:flex-row xs:gap-8 last:align-bottom">
          <div className="flex flex-col gap-2 md:flex-row md:gap-4">
            <h2 className="p-1.5">Location:</h2>
            <LocationDropdown location={location} setLocation={setLocation} />
          </div>
          <div className="flex flex-col gap-2 md:flex-row md:gap-4">
            <h2 className="p-1.5 whitespace-nowrap">Map Type:</h2>
            <MapTypeDropdown MapType={mapType} setMapType={setMapType} />
          </div>
          <div className="flex gap-6 ml-auto mr-5 items-center">
            <div className="hidden xs:block">
              <DarkLightToggle />
            </div>
            <button
              aria-label="Open mobile menu"
              className="hidden xs:block hover:cursor-pointer lg:hidden"
              onClick={() => setSidePanelOpen(true)}>
              <Menu className="size-5" />
            </button>
          </div>
        </div>
        {isLoading ? (
          <div className="flex flex-1 items-center justify-center text-xl text-gray-400 font-semibold h-full">
            Loading location data...
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 2xl:grid-cols-4 2xl:grid-rows-4 2xl:flex-1 2xl:min-h-0">
            <div className="relative z-0 md:col-span-2 2xl:col-span-4 2xl:row-span-2 h-125 2xl:h-auto order-1">
              <MapLegend mapType={mapType} />
              <Suspense
                fallback={
                  <div className="w-full h-full bg-white/5 rounded-2xl animate-pulse" />
                }>
                <Map
                  coords={coords}
                  onMapClick={onMapClick}
                  mapType={mapType}
                />
              </Suspense>
            </div>

            <div className="col-span-1 order-2 2xl:row-span-2">
              <ErrorBoundary
                fallback={
                  <Card className="flex items-center justify-center text-red-500/80 bg-white/60 dark:bg-white/5 border border-slate-200 dark:border-white/10">
                    <p className="font-medium">Failed to load data.</p>
                  </Card>
                }>
                <Suspense fallback={<CurrentSkeleton />}>
                  <CurrentWeather coords={coords} />
                </Suspense>
              </ErrorBoundary>
            </div>

            <div className="col-span-1 order-3 2xl:order-4 2xl:row-span-2">
              <ErrorBoundary
                fallback={
                  <Card className="flex items-center justify-center text-red-500/80 bg-white/60 dark:bg-white/5 border border-slate-200 dark:border-white/10">
                    <p className="font-medium">Failed to load data.</p>
                  </Card>
                }>
                <Suspense fallback={<DailySkeleton />}>
                  <DailyForecast coords={coords} />
                </Suspense>
              </ErrorBoundary>
            </div>

            <div className="col-span-1 md:col-span-2 order-4 2xl:order-3 2xl:row-span-1">
              <ErrorBoundary
                fallback={
                  <Card className="flex items-center justify-center text-red-500/80 bg-white/60 dark:bg-white/5 border border-slate-200 dark:border-white/10">
                    <p className="font-medium">Failed to load data.</p>
                  </Card>
                }>
                <Suspense fallback={<HourlySkeleton />}>
                  <HourlyForecast coords={coords} />
                </Suspense>
              </ErrorBoundary>
            </div>

            <div className="col-span-1 md:col-span-2 order-5 2xl:row-span-1">
              <ErrorBoundary
                fallback={
                  <Card className="flex items-center justify-center text-red-500/80 bg-white/60 dark:bg-white/5 border border-slate-200 dark:border-white/10">
                    <p className="font-medium">Failed to load data.</p>
                  </Card>
                }>
                <Suspense fallback={<AddtionalInfoSkeleton />}>
                  <AdditionalInfo coords={coords} />
                </Suspense>
              </ErrorBoundary>
            </div>
          </div>
        )}
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
