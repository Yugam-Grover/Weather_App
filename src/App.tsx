import DailyForecast from "./components/Card/DailyForecast";
import HourlyForecast from "./components/Card/HourlyForecast";
import CurrentWeather from "./components/Card/CurrentWeather";
import AdditionalInfo from "./components/Card/AdditionalInfo";
import Map from "./components/Map";
import { useState } from "react";

function App() {
  const [coords, setCoords] = useState<Coords>({
    lat: 55,
    lon: -0.125,
  });
  const onMapClick = (newCoords: Coords) => {
    setCoords(newCoords);
  };
  return (
    <div className="flex flex-col gap-4">
      <Map coords={coords} onMapClick={onMapClick} />
      <CurrentWeather coords={coords} />
      <HourlyForecast coords={coords} />
      <DailyForecast coords={coords} />
      <AdditionalInfo coords={coords} />
    </div>
  );
}

export default App;
