import fs from "fs";

const comercios = JSON.parse(
  fs.readFileSync("./data/servicios_clasificados.geojson", "utf8")
);

const clasificacion = comercios.features.reduce((acc, c) => {
  const el = acc.find((a) => a.type == c.properties.amenity)
  if (el == null) acc.push({type: c.properties.amenity, amount: 1})
  else el.amount++
  return acc
}, [])

clasificacion.sort((c1,c2) => c2.amount - c1.amount)
console.log(clasificacion)