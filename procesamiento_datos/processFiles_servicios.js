import fs from "fs";
import booleanPointInPolygon from "@turf/boolean-point-in-polygon";
import pointOnFeature from "@turf/point-on-feature";

// Leer ficheros
const comercios = JSON.parse(
  fs.readFileSync("./data/servicios.geojson", "utf8")
);

const barrios = JSON.parse(
  fs.readFileSync("./data/barrios.geojson", "utf8")
);

function obtenerPuntoRepresentativo(feature) {
  if (feature.geometry?.type === "Point") {
    return feature;
  }

  if (
    feature.geometry?.type === "Polygon" ||
    feature.geometry?.type === "MultiPolygon"
  ) {
    return pointOnFeature(feature);
  }

  return null;
}

// Clasificar comercios
const comerciosClasificados = {
  type: "FeatureCollection",
  features: comercios.features.map((comercio) => {
    const puntoComercio = obtenerPuntoRepresentativo(comercio);

    if (!puntoComercio) {
      console.warn("Geometría no soportada:", comercio.geometry?.type);
      return {
        ...comercio,
        properties: {
          ...comercio.properties,
          barrio_id: null,
          barrio_nombre: null,
        },
      };
    }

    const barrio = barrios.features.find((barrio) =>
      booleanPointInPolygon(puntoComercio, barrio)
    );


    return {
        type: 'Feature',
        properties: {
            name: comercio.properties?.name ?? null,
            amenity: comercio.properties?.amenity ?? null,
            id_barrio: barrio?.properties.BARRIO ?? null
        },
        geometry: {
            type: 'Point',
            coordinates: puntoComercio.geometry.coordinates
        }
    }
  }),
};

// Guardar resultado
fs.writeFileSync(
  "./data/servicios_clasificados.geojson",
  JSON.stringify(comerciosClasificados, null, 2),
  "utf8"
);

console.log("GeoJSON generado correctamente");