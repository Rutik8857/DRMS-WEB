"use client";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import { useEffect } from "react";

const fixLeafletIcons = () => {
  delete L.Icon.Default.prototype._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
    iconUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
    shadowUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  });
};

const MapComponent = ({ doctors }) => {
  useEffect(() => {
    fixLeafletIcons();
  }, []);

  const defaultCenter = [19.076, 72.8777];

  const center =
    doctors.length > 0 && doctors[0].lat && doctors[0].lng
      ? [Number(doctors[0].lat), Number(doctors[0].lng)]
      : defaultCenter;

  return (
    <MapContainer center={center} zoom={11} style={{ height: "100%", width: "100%" }}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

      {doctors.map((doc) => {
        if (!doc.lat || !doc.lng) return null;

        return (
          <Marker key={doc.id} position={[Number(doc.lat), Number(doc.lng)]}>
            <Popup>
              <div>
                <h3 className="font-bold text-sm">{doc.fullName}</h3>
                <p className="text-xs text-blue-600">{doc.specialization}</p>
                <p className="text-xs text-gray-600">🏥 {doc.clinicName}</p>
                <p className="text-xs text-gray-400">{doc.city}</p>
              </div>
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
};

export default MapComponent;
