import React, { useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix default marker icon issue in Leaflet
import iconUrl from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";
import { Link } from "react-router-dom";

const defaultIcon = L.icon({
  iconUrl,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

const MapView = ({ artisans, currentPosition }) => {
  const mapRef = useRef();

  useEffect(() => {
    // Ensure map size is recalculated if artisans change
    if (mapRef.current) {
      mapRef.current.invalidateSize();
    }
  }, [artisans]); // Run effect when artisans change (e.g., after search)

  const defaultCenter = [currentPosition.latitude, currentPosition.longitude];
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
            <Link to={"/artisan/" + artisan.id}>
              <div style={{ color: "black" }}>
                <strong>{artisan.name}</strong> <br />
                <br />
                Profession: <b>{artisan.skill}</b> <br />
                Distance from you: <b>{artisan.distance.toFixed(2)}km</b>
              </div>
            </Link>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default MapView;
