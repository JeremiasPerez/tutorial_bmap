import { MapContainer, TileLayer, GeoJSON, CircleMarker, Popup, Marker } from "react-leaflet";
import "leaflet/dist/leaflet.css";


export default function Peluquerias({comerciosData}) {

  var peluIcon = L.icon({
      iconUrl: 'hairdresser.png',
      iconSize:     [24, 24]
  });  
  
  var panIcon = L.icon({
      iconUrl: 'bread.png',
      iconSize:     [24, 24]
  });

  var clothesIcon = L.icon({
      iconUrl: 'tshirt.png',
      iconSize:     [24, 24]
  });

  return (
    <MapContainer center={[42.85, -2.68]} zoom={12} style={{ height: "500px", width: "100%" }}>
      <TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>' url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager_nolabels/{z}/{x}/{y}{r}.png"/>
      
      {comerciosData.features.filter((c) => c.properties.id_barrio == 4 && c.properties.shop === 'clothes').map((h,ind) => {
        const coords = [h.geometry.coordinates[1],h.geometry.coordinates[0]]
        return <Marker icon={clothesIcon} key={h.properties.name+ind} position={coords}><Popup>{h.properties.name}</Popup></Marker>
      })}
      {comerciosData.features.filter((c) => c.properties.id_barrio == 4 && c.properties.shop === 'hairdresser').map((h,ind) => {
        const coords = [h.geometry.coordinates[1],h.geometry.coordinates[0]]
        return <Marker icon={peluIcon} key={h.properties.name+ind} position={coords}><Popup>{h.properties.name}</Popup></Marker>
      })}
      {comerciosData.features.filter((c) => c.properties.id_barrio == 4 && c.properties.shop === 'bakery').map((h,ind) => {
        const coords = [h.geometry.coordinates[1],h.geometry.coordinates[0]]
        return <Marker icon={panIcon} key={h.properties.name+ind} position={coords}><Popup>{h.properties.name}</Popup></Marker>
      })}
    </MapContainer>
  );
}