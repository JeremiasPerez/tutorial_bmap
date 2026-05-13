import { MapContainer, TileLayer, GeoJSON, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

function getColorRenta(valor) {
  return valor > 50000 ? "green" :
         valor > 40000 ? "yellow" :
         valor > 30000 ? "orange" :
                         "red";
}

export default function PaginaMapa({barriosData}) {

  function style(feature) {
    const id = feature.properties.BARRIO;
    const valor = feature.properties.renta.familiar['2023']

    return {
      fillColor: getColorRenta(valor),
      weight: 1,
      opacity: 1,
      color: "white",
      fillOpacity: 0.7,
    };
  }

  function onEachFeature(feature, layer) {
    const id = feature.properties.BARRIO;
    const nombre = feature.properties.TEXTO;
    const r =  feature.properties.renta.familiar['2023']

    const popupContent = `
      <strong>${nombre}</strong><br/>
      Renta familiar: ${r} €<br/>`;

    layer.bindPopup(popupContent);

    layer.on({
      mouseover: (e) => {
        e.target.setStyle({
          weight: 2,
          color: "#333",
          fillOpacity: 0.9,
        });
      },
      mouseout: (e) => {
        e.target.setStyle({
          weight: 1,
          color: "white",
          fillOpacity: 0.7,
        });
      },
    });
  }

  return (
    <MapContainer center={[42.85, -2.68]} zoom={12} style={{ height: "500px", width: "100%" }}>
      <TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>' url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager_nolabels/{z}/{x}/{y}{r}.png"/>
      <GeoJSON key='rentaPersonal' data={barriosData} style={style} onEachFeature={onEachFeature}/>
    </MapContainer>
  );
}