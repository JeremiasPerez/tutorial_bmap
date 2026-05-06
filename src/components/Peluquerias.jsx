import { MapContainer, TileLayer, GeoJSON, CircleMarker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";


export default function Peluquerias({comerciosData}) {

  return (
    <MapContainer center={[42.85, -2.68]} zoom={12} style={{ height: "500px", width: "100%" }}>
      <TileLayer attribution="&copy; OpenStreetMap" url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/>
      {comerciosData.features.filter((c) => c.properties.shop === 'hairdresser').map((h,ind) => {
        const coords = [h.geometry.coordinates[1],h.geometry.coordinates[0]]
        return <CircleMarker radius="5" key={h.properties.name+ind} center={coords}><Popup>{h.properties.name}</Popup></CircleMarker>
      })}
    </MapContainer>
  );
}