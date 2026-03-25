import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import type { LeafletMouseEvent } from "leaflet";

const Map = ({ coords, onMapClick }: MapProps) => {
  return (
    <MapContainer
      center={[coords.lat, coords.lon]}
      zoom={13}
      className="w-full h-125 z-0">
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <MapCheck coords={coords} onMapClick={onMapClick} />
      <Marker position={[coords.lat, coords.lon]} />
    </MapContainer>
  );
};

function MapCheck({ coords, onMapClick }: MapProps) {
  const map = useMap();
  map.panTo([coords.lat, coords.lon]);
  useEffect(() => {
    const handleClick = (e: LeafletMouseEvent) => {
      const { lat, lng: lon } = e.latlng;
      onMapClick({ lat, lon });
    };
    map.on("click", handleClick);
    return () => {
      map.off("click", handleClick);
    };
  }, [map, onMapClick]);

  return null;
}

export default Map;
