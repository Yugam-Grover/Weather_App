import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import type { LatLngBoundsExpression, LeafletMouseEvent } from "leaflet";
import { MapStyle, MaptilerLayer } from "@maptiler/leaflet-maptilersdk";
import { useTheme } from "./ThemeProvider";
import L from "leaflet";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
delete (L.Icon.Default.prototype as L.Icon.Default & { _getIconUrl?: string })._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
});

const API_KEY = import.meta.env.VITE_API_KEY;
const MAPTILER_API_KEY = import.meta.env.VITE_MAPTILER_API_KEY;
const Map = ({ coords, onMapClick, mapType }: MapProps) => {
  const { Theme } = useTheme();
  const worldBounds: LatLngBoundsExpression = [
    [-90, -180],
    [90, 180],
  ];

  return (
    <MapContainer
      center={[coords.lat, coords.lon]}
      zoom={10}
      maxBounds={worldBounds}
      maxBoundsViscosity={1.0}
      minZoom={3}
      className="w-full h-full rounded-2xl">
      <MapCheck coords={coords} onMapClick={onMapClick} />
      <MapTilerLayering />
      {mapType !== "none" && (
        <TileLayer
          key={mapType === "clouds_new" ? `${mapType}-${Theme}` : mapType}
          opacity={Theme === "dark" ? 0.6 : 0.85}
          className={mapType === "clouds_new" ? " dark:invert-0 invert" : ""}
          url={`https://tile.openweathermap.org/map/${mapType}/{z}/{x}/{y}.png?appid=${API_KEY}`}
        />
      )}
      <Marker position={[coords.lat, coords.lon]} />
    </MapContainer>
  );
};

function MapCheck({ coords, onMapClick }: Omit<MapProps, "mapType">) {
  const map = useMap();
  useEffect(() => {
    const handleClick = (e: LeafletMouseEvent) => {
      const { lat, lng: lon } = e.latlng;
      onMapClick({ lat, lon });
    };
    map.panTo([coords.lat, coords.lon], { animate: true, duration: 0.7 });
    map.on("click", handleClick);
    return () => {
      map.off("click", handleClick);
    };
  }, [map, onMapClick, coords.lat, coords.lon]);

  return null;
}

function MapTilerLayering() {
  const map = useMap();
  const { Theme } = useTheme();
  useEffect(() => {
    const mapTiler = new MaptilerLayer({
      style:
        Theme === "dark" ? MapStyle.BACKDROP.DARK : MapStyle.BACKDROP.LIGHT,
      apiKey: MAPTILER_API_KEY,
    });
    mapTiler.addTo(map);
    return () => {
      map.removeLayer(mapTiler);
    };
  }, [map, Theme]);

  return null;
}

export default Map;
