import { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  CircleMarker,
  Popup,
  Polyline,
  useMap,
  useMapEvents,
} from "react-leaflet";
import { LocateFixed } from "lucide-react";
import { useTranslation } from "react-i18next";
import type { Tur } from "../data/turer";
import "leaflet/dist/leaflet.css";
type Point = [number, number];
function Events({
  drawing,
  onPoint,
}: {
  drawing: boolean;
  onPoint?: (p: Point) => void;
}) {
  useMapEvents({
    click: (e) => {
      if (drawing) onPoint?.([e.latlng.lat, e.latlng.lng]);
    },
  });
  return null;
}
function Bounds({ items, points }: { items: Tur[]; points: Point[] }) {
  const map = useMap();
  useEffect(() => {
    const coords = points.length
      ? points
      : items.map((i) => [i.lat, i.lng] as Point);
    if (coords.length)
      map.fitBounds(coords, { padding: [40, 40], maxZoom: 12 });
  }, [items, points, map]);
  return null;
}
function Position({ point }: { point: Point | null }) {
  const map = useMap();
  useEffect(() => {
    if (point) map.setView(point, 14);
  }, [point, map]);
  return point ? (
    <CircleMarker
      center={point}
      radius={9}
      pathOptions={{ color: "#fff", fillColor: "#2469dc", fillOpacity: 1 }}
    >
      <Popup>GPS</Popup>
    </CircleMarker>
  ) : null;
}
export default function MapView({
  items,
  onSelect,
  points = [],
  drawing = false,
  onPoint,
}: {
  items: Tur[];
  onSelect: (t: Tur) => void;
  points?: Point[];
  drawing?: boolean;
  onPoint?: (p: Point) => void;
}) {
  const { t } = useTranslation();
  const [position, setPosition] = useState<Point | null>(null);
  const [error, setError] = useState(false);
  return (
    <div className="map-wrap">
      <MapContainer center={[61.1, 9]} zoom={6} scrollWheelZoom className="map">
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Bounds items={items} points={points} />
        <Events drawing={drawing} onPoint={onPoint} />
        <Position point={position} />
        {items.map((item) => (
          <CircleMarker
            key={item.id}
            center={[item.lat, item.lng]}
            radius={10}
            pathOptions={{
              color: "#fff",
              weight: 3,
              fillColor:
                item.category === "cabins"
                  ? "#b87032"
                  : item.category === "groups"
                    ? "#7752a4"
                    : "#256b4b",
              fillOpacity: 1,
            }}
          >
            <Popup>
              <strong>{item.tittel}</strong>
              <p>{item.omrade}</p>
              <button onClick={() => onSelect(item)}>{t("details")}</button>
            </Popup>
          </CircleMarker>
        ))}
        {points.length > 1 && (
          <Polyline
            positions={points}
            pathOptions={{ color: "#e87932", weight: 5 }}
          />
        )}
        {points.map((p, i) => (
          <CircleMarker key={i} center={p} radius={4} />
        ))}
      </MapContainer>
      <button
        className="gps"
        onClick={() => {
          if (!navigator.geolocation) {
            setError(true);
            return;
          }
          navigator.geolocation.getCurrentPosition(
            (p) => {
              setPosition([p.coords.latitude, p.coords.longitude]);
              setError(false);
            },
            () => setError(true),
            { enableHighAccuracy: true, timeout: 10000 },
          );
        }}
      >
        <LocateFixed size={18} />
        {t("locate")}
      </button>
      {error && (
        <p role="alert" className="map-error">
          {t("gpsError")}
        </p>
      )}
    </div>
  );
}
