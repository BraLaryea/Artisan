import React, { useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix default marker icon issue in Leaflet
import iconUrl from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";

const defaultIcon = L.icon({
  iconUrl,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

const MapView = ({ artisans }) => {
  const mapRef = useRef();

  useEffect(() => {
    // Ensure map size is recalculated if artisans change
    if (mapRef.current) {
      mapRef.current.invalidateSize();
    }
  }, [artisans]); // Run effect when artisans change (e.g., after search)

  const defaultCenter =
    artisans.length > 0
      ? [artisans[0].latitude, artisans[0].longitude]
      : [5.6037, -0.187]; // Center map on Accra, Ghana

  return (
    <MapContainer
      center={defaultCenter}
      zoom={13}
      style={{ height: "100vh", width: "100%" }}
      whenCreated={(mapInstance) => {
        mapRef.current = mapInstance;
      }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />

      {/* Render markers for artisans */}
      {artisans.map((artisan, index) => (
        <Marker
          key={index}
          position={[artisan.latitude, artisan.longitude]}
          icon={defaultIcon}
        >
          <Popup>
            <strong>{artisan.name}</strong> <br />
            {artisan.profession} <br />
            Distance: {artisan.distance.toFixed(2)} km
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default MapView;
