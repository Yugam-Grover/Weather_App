type QueryParams = Record<string, string | number | boolean | undefined>;

type Coords = {
  lat: number;
  lon: number;
};

interface BaseWeatherProps {
  coords: Coords;
}

interface MapProps extends BaseWeatherProps {
  onMapClick: (newCoords: Coords) => void;
}
