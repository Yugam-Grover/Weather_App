import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import type { LatLngBoundsExpression, LeafletMouseEvent } from "leaflet";
import { MapStyle, MaptilerLayer } from "@maptiler/leaflet-maptilersdk";

const API_KEY = import.meta.env.VITE_API_KEY;
const MAPTILER_API_KEY = import.meta.env.MAPTILER_API_KEY;
const Map = ({ coords, onMapClick, mapType }: MapProps) => {
  const worldBounds: LatLngBoundsExpression = [
    [-90, -180], // Bottom-Left (South Pole / Date Line)
    [90, 180], // Top-Right (North Pole / Date Line)
  ];

  return (
    <MapContainer
      center={[coords.lat, coords.lon]}
      zoom={10}
      maxBounds={worldBounds}
      maxBoundsViscosity={1.0}
      minZoom={3}
      className="w-full h-125 z-0 rounded-2xl">
      <MapCheck coords={coords} onMapClick={onMapClick} />
      <MapTilerLayering />
      <TileLayer
        opacity={0.6}
        zoomOffset={-1}
        url={`https://tile.openweathermap.org/map/${mapType}/{z}/{x}/{y}.png?appid=${API_KEY}`}
      />
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
    map.panTo([coords.lat, coords.lon], { animate: true, duration: 1 });
    map.on("click", handleClick);
    return () => {
      map.off("click", handleClick);
    };
  }, [map, onMapClick]);

  return null;
}

function MapTilerLayering() {
  const map = useMap();
  useEffect(() => {
    const mapTiler = new MaptilerLayer({
      style: MapStyle.BACKDROP.DARK,
      apiKey: MAPTILER_API_KEY,
    });
    mapTiler.addTo(map);
    return () => {
      map.removeLayer(mapTiler);
    };
  }, [map]);

  return null;
}

export default Map;
