import { useEffect, useState } from "react";
import Mapa from "./components/Mapa";
import Grafico from "./components/Grafico";
import Peluquerias from "./components/Peluquerias";
import "./app.css";

export default function App() {
  const [barriosData, setBarriosData] = useState(null);
  const [indicadoresData, setIndicadores] = useState([]);
  const [comerciosData, setComercios] = useState(null);
  const [indicadorActivo, setIndicadorActivo] = useState("renta");
  const [barrioSeleccionado, setBarrioSeleccionado] = useState(null);

  useEffect(() => {
    async function cargarDatos() {
      const [geojsonRes, indicadoresRes, comerciosRes] = await Promise.all([
        fetch("/src/data/barrios.geojson"),
        fetch("/src/data/indicadores.json"),
        fetch("/src/data/comercios_clasificados.geojson")
      ]);

      const geojson = await geojsonRes.json();
      const indicadoresData = await indicadoresRes.json();
      const comerciosD = await comerciosRes.json();

      setBarriosData(geojson);
      setIndicadores(indicadoresData);
      console.log("comercios", comerciosD.type)
      setComercios(comerciosD)
    }

    cargarDatos();
  }, []);

  return (
    <div className="app">
      <h1>Mapa interactivo de barrios</h1>

      <div className="controls">
        <label htmlFor="indicador">Indicador: </label>
        <select id="indicador" value={indicadorActivo} onChange={(e) => setIndicadorActivo(e.target.value)}>
          <option value="renta">Renta</option>
          <option value="poblacion">Población</option>
          <option value="edad_media">Edad media</option>
        </select>
      </div>

      <div className="layout">
        <div className="map-container">
            {/*barriosData && <Mapa barriosData={barriosData} indicadoresData={indicadoresData} indicadorActivo={indicadorActivo} onBarrioClick={setBarrioSeleccionado}/>*/}
            {barriosData && comerciosData && <Peluquerias comerciosData={comerciosData}></Peluquerias>}
        </div>

        <div className="chart-container">
          <Grafico barrio={barrioSeleccionado} />
        </div>
      </div>
    </div>
  );
}